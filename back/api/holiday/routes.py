"""Holiday router and routes, data belonging to a particular holiday."""
from typing import Annotated
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from ..dependencies import get_connection_pool
from ..common import submit, approve
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
    return submit(holiday_id, pool, "holidays")

@router.post("/{holiday_id}/approve", status_code=status.HTTP_200_OK)
def approve_holiday_request(holiday_id: int, approved: bool,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                     ) -> JSONResponse:
    """Approves/Denies a selected holiday.

    Args:
        holiday_id (int): The holiday's ID.
        approved: (bool): Boolean Value representing is it is Approved (true)
                          or Denied (false)
    """
    return approve(holiday_id, pool, "holidays", approved)
