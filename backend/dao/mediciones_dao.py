from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from backend.models.mediciones_model import Medicion

class MedicionDAO:

    @staticmethod
    async def get_all(db: AsyncSession,  cliente_id: int) -> List[Medicion]:
        """Obtiene todos las mediciones."""
        result = await db.execute(select(Medicion).filter_by(cliente_id=cliente_id))
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, medicion_id: int,  cliente_id: int) -> Optional[Medicion]:
        """Busca una medicion por su ID primario utilizando el método optimizado .get()"""
        result= await db.execute(select(Medicion).filter_by(id=medicion_id, cliente_id=cliente_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def create(db: AsyncSession, cliente_id:int ,medicion: dict) -> Medicion:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        nueva_medicion=Medicion(**medicion, cliente_id=cliente_id)
        db.add(nueva_medicion)
        return nueva_medicion

    @staticmethod
    async def update(db: AsyncSession, medicion_db: Medicion, update_data: dict) -> Medicion:
        """Aplica cambios parciales (PATCH) a una instancia existente."""
        for key, value in update_data.items():
            if hasattr(medicion_db, key):
                setattr(medicion_db, key, value)
        return medicion_db

    @staticmethod
    async def delete(db: AsyncSession, medicion_db: Medicion) -> None:
        """Marca una instancia para ser eliminada de la base de datos."""
        await db.delete(medicion_db)