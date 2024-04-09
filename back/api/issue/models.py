"""Module providing JSON models for the Issue API."""
from pydantic import BaseModel


class CreateIssue(BaseModel):
    """Model for creating issue."""
    title: str
    description: str
