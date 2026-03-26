from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.dao.clientes_dao import ClienteDAO
from futurebody.backend.schemas.clientes_schema import ClienteCreate, ClienteUpdate
from futurebody.backend.models.clientes_model import Cliente

async def get_clientes_service(db:AsyncSession):
    try:
        return await ClienteDAO.get_all(db=db)
    except Exception as e:
        raise e
    
async def get_cliente_by_id(db:AsyncSession, cliente_id:int):
    try:
        return await ClienteDAO.get_by_id(db=db, cliente_id=cliente_id)
    except Exception as e:
        raise e

async def create_cliente_service(db:AsyncSession, cliente_data:ClienteCreate):
    try:
        cliente_created=await ClienteDAO.create(db=db, cliente=cliente_data.model_dump())
        await db.commit()
        await db.refresh(cliente_created)
        return cliente_created
    except Exception as e:
        await db.rollback()
        raise e
    
async def patch_cliente_service(db:AsyncSession, cliente_id:int ,cliente_data:ClienteUpdate):
    cliente_db=await ClienteDAO.get_by_id(db=db, cliente_id=cliente_id)

    if not cliente_db:
        raise Exception("Cliente no encontrado")
    
    update_data=cliente_data.model_dump(exclude_unset=True)
    
    try:
        await ClienteDAO.update(db=db, cliente_db=cliente_db, update_data=update_data)
        await db.commit()
        await db.refresh(cliente_db)
        return cliente_db
    except Exception as e:
        await db.rollback()
        raise e
    
async def delete_cliente_service(db:AsyncSession, cliente_id:int):

    cliente_db=await ClienteDAO.get_by_id(db=db, cliente_id=cliente_id)

    if not cliente_db:
        raise Exception("Cliente no encontrado")
    
    try:
        await ClienteDAO.delete(db=db,cliente_db=cliente_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e