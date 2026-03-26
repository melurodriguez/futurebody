from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from futurebody.backend.models.medidas_corporales_model import MedidaCorporal

class MedidaCorporalDAO:

    @staticmethod
    async def get_all(db: AsyncSession) -> List[MedidaCorporal]:
        """Obtiene todos las medidas."""
        result = await db.execute(select(MedidaCorporal))
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, medida_id: int) -> Optional[MedidaCorporal]:
        """Busca una medida por su ID primario utilizando el método optimizado .get()"""
        return await db.get(MedidaCorporal, medida_id)

    @staticmethod
    async def create(db: AsyncSession, medida: MedidaCorporal) -> MedidaCorporal:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        db.add(medida)
        return medida

    @staticmethod
    async def update(db: AsyncSession, medida_db: MedidaCorporal, update_data: dict) -> MedidaCorporal:
        """Aplica cambios parciales (PATCH) a una instancia existente."""
        for key, value in update_data.items():
            if hasattr(medida_db, key):
                setattr(medida_db, key, value)
        return medida_db

    @staticmethod
    async def delete(db: AsyncSession, medida_db: MedidaCorporal) -> None:
        """Marca una instancia para ser eliminada de la base de datos."""
        await db.delete(medida_db)