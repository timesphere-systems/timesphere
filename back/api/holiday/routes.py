"""Holiday router and routes, data belonging to a particular holiday."""
from typing import Annotated
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from ..dependencies import get_connection_pool
from . import models


# /holiday
router = APIRouter(
    prefix="/holiday",
    tags=["holiday"],
)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=models.Holiday)
def get_holiday_request(_id: int) -> models.Holiday:
    """Get the details of a holiday request.
    
    Args:
        id (int): The holiday request's ID.
    """
    raise NotImplementedError()

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_holiday_request(_id: int, _request: models.Holiday) -> None:
    """Update the details of a holiday request.
    
    Args:
        id (int): The holiday request's ID.
        request (models.Holiday): The holiday request's updated details.
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
    with pool.connection() as connection:
        with connection.cursor() as cursor:
            _ = cursor.execute("""
                UPDATE holidays
                SET approval_status = (SELECT id FROM approval_status WHERE status_type='SUBMITTED')
                WHERE id = (%s);""",
                (holiday_id,))
            # Check number of modified rows to ensure a valid holiday ID was provided
            if cursor.rowcount == 1:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={"message":"holiday request submitted sucessfully"}
                )
    # If the success condition is not met, an invalid holiday ID was provided
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"message": "Failed to submit holiday request, invalid holiday ID"}
    )
