"""Task model for todo items."""
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    """
    Task model representing a todo item owned by a user.

    Attributes:
        id: Unique task identifier (auto-generated)
        user_id: Foreign key to owner user (enforces ownership)
        title: Task title (required, 1-200 characters)
        description: Optional task description (max 2000 characters)
        is_complete: Completion status (default: False)
        created_at: Task creation timestamp
        updated_at: Last modification timestamp
        owner: Relationship to user who owns this task
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_complete: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    owner: "User" = Relationship(back_populates="tasks")
