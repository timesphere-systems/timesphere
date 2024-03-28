"""Holiday router and routes, data belonging to a particular holiday."""
from typing import Annotated
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
from ..dependencies import get_connection_pool
from ..common import submit, update_status
from . import models
from ..models import ApprovalStatus, RequestHoliday


# /holiday
router = APIRouter(
    prefix="/holiday",
    tags=["holiday"],
)

@router.get("/{holiday_id}", status_code=status.HTTP_200_OK, response_model=models.Holiday)
def get_holiday_request(holiday_id: int,
                        pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                        ) -> JSONResponse | models.Holiday:
    """Get the details of a holiday request.
    
    Args:
        id (int): The holiday request's ID.
    """
    with pool.connection() as connection:
        holiday_details = None
        with connection.cursor(row_factory=class_row(models.Holiday)) as cursor:
            holiday_details = cursor.execute("""
                SELECT holidays.created AS created, holidays.submitted AS submitted, 
                       holidays.start_date AS start_date, holidays.end_date AS end_date,
                       holidays.consultant AS consultant_id, approval_status.status_type AS approval_status
                FROM holidays, approval_status
                WHERE holidays.approval_status = approval_status.id
                AND holidays.id = %s;""", (holiday_id,)).fetchone()
            if holiday_details is None:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Failed to get holiday details, invalid holiday ID"}
                )
    return holiday_details

@router.put("/{holiday_id}", status_code=status.HTTP_200_OK)
def update_holiday_request(holiday_id: int, _request: RequestHoliday) -> None:
    """Update the details of a holiday request.
    
    Args:
        holiday_id (int): The holiday request's ID.
        request (RequestHoliday): The holiday request's updated details.
    """
    raise NotImplementedError()

@router.post("/{holiday_id}/submit", status_code=status.HTTP_200_OK)
def submit_holiday_request(holiday_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                     ) -> JSONResponse:
    """Submits a selected holiday.

    Args:
        holiday_id (int): The holiday's ID.
    """
    return submit(holiday_id, pool, "holidays")

@router.put("/{holiday_id}/status", status_code=status.HTTP_200_OK)
def update_holiday_request_status(holiday_id: int, status_type: ApprovalStatus,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                     ) -> JSONResponse:
    """Approves/Denies a selected holiday.

    Args:
        holiday_id (int): The holiday's ID.
        status_type: (ApprovalStatus) The new status_type of the timesheet
    """
    return update_status(holiday_id, pool, "holidays", status_type)
