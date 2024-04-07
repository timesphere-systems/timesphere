"""Issue router and routes, data belonging to a particular issue."""
from fastapi import APIRouter

# /issue
router = APIRouter(
    prefix="/issue",
    tags=["issue"],
)
