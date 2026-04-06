from backend.dao.usuarios_dao import UsuarioDAO
from sqlalchemy.ext.asyncio import AsyncSession
from backend.dependencies import verify_password, create_access_token, create_refresh_token, hash_password
from fastapi import HTTPException
from backend.schemas.usuarios_schema import UsuarioCreate, UsuarioUpdate
from backend.dao.usuarios_dao import UsuarioDAO
from backend.models.usuarios_model import Usuario
from backend.exceptions.usuarios_exceptions import EmailAlreadyRegisteredError, UserNotFoundError, InvalidCredentialsError, UserInactiveError

async def validate_user_credentials( db: AsyncSession, email: str, password: str):
    print(f"DEBUG: Buscando usuario con email: '{email}'") # Mira esto en tu consola
    user = await UsuarioDAO.get_by_email(db=db, email=email)
    if not user:
        raise UserNotFoundError()
    
    print(f"DEBUG: Password hash in DB for {email} is: '{user.password}'")
    if not verify_password(password, user.password):
        raise InvalidCredentialsError()
    
    if not user.is_active:
        raise UserInactiveError()
    
    access_token = create_access_token(data={"sub": user.id, "rol": user.rol})
    refresh_token = create_refresh_token(user_id=user.id, rol=user.rol)

    return {
        "user": user,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

async def register_user_service(db: AsyncSession, usuario: UsuarioCreate):
    existe = await UsuarioDAO.get_by_email(db=db, email=usuario.email)
    if existe:
        raise EmailAlreadyRegisteredError(email=usuario.email)
    
    hashed = hash_password(usuario.password) 
    print(f"DEBUG: Generando hash para el nuevo usuario: {hashed}")

    user_data = usuario.model_dump(exclude={"password"})
    user_data["password"] = hashed

    
    try:
        nuevo_usuario = await UsuarioDAO.create(db=db, usuario=user_data)
        await db.commit()
        await db.refresh(nuevo_usuario)
        return nuevo_usuario
    except Exception as e:
        await db.rollback()
        raise e


    