from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from backend.database import get_db
from backend.schemas.ciclo_menstrual_schema import CicloMenstrualCreate, CicloMenstrualResponse, CicloMenstrualUpdate
from backend.services.ciclo_menstrual_service import (
    get_all_ciclos_service,
    get_ciclo_by_id_Service,
    create_ciclo_service,
    patch_ciclo_service,
    delete_ciclo_service
)
from backend.exceptions.clientes_exceptions import ClienteNotFoundError

from backend.exceptions.ciclo_exceptions import(
    CicloFutureDateError, CicloInvalidGenderError, CicloNotFoundError
)

router = APIRouter(prefix='/ciclo', tags=['Ciclo'])

@router.get("/", response_model=List[CicloMenstrualResponse])
async def get_all_ciclos_router(db: AsyncSession = Depends(get_db)):
    try:
        return await get_all_ciclos_service(db=db)
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CicloInvalidGenderError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{ciclo_id}", response_model=CicloMenstrualResponse)
async def get_ciclo_by_id_router(ciclo_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_ciclo_by_id_Service(db, ciclo_id)
    except CicloNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CicloInvalidGenderError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/", response_model=CicloMenstrualResponse, status_code=status.HTTP_201_CREATED)
async def create_ciclo_router(ciclo_data: CicloMenstrualCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_ciclo_service(db=db, ciclo_data=ciclo_data)
    except CicloFutureDateError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CicloInvalidGenderError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.patch("/{ciclo_id}", response_model=CicloMenstrualResponse)
async def update_ciclo_router(ciclo_id: int, ciclo_data: CicloMenstrualUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_ciclo_service(db=db, ciclo_id=ciclo_id, datos_nuevos=ciclo_data)
    except CicloNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CicloFutureDateError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{ciclo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ciclo_router(ciclo_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_ciclo_service(db=db, ciclo_id=ciclo_id)
        return None
    except CicloNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    