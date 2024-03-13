from fastapi import FastAPI
from .consultant.routes import router as consultant
from .holiday.routes import router as holiday
from .timesheet.routes import router as timesheet

app = FastAPI()

app.include_router(consultant)
app.include_router(holiday)
app.include_router(timesheet)

@app.get("/")
def read_root():
    return {"Hello": "World"}