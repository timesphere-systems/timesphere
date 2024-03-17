"""Consultant router and routes, data belonging to a particular consultant."""
from fastapi import APIRouter
from fastapi import status
from api.holiday.models import Holiday
from api.timesheet.models import Timesheet
from . import models

# /consultant
router = APIRouter(
    prefix="/consultant",
    tags=["consultant"],
)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=models.ConsultantDetails)
def get_consultant_details(_id: int) -> models.ConsultantDetails:
    """Get the details of a consultant.
    
    Args:
        id (int): The consultant's ID.
    
    Returns:
        models.ConsultantDetails: The consultant's details.
    """
    #return models.ConsultantDetails(name="name", email="email", assigned_manager="AssignedManager")
    raise NotImplementedError()

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_consultant(_id: int, _request: models.ConsultantDetails) -> None:
    """Update the details of a consultant.
    
    Args:
        id (int): The consultant's ID.
        request (models.ConsultantDetails): The consultant's updated details.
    """
    raise NotImplementedError()

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_consultant(_id: int) -> None:
    """Delete a consultant.

    Args:
        id (int): The consultant's ID.
    """
    raise NotImplementedError()

@router.post("/", status_code=status.HTTP_200_OK)
def create_consultant(request: models.ConsultantDetails) -> None:
    """Create a new consultant.
    
    Args:
        request (models.ConsultantDetails): The consultant's details."""
    raise NotImplementedError()

@router.post("/{id}/holiday", status_code=status.HTTP_200_OK)
def create_holiday_request(_id: int, _request: Holiday) -> None:
    """Create a new holiday request.
    
    Args:
        id (int): The consultant's ID.
        request (Holiday): The holiday request.
    """
    raise NotImplementedError()

@router.post("/{id}/timesheet", status_code=status.HTTP_200_OK)
def create_timesheet(_id: int, _request: Timesheet) -> None:
    """Create a new timesheet.

    Args:
        id (int): The consultant's ID.
        request (Timesheet): The timesheet.
    """
    raise NotImplementedError()
