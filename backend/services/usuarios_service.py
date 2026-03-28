from sqlalchemy.ext.asyncio import AsyncSession
from backend.dao.usuarios_dao import UsuarioDAO
from backend.models.usuarios_model import Usuario
from backend.schemas.usuarios_schema import UsuarioCreate, UsuarioUpdate
from backend.exceptions.usuarios_exceptions import (
    UserNotFoundError, 
    EmailAlreadyRegisteredError
)

async def get_usuarios_service(db: AsyncSession):
    return await UsuarioDAO.get_all(db=db)

async def get_usuario_by_id_service(db: AsyncSession, usuario_id: int):
    usuario = await UsuarioDAO.get_by_id(db=db, usuario_id=usuario_id)
    if not usuario:
        raise UserNotFoundError(user_id=usuario_id)
    return usuario

async def create_usuario_service(db: AsyncSession, usuario_data: UsuarioCreate):
    existe = await UsuarioDAO.get_by_email(db=db, email=usuario_data.email)
    if existe:
        raise EmailAlreadyRegisteredError(usuario_data.email)
    
    try:
        user_created = await UsuarioDAO.create(db=db, usuario=usuario_data.model_dump())
        await db.commit()
        await db.refresh(user_created)
        return user_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_usuario_service(db: AsyncSession, usuario_id: int, datos_nuevos: UsuarioUpdate):
    usuario_db = await UsuarioDAO.get_by_id(db, usuario_id)
    if not usuario_db:
        raise UserNotFoundError(user_id=usuario_id)

    update_data = datos_nuevos.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"] != usuario_db.email:
        email_ocupado = await UsuarioDAO.get_by_email(db, update_data["email"])
        if email_ocupado:
            raise EmailAlreadyRegisteredError(update_data["email"])

    try:
        await UsuarioDAO.update(db, usuario_db, update_data)
        await db.commit()
        await db.refresh(usuario_db)
        return usuario_db
    except Exception as e:
        await db.rollback()
        raise e

async def delete_usuario_service(db: AsyncSession, usuario_id: int):
    usuario_db = await UsuarioDAO.get_by_id(db=db, usuario_id=usuario_id)
    if not usuario_db:
        raise UserNotFoundError(user_id=usuario_id)
    
    try:
        await UsuarioDAO.delete(db=db, usuario_db=usuario_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e