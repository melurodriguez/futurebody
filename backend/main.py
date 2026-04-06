from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.core.tasks import scheduler
# Importación de Rutas (Controllers)
from backend.controllers.usuarios_controller import router as usuarios_route
from backend.controllers.turnos_controller import router as turnos_route
from backend.controllers.objetivos_controller import router as objetivos_route
from backend.controllers.auth_controller import router as auth_route
from backend.controllers.ciclo_menstrual_controller import router as ciclo_router
from backend.controllers.clientes_controller import router as clientes_router
from backend.controllers.comidas_controller import router as comidas_router
from backend.controllers.disponibilidad_controller import router as disponibilidad_router
from backend.controllers.mediciones_controller import router as mediciones_router
from backend.controllers.medidas_corporales_controller import router as medidas_router
from backend.controllers.config_controller import router as config_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando Scheduler de tareas automáticas...")
    scheduler.start() 
    
    yield 
    
    print("Apagando Scheduler...")
    scheduler.shutdown()


app = FastAPI(
    title="FutureBody API", 
    version="1.0.0",
    description="API para gestión de entrenamientos, turnos y objetivos de salud."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, reemplaza "*" por tu dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(usuarios_route)
app.include_router(turnos_route)
app.include_router(objetivos_route)
app.include_router(auth_route)
app.include_router(ciclo_router)
app.include_router(clientes_router)
app.include_router(comidas_router)
app.include_router(disponibilidad_router)
app.include_router(mediciones_router)
app.include_router(medidas_router)
app.include_router(config_router)


@app.get("/", tags=["Sistema"])
def root():
    return {"message": "FutureBody API funcionando 🚀"}

@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "ok"}