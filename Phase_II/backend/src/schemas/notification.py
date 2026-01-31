"""Pydantic schemas for notification API requests and responses."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class NotificationCreateRequest(BaseModel):
    """
    Request schema for creating a notification.

    Attributes:
        type: Notification type (task_created, task_completed, etc.)
        title: Notification title
        description: Notification description
    """
    type: str = Field(..., min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=500)

class NotificationResponse(BaseModel):
    """
    Response schema for notification data.

    Attributes:
        id: Notification ID
        user_id: User ID who owns the notification
        type: Notification type
        title: Notification title
        description: Notification description
        read: Whether notification has been read
        created_at: Creation timestamp
    """
    id: int
    user_id: int
    type: str
    title: str
    description: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True  # Enable ORM mode for SQLModel compatibility

class UnreadCountResponse(BaseModel):
    """
    Response schema for unread notification count.

    Attributes:
        count: Number of unread notifications
    """
    count: int
