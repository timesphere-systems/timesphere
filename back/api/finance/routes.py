"""Finance router and routes, data belonging to a particular finance user."""
from datetime import datetime, timedelta
from typing import Annotated
from typing_extensions import override
from fpdf import FPDF
from fastapi import APIRouter, Depends, Security, status
from fastapi.responses import JSONResponse, Response
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
from ..auth import User, get_current_user
from ..dependencies import get_connection_pool
from . import models
from ..timesheet.models import TimeEntry


class PDF(FPDF):
    """PDF library wrapper"""
    @override
    def header(self):
        self.set_font('Arial', 'B', 12)
        _ = self.cell(0, 10, 'Work Report', 0, 1, 'C')

    @override
    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        _ = self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

# /finance
router = APIRouter(
    prefix="/finance",
    tags=["finance"],
)

@router.get("/report", status_code=status.HTTP_200_OK, response_model=None)
def generate_report(consultant_id: int, time: str,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                      current_user: Annotated[User, Security(get_current_user)]
                      ) -> JSONResponse | Response:
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
    time_entries = []
    with pool.connection() as connection:
        with connection.cursor(row_factory=class_row(TimeEntry)) as cursor:
            rows = cursor.execute(
                """SELECT ts.id AS timesheet_id, te.id, te.start_time,
                    te.end_time, tet.entry_type, te.timesheet
                    FROM time_entries te
                    JOIN time_entry_type tet ON te.entry_type = tet.id
                    JOIN timesheets ts ON te.timesheet = ts.id
                    WHERE EXTRACT(MONTH FROM te.start_time) = %s
                    AND EXTRACT(YEAR FROM te.start_time) = %s
                    AND ts.consultant = %s
                    AND te.timesheet = ts.id
                """, (month, year, consultant_id)).fetchall()
            if len(rows) == 0:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Failed to get total work hours," +
                              " consultant has no recorded work for the given time frame"}
                )
            time_entries = rows
    hours_report = models.HoursReport(consultant_id=consultant_id,
                                      month_contracted_hours=160.0,
                                      total_worked_hours=0.0,
                                      overtime_hours=0.0)
    for entry in time_entries:
        if entry.end_time is None:
            continue
        delta: timedelta = entry.end_time - entry.start_time
        hours_report.total_worked_hours += delta.seconds / 3600

    if hours_report.total_worked_hours > hours_report.month_contracted_hours:
        hours_report.overtime_hours = (hours_report.total_worked_hours
            - hours_report.month_contracted_hours)

    # Create a PDF
    pdf = PDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    _ = pdf.cell(0, 10, f"Consultant ID: {consultant_id}", 0, 1)
    _ = pdf.cell(0, 10, f"Month: {time_frame.strftime('%B %Y')}", 0, 1)
    _ = pdf.cell(0, 10, f"Total Worked Hours: {hours_report.total_worked_hours}", 0, 1)
    _ = pdf.cell(0, 10, f"Contracted Hours: {hours_report.month_contracted_hours}", 0, 1)
    _ = pdf.cell(0, 10, f"Overtime Hours: {hours_report.overtime_hours}", 0, 1)

    return Response(
        content=bytes(pdf.output()),
        media_type='application/pdf',
    )
