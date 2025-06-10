import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db") # Default for easier local testing if no .env
    SECRET_KEY: str = os.getenv("SECRET_KEY", "a_very_secret_key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    postgres_user: str = os.getenv("POSTGRES_USER", "postgres") # Used if constructing DATABASE_URL here
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "") # Used if constructing DATABASE_URL here
    postgres_db: str = os.getenv("POSTGRES_DB", "todo") # Used if constructing DATABASE_URL here

    model_config = SettingsConfigDict(
        env_file=".env",
        extra='ignore' # Ignores extra env variables not defined in the model
    )

settings = Settings()