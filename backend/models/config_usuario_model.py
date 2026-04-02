from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Time
from sqlalchemy.orm import relationship, declarative_base
import enum
from backend.database import Base

class ConfiguracionCoach(Base):
    __tablename__ = "configuracion_coach"

    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True)
    
    hora_inicio = Column(Time, default="09:00:00")
    hora_fin = Column(Time, default="18:00:00")
    duracion_sesion_min = Column(Integer, default=60)
    

    dias_laborales = Column(String, default="0,1,2,3,4") 
    
    # Relación
    usuario = relationship("Usuario", back_populates="configuracion")