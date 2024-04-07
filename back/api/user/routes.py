"""Routes for the user API."""
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

@router.get("", status_code=status.HTTP_200_OK, response_model=None)
def get_user_details(current_user: Annotated[User, Security(get_current_user)]
                     ) -> JSONResponse:
    """Get the details of a user.

    Requires user to be authenticated (and have there own user entry in the database)

    Args:
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        JSONResponse
    """
    user_details = current_user.details.model_dump()
    if user_details["user_role"]== 1:
        user_details.update({"consultant_id": current_user.consultant_id})
    user_details.pop("user_role")
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=user_details
    )
