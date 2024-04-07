"""Finance router and routes, data belonging to a particular finance user."""
from fastapi import APIRouter


# /finance
router = APIRouter(
    prefix="/finance",
    tags=["finance"],
)
