from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, Time, Date
from backend.database import Base
from sqlalchemy.orm import relationship

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

    usuario=relationship("Usuario", back_populates="disponibilidad")