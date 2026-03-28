from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.dao.mediciones_dao import MedicionDAO
from futurebody.backend.schemas.mediciones_schema import MedicionCreate, MedicionUpdate
from futurebody.backend.exceptions.mediciones_exceptions import MedicionNotFoundError
from futurebody.backend.exceptions.clientes_exceptions import ClienteNotFoundError
from futurebody.backend.dao.clientes_dao import ClienteDAO
from futurebody.backend.exceptions.auth_exceptions import UnauthorizedError


async def get_medicions_service(db: AsyncSession, cliente_id: int):
    return await MedicionDAO.get_all(db=db, cliente_id=cliente_id)
    
async def get_medicion_by_id_service(db: AsyncSession, medicion_id: int, cliente_id: int):
    medicion = await MedicionDAO.get_by_id(db=db, medicion_id=medicion_id, cliente_id=cliente_id)
    if not medicion:
        raise MedicionNotFoundError(medicion_id=medicion_id)
    return medicion
    
async def create_medicion_service(db: AsyncSession, cliente_id: int, es_profesional:bool,medicion_data: MedicionCreate):

    if not es_profesional:
        raise UnauthorizedError("Solo un profesional puede registrar nuevas mediciones.")

    cliente=await ClienteDAO.get_by_id(db=db, cliente_id=cliente_id)
    if not cliente:
        raise ClienteNotFoundError(cliente_id=cliente_id)
    
    try:
        medicion_created = await MedicionDAO.create(
            db=db, 
            cliente_id=cliente_id, 
            data=medicion_data.model_dump()
        )
        await db.commit()
        await db.refresh(medicion_created)
        return medicion_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_medicion_service(db: AsyncSession, medicion_id: int, cliente_id: int, es_profesional:bool,datos_nuevos: MedicionUpdate):

    if not es_profesional:
        raise UnauthorizedError("Solo un profesional puede registrar nuevas mediciones.")

    medicion_db = await MedicionDAO.get_by_id(db=db, medicion_id=medicion_id, cliente_id=cliente_id)
    if not medicion_db:
        raise MedicionNotFoundError(medicion_id=medicion_id)

    update_data = datos_nuevos.model_dump(exclude_unset=True)

    try:
        await MedicionDAO.update(db, medicion_db, update_data)
        await db.commit()
        await db.refresh(medicion_db)
        return medicion_db
    except Exception as e:
        await db.rollback()
        raise e

async def delete_medicion_service(db: AsyncSession, cliente_id: int, medicion_id: int, es_profesional:bool):

    if not es_profesional:
        raise UnauthorizedError("Solo un profesional puede registrar nuevas mediciones.")

    cliente=await ClienteDAO.get_by_id(db=db, cliente_id=cliente_id)
    if not cliente:
        raise ClienteNotFoundError(cliente_id=cliente_id)
    

    medicion_db = await MedicionDAO.get_by_id(db=db, medicion_id=medicion_id, cliente_id=cliente_id)
    if not medicion_db:
        raise MedicionNotFoundError(medicion_id=medicion_id)
    
    try:
        await MedicionDAO.delete(db=db, medicion_db=medicion_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e