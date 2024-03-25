"""Timesheet JSON models"""
# pylint: disable=too-few-public-methods
from datetime import datetime
from enum import Enum
from pydantic import BaseModel


class TimesheetStatus(Enum):
    """Enum for timesheet statuses."""
    INCOMPLETE = 1
    WAITING = 2
    APPROVED = 3
    DENIED = 4

class TimeEntryType(Enum):
    """Enum for time entry types."""
    WORK = 1
    SICK = 2
    HOLIDAY = 3

class TimeEntry(BaseModel):
    """Model for the time entries."""
    entry_type: TimeEntryType
    start: datetime
    end: datetime

class Timesheet(BaseModel):
    """Model for timesheets."""
    start: datetime
    entries: list[TimeEntry]
    status: TimesheetStatus
