from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Optional
from datetime import time

class ConfiguracionBase(BaseModel):
    hora_inicio: time = Field(default="09:00:00")
    hora_fin: time = Field(default="18:00:00")
    duracion_sesion_min: int = Field(default=60, gt=0, le=240) # Máximo 4 horas por sesión
    dias_laborales: str = Field(
        default="0,1,2,3,4", 
        description="Días de la semana separados por coma (0=Lunes, 6=Domingo)"
    )

    @field_validator("dias_laborales")
    @classmethod
    def validar_dias(cls, v: str):
        import re
        if not re.match(r"^[0-6](,[0-6])*$", v):
            raise ValueError("Formato de días inválido. Use números del 0 al 6 separados por comas.")
        return v

class ConfiguracionCreate(ConfiguracionBase):
    usuario_id: int = Field(..., gt=0)

class ConfiguracionUpdate(BaseModel):
    hora_inicio: Optional[time] = None
    hora_fin: Optional[time] = None
    duracion_sesion_min: Optional[int] = Field(None, gt=0)
    dias_laborales: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ConfiguracionResponse(ConfiguracionBase):
    id: int
    usuario_id: int

    model_config = ConfigDict(from_attributes=True)