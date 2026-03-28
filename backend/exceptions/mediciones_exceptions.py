from fastapi import HTTPException, status

class MedicionNotFoundError(HTTPException):
    def __init__(self, medicion_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La medición con ID {medicion_id} no existe o no pertenece a este cliente."
        )