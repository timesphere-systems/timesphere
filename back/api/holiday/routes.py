from fastapi import APIRouter
from fastapi import status
from . import models


# /holiday
router = APIRouter(
    prefix="/holiday",
    tags=["holiday"],
)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=models.Holiday)
def get_holiday_request(id: int):
    return models.Holiday(id=id, start_date="2021-01-01", end_date="2021-01-02", status=models.HolidayStatus.WAITING)

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_holiday_request(id: int, request: models.Holiday):
    return
