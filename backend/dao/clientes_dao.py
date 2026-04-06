from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from backend.models.clientes_model import Cliente
from sqlalchemy.orm import selectinload

class ClienteDAO:

    @staticmethod
    async def get_all(db: AsyncSession) -> List[Cliente]:
        """Obtiene todos los clientes."""
        result = await db.execute(select(Cliente))
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, cliente_id: int) -> Optional[Cliente]:
        """Busca un cliente por su ID primario utilizando el método optimizado """
        query = (
            select(Cliente)
            .options(
                selectinload(Cliente.turnos), 
                selectinload(Cliente.objetivos),
                selectinload(Cliente.mediciones),
                selectinload(Cliente.medidas_corporales)
            )
            .where(Cliente.id == cliente_id)
        )
        result = await db.execute(query)
        return result.scalars().first()

    @staticmethod
    async def create(db: AsyncSession, cliente: dict) -> Cliente:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        nuevo_cliente= Cliente(**cliente)
        db.add(nuevo_cliente)
        return nuevo_cliente

    @staticmethod
    async def update(db: AsyncSession, cliente_db: Cliente, update_data: dict) -> Cliente:
        """Aplica cambios parciales (PATCH) a una instancia existente."""
        for key, value in update_data.items():
            if hasattr(cliente_db, key):
                setattr(cliente_db, key, value)
        return cliente_db

    @staticmethod
    async def delete(db: AsyncSession, cliente_db: Cliente) -> None:
        """Marca una instancia para ser eliminada de la base de datos."""
        await db.delete(cliente_db)