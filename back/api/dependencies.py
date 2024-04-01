"""This module contains the dependencies for the API."""
from functools import lru_cache
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWKClient
import psycopg_pool
from .config import Settings


@lru_cache
def get_settings() -> Settings:
    """Get the settings for the API."""
    return Settings()  # pyright: ignore[reportCallIssue]

@lru_cache
def get_connection_pool() -> psycopg_pool.ConnectionPool:
    """Get a connection pool for the database."""
    settings = get_settings()
    print("making new pool")
    return psycopg_pool.ConnectionPool(
        f"dbname={settings.postgres_db_name} \
            user={settings.postgres_app_user} \
            password={settings.postgres_app_password} \
            host={settings.postgres_host} \
            port={settings.postgres_port}"
    )

def get_oauth2_scheme() -> OAuth2PasswordBearer:
    """Get the OAuth2 scheme for the API."""
    settings = get_settings()
    return OAuth2PasswordBearer(
        tokenUrl=f"{settings.authzero_domain}/oauth/token",
        scopes={"read:messages": "Read messages (test)"}
    )

@lru_cache
def get_jwk_client() -> PyJWKClient:
    """Get the JWK client for the API."""
    settings = get_settings()
    return PyJWKClient(f"https://{settings.authzero_domain}/.well-known/jwks.json")
