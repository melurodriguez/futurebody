from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from backend.database import get_db
from backend.schemas.usuarios_schema import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from backend.services.usuarios_service import (
    get_usuarios_service,
    get_usuario_by_id_service,
    create_usuario_service,
    patch_usuario_service,
    delete_usuario_service
)
from backend.exceptions.usuarios_exceptions import (
    EmailAlreadyRegisteredError, 
    UserNotFoundError
)

router = APIRouter(prefix='/usuarios', tags=['Usuarios'])

@router.get("/", response_model=List[UsuarioResponse])
async def get_all_users_router(rol:str=None, db: AsyncSession = Depends(get_db)):
    try:
        return await get_usuarios_service(db=db, rol=rol)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{usuario_id}", response_model=UsuarioResponse)
async def get_user_by_id_router(usuario_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await get_usuario_by_id_service(db, usuario_id)
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def create_user_router(usuario_data: UsuarioCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_usuario_service(db=db, usuario_data=usuario_data)
    except EmailAlreadyRegisteredError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.patch("/{usuario_id}", response_model=UsuarioResponse)
async def update_user_router(usuario_id: int, usuario_data: UsuarioUpdate, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_usuario_service(db=db, usuario_id=usuario_id, datos_nuevos=usuario_data)
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except EmailAlreadyRegisteredError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_router(usuario_id: int, db: AsyncSession = Depends(get_db)):
    try:
        await delete_usuario_service(db=db, usuario_id=usuario_id)
        return None
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))