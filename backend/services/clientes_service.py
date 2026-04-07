from sqlalchemy.ext.asyncio import AsyncSession
from backend.dao.clientes_dao import ClienteDAO
from backend.schemas.clientes_schema import ClienteCreate, ClienteUpdate
from backend.models.clientes_model import Cliente
from backend.exceptions.clientes_exceptions import ClienteAlreadyExistsError,ClienteError,ClienteNotFoundError,IncompatibleGenderDataError,InvalidBirthDateError, InvalidTimeRangeError
from datetime import datetime, date, timedelta
from backend.dao.usuarios_dao import UsuarioDAO
from backend.exceptions.usuarios_exceptions import UserNotFoundError


async def get_clientes_service(db:AsyncSession):
    try:
        return await ClienteDAO.get_all(db=db)
    except Exception as e:
        raise e
    
async def get_cliente_by_id(db:AsyncSession, cliente_id:int):
    cliente= await ClienteDAO.get_by_id(db=db, cliente_id=cliente_id)
    if not cliente:
        raise ClienteNotFoundError(cliente_id=cliente_id)
    return cliente

async def create_cliente_service(db:AsyncSession, cliente_data:ClienteCreate):
    existe=await ClienteDAO.get_by_id(db=db, cliente_id=cliente_data.id)
    if existe:
        raise ClienteAlreadyExistsError(cliente_id=cliente_data.id)
    
    usuario_db = await UsuarioDAO.get_by_id(db, usuario_id=cliente_data.id)
    if not usuario_db:
        raise UserNotFoundError(user_id=cliente_data.id)
    
    if cliente_data.fecha_nacimiento > date.today():
        raise InvalidBirthDateError()
    
    try:
        cliente_created=await ClienteDAO.create(db=db, cliente=cliente_data.model_dump())
        usuario_db = await UsuarioDAO.get_by_id(db, usuario_id=cliente_data.id)
        if usuario_db:
            usuario_db.is_profile_complete = True
        await db.commit()
        await db.refresh(cliente_created)
        return cliente_created
    except Exception as e:
        await db.rollback()
        raise e
    
async def patch_cliente_service(db:AsyncSession, cliente_id:int ,cliente_data:ClienteUpdate):
    cliente_db=await ClienteDAO.get_by_id(db=db, cliente_id=cliente_id)

    if not cliente_db:
        raise ClienteNotFoundError(cliente_id=cliente_id)
    
    update_data=cliente_data.model_dump(exclude_unset=True)

    if "fecha_nacimiento" in update_data:
        if update_data["fecha_nacimiento"] > date.today():
            raise InvalidBirthDateError()
    
    try:
        await ClienteDAO.update(db=db, cliente_db=cliente_db, update_data=update_data)
        await db.commit()
        await db.refresh(cliente_db)
        return cliente_db
    except Exception as e:
        await db.rollback()
        raise e
    
async def delete_cliente_service(db:AsyncSession, cliente_id:int):

    cliente_db=await ClienteDAO.get_by_id(db=db, cliente_id=cliente_id)

    if not cliente_db:
        raise ClienteNotFoundError(cliente_id=cliente_id)
    
    try:
        await ClienteDAO.delete(db=db,cliente_db=cliente_db)
        usuario_db = await UsuarioDAO.get_by_id(db, usuario_id=cliente_id)
        if usuario_db:
            usuario_db.is_profile_complete = False
            usuario_db.is_active=False
            
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise e

async def get_clients_stats_service( db:AsyncSession):
    mes_anterior= date.today() - timedelta(days=30)
    fecha_actual= date.today()
    try:
        return await ClienteDAO.calculate_stats(db=db, mes_anterior=mes_anterior, fecha_actual=fecha_actual)
    except Exception as e:
        raise e