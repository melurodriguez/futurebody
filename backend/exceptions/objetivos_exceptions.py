from fastapi import HTTPException, status

class ObjetivoError(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class ObjetivoNotFoundError(ObjetivoError):
    def __init__(self, objetivo_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Objetivo con ID {objetivo_id} no encontrado."
        )

class ObjetivoLimitReachedError(ObjetivoError):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Límite de objetivos alcanzado. Debes completar tus objetivos pendientes antes de crear nuevos."
        )