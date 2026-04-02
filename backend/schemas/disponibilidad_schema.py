from pydantic import BaseModel, ConfigDict, Field
from datetime import time, date
from typing import Optional
import enum

class EstadoEnum(str, enum.Enum):
    disponible="disponible"
    ocupado="ocupado"
    bloqueado="bloqueado"


class DisponibilidadBase(BaseModel):
    fecha: date
    hora_inicio: time = Field(..., example="09:00:00")
    hora_fin: time = Field(..., example="18:00:00")
    estado: EstadoEnum=Field(default=EstadoEnum.disponible)

class DisponibilidadCreate(DisponibilidadBase):
    usuario_id: int = Field(..., description="ID del usuario (profesional)")

class DisponibilidadUpdate(BaseModel):
    fecha: Optional[date]
    hora_inicio: Optional[time] = Field(example="09:00:00")
    hora_fin: Optional[time] = Field(example="18:00:00")
    estado: Optional[EstadoEnum]

class DisponibilidadResponse(DisponibilidadBase):
    id: int
    usuario_id: int

    model_config = ConfigDict(from_attributes=True)