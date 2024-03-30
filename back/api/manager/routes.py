"""Consultant router and routes, data belonging to a particular consultant."""
from typing import Annotated, cast
from fastapi import APIRouter, status, Depends, Security
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg import sql
from psycopg.rows import class_row
from ..dependencies import get_connection_pool
from ..auth import User, get_current_user


# /manager
router = APIRouter(
    prefix="/manager",
    tags=["manager"],
)

@router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=None)
def get_manager_details(user_id: int,
                           pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                           ) -> JSONResponse | UserDetails:
    """Get the details of a manager.
    
    Args:
        user_id (int): The managers user ID.
    
    Returns:
        models.UserDetails: The consultant's details.
    """
    with pool.connection() as connection:
        manager_details = None
        with connection.cursor(row_factory=class_row(UserDetails)) as cursor:
            manager_details = cursor.execute("""
                SELECT users.id AS id, users.firstname AS firstname, users.lastname AS lastname, 
                       users.email AS email
                FROM users
                WHERE users.user_role = (SELECT id FROM user_role WHERE role_type = 'MANAGER')
                AND users.id = %s;""", (user_id,)
            ).fetchone()
            if manager_details is None:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"message": "Failed to get managers details, invalid Consultant ID"}
                )
    return manager_details

@router.get("/{user_id}/consultants", status_code=status.HTTP_200_OK, response_model=None)
def get_assigned_consultants(user_id: int,
                             current_user: Annotated[User, Security(get_current_user)]
                             ) -> JSONResponse:
    """Returns a list of consultants ID's of the consultants assigned to the specified manager

    Requires to be the manager of the consultants.

    Args:
        id (int): The managers ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        list[int]: the list of ID's of consultants
    """
    if current_user.details.user_id != user_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to view these consultants"}
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"consultants": current_user.managed_consultants}
    )

@router.get("/{user_id}/timesheets", status_code=status.HTTP_200_OK, response_model=None)
def get_waiting_timesheets(user_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User, Security(get_current_user)]
                     ) -> JSONResponse:
    """Returns all waiting to be approved timesheets for consultants under there management
    
    Requires to be the manager of the consultants.

    Args:
        id (int): The managers ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        list[int]: the list of ID's of timesheets
    """
    if current_user.details.user_id != user_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to view these timesheets"}
        )
    ids = get_waiting_entry(user_id, 'timesheets', pool)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"timesheets": ids}
    )

@router.get("/{user_id}/holidays", status_code=status.HTTP_200_OK, response_model=None)
def get_waiting_holidays(user_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)],
                     current_user: Annotated[User, Security(get_current_user)]
                     ) -> JSONResponse:
    """Returns all waiting to be approved holidays for consultants under there management
    
    Requires to be the manager of the consultants.

    Args:
        id (int): The managers ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        list[int]: the list of ID's of holidays
    """
    if current_user.details.user_id != user_id:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"message": "You do not have permission to view these holidays"}
        )
    holidays = get_waiting_entry(user_id, 'holidays', pool)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"holidays": holidays}
    )

def get_waiting_entry(user_id: int, table: str,
                      pool: ConnectionPool) -> list[int]:
    """Returns all waiting to be approved entreis for consultants under there management
    
    Args:
        id (int): The managers ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        list[int]: the list of ID's of entries
    """
    query = sql.SQL(
    """SELECT {table}.id FROM consultants, {table}, approval_status
            WHERE {table}.consultant = consultants.id
            AND {table}.approval_status = approval_status.id
            AND approval_status.status_type = 'WAITING'
            AND consultants.manager_id = %s""").format(
                table = sql.Identifier(table)
            )
    entry_ids: list[int] = []
    with pool.connection() as connection:
        with connection.cursor() as cursor:
            rows = cursor.execute(
                query, (user_id,)
            ).fetchall()
            entry_ids = [cast(int, row[0]) for row in rows]
    return entry_ids
