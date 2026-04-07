from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract, text, case
from datetime import date, datetime, timedelta
from typing import List, Optional
from backend.models.clientes_model import Cliente
from sqlalchemy.orm import selectinload
from backend.models.usuarios_model import Usuario
from backend.models.turnos_model import Turno

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

    @staticmethod
    async def calculate_stats(db: AsyncSession, mes_anterior: date, fecha_actual: date):
        """Calcula estadísticas detalladas de Engagement y Uso de la App"""
        
        # 1. CLIENTES NUEVOS, ACTIVOS E INACTIVOS (Optimizados con count)
        def get_user_count_query(is_active=None, start_date=None):
            query = select(func.count(Usuario.id)).where(Usuario.rol == "cliente")
            if is_active is not None:
                query = query.where(Usuario.is_active == is_active)
            if start_date:
                query = query.where(Usuario.creado_en >= start_date, Usuario.creado_en <= fecha_actual)
            return query

        total_clientes = (await db.execute(get_user_count_query(start_date=mes_anterior))).scalar() or 0
        total_activos = (await db.execute(get_user_count_query(is_active=True))).scalar() or 0
        total_inactivos = (await db.execute(get_user_count_query(is_active=False))).scalar() or 0

        turnos_mes_query = select(
            func.count(Turno.id).label("total"),
            func.sum(case((Turno.estado == "completado", 1), else_=0)).label("asistidos"),
            func.sum(case((Turno.estado == "ausente", 1), else_=0)).label("no_show")
        ).where(Turno.fecha >= mes_anterior, Turno.fecha <= fecha_actual)
        
        res_turnos = await db.execute(turnos_mes_query)
        stats_turnos = res_turnos.first()
        
        total_reservas = stats_turnos.total or 0
        asistidos = stats_turnos.asistidos or 0
        no_show = stats_turnos.no_show or 0
        
        tasa_asistencia = round((asistidos / total_reservas * 100), 1) if total_reservas > 0 else 0

        # 3. PROMEDIO DE SESIONES
        promedio_sesiones = round(asistidos / total_activos, 1) if total_activos > 0 else 0



        return {
            "usuarios": {
                "nuevos_mes": total_clientes,
                "activos": total_activos,
                "inactivos": total_inactivos,
            },
            "engagement": {
                "tasa_asistencia": tasa_asistencia,
                "no_show_count": stats_turnos.no_show or 0,
                "sesiones_promedio_por_cliente": promedio_sesiones,
            },

        }