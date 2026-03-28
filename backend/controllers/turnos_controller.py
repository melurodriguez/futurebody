from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from backend.database import get_db
from backend.schemas.turnos_schema import TurnoCreate, TurnoResponse, TurnoUpdate
from backend.services.turnos_service import (
    get_all_turnos_service,
    get_turno_by_id_service,
    create_turno_service,
    patch_turno_service,
    delete_turno_service
)
from backend.exceptions.usuarios_exceptions import UserNotFoundError

from backend.exceptions.turnos_exceptions import (
   TurnoError,
   TurnoNotFoundError,
   LateCancellationError,
   TurnoConflictError,
   InvalidAmountPerWeekError,
   TurnoUpdateNotAllowedError,
   UnauthorizedTurnoAccessError
)

router = APIRouter(prefix='/turnos', tags=['Turnos'])

@router.get("/", response_model=List[TurnoResponse])
async def get_all_turnos_router(usuario_id:int=None, rol:str=None, db: AsyncSession = Depends(get_db)):
    return await get_all_turnos_service(db=db, usuario_id=usuario_id, rol=rol )

@router.get("/{turno_id}", response_model=TurnoResponse)
async def get_turno_by_id_router(turno_id: int, usuario_id:int=None, rol:str=None, db: AsyncSession = Depends(get_db)):
    try:
        return await get_turno_by_id_service(db, turno_id, usuario_id, rol)
    except TurnoNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/", response_model=TurnoResponse, status_code=status.HTTP_201_CREATED)
async def create_turno_router(cliente_id:int, turno_data: TurnoCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_turno_service(db=db, turno_data=turno_data, cliente_id=cliente_id)
    except TurnoConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except InvalidAmountPerWeekError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.patch("/{turno_id}", response_model=TurnoResponse)
async def update_turno_router(turno_id: int, turno_data: TurnoUpdate, rol:str=None, usuario_id:int=None, db: AsyncSession = Depends(get_db)):
    try:
        return await patch_turno_service(db=db, turno_id=turno_id, update_dict=turno_data, usuario_id=usuario_id, rol=rol)
    except TurnoNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except TurnoConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except UnauthorizedTurnoAccessError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except TurnoUpdateNotAllowedError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except LateCancellationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{turno_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_turno_router(turno_id: int,usuario_id:int=None, db: AsyncSession = Depends(get_db)):
    try:
        await delete_turno_service(db=db, turno_id=turno_id, usuario_id=usuario_id)
        return None
    except TurnoNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedTurnoAccessError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except UserNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))