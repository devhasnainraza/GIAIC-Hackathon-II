"""Project API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from src.database import get_session
from src.schemas.project import ProjectCreateRequest, ProjectUpdateRequest, ProjectResponse
from src.services.project_service import ProjectService
from src.api.deps import get_current_user
from src.models.user import User

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    List all projects for the authenticated user.

    Args:
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        List of ProjectResponse objects for the user's projects
    """
    service = ProjectService(session)
    projects = service.list_projects(current_user.id)

    # Add task count to each project
    result = []
    for project in projects:
        task_count = service.get_project_task_count(project.id, current_user.id)
        project_dict = project.model_dump()
        project_dict['task_count'] = task_count
        result.append(ProjectResponse(**project_dict))

    return result


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new project for the authenticated user.

    Args:
        project_data: Project creation data (name, description, color)
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        ProjectResponse with created project data
    """
    service = ProjectService(session)
    project = service.create_project(
        user_id=current_user.id,
        name=project_data.name,
        description=project_data.description,
        color=project_data.color or "#10b981"
    )

    project_dict = project.model_dump()
    project_dict['task_count'] = 0
    return ProjectResponse(**project_dict)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific project by ID.

    Args:
        project_id: ID of the project to retrieve
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        ProjectResponse with project data
    """
    service = ProjectService(session)
    project = service.get_project(project_id, current_user.id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    task_count = service.get_project_task_count(project.id, current_user.id)
    project_dict = project.model_dump()
    project_dict['task_count'] = task_count
    return ProjectResponse(**project_dict)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update an existing project.

    Args:
        project_id: ID of the project to update
        project_data: Project update data (name, description, color)
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        ProjectResponse with updated project data
    """
    service = ProjectService(session)
    project = service.update_project(
        project_id=project_id,
        user_id=current_user.id,
        name=project_data.name,
        description=project_data.description,
        color=project_data.color
    )

    task_count = service.get_project_task_count(project.id, current_user.id)
    project_dict = project.model_dump()
    project_dict['task_count'] = task_count
    return ProjectResponse(**project_dict)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a project.

    Args:
        project_id: ID of the project to delete
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        No content (204 status)
    """
    service = ProjectService(session)
    service.delete_project(project_id, current_user.id)
    return None
