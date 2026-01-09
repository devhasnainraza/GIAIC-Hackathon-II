"""Pydantic schemas for user authentication and management."""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserRegisterRequest(BaseModel):
    """
    Request schema for user registration.

    Attributes:
        email: User's email address (must be valid format)
        password: User's password (minimum 8 characters)
    """
    email: EmailStr
    password: str = Field(min_length=8, description="Password must be at least 8 characters")

class UserLoginRequest(BaseModel):
    """
    Request schema for user login.

    Attributes:
        email: User's email address
        password: User's password
    """
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """
    Response schema for user data (without sensitive information).

    Attributes:
        id: User's unique identifier
        email: User's email address
        created_at: Account creation timestamp
    """
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    """
    Response schema for authentication (login/register).

    Attributes:
        user: User data
        token: JWT access token
    """
    user: UserResponse
    token: str
