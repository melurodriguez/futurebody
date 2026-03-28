from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, TIMESTAMP, func
from sqlalchemy.orm import relationship, declarative_base
import enum
from backend.database import Base
class TipoComida(enum.Enum):
    desayuno = "desayuno"
    almuerzo = "almuerzo"
    merienda = "merienda"
    cena = "cena"

class Comida(Base):
    __tablename__ = 'comidas' # EXACTAMENTE igual a tu tabla en MySQL

    id = Column(Integer, primary_key=True, autoincrement=True)
    cliente_id = Column(Integer, ForeignKey('clientes.id', ondelete='CASCADE'), nullable=False)
    tipo = Column(Enum(TipoComida), nullable=False)
    descripcion = Column(Text, nullable=True)
    imagen_url = Column(String(255), nullable=True)
    fecha = Column(TIMESTAMP, server_default=func.now(),onupdate=func.now(), nullable=False)


    cliente = relationship("Cliente", back_populates="comida")

    def __repr__(self):
        return f"<Comida(tipo='{self.tipo}', fecha='{self.fecha}')>"