from fastapi import APIRouter
from fastapi import status
from . import models
from ..holiday.models import Holiday
from ..timesheet.models import Timesheet

# /consultant
router = APIRouter(
    prefix="/consultant",
    tags=["consultant"],
)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=models.ConsultantDetails)
def get_consultant_details(id: int):
    return models.ConsultantDetails(name="name", email="email", assigned_manager="AssignedManager")

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_consultant(id: int, request: models.ConsultantDetails):
    return

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_consultant(id: int):
    return

@router.post("/", status_code=status.HTTP_200_OK)
def create_consultant(request: models.ConsultantDetails):
    return

@router.post("/{id}/holiday", status_code=status.HTTP_200_OK)
def create_holiday_request(id: int, request: Holiday):
    return

@router.post("/{id}/timesheet", status_code=status.HTTP_200_OK)
def create_timesheet(id: int, request: Timesheet):
    return