from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.services.usuarios_service import get_usuario_by_id_service
from .config import settings
from datetime import datetime,timedelta, timezone
from backend.models.usuarios_model import Usuario
from passlib.context import CryptContext

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], 
    default="argon2", 
    deprecated="auto"
)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])
    
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def create_refresh_token(user_id: int, rol: str): 
    payload = {
        "sub": str(user_id),
        "rol": rol,
        "exp": datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS) 
    }
    return jwt.encode(payload, key=settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def decode_activation_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("sub") is None:
            return None
        return payload
    except JWTError:
        return None

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
        usuario_id_str: str = payload.get("sub")
        
        if usuario_id_str is None:
            raise credentials_exception
        usuario_id = int(usuario_id_str)
    except (JWTError, ValueError):
        raise credentials_exception

    usuario = await get_usuario_by_id_service(db, usuario_id=usuario_id)
    if usuario is None:
        raise credentials_exception
    
    return usuario

async def get_current_active_user(
    current_user = Depends(get_current_user)
) -> Usuario:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user

async def get_current_complete_user(
    current_user = Depends(get_current_active_user)
) -> Usuario:
    if not current_user.is_profile_complete:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Perfil incompleto. Por favor finalice su registro."
        )
    return current_user



async def permitir_lectura(
    cliente_id: int, 
    current_user: Usuario = Depends(get_current_user)
):
    """
    Permite el paso si el usuario es el dueño de la información 
    O si tiene el rol de profesional.
    """
    if current_user.rol == "profesional" or current_user.id == cliente_id:
        return current_user
    
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, 
        detail="No tienes permiso para ver esta información."
    )

async def solo_profesional(current_user = Depends(get_current_user)):
    if current_user.rol != "profesional":
        raise HTTPException(status_code=403, detail="Solo los profesionales pueden realizar esta acción.")
    return current_user

# @router.get("/{cliente_id}")
# async def leer_objetivos(cliente_id: int, user = Depends(permitir_lectura)):
#     # El cliente o el pro pueden entrar aquí
#     return await objetivo_service.get_all_by_cliente_service(db, cliente_id)

# @router.post("/{cliente_id}")
# async def crear_objetivo(cliente_id: int, user = Depends(solo_profesional)):
#     # Si llega aquí, es profesional SI O SI.
#     # Pero ojo: el profesional está creando un objetivo para un 'cliente_id' específico.
#     return await objetivo_service.create_objetivo_service(db, objetivo_in, cliente_id)