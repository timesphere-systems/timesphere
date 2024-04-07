"""Module providing JSON models for the user API."""
# pylint: disable=too-few-public-methods
from pydantic import BaseModel

class UserCreate(BaseModel):
    """Model for creating a user."""
    firstname: str
    lastname: str
    email: str
    user_role: int

class User(BaseModel):
    """Model for a user."""
    user_id: int
    firstname: str
    lastname: str
    email: str
    user_role: int
