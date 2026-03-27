# futurebody/backend/exceptions.py

class ServiceError(Exception):
    """Base para todas las excepciones del servicio"""
    pass

class RecursoNoEncontradoError(ServiceError):
    def __init__(self, mensaje="El recurso solicitado no existe"):
        self.mensaje = mensaje
        super().__init__(self.mensaje)

class DatosDuplicadosError(ServiceError):
    pass