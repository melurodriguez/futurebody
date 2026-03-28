from fastapi import HTTPException, status

class CicloError(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class CicloNotFoundError(CicloError):
    def __init__(self, ciclo_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ciclo menstrual con ID {ciclo_id} no encontrado."
        )

class CicloInvalidGenderError(CicloError):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El registro de ciclo menstrual solo es permitido para perfiles femeninos."
        )

class CicloFutureDateError(CicloError):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La fecha de inicio del ciclo no puede ser una fecha futura."
        )