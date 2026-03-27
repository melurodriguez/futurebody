from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.dao.turnos_dao import TurnoDAO
from futurebody.backend.exceptions.turnos_exceptions import (
    TurnoNotFoundError,
    TurnoConflictError,
    TurnoError,
    InvalidAmountPerWeekError,
    InvalidDateError,
    PastDateError,
    LateCancellationError,
    UnauthorizedTurnoAccessError,
    TurnoUpdateNotAllowedError
)
from futurebody.backend.schemas.turnos_schema import TurnoCreate, TurnoUpdate
from futurebody.backend.services.usuarios_service import get_usuario_by_id_service
from datetime import datetime

async def validar_cancelacion_antelacion(fecha_turno: datetime, horas_minimas: int = 2):
    ahora = datetime.now()
    limite = ahora + timedelta(hours=horas_minimas)
    
    if fecha_turno < limite:
        raise LateCancellationError(horas=horas_minimas)

async def verificar_limite_semanal(db, cliente_id, fecha_turno):
    inicio_semana = fecha_turno - timedelta(days=fecha_turno.weekday())
    fin_semana = inicio_semana + timedelta(days=6)
    
    conteo= await TurnoDAO.turnos_por_semana(db=db, cliente_id=cliente_id, inicio_semana=inicio_semana, fin_semana=fin_semana)
    
    if conteo >= 2:
        raise InvalidAmountPerWeekError(status_code=400, detail="Límite de 2 entrenamientos por semana alcanzado.")
    
async def get_all_turnos_service(db:AsyncSession, cliente_id:int | None, usuario_id:int|None):
    try:
        return await TurnoDAO.get_all(db=db, cliente_id=cliente_id, usuario_id=usuario_id)
    except Exception as e:
        raise

async def get_turno_by_id_service(db:AsyncSession, turno_id:int, cliente_id:int):
    turno = await TurnoDAO.get_by_id(db, turno_id)

    if not turno:
        raise TurnoNotFoundError(status_code=404, detail="El turno no existe")

    if turno.cliente_id != cliente_id:
        raise UnauthorizedTurnoAccessError(status_code=403, detail="No tienes permiso para ver este turno")

    return turno

async def create_turno_service(db: AsyncSession, cliente_id: int, turno_data: TurnoCreate):

    await verificar_limite_semanal(
        db=db, 
        cliente_id=cliente_id, 
        fecha_turno=turno_data.fecha
    )

    try:
        datos_turno = turno_data.model_dump()
        datos_turno["cliente_id"] = cliente_id 

        nuevo_turno = await TurnoDAO.create(db=db, data=datos_turno)

        await db.commit()
        await db.refresh(nuevo_turno)
        
        return nuevo_turno

    except Exception as e:
        await db.rollback()
        if "Duplicate entry" in str(e):
            raise TurnoConflictError(
                status_code=400, 
                detail="El profesional ya tiene un turno asignado en esa fecha y hora."
            )
        raise e


async def patch_turno_service(db: AsyncSession, cliente_id: int, turno_id: int, update_dict: TurnoUpdate):
    turno_db = await TurnoDAO.get_by_id(db=db, turno_id=turno_id)
    if not turno_db:
        raise TurnoNotFoundError(turno_id=turno_id)
    
    if turno_db.cliente_id != cliente_id:
        raise UnauthorizedTurnoAccessError()
    
    update_data = update_dict.model_dump(exclude_unset=True)

    if "fecha" in update_data:
        raise TurnoUpdateNotAllowedError()

    if update_data.get("estado") == "cancelado":
        ahora = datetime.now()
        if turno_db.fecha < ahora + timedelta(hours=2):
            raise LateCancellationError(horas=2)

    try:
        await TurnoDAO.patch(db=db, turno_db=turno_db, turno_data=update_data)
        await db.commit()
        await db.refresh(turno_db)
        return turno_db
        
    except Exception as e:
        await db.rollback()
        raise e

async def delete_turno_service(db:AsyncSession, turno_id:int, usuario_id:int):

    usuario_db=await get_usuario_by_id_service(db=db, usuario_id=usuario_id)

    if not usuario_db:
        raise TurnoNotFoundError(
            status_code=404,
            detail="Usuario no encontrado"
        )
    
    if (usuario_db.rol != "profesional"):
        raise UnauthorizedTurnoAccessError(
            status_code=403,
            detail="Accion no autorizada. Debe ser un prodfesional."
        )

    turno_db=await TurnoDAO.get_by_id(db=db, turno_id=turno_id)

    if not turno_db:
        raise TurnoNotFoundError(
            status_code=404,
            detail="Turno no encontrado"
        )
    
    try:
        await TurnoDAO.delete(db=db,turno_db=turno_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e
