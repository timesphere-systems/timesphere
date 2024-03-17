"""Module providing JSON models for the consultant API."""
from api.models import User


class ConsultantDetails(User):
    """Model for the consultant details."""
    assigned_manager: str
