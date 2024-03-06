from pydantic import BaseModel
from typing import List
from enum import Enum
#files contains pydantic model classes used for JSON Request and Response models

class User(BaseModel):
    name: str
    email: str

class RequestConsultant(User):
    AssignedManager: str

class RequestHoliday(BaseModel):
    ConsultantEmail: str
    StartDate: str
    EndDate: str

class ResponseConsultant(User):
    AssignedManager: str

# enumeration class for status of Holiday Requests and Timesheets
class Status(Enum):
    WaitingApproval = 'WaitingApproval'
    Approved = 'Approved'
    Denied = 'Denied'

class TimeEntry(BaseModel):
    status: str
    StartTime: str
    EndTime: str

class RequestTimeSheet(BaseModel):
    AssignedConsultant: str
    TimeEntries: List[TimeEntry]
