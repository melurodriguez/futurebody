from fastapi import HTTPException, status

class ComidaError(HTTPException):
    """Excepción base para errores relacionados con comidas."""
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class ComidaNotFoundError(ComidaError):
    """Error cuando no se encuentra una comida específica."""
    def __init__(self, comida_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró la comida con ID {comida_id} para este usuario."
        )

class ComidaAlreadyExistsError(ComidaError):
    """Error cuando el usuario intenta duplicar un tipo de comida el mismo día."""
    def __init__(self, fecha: str, tipo: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un registro de '{tipo}' para la fecha {fecha}."
        )

class ComidaOwnershipError(ComidaError):
    """Error de seguridad cuando un usuario intenta acceder a comida ajena."""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para modificar este registro de comida."
        )
