from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from futurebody.backend.models.comidas_model import Comida

class ComidaDao:

    @staticmethod
    async def get_all_by_cliente(db: AsyncSession, cliente_id: int) -> List[Comida]:
        """Obtiene todas las comidas que pertenecen a un cliente específico."""
        result = await db.execute(
            select(Comida).filter_by(cliente_id=cliente_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, comida_id: int, cliente_id: int) -> Optional[Comida]:
        """
        Busca una comida específica asegurándose de que pertenezca al cliente.
        Esto evita que un usuario acceda a datos ajenos adivinando IDs.
        """
        result = await db.execute(
            select(Comida).filter_by(id=comida_id, cliente_id=cliente_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def create(db: AsyncSession, comida: Comida) -> Comida:
        """Añade la instancia al contexto (el cliente_id ya viene dentro del objeto comida)."""
        db.add(comida)
        return comida

    @staticmethod
    async def update(db: AsyncSession, comida_db: Comida, update_data: dict) -> Comida:
        """Aplica cambios parciales (PATCH)."""
        for key, value in update_data.items():
            if hasattr(comida_db, key):
                setattr(comida_db, key, value)
        return comida_db

    @staticmethod
    async def delete(db: AsyncSession, comida_db: Comida) -> None:
        """Marca la instancia para eliminación."""
        await db.delete(comida_db)