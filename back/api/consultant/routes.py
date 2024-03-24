"""Consultant router and routes, data belonging to a particular consultant."""
from datetime import datetime
from typing import Annotated, cast
from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg import sql
from psycopg.errors import ForeignKeyViolation
from psycopg.rows import class_row
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
        request (models.CreateConsultant): The consultant's details."""
    with pool.connection() as connection:
        consultant_id: int = 0
        try:
            row = connection.execute("""
                INSERT INTO consultants (user_id, contracted_hours, manager_id)
                VALUES (%s, %s, %s) RETURNING id""",
                (request.user_id, request.contracted_hours, request.manager_id)).fetchone()
            # Should be impossible
            if row is None:
                raise ValueError("Failed to create consultant")
            consultant_id = cast(int, row[0])
        except ForeignKeyViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create consultant, invalid user or manager ID"}
            )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"id": consultant_id}
        )

@router.get("/{consultant_id}", status_code=status.HTTP_200_OK, response_model=None)
def get_consultant_details(consultant_id: int,
                           pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                           ) -> JSONResponse | models.ConsultantUser:
    """Get the details of a consultant.
    
    Args:
        id (int): The consultant's ID.
    
    Returns:
        models.ConsultantUser: The consultant's details.
    """
    with pool.connection() as connection:
        consultant_details = None
        with connection.cursor(row_factory=class_row(models.ConsultantUser)) as cursor:
            consultant_details = cursor.execute("""
                SELECT users.firstname AS firstname, users.lastname AS lastname, 
                                                users.email AS email, contracted_hours,
                                                managers.firstname AS manager_firstname,
                                                managers.lastname AS manager_lastname
                FROM consultants, users, users AS managers
                WHERE users.id = consultants.user_id AND managers.id = consultants.manager_id
                AND consultants.id = %s;""", (consultant_id,)
            ).fetchone()
            if consultant_details is None:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Failed to get consultant details, invalid Consultant ID"}
                )

    return consultant_details

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
        request (models.CreateHoliday): The holiday request.
    """
    if request.start_date > request.end_date:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Start Date and End Date Values are Not Valid"}
        )
    with pool.connection() as connection:
        holiday_id:int = 0
        current_time = datetime.today().strftime('%Y-%m-%d')
        try:
            row = connection.execute("""
                INSERT INTO holidays (created, start_date, end_date, consultant, approval_status)
                VALUES (%s, %s, %s, %s, 1) RETURNING id""",
                (current_time, request.start_date, request.end_date, consultant_id)).fetchone()
            if row is None:
                raise ValueError("Failed to create holiday")
            holiday_id = cast(int, row[0])
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
                content={"message": "Start date value must be a Monday weekday date"}
            )
    with pool.connection() as connection:
        timesheet_id:int = 0
        current_time = datetime.today().strftime('%Y-%m-%d')
        try:
            row = connection.execute("""
                INSERT INTO timesheets (created, start, consultant, approval_status)
                VALUES (%s, %s, %s, 1) RETURNING id""",
                (current_time, start, consultant_id)).fetchone()
            if row is None:
                raise ValueError("Failed to create timesheet")
            timesheet_id = cast(int, row[0])
        except ForeignKeyViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create timesheet, invalid consultant ID"}
            )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"id": timesheet_id}
        )

@router.post("/{consultant_id}/timesheets", status_code=status.HTTP_200_OK, response_model=None)
def get_timesheets(consultant_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     approval_status: str | None = None
                     ) -> JSONResponse | list[models.ConsultantTimesheet]:
    """Returns all consultants submitted timesheets filtered by approval_status.
    
    Args:
        id (int): The consultant's ID.
    Returns:
        List
    """
    query = ""
    if approval_status is None:
        query = sql.SQL("""SELECT timesheets.id AS timesheet_id, timesheets.created AS created,
                                                timesheets.submitted AS email, submitted,
                                                approval_status.status_type AS approval_status
                FROM timesheets, approval_status
                WHERE approval_status.id = timesheets.approval_status
                AND timesheets.approval_status != 
                        (SELECT id FROM approval_status WHERE status_type='INCOMPLETE')
                AND timesheets.consultant = %s;""")
    else:
        query = sql.SQL(
        """SELECT timesheets.id AS timesheet_id, timesheets.created AS created, 
                                        timesheets.submitted AS email, submitted,
                                        approval_status.status_type AS approval_status
                FROM timesheets, approval_status
                WHERE approval_status.id = timesheets.approval_status
                AND approval_status.status_type = {approval_status}
                AND timesheets.consultant = %s;"""
                ).format(
                    approval_status = approval_status
                )
    with pool.connection() as connection:
        timesheets = []
        with connection.cursor(row_factory=class_row(models.ConsultantTimesheet)) as cursor:
            timesheets = cursor.execute(query, (consultant_id,)
            ).fetchall()
            if len(timesheets) == 0:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Failed to get timesheets"}
                )

        return timesheets
