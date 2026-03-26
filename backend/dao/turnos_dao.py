from sqlalchemy.ext.asyncio import AsyncSession
from futurebody.backend.models.turnos_model import Turno, TipoEnum, EstadoEnum
from sqlalchemy import select
from datetime import date,datetime

class TurnoDAO:


    @staticmethod
    async def get_all(db:AsyncSession, cliente_id:int | None, usuario_id: int | None) -> list[Turno]:
        query=select(Turno)

        if cliente_id is not None:
            query=query.where(Turno.cliente_id==cliente_id)
        

        if usuario_id is not None:
            query=query.where(Turno.usuario_id==usuario_id)

        result= await db.execute(query)

        return result.scalars().all()
    
    @staticmethod
    async def get_by_id(db:AsyncSession, turno_id:int)->Turno|None:
        """Busca un cliente por su ID primario utilizando el método optimizado .get()"""
        ##VALIDAR EN EL SERVICE
        return await db.get(Turno,turno_id)
    
    @staticmethod
    async def create(db:AsyncSession, turno:Turno)->Turno:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        await db.add(turno)
        return turno
    
    @staticmethod
    async def patch(db:AsyncSession, turno_db:Turno, turno_data:dict)->Turno:
        """Aplica cambios parciales (PATCH) a una instancia existente."""
        for key, value in turno_data.items():
            if hasattr(turno_db, key):
                setattr(turno_db, key, value)
        return turno_db
    
    @staticmethod
    async def delete(db:AsyncSession, turno_db:Turno)->None:
        await db.delete(turno_db)

    @staticmethod
    async def turnos_por_semana(db:AsyncSession, cliente_id:int, inicio_semana:date, fin_semana:date):
        conteo = db.query(Turno).filter(
        Turno.cliente_id == cliente_id,
        Turno.tipo == TipoEnum.entrenamiento,
        Turno.estado != EstadoEnum.cancelado,
        Turno.fecha >= inicio_semana,
        Turno.fecha <= fin_semana
        ).count()

        return conteo