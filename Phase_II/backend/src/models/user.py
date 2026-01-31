"""User model for authentication and user management."""
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
from pydantic import field_validator
import re

class User(SQLModel, table=True):
    """
    User model representing a registered user.

    Attributes:
        id: Unique user identifier (auto-generated)
        email: User's email address (unique, used for login)
        hashed_password: Bcrypt-hashed password (never store plain text)
        name: User's display name
        bio: User's biography/description
        location: User's location
        website: User's website URL
        github: User's GitHub username
        twitter: User's Twitter handle
        linkedin: User's LinkedIn profile
        avatar_url: URL to user's avatar image
        created_at: Account creation timestamp
        updated_at: Last profile update timestamp
        tasks: Relationship to user's tasks (one-to-many)
    """
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)

    # Profile fields
    name: Optional[str] = Field(default=None, max_length=100)
    bio: Optional[str] = Field(default=None, max_length=500)
    location: Optional[str] = Field(default=None, max_length=100)
    website: Optional[str] = Field(default=None, max_length=255)
    github: Optional[str] = Field(default=None, max_length=50)
    twitter: Optional[str] = Field(default=None, max_length=50)
    linkedin: Optional[str] = Field(default=None, max_length=100)
    avatar_url: Optional[str] = Field(default=None, max_length=500)

    # Password reset fields
    reset_token: Optional[str] = Field(default=None, max_length=255)
    reset_token_expires: Optional[datetime] = Field(default=None)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)

    # Relationships
    tasks: List["Task"] = Relationship(back_populates="owner")
    notifications: List["Notification"] = Relationship(back_populates="owner")
    projects: List["Project"] = Relationship(back_populates="owner")
    tags: List["Tag"] = Relationship(back_populates="owner")
    settings: Optional["UserSettings"] = Relationship(back_populates="user")
    activities: List["UserActivity"] = Relationship(back_populates="user")

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Validate email format."""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()

    @field_validator('website')
    @classmethod
    def validate_website(cls, v: Optional[str]) -> Optional[str]:
        """Validate website URL format."""
        if v is None or v == "":
            return None
        if not v.startswith(('http://', 'https://')):
            v = 'https://' + v
        return v

class UserSettings(SQLModel, table=True):
    """
    User settings model for storing user preferences.
    """
    __tablename__ = "user_settings"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", unique=True)

    # Notification settings
    email_notifications: bool = Field(default=True)
    push_notifications: bool = Field(default=True)
    weekly_summary: bool = Field(default=False)

    # UI preferences
    theme: str = Field(default="light", max_length=20)
    language: str = Field(default="en", max_length=10)
    timezone: str = Field(default="UTC", max_length=50)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="settings")

class UserActivity(SQLModel, table=True):
    """
    User activity model for tracking user actions.
    """
    __tablename__ = "user_activities"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")

    action: str = Field(max_length=100)  # e.g., "created_task", "completed_task"
    description: str = Field(max_length=255)  # Human readable description
    entity_type: Optional[str] = Field(default=None, max_length=50)  # e.g., "task", "project"
    entity_id: Optional[int] = Field(default=None)  # ID of the related entity
    extra_data: Optional[str] = Field(default=None)  # JSON string for additional data

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="activities")
