"""Module providing JSON models for the consultant API."""
# pylint: disable=too-few-public-methods
from api.user.models import User


class Consultant(User):
    """Model for the consultant details."""
    user_id: int
    contracted_hours: float
    manager_id: int
