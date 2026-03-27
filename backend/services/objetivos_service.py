from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.schemas.objetivos_schema import ObjetivoCreate, ObjetivoUpdate
from futurebody.backend.dao.objetivos_dao import ObjetivoDAO
from futurebody.backend.dao.clientes_dao import ClienteDAO
from fastapi import HTTPException, status
from datetime import datetime


async def get_all_by_cliente_service(db: AsyncSession, cliente_id: int):
    return await ObjetivoDAO.get_all(db=db, cliente_id=cliente_id)

async def get_objetivo_by_id_service(db:AsyncSession, objetivo_id:int, cliente_id:int):
    return await ObjetivoDAO.get_by_id(db=db, objetivo_id=objetivo_id, cliente_id=cliente_id)

async def create_objetivo_service(
    db: AsyncSession, 
    objetivo_in: ObjetivoCreate, 
    cliente_id: int
):
    
    ##solo profesional puede crear, modificar, eliminar objetivos EN EL CONTROLLER
    conteo_incompletos = await ObjetivoDAO.count_incompletos(db, cliente_id)
    
    if conteo_incompletos >= 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes crear más objetivos. Tienes 2 o más objetivos incompletos pendientes."
        )

    datos_dict = objetivo_in.model_dump()
    datos_dict["cliente_id"] = cliente_id

    try:
        objetivo_created = await ObjetivoDAO.create(db, datos_dict)
        await db.commit()
        await db.refresh(objetivo_created)
        return objetivo_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_objetivo_service(db: AsyncSession, objetivo_id: int, cliente_id:int, objetivo_data: ObjetivoUpdate):
    objetivo_db = await ObjetivoDAO.get_by_id(db=db, objetivo_id=objetivo_id, cliente_id=cliente_id)
    if not objetivo_db:
        raise HTTPException(status_code=404, detail="objetivo no encontrado")

    update_data = objetivo_data.model_dump(exclude_unset=True)
    
    try:
        await ObjetivoDAO.update(db=db, objetivo_db=objetivo_db, update_data=update_data)
        await db.commit()
        await db.refresh(objetivo_db)
        return objetivo_db
    except Exception as e:
        await db.rollback()
        raise e

async def delete_objetivo_service(db: AsyncSession, objetivo_id: int, cliente_id: int):
    objetivo_db = await ObjetivoDAO.get_by_id(db=db, objetivo_id=objetivo_id, cliente_id=cliente_id) 
    
    if not objetivo_db:
        raise HTTPException(status_code=404, detail="Objetivo no encontrado para este cliente")
    
    try:
        await ObjetivoDAO.delete(db=db, objetivo_db=objetivo_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e