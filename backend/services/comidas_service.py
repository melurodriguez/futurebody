# service/comida_service.py
from backend.dao.comidas_dao import ComidaDao
from sqlalchemy.ext.asyncio import AsyncSession
from backend.schemas.comidas_schema import ComidaCreate, ComidaUpdate
from backend.exceptions.comidas_exceptions import ComidaAlreadyExistsError, ComidaNotFoundError, ComidaOwnershipError
from backend.dao.clientes_dao import ClienteDAO
from backend.exceptions.clientes_exceptions import ClienteNotFoundError

async def get_comidas_service(db:AsyncSession, cliente_id:int):
    try:
        return await ComidaDao.get_all_by_cliente(db=db, cliente_id=cliente_id)
    except Exception as e:
        raise e

async def get_comida_by_id_Service(db:AsyncSession, cliente_id:int, comida_id:int):
    comida= await ComidaDao.get_by_id(db=db, comida_id=comida_id,cliente_id=cliente_id)
    if not comida:
        raise ComidaNotFoundError(comida_id=comida_id)
    return comida

async def create_comida_service(db:AsyncSession, cliente_id:int, comida:ComidaCreate):

    cliente=await ClienteDAO.get_by_id(cliente_id=cliente_id, db=db)
    if not cliente:
        raise ClienteNotFoundError
    
    comida_existente = await ComidaDao.get_by_date_and_type(
        db, 
        cliente_id=cliente_id, 
        fecha=comida.fecha, 
        tipo=comida.tipo_comida
    )
    if comida_existente:
        raise ComidaAlreadyExistsError(fecha=comida.fecha, tipo=comida.tipo_comida)
    
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
        raise ComidaNotFoundError(comida_id=comida_id)
    
    update_data = comida_data.model_dump(exclude_unset=True)

    if "fecha" in update_data or "tipo" in update_data:
        fecha_final = update_data.get("fecha", comida_db.fecha)
        tipo_final = update_data.get("tipo", comida_db.tipo)

        comida_existente = await ComidaDao.get_by_date_and_type(
            db, 
            cliente_id=cliente_id, 
            fecha=fecha_final, 
            tipo=tipo_final
        )

        if comida_existente and comida_existente.id != comida_id:
            raise ComidaAlreadyExistsError(fecha=str(fecha_final), tipo=tipo_final)

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
        return ComidaNotFoundError(comida_id=comida_id) 

    try:
        await ComidaDao.delete(db, comida_db)
        await db.commit() 
        return True
    except Exception as e:
        await db.rollback()
        raise e