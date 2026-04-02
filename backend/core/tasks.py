from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import date, timedelta
from backend.database import SessionLocal  
from backend.services.config_service import generar_disponibilidad_automatica_service
from backend.dao.usuarios_dao import UsuarioDAO

scheduler = AsyncIOScheduler()

async def tarea_diaria_generacion_bloques():
    async with SessionLocal() as db:
        fecha_futura = date.today() + timedelta(days=14)
        
        profesionales = await UsuarioDAO.get_all_profesionales(db=db)
        
        for prof in profesionales:
            try:
                # Generamos solo para ese día específico (semanas=0 o ajustando el loop)
                await generar_disponibilidad_automatica_service(
                    db=db, 
                    usuario_id=prof.id, 
                    fecha_inicio=fecha_futura, 
                    semanas=0 
                )
            except Exception as e:
                print(f"Error generando para el usuario {prof.id}: {e}")

#Programar para que corra todos los días a medianoche
scheduler.add_job(tarea_diaria_generacion_bloques, "cron", hour=0, minute=1)

#Iniciar (esto suele ir en el evento 'startup' de tu main.py)
scheduler.start()