from fastapi import APIRouter
from fastapi import status
from . import models

# /consultant
router = APIRouter()

@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=models.ResponseConsultant)
def get_consultant_details(id: int):
    return models.ConsultantDetails(name="name", email="email", assigned_manager="AssignedManager")

@router.put("/{id}", status_code=status.HTTP_200_OK)
def update_consultant(request: models.ConsultantDetails):
    return

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_consultant(id: int):
    return

@router.post("/", status_code=status.HTTP_200_OK)
def create_consultant(request: models.ConsultantDetails):
    return
