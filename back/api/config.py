"""Load environment variables and settings from .env file."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings for the API."""
    postgres_db_name: str = "timesphere"
    postgres_app_user: str = "timesphere"
    postgres_app_password: str = "mysecretpassword"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
