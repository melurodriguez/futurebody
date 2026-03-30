from datetime import date, time

class DisponibilidadError(Exception):
    """Excepción base para errores relacionados con disponibilidad."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class DisponibilidadNotFoundError(DisponibilidadError):
    """Se lanza cuando no existe la disponibilidad en la base de datos."""
    def __init__(self, disponibilidad_id: int):
        super().__init__(f"No se encontró la disponibilidad con ID {disponibilidad_id}.")

class DisponibilidadConflictCreationError(DisponibilidadError):
    """Se lanza cuando se intenta registrar un rango de horario y fecha que ya existe."""
    def __init__(self, usuario_id:int ,fecha: date, horario_incio:time, horario_fin:time):
        super().__init__(f"El usuario con ID {usuario_id} ya tiene un bloque disponible para el dia {fecha} entre las horas {horario_incio}-{horario_fin}.")

class InvalidTimeRangeError(DisponibilidadError):
    """Se lanza cuando el horario es inválido."""
    def __init__(self, message="El horario no es válido."):
        super().__init__(message)
