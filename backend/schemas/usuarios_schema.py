from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from enum import Enum
from datetime import datetime

class RolEnum(str, Enum):
    cliente = "cliente"
    profesional = "profesional"

class UsuarioBase(BaseModel):
    email: EmailStr = Field(..., description="Email del usuario")
    alias: Optional[str] = Field(None, max_length=20)
    is_active: bool=Field( default=True)
    is_profile_complete: bool = Field(default=False)

class UsuarioCreate(UsuarioBase):
    password: str = Field(
        ..., 
        min_length=8,
        max_length=100,
        description="Contraseña del usuario"
    )
    rol: RolEnum = Field(
        default=RolEnum.cliente,
        description="El rol determina los permisos"
    )

class UsuarioUpdate(BaseModel):
    email: Optional[EmailStr] = None
    alias: Optional[str] = None
    is_active: Optional[bool] = None
    is_profile_complete: Optional[bool] = None
    password: Optional[str] = Field(None, min_length=8)

class UsuarioResponse(UsuarioBase):
    id: int = Field(..., gt=0)
    rol: RolEnum
    creado_en: datetime = Field(..., serialization_alias="registered_at")

    # Pydantic V2 usa model_config en lugar de class Config
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)