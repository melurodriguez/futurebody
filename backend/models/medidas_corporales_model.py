from sqlalchemy import Column, Integer, ForeignKey, DateTime, Double
import enum
from backend.database import Base
from sqlalchemy.orm import relationship


class MedidaCorporal(Base):

    __tablename__="medidas_corporales"


    id=Column(Integer, primary_key=True, index=True)
    cliente_id=Column(Integer, ForeignKey("clientes.id"), index=True)
    cintura=Column(Double)
    cadera=Column(Double)
    pecho=Column(Double)
    brazo=Column(Double)
    pierna=Column(Double)
    fecha=Column(DateTime, default=DateTime.now(), nullable=False, index=True)

    cliente=relationship("Cliente", back_populates="medidas_corporales")