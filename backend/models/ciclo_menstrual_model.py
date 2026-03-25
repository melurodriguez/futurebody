from sqlalchemy import Column, Integer, ForeignKey, Date
import enum
from backend.database import Base
from sqlalchemy.orm import relationship


class CicloMenstrual(Base):

    __tablename__="ciclo_menstrual"


    id=Column(Integer, primary_key=True, index=True)
    cliente_id=Column(Integer, ForeignKey("clientes.id"), index=True)
    fecha_inicio=Column(Date, index=True)
    fecha_fin=Column(Date)


    cliente=relationship("Cliente", back_populates="ciclo_menstrual")