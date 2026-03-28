from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select, and_
from typing import List, Optional
from futurebody.backend.models.disponibilidad_model import Disponibilidad
from datetime import date, time

class DisponibilidadDAO:

    @staticmethod
    async def get_all(db: AsyncSession) -> List[Disponibilidad]:
        """Obtiene todos los disponibilidads."""
        result = await db.execute(select(Disponibilidad))
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, disponibilidad_id: int) -> Optional[Disponibilidad]:
        """Busca un disponibilidad por su ID primario utilizando el método optimizado .get()"""
        return await db.get(Disponibilidad, disponibilidad_id)

    @staticmethod
    async def create(db: AsyncSession, disponibilidad: Disponibilidad) -> Disponibilidad:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        db.add(disponibilidad)
        return disponibilidad

    @staticmethod
    async def update(db: AsyncSession, disponibilidad_db: Disponibilidad, update_data: dict) -> Disponibilidad:
        """Aplica cambios parciales (PATCH) a una instancia existente."""
        for key, value in update_data.items():
            if hasattr(disponibilidad_db, key):
                setattr(disponibilidad_db, key, value)
        return disponibilidad_db

    @staticmethod
    async def delete(db: AsyncSession, disponibilidad_db: Disponibilidad) -> None:
        """Marca una instancia para ser eliminada de la base de datos."""
        await db.delete(disponibilidad_db)


    @staticmethod
    async def is_disponible(db: AsyncSession, usuario_id: int, fecha: date, inicio: time, fin: time, exclude_id: int = None):
        query = select(Disponibilidad).where(
            and_(
                Disponibilidad.usuario_id == usuario_id,
                Disponibilidad.fecha == fecha,
                Disponibilidad.hora_inicio < fin,
                Disponibilidad.hora_fin > inicio
            )
        )
        if exclude_id:
            query = query.where(Disponibilidad.id != exclude_id)
        
        result = await db.execute(query)
        return result.scalars().first() is None  # True si está libre