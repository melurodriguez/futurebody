from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import date
from backend.database import get_db
from backend.schemas.disponibilidad_schema import DisponibilidadCreate, DisponibilidadUpdate, DisponibilidadResponse
from backend.services.disponibilidad_service import (
    get_disponibilidades_service,
    get_disponibilidad_by_id_service,
    create_disponibilidad_service,
    patch_disponibilidad_service,
    delete_disponibilidad_service,
)
from backend.services.disponibilidad_service import generar_disponibilidad_automatica_service
from backend.exceptions.config_exceptions import ConfigNotFound
from backend.exceptions.usuarios_exceptions import UserNotFoundError
from backend.exceptions.auth_exceptions import UnauthorizedError
from backend.exceptions.disponibilidad_exceptions import (
   DisponibilidadError,
   DisponibilidadConflictCreationError,
   DisponibilidadNotFoundError,
   InvalidTimeRangeError,
)

router = APIRouter(prefix='/disponibilidad', tags=['Disponibilidad'])

@router.get("/", response_model=List[DisponibilidadResponse])
async def get_all_disponibilidad_router(usuario_id:int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_disponibilidades_service(db=db, usuario_id=usuario_id)
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/{disponibilidad_id}", response_model=DisponibilidadResponse)
async def get_disponibilidad_by_id_router(usuario_id:int,disponibilidad_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_disponibilidad_by_id_service(db,usuario_id=usuario_id, disponibilidad_id=disponibilidad_id)
    except DisponibilidadNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
@router.post("/", response_model=DisponibilidadResponse, status_code=status.HTTP_201_CREATED)
async def create_disponibilidad_router(usuario_id:int,disponibilidad_data: DisponibilidadCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_disponibilidad_service(db=db, usuario_id=usuario_id,disponibilidad_data=disponibilidad_data)
    except DisponibilidadConflictCreationError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidTimeRangeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.patch("/{disponibilidad_id}", response_model=DisponibilidadResponse)
async def update_disponibilidad_router(usuario_id:int,disponibilidad_id: int, disponibilidad_data: DisponibilidadUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_disponibilidad_service(db=db,disponibilidad_id=disponibilidad_id,usuario_id=usuario_id, datos_nuevos=disponibilidad_data)
    except DisponibilidadNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except DisponibilidadConflictCreationError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidTimeRangeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{disponibilidad_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_disponibilidad_router(usuario_id:int, disponibilidad_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_disponibilidad_service(db=db, disponibilidad_id=disponibilidad_id, usuario_id=usuario_id)
        return None
    except DisponibilidadNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    
@router.post("/{usuario_id}/generar-agenda", status_code=status.HTTP_201_CREATED)
async def generar_agenda_automatica_router(
    usuario_id: int, 
    fecha_inicio: date, 
    semanas: int = 2, 
    db: AsyncSession = Depends(get_db)
):
    """Dispara la creación masiva de bloques de disponibilidad en la base de datos."""
    try:
        return await generar_disponibilidad_automatica_service(
            db=db, 
            usuario_id=usuario_id, 
            fecha_inicio=fecha_inicio, 
            semanas=semanas
        )
    except ConfigNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidTimeRangeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al generar la agenda: {str(e)}")