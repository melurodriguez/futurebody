from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from futurebody.backend.database import get_db
from futurebody.backend.schemas.comidas_schema import ComidaCreate, ComidaResponse, ComidaUpdate
from futurebody.backend.services.comidas_service import (
    get_comidas_service,
    get_comida_by_id_Service,
    create_comida_service,
    patch_comida,
    delete_comida_service
)
from futurebody.backend.exceptions.clientes_exceptions import ClienteNotFoundError

from futurebody.backend.exceptions.comidas_exceptions import(
    ComidaAlreadyExistsError,
    ComidaNotFoundError,
    ComidaOwnershipError
)

router = APIRouter(prefix='/comidas', tags=['Comidas'])

@router.get("/", response_model=List[ComidaResponse])
async def get_all_comidas_router(db: AsyncSession = Depends(get_db)):
    return await get_comidas_service(db=db)

@router.get("/{comida_id}", response_model=ComidaResponse)
async def get_comida_by_id_router(comida_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_comida_by_id_Service(db, comida_id)
    except ComidaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/", response_model=ComidaResponse, status_code=status.HTTP_201_CREATED)
async def create_comida_router(comida_data: ComidaCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_comida_service(db=db, comida_data=comida_data)
    except ComidaAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/{comida_id}", response_model=ComidaResponse)
async def update_comida_router(comida_id: int, comida_data: ComidaUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_comida(db=db, comida_id=comida_id, datos_nuevos=comida_data)
    except ComidaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ComidaAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.delete("/{comida_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comida_router(comida_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_comida_service(db=db, comida_id=comida_id)
        return None
    except ComidaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))