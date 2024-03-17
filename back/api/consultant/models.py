"""Module providing JSON models for the consultant API."""
# pylint: disable=too-few-public-methods
from api.models import User


class ConsultantDetails(User):
    """Model for the consultant details."""
    assigned_manager: str
