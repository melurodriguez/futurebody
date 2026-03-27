class UserError(Exception):
    """Excepción base para errores relacionados con usuarios."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class UserNotFoundError(UserError):
    """Se lanza cuando no existe el usuario en la base de datos."""
    def __init__(self, user_id: int = None, email: str = None):
        if user_id:
            mensaje = f"Usuario con ID {user_id} no encontrado."
        elif email:
            mensaje = f"Usuario con email {email} no encontrado."
        else:
            mensaje = "Usuario no encontrado."
        super().__init__(mensaje)

class EmailAlreadyRegisteredError(UserError):
    """Se lanza cuando se intenta registrar un email que ya existe."""
    def __init__(self, email: str):
        super().__init__(f"El correo electrónico '{email}' ya se encuentra registrado.")

class UserInactiveError(UserError):
    """Se lanza cuando un usuario intenta loguearse pero su cuenta está desactivada."""
    def __init__(self):
        super().__init__("La cuenta de usuario está inactiva. Contacte al administrador.")

class InvalidCredentialsError(UserError):
    """Se lanza cuando el password o el email son incorrectos."""
    def __init__(self):
        super().__init__("Credenciales de acceso inválidas.")

class IncompleteProfileError(UserError):
    """Se lanza cuando el usuario intenta acceder a funciones que requieren perfil completo."""
    def __init__(self):
        super().__init__("Debe completar su perfil físico antes de realizar esta acción.")