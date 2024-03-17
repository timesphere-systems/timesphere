"""Holiday JSON models"""
# pylint: disable=too-few-public-methods
from datetime import datetime
from enum import Enum
from pydantic import BaseModel


class HoidayStatus(Enum):
    """Enum for the holiday status."""
    WAITING = 1
    APPROVED = 2
    DENIED = 3

class Holiday(BaseModel):
    """Model for the holiday request."""
    start: datetime
    end: datetime
    status: HoidayStatus
