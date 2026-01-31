"""Task model for todo items."""
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
from enum import Enum

class TaskStatus(str, Enum):
    """Task status options."""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"

class TaskPriority(str, Enum):
    """Task priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Task(SQLModel, table=True):
    """
    Task model representing a todo item owned by a user.

    Attributes:
        id: Unique task identifier (auto-generated)
        user_id: Foreign key to owner user (enforces ownership)
        title: Task title (required, 1-200 characters)
        description: Optional task description (max 2000 characters)
        status: Task status (todo, in_progress, review, done)
        priority: Task priority (low, medium, high, urgent)
        due_date: Optional due date for the task
        project_id: Optional foreign key to project
        is_complete: Completion status (default: False) - kept for backward compatibility
        created_at: Task creation timestamp
        updated_at: Last modification timestamp
        completed_at: Task completion timestamp
        owner: Relationship to user who owns this task
        project: Relationship to project this task belongs to
        tags: Relationship to tags associated with this task
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: str = Field(default=TaskStatus.TODO.value, max_length=20)
    priority: str = Field(default=TaskPriority.MEDIUM.value, max_length=20)
    due_date: Optional[datetime] = Field(default=None)
    project_id: Optional[int] = Field(default=None, foreign_key="projects.id")
    is_complete: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)

    # Relationships
    owner: "User" = Relationship(back_populates="tasks")
    project: Optional["Project"] = Relationship(back_populates="tasks")
