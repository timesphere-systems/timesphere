"""Consultant router and routes, data belonging to a particular consultant."""
from datetime import datetime, date
from typing import Annotated, cast
from fastapi import APIRouter, status, Depends, Security
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg import sql
from psycopg.errors import ForeignKeyViolation
from psycopg.rows import class_row
from ..dependencies import get_connection_pool
from ..models import ApprovalStatus, HolidayTimes
from ..auth import User, get_current_user
from . import models
from ..timesheet.models import Timesheet



# /consultant
router = APIRouter(
    prefix="/consultant",
    tags=["consultant"],
)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_consultant(request: models.CreateConsultant,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                      _current_user: Annotated[User,
                                    Security(get_current_user, scopes=["timesphere:admin"])]
                      ) -> JSONResponse:
    """Create a new consultant.
    
    Requires admin permissions.

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
                           pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                           current_user: Annotated[User, Security(get_current_user)]
                           ) -> JSONResponse | models.ConsultantUser:
    """Get the details of a consultant.
    
    Requires admin permissions, or to be a manager of the consultant,
    or to be the consultant themselves.

    Args:
        id (int): The consultant's ID.
    
    Returns:
        models.ConsultantUser: The consultant's details.
    """
    if not (consultant_id == current_user.consultant_id or
            current_user.is_manager_of(consultant_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to view this consultant's details"}
        )
    with pool.connection() as connection:
        consultant_details = None
        with connection.cursor(row_factory=class_row(models.ConsultantUser)) as cursor:
            consultant_details = cursor.execute("""
                SELECT consultants.id AS id, users.firstname AS firstname, users.lastname AS lastname, 
                                                users.email AS email, contracted_hours,
                                                managers.id as manager_id, users.id as user_id
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

    Requires admin permissions, or to be a manager of the consultant,
    or to be the consultant themselves.
    
    Args:
        id (int): The consultant's ID.
        request (models.Consultant): The consultant's updated details.
    """
    raise NotImplementedError()

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_consultant(_id: int) -> None:
    """Delete a consultant.

    Requires admin permissions.

    Args:
        id (int): The consultant's ID.
    """
    raise NotImplementedError()

@router.post("/{consultant_id}/holiday", status_code=status.HTTP_200_OK)
def create_holiday_request(consultant_id: int, request: HolidayTimes,
                           pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                           current_user:
                            Annotated[User, Security(get_current_user)]
                           ) -> JSONResponse:
    """Create a new holiday request.
    
    Requires to be the consultant themselves.

    Args:
        id (int): The consultant's ID.
        request (models.CreateHoliday): The holiday request.
    """
    if consultant_id != current_user.consultant_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message":
                     "You do not have permission to create a holiday request for this consultant"}
        )

    if request.start_date > request.end_date:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Start Date and End Date Values are Not Valid"}
        )
    with pool.connection() as connection:
        holiday_id: int = 0
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
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User,
                                                   Security(get_current_user)]
                     ) -> JSONResponse:
    """Create a new timesheet.

    Requires you to be the consultant themselves.

    Args:
        consultant_id (int): The consultant's ID.
        start (datetime): The start date of the Weekly timesheet.
    """
    if consultant_id != current_user.consultant_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message":
                     "You do not have permission to create a timesheet for this consultant"}
        )

    if start.weekday() != 0:
        return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Start date value must be a Monday weekday date"}
            )
    with pool.connection() as connection:
        timesheet_id: int = 0
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

@router.get("/{consultant_id}/timesheets", status_code=status.HTTP_200_OK, response_model=None)
def get_timesheets(consultant_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User,
                                                   Security(get_current_user)],
                     approval_status: ApprovalStatus | None = None
                     ) -> JSONResponse:
    """Returns all consultants submitted timesheets filtered by approval_status.
    
    Requires you to be the consultant themselves, their manager, or an admin.

    Args:
        id (int): The consultant's ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
        approval_status: (ApprovalStatus) The new status_type of the entry
    Returns:
        JSONResponse
    """
    if consultant_id != current_user.consultant_id and \
        (not current_user.is_manager_of(consultant_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message":
                     "You do not have permission to view this consultant's timesheets"}
        )
    entries =  get_entries(consultant_id, 'timesheets', pool, approval_status)
    return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"timesheets": entries}
    )

@router.get("/{consultant_id}/holidays", status_code=status.HTTP_200_OK, response_model=None)
def get_holidays(consultant_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User,
                                                   Security(get_current_user)],
                     approval_status: ApprovalStatus | None = None
                     ) -> JSONResponse:
    """Returns all consultants submitted holidays filtered by approval_status.
    
    Requires you to be the consultant themselves, their manager, or an admin.

    Args:
        id (int): The consultant's ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
        approval_status: (ApprovalStatus) The new status_type of the entry
    Returns:
        JSONResponse
    """
    if consultant_id != current_user.consultant_id and \
        (not current_user.is_manager_of(consultant_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message":
                     "You do not have permission to view this consultant's timesheets"}
        )
    entries =  get_entries(consultant_id, 'holidays', pool, approval_status)
    return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"holidays": entries}
    )

def get_entries(consultant_id: int,
                 table: str,
                 pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                 approval_status: ApprovalStatus | None = None
                 ) -> list[int]:
    """Returns all consultants submitted entries filtered by approval_status.

    Args:
        id (int): The consultant's ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
        table (str): The table to update.
        approval_status: (ApprovalStatus) The new status_type of the entry
    Returns:
        list[int]
    """
    base_query = sql.SQL("""SELECT {table}.id
                FROM {table}, approval_status
                WHERE approval_status.id = {table}.approval_status
                AND {table}.consultant = %s""").format(
                    table = sql.Identifier(table)
                )

    # Append the condition for approval_status if provided,
    # exclude 'INCOMPLETE' status by default.
    if approval_status:
        status_condition = sql.SQL(" AND approval_status.status_type = %s")
        query = base_query + status_condition
        parameters = (consultant_id, approval_status)
    else:
        exclude_incomplete_status = sql.SQL(" AND approval_status.status_type != 'INCOMPLETE'")
        query = base_query + exclude_incomplete_status
        parameters = (consultant_id,)
    entries: list[int] = []
    with pool.connection() as connection:
        with connection.cursor() as cursor:
            rows = cursor.execute(query, parameters).fetchall()
            entries = [cast(int, row[0]) for row in rows]
        return entries

@router.get("/{consultant_id}/timesheet/current", status_code=status.HTTP_200_OK,
            response_model=None)
def get_current_week_timesheet(consultant_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User, Security(get_current_user)]
                     ) -> JSONResponse | Timesheet:
    """Returns the current week timesheet to the consultant

    Requires you to be the consultant themselves
    
    Args:
        id (int): The consultant's ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        JSONResponse
    """
    if consultant_id != current_user.consultant_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message":
                     "You do not have permission to view this consultant's timesheets"}
        )
    today_date = date.today()
    current_timesheet = None
    with pool.connection() as connection:
        with connection.cursor(row_factory=class_row(Timesheet)) as cursor:
            # pylint: disable=duplicate-code
            current_timesheet = cursor.execute("""
                    SELECT timesheets.id as id, timesheets.created AS created,
                        timesheets.submitted AS submitted, 
                        timesheets.start AS start, timesheets.consultant AS consultant_id,
                        approval_status.status_type AS approval_status, entries_list.entries as entries
                    FROM (SELECT timesheets.id, ARRAY_REMOVE(ARRAY_AGG(time_entries.id), NULL) as entries
                        FROM timesheets
                        LEFT JOIN time_entries
                        ON time_entries.timesheet = timesheets.id
                        GROUP BY timesheets.id) as entries_list, timesheets, approval_status
                    WHERE timesheets.id = entries_list.id
                    AND timesheets.approval_status = approval_status.id
                    AND timesheets.consultant = %(consultant_id)s
                    AND timesheets.start <= %(current_date)s
                    AND timesheets.start >= (%(current_date)s - 7)
                    ORDER BY start DESC
                    LIMIT 1""",
                {'consultant_id': consultant_id, 'current_date': today_date}).fetchone()
            if current_timesheet is None:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "No current week timesheet assigned to consultant"}
                )
    return current_timesheet
