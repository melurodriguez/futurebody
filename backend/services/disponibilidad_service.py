from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.dao.disponibilidad_dao import DisponibilidadDAO
from futurebody.backend.models.disponibilidad_model import Disponibilidad
from futurebody.backend.schemas.disponibilidad_schema import DisponibilidadCreate, DisponibilidadUpdate
from futurebody.backend.exceptions.disponibilidad_exceptions import DisponibilidadError, DisponibilidadNotFoundError,InvalidTimeRangeError, DisponibilidadConflictCreationError
from futurebody.backend.dao.usuarios_dao import UsuarioDAO
from futurebody.backend.exceptions.usuarios_exceptions import UserNotFoundError

async def get_disponibilidades_service(db:AsyncSession,  cliente_id: int):
    try:
        return await DisponibilidadDAO.get_all(db=db, cliente_id=cliente_id)
    except Exception as e:
        raise e
    
async def get_disponibilidad_by_id_service(db:AsyncSession, disponibilidad_id:int,  cliente_id: int):
    disponibilidad= await DisponibilidadDAO.get_by_id(db=db, disponibilidad_id=disponibilidad_id, cliente_id=cliente_id)
    if not disponibilidad:
        raise DisponibilidadNotFoundError(disponibilidad_id=disponibilidad_id)
    return disponibilidad
    
async def create_disponibilidad_service(db: AsyncSession, usuario_id: int, disponibilidad_data: DisponibilidadCreate):

    if disponibilidad_data.hora_inicio >= disponibilidad_data.hora_fin:
        raise InvalidTimeRangeError(status_code=400, detail="La hora de inicio debe ser anterior a la de fin")

    usuario_db=await UsuarioDAO.get_by_id(db=db, usuario_id=usuario_id)
    if not usuario_db:
        raise UserNotFoundError(user_id=usuario_id)
    
    is_ok= await DisponibilidadDAO.is_disponible(db=db, usuario_id=usuario_id, fecha=disponibilidad_data.fecha, inicio=disponibilidad_data.hora_inicio, fin=disponibilidad_data.hora_fin)
    if not is_ok:
        raise DisponibilidadConflictCreationError(usuario_id=usuario_id, fecha=disponibilidad_data.fecha, horario_incio=disponibilidad_data.hora_inicio, horario_fin=disponibilidad_data.hora_fin)

    try:
        disponibilidad_created= await DisponibilidadDAO.create(db=db, data=disponibilidad_data.model_dump())
        await db.commit()
        await db.refresh(disponibilidad_created)
        return disponibilidad_created
    except Exception as e:
        await db.rollback()
        raise e

async def patch_disponibilidad_service(db: AsyncSession, disponibilidad_id: int, usuario_id: int, datos_nuevos: DisponibilidadUpdate):

    usuario_db=await UsuarioDAO.get_by_id(db=db, usuario_id=usuario_id)
    if not usuario_db:
        raise UserNotFoundError(user_id=usuario_id)
    
    disponibilidad_db = await DisponibilidadDAO.get_by_id(db=db, disponibilidad_id=disponibilidad_id, cliente_id=usuario_id)
    if not disponibilidad_db:
        raise DisponibilidadNotFoundError(disponibilidad_id=disponibilidad_id)
        

    update_data = datos_nuevos.model_dump(exclude_unset=True)
    fecha_final = update_data.get("fecha", disponibilidad_db.fecha)
    inicio_final = update_data.get("hora_inicio", disponibilidad_db.hora_inicio)
    fin_final = update_data.get("hora_fin", disponibilidad_db.hora_fin)

    if inicio_final >= fin_final:
        raise InvalidTimeRangeError(status_code=400, detail="La hora de inicio debe ser anterior a la de fin")

    is_ok = await DisponibilidadDAO.is_disponible(
        db=db, 
        usuario_id=usuario_id, 
        fecha=fecha_final, 
        inicio=inicio_final, 
        fin=fin_final,
        exclude_id=disponibilidad_db.id  
    )

    if not is_ok:
        raise DisponibilidadConflictCreationError(
            usuario_id=usuario_id, 
            fecha=fecha_final, 
            horario_incio=inicio_final, 
            horario_fin=fin_final
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
    
    disponibilidad_db = await DisponibilidadDAO.get_by_id(db=db, disponibilidad_id=disponibilidad_id, cliente_id=usuario_id)
    if not disponibilidad_db:
        raise DisponibilidadNotFoundError(disponibilidad_id=disponibilidad_id)
    
    try:
        await DisponibilidadDAO.delete(db=db, disponibilidad_db=disponibilidad_db)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e