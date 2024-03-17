"""JSON models for use throughout the application."""
from pydantic import BaseModel


class User(BaseModel):
    """Model for a user."""
    name: str
    email: str
