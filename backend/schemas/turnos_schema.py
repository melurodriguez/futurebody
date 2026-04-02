from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from enum import Enum
from typing import Optional

class TipoEnum(str, Enum):
    entrenamiento = "entrenamiento"
    masaje = "masaje"

class EstadoEnum(str, Enum):
    pendiente = "pendiente"
    confirmado = "confirmado"
    cancelado = "cancelado"

class TurnoBase(BaseModel):
    tipo: TipoEnum = Field(default=TipoEnum.entrenamiento)
    fecha: datetime = Field(..., description="Fecha y hora del turno")

    estado: EstadoEnum = Field(default=EstadoEnum.pendiente)

class TurnoCreate(TurnoBase):
    cliente_id: int = Field(..., description="ID del cliente que reserva")
    usuario_id: int = Field(..., description="ID del profesional asignado")

class TurnoUpdate(BaseModel):
    tipo: Optional[TipoEnum] = None
    fecha: Optional[datetime] = None
    estado: Optional[EstadoEnum] = None

class TurnoResponse(TurnoBase):
    id: int
    cliente_id: int
    usuario_id: int

    model_config = ConfigDict(from_attributes=True)


# # Suponiendo que ya tienes ClienteResponse definido
# class TurnoDetalladoResponse(TurnoResponse):
#     cliente: Optional["ClienteResponse"] = None 
#     # Esto traerá el objeto cliente anidado en el JSON