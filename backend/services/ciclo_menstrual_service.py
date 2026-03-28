from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.schemas.ciclo_menstrual_schema import CicloMenstrualCreate, CicloMenstrualUpdate
from futurebody.backend.dao.ciclo_menstrual_dao import CicloDAO
from futurebody.backend.dao.clientes_dao import ClienteDAO
from datetime import datetime

from futurebody.backend.exceptions.ciclo_exceptions import (
    CicloNotFoundError, 
    CicloInvalidGenderError, 
    CicloFutureDateError
)

from futurebody.backend.exceptions.clientes_exceptions import ClienteNotFoundError

async def _validar_perfil_femenino(db: AsyncSession, cliente_id: int):
    cliente = await ClienteDAO.get_by_id(db, cliente_id)
    if not cliente:
        raise ClienteNotFoundError(user_id=cliente_id)
        
    if cliente.sexo != "femenino":
        raise CicloInvalidGenderError()

async def get_all_ciclos_service(db: AsyncSession, cliente_id: int):
    await _validar_perfil_femenino(db, cliente_id)
    return await CicloDAO.get_all_by_cliente(db=db, cliente_id=cliente_id)

async def get_ciclo_by_id_Service(db: AsyncSession, cliente_id: int, ciclo_id: int):
    await _validar_perfil_femenino(db, cliente_id)

    ciclo = await CicloDAO.get_by_id(db=db, ciclo_id=ciclo_id, cliente_id=cliente_id)
    if not ciclo:
        raise CicloNotFoundError(ciclo_id=ciclo_id)
    return ciclo

async def create_ciclo_service(db: AsyncSession, cliente_id: int, ciclo_data: CicloMenstrualCreate):
    await _validar_perfil_femenino(db, cliente_id)

    if ciclo_data.fecha_inicio > datetime.now().date():
        raise CicloFutureDateError()

    try:
        ciclo_created = await CicloDAO.create(
            db=db, 
            cliente_id=cliente_id, 
            data=ciclo_data.model_dump()
        )
        await db.commit()
        await db.refresh(ciclo_created)
        return ciclo_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_ciclo_service(db: AsyncSession, ciclo_id: int, cliente_id: int, ciclo_data: CicloMenstrualUpdate):
    ciclo_db = await CicloDAO.get_by_id(db=db, ciclo_id=ciclo_id, cliente_id=cliente_id)
    if not ciclo_db:
        raise CicloNotFoundError(ciclo_id=ciclo_id)

    update_data = ciclo_data.model_dump(exclude_unset=True)
    
    if "fecha_inicio" in update_data:
        if update_data["fecha_inicio"] > datetime.now().date():
            raise CicloFutureDateError()

    try:
        await CicloDAO.update(db=db, ciclo_db=ciclo_db, update_data=update_data)
        await db.commit()
        await db.refresh(ciclo_db)
        return ciclo_db
    except Exception as e:
        await db.rollback()
        raise e

async def delete_ciclo_service(db: AsyncSession, ciclo_id: int, cliente_id: int):
    ciclo_db = await CicloDAO.get_by_id(db=db, ciclo_id=ciclo_id, cliente_id=cliente_id) 
    if not ciclo_db:
        raise CicloNotFoundError(ciclo_id=ciclo_id)
    
    try:
        await CicloDAO.delete(db=db, ciclo_db=ciclo_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e