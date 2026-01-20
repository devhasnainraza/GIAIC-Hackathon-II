"""Tag service for tag management operations."""
from sqlmodel import Session, select, func
from src.models.tag import Tag, TaskTag
from typing import List, Optional
from fastapi import HTTPException, status
from datetime import datetime


class TagService:
    """
    Service layer for tag operations.
    Handles tag creation, retrieval, updates, and deletion with user isolation.
    """

    def __init__(self, session: Session):
        """
        Initialize TagService with database session.

        Args:
            session: SQLModel database session
        """
        self.session = session

    def list_tags(self, user_id: int) -> List[Tag]:
        """
        Retrieve all tags for a specific user.

        Args:
            user_id: ID of the user whose tags to retrieve

        Returns:
            List of Tag objects belonging to the user
        """
        statement = select(Tag).where(Tag.user_id == user_id).order_by(Tag.created_at.desc())
        tags = self.session.exec(statement).all()
        return list(tags)

    def get_tag(self, tag_id: int, user_id: int) -> Optional[Tag]:
        """
        Retrieve a specific tag by ID with user isolation.

        Args:
            tag_id: ID of the tag to retrieve
            user_id: ID of the user (for ownership verification)

        Returns:
            Tag object if found and owned by user, None otherwise
        """
        statement = select(Tag).where(Tag.id == tag_id, Tag.user_id == user_id)
        return self.session.exec(statement).first()

    def create_tag(
        self,
        user_id: int,
        name: str,
        color: str = "#3370ff"
    ) -> Tag:
        """
        Create a new tag for a user.

        Args:
            user_id: ID of the user creating the tag
            name: Tag name (1-50 characters)
            color: Hex color code for tag

        Returns:
            Created Tag object

        Raises:
            HTTPException: 400 if validation fails
        """
        # Validate name length
        if not name or len(name.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tag name cannot be empty"
            )

        if len(name) > 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tag name must be 50 characters or less"
            )

        # Check if tag with same name already exists for this user
        statement = select(Tag).where(Tag.user_id == user_id, Tag.name == name.strip().lower())
        existing_tag = self.session.exec(statement).first()
        if existing_tag:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tag with this name already exists"
            )

        # Create new tag
        tag = Tag(
            user_id=user_id,
            name=name.strip().lower(),
            color=color
        )

        self.session.add(tag)
        self.session.commit()
        self.session.refresh(tag)

        return tag

    def update_tag(
        self,
        tag_id: int,
        user_id: int,
        name: Optional[str] = None,
        color: Optional[str] = None
    ) -> Tag:
        """
        Update an existing tag with user isolation.

        Args:
            tag_id: ID of the tag to update
            user_id: ID of the user (for ownership verification)
            name: Optional new name
            color: Optional new color

        Returns:
            Updated Tag object

        Raises:
            HTTPException: 404 if tag not found or not owned by user
            HTTPException: 400 if validation fails
        """
        # Get tag with user isolation
        tag = self.get_tag(tag_id, user_id)

        if not tag:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag not found"
            )

        # Update fields if provided
        if name is not None:
            if len(name.strip()) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Tag name cannot be empty"
                )
            if len(name) > 50:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Tag name must be 50 characters or less"
                )

            # Check if tag with same name already exists for this user
            statement = select(Tag).where(
                Tag.user_id == user_id,
                Tag.name == name.strip().lower(),
                Tag.id != tag_id
            )
            existing_tag = self.session.exec(statement).first()
            if existing_tag:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Tag with this name already exists"
                )

            tag.name = name.strip().lower()

        if color is not None:
            tag.color = color

        self.session.add(tag)
        self.session.commit()
        self.session.refresh(tag)

        return tag

    def delete_tag(self, tag_id: int, user_id: int) -> bool:
        """
        Delete a tag with user isolation.

        Args:
            tag_id: ID of the tag to delete
            user_id: ID of the user (for ownership verification)

        Returns:
            True if tag was deleted

        Raises:
            HTTPException: 404 if tag not found or not owned by user
        """
        # Get tag with user isolation
        tag = self.get_tag(tag_id, user_id)

        if not tag:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag not found"
            )

        # Remove all task-tag associations
        statement = select(TaskTag).where(TaskTag.tag_id == tag_id)
        task_tags = self.session.exec(statement).all()
        for task_tag in task_tags:
            self.session.delete(task_tag)

        self.session.delete(tag)
        self.session.commit()

        return True

    def get_tag_task_count(self, tag_id: int, user_id: int) -> int:
        """
        Get the number of tasks with this tag.

        Args:
            tag_id: ID of the tag
            user_id: ID of the user (for ownership verification)

        Returns:
            Number of tasks with this tag
        """
        statement = select(func.count(TaskTag.task_id)).where(TaskTag.tag_id == tag_id)
        count = self.session.exec(statement).first()
        return count or 0
