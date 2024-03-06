from fastapi import FastAPI
from .routers import consultant, holiday, timesheet

app = FastAPI()

app.include_router(consultant.router)
app.include_router(holiday.router)
app.include_router(timesheet.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
