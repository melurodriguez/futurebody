from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class RolEnum(str, Enum):
    cliente = "cliente"
    profesional = "profesional"


class UsuarioCreate(BaseModel):
    email: EmailStr
    password: str
    alias: Optional[str]
    rol: RolEnum


class UsuarioResponse(BaseModel):
    id: int
    email: EmailStr
    alias: Optional[str]
    rol: RolEnum

    class Config:
        from_attributes = True