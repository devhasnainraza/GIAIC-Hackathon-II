"""Task Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class TagResponse(BaseModel):
    """Response schema for tag data."""
    id: int
    name: str
    color: str

    class Config:
        from_attributes = True


class ProjectResponse(BaseModel):
    """Response schema for project data."""
    id: int
    name: str
    description: Optional[str]
    color: str

    class Config:
        from_attributes = True


class TaskCreateRequest(BaseModel):
    """Request schema for creating a new task."""
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=2000, description="Task description")
    status: Optional[str] = Field("todo", description="Task status (todo, in_progress, review, done)")
    priority: Optional[str] = Field("medium", description="Task priority (low, medium, high, urgent)")
    due_date: Optional[datetime] = Field(None, description="Task due date")
    project_id: Optional[int] = Field(None, description="Project ID")
    tag_ids: Optional[List[int]] = Field(default_factory=list, description="List of tag IDs")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project documentation",
                "description": "Write comprehensive documentation for the API endpoints",
                "status": "todo",
                "priority": "high",
                "due_date": "2024-01-15T10:00:00Z",
                "project_id": 1,
                "tag_ids": [1, 2]
            }
        }


class TaskUpdateRequest(BaseModel):
    """Request schema for updating an existing task."""
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=2000, description="Task description")
    status: Optional[str] = Field(None, description="Task status (todo, in_progress, review, done)")
    priority: Optional[str] = Field(None, description="Task priority (low, medium, high, urgent)")
    due_date: Optional[datetime] = Field(None, description="Task due date")
    project_id: Optional[int] = Field(None, description="Project ID")
    is_complete: Optional[bool] = Field(None, description="Task completion status")
    tag_ids: Optional[List[int]] = Field(None, description="List of tag IDs")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Updated task title",
                "description": "Updated description",
                "status": "in_progress",
                "priority": "urgent",
                "is_complete": False
            }
        }


class TaskResponse(BaseModel):
    """Response schema for task data."""
    id: int
    user_id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[datetime]
    project_id: Optional[int]
    is_complete: bool
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    project: Optional[ProjectResponse] = None
    tags: List[TagResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": 1,
                "title": "Complete project documentation",
                "description": "Write comprehensive documentation for the API endpoints",
                "status": "in_progress",
                "priority": "high",
                "due_date": "2024-01-15T10:00:00Z",
                "project_id": 1,
                "is_complete": False,
                "created_at": "2024-01-09T10:00:00Z",
                "updated_at": "2024-01-09T10:00:00Z",
                "completed_at": None,
                "project": {"id": 1, "name": "Documentation", "description": "Project docs", "color": "#10b981"},
                "tags": [{"id": 1, "name": "urgent", "color": "#ef4444"}]
            }
        }
