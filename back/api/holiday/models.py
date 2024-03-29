"""Holiday JSON models"""
# pylint: disable=too-few-public-methods
from datetime import datetime
from pydantic import BaseModel
from ..models import ApprovalStatus


class Holiday(BaseModel):
    """Model for the holiday request."""
    id: int
    created: datetime
    submitted: datetime | None
    start_date: datetime
    end_date: datetime
    consultant_id: int
    approval_status: ApprovalStatus
