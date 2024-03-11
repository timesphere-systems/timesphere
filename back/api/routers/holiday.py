from fastapi import APIRouter
from fastapi import status
from .. import models

router = APIRouter(
    prefix="/holiday",
    tags=['Holiday Requests']
)


# create holiday to store into the database
@router.post("/create", status_code=status.HTTP_200_OK)
def create_holiday(request: models.RequestHoliday):
    return

# update holiday to store into the database
@router.put("/update", status_code=status.HTTP_200_OK)
def update_holiday(request: models.RequestHoliday):
    return

# change approval status of holiday stored in database
@router.put("/approve/{id}/{status}", status_code=status.HTTP_200_OK)
def update_holiday_status(id: int, status: models.Status):
    return

# delete holiday from database
@router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
def delete_holiday(id: int):
    return
