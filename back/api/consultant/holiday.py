from fastapi import APIRouter
from fastapi import status
from . import models

# /consultant/{consultant_id}/holiday
router = APIRouter()

@router.post("/", status_code=status.HTTP_200_OK)
def create_holiday_request(request: models.Holiday):
    return

@router.get("/{holiday_id}", status_code=status.HTTP_200_OK, response_model=models.Holiday)
def get_holiday_request(consultant_id: int, holiday_id: int):
    return models.Holiday(id=id, start_date="2021-01-01", end_date="2021-01-02", status=models.HolidayStatus.WAITING)
