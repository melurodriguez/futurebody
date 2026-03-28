from sqlalchemy.ext.asyncio import AsyncSession
from backend.schemas.objetivos_schema import ObjetivoCreate, ObjetivoUpdate
from backend.dao.objetivos_dao import ObjetivoDAO
from backend.dao.clientes_dao import ClienteDAO
from fastapi import HTTPException, status
from datetime import datetime
from backend.exceptions.auth_exceptions import UnauthorizedError
from backend.exceptions.objetivos_exceptions import ObjetivoLimitReachedError,ObjetivoNotFoundError


async def get_all_by_cliente_service(db: AsyncSession, cliente_id: int, usuario_id: int, es_profesional: bool):
    """
    Un cliente solo puede pedir sus propios objetivos. 
    Un profesional puede pedir los de cualquier cliente_id.
    """
    if not es_profesional and cliente_id != usuario_id:
        raise UnauthorizedError("No tienes permiso para ver los objetivos de otro cliente.")
    
    return await ObjetivoDAO.get_all(db=db, cliente_id=cliente_id)

async def get_objetivo_by_id_service(db: AsyncSession, objetivo_id: int, cliente_id: int, usuario_id: int, es_profesional: bool):
    if not es_profesional and cliente_id != usuario_id:
        raise UnauthorizedError("Acceso denegado a este objetivo.")

    objetivo = await ObjetivoDAO.get_by_id(db=db, objetivo_id=objetivo_id, cliente_id=cliente_id)
    if not objetivo:
        raise ObjetivoNotFoundError(objetivo_id=objetivo_id)
    
    return objetivo


async def create_objetivo_service(
    db: AsyncSession, 
    objetivo_in: ObjetivoCreate, 
    cliente_id: int, 
    es_profesional: bool
):
    if not es_profesional:
        raise UnauthorizedError("Solo un profesional puede crear objetivos o mediciones.")

    conteo_incompletos = await ObjetivoDAO.count_incompletos(db, cliente_id)
    if conteo_incompletos >= 2:
        raise ObjetivoLimitReachedError()

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

async def patch_objetivo_service(
    db: AsyncSession, 
    objetivo_id: int, 
    cliente_id: int, 
    es_profesional: bool, 
    objetivo_data: ObjetivoUpdate
):
    if not es_profesional:
        raise UnauthorizedError("Solo el profesional está autorizado a modificar objetivos.")
    
    objetivo_db = await ObjetivoDAO.get_by_id(db=db, objetivo_id=objetivo_id, cliente_id=cliente_id)
    if not objetivo_db:
        raise ObjetivoNotFoundError(objetivo_id=objetivo_id)

    update_data = objetivo_data.model_dump(exclude_unset=True)
    
    try:
        await ObjetivoDAO.update(db=db, objetivo_db=objetivo_db, update_data=update_data)
        await db.commit()
        await db.refresh(objetivo_db)
        return objetivo_db
    except Exception as e:
        await db.rollback()
        raise e

async def delete_objetivo_service(db: AsyncSession, objetivo_id: int, cliente_id: int, es_profesional: bool):
    if not es_profesional:
        raise UnauthorizedError("Solo el profesional puede eliminar objetivos.")

    objetivo_db = await ObjetivoDAO.get_by_id(db=db, objetivo_id=objetivo_id, cliente_id=cliente_id) 
    if not objetivo_db:
        raise ObjetivoNotFoundError(objetivo_id=objetivo_id)
    
    try:
        await ObjetivoDAO.delete(db=db, objetivo_db=objetivo_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e