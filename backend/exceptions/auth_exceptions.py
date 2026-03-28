from fastapi import HTTPException, status

class UnauthorizedError(HTTPException):
    def __init__(self, detail: str = "No tienes permisos para realizar esta acción."):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class NotAuthenticatedError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Sesión inválida o expirada.",
            headers={"WWW-Authenticate": "Bearer"},
        )