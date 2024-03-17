"""JSON models for use throughout the application."""
# pylint: disable=too-few-public-methods
from pydantic import BaseModel


class User(BaseModel):
    """Model for a user."""
    name: str
    email: str
