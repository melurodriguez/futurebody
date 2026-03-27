from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.dao.disponibilidad_dao import DisponibilidadDAO
from futurebody.backend.models.disponibilidad_model import Disponibilidad
from futurebody.backend.schemas.disponibilidad_schema import DisponibilidadCreate, DisponibilidadUpdate

async def get_disponibilidads_service(db:AsyncSession,  cliente_id: int):
    try:
        return await DisponibilidadDAO.get_all(db=db, cliente_id=cliente_id)
    except Exception as e:
        raise e
    
async def get_disponibilidad_by_id_service(db:AsyncSession, disponibilidad_id:int,  cliente_id: int):
    try:
        return await DisponibilidadDAO.get_by_id(db=db, disponibilidad_id=disponibilidad_id, cliente_id=cliente_id)
    except Exception as e:
        raise e
    
async def create_disponibilidad_service(db: AsyncSession, cliente_id: int, disponibilidad_data: DisponibilidadCreate):
    try:
        disponibilidad_created= await DisponibilidadDAO.create(db=db, data=disponibilidad_data.model_dump())
        await db.commit()
        await db.refresh(disponibilidad_created)
        return disponibilidad_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_disponibilidad_service(db: AsyncSession, disponibilidad_id: int, cliente_id: int, datos_nuevos: DisponibilidadUpdate):

    disponibilidad_db = await DisponibilidadDAO.get_by_id(db=db, disponibilidad_id=disponibilidad_id, cliente_id=cliente_id)
    if not disponibilidad_db:
        raise Exception("disponibilidad no encontrado")


    update_data = datos_nuevos.model_dump(exclude_unset=True)

    try:
        await DisponibilidadDAO.update(db, disponibilidad_db, update_data)
        await db.commit()
        await db.refresh(disponibilidad_db)
        return disponibilidad_db
    except Exception as e:
        await db.rollback()
        raise e
    

async def delete_disponibilidad_service(db:AsyncSession,  cliente_id: int, disponibilidad_id:int):
   
    disponibilidad_db=await DisponibilidadDAO.get_by_id(db=db, disponibilidad_id=disponibilidad_id, cliente_id=cliente_id)

    if not disponibilidad_db:
        raise Exception("disponibilidad no encontrado")
    
    try:
        await DisponibilidadDAO.delete(db=db, disponibilidad_db=disponibilidad_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e