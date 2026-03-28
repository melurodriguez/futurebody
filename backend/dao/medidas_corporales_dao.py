from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from futurebody.backend.models.medidas_corporales_model import MedidaCorporal

class MedidaCorporalDAO:

    @staticmethod
    async def get_all_by_cliente(db: AsyncSession, cliente_id: int) -> List[MedidaCorporal]:
        """Solo obtiene las medidas de este cliente."""
        result = await db.execute(
            select(MedidaCorporal).filter_by(cliente_id=cliente_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, medida_id: int, cliente_id: int) -> Optional[MedidaCorporal]:
        """Busca la medida pero VALIDA que pertenezca al cliente."""
        result = await db.execute(
            select(MedidaCorporal).filter_by(id=medida_id, cliente_id=cliente_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def create(db: AsyncSession, cliente_id:int ,medida: dict) -> MedidaCorporal:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        nueva_medida=MedidaCorporal(**medida, cliente_id=cliente_id)
        db.add(nueva_medida)
        return nueva_medida

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