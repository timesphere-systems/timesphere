"""Module providing JSON models for the user API."""
# pylint: disable=too-few-public-methods
from pydantic import BaseModel

class User(BaseModel):
    """Model for a user."""
    firstname: str
    lastname: str
    email: str
