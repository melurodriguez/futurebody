from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, datetime
from backend.dao.configuracion_usuario_dao import ConfiguracionCoachDAO
from backend.dao.usuarios_dao import UsuarioDAO
from backend.schemas.config_schema import ConfiguracionUpdate
from backend.exceptions.usuarios_exceptions import UserNotFoundError
from backend.exceptions.config_exceptions import (
    ConfigNotFound, 
    InvalidTimeRangeError,

)
from backend.dao.disponibilidad_dao import DisponibilidadDAO

async def get_configuracion_by_usuario_id(db: AsyncSession, usuario_id: int):
    """Obtiene la configuración de un coach por su ID de usuario."""
    config = await ConfiguracionCoachDAO.get_by_usuario_id(db, usuario_id)
    if not config:
        raise ConfigNotFound(usuario_id=usuario_id)
    return config

async def update_configuracion_service(db: AsyncSession, usuario_id: int, config_data: dict):
    """
    Actualiza o crea la configuración de un coach.
    Realiza validaciones de coherencia horaria antes de persistir.
    """
    usuario_db = await UsuarioDAO.get_by_id(db, usuario_id=usuario_id)
    if not usuario_db:
        raise UserNotFoundError(user_id=usuario_id)


    hora_inicio = config_data.get("hora_inicio")
    hora_fin = config_data.get("hora_fin")
    
    if hora_inicio and hora_fin:
        if hora_inicio >= hora_fin:
            raise InvalidTimeRangeError("La hora de inicio debe ser anterior a la hora de fin.")

    try:
        config_updated = await ConfiguracionCoachDAO.upsert_configuracion(
            db=db, 
            usuario_id=usuario_id, 
            data=config_data
        )
        
        if not usuario_db.is_profile_complete:
            usuario_db.is_profile_complete = True
            
        await db.commit()
        await db.refresh(config_updated)
        return config_updated

    except Exception as e:
        await db.rollback()
        raise e

async def generar_disponibilidad_automatica_service(
    db: AsyncSession, 
    usuario_id: int, 
    fecha_inicio: date, 
    semanas: int = 2
):
    """
    Orquesta la generación masiva de bloques de tiempo.
    """
    
    config = await ConfiguracionCoachDAO.get_by_usuario_id(db, usuario_id)
    if not config:
        raise ConfigNotFound(usuario_id=usuario_id)

    if fecha_inicio < date.today():
        raise InvalidTimeRangeError("No se puede generar disponibilidad para fechas pasadas.")

    try:       
        resultado = await DisponibilidadDAO.generar_bloques_masivos(
            db=db,
            coach_id=usuario_id,
            config=config,
            fecha_inicio=fecha_inicio,
            semanas=semanas
        )
        
        await db.commit()
        return resultado

    except Exception as e:
        await db.rollback()
        raise e