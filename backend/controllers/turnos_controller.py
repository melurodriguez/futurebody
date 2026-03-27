from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from futurebody.backend.database import get_db
from futurebody.backend.schemas.turnos_schema import TurnoCreate, TurnoResponse, TurnoUpdate
from futurebody.backend.services.turnos_service import (
    get_all_turnos_service,
    get_turno_by_id_service,
    create_turno_service,
    patch_turno_service,
    delete_turno_service
)
from futurebody.backend.exceptions.turnos_exceptions import (
   TurnoError,
   TurnoAlreadyExistsError,
   TurnoNotFoundError,
   InvalidDateError
)

router = APIRouter(prefix='/turnos', tags=['Turnos'])

@router.get("/", response_model=List[TurnoResponse])
async def get_all_turnos_router(db: AsyncSession = Depends(get_db)):
    return await get_all_turnos_service(db=db)

@router.get("/{turno_id}", response_model=TurnoResponse)
async def get_turno_by_id_router(turno_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_turno_by_id_service(db, turno_id)
    except TurnoNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/", response_model=TurnoResponse, status_code=status.HTTP_201_CREATED)
async def create_user_router(turno_data: TurnoCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_turno_service(db=db, turno_data=turno_data)
    except TurnoAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.patch("/{turno_id}", response_model=TurnoResponse)
async def update_user_router(turno_id: int, turno_data: TurnoUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_turno_service(db=db, turno_id=turno_id, datos_nuevos=turno_data)
    except TurnoNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TurnoAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{turno_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_router(turno_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_turno_service(db=db, turno_id=turno_id)
        return None
    except TurnoNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))