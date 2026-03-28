from backend.dao.usuarios_dao import UsuarioDAO
from sqlalchemy.ext.asyncio import AsyncSession
from backend.dependencies import verify_password, create_access_token, create_refresh_token, hash_password
from fastapi import HTTPException
from backend.schemas.usuarios_schema import UsuarioCreate, UsuarioUpdate
from backend.dao.usuarios_dao import UsuarioDAO
from backend.models.usuarios_model import Usuario

async def validate_user_credentials(email: str, password: str, db: AsyncSession):
    user = await UsuarioDAO.get_by_email(db=db, email=email)

    if not user or not verify_password(password, user.password):
        return None
    
    if not user.is_active:
        raise HTTPException(
            status_code=403, 
            detail="Tu cuenta aún no ha sido activada. Revisa tu correo o contacta al admin."
        )
    
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
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    

    user_data = usuario.model_dump(exclude={"password"})
    user_data["contrasenia"] = hash_password(usuario.password)
    
    nuevo_usuario_model = Usuario(**user_data)
    
    try:
        nuevo_usuario = await UsuarioDAO.create(db=db, usuario=nuevo_usuario_model)
        await db.commit()
        await db.refresh(nuevo_usuario)
        return nuevo_usuario
    except Exception as e:
        await db.rollback()
        raise e


    