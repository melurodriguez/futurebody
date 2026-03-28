from fastapi import HTTPException, status

class MedidaCorporalNotFoundError(HTTPException):
    def __init__(self, medida_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Registro de medidas corporales con ID {medida_id} no encontrado."
        )