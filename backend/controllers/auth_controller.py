from fastapi import  APIRouter, Depends, HTTPException
from backend.services.auth_service import validate_user_credentials
from backend.database import get_db
from backend.dependencies import create_access_token, decode_activation_token
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from backend.services.auth_service import register_user_service
from backend.schemas.usuarios_schema import UsuarioCreate

router= APIRouter(prefix="/auth", tags=["Auth"])



@router.post("/register")
async def register(usuario: UsuarioCreate, db: AsyncSession = Depends(get_db)):
    nuevo_usuario = await register_user_service(db=db, usuario=usuario)
    return nuevo_usuario

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user_data = await validate_user_credentials(db=db, email=form_data.username, password=form_data.password)
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    
    return {
        "access_token": user_data["access_token"],
        "refresh_token": user_data["refresh_token"],
        "token_type": "bearer"
    }

@router.post("/refresh")
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    payload = decode_activation_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token de refresco inválido o expirado")
    
    usuario_id = payload.get("sub")
    rol = payload.get("rol")
    
    nuevo_access_token = create_access_token(data={"sub": usuario_id, "rol": rol})
    
    return {
        "access_token": nuevo_access_token,
        "token_type": "bearer"
    }
