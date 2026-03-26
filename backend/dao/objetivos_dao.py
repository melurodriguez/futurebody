from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from futurebody.backend.models.objetivos_model import Objetivo

class ObjetivoDAO:

    @staticmethod
    async def get_all(db: AsyncSession) -> List[Objetivo]:
        """Obtiene todos los objetivos."""
        result = await db.execute(select(Objetivo))
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, objetivo_id: int) -> Optional[Objetivo]:
        """Busca un objetivo por su ID primario utilizando el método optimizado .get()"""
        return await db.get(Objetivo, objetivo_id)

    @staticmethod
    async def create(db: AsyncSession, objetivo: Objetivo) -> Objetivo:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        db.add(objetivo)
        return objetivo

    @staticmethod
    async def update(db: AsyncSession, objetivo_db: Objetivo, update_data: dict) -> Objetivo:
        """Aplica cambios parciales (PATCH) a una instancia existente."""
        for key, value in update_data.items():
            if hasattr(objetivo_db, key):
                setattr(objetivo_db, key, value)
        return objetivo_db

    @staticmethod
    async def delete(db: AsyncSession, objetivo_db: Objetivo) -> None:
        """Marca una instancia para ser eliminada de la base de datos."""
        await db.delete(objetivo_db)