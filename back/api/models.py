"""JSON models for use throughout the application."""
# pylint: disable=too-few-public-methods
from enum import Enum

class ApprovalStatus(Enum):
    """Enum for timesheet and holiday statuses."""
    INCOMPLETE = 'INCOMPLETE'
    WAITING = 'WAITING'
    APPROVED = 'APPROVED'
    DENIED = 'DENIED'
