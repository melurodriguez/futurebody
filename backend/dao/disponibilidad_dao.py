from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from backend.models.disponibilidad_model import Disponibilidad
from datetime import date, time

class DisponibilidadDAO:

    @staticmethod
    async def get_all(db: AsyncSession, usuario_id:int) -> List[Disponibilidad]:
        """Obtiene todos los disponibilidads."""
        result = await db.execute(select(Disponibilidad).where(Disponibilidad.usuario_id==usuario_id))
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, disponibilidad_id: int, usuario_id:int) -> Optional[Disponibilidad]:
        """Busca un disponibilidad por su ID primario utilizando el método optimizado .get()"""
        result= await db.execute(select(Disponibilidad).filter_by(id=disponibilidad_id,usuario_id=usuario_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def create(db: AsyncSession, disponibilidad: dict) -> Disponibilidad:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        nueva_dispo= Disponibilidad(**disponibilidad)
        db.add(nueva_dispo)
        return nueva_dispo

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