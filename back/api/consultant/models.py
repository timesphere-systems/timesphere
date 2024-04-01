"""Module providing JSON models for the consultant API."""
# pylint: disable=too-few-public-methods
from datetime import datetime
from pydantic import BaseModel
from ..user.models import User


class Consultant(User):
    """Model for the consultant details."""
    user_id: int
    consultant_id: int
    contracted_hours: float
    manager_id: int

class CreateConsultant(BaseModel):
    """Model for creating a new consultant."""
    user_id: int
    contracted_hours: float
    manager_id: int

class ConsultantUser(BaseModel):
    """Model for consultant and user details"""
    firstname: str
    lastname: str
    email: str
    contracted_hours: float
    manager_id: int
    user_id: int

class Entry(BaseModel):
    """Model for displaying an entry (as an inital list on the consultant page)"""
    entry_id: int
    created: datetime
    submitted: datetime | None
    approval_status: str
