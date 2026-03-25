from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from enum import Enum # Corregido: 'Enum' con E mayúscula

class ObjetivoEnum(str, Enum):
    perder_grasa = "perder_grasa"
    ganar_musculo = "ganar_musculo"
    perder_peso = "perder_peso"

class ObjetivoBase(BaseModel):
    tipo: ObjetivoEnum = Field(..., description="El tipo de objetivo físico")
    valor_inicial: Optional[float] = Field(None, gt=0, description="Punto de partida numérico")
    valor_objetivo: Optional[float] = Field(None, gt=0, description="Meta a alcanzar")

class ObjetivoCreate(ObjetivoBase):
    cliente_id: int = Field(..., description="ID del cliente asociado")
    
class ObjetivoResponse(ObjetivoBase):
    id: int
    cliente_id: int

    model_config = ConfigDict(from_attributes=True)
