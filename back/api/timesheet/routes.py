"""Timesheet router and routes, data belonging to a particular timesheet."""
from typing import Annotated
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from ..dependencies import get_connection_pool
from . import models

# /timesheet
router = APIRouter(
    prefix="/timesheet",
    tags=["timesheet"],
)

@router.get("/{timesheet_id}", status_code=status.HTTP_200_OK, response_model=models.Timesheet)
def get_timesheet(timesheet_id: int) -> models.Timesheet:
    """Get the details of a timesheet.
    
    Args:
        id (int): The timesheet's ID.
    """
    # return models.Timesheet(consultant_id=1, status=models.Status.WaitingApproval)
    raise NotImplementedError()

@router.put("/{timesheet_id}", status_code=status.HTTP_200_OK)
def update_timesheet(timesheet_id: int, request: models.Timesheet):
    """Update the details of a timesheet.

    Args:
        id (int): The timesheet's ID.
        request (models.Timesheet): The timesheet's updated details.
    """
    raise NotImplementedError()

@router.post("/{timesheet_id}/submit", status_code=status.HTTP_200_OK)
def submit_timesheet(timesheet_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                     ) -> JSONResponse:
    """Submits a selected timesheet.

    Args:
        timesheet_id (int): The timesheet's ID.
    """
    with pool.connection() as connection:
        with connection.cursor() as cursor:
            _ = cursor.execute("""
                UPDATE timesheets
                SET approval_status = (SELECT id FROM approval_status WHERE status_type='SUBMITTED')
                WHERE id = (%s);""",
                (timesheet_id,))
            # Check number of modified rows to ensure a valid timesheet ID was provided
            if cursor.rowcount == 1:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={"message":"Timesheet submitted sucessfully"}
                )
    # If the success condition is not met, an invalid timesheet ID was provided
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"message": "Failed to submit timesheet, invalid timesheet ID"}
    )
