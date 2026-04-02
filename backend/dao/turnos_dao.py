from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from backend.models.turnos_model import Turno, TipoEnum, EstadoEnum
from datetime import date

class TurnoDAO:

    @staticmethod
    async def get_all(db: AsyncSession, cliente_id: int | None = None, usuario_id:int = None) -> list[Turno]:
        """
        Si cliente_id tiene un valor, filtra los turnos. 
        Si es None (caso profesional), devuelve todos los turnos.
        """
        query = select(Turno)

        if cliente_id is not None:
            query = query.where(Turno.cliente_id == cliente_id)
        if usuario_id is not None:
            query=query.where(Turno.usuario_id == usuario_id)
        query = query.order_by(Turno.fecha.desc())

        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_by_id(db: AsyncSession, turno_id: int) -> Turno | None:
        return await db.get(Turno, turno_id)
    
    @staticmethod
    async def create(db: AsyncSession, data: dict) -> Turno:
        nuevo_turno = Turno(**data)
        db.add(nuevo_turno)
        return nuevo_turno
    
    @staticmethod
    async def patch(db: AsyncSession, turno_db: Turno, turno_data: dict) -> Turno:
        for key, value in turno_data.items():
            if hasattr(turno_db, key):
                setattr(turno_db, key, value)
        return turno_db
    
    @staticmethod
    async def delete(db: AsyncSession, turno_db: Turno) -> None:
        await db.delete(turno_db)

    @staticmethod
    async def turnos_por_semana(db: AsyncSession, cliente_id: int, inicio_semana: date, fin_semana: date) -> int:
        """Versión corregida para AsyncSession utilizando func.count"""
        query = (
            select(func.count(Turno.id))
            .where(
                Turno.cliente_id == cliente_id,
                Turno.tipo == TipoEnum.entrenamiento,
                Turno.estado != EstadoEnum.cancelado,
                Turno.fecha >= inicio_semana,
                Turno.fecha <= fin_semana
            )
        )
        result = await db.execute(query)
        return result.scalar() or 0