"""Consultant router and routes, data belonging to a particular consultant."""
from typing import Annotated
from fastapi import APIRouter, status, Depends
from psycopg_pool import ConnectionPool
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
    raise NotImplementedError()

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
    raise NotImplementedError()

def get_waiting_entry(manager_id: int, table: str,
                      pool: ConnectionPool)->list[int]:
    """Returns all waiting to be approved entreis for consultants under there management
    
    Args:
        id (int): The managers ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
    Returns:
        list[int]: the list of ID's of entries
    """
    raise NotImplementedError()
