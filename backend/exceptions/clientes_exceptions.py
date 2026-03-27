class ClienteError(Exception):
    """Excepción base para errores relacionados con clientes."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class ClienteNotFoundError(ClienteError):
    """Se lanza cuando no existe el usuario en la base de datos."""
    def __init__(self, cliente_id: int):
        super().__init__(f"No se encontró el perfil de cliente con ID {cliente_id}.")

class ClienteAlreadyExistsError(ClienteError):
    """Se lanza cuando se intenta registrar un id que ya existe."""
    def __init__(self, cliente_id: int):
        super().__init__(f"El usuario con ID {cliente_id} ya tiene un perfil de cliente creado.")

class IncompatibleGenderDataError(ClienteError):
    """Se lanza cuando se intenta registrar en la tabla CicloMenstrual cuando el sexo es hombre"""
    def __init__(self):
        super().__init__("No se permite registrar un perido cuando el sexo es hombre.")

class InvalidBirthDateError(ClienteError):
    """Se lanza cuando la fecha de nacimiento es inválida."""
    def __init__(self, message="La fecha de nacimiento no es válida."):
        super().__init__(message)
