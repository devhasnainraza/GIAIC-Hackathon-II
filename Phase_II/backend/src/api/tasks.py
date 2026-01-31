"""Task API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from src.database import get_session
from src.schemas.task import TaskCreateRequest, TaskUpdateRequest, TaskResponse
from src.services.task_service import TaskService
from src.services.notification_service import NotificationService
from src.models.notification import NotificationType
from src.api.deps import get_current_user
from src.models.user import User

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=List[TaskResponse])
async def list_tasks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    List all tasks for the authenticated user.

    Args:
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        List of TaskResponse objects for the user's tasks

    Note:
        User isolation is enforced - only returns tasks owned by the authenticated user
    """
    service = TaskService(session)
    tasks = service.list_tasks(current_user.id)
    return [TaskResponse.model_validate(task) for task in tasks]


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.

    Args:
        task_data: Task creation data (title, description, status, priority, etc.)
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        TaskResponse with created task data

    Raises:
        HTTPException: 400 if validation fails (title length, description length)

    Note:
        User ID is automatically assigned from the authenticated user
        Creates a notification for the user when task is created
    """
    service = TaskService(session)
    task = service.create_task(
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status or "todo",
        priority=task_data.priority or "medium",
        due_date=task_data.due_date,
        project_id=task_data.project_id,
        tag_ids=task_data.tag_ids
    )

    # Create notification for task creation
    notification_service = NotificationService(session)
    notification_service.create_notification(
        user_id=current_user.id,
        notification_type=NotificationType.TASK_CREATED,
        title="Task Created",
        description=f'New task "{task.title}" was created'
    )

    return TaskResponse.model_validate(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID.

    Args:
        task_id: ID of the task to retrieve
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        TaskResponse with task data

    Raises:
        HTTPException: 404 if task not found or not owned by user

    Note:
        User isolation is enforced - only returns task if owned by authenticated user
    """
    service = TaskService(session)
    task = service.get_task(task_id, current_user.id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse.model_validate(task)


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update an existing task.

    Args:
        task_id: ID of the task to update
        task_data: Task update data (title, description, status, priority, etc.)
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        TaskResponse with updated task data

    Raises:
        HTTPException: 404 if task not found or not owned by user
        HTTPException: 400 if validation fails

    Note:
        User isolation is enforced - only updates task if owned by authenticated user
        Creates a notification when task is completed or updated
    """
    service = TaskService(session)

    # Get the task before update to check if completion status changed
    old_task = service.get_task(task_id, current_user.id)
    if not old_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update the task
    task = service.update_task(
        task_id=task_id,
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        due_date=task_data.due_date,
        project_id=task_data.project_id,
        is_complete=task_data.is_complete,
        tag_ids=task_data.tag_ids
    )

    # Create notification based on what changed
    notification_service = NotificationService(session)

    # Check if task was just completed
    if task_data.is_complete is not None and task_data.is_complete and not old_task.is_complete:
        notification_service.create_notification(
            user_id=current_user.id,
            notification_type=NotificationType.TASK_COMPLETED,
            title="Task Completed",
            description=f'You completed "{task.title}"'
        )
    elif task_data.status == "done" and old_task.status != "done":
        notification_service.create_notification(
            user_id=current_user.id,
            notification_type=NotificationType.TASK_COMPLETED,
            title="Task Completed",
            description=f'You completed "{task.title}"'
        )
    else:
        # General update notification
        notification_service.create_notification(
            user_id=current_user.id,
            notification_type=NotificationType.TASK_UPDATED,
            title="Task Updated",
            description=f'Task "{task.title}" was updated'
        )

    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a task.

    Args:
        task_id: ID of the task to delete
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        No content (204 status)

    Raises:
        HTTPException: 404 if task not found or not owned by user

    Note:
        User isolation is enforced - only deletes task if owned by authenticated user
        Creates a notification when task is deleted
    """
    service = TaskService(session)

    # Get task title before deletion for notification
    task = service.get_task(task_id, current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task_title = task.title

    # Delete the task
    service.delete_task(task_id, current_user.id)

    # Create notification for task deletion
    notification_service = NotificationService(session)
    notification_service.create_notification(
        user_id=current_user.id,
        notification_type=NotificationType.TASK_DELETED,
        title="Task Deleted",
        description=f'Task "{task_title}" was deleted'
    )

    return None
