from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum, UniqueConstraint, Time
import enum
from backend.database import Base
from sqlalchemy.orm import relationship

class DiaEnum(str, enum.Enum):
    lunes="lunes"
    martes="martes"
    miercoles="miercoles"
    jueves="jueves"
    viernes="viernes"
    sabado="sabado"
    domingo="domingo"


class Disponibilidad(Base):

    __tablename__="disponibilidad"

    __table_args__ = (
        UniqueConstraint('usuario_id', 'fecha', name='uq_turno_prof_fecha'),
    )


    id=Column(Integer, primary_key=True, index=True)
    usuario_id=Column(Integer, ForeignKey("usuarios.id"), index=True)
    dia_semana=Column(Enum(DiaEnum), index=True)
    hora_inicio=Column(Time),
    hora_fin=Column(Time)

    usuario=relationship("Usuario", back_populates="disponibilidad")