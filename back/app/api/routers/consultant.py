from fastapi import APIRouter
from fastapi import status
from .. import JSONModels

router = APIRouter(
    prefix="/consultant",
    tags=['Consultants']
)

# get consultant details from database
@router.get("/{id}/details", status_code=status.HTTP_200_OK, response_model=JSONModels.ResponseConsultant)
def get_consultant_details(id: int):
    # need this line to match response model for now
    return JSONModels.ResponseConsultant(name="name", email="email", AssignedManager="AssignedManager")

# get consultants holiday from database by email
@router.get("/{id}/holidayrequest", status_code=status.HTTP_200_OK)
def get_consultant_holiday_requests(id: int, status: JSONModels.Status = JSONModels.Status.WaitingApproval):
    return

# get consultants timesheets from database by email
@router.get("/{id}/timesheet", status_code=status.HTTP_200_OK)
def get_consultant_timesheets(id: int, status: JSONModels.Status = JSONModels.Status.WaitingApproval):
    return

# create consultant to store into the database
@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_consultant(request: JSONModels.RequestConsultant):
    return

# update consultant to store into the database
@router.put("/update", status_code=status.HTTP_200_OK)
def update_consultant(request: JSONModels.RequestConsultant):
    return

# delete consultant from database
@router.delete("/delete/{email}", status_code=status.HTTP_200_OK)
def delete_consultant(email):
    return
