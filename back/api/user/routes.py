"""Routes for the user API."""
from datetime import datetime
from typing import Annotated, cast
from fastapi import APIRouter, status, Depends, Security
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg.errors import ForeignKeyViolation
from ..dependencies import get_connection_pool
from ..auth import User, get_current_user
from . import models


# /user
router = APIRouter(
    prefix="/user",
    tags=["user"],
)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_user(request: models.UserCreate,
                pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                _current_user:
                    Annotated[User, Security(get_current_user, scopes=["timesphere:admin"])]
                ) -> JSONResponse:
    """Create a new user.

    Requires admin permissions.
    
    Args:
        request (models.User): The user's details."""
    with pool.connection() as connection:
        user_id: int = 0
        try:
            row = connection.execute("""
                INSERT INTO users (firstname, lastname, email, user_role)
                VALUES (%s, %s, %s, %s) RETURNING id""",
                (request.firstname, request.lastname, request.email, request.user_role)).fetchone()
            if row is None:
                raise ValueError("Failed to create timesheet")
            user_id = cast(int, row[0])
        except ForeignKeyViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create user, invalid role ID"}
            )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"id": user_id}
        )

@router.post("/{user_id}/issue", status_code=status.HTTP_201_CREATED)
def create_issue(user_id: int, request: models.CreateIssue,
                 pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                 current_user: Annotated[User, Security(get_current_user)]
                ) -> JSONResponse:
    """Creates a new issue

    Requires for user_id to be the current user

    Args:
        request (models.CreateIssue): The issues details
    Returns:
        JSONResponse
    """
    if user_id != current_user.details.user_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to create an issue for this user"}
        )
    with pool.connection() as connection:
        issue_id: int = 0
        submit_time = datetime.today().strftime('%Y-%m-%d')
        try:
            row = connection.execute("""
                INSERT INTO issues (submitted, title, description, solved, user_id)
                VALUES (%s, %s, %s, FALSE, %s) RETURNING id""",
                (submit_time, request.title, request.description, user_id)).fetchone()
            if row is None:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Failed to create issue"}
                )
            issue_id = cast(int, row[0])
        except ForeignKeyViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create issue, invalid user ID"}
            )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"id": issue_id}
        )
