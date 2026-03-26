from sqlalchemy import Column, Integer, String, Enum, DateTime, Boolean
from backend.database import Base
import enum
from sqlalchemy.sql import func
from datetime import datetime
from sqlalchemy.orm import relationship

class RolEnum(str, enum.Enum):
    cliente = "cliente"
    profesional = "profesional"

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    alias = Column(String(50), nullable=True)
    rol = Column(Enum(RolEnum), nullable=False, index=True)
    creado_en = Column(DateTime, server_default=func.now())
    is_active=Column(Boolean, default=True)
    is_profile_complete=Column(Boolean, default=False)
    #actualizado_en = Column(DateTime, onupdate=func.now())

    cliente=relationship("Cliente", back_populates="usuario")
    profesional=relationship("Profesional", back_populates="usuario")
    turnos=relationship("Turno", back_populates="usuario")
    disponibilidad=relationship("Disponibilidad", back_populates="usuario")

