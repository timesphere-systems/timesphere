"""Module providing JSON models for the finance API."""
from pydantic import BaseModel


class HoursReport(BaseModel):
    """Model for consultant hours report"""
    consultant_id: int
    month_contracted_hours: float
    total_worked_hours: float
    overtime_hours: float = 0
