"""Common functions for the API."""
from fastapi import status
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool
from psycopg import sql

def submit(submit_id: int,
           pool: ConnectionPool,
           table: str
           ) -> JSONResponse:
    """Submits a selected entry.

    Args:
        id (int): The entry's ID.
        pool (Annotated[ConnectionPool, Depends(get_connection_pool)]): The connection pool.
        table (str): The table to update.
    """

    with pool.connection() as connection:
        with connection.cursor() as cursor:
            query = sql.SQL(
         """UPDATE {table}
                SET approval_status = (SELECT id FROM approval_status WHERE status_type='SUBMITTED')
                WHERE {pkey} = %s;""").format(
                    table = sql.Identifier(table),
                    pkey = sql.Identifier('id')
                )
            _ = cursor.execute(query, (submit_id,))
            # Check number of modified rows to ensure a valid ID was provided
            if cursor.rowcount == 1:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={"message":f"{table} submitted sucessfully"}
                )
    # If the success condition is not met, an invalid ID was provided
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"message": f"Failed to submit {table}, invalid {table} ID"}
    )
