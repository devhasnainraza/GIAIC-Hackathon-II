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
        created_at: Account creation timestamp
        tasks: Relationship to user's tasks (one-to-many)
    """
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: List["Task"] = Relationship(back_populates="owner")

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Validate email format."""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()
