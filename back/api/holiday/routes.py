"""Holiday router and routes, data belonging to a particular holiday."""
from fastapi import APIRouter
from fastapi import status
from . import models


# /holiday
router = APIRouter(
    prefix="/holiday",
    tags=["holiday"],
)

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=models.Holiday)
def get_holiday_request(_id: int) -> models.Holiday:
    """Get the details of a holiday request.
    
    Args:
        id (int): The holiday request's ID.
    """
    raise NotImplementedError()

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_holiday_request(_id: int, _request: models.Holiday) -> None:
    """Update the details of a holiday request.
    
    Args:
        id (int): The holiday request's ID.
        request (models.Holiday): The holiday request's updated details.
    """
    raise NotImplementedError()
