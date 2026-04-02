from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, Time, Date, Enum
from backend.database import Base
from sqlalchemy.orm import relationship
import enum

class EstadoEnum(str, enum.Enum):
    disponible="disponible"
    ocupado="ocupado"
    bloqueado="bloqueado"

class Disponibilidad(Base):

    __tablename__="disponibilidad"

    __table_args__ = (
        UniqueConstraint(
            'usuario_id', 
            'fecha', 
            'hora_inicio',
            name='uq_usuario_fecha_hora'
        ),
    )


    id=Column(Integer, primary_key=True, index=True)
    usuario_id=Column(Integer, ForeignKey("usuarios.id"), index=True)
    fecha = Column(Date, nullable=False, index=True)
    hora_inicio=Column(Time)
    hora_fin=Column(Time)
    estado=Column(Enum(EstadoEnum), default=EstadoEnum.disponible)

    usuario=relationship("Usuario", back_populates="disponibilidad")