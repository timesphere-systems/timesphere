"""Holiday router and routes, data belonging to a particular holiday."""
from typing import Annotated
from fastapi import APIRouter, Depends, Security, status
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
from ..auth import User, get_current_user
from ..dependencies import get_connection_pool
from ..common import submit, update_status
from . import models
from ..models import ApprovalStatus, HolidayTimes


# /holiday
router = APIRouter(
    prefix="/holiday",
    tags=["holiday"],
)

@router.get("/{holiday_id}", status_code=status.HTTP_200_OK, response_model=models.Holiday)
def get_holiday_request(holiday_id: int,
                        pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                        current_user: Annotated[User, Security(get_current_user)]
                        ) -> JSONResponse | models.Holiday:
    """Get the details of a holiday request.
    
    Requires to be owner of the holiday request or manager of the consultant.

    Args:
        id (int): The holiday request's ID.
    """
    if not (current_user.is_holiday_owner(holiday_id)
            or current_user.is_manager_of_holiday(holiday_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to view this holiday request"}
        )

    with pool.connection() as connection:
        holiday_details = None
        with connection.cursor(row_factory=class_row(models.Holiday)) as cursor:
            holiday_details = cursor.execute("""
                SELECT holidays.id as id, holidays.created AS created,
                       holidays.submitted AS submitted, 
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
def update_holiday_request(holiday_id: int, request: HolidayTimes,
                           pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                           current_user: Annotated[User, Security(get_current_user)]
                           ) -> JSONResponse:
    """Update the details of a holiday request.
    
    Requires to be owner of the holiday request or manager of the consultant.

    Args:
        holiday_id (int): The holiday request's ID.
        request (RequestHoliday): The holiday request's updated details.
    """
    if not (current_user.is_holiday_owner(holiday_id)
            or current_user.is_manager_of_holiday(holiday_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to view this holiday request"}
        )

    # pylint: disable-next=duplicate-code
    if request.start_date > request.end_date:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Start Date and End Date Values are Not Valid"}
        )
    with pool.connection() as connection:
        with connection.cursor() as cursor:
            _ = cursor.execute(
                """UPDATE holidays
                        SET start_date = %s, end_date = %s
                        WHERE id = %s
                    """, (request.start_date, request.end_date, holiday_id))
            # Check number of modified rows to ensure a valid ID was provided
            if cursor.rowcount == 1:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content=
                    {
                        "message": "Sucessfully updated holiday request"
                    }
                )
    # If the success condition is not met, an invalid ID was provided
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=
        {
            "message": "Failed to update holiday request, invalid ID"
        }
    )

@router.post("/{holiday_id}/submit", status_code=status.HTTP_200_OK)
def submit_holiday_request(holiday_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User, Security(get_current_user)]
                     ) -> JSONResponse:
    """Submits a selected holiday.

    Requires to be the owner of the holiday request.

    Args:
        holiday_id (int): The holiday's ID.
    """
    if not current_user.is_holiday_owner(holiday_id):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to submit this holiday request"}
        )

    return submit(holiday_id, pool, "holidays")

@router.put("/{holiday_id}/status", status_code=status.HTTP_200_OK)
def update_holiday_request_status(holiday_id: int, status_type: ApprovalStatus,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User, Security(get_current_user)]
                     ) -> JSONResponse:
    """Approves/Denies a selected holiday.

    Requires to be the manager of the consultant.

    Args:
        holiday_id (int): The holiday's ID.
        status_type: (ApprovalStatus) The new status_type of the timesheet
    """
    if not current_user.is_manager_of_holiday(holiday_id):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to update this holiday request"}
        )

    return update_status(holiday_id, pool, "holidays", status_type)
