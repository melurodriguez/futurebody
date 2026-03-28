from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint, Double, func
from datetime import datetime
from backend.database import Base
from sqlalchemy.orm import relationship

class Medicion(Base):
    __tablename__ = "mediciones"  # Corregido: antes decía "disponibilidad"

    __table_args__ = (
        UniqueConstraint('cliente_id', 'fecha', name='idx_med_cliente_fecha'),
    )

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), index=True)
    peso = Column(Double, nullable=False)
    grasa = Column(Double)
    masa_muscular = Column(Double)
    
    # OPCIÓN A: Usar la hora del servidor de base de datos (Recomendado)
    fecha = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    
    # OPCIÓN B: Usar la hora de Python (Pasando la función sin ejecutar)
    # fecha = Column(DateTime, default=datetime.now, nullable=False, index=True)
    
    altura = Column(Double, nullable=False)

    cliente = relationship("Cliente", back_populates="mediciones")