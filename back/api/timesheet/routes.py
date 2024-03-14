from fastapi import APIRouter
from fastapi import status
from . import models

# /timesheet
router = APIRouter(
    prefix="/timesheet",
    tags=["timesheet"],
)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=models.Timesheet)
def get_timesheet(id: int):
    return models.Timesheet(consultant_id=1, status=models.Status.WaitingApproval)

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_timesheet(id: int, request: models.Timesheet):
    return
