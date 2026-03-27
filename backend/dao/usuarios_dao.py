from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from futurebody.backend.models.usuarios_model import Usuario

class UsuarioDAO:

    @staticmethod
    async def get_all(db: AsyncSession) -> List[Usuario]:
        """Obtiene todos los usuarios."""
        result = await db.execute(select(Usuario))
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(db: AsyncSession, usuario_id: int) -> Optional[Usuario]:
        """Busca un usuario por su ID primario utilizando el método optimizado .get()"""
        return await db.get(Usuario, usuario_id)
    
    @staticmethod
    async def get_by_email(db:AsyncSession, email:str):
        """Busca un usuario por su email"""
        return await db.get(Usuario, email)

    @staticmethod
    async def create(db: AsyncSession, usuario: Usuario) -> Usuario:
        """Añade la instancia al contexto de la sesión (sin commit)."""
        db.add(usuario)
        return usuario

    @staticmethod
    async def update(db: AsyncSession, usuario_db: Usuario, update_data: dict) -> Usuario:
        """Aplica cambios parciales (PATCH) a una instancia existente."""
        for key, value in update_data.items():
            if hasattr(usuario_db, key):
                setattr(usuario_db, key, value)
        return usuario_db

    @staticmethod
    async def delete(db: AsyncSession, usuario_db: Usuario) -> None:
        """Marca una instancia para ser eliminada de la base de datos."""
        await db.delete(usuario_db)