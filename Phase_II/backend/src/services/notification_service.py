"""Notification service for business logic."""
from sqlmodel import Session, select
from src.models.notification import Notification, NotificationType
from typing import List, Optional
from datetime import datetime

class NotificationService:
    """
    Service class for notification operations.

    Handles business logic for creating, reading, updating, and deleting notifications.
    """

    def __init__(self, session: Session):
        """
        Initialize notification service.

        Args:
            session: Database session
        """
        self.session = session

    def create_notification(
        self,
        user_id: int,
        notification_type: str,
        title: str,
        description: str
    ) -> Notification:
        """
        Create a new notification for a user.

        Args:
            user_id: ID of the user to notify
            notification_type: Type of notification
            title: Notification title
            description: Notification description

        Returns:
            Created Notification object
        """
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            description=description,
            read=False
        )

        self.session.add(notification)
        self.session.commit()
        self.session.refresh(notification)

        return notification

    def list_notifications(self, user_id: int) -> List[Notification]:
        """
        List all notifications for a user, ordered by creation date (newest first).

        Args:
            user_id: ID of the user

        Returns:
            List of Notification objects
        """
        statement = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
        )
        notifications = self.session.exec(statement).all()
        return list(notifications)

    def get_unread_count(self, user_id: int) -> int:
        """
        Get count of unread notifications for a user.

        Args:
            user_id: ID of the user

        Returns:
            Count of unread notifications
        """
        statement = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .where(Notification.read == False)
        )
        notifications = self.session.exec(statement).all()
        return len(list(notifications))

    def mark_as_read(self, notification_id: int, user_id: int) -> Optional[Notification]:
        """
        Mark a notification as read.

        Args:
            notification_id: ID of the notification
            user_id: ID of the user (for ownership verification)

        Returns:
            Updated Notification object or None if not found
        """
        statement = (
            select(Notification)
            .where(Notification.id == notification_id)
            .where(Notification.user_id == user_id)
        )
        notification = self.session.exec(statement).first()

        if not notification:
            return None

        notification.read = True
        self.session.add(notification)
        self.session.commit()
        self.session.refresh(notification)

        return notification

    def mark_all_as_read(self, user_id: int) -> int:
        """
        Mark all notifications as read for a user.

        Args:
            user_id: ID of the user

        Returns:
            Number of notifications marked as read
        """
        statement = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .where(Notification.read == False)
        )
        notifications = self.session.exec(statement).all()

        count = 0
        for notification in notifications:
            notification.read = True
            self.session.add(notification)
            count += 1

        self.session.commit()
        return count

    def clear_all_notifications(self, user_id: int) -> int:
        """
        Delete all notifications for a user.

        Args:
            user_id: ID of the user

        Returns:
            Number of notifications deleted
        """
        statement = (
            select(Notification)
            .where(Notification.user_id == user_id)
        )
        notifications = self.session.exec(statement).all()

        count = 0
        for notification in notifications:
            self.session.delete(notification)
            count += 1

        self.session.commit()
        return count
