from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Carbon Matrix Datacore"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "NEURO_LINK_ENCRYPTION_KEY_CHANGE_IN_PROD"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    DATABASE_URL: str = "sqlite:///./carbon_matrix.db"

    class Config:
        env_file = ".env"

settings = Settings()
