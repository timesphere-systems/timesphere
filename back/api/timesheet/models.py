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
    start_time: datetime
    end_time: datetime | None
    entry_type: TimeEntryType
    timesheet_id: int

class UpdateTimeEntry(BaseModel):
    """Model for editing time entries"""
    start_time: datetime | None
    end_time: datetime | None
    entry_type: TimeEntryType | None

class CreateTimeEntry(BaseModel):
    """Model for creating time entries"""
    start_time: datetime
    end_time: datetime
    entry_type: TimeEntryType
    timesheet_id: int

class Timesheet(BaseModel):
    """Model for timesheets."""
    id: int
    created: datetime
    submitted: datetime | None
    start: datetime
    entries: list[int]
    consultant_id: int
    approval_status: ApprovalStatus
