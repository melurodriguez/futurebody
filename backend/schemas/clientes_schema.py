from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from enum import Enum
from datetime import date, datetime

class SexoEnum(str, Enum):
    hombre = "hombre"
    mujer = "mujer"

class ClienteBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    telefono: Optional[str] = Field(None, max_length=20)
    sexo: SexoEnum = SexoEnum.hombre
    fecha_nacimiento: date 

class ClienteCreate(ClienteBase):
    id:  int = Field(..., gt=0)

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str]= None
    sexo: Optional[SexoEnum] = None
    fecha_nacimiento: Optional[date] = None

class ClienteResponse(ClienteBase):
    id:  int = Field(..., gt=0)

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ClienteDetalleResponse(ClienteResponse):
    # Asumiendo que tienes esquemas para Turno y Objetivo
    # turnos: List[TurnoResponse] = []
    # objetivos: List[ObjetivoResponse] = []
    pass