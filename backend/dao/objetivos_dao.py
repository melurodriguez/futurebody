from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from sqlalchemy import func
from futurebody.backend.models.objetivos_model import Objetivo

class ObjetivoDAO:

    @staticmethod
    async def get_all(db: AsyncSession, cliente_id:int) -> List[Objetivo]:
        """Obtiene todos los objetivos."""
        result = await db.execute(
            select(Objetivo).filter_by(cliente_id=cliente_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, objetivo_id: int, cliente_id:int) -> Optional[Objetivo]:
        """Busca un objetivo por su ID primario utilizando el método optimizado .get()"""
        result= await db.execute(
            select(Objetivo).filter_by(cliente_id=cliente_id, id=objetivo_id)
        )
        return result.scalar_one_or_none()

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


    @staticmethod
    async def get_stats_objetivos(db: AsyncSession, cliente_id: int, completo: bool | None):
        """
        Calcula el conteo de objetivos según el estado solicitado.
        """
        async def contar(estado: str) -> int:
            query = select(func.count(Objetivo.id)).filter_by(cliente_id=cliente_id, estado=estado)
            result = await db.execute(query)
            return result.scalar() or 0

        # Caso: Solo completados
        if completo is True:
            return await contar("completado")
        
        # Caso: Solo incompletos
        if completo is False:
            return await contar("incompleto")

        # Caso: Ambos (completo is None)
        completos = await contar("completado")
        incompletos = await contar("incompleto")
        
        return {
            "completos": completos,
            "incompletos": incompletos,
            "total": completos + incompletos
        }
    
    @staticmethod
    async def count_incompletos(db: AsyncSession, cliente_id: int) -> int:
        """Cuenta cuántos objetivos marcados como 'incompleto' tiene el cliente."""
        query = (
            select(func.count(Objetivo.id))
            .filter_by(cliente_id=cliente_id, estado="incompleto")
        )
        result = await db.execute(query)
        return result.scalar() or 0