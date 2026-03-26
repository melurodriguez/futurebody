from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.schemas.ciclo_menstrual_schema import CicloMenstrualCreate, CicloMenstrualUpdate
from futurebody.backend.dao.ciclo_menstrual_dao import CicloDAO
from futurebody.backend.dao.clientes_dao import ClienteDAO
from fastapi import HTTPException
from datetime import datetime

async def _validar_perfil_femenino(db: AsyncSession, cliente_id: int):
    cliente = await ClienteDAO.get_by_id(db, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    if cliente.sexo != "femenino":
        raise HTTPException(
            status_code=403, 
            detail="El registro de ciclo menstrual solo es válido para perfiles femeninos."
        )

async def get_all_ciclos_service(db: AsyncSession, cliente_id: int):
    # Validamos sexo antes de listar
    await _validar_perfil_femenino(db, cliente_id)
    return await CicloDAO.get_all_by_cliente(db=db, cliente_id=cliente_id)

async def create_ciclo_service(db: AsyncSession, ciclo: CicloMenstrualCreate):
    # 1. Validar sexo
    await _validar_perfil_femenino(db, ciclo.cliente_id)

    # 2. Validar fecha
    if ciclo.fecha_inicio > datetime.now().date():
        raise HTTPException(status_code=400, detail="La fecha de inicio no puede ser futura.")

    try:
        ciclo_created = await CicloDAO.create(db=db, ciclo=ciclo.model_dump())
        await db.commit()
        await db.refresh(ciclo_created)
        return ciclo_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_ciclo_service(db: AsyncSession, ciclo_id: int, ciclo_data: CicloMenstrualUpdate):
    ciclo_db = await CicloDAO.get_by_id(db=db, ciclo_id=ciclo_id)
    if not ciclo_db:
        raise HTTPException(status_code=404, detail="Ciclo menstrual no encontrado")

    # Aquí no hace falta validar sexo de nuevo porque el registro ya existe (ya pasó el filtro al crearse)
    update_data = ciclo_data.model_dump(exclude_unset=True)
    
    try:
        await CicloDAO.update(db=db, ciclo_db=ciclo_db, update_data=update_data)
        await db.commit()
        await db.refresh(ciclo_db)
        return ciclo_db
    except Exception as e:
        await db.rollback()
        raise e

async def delete_ciclo_service(db: AsyncSession, ciclo_id: int):
    ciclo_db = await CicloDAO.get_by_id(db=db, ciclo_id=ciclo_id) 
    if not ciclo_db:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    
    try:
        await CicloDAO.delete(db=db, ciclo_db=ciclo_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e