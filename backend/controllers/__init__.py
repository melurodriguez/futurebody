from .usuarios_controller import router as usuarios_router
from .auth_controller import router as auth_router


all_routers = [
    (usuarios_router, "/usuarios", ["Usuarios"]),
    (auth_router, "/auth", ["Auth"]),

]