from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.dao.medidas_corporales_dao import MedidaCorporalDAO
from futurebody.backend.models.medidas_corporales_model import MedidaCorporal
from futurebody.backend.schemas.medidas_corporales_schema import MedidaCorporalCreate, MedidaCorporalUpdate
from fastapi import HTTPException

async def get_medidas_service(db:AsyncSession, cliente_id:int):
    try:
        return await MedidaCorporalDAO.get_all_by_cliente(db=db, cliente_id=cliente_id)
    except Exception as e:
        raise e
    
async def get_medida_by_id_service(db:AsyncSession, medida_id:int, cliente_id:int):
    try:
        return await MedidaCorporalDAO.get_by_id(db=db, medida_id=medida_id, cliente_id=cliente_id)
    except Exception as e:
        raise e
    
async def create_medida_service(db: AsyncSession, medida_data: MedidaCorporalCreate):
    try:
        medida_created= await MedidaCorporalDAO.create(db=db, data=medida_data.model_dump())
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
    datos_nuevos: MedidaCorporalUpdate
):
    medida_db = await MedidaCorporalDAO.get_by_id(db, medida_id, cliente_id)
    
    if not medida_db:
        raise HTTPException(status_code=404, detail="Medida no encontrada o no pertenece al cliente")

    update_data = datos_nuevos.model_dump(exclude_unset=True)

    try:
        await MedidaCorporalDAO.update(db, medida_db, update_data)
        await db.commit()
        await db.refresh(medida_db)
        return medida_db
    except Exception as e:
        await db.rollback()
        raise e

async def delete_medida_service(db: AsyncSession, medida_id: int, cliente_id: int):
    medida_db = await MedidaCorporalDAO.get_by_id(db, medida_id, cliente_id)

    if not medida_db:
        raise HTTPException(status_code=404, detail="Medida no encontrada")
    
    try:
        await MedidaCorporalDAO.delete(db=db, medida_db=medida_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e