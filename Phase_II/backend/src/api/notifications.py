"""Notification API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from src.database import get_session
from src.schemas.notification import (
    NotificationCreateRequest,
    NotificationResponse,
    UnreadCountResponse
)
from src.services.notification_service import NotificationService
from src.api.deps import get_current_user
from src.models.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=List[NotificationResponse])
async def list_notifications(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all notifications for the authenticated user.

    Args:
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        List of NotificationResponse objects ordered by creation date (newest first)

    Note:
        User isolation is enforced - only returns notifications owned by the authenticated user
    """
    service = NotificationService(session)
    notifications = service.list_notifications(current_user.id)
    return [NotificationResponse.model_validate(n) for n in notifications]


@router.get("/unread", response_model=UnreadCountResponse)
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get count of unread notifications for the authenticated user.

    Args:
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        UnreadCountResponse with count of unread notifications

    Note:
        User isolation is enforced - only counts notifications owned by the authenticated user
    """
    service = NotificationService(session)
    count = service.get_unread_count(current_user.id)
    return UnreadCountResponse(count=count)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Mark a specific notification as read.

    Args:
        notification_id: ID of the notification to mark as read
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        NotificationResponse with updated notification data

    Raises:
        HTTPException: 404 if notification not found or not owned by user

    Note:
        User isolation is enforced - only marks notification as read if owned by authenticated user
    """
    service = NotificationService(session)
    notification = service.mark_as_read(notification_id, current_user.id)

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    return NotificationResponse.model_validate(notification)


@router.post("/mark-all-read", status_code=status.HTTP_200_OK)
async def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Mark all notifications as read for the authenticated user.

    Args:
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        Dictionary with count of notifications marked as read

    Note:
        User isolation is enforced - only marks notifications owned by authenticated user
    """
    service = NotificationService(session)
    count = service.mark_all_as_read(current_user.id)
    return {"message": f"Marked {count} notifications as read", "count": count}


@router.delete("", status_code=status.HTTP_200_OK)
async def clear_all_notifications(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete all notifications for the authenticated user.

    Args:
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        Dictionary with count of notifications deleted

    Note:
        User isolation is enforced - only deletes notifications owned by authenticated user
    """
    service = NotificationService(session)
    count = service.clear_all_notifications(current_user.id)
    return {"message": f"Cleared {count} notifications", "count": count}


@router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(
    notification_data: NotificationCreateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new notification for the authenticated user.

    This endpoint is primarily for internal use or testing.
    In production, notifications are typically created automatically by the system.

    Args:
        notification_data: Notification creation data
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        NotificationResponse with created notification data

    Note:
        User ID is automatically assigned from the authenticated user
    """
    service = NotificationService(session)
    notification = service.create_notification(
        user_id=current_user.id,
        notification_type=notification_data.type,
        title=notification_data.title,
        description=notification_data.description
    )
    return NotificationResponse.model_validate(notification)
