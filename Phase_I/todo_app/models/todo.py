"""TodoItem domain model with Pydantic validation."""

from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class TodoItem(BaseModel):
    """
    Represents a single todo item in the application.

    Attributes:
        id: Unique identifier for the todo
        title: Main task description (required, 1-500 chars)
        description: Optional detailed description (0-2000 chars)
        completed: Whether the task is completed (default: False)
        created_at: Timestamp when the todo was created
    """

    id: int = Field(..., gt=0, description="Unique positive integer identifier")
    title: str = Field(..., min_length=1, max_length=500, description="Task title")
    description: str = Field(default="", max_length=2000, description="Optional task description")
    completed: bool = Field(default=False, description="Completion status")
    created_at: datetime = Field(default_factory=datetime.now, description="Creation timestamp")

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        """Validate that title is not empty or whitespace only."""
        if not v.strip():
            raise ValueError("Title cannot be empty or whitespace only")
        return v.strip()

    @field_validator("description")
    @classmethod
    def description_length(cls, v: str) -> str:
        """Validate that description does not exceed maximum length."""
        if len(v) > 2000:
            raise ValueError("Description cannot exceed 2000 characters")
        return v

    model_config = {"frozen": False, "validate_assignment": True}
