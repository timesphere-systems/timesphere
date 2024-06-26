"""Module providing JSON models for the consultant API."""
# pylint: disable=too-few-public-methods
from pydantic import BaseModel
from ..user.models import User
from ..models import UserDetails


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

class ConsultantUser(UserDetails):
    """Model for consultant and user details"""
    contracted_hours: float
    manager_id: int
    user_id: int
