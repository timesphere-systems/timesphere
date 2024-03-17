"""Timesheet router and routes, data belonging to a particular timesheet."""
from fastapi import APIRouter
from fastapi import status
from . import models

# /timesheet
router = APIRouter(
    prefix="/timesheet",
    tags=["timesheet"],
)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=models.Timesheet)
def get_timesheet(_id: int) -> models.Timesheet:
    """Get the details of a timesheet.
    
    Args:
        id (int): The timesheet's ID.
    """
    # return models.Timesheet(consultant_id=1, status=models.Status.WaitingApproval)
    raise NotImplementedError()

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_timesheet(_id: int, _request: models.Timesheet):
    """Update the details of a timesheet.

    Args:
        id (int): The timesheet's ID.
        request (models.Timesheet): The timesheet's updated details.
    """
    raise NotImplementedError()
