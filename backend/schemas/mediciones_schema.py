from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional
import enum



class MedicionBase(BaseModel):
    peso: Optional[float] = Field(None, gt=0, example=75.5)
    grasa: Optional[float] = Field(None, gt=0, description="Porcentaje (ej: 15.5)")
    masa_muscular: Optional[float] = Field(None, gt=0)
    altura: Optional[float] = Field(None, gt=0, description="Altura en metros (ej: 1.75)")

class MedicionCreate(MedicionBase):
    cliente_id: int = Field(..., description="ID del cliente asociado")

class MedicionUpdate(BaseModel):
    peso: Optional[float] = Field(
        gt=0, 
        description="Valor peso en KG (ej: 75.5KG)",
        example=75.5
    )
    grasa: Optional[float] = Field(
        gt=0, 
        description="Valor de la medición en porccentaje(ej: 9.5%)",
        example=75.5
    )
    masa_muscular: Optional[float] = Field(
        gt=0, 
        description="Valor de la medición (ej: 30.0%)",
        example=75.5
    )
    altura: Optional[float] = Field(
        gt=0, 
        description="Valor altura en m(ej: 1.67M)",
        example=75.5
    )

class MedicionResponse(MedicionBase):
    id: int = Field(..., gt=0)
    cliente_id: int
    fecha: datetime

    model_config = ConfigDict(from_attributes=True)