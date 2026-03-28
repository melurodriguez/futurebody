from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional
import enum

class TipoEnum(str, enum.Enum):
    desayuno="desayuno"
    almuerzo="almuerzo"
    merienda="merienda"
    cena="cena"

class ComidaBase(BaseModel):
    tipo: TipoEnum = Field(...,)
    descripcion: Optional[str] =Field(None)
    imagen_url: Optional[str]=Field(None, max_length=255)

class ComidaCreate(ComidaBase):
    cliente_id: int = Field(..., description="ID del cliente asociado")

class ComidaUpdate(BaseModel):
    tipo: Optional[TipoEnum] = None
    descripcion: Optional[str] =Field(None)
    imagen_url: Optional[str]=Field(None, max_length=255)
    
class ComidaResponse(ComidaBase):
    id: int = Field(..., gt=0)
    cliente_id: int
    fecha: datetime

    model_config = ConfigDict(from_attributes=True)