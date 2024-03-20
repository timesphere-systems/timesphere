"""Routes for the user API."""
from typing import Annotated
from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg.errors import ForeignKeyViolation
from api.dependencies import get_connection_pool
from . import models

# /user
router = APIRouter(
    prefix="/user",
    tags=["user"],
)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_user(request: models.User,
                pool: Annotated[ConnectionPool, Depends(get_connection_pool)]) -> JSONResponse:
    """Create a new user.
    
    Args:
        request (models.User): The user's details."""
    with pool.connection() as connection:
        user_id = None
        try:
            user_id = connection.execute("""
                INSERT INTO users (firstname, lastname, email, user_role)
                VALUES (%s, %s, %s, %s) RETURNING id""",
                (request.firstname, request.lastname, request.email, request.user_role)).fetchone()
        except ForeignKeyViolation:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Failed to create user, invalid role ID"}
            )
        if user_id is not None:
            return JSONResponse(status_code=status.HTTP_201_CREATED, content={"id": user_id})
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Failed to create user"}
        )
