from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.dao.mediciones_dao import MedicionDAO
from futurebody.backend.models.mediciones_model import Medicion
from futurebody.backend.schemas.mediciones_schema import MedicionCreate, MedicionUpdate

async def get_medicions_service(db:AsyncSession,  cliente_id: int):
    try:
        return await MedicionDAO.get_all(db=db, cliente_id=cliente_id)
    except Exception as e:
        raise e
    
async def get_medicion_by_id_service(db:AsyncSession, medicion_id:int,  cliente_id: int):
    try:
        return await MedicionDAO.get_by_id(db=db, medicion_id=medicion_id, cliente_id=cliente_id)
    except Exception as e:
        raise e
    
async def create_medicion_service(db: AsyncSession, cliente_id: int, medicion_data: MedicionCreate):
    try:
        medicion_created= await MedicionDAO.create(db=db, data=medicion_data.model_dump())
        await db.commit()
        await db.refresh(medicion_created)
        return medicion_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_medicion_service(db: AsyncSession, medicion_id: int, cliente_id: int, datos_nuevos: MedicionUpdate):

    medicion_db = await MedicionDAO.get_by_id(db=db, medicion_id=medicion_id, cliente_id=cliente_id)
    if not medicion_db:
        raise Exception("medicion no encontrado")


    update_data = datos_nuevos.model_dump(exclude_unset=True)

    try:
        await MedicionDAO.update(db, medicion_db, update_data)
        await db.commit()
        await db.refresh(medicion_db)
        return medicion_db
    except Exception as e:
        await db.rollback()
        raise e
    

async def delete_medicion_service(db:AsyncSession,  cliente_id: int, medicion_id:int):
   
    medicion_db=await MedicionDAO.get_by_id(db=db, medicion_id=medicion_id, cliente_id=cliente_id)

    if not medicion_db:
        raise Exception("medicion no encontrado")
    
    try:
        await MedicionDAO.delete(db=db, medicion_db=medicion_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e