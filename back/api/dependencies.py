"""This module contains the dependencies for the API."""
from functools import lru_cache
import psycopg_pool
from .config import Settings

@lru_cache
def get_settings() -> Settings:
    """Get the settings for the API."""
    return Settings()

@lru_cache
def get_connection_pool() -> psycopg_pool.ConnectionPool:
    """Get a connection pool for the database."""
    settings = get_settings()
    print("making new pool")
    return psycopg_pool.ConnectionPool(
        f"dbname={settings.postgres_db_name} \
            user={settings.postgres_db_user} \
            password={settings.postgres_db_password} \
            host={settings.postgres_db_host}"
    )
