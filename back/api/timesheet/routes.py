"""Timesheet router and routes, data belonging to a particular timesheet."""
from datetime import datetime
from typing import Annotated, cast
from fastapi import APIRouter, Depends, Security, status
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg import sql
from psycopg.rows import class_row
from psycopg.errors import ForeignKeyViolation, CheckViolation, RaiseException
from ..dependencies import get_connection_pool
from ..common import submit, update_status
from . import models
from ..models import ApprovalStatus
from ..auth import User, get_current_user


# /timesheet
router = APIRouter(
    prefix="/timesheet",
    tags=["timesheet"],
)

@router.get("/{timesheet_id}", status_code=status.HTTP_200_OK, response_model=models.Timesheet)
def get_timesheet(timesheet_id: int,
                  pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                  current_user: Annotated[User, Security(get_current_user)]
                  ) -> JSONResponse | models.Timesheet:
    """Get the details of a timesheet.
    
    Requries to be owner of the timesheet or manager of the consultant.

    Args:
        id (int): The timesheet's ID.
    """
    if not (current_user.is_timesheet_owner(timesheet_id)
            or current_user.is_manager_of_timesheet(timesheet_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to view this timesheet"}
        )

    with pool.connection() as connection:
        timesheet_details = None
        with connection.cursor(row_factory=class_row(models.Timesheet)) as cursor:
            timesheet_details = cursor.execute("""
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
                AND entries_list.id = %s""", (timesheet_id,)).fetchone()
            if timesheet_details is None:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Failed to get timesheets details, invalid timesheets ID"}
                )
    return timesheet_details

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
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User, Security(get_current_user)]
                     ) -> JSONResponse:
    """Submits a selected timesheet.

    Requires to be owner of the timesheet.

    Args:
        timesheet_id (int): The timesheet's ID.
    """
    if not current_user.is_timesheet_owner(timesheet_id):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to submit this timesheet"}
        )

    return submit(timesheet_id, pool, "timesheets")

@router.put("/{timesheet_id}/status", status_code=status.HTTP_200_OK)
def update_timesheet_status(timesheet_id: int, status_type: ApprovalStatus,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User, Security(get_current_user)]
                     ) -> JSONResponse:
    """Approves/Denies a selected timesheet.

    Requires to be a manager of the consultant.

    Args:
        timesheet_id (int): The timesheet's ID.
        status_type: (ApprovalStatus) The new status_type of the timesheet
    """

    if not current_user.is_manager_of_timesheet(timesheet_id):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to update this timesheet"}
        )

    return update_status(timesheet_id, pool, "timesheets", status_type)

@router.post("/{timesheet_id}/toggle", status_code=status.HTTP_200_OK)
def toggle_time_entry(timesheet_id: int, time: datetime,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                      current_user: Annotated[User, Security(get_current_user)]
                      ) -> JSONResponse:
    """Creates new time entry with clock in value or updates time entry with clock out time value.

    Requires to be owner of the timesheet.

    Args:
        timesheet_id (int): The timesheet's ID.
    """
    if not current_user.is_timesheet_owner(timesheet_id):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to update this timesheet"}
        )

    with pool.connection() as connection:
        # Check timesheet exists
        result = connection.execute(
            "SELECT Count(*) FROM timesheets WHERE id = %s", (timesheet_id,)
        ).fetchone()

        # The following should be impossible, so raise error
        if result is None:
            raise RuntimeError("Error checking timesheet ID")
        count = cast(int, result[0])

        # Count should be 1, IDs are unique
        if count != 1:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Invalid timesheet ID"}
            )

        # Check if there is an active time entry
        result = connection.execute("""SELECT id FROM time_entries
                                    WHERE time_entries.timesheet = %s
                                    AND time_entries.end_time IS NULL""",
                                    (timesheet_id,)).fetchone()

        if result is not None:
            # Update currently active time entry
            time_entry_id = cast(int, result[0])
            try:
                _ = connection.execute(
                    """UPDATE time_entries
                        SET end_time = %s
                        WHERE id = %s""", (time, time_entry_id)
                )
                # Check number of modified rows to ensure time entry added end time
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={"message": "Successfully updated time entry with clock out time"}
                )
            except CheckViolation:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Invalid end time value"}
                )
            except RaiseException:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message":
                             "Failed to update time entry, " \
                            + "there is already an open time entry for this timesheet"}
                )
        # Create new time entry
        _ = connection.execute(
            """INSERT INTO time_entries (start_time, timesheet, entry_type)
                VALUES (%s, %s, 1)""", (time, timesheet_id)
        )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "Successfully created time entry with clock in time"}
        )

@router.get("/entry/{time_entry_id}", status_code=status.HTTP_200_OK,
            response_model=models.TimeEntry)
def get_time_entry(time_entry_id: int,
                   pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                   current_user: Annotated[User, Security(get_current_user)]
                   ) -> JSONResponse | models.TimeEntry:
    """Get the details of a time_entry.
    
    Requires to be owner of the timesheet or manager of the consultant.

    Args:
        time_entry_id (int): The time_entry's ID.
    """
    if not (current_user.is_time_entry_owner(time_entry_id)
            or current_user.is_manager_of_time_entry(time_entry_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to view this time entry"}
        )

    with pool.connection() as connection:
        time_entry_details = None
        with connection.cursor(row_factory=class_row(models.TimeEntry)) as cursor:
            time_entry_details = cursor.execute("""
                SELECT time_entries.id AS id, time_entries.start_time AS start_time,
                       time_entries.end_time AS end_time,
                       time_entries.timesheet AS timesheet_id,
                       time_entry_type.entry_type AS entry_type
                FROM time_entries, time_entry_type
                WHERE time_entries.entry_type = time_entry_type.id
                AND time_entries.id = %s""", (time_entry_id,)).fetchone()
            if time_entry_details is None:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Failed to get time entry details, invalid ID"}
                )
    return time_entry_details

@router.post("/entry", status_code=status.HTTP_200_OK)
def create_time_entry(request: models.CreateTimeEntry,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                      current_user: Annotated[User, Security(get_current_user)]
                      ) -> JSONResponse:
    """Create Time Entry

    Requires to be the owner of the timesheet (the time entry is for) or 
        the manager of the consultant

    Args:
        request (models.CreateTimeEntry): JSON Model with the details to create a time entry
    """
    if not (current_user.is_timesheet_owner(request.timesheet_id)
    or current_user.is_manager_of_timesheet(request.timesheet_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to create this time entry"}
        )
    with pool.connection() as connection:
        time_entry_id: int = 0
        try:
            row = connection.execute(
                """INSERT INTO time_entries (start_time, end_time, entry_type, timesheet) 
                        VALUES (%s, %s, (SELECT id FROM time_entry_type WHERE entry_type = %s), %s)
                        RETURNING id"""
                        , (request.start_time, request.end_time, request.entry_type,
                            request.timesheet_id)).fetchone()
            if row is None:
                raise ValueError("Failed to create time entry")
            time_entry_id = cast(int, row[0])
        except ForeignKeyViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create time entry, invalid timesheet ID"}
            )
        except CheckViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create time entry, invalid start and end times"}
            )
        except RaiseException:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message":
                            "Failed to update time entry, " \
                        + "there is already an open time entry for this timesheet"}
            )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"id": time_entry_id}
        )

@router.put("/entry/{time_entry_id}", status_code=status.HTTP_200_OK)
def update_time_entry(time_entry_id: int, request: models.UpdateTimeEntry,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                      current_user: Annotated[User, Security(get_current_user)]
                      ) -> JSONResponse:
    """Update Time Entry Details
    Args: 
        time_entry_id (int): The time_entry's ID.
        request (models.UpdateTimeEntry): model with the details to update the time entry.
    """
    if not (current_user.is_time_entry_owner(time_entry_id)
    or current_user.is_manager_of_time_entry(time_entry_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to edit this time entry"}
        )
    sql_clauses: list[sql.SQL] = []
    query_params: list[str] = []
    if request.start_time is not None:
        sql_clauses.append(sql.SQL("start_time = %s"))
        query_params.append(request.start_time.strftime('%Y-%m-%d %H:%M:%S'))
    if request.end_time is not None:
        sql_clauses.append(sql.SQL("end_time = %s"))
        query_params.append(request.end_time.strftime('%Y-%m-%d %H:%M:%S'))
    if request.entry_type:
        sql_clauses.append(
            sql.SQL("entry_type = (SELECT id FROM time_entry_type WHERE entry_type = %s)")
        )
        query_params.append(request.entry_type.value)
    if not sql_clauses:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "No details provided to update time entry"}
            )
    sql_query = sql.SQL("UPDATE time_entries SET {} WHERE id = %s").format(
        sql.SQL(", ").join(sql_clauses)
    )
    query_params.append(str(time_entry_id))
    with pool.connection() as connection:
        with connection.cursor() as cursor:
            try:
                _ = cursor.execute(sql_query,  tuple(query_params))
                # Check number of modified rows to ensure a valid ID was provided
                if cursor.rowcount == 1:
                    return JSONResponse(
                        status_code=status.HTTP_200_OK,
                        content={"message": "Sucessfully updated time entry"}
                    )
            except CheckViolation:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Invalid start or end time values"}
                )
            except RaiseException:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message":
                                "Failed to update time entry, " \
                            + "there is already an open time entry for this timesheet"}
                )
    # If the success condition is not met, an invalid ID was provided
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"message": "Failed to update time entry, invalid ID"}
    )

@router.delete("/entry/{time_entry_id}", status_code=status.HTTP_200_OK)
def delete_time_entry(time_entry_id: int,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                      current_user: Annotated[User, Security(get_current_user)]
                      ) -> JSONResponse:
    """Delete Time Entry
    Args: 
        time_entry_id (int): The time_entry's ID.
    """

    if not (current_user.is_time_entry_owner(time_entry_id)
    or current_user.is_manager_of_time_entry(time_entry_id)):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to edit this time entry"}
        )
    with pool.connection() as connection:
        _ = connection.execute(
            "DELETE FROM time_entries WHERE id = %s", (time_entry_id,)
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Successfully deleted time entry"}
    )
