"""Finance router and routes, data belonging to a particular finance user."""
from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, Security, status
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
from ..auth import User, get_current_user
from ..dependencies import get_connection_pool
from . import models


# /finance
router = APIRouter(
    prefix="/finance",
    tags=["finance"],
)

@router.get("/search/consultant", status_code=status.HTTP_200_OK)
def search_consultant(search_query: str,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                      current_user: Annotated[User, Security(get_current_user)]
                      ) -> JSONResponse:
    """Search for a Consultant

    Requires for the current user to have the finance user role

    Args:
        query (str): The name or email to search for the consultant
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        JSONResponse
    """
    if current_user.details.user_role != 3:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to search for a consultant"}
        )
    search_query = '%' + search_query + '%'
    consultants = []
    with pool.connection() as connection:
        with connection.cursor() as cursor:
            row = cursor.execute(
                """SELECT users.id
                   FROM users, consultants
                   WHERE consultants.user_id = users.id
                   AND (CONCAT(users.firstname, ' ', users.lastname) LIKE %s
                   OR users.email LIKE %s)""", (search_query, search_query)).fetchall()
            consultants = [consultant[0] for consultant in row]
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"consultants": consultants}
    )

@router.get("/generatereport", status_code=status.HTTP_200_OK, response_model=None)
def generate_report(consultant_id: int, time: str,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                      current_user: Annotated[User, Security(get_current_user)]
                      ) -> JSONResponse | models.HoursReport:
    """Generates Work Report based on a specified consultant and a month and year time.

    Requires for the current user to have the finance user role

    Args:
        consultant_id (int): The consultant_id of the consultant of the work report
        time (date): The month and year time frame of the work report
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        JSONResponse
    """
    if current_user.details.user_role != 3:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to generate a work report"}
        )
    month: int = 0
    year: int = 0
    try:
        time_frame = datetime.strptime(time, '%Y-%m')
        month = time_frame.month
        year = time_frame.year
    except ValueError:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"message": "Invalid date value, import should be in format Year-Month"}
        )
    hours_report: models.HoursReport
    with pool.connection() as connection:
        with connection.cursor(row_factory=class_row(models.HoursReport)) as cursor:
            row = cursor.execute(
                """SELECT consultants.id AS consultant_id, 
                          (consultants.contracted_hours * COUNT(weekly_hours_list.hours)) 
                            AS month_contracted_hours, 
                          (EXTRACT(HOUR FROM SUM(weekly_hours_list.hours)) + 
                            EXTRACT(MINUTE FROM SUM(weekly_hours_list.hours))/60) 
                            AS total_worked_hours
                    FROM(SELECT SUM(time_entries.end_time - time_entries.start_time) AS hours, 
                                timesheets.consultant AS consultant_id
                            FROM time_entries, timesheets
                            WHERE ((EXTRACT(MONTH FROM time_entries.start_time) = %(month)s) OR
                                (EXTRACT(MONTH FROM time_entries.end_time) = %(month)s))
                            AND ((EXTRACT(YEAR FROM time_entries.start_time) = %(year)s) OR
                                (EXTRACT(YEAR FROM time_entries.end_time) = %(year)s))
                            AND timesheets.id = time_entries.timesheet
                            AND time_entries.entry_type = (SELECT id FROM time_entry_type
                                                             WHERE entry_type ='WORK')
                            AND timesheets.approval_status = (SELECT id FROM approval_status 
                                                                WHERE status_type = 'APPROVED')
                            AND timesheets.consultant = %(consultant_id)s
                            GROUP BY timesheets.id) as weekly_hours_list, consultants
                    WHERE consultants.id = weekly_hours_list.consultant_id
                    GROUP BY consultants.id
                """, {'month': month,'year': year, 'consultant_id': consultant_id}).fetchone()
            if row is None:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Failed to get total work hours," +
                              " consultant has no recorded work for the given time frame"}
                )
            hours_report = row
            if hours_report.total_worked_hours > hours_report.month_contracted_hours:
                hours_report.overtime_hours = (hours_report.total_worked_hours
                    - hours_report.month_contracted_hours)
    return hours_report
