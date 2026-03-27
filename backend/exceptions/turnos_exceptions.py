class TurnoError(Exception):
    """Excepción base para errores relacionados con turnos."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class TurnoNotFoundError(TurnoError):
    def __init__(self, turno_id: int):
        super().__init__(f"No se encontró el turno con ID {turno_id}.")

class TurnoConflictError(TurnoError):
    """Se lanza cuando el horario ya está ocupado por otro turno."""
    def __init__(self, message="El horario seleccionado ya está ocupado."):
        super().__init__(message)

class InvalidAmountPerWeekError(TurnoError):
    def __init__(self, limite: int = 2):
        super().__init__(f"Se ha alcanzado el límite de {limite} entrenamientos por semana.")

class PastDateError(TurnoError):
    """Se lanza cuando se intenta agendar un turno en una fecha que ya pasó."""
    def __init__(self):
        super().__init__("No se pueden agendar turnos en fechas o planes pasados.")

class LateCancellationError(TurnoError):
    """Se lanza cuando se intenta cancelar un turno con muy poca antelación."""
    def __init__(self, horas: int = 2):
        super().__init__(f"No se puede cancelar el turno con menos de {horas} horas de antelación.")

class UnauthorizedTurnoAccessError(TurnoError):
    """Se lanza cuando un cliente intenta acceder a un turno que no le pertenece."""
    def __init__(self):
        super().__init__("No tienes permiso para gestionar este turno.")

class TurnoUpdateNotAllowedError(TurnoError):
    """Se lanza cuando se intenta modificar campos prohibidos (como la fecha)."""
    def __init__(self, message="La fecha del turno no es modificable. Cancele y solicite uno nuevo."):
        super().__init__(message)