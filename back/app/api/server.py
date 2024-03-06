from fastapi import FastAPI
from .routers import consultant,holidayrequest, timesheet

app = FastAPI()

app.include_router(consultant.router)
app.include_router(holidayrequest.router)
app.include_router(timesheet.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}


