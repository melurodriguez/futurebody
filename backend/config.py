from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DB_USER:str
    DB_PASSWORD:str
    DB_HOST:str
    DB_NAME:str
    DB_PORT:int

    MYSQL_ROOT_PASSWORD:str
    MYSQL_DATABASE:str
    MYSQL_USER:str
    MYSQL_PASSWORD:str

    class Config:
        env_file = ".env"

settings = Settings()