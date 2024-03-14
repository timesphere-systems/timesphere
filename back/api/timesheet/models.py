from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class TimesheetStatus(Enum):
    WAITING = 1
    APPROVED = 2
    DENIED = 3

class TimeEntryType(Enum):
    WORK = 1
    SICK = 2
    HOLIDAY = 3

class TimeEntry(BaseModel):
    entry_type: TimeEntryType
    start: datetime
    end: datetime

class Timesheet(BaseModel):
    start: datetime
    entries: list[TimeEntry]
    status: TimesheetStatus