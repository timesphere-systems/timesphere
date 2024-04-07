"""Main module for the FastAPI application."""
from fastapi import FastAPI
from .consultant.routes import router as consultant
from .holiday.routes import router as holiday
from .timesheet.routes import router as timesheet
from .user.routes import router as user
from .manager.routes import router as manager
from .issue.routes import router as issue


app = FastAPI()

app.include_router(consultant)
app.include_router(holiday)
app.include_router(timesheet)
app.include_router(user)
app.include_router(manager)
app.include_router(issue)
