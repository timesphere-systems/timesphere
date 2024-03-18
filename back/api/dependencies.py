"""This module contains the dependencies for the API."""
from functools import lru_cache
from .config import Settings

@lru_cache
def get_settings() -> Settings:
    """Get the settings for the API."""
    return Settings()
