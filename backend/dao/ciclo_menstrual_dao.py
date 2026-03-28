# futurebody/backend/dao/ciclo_menstrual_dao.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from backend.models.ciclo_menstrual_model import CicloMenstrual

class CicloDAO:

    @staticmethod
    async def get_all_by_cliente(db: AsyncSession, cliente_id: int) -> List[CicloMenstrual]:
        """Obtiene todos los ciclos de un cliente específico."""
        result = await db.execute(
            select(CicloMenstrual).where(CicloMenstrual.cliente_id == cliente_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, ciclo_id: int, cliente_id: int) -> Optional[CicloMenstrual]:
        """
        Busca un ciclo por su ID, pero filtrando por cliente_id para 
        garantizar que el usuario solo acceda a su propia información.
        """
        query = select(CicloMenstrual).where(
            CicloMenstrual.id == ciclo_id,
            CicloMenstrual.cliente_id == cliente_id
        )
        result = await db.execute(query)
        return result.scalars().first()

    @staticmethod
    async def create(db: AsyncSession, cliente_id: int, data: dict) -> CicloMenstrual:
        """
        Crea la instancia del modelo a partir de un diccionario y 
        asegura la vinculación con el cliente_id.
        """
        nuevo_ciclo = CicloMenstrual(**data, cliente_id=cliente_id)
        db.add(nuevo_ciclo)
        return nuevo_ciclo

    @staticmethod
    async def update(db: AsyncSession, ciclo_db: CicloMenstrual, update_data: dict) -> CicloMenstrual:
        """Aplica cambios parciales (PATCH) a una instancia ya cargada en la sesión."""
        for key, value in update_data.items():
            if hasattr(ciclo_db, key):
                setattr(ciclo_db, key, value)
        return ciclo_db

    @staticmethod
    async def delete(db: AsyncSession, ciclo_db: CicloMenstrual) -> None:
        """Marca una instancia para ser eliminada físicamente de la DB."""
        await db.delete(ciclo_db)