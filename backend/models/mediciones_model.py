from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, UniqueConstraint, Double
import enum
from backend.database import Base
from sqlalchemy.orm import relationship


class Medicion(Base):

    __tablename__="disponibilidad"

    __table_args__ = (
        UniqueConstraint('cliente_id', 'fecha', name='idx_med_cliente_fecha'),
    )


    id=Column(Integer, primary_key=True, index=True)
    cliente_id=Column(Integer, ForeignKey("clientes.id"), index=True)
    peso=Column(Double, nullable=False)
    grasa=Column(Double)
    masa_muscular=Column(Double)
    fecha=Column(DateTime, default=DateTime.now(), nullable=False, index=True)
    altura=Column(Double, nullable=False)

    cliente=relationship("Cliente", back_populates="mediciones")