"""Consultant router and routes, data belonging to a particular consultant."""
from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg.errors import ForeignKeyViolation
from ..dependencies import get_connection_pool
from . import models

# /consultant
router = APIRouter(
    prefix="/consultant",
    tags=["consultant"],
)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_consultant(request: models.CreateConsultant,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                      ) -> JSONResponse:
    """Create a new consultant.
    
    Args:
        request (models.Consultant): The consultant's details."""
    with pool.connection() as connection:
        consultant_id = None
        try:
            consultant_id = connection.execute("""
                INSERT INTO consultants (user_id, contracted_hours, manager_id)
                VALUES (%s, %s, %s) RETURNING id""",
                (request.user_id, request.contracted_hours, request.manager_id)).fetchone()
        except ForeignKeyViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create consultant, invalid user or manager ID"}
            )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED, 
            content={"id": consultant_id}
        )

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=models.Consultant)
def get_consultant_details(_id: int) -> models.Consultant:
    """Get the details of a consultant.
    
    Args:
        id (int): The consultant's ID.
    
    Returns:
        models.Consultant: The consultant's details.
    """
    #return models.Consultant(name="name", email="email", assigned_manager="AssignedManager")
    raise NotImplementedError()

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_consultant(_id: int, _request: models.Consultant) -> None:
    """Update the details of a consultant.
    
    Args:
        id (int): The consultant's ID.
        request (models.Consultant): The consultant's updated details.
    """
    raise NotImplementedError()

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_consultant(_id: int) -> None:
    """Delete a consultant.

    Args:
        id (int): The consultant's ID.
    """
    raise NotImplementedError()

@router.post("/{consultant_id}/holiday", status_code=status.HTTP_200_OK)
def create_holiday_request(consultant_id: int, request: models.CreateHoliday,
                           pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                           ) -> JSONResponse:
    """Create a new holiday request.
    
    Args:
        id (int): The consultant's ID.
        request (Holiday): The holiday request.
    """
    if request.start_date > request.end_date:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Start Date and End Date Values are Not Valid"}
        )
    with pool.connection() as connection:
        holiday_id = None
        try:
            holiday_id = connection.execute("""
                INSERT INTO holidays (start_date, end_date, consultant, approval_status)
                VALUES (%s, %s, %s, 1) RETURNING id""",
                (request.start_date, request.end_date, consultant_id)).fetchone()
        except ForeignKeyViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create holiday, invalid consultant ID"}
            )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED, 
            content={"id": holiday_id}
        )

@router.post("/{consultant_id}/timesheet", status_code=status.HTTP_200_OK)
def create_timesheet(consultant_id: int, start: datetime,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                     ) -> JSONResponse:
    """Create a new timesheet.

    Args:
        consultant_id (int): The consultant's ID.
        start (datetime): The start date of the Weekly timesheet.
    """
    if start.weekday() != 0:
        return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Week Commencing value must be a Monday weekday date"}
            )
    with pool.connection() as connection:
        timesheet_id = None
        try:
            timesheet_id = connection.execute("""
                INSERT INTO timesheets (start, consultant, approval_status)
                VALUES (%s, %s, 1) RETURNING id""",
                (start, consultant_id)).fetchone()
        except ForeignKeyViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create timesheet, invalid consultant ID"}
            )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"id": timesheet_id}
        )
