from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select, and_
from typing import List, Optional
from futurebody.backend.models.comidas_model import Comida
from datetime import date
import enum

class TipoComida(enum.Enum):
    desayuno = "desayuno"
    almuerzo = "almuerzo"
    merienda = "merienda"
    cena = "cena"


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
    async def create(db: AsyncSession, cliente_id: int, comida_data: dict) -> Comida:
        """Crea la instancia asegurando el cliente_id."""
        nueva_comida = Comida(**comida_data, cliente_id=cliente_id)
        db.add(nueva_comida)
        return nueva_comida

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

    @staticmethod
    async def get_by_date_and_type(db: AsyncSession, cliente_id: int, fecha: date, tipo: str):
        """
        Busca si ya existe una comida de ese tipo para ese cliente en esa fecha.
        """
        query = select(Comida).where(
            and_(
                Comida.cliente_id == cliente_id,
                Comida.fecha == fecha,
                Comida.tipo == tipo
            )
        )
        result = await db.execute(query)
        # Devolvemos el objeto encontrado (o None)
        return result.scalars().first()
        