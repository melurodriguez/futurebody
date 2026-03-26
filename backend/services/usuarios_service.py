from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.dao.usuarios_dao import UsuarioDAO
from futurebody.backend.models.usuarios_model import Usuario
from futurebody.backend.schemas.usuarios_schema import UsuarioCreate, UsuarioUpdate

async def get_usuarios_service(db:AsyncSession):
    try:
        return await UsuarioDAO.get_all(db=db)
    except Exception as e:
        raise e
    
async def get_usuario_by_id_service(db:AsyncSession, usuario_id:int):
    try:
        return await UsuarioDAO.get_by_id(db=db, usuario_id=usuario_id)
    except Exception as e:
        raise e
    
async def create_usuario_service(db: AsyncSession, usuario_data: UsuarioCreate):
    try:
        user_created= await UsuarioDAO.create(db=db, data=usuario_data.model_dump())
        await db.commit()
        await db.refresh(user_created)
        return user_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_usuario_service(db: AsyncSession, usuario_id: int, datos_nuevos: UsuarioUpdate):

    usuario_db = await UsuarioDAO.get_by_id(db, usuario_id)
    if not usuario_db:
        raise Exception("Usuario no encontrado")


    update_data = datos_nuevos.model_dump(exclude_unset=True)

    try:
        await UsuarioDAO.update(db, usuario_db, update_data)
        await db.commit()
        await db.refresh(usuario_db)
        return usuario_db
    except Exception as e:
        await db.rollback()
        raise e
    

async def delete_usuario_service(db:AsyncSession, usuario_id:int):
   
    usuario_db=await UsuarioDAO.get_by_id(db=db, usuario_id=usuario_id)

    if not usuario_db:
        raise Exception("Usuario no encontrado")
    
    try:
        await UsuarioDAO.delete(db=db, usuario_db=usuario_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e