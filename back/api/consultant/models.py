from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from ..models import User


class ConsultantDetails(User):
    assigned_manager: str
