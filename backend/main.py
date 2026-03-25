from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.usuarios_controller import router as usuarios_route

app= FastAPI(title="FutureBody API",  version="1.0.0")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # después restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


routers=[
    usuarios_route,
]

for router in routers:
    app.include_router(router=router)

@app.get("/")
def root():
    return {"message": "FutureBody API funcionando 🚀"}

# Health check
@app.get("/health")
def health():
    return {"status": "ok"}