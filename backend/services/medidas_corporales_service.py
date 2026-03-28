from sqlalchemy.ext.asyncio import AsyncSession
from backend.dao.medidas_corporales_dao import MedidaCorporalDAO
from backend.models.medidas_corporales_model import MedidaCorporal
from backend.schemas.medidas_corporales_schema import MedidaCorporalCreate, MedidaCorporalUpdate
from backend.exceptions.medidas_corporales_exceptions import MedidaCorporalNotFoundError
from backend.exceptions.clientes_exceptions import ClienteNotFoundError
from backend.dao.clientes_dao import ClienteDAO
from backend.exceptions.auth_exceptions import UnauthorizedError


async def get_medidas_service(db:AsyncSession, cliente_id:int):
    try:
        return await MedidaCorporalDAO.get_all_by_cliente(db=db, cliente_id=cliente_id)
    except Exception as e:
        raise e
    
async def get_medida_by_id_service(db:AsyncSession, medida_id:int, cliente_id:int):
    medida= await MedidaCorporalDAO.get_by_id(db=db, medida_id=medida_id, cliente_id=cliente_id)
    if not medida:
        raise MedidaCorporalNotFoundError(medida_id=medida_id)
    return medida
    
async def create_medida_service(db: AsyncSession, cliente_id:int, es_profesional:bool,medida_data: MedidaCorporalCreate):

    if not es_profesional:
        raise UnauthorizedError("Solo un profesional puede registrar nuevas mediciones.")
    
    cliente= await ClienteDAO.get_by_id(db=db, cliente_id=cliente_id)
    if not cliente:
        raise ClienteNotFoundError(cliente_id=cliente_id)
    
    try:
        medida_created= await MedidaCorporalDAO.create(db=db, cliente_id=cliente_id, data=medida_data.model_dump())
        await db.commit()
        await db.refresh(medida_created)
        return medida_created
    except Exception as e:
        await db.rollback()
        raise e
    

async def patch_medida_service(
    db: AsyncSession, 
    medida_id: int, 
    cliente_id: int,
    es_profesional:bool,  
    datos_nuevos: MedidaCorporalUpdate
):
    if not es_profesional:
        raise UnauthorizedError("Solo un profesional puede registrar nuevas mediciones.")
    
    medida_db = await MedidaCorporalDAO.get_by_id(db, medida_id, cliente_id)
    
    if not medida_db:
        raise MedidaCorporalNotFoundError(medida_id=medida_id)

    update_data = datos_nuevos.model_dump(exclude_unset=True)

    try:
        await MedidaCorporalDAO.update(db, medida_db, update_data)
        await db.commit()
        await db.refresh(medida_db)
        return medida_db
    except Exception as e:
        await db.rollback()
        raise e

async def delete_medida_service(db: AsyncSession, medida_id: int, cliente_id: int, es_profesional:bool):

    if not es_profesional:
        raise UnauthorizedError("Solo un profesional puede registrar nuevas mediciones.")
    
    medida_db = await MedidaCorporalDAO.get_by_id(db, medida_id, cliente_id)

    if not medida_db:
        raise MedidaCorporalNotFoundError(medida_id=medida_id)
    
    try:
        await MedidaCorporalDAO.delete(db=db, medida_db=medida_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e