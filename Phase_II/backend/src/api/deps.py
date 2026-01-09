"""Authentication dependency for FastAPI routes."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from src.database import get_session
from src.services.auth import verify_token
from src.models.user import User
from typing import Optional

# HTTP Bearer token security scheme
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """
    Dependency to get the current authenticated user from JWT token.

    This dependency:
    1. Extracts the Bearer token from the Authorization header
    2. Verifies the JWT token signature and expiration
    3. Extracts the user ID from the token claims
    4. Fetches the user from the database
    5. Returns the User object for use in route handlers

    Args:
        credentials: HTTP Bearer token credentials
        session: Database session

    Returns:
        User object of the authenticated user

    Raises:
        HTTPException: 401 if token is invalid or user not found
    """
    token = credentials.credentials

    try:
        # Verify token and extract claims
        payload = verify_token(token)
        user_id = payload["user_id"]
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Fetch user from database
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    session: Session = Depends(get_session)
) -> Optional[User]:
    """
    Optional authentication dependency.
    Returns None if no token provided, otherwise validates and returns user.

    Args:
        credentials: Optional HTTP Bearer token credentials
        session: Database session

    Returns:
        User object if authenticated, None otherwise
    """
    if not credentials:
        return None

    try:
        payload = verify_token(credentials.credentials)
        user_id = payload["user_id"]

        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()

        return user
    except (ValueError, HTTPException):
        return None
