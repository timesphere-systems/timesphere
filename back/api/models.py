"""JSON models for use throughout the application."""
# pylint: disable=too-few-public-methods
from datetime import datetime
from enum import Enum
from pydantic import BaseModel


class ApprovalStatus(Enum):
    """Enum for timesheet and holiday statuses."""
    INCOMPLETE = 'INCOMPLETE'
    WAITING = 'WAITING'
    APPROVED = 'APPROVED'
    DENIED = 'DENIED'

class HolidayTimes(BaseModel):
    """Model for the holiday request."""
    start_date: datetime
    end_date: datetime

class UserDetails(BaseModel):
    """Model user details"""
    id: int
    firstname: str
    lastname: str
    email: str
