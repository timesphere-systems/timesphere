"""Module providing JSON models for the user API."""
# pylint: disable=too-few-public-methods
from pydantic import BaseModel


class User(BaseModel):
    """Model for a user."""
    user_id: int
    firstname: str
    lastname: str
    email: str
    user_role: int
