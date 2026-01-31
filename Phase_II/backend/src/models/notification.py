"""Notification model for user notifications."""
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
from enum import Enum

class NotificationType(str, Enum):
    """Notification type enumeration."""
    TASK_CREATED = "task_created"
    TASK_COMPLETED = "task_completed"
    TASK_DELETED = "task_deleted"
    TASK_UPDATED = "task_updated"
    SYSTEM = "system"

class Notification(SQLModel, table=True):
    """
    Notification model representing user notifications.

    Attributes:
        id: Unique notification identifier (auto-generated)
        user_id: Foreign key to user who owns this notification
        type: Type of notification (task_created, task_completed, etc.)
        title: Notification title (required, max 200 characters)
        description: Notification description (required, max 500 characters)
        read: Whether notification has been read (default: False)
        created_at: Notification creation timestamp
        owner: Relationship to user who owns this notification
    """
    __tablename__ = "notifications"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    type: str = Field(max_length=50)  # NotificationType enum value
    title: str = Field(max_length=200)
    description: str = Field(max_length=500)
    read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    owner: "User" = Relationship(back_populates="notifications")
