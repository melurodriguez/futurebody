from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from backend.database import get_db
from backend.schemas.mediciones_schema import MedicionCreate, MedicionUpdate, MedicionResponse
from backend.services.mediciones_service import (
    get_mediciones_service,
    get_medicion_by_id_service,
    create_medicion_service,
    patch_medicion_service,
    delete_medicion_service
)
from backend.exceptions.clientes_exceptions import ClienteNotFoundError
from backend.exceptions.auth_exceptions import UnauthorizedError
from backend.exceptions.mediciones_exceptions import(
    MedicionNotFoundError
)

router = APIRouter(prefix='/mediciones', tags=['Mediciones'])

@router.get("/", response_model=List[MedicionResponse])
async def get_all_mediciones_router(cliente_id:int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_mediciones_service(db=db, cliente_id=cliente_id)
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/{medicion_id}", response_model=MedicionResponse)
async def get_medicion_by_id_router(medicion_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_medicion_by_id_service(db, medicion_id)
    except MedicionNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/", response_model=MedicionResponse, status_code=status.HTTP_201_CREATED)
async def create_medicion_router(medicion_data: MedicionCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_medicion_service(db=db, medicion_data=medicion_data)
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.patch("/{medicion_id}", response_model=MedicionResponse)
async def update_medicion_router(medicion_id: int, medicion_data: MedicionUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_medicion_service(db=db, medicion_id=medicion_id, datos_nuevos=medicion_data)
    except MedicionNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))



@router.delete("/{medicion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_medicion_router(medicion_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_medicion_service(db=db, medicion_id=medicion_id)
        return None
    except MedicionNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    