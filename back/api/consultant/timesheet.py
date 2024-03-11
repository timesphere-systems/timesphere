from fastapi import APIRouter
from fastapi import status
from . import models

# /consultant/{id}/timesheet
router = APIRouter()

@router.get("/{timesheet_id}", status_code=status.HTTP_200_OK, response_model=models.Timesheet)
def get_consultant_timesheet(consultant_id: int, timesheet_id: int):
    return models.Timesheet(consultant_id=id, status=models.Status.WaitingApproval)

@router.post("/", status_code=status.HTTP_200_OK)
def create_consultant_timesheet(consultant_id: int):
    return models.Timesheet(consultant_id=consultant_id, status=models.Status.WaitingApproval)

@router.put("/{timesheet_id}", status_code=status.HTTP_200_OK)
def update_consultant_timesheet(consultant_id: int, timesheet_id: int, request: models.Timesheet):
    return

