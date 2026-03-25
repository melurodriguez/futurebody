from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from backend.database import Base

class Profesional(Base):
    __tablename__ = "profesionales"

    id = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)
    especialidad = Column(String(100))

    usuario = relationship("Usuario", back_populates="profesional")
    disponibilidad=relationship("Disponibilidad", back_populates="profesional")
    turnos=relationship("Turno", back_populates="profesional")
    