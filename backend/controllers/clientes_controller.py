from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from backend.exceptions.usuarios_exceptions import UserNotFoundError
from backend.database import get_db
from backend.schemas.clientes_schema import ClienteCreate, ClienteUpdate, ClienteResponse, ClienteDetalleResponse
from backend.services.clientes_service import (
    get_clientes_service,
    get_cliente_by_id,
    create_cliente_service,
    patch_cliente_service,
    delete_cliente_service
)
from backend.exceptions.clientes_exceptions import ClienteAlreadyExistsError,ClienteError,ClienteNotFoundError,IncompatibleGenderDataError,InvalidBirthDateError

router = APIRouter(prefix='/clientes', tags=['Clientes'])

@router.get("/", response_model=List[ClienteResponse])
async def get_all_clientes_router(db: AsyncSession = Depends(get_db)):
    return await get_clientes_service(db=db)

@router.get("/{cliente_id}", response_model=ClienteDetalleResponse)
async def get_cliente_by_id_router(cliente_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_cliente_by_id(db, cliente_id)
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
async def create_cliente_router(cliente_data: ClienteCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_cliente_service(db=db, cliente_data=cliente_data)
    except ClienteAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except InvalidBirthDateError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.patch("/{cliente_id}", response_model=ClienteResponse)
async def update_cliente_router(cliente_id: int, cliente_data: ClienteUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_cliente_service(db=db, cliente_id=cliente_id, cliente_data=cliente_data)
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ClienteAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cliente_router(cliente_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_cliente_service(db=db, cliente_id=cliente_id)
        return None
    except ClienteNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))