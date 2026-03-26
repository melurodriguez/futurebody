from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.database import get_db
from futurebody.backend.services.usuarios_service import get_usuario_by_id_service
from .config import settings
from datetime import datetime,timedelta, timezone
from futurebody.backend.models.usuarios_model import Usuario

# Configuración de OAuth2 (el endpoint donde el cliente pide el token)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # Firmar el token con la clave y algoritmo del .env
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db)
) -> Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        usuario_id: int = payload.get("sub")
        if usuario_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    usuario = await get_usuario_by_id_service(db, usuario_id=usuario_id)
    if usuario is None:
        raise credentials_exception
    
    return usuario

async def get_current_active_user(
    current_user = Depends(get_current_user)
) -> Usuario:
    # 3. Validar el campo booleano que agregamos
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user

async def get_current_complete_user(
    current_user = Depends(get_current_active_user)
) -> Usuario:
    # 4. Validar si terminó el registro (is_profile_complete)
    if not current_user.is_profile_complete:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Perfil incompleto. Por favor finalice su registro."
        )
    return current_user



async def verificar_propiedad_recurso(
    id_recurso_propietario: int, 
    current_user = Depends(get_current_user)
):
    if current_user.rol != "profesional" and current_user.id != id_recurso_propietario:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para acceder a este recurso."
        )
    return current_user

