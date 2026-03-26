from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from futurebody.backend.models.ciclo_menstrual_model import CicloMenstrual

class CicloDAO:

    @staticmethod
    async def get_all_by_cliente(db: AsyncSession, cliente_id:int) -> List[CicloMenstrual]:
        """Obtiene todos los ciclos de un usuario."""
        result = await db.execute(select(CicloMenstrual).where(CicloMenstrual.cliente_id == cliente_id))
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, ciclo_id: int) -> Optional[CicloMenstrual]:
        """Busca un ciclo por su ID primario utilizando el método optimizado .get()"""
        return await db.get(CicloMenstrual, ciclo_id)

    @staticmethod
    async def create(db: AsyncSession, ciclo: CicloMenstrual) -> CicloMenstrual:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        db.add(ciclo)
        return ciclo

    @staticmethod
    async def update(db: AsyncSession, ciclo_db: CicloMenstrual, update_data: dict) -> CicloMenstrual:
        """Aplica cambios parciales (PATCH) a una instancia existente."""
        for key, value in update_data.items():
            if hasattr(ciclo_db, key):
                setattr(ciclo_db, key, value)
        return ciclo_db

    @staticmethod
    async def delete(db: AsyncSession, ciclo_db: CicloMenstrual) -> None:
        """Marca una instancia para ser eliminada de la base de datos."""
        await db.delete(ciclo_db)