"""Holiday JSON models"""
# pylint: disable=too-few-public-methods
from datetime import datetime
from enum import Enum
from pydantic import BaseModel



class HoidayStatus(Enum):
    """Enum for the holiday status."""
    INCOMPLETE = 'INCOMPLETE'
    WAITING = 'WAITING'
    APPROVED = 'APPROVED'
    DENIED = 'DENIED'

class Holiday(BaseModel):
    """Model for the holiday request."""
    created: datetime
    submitted: datetime | None
    start_date: datetime
    end_date: datetime
    consultant_id: int
    approval_status: HoidayStatus
