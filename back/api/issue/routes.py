"""Issue router and routes, data belonging to a particular issue."""
from datetime import datetime
from typing import Annotated, cast
from fastapi import APIRouter, status, Depends, Security
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg.errors import ForeignKeyViolation
from ..dependencies import get_connection_pool
from ..auth import User, get_current_user
from . import models

# /issue
router = APIRouter(
    prefix="/issue",
    tags=["issue"],
)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_issue(request: models.CreateIssue,
                 pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                 current_user: Annotated[User, Security(get_current_user)]
                ) -> JSONResponse:
    """Creates a new issue

    Args:
        request (models.CreateIssue): The issues details
    Returns:
        JSONResponse
    """
    user_id = current_user.details.user_id
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
