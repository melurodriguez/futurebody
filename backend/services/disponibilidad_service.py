from sqlalchemy.ext.asyncio import AsyncSession
from backend.dao.disponibilidad_dao import DisponibilidadDAO
from backend.models.disponibilidad_model import Disponibilidad
from backend.schemas.disponibilidad_schema import DisponibilidadCreate, DisponibilidadUpdate
from backend.exceptions.disponibilidad_exceptions import DisponibilidadError, DisponibilidadNotFoundError,InvalidTimeRangeError, DisponibilidadConflictCreationError
from backend.dao.usuarios_dao import UsuarioDAO
from backend.exceptions.auth_exceptions import UnauthorizedError
from backend.exceptions.usuarios_exceptions import UserNotFoundError
from datetime import date, timedelta
from backend.dao.configuracion_usuario_dao import ConfiguracionCoachDAO
from backend.exceptions.config_exceptions import ConfigError, ConfigNotFound
import logging

logger = logging.getLogger(__name__)

async def get_disponibilidades_service(db:AsyncSession,  usuario_id: int):
    try:
        usuario_db=await UsuarioDAO.get_by_id(db=db, usuario_id=usuario_id)
        if usuario_db.rol !="profesional":
            raise UnauthorizedError()
    
        return await DisponibilidadDAO.get_all(db=db, usuario_id=usuario_id)
    except Exception as e:
        raise e
    
async def get_disponibilidad_by_id_service(db:AsyncSession, disponibilidad_id:int,  usuario_id: int):
    disponibilidad= await DisponibilidadDAO.get_by_id(db=db, disponibilidad_id=disponibilidad_id, usuario_id=usuario_id)
    if not disponibilidad:
        raise DisponibilidadNotFoundError(disponibilidad_id=disponibilidad_id)
    return disponibilidad
    
async def create_disponibilidad_service(db: AsyncSession, usuario_id: int, disponibilidad_data: DisponibilidadCreate):

    if disponibilidad_data.hora_inicio >= disponibilidad_data.hora_fin:
        raise InvalidTimeRangeError(status_code=400, detail="La hora de inicio debe ser anterior a la de fin")

    usuario_db=await UsuarioDAO.get_by_id(db=db, usuario_id=usuario_id)
    if not usuario_db:
        raise UserNotFoundError(user_id=usuario_id)
    
    if usuario_db.rol != "profesional":
        raise UnauthorizedError
    
    is_ok= await DisponibilidadDAO.is_disponible(db=db, usuario_id=usuario_id, fecha=disponibilidad_data.fecha, inicio=disponibilidad_data.hora_inicio, fin=disponibilidad_data.hora_fin)
    if not is_ok:
        raise DisponibilidadConflictCreationError(usuario_id=usuario_id, fecha=disponibilidad_data.fecha, horario_incio=disponibilidad_data.hora_inicio, horario_fin=disponibilidad_data.hora_fin)

    data=disponibilidad_data.model_dump()
    data["usuario_id"]=usuario_id
    try:
        disponibilidad_created= await DisponibilidadDAO.create(db=db, disponibilidad=data)
        await db.commit()
        await db.refresh(disponibilidad_created)
        return disponibilidad_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_disponibilidad_service(db: AsyncSession, disponibilidad_id: int, usuario_id: int, datos_nuevos: DisponibilidadUpdate):

    disponibilidad_db = await DisponibilidadDAO.get_by_id(db=db, disponibilidad_id=disponibilidad_id, usuario_id=usuario_id)
    if not disponibilidad_db:
        raise DisponibilidadNotFoundError(disponibilidad_id=disponibilidad_id)


    update_data = datos_nuevos.model_dump(exclude_unset=True)
    

    fecha_f = update_data.get("fecha", disponibilidad_db.fecha)
    ini_f = update_data.get("hora_inicio", disponibilidad_db.hora_inicio)
    fin_f = update_data.get("hora_fin", disponibilidad_db.hora_fin)


    if ini_f >= fin_f:
        raise InvalidTimeRangeError("La hora de inicio debe ser anterior a la de fin")


    is_ok = await DisponibilidadDAO.is_disponible(
        db=db, 
        usuario_id=usuario_id, 
        fecha=fecha_f, 
        inicio=ini_f, 
        fin=fin_f,
        exclude_id=disponibilidad_id  
    )

    if not is_ok:
        raise DisponibilidadConflictCreationError(
            usuario_id=usuario_id, fecha=fecha_f, horario_incio=ini_f, horario_fin=fin_f
        )

    try:
        await DisponibilidadDAO.update(db, disponibilidad_db, update_data)
        await db.commit()
        await db.refresh(disponibilidad_db)
        return disponibilidad_db
    except Exception as e:
        await db.rollback()
        raise e
    

async def delete_disponibilidad_service(db:AsyncSession,  usuario_id: int, disponibilidad_id:int):
   
    usuario_db=await UsuarioDAO.get_by_id(db=db, usuario_id=usuario_id)
    if not usuario_db:
        raise UserNotFoundError(user_id=usuario_id)
    
    disponibilidad_db = await DisponibilidadDAO.get_by_id(db=db, disponibilidad_id=disponibilidad_id, usuario_id=usuario_id)
    if not disponibilidad_db:
        raise DisponibilidadNotFoundError(disponibilidad_id=disponibilidad_id)
    
    if usuario_id != disponibilidad_db.usuario_id:
        raise UnauthorizedError()
    try:
        await DisponibilidadDAO.delete(db=db, disponibilidad_db=disponibilidad_db)
        await db.commit()
        return True
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