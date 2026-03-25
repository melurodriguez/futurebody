from sqlalchemy import Column, Integer, ForeignKey, String, Enum, DateTime, Double
from sqlalchemy.orm import relationship
from backend.database import Base
import enum

class SexoEnum(str, enum.Enum):
    hombre="hombre"
    mujer="mujer"

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)
    nombre=Column(String(100), nullable=False)
    telefono=Column(String(20))
    sexo=Column(Enum(SexoEnum), nullable=False, default=SexoEnum.hombre)
    fecha_nacimiento=Column(DateTime, nullable=False)

    usuario = relationship("Usuario", back_populates="cliente")
    comida=relationship("Comida", back_populates="cliente")
    medidas_corporales=relationship("MedidCorporal", back_populates="cliente")
    mediciones=relationship("Medicion", back_populates="cliente")
    ciclo_menstrual=relationship("CicloMenstrual", back_populates="cliente")
    objetivos=relationship("Objetivo", back_populates="cliente")
    turnos=relationship("Turno", back_populates="cliente")