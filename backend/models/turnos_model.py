from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum, UniqueConstraint
import enum
from backend.database import Base
from sqlalchemy.orm import relationship

class TipoEnum(str, enum.Enum):
    entrenamiento="entrenamiento"
    masaje="masaje"


class EstadoEnum(str, enum.Enum):
    pendiente="pendiente"
    confirmado="confirmado"
    cancelado="cancelado"

class Turno(Base):

    __tablename__="turnos"

    __table_args__ = (
        UniqueConstraint('profesional_id', 'fecha', name='uq_turno_prof_fecha'),
    )


    id=Column(Integer, primary_key=True, index=True)
    cliente_id= Column(Integer, ForeignKey("clientes.id"), index=True)
    profesional_id=Column(Integer, ForeignKey("profesionales.id"), index=True)
    tipo=Column(Enum(TipoEnum), default=TipoEnum.entrenamiento)
    fecha=Column(DateTime, nullable=False, index=True)
    estado=Column(Enum(EstadoEnum), default=EstadoEnum.pendiente)

    cliente=relationship("Cliente", back_populates="turnos")
    profesional=relationship("Profesional", back_populates="turnos")