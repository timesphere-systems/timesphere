"""Finance router and routes, data belonging to a particular finance user."""
from typing import Annotated
from fastapi import APIRouter, Depends, Security, status
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from ..auth import User, get_current_user
from ..dependencies import get_connection_pool


# /finance
router = APIRouter(
    prefix="/finance",
    tags=["finance"],
)

@router.get("/search/consultant", status_code=status.HTTP_200_OK)
def search_consultant(search_query: str,
                      pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                      current_user: Annotated[User, Security(get_current_user)]
                      ) -> JSONResponse:
    """Search for a Consultant

    Requires for the current user to have the finance user role

    Args:
        query (str): The name or email to search for the consultant
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        JSONResponse
    """
    if current_user.details.user_role != 3:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to search for a consultant"}
        )
    search_query = '%' + search_query + '%'
    consultants = []
    with pool.connection() as connection:
        with connection.cursor() as cursor:
            row = cursor.execute(
                """SELECT users.id
                   FROM users, consultants
                   WHERE consultants.user_id = users.id
                   AND (CONCAT(users.firstname, ' ', users.lastname) LIKE %s
                   OR users.email LIKE %s)""", (search_query, search_query)).fetchall()
            consultants = [consultant[0] for consultant in row]
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"consultants": consultants}
    )
