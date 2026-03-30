from pydantic import BaseModel
from backend.schemas.usuarios_schema import UsuarioResponse

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UsuarioResponse