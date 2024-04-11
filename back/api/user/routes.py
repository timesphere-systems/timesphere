"""Routes for the user API."""
from typing import Annotated, cast
from fastapi import APIRouter, status, Depends, Security
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg.errors import ForeignKeyViolation
from psycopg.sql import SQL, Identifier, Composed
from ..dependencies import get_connection_pool
from ..auth import User, get_current_user, CONSULTANT_USER_ROLE
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

    Requires user to be authenticated (and have their own user entry in the database)

    Args:
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        JSONResponse
    """
    user_details = current_user.details.model_dump()

    if user_details["user_role"] == CONSULTANT_USER_ROLE:
        user_details.update({"consultant_id": current_user.consultant_id})
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=user_details
    )

@router.put("/{user_id}", status_code=status.HTTP_200_OK)
def update_user(user_details: models.UserUpdate,
                user_id: int,
                pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                _current_user: Annotated[User, Security(get_current_user,
                                                        scopes=["timesphere:admin"])]
                ) -> JSONResponse:
    """Update the details of a user.

    Requires user to be authenticated and have the "timesphere:admin" scope.

    Args:
        user_details (UserUpdate): The user's details.
        user_id (int): The ID of the user to update.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        JSONResponse
    """
    # Collect fields that are not None
    fields_to_update = {
        k: v for k, v in user_details.model_dump().items() # pyright: ignore[reportAny]
            if v is not None
    }

    if not fields_to_update:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "No fields to update"}
        )

    # Constructing the SQL query
    sql_fields: list[Composed] = [SQL("{} = %({})s")
        .format(Identifier(k), SQL(k))  # pyright: ignore[reportArgumentType]
          for k in fields_to_update.keys()]
    query = SQL("UPDATE users SET {fields} WHERE id = %(id)s") \
        .format(fields=SQL(", ").join(sql_fields))

    params = {**fields_to_update, "id": user_id}
    print(f"Query: {query}, Params: {params}")

    with pool.connection() as connection:
        cursor = connection.cursor()
        _ = cursor.execute(query, params)
        connection.commit()

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "User details updated successfully."}
    )
