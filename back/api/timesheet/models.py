"""Timesheet JSON models"""
# pylint: disable=too-few-public-methods
from datetime import datetime
from enum import Enum
from pydantic import BaseModel
from ..models import ApprovalStatus


class TimesheetStatus(Enum):
    """Enum for timesheet statuses."""
    INCOMPLETE = 1
    WAITING = 2
    APPROVED = 3
    DENIED = 4

class TimeEntryType(Enum):
    """Enum for time entry types."""
    WORK = 'WORK'
    SICK = 'SICK'
    HOLIDAY = 'HOLIDAY'

class TimeEntry(BaseModel):
    """Model for the time entries."""
    id: int
    entry_type: TimeEntryType
    start_time: datetime
    end_time: datetime | None
    timesheet_id: int

class Timesheet(BaseModel):
    """Model for timesheets."""
    created: datetime
    submitted: datetime | None
    start: datetime
    entries: list[int] | list[None]
    consultant_id: int
    approval_status: ApprovalStatus
