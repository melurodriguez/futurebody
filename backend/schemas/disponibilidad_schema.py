from pydantic import BaseModel, ConfigDict, Field
from datetime import time
from enum import Enum
from typing import Optional

class DiaEnum(str, Enum):
    lunes = "lunes"
    martes = "martes"
    miercoles = "miercoles"
    jueves = "jueves"
    viernes = "viernes"
    sabado = "sabado"
    domingo = "domingo"

class DisponibilidadBase(BaseModel):
    dia_semana: DiaEnum
    hora_inicio: time = Field(..., example="09:00:00")
    hora_fin: time = Field(..., example="18:00:00")

class DisponibilidadCreate(DisponibilidadBase):
    usuario_id: int = Field(..., description="ID del usuario (profesional)")

class DisponibilidadUpdate(BaseModel):
    dia_semana: Optional[DiaEnum]
    hora_inicio: Optional[time] = Field(example="09:00:00")
    hora_fin: Optional[time] = Field(example="18:00:00")

class DisponibilidadResponse(DisponibilidadBase):
    id: int
    usuario_id: int

    model_config = ConfigDict(from_attributes=True)