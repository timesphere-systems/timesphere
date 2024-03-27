"""Consultant router and routes, data belonging to a particular consultant."""
from typing import Annotated, cast
from fastapi import APIRouter, status, Depends
from psycopg_pool import ConnectionPool
from psycopg import sql
from ..dependencies import get_connection_pool


# /manager
router = APIRouter(
    prefix="/manager",
    tags=["manager"],
)

@router.get("/{manager_id}/timesheets", status_code=status.HTTP_200_OK, response_model=None)
def get_waiting_timesheets(manager_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                     ) -> list[int]:
    """Returns all waiting to be approved timesheets for consultants under there management
    
    Args:
        id (int): The managers ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        list[int]: the list of ID's of timesheets
    """
    return get_waiting_entry(manager_id, 'timesheets', pool)

@router.get("/{manager_id}/holidays", status_code=status.HTTP_200_OK, response_model=None)
def get_waiting_holidays(manager_id: int,
                     pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
                     ) -> list[int]:
    """Returns all waiting to be approved holidays for consultants under there management
    
    Args:
        id (int): The managers ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        list[int]: the list of ID's of holidays
    """
    return get_waiting_entry(manager_id, 'holidays', pool)

def get_waiting_entry(manager_id: int, table: str,
                      pool: ConnectionPool)->list[int]:
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
                query, (manager_id,)
            ).fetchall()
            #function bellow converts a list of tuples into a list
            rows = list(sum(rows, ()))
            entry_ids = cast(list[int], rows)
    return entry_ids
