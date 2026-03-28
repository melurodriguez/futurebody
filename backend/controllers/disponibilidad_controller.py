from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from futurebody.backend.database import get_db
from futurebody.backend.schemas.disponibilidad_schema import DisponibilidadCreate, DisponibilidadUpdate, DisponibilidadResponse
from futurebody.backend.services.disponibilidad_service import (
    get_disponibilidades_service,
    get_disponibilidad_by_id_service,
    create_disponibilidad_service,
    patch_disponibilidad_service,
    delete_disponibilidad_service
)
from futurebody.backend.exceptions.usuarios_exceptions import UserNotFoundError

from futurebody.backend.exceptions.disponibilidad_exceptions import (
   DisponibilidadError,
   DisponibilidadConflictCreationError,
   DisponibilidadNotFoundError,
   InvalidTimeRangeError,
)

router = APIRouter(prefix='/disponibilidad', tags=['Disponibilidad'])

@router.get("/", response_model=List[DisponibilidadResponse])
async def get_all_disponibilidad_router(db: AsyncSession = Depends(get_db)):
    return await get_disponibilidades_service(db=db)

@router.get("/{disponibilidad_id}", response_model=DisponibilidadResponse)
async def get_disponibilidad_by_id_router(disponibilidad_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_disponibilidad_by_id_service(db, disponibilidad_id)
    except DisponibilidadNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/", response_model=DisponibilidadResponse, status_code=status.HTTP_201_CREATED)
async def create_disponibilidad_router(disponibilidad_data: DisponibilidadCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_disponibilidad_service(db=db, disponibilidad_data=disponibilidad_data)
    except DisponibilidadConflictCreationError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidTimeRangeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.patch("/{disponibilidad_id}", response_model=DisponibilidadResponse)
async def update_disponibilidad_router(disponibilidad_id: int, disponibilidad_data: DisponibilidadUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_disponibilidad_service(db=db, disponibilidad_id=disponibilidad_id, datos_nuevos=disponibilidad_data)
    except DisponibilidadNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except DisponibilidadConflictCreationError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidTimeRangeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{disponibilidad_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_disponibilidad_router(disponibilidad_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_disponibilidad_service(db=db, disponibilidad_id=disponibilidad_id)
        return None
    except DisponibilidadNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))