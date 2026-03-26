from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.dao.turnos_dao import TurnoDAO
from fastapi import HTTPException
from futurebody.backend.schemas.turnos_schema import TurnoCreate, TurnoUpdate
from futurebody.backend.services.usuarios_service import get_usuario_by_id_service

async def verificar_limite_semanal(db, cliente_id, fecha_turno):
    inicio_semana = fecha_turno - timedelta(days=fecha_turno.weekday())
    fin_semana = inicio_semana + timedelta(days=6)
    
    conteo= await TurnoDAO.turnos_por_semana(db=db, cliente_id=cliente_id, inicio_semana=inicio_semana, fin_semana=fin_semana)
    
    if conteo >= 2:
        raise HTTPException(status_code=400, detail="Límite de 2 entrenamientos por semana alcanzado.")
    
async def get_all_turnos_service(db:AsyncSession, cliente_id:int | None, usuario_id:int|None):
    try:
        return await TurnoDAO.get_all(db=db, cliente_id=cliente_id, usuario_id=usuario_id)
    except Exception as e:
        raise

async def get_turno_by_id_service(db:AsyncSession, turno_id:int, cliente_id:int):
    turno = await TurnoDAO.get_by_id(db, turno_id)

    if not turno:
        raise HTTPException(status_code=404, detail="El turno no existe")

    if turno.cliente_id != cliente_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver este turno")

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
            raise HTTPException(
                status_code=400, 
                detail="El profesional ya tiene un turno asignado en esa fecha y hora."
            )
        raise e


async def patch_turno_service(db:AsyncSession, cliente_id:int, turno_id:int,update_dict:TurnoUpdate):

    turno_db=await TurnoDAO.get_by_id(db=db, turno_id=turno_id)

    if not turno_db:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    
    if turno_db.cliente_id != cliente_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para modificar este turno")
    
    update_dict= update_dict.model_dump()

    if "fecha" in update_dict:
        raise HTTPException(
            status_code=400, 
            detail="La fecha no se puede modificar. Por favor, cancela el turno y solicita uno nuevo."
        )
    
    # 4. Lógica de liberación de cupo
    # Si el cliente cambia el estado a 'cancelado', el método 'verificar_limite_semanal'
    # que hicimos antes automáticamente dejará de contarlo (porque filtramos por estado != cancelado).

    try:
        await TurnoDAO.patch(db=db, turno_db=turno_db, turno_data= update_dict)
        await db.commit()
        await db.refresh(turno_db)
        return turno_db
    except Exception as e:
        await db.rollback()
        raise e


async def delete_turno_service(db:AsyncSession, turno_id:int, usuario_id:int):

    # Si tu sistema de autenticación (JWT) ya incluye el rol dentro del token, no necesitarías llamar a la base de datos para buscar al usuario (get_usuario_by_id_service). Podrías pasar el rol directamente desde el Controller al Service y ahorrar una consulta SQL.

    usuario_db=await get_usuario_by_id_service(db=db, usuario_id=usuario_id)

    if not usuario_db:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    
    if (usuario_db.rol != "profesional"):
        raise HTTPException(
            status_code=403,
            detail="Accion no autorizada. Debe ser un prodfesional."
        )

    turno_db=await TurnoDAO.get_by_id(db=db, turno_id=turno_id)

    if not turno_db:
        raise HTTPException(
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
