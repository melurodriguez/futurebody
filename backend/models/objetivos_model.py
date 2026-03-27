from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Double
from backend.database import Base
from sqlalchemy.orm import relationship
import enum


class ObjetivoEnum(str, enum.Enum):
    perder_grasa="perder_grasa"
    ganar_musculo="ganar_musculo"
    perder_peso="perder_peso"

class EstadoEnum(str, enum.Enum):
    incompleto="incompleto"
    completado="completado"

class Objetivo(Base):

    __tablename__="objetivos"

    id=Column(Integer, primary_key=True, index=True)
    cliente_id=Column(Integer, ForeignKey("clientes.id"), index=True)
    tipo=Column(Enum(ObjetivoEnum), nullable=False,index=True )
    valor_inicial=Column(Double, nullable=False)
    valor_objetivo=Column(Double, nullable=False)
    #estado=Column(Enum(EstadoEnum), default=EstadoEnum.incompleto)


    cliente=relationship("Cliente", back_populates="objetivos")


