from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from backend.database import get_db
from backend.schemas.medidas_corporales_schema import MedidaCorporalCreate, MedidaCorporalResponse, MedidaCorporalUpdate
from backend.services.medidas_corporales_service import (
    get_medidas_service,
    get_medida_by_id_service,
    create_medida_service,
    patch_medida_service,
    delete_medida_service
)
from backend.exceptions.clientes_exceptions import ClienteNotFoundError
from backend.exceptions.auth_exceptions import UnauthorizedError
from backend.exceptions.medidas_corporales_exceptions import(
    MedidaCorporalNotFoundError
)

router = APIRouter(prefix='/medidas', tags=['Medidas'])

@router.get("/", response_model=List[MedidaCorporalUpdate])
async def get_all_medidas_router(cliente_id:int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_medidas_service(db=db, cliente_id=cliente_id)
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/{medida_id}", response_model=MedidaCorporalUpdate)
async def get_medida_by_id_router(medida_id: int,cliente_id:int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_medida_by_id_service(db, medida_id, cliente_id=cliente_id)
    except MedidaCorporalNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/", response_model=MedidaCorporalUpdate, status_code=status.HTTP_201_CREATED)
async def create_medida_router(cliente_id:int, es_profesional:bool, medida_data: MedidaCorporalCreate=Body(...), db: AsyncSession = Depends(get_db)):
    try:
        return await create_medida_service(db=db, medida_data=medida_data, cliente_id=cliente_id, es_profesional=es_profesional)
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.patch("/{medida_id}", response_model=MedidaCorporalUpdate)
async def update_medida_router(cliente_id:int, es_profesional:bool, medida_id: int, medida_data: MedidaCorporalUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_medida_service(db=db, medida_id=medida_id, datos_nuevos=medida_data, cliente_id=cliente_id, es_profesional=es_profesional)
    except MedidaCorporalNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))



@router.delete("/{medida_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_medida_router(cliente_id:int, es_profesional:bool, medida_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_medida_service(db=db, medida_id=medida_id, cliente_id=cliente_id, es_profesional=es_profesional)
        return None
    except MedidaCorporalNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    