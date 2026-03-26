from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional

class MedidaCorporalBase(BaseModel):
    cintura: Optional[float] = Field(None, gt=0, example=75.5)
    cadera: Optional[float] = Field(None, gt=0, example=90.0)
    pecho: Optional[float] = Field(None, gt=0, example=100.2)
    brazo: Optional[float] = Field(None, gt=0, example=35.5)
    pierna: Optional[float] = Field(None, gt=0, example=55.0)

class MedidaCorporalCreate(MedidaCorporalBase):
    cliente_id: int = Field(..., description="ID del cliente asociado")

class MedidaCorporalUpdate(BaseModel):
    cintura: Optional[float] = Field(
        gt=0, 
        description="Valor peso en KG (ej: 75.5KG)",
        example=75.5
    )
    cadera: Optional[float] = Field(
        gt=0, 
        description="Valor peso en cm (ej: 75.5KG)",
        example=75.5
    )
    pecho: Optional[float] = Field(
        gt=0, 
        description="Valor peso en cm (ej: 75.5KG)",
        example=75.5
    )
    brazo: Optional[float] = Field(
        gt=0, 
        description="Valor peso en cm (ej: 75.5KG)",
        example=75.5
    )
    pierna: Optional[float] = Field(
        gt=0, 
        description="Valor peso en cm (ej: 75.5KG)",
        example=75.5
    )


class MedidaCorporalResponse(MedidaCorporalBase):
    id: int
    cliente_id: int
    fecha: datetime

    model_config = ConfigDict(from_attributes=True)