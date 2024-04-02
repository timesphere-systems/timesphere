"""Handle authentication and authorization for the API."""
# pylint: disable=raise-missing-from
# pylint: disable=too-many-instance-attributes
# pyright: reportUnknownMemberType=false
from typing import Annotated
from fastapi import Depends
from fastapi.security import HTTPBearer, SecurityScopes, HTTPAuthorizationCredentials
from fastapi.exceptions import HTTPException
from fastapi import status
from pydantic import BaseModel, Field, ValidationError
from jwt import PyJWKClient, PyJWTError
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
import jwt
from .dependencies import get_settings, get_jwk_client, get_connection_pool
from .user.models import User as UserModel


class User:
    """Model for a user and their details.
    
    Assists with permissions handling"""
    def __init__(self, details: UserModel, pool: ConnectionPool) -> None:
        super().__init__()
        self.details = details
        self.pool = pool
        self.managed_consultants_cache = []
        self.holidays_cache = []
        self.managed_holiday_ids_cache = []
        self.timesheets_cache = []
        self.managed_timesheet_ids_cache = []
        self.time_entries_cache = []
        self.managed_time_entries_cache = []
        self.consultant_id_cache: int | None = None

    @property
    def managed_consultants(self) -> list[int]:
        """Get the consultants managed by this user."""
        with self.pool.connection() as connection:
            with connection.cursor() as cursor:
                managed_consultants = cursor.execute("""
                    SELECT id
                    FROM consultants
                    WHERE manager_id = %s
                    """,
                    (self.details.user_id,)).fetchall()
        managed_consultants = [consultant[0] for consultant in managed_consultants]
        self.managed_consultants_cache = managed_consultants
        return managed_consultants

    @property
    def consultant_id(self) -> int | None:
        """Get the consultant ID for this user."""
        if self.consultant_id_cache is not None:
            return self.consultant_id_cache

        with self.pool.connection() as connection:
            with connection.cursor() as cursor:
                consultant_id = cursor.execute("""
                    SELECT id
                    FROM consultants
                    WHERE user_id = %s
                    """,
                    (self.details.user_id,)).fetchone()
        consultant_id = consultant_id[0] if consultant_id is not None else None
        self.consultant_id_cache = consultant_id
        return consultant_id

    @property
    def holiday_ids(self) -> list[int]:
        """Get the holiday IDs for this user."""
        if self.consultant_id is None:
            return []

        with self.pool.connection() as connection:
            with connection.cursor() as cursor:
                holiday_ids = cursor.execute("""
                    SELECT id
                    FROM holidays
                    WHERE consultant = %s
                    """,
                    (self.consultant_id,)).fetchall()
        holidays = [holiday[0] for holiday in holiday_ids]
        self.holidays_cache = holidays
        return holidays

    @property
    def managed_holiday_ids(self) -> list[int]:
        """Get the holiday IDs for the consultants managed by this user."""
        with self.pool.connection() as connection:
            with connection.cursor() as cursor:
                holiday_ids = cursor.execute("""
                    SELECT id
                    FROM holidays
                    WHERE consultant IN (SELECT id FROM consultants WHERE manager_id=%s)
                    """,
                    (self.details.user_id,)).fetchall()
        holidays = [holiday[0] for holiday in holiday_ids]
        self.managed_holiday_ids_cache = holidays
        return holidays

    @property
    def timesheet_ids(self) -> list[int]:
        """Get the timesheet IDs for this user."""
        if self.consultant_id is None:
            return []

        with self.pool.connection() as connection:
            with connection.cursor() as cursor:
                timesheet_ids = cursor.execute("""
                    SELECT id
                    FROM timesheets
                    WHERE consultant = %s
                    """,
                    (self.consultant_id,)).fetchall()
        timesheets = [timesheet[0] for timesheet in timesheet_ids]
        self.timesheets_cache = timesheets
        return timesheets

    @property
    def managed_timesheet_ids(self) -> list[int]:
        """Get the timesheet IDs for the consultants managed by this user."""
        with self.pool.connection() as connection:
            with connection.cursor() as cursor:
                timesheet_ids = cursor.execute("""
                    SELECT id
                    FROM timesheets
                    WHERE consultant IN (SELECT id FROM consultants WHERE manager_id=%s)
                    """,
                    (self.details.user_id,)).fetchall()
        timesheets = [timesheet[0] for timesheet in timesheet_ids]
        self.managed_timesheet_ids_cache = timesheets
        return timesheets

    @property
    def time_entry_ids(self) -> list[int]:
        """Get the time entry IDs for this user."""
        if self.consultant_id is None:
            return []

        with self.pool.connection() as connection:
            with connection.cursor() as cursor:
                time_entry_ids = cursor.execute("""
                    SELECT time_entries.id
                    FROM time_entries, timesheets
                    WHERE timesheets.id = time_entries.timesheet
                    AND timesheets.consultant = %s
                    """,
                    (self.consultant_id,)).fetchall()
        time_entries = [time_entry[0] for time_entry in time_entry_ids]
        self.time_entries_cache = time_entries
        return time_entries

    @property
    def managed_time_entries(self) -> list[int]:
        """Get the time entry IDs for the consultants managed by this user."""
        with self.pool.connection() as connection:
            with connection.cursor() as cursor:
                time_entry_ids = cursor.execute("""
                    SELECT time_entries.id
                    FROM time_entries, timesheets
                    WHERE timesheets.id = time_entries.timesheet
                    AND timesheets.consultant IN (SELECT id FROM consultants WHERE manager_id=%s)
                    """,
                    (self.details.user_id,)).fetchall()
        time_entries = [time_entry[0] for time_entry in time_entry_ids]
        self.managed_time_entries_cache = time_entries
        return time_entries

    def is_manager_of_timesheet(self, timesheet_id: int) -> bool:
        """Check if the user is the manager of the timesheet.
        
        Args:
            timesheet_id (int): The timesheet ID to check
        """
        return timesheet_id in self.managed_timesheet_ids_cache \
            or timesheet_id in self.managed_timesheet_ids

    def is_timesheet_owner(self, timesheet_id: int) -> bool:
        """Check if the user is the owner of the timesheet.
        
        Args:
            timesheet_id (int): The timesheet ID to check
        """
        return timesheet_id in self.timesheets_cache \
            or timesheet_id in self.timesheet_ids

    def is_manager_of_time_entry(self, time_entry_id: int) -> bool:
        """Check if the user is the manager of the time entry.
        
        Args:
            time_entry_id (int): The time entry ID to check
        """
        return time_entry_id in self.managed_time_entries_cache \
            or time_entry_id in self.managed_time_entries

    def is_time_entry_owner(self, time_entry_id: int) -> bool:
        """Check if the user is the owner of the time entry.
        
        Args:
            time_entry_id (int): The time entry ID to check
        """
        return time_entry_id in self.time_entries_cache \
            or time_entry_id in self.time_entry_ids


    def is_manager_of_holiday(self, holiday_id: int) -> bool:
        """Check if the user is the manager of the holiday.
        
        Args:
            holiday_id (int): The holiday ID to check
        """
        return holiday_id in self.managed_holiday_ids_cache \
            or holiday_id in self.managed_holiday_ids

    def is_holiday_owner(self, holiday_id: int) -> bool:
        """Check if the user is the owner of the holiday.
        
        Args:
            holiday_id (int): The holiday ID to check
        """
        return holiday_id in self.holidays_cache \
            or holiday_id in self.holiday_ids

    def is_manager_of(self, consultant_id: int) -> bool:
        """Check if the user is the manager of the consultant.
        
        Try cache first or check DB if not found.
        
        Args:
            consultant_id (int): The consultant ID to check
        """
        return consultant_id in self.managed_consultants_cache \
             or consultant_id in self.managed_consultants


class TokenPayload(BaseModel):
    """The payload of the token."""
    timesphere_email: str = Field(..., alias="timesphere/email")
    timesphere_name: str | None = Field(None, alias="timesphere/name")
    timesphere_first_name: str | None = Field(None, alias="timesphere/firstname")
    timesphere_last_name: str | None = Field(None, alias="timesphere/lastname")
    iss: str
    sub: str
    aud: list[str]
    iat: int
    exp: int
    scope: str
    azp: str

class TokenData(BaseModel):
    """The data extracted from the token."""
    scopes: list[str] = []
    username: str = ""

# In a larger scale application we'd use something like cachetools
user_cache: dict[str, User] = {}
settings = get_settings()
token_auth_scheme = HTTPBearer()

async def get_user_from_username(token_payload: TokenPayload, pool: ConnectionPool) -> User:
    """Get the user ID from the username."""
    if token_payload.sub in user_cache:
        return user_cache[token_payload.sub]

    # Sometimes we get both names, other times they're joined
    first_name = token_payload.timesphere_first_name
    last_name = token_payload.timesphere_last_name
    if (first_name is None or last_name is None) and token_payload.timesphere_name is not None:
        first_name = token_payload.timesphere_name.split(" ")[0]

        # Verify that we have two names, if not set to blank string
        if len(token_payload.timesphere_name.split(" ")) < 2:
            last_name = ""
        else:
            last_name = " ".join(token_payload.timesphere_name.split(" ")[1:])

    # Insert user into DB or get existing user
    with pool.connection() as connection:
        with connection.cursor(row_factory=class_row(UserModel)) as cursor:
            user = cursor.execute("""
                    WITH inserted AS (
                        INSERT INTO users (auth0_username, firstname, lastname, email, user_role)
                        VALUES (%s, %s, %s, %s, 1)
                        ON CONFLICT (auth0_username) DO NOTHING
                        RETURNING id AS user_id, firstname, lastname, email, user_role
                    )
                    SELECT user_id, firstname, lastname, email, user_role
                    FROM inserted
                    UNION ALL
                    SELECT id AS user_id, firstname, lastname, email, user_role
                    FROM users
                    WHERE auth0_username = %s AND NOT EXISTS (SELECT 1 FROM inserted);
                    """,
                    (token_payload.sub,
                    first_name,
                    last_name,
                    token_payload.timesphere_email,
                    token_payload.sub)).fetchone()

        # Should be impossible
        if user is None:
            raise ValueError("Failed to get user ID from username")

        user = User(user, pool)
        user_cache[token_payload.sub] = user
        return user

async def get_current_user(
    security_scopes: SecurityScopes,
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(token_auth_scheme)],
    jwk_client: Annotated[PyJWKClient, Depends(get_jwk_client)],
    pool: Annotated[ConnectionPool, Depends(get_connection_pool)]
) -> User:
    """Get the current user from the token."""
    payload = await decode_jwt(security_scopes, credentials, jwk_client)
    return await get_user_from_username(payload, pool)

async def decode_jwt(
        security_scopes: SecurityScopes,
        credentials: HTTPAuthorizationCredentials,
        jwk_client: PyJWKClient
) -> TokenPayload:
    """Decode the JWT."""
    token: str = credentials.credentials
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        # RSA public key
        signing_key = jwk_client.get_signing_key_from_jwt(token).key  # pyright: ignore[reportAny]
        payload = TokenPayload(**jwt.decode(
            token,
            signing_key,  # pyright: ignore[reportAny]
            algorithms=["RS256"],
            audience=settings.authzero_audience
        ))
        token_scopes: list[str] = payload.scope.split(" ")
        token_data = TokenData(scopes=token_scopes, username=payload.sub)
    except (PyJWTError, ValidationError) as e:
        print(f"Error decoding token: {e}")
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return payload
