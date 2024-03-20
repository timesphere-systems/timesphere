"""Module providing JSON models for the consultant API."""
# pylint: disable=too-few-public-methods
from pydantic import BaseModel
from api.user import User
from datetime import datetime


class Consultant(User):
    """Model for the consultant details."""
    user_id: int
    contracted_hours: float
    manager_id: int

class CreateConsultant(BaseModel):
    """Model for creating a new consultant."""
    user_id: int
    contracted_hours: float
    manager_id: int

class CreateHoliday(BaseModel):
    """Model for the holiday request."""
    start_date: datetime
    end_date: datetime
