from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from backend.database import get_db
from backend.schemas.objetivos_schema import ObjetivoCreate, ObjetivoResponse, ObjetivoUpdate
from backend.services.objetivos_service import (
    get_all_by_cliente_service,
    get_objetivo_by_id_service,
    create_objetivo_service,
    patch_objetivo_service,
    delete_objetivo_service
)
from backend.exceptions.clientes_exceptions import ClienteNotFoundError
from backend.exceptions.auth_exceptions import UnauthorizedError
from backend.exceptions.objetivos_exceptions import ObjetivoError, ObjetivoLimitReachedError, ObjetivoNotFoundError

##USUARIO_ID Y ES_PROFESIONAL CONTROLADOS CON UN DEPENDS(GET_CURRENT_ACTIVE_USER)

router = APIRouter(prefix='/objetivos', tags=['Objetivos'])

@router.get("/", response_model=List[ObjetivoResponse])
async def get_all_objetivos_router(cliente_id:int, usuario_id:int, es_profesional:bool, db: AsyncSession = Depends(get_db)):
    try:
        return await get_all_by_cliente_service(db=db, cliente_id=cliente_id, usuario_id=usuario_id, es_profesional=es_profesional)
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.get("/{objetivo_id}", response_model=ObjetivoResponse)
async def get_objetivo_by_id_router(objetivo_id: int, cliente_id:int, usuario_id:int, es_profesional:bool, db: AsyncSession = Depends(get_db)):
    try:
        return await get_objetivo_by_id_service(db=db, objetivo_id=objetivo_id, cliente_id=cliente_id, usuario_id=usuario_id, es_profesional=es_profesional)
    except ObjetivoNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/", response_model=ObjetivoResponse, status_code=status.HTTP_201_CREATED)
async def create_objetivo_router(objetivo_data: ObjetivoCreate, cleinte_id:int, es_profesional:bool, db: AsyncSession = Depends(get_db)):
    try:
        return await create_objetivo_service(db=db, objetivo_in=objetivo_data, cliente_id=cleinte_id, es_profesional=es_profesional)
    except ObjetivoLimitReachedError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.patch("/{objetivo_id}", response_model=ObjetivoResponse)
async def update_objetivo_router(objetivo_id: int, cliente_id: int, es_profesional: bool,objetivo_data: ObjetivoUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_objetivo_service(db=db, objetivo_id=objetivo_id, es_profesional=es_profesional, cliente_id=cliente_id,objetivo_data=objetivo_data)
    except ObjetivoNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))



@router.delete("/{objetivo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_objetivo_router(objetivo_id: int,cliente_id: int,
    es_profesional: bool, db: AsyncSession = Depends(get_db)):
    try:
        await delete_objetivo_service(db=db, cliente_id=cliente_id, es_profesional=es_profesional,objetivo_id=objetivo_id)
        return None
    except ObjetivoNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    