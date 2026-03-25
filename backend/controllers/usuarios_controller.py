from fastapi import APIRouter

router=APIRouter(prefix='/usuarios', tags=['Usuarios'])

@router.get("/")
async def get_all_users_router():
    return []

@router.get("/{user_id}")
async def get_user_by_id_router():
    return []

@router.post("/")
async def create_user_router():
    return []

@router.put("/")
async def update_user_router():
    return []

@router.delete("/{user_id}")
async def delete_user_router():
    return []