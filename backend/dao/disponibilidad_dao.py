from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from backend.models.disponibilidad_model import Disponibilidad
from sqlalchemy import select, delete, and_, update
from datetime import datetime, timedelta, date, time
from backend.models.usuarios_model import Usuario
from backend.models.config_usuario_model import ConfiguracionCoach

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
                Disponibilidad.hora_fin > inicio,
                Disponibilidad.estado != "ocupado",
                Disponibilidad.estado!="bloqueado"
            )
        )
        if exclude_id:
            query = query.where(Disponibilidad.id != exclude_id)
        
        result = await db.execute(query)
        return result.scalars().first() is None  # True si está libre
    



    @staticmethod
    async def generar_bloques_masivos(
        db: AsyncSession, 
        coach_id: int, 
        config: "ConfiguracionCoach", 
        fecha_inicio: date, 
        semanas: int
    ):
        # 1. Obtener bloques ocupados antes de limpiar para saber qué reasignar
        fecha_fin = fecha_inicio + timedelta(days=semanas * 7)
        stmt_ocupados = select(Disponibilidad).where(
            and_(
                Disponibilidad.usuario_id == coach_id,
                Disponibilidad.fecha >= fecha_inicio,
                Disponibilidad.fecha <= fecha_fin,
                Disponibilidad.estado == 'ocupado'
            )
        )
        res = await db.execute(stmt_ocupados)
        bloques_a_reasignar = res.scalars().all()


        await db.execute(
            delete(Disponibilidad).where(
                and_(
                    Disponibilidad.usuario_id == coach_id,
                    Disponibilidad.fecha >= fecha_inicio,
                    Disponibilidad.fecha <= fecha_fin
                )
            )
        )

        # 3. Generar la "Malla" ideal según la nueva configuración
        dias_permitidos = [int(d) for d in config.dias_laborales.split(",")]
        malla_nueva = []
        total_dias = max(semanas * 7, 1)

        for i in range(total_dias):
            fecha_actual = fecha_inicio + timedelta(days=i)
            if fecha_actual.weekday() in dias_permitidos:
                hora_puntero = datetime.combine(fecha_actual, config.hora_inicio)
                hora_fin_jornada = datetime.combine(fecha_actual, config.hora_fin)
                
                while hora_puntero + timedelta(minutes=config.duracion_sesion_min) <= hora_fin_jornada:
                    h_fin = (hora_puntero + timedelta(minutes=config.duracion_sesion_min)).time()
                    
                    # Crear objeto base (estado disponible por defecto)
                    malla_nueva.append({
                        "usuario_id": coach_id,
                        "fecha": fecha_actual,
                        "hora_inicio": hora_puntero.time(),
                        "hora_fin": h_fin,
                        "estado": "disponible",
                        "cliente_id": None # Inicialmente vacío
                    })
                    hora_puntero += timedelta(minutes=config.duracion_sesion_min)

        for ocupado in bloques_a_reasignar:
            mejor_match = None
            min_diff = timedelta(hours=24)

            for nuevo in malla_nueva:
                if nuevo["fecha"] == ocupado.fecha:
                    dt_viejo = datetime.combine(date.min, ocupado.hora_inicio)
                    dt_nuevo = datetime.combine(date.min, nuevo["hora_inicio"])
                    diff = abs(dt_viejo - dt_nuevo)

                    if diff < min_diff:
                        min_diff = diff
                        mejor_match = nuevo
            
            if mejor_match:
                mejor_match["estado"] = "ocupado"
                mejor_match["cliente_id"] = ocupado.cliente_id

        objetos_finales = [Disponibilidad(**datos) for datos in malla_nueva]
        if objetos_finales:
            db.add_all(objetos_finales)

        return {
            "message": f"Agenda regenerada. {len(bloques_a_reasignar)} turnos reasignados a los horarios más cercanos."
        }