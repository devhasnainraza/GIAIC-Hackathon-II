"""Project model for organizing tasks."""
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class Project(SQLModel, table=True):
    """
    Project model for organizing tasks into groups.

    Attributes:
        id: Unique project identifier
        user_id: Foreign key to owner user
        name: Project name
        description: Optional project description
        color: Hex color code for project (e.g., #10b981)
        created_at: Project creation timestamp
        updated_at: Last modification timestamp
        owner: Relationship to user who owns this project
        tasks: Relationship to tasks in this project
    """
    __tablename__ = "projects"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    name: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    color: str = Field(default="#10b981", max_length=7)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    owner: "User" = Relationship(back_populates="projects")
    tasks: List["Task"] = Relationship(back_populates="project")
