"""Tag Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TagCreateRequest(BaseModel):
    """Request schema for creating a new tag."""
    name: str = Field(..., min_length=1, max_length=50, description="Tag name")
    color: Optional[str] = Field("#3370ff", max_length=7, description="Tag color (hex code)")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "urgent",
                "color": "#ef4444"
            }
        }


class TagUpdateRequest(BaseModel):
    """Request schema for updating an existing tag."""
    name: Optional[str] = Field(None, min_length=1, max_length=50, description="Tag name")
    color: Optional[str] = Field(None, max_length=7, description="Tag color (hex code)")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "high-priority",
                "color": "#f59e0b"
            }
        }


class TagResponse(BaseModel):
    """Response schema for tag data."""
    id: int
    user_id: int
    name: str
    color: str
    created_at: datetime
    task_count: int = 0

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": 1,
                "name": "urgent",
                "color": "#ef4444",
                "created_at": "2024-01-09T10:00:00Z",
                "task_count": 3
            }
        }
