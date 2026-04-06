from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert
from backend.models.config_usuario_model import ConfiguracionCoach
from typing import Optional
from datetime import date
from backend.models.disponibilidad_model import Disponibilidad
from sqlalchemy import delete, and_

class ConfiguracionCoachDAO:
    
    @staticmethod
    async def get_by_usuario_id(db: AsyncSession, usuario_id: int) -> Optional[ConfiguracionCoach]:
        """Obtiene la configuración de horarios de un coach específico."""
        query = select(ConfiguracionCoach).where(ConfiguracionCoach.usuario_id == usuario_id)
        result = await db.execute(query)
        return result.scalars().first()

    @staticmethod
    async def upsert_configuracion(db: AsyncSession, usuario_id: int, data: dict):
        """
        Crea o actualiza la configuración. 
        Si no existe, la crea con los valores por defecto + los enviados.
        """
        config_existente = await ConfiguracionCoachDAO.get_by_usuario_id(db, usuario_id)
        
        if config_existente:
            # Actualizar
            stmt = (
                update(ConfiguracionCoach)
                .where(ConfiguracionCoach.usuario_id == usuario_id)
                .values(**data)
            )
            await db.execute(stmt)
        else:
            # Crear nuevo
            nueva_config = ConfiguracionCoach(usuario_id=usuario_id, **data)
            db.add(nueva_config)
        
        await db.commit()
        return await ConfiguracionCoachDAO.get_by_usuario_id(db, usuario_id)

    @staticmethod
    async def get_all_profesionales_configs(db: AsyncSession):
        """Trae todas las configuraciones para la tarea de automatización diaria."""
        query = select(ConfiguracionCoach)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def create_config(db:AsyncSession, config_data:dict):
        nueva_config= ConfiguracionCoach(**config_data)
        db.add(nueva_config)
        return nueva_config
    
    @staticmethod
    async def eliminar_bloques_disponibles_rango(
        db: AsyncSession, 
        coach_id: int, 
        fecha_inicio: date, 
        fecha_fin: date
    ):
        """
        Elimina bloques que no han sido reservados en un rango de fechas.
        """
        stmt = (
            delete(Disponibilidad)
            .where(
                and_(
                    Disponibilidad.usuario_id == coach_id,
                    Disponibilidad.fecha >= fecha_inicio,
                    Disponibilidad.fecha <= fecha_fin,
                    Disponibilidad.estado == "disponible" # CRÍTICO: No borrar 'ocupado'
                )
            )
        )
        await db.execute(stmt)