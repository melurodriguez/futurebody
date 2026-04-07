from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date
from typing import Any

from backend.database import get_db
from backend.schemas.config_schema import ConfiguracionUpdate, ConfiguracionResponse, ConfiguracionCreate
from backend.services.config_service import (
    get_configuracion_by_usuario_id,
    update_configuracion_service,
    create_config_service
)
from backend.exceptions.usuarios_exceptions import UserNotFoundError
from backend.exceptions.config_exceptions import (
    ConfigNotFound,
    InvalidTimeRangeError
)

router = APIRouter(prefix='/configuracion-coach', tags=['Configuracion Coach'])

@router.get("/{usuario_id}", response_model=ConfiguracionResponse)
async def get_configuracion_router(usuario_id: int, db: AsyncSession = Depends(get_db)):
    """Obtiene las reglas de horario actuales del coach."""
    try:
        return await get_configuracion_by_usuario_id(db=db, usuario_id=usuario_id)
    except ConfigNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.patch("/{usuario_id}", response_model=ConfiguracionResponse)
async def update_configuracion_router(
    usuario_id: int, 
    config_data: ConfiguracionUpdate, 
    db: AsyncSession = Depends(get_db)
):
    """Actualiza o crea las reglas de horario (horas, duración, días)."""
    try:
        # Convertimos a dict excluyendo los campos no enviados para el patch parcial
        data_dict = config_data.model_dump(exclude_unset=True)
        return await update_configuracion_service(db=db, usuario_id=usuario_id, config_data=data_dict)
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidTimeRangeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno al actualizar configuración.")

    
@router.post('/', response_model=ConfiguracionResponse)
async def create_config(
    usuario_id: int, 
    config_data: ConfiguracionCreate, 
    db: AsyncSession = Depends(get_db)
):
    try:            
        return await create_config_service(db=db, config_data=config_data, usuario_id=usuario_id)
    except InvalidTimeRangeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )