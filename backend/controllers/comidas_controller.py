from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from backend.exceptions.auth_exceptions import UnauthorizedError
from backend.database import get_db
from backend.schemas.comidas_schema import ComidaCreate, ComidaResponse, ComidaUpdate
from backend.services.comidas_service import (
    get_comidas_service,
    get_comida_by_id_Service,
    create_comida_service,
    patch_comida,
    delete_comida_service
)
from backend.exceptions.clientes_exceptions import ClienteNotFoundError

from backend.exceptions.comidas_exceptions import(
    ComidaAlreadyExistsError,
    ComidaNotFoundError,
    ComidaOwnershipError
)
##EN CICLO Y COMIDAS EL CLIENTE ID ES POR DEPENDS(GET_CURRENT_ACTIVE_USER)
router = APIRouter(prefix='/comidas', tags=['Comidas'])

@router.get("/", response_model=List[ComidaResponse])
async def get_all_comidas_router(cliente_id:int,db: AsyncSession = Depends(get_db)):
    try:
        return await get_comidas_service(db=db, cliente_id=cliente_id)
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/{comida_id}", response_model=ComidaResponse)
async def get_comida_by_id_router(comida_id: int,cliente_id:int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_comida_by_id_Service(db=db, comida_id=comida_id, cliente_id=cliente_id)
    except ComidaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/", response_model=ComidaResponse, status_code=status.HTTP_201_CREATED)
async def create_comida_router(comida_data: ComidaCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_comida_service(db=db, comida=comida_data, cliente_id=comida_data.cliente_id)
    except ComidaAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/{comida_id}", response_model=ComidaResponse)
async def update_comida_router(comida_id: int, cliente_id:int,comida_data: ComidaUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_comida(db=db, comida_id=comida_id, comida_data=comida_data, cliente_id=cliente_id)
    except ComidaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ComidaAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.delete("/{comida_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comida_router(comida_id: int, cliente_id:int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_comida_service(db=db, comida_id=comida_id, cliente_id=cliente_id)
        return None
    except ComidaNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))