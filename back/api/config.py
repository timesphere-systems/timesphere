"""Load environment variables and settings from .env file."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings for the API."""
    postgres_db_name: str = "timesphere"
    postgres_db_user: str = "timesphere"
    postgres_db_password: str = "mysecretpassword"
    postgres_db_host: str = "localhost"
