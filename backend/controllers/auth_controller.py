from fastapi import  APIRouter, Depends, HTTPException, status
from backend.services.auth_service import validate_user_credentials
from backend.database import get_db
from backend.dependencies import create_access_token, decode_activation_token
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from backend.services.auth_service import register_user_service
from backend.schemas.usuarios_schema import UsuarioCreate
from backend.exceptions.usuarios_exceptions import EmailAlreadyRegisteredError, UserNotFoundError, InvalidCredentialsError, UserInactiveError
from backend.schemas.usuarios_schema import UsuarioCreate, UsuarioResponse
from backend.schemas.auth_schema import LoginResponse

router= APIRouter(prefix="/auth", tags=["Auth"])



@router.post("/register", response_model=UsuarioResponse)
async def register(usuario: UsuarioCreate, db: AsyncSession = Depends(get_db)):
    try:
        nuevo_usuario = await register_user_service(db=db, usuario=usuario)
        return nuevo_usuario
    except EmailAlreadyRegisteredError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    

@router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    try:
        return await validate_user_credentials(db=db, email=form_data.username, password=form_data.password)
        
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except UserInactiveError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
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
