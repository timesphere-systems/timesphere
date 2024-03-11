from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from ..models import User


class ConsultantDetails(User):
    assigned_manager: str

class HoidayStatus(Enum):
    WAITING = 1
    APPROVED = 2
    DENIED = 3

class TimesheetStatus(Enum):
    WAITING = 1
    APPROVED = 2
    DENIED = 3

class TimeEntryType(Enum):
    WORK = 1
    SICK = 2
    HOLIDAY = 3

class Holiday(BaseModel):
    start: datetime
    end: datetime
    status: HoidayStatus

class TimeEntry(BaseModel):
    entry_type: TimeEntryType
    start: datetime
    end: datetime

class Timesheet(BaseModel):
    start: datetime
    entries: list[TimeEntry]
    status: TimesheetStatus
