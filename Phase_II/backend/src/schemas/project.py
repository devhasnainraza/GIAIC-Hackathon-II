"""Project Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ProjectCreateRequest(BaseModel):
    """Request schema for creating a new project."""
    name: str = Field(..., min_length=1, max_length=100, description="Project name")
    description: Optional[str] = Field(None, max_length=500, description="Project description")
    color: Optional[str] = Field("#10b981", max_length=7, description="Project color (hex code)")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Website Redesign",
                "description": "Complete redesign of company website",
                "color": "#10b981"
            }
        }


class ProjectUpdateRequest(BaseModel):
    """Request schema for updating an existing project."""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Project name")
    description: Optional[str] = Field(None, max_length=500, description="Project description")
    color: Optional[str] = Field(None, max_length=7, description="Project color (hex code)")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Updated Project Name",
                "description": "Updated description",
                "color": "#3370ff"
            }
        }


class ProjectResponse(BaseModel):
    """Response schema for project data."""
    id: int
    user_id: int
    name: str
    description: Optional[str]
    color: str
    created_at: datetime
    updated_at: datetime
    task_count: int = 0

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": 1,
                "name": "Website Redesign",
                "description": "Complete redesign of company website",
                "color": "#10b981",
                "created_at": "2024-01-09T10:00:00Z",
                "updated_at": "2024-01-09T10:00:00Z",
                "task_count": 5
            }
        }
