from fastapi import APIRouter
from fastapi import status
from .. import schemas

router = APIRouter(
    prefix="/holiday",
    tags=['Holiday Requests']
)


# create holiday to store into the database
@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_holiday(request: schemas.RequestHoliday):
    return

# update holiday to store into the database
@router.put("/update", status_code=status.HTTP_200_OK)
def update_holiday(request: schemas.RequestHoliday):
    return

# change approval status of holiday stored in database
@router.put("/approve/{id}/{status}", status_code=status.HTTP_200_OK)
def update_holiday_status(id: int, status: schemas.Status):
    return

# delete holiday from database
@router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
def delete_holiday(id: int):
    return
