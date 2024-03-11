from fastapi import APIRouter
from . import details, holiday, timesheet

router = APIRouter()
router.include_router(details.router)
router.include_router(
    holiday.router,
    prefix="/{consultant_id}",
    tags=["Consultant Holiday"]
)
router.include_router(
    timesheet.router,
    prefix="/{consultant_id}",
    tags=["Consultant Timesheet"]
)
