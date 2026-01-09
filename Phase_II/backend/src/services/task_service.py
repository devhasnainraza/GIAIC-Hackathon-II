"""Task service for task management operations."""
from sqlmodel import Session, select
from src.models.task import Task
from src.models.user import User
from typing import List, Optional
from fastapi import HTTPException, status
from datetime import datetime


class TaskService:
    """
    Service layer for task operations.
    Handles task creation, retrieval, updates, and deletion with user isolation.
    """

    def __init__(self, session: Session):
        """
        Initialize TaskService with database session.

        Args:
            session: SQLModel database session
        """
        self.session = session

    def list_tasks(self, user_id: int) -> List[Task]:
        """
        Retrieve all tasks for a specific user.

        Args:
            user_id: ID of the user whose tasks to retrieve

        Returns:
            List of Task objects belonging to the user
        """
        statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
        tasks = self.session.exec(statement).all()
        return list(tasks)

    def get_task(self, task_id: int, user_id: int) -> Optional[Task]:
        """
        Retrieve a specific task by ID with user isolation.

        Args:
            task_id: ID of the task to retrieve
            user_id: ID of the user (for ownership verification)

        Returns:
            Task object if found and owned by user, None otherwise
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        return self.session.exec(statement).first()

    def create_task(self, user_id: int, title: str, description: Optional[str] = None) -> Task:
        """
        Create a new task for a user.

        Args:
            user_id: ID of the user creating the task
            title: Task title (1-200 characters)
            description: Optional task description (max 2000 characters)

        Returns:
            Created Task object

        Raises:
            HTTPException: 400 if validation fails
        """
        # Validate title length
        if not title or len(title.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task title cannot be empty"
            )

        if len(title) > 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task title must be 200 characters or less"
            )

        # Validate description length
        if description and len(description) > 2000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task description must be 2000 characters or less"
            )

        # Create new task
        task = Task(
            user_id=user_id,
            title=title.strip(),
            description=description.strip() if description else None,
            is_complete=False
        )

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        return task

    def update_task(
        self,
        task_id: int,
        user_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
        is_complete: Optional[bool] = None
    ) -> Task:
        """
        Update an existing task with user isolation.

        Args:
            task_id: ID of the task to update
            user_id: ID of the user (for ownership verification)
            title: Optional new title
            description: Optional new description
            is_complete: Optional new completion status

        Returns:
            Updated Task object

        Raises:
            HTTPException: 404 if task not found or not owned by user
            HTTPException: 400 if validation fails
        """
        # Get task with user isolation
        task = self.get_task(task_id, user_id)

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Update fields if provided
        if title is not None:
            if len(title.strip()) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Task title cannot be empty"
                )
            if len(title) > 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Task title must be 200 characters or less"
                )
            task.title = title.strip()

        if description is not None:
            if len(description) > 2000:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Task description must be 2000 characters or less"
                )
            task.description = description.strip() if description else None

        if is_complete is not None:
            task.is_complete = is_complete

        # Update timestamp
        task.updated_at = datetime.utcnow()

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        return task

    def delete_task(self, task_id: int, user_id: int) -> bool:
        """
        Delete a task with user isolation.

        Args:
            task_id: ID of the task to delete
            user_id: ID of the user (for ownership verification)

        Returns:
            True if task was deleted, False if not found

        Raises:
            HTTPException: 404 if task not found or not owned by user
        """
        # Get task with user isolation
        task = self.get_task(task_id, user_id)

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        self.session.delete(task)
        self.session.commit()

        return True
