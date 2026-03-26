# service/comida_service.py
from futurebody.backend.dao.comidas_dao import ComidaDao
from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.schemas.comidas_schema import ComidaCreate, ComidaUpdate


async def get_comidas_service(db:AsyncSession, cliente_id:int):
    try:
        return await ComidaDao.get_all_by_cliente(db=db, cliente_id=cliente_id)
    except Exception as e:
        raise e

async def get_comida_by_id_Service(db:AsyncSession, cliente_id:int, comida_id:int):
    try:
        return await ComidaDao.get_by_id(db=db, comida_id=comida_id,cliente_id=cliente_id)
    except Exception as e:
        raise e

async def create_comida_service(db:AsyncSession, cliente_id:int, comida:ComidaCreate):
    try:
        comida_created= await ComidaDao.create(db=db, cliente_id=cliente_id, comida=comida.model_dump())
        await db.commit()
        await db.refresh(comida_created)
        return comida_created
    except Exception as e:
        await db.rollback()
        raise e


async def patch_comida(db: AsyncSession, comida_id: int, cliente_id: int, comida_data: ComidaUpdate):
    comida_db = await ComidaDao.get_by_id(db, comida_id, cliente_id)
    
    if not comida_db:
        return Exception("Comida no encontrada") 


    update_data=comida_data.model_dump(exclude_unset=True)

    try:
        await ComidaDao.update(db=db, comida_db=comida_db, update_data=update_data)
        await db.commit()
        await db.refresh(comida_db)
        return comida_db
    except Exception as e:
        await db.rollback()
        raise e
    


async def delete_comida_service(db: AsyncSession, comida_id: int, cliente_id: int):
    comida_db = await ComidaDao.get_by_id(db, comida_id, cliente_id)
    
    if not comida_db:
        return False 

    try:
        await ComidaDao.delete(db, comida_db)
        await db.commit() 
        return True
    except Exception as e:
        await db.rollback()
        raise e