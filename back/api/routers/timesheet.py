from fastapi import APIRouter
from fastapi import status
from .. import models
router = APIRouter(
    prefix="/timesheet",
    tags=['Timesheets']
)


# create timesheet to store into the database
@router.post("/create", status_code=status.HTTP_200_OK)
def create_timesheet(request: models.RequestTimeSheet):
    return

# update timesheet to store into the database
@router.put("/update", status_code=status.HTTP_200_OK)
def update_timesheet(request: models.RequestTimeSheet):
    return

# change approval status of timesheet stored in database
@router.put("/approve/{id}/{status}", status_code=status.HTTP_200_OK)
def update_timesheet_status(id:int, status: models.Status):
    return

# delete timesheet from database
@router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
def delete_timesheet(id:int):
    return
