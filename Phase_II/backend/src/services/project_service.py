"""Project service for project management operations."""
from sqlmodel import Session, select, func
from src.models.project import Project
from src.models.task import Task
from typing import List, Optional
from fastapi import HTTPException, status
from datetime import datetime


class ProjectService:
    """
    Service layer for project operations.
    Handles project creation, retrieval, updates, and deletion with user isolation.
    """

    def __init__(self, session: Session):
        """
        Initialize ProjectService with database session.

        Args:
            session: SQLModel database session
        """
        self.session = session

    def list_projects(self, user_id: int) -> List[Project]:
        """
        Retrieve all projects for a specific user.

        Args:
            user_id: ID of the user whose projects to retrieve

        Returns:
            List of Project objects belonging to the user
        """
        statement = select(Project).where(Project.user_id == user_id).order_by(Project.created_at.desc())
        projects = self.session.exec(statement).all()
        return list(projects)

    def get_project(self, project_id: int, user_id: int) -> Optional[Project]:
        """
        Retrieve a specific project by ID with user isolation.

        Args:
            project_id: ID of the project to retrieve
            user_id: ID of the user (for ownership verification)

        Returns:
            Project object if found and owned by user, None otherwise
        """
        statement = select(Project).where(Project.id == project_id, Project.user_id == user_id)
        return self.session.exec(statement).first()

    def create_project(
        self,
        user_id: int,
        name: str,
        description: Optional[str] = None,
        color: str = "#10b981"
    ) -> Project:
        """
        Create a new project for a user.

        Args:
            user_id: ID of the user creating the project
            name: Project name (1-100 characters)
            description: Optional project description (max 500 characters)
            color: Hex color code for project

        Returns:
            Created Project object

        Raises:
            HTTPException: 400 if validation fails
        """
        # Validate name length
        if not name or len(name.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project name cannot be empty"
            )

        if len(name) > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project name must be 100 characters or less"
            )

        # Validate description length
        if description and len(description) > 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project description must be 500 characters or less"
            )

        # Create new project
        project = Project(
            user_id=user_id,
            name=name.strip(),
            description=description.strip() if description else None,
            color=color
        )

        self.session.add(project)
        self.session.commit()
        self.session.refresh(project)

        return project

    def update_project(
        self,
        project_id: int,
        user_id: int,
        name: Optional[str] = None,
        description: Optional[str] = None,
        color: Optional[str] = None
    ) -> Project:
        """
        Update an existing project with user isolation.

        Args:
            project_id: ID of the project to update
            user_id: ID of the user (for ownership verification)
            name: Optional new name
            description: Optional new description
            color: Optional new color

        Returns:
            Updated Project object

        Raises:
            HTTPException: 404 if project not found or not owned by user
            HTTPException: 400 if validation fails
        """
        # Get project with user isolation
        project = self.get_project(project_id, user_id)

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        # Update fields if provided
        if name is not None:
            if len(name.strip()) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Project name cannot be empty"
                )
            if len(name) > 100:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Project name must be 100 characters or less"
                )
            project.name = name.strip()

        if description is not None:
            if len(description) > 500:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Project description must be 500 characters or less"
                )
            project.description = description.strip() if description else None

        if color is not None:
            project.color = color

        # Update timestamp
        project.updated_at = datetime.utcnow()

        self.session.add(project)
        self.session.commit()
        self.session.refresh(project)

        return project

    def delete_project(self, project_id: int, user_id: int) -> bool:
        """
        Delete a project with user isolation.

        Args:
            project_id: ID of the project to delete
            user_id: ID of the user (for ownership verification)

        Returns:
            True if project was deleted

        Raises:
            HTTPException: 404 if project not found or not owned by user
        """
        # Get project with user isolation
        project = self.get_project(project_id, user_id)

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        # Remove project_id from all tasks in this project
        statement = select(Task).where(Task.project_id == project_id, Task.user_id == user_id)
        tasks = self.session.exec(statement).all()
        for task in tasks:
            task.project_id = None

        self.session.delete(project)
        self.session.commit()

        return True

    def get_project_task_count(self, project_id: int, user_id: int) -> int:
        """
        Get the number of tasks in a project.

        Args:
            project_id: ID of the project
            user_id: ID of the user (for ownership verification)

        Returns:
            Number of tasks in the project
        """
        statement = select(func.count(Task.id)).where(
            Task.project_id == project_id,
            Task.user_id == user_id
        )
        count = self.session.exec(statement).first()
        return count or 0
