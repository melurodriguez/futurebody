from datetime import date, time

class ConfigError(Exception):
    """Excepción base para errores relacionados con configuraciones."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class ConfigNotFound(ConfigError):
    """Se lanza cuando no existe la configuracion en la base de datos."""
    def __init__(self, usuario_id: int):
        super().__init__(f"No se encontró la configuracion para usuario: {usuario_id}.")

class InvalidTimeRangeError(ConfigError):
    """Se lanza cuando el horario es inválido."""
    def __init__(self, message="El horario no es válido."):
        super().__init__(message)