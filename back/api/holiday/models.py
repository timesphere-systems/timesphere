from pydantic import BaseModel
from datetime import datetime
from enum import Enum


class HoidayStatus(Enum):
    WAITING = 1
    APPROVED = 2
    DENIED = 3

class Holiday(BaseModel):
    start: datetime
    end: datetime
    status: HoidayStatus
