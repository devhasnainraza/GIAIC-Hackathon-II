"""Tag model for categorizing tasks."""
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class Tag(SQLModel, table=True):
    """
    Tag model for categorizing tasks.

    Attributes:
        id: Unique tag identifier
        user_id: Foreign key to owner user
        name: Tag name
        color: Hex color code for tag (e.g., #3370ff)
        created_at: Tag creation timestamp
        owner: Relationship to user who owns this tag
        tasks: Relationship to tasks with this tag
    """
    __tablename__ = "tags"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    name: str = Field(min_length=1, max_length=50)
    color: str = Field(default="#3370ff", max_length=7)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    owner: "User" = Relationship(back_populates="tags")


class TaskTag(SQLModel, table=True):
    """
    Link table for many-to-many relationship between tasks and tags.
    """
    __tablename__ = "task_tags"

    task_id: int = Field(foreign_key="tasks.id", primary_key=True)
    tag_id: int = Field(foreign_key="tags.id", primary_key=True)
