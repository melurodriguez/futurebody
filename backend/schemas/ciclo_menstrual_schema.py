from pydantic import BaseModel, ConfigDict, Field
from datetime import date
from typing import Optional

class CicloMenstrualBase(BaseModel):
    fecha_inicio: date = Field(..., description="Fecha en que inició el ciclo")
    fecha_fin: Optional[date] = Field(None, description="Fecha en que terminó el ciclo (puede estar abierto)")

class CicloMenstrualCreate(CicloMenstrualBase):
    cliente_id: int = Field(..., description="ID del cliente asociado")

class CicloMenstrualUpdate(BaseModel):
    fecha_inicio: Optional[date]=None
    fecha_fin: Optional[date]=None

class CicloMenstrualResponse(CicloMenstrualBase):
    id: int
    cliente_id: int

    model_config = ConfigDict(from_attributes=True)