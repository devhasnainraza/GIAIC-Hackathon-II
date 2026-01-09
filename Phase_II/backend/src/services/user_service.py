"""User service for user management and authentication."""
from sqlmodel import Session, select
from src.models.user import User
from src.services.auth import hash_password, verify_password, create_access_token
from typing import Optional
from fastapi import HTTPException, status

class UserService:
    """
    Service layer for user operations.
    Handles user creation, authentication, and retrieval.
    """

    def __init__(self, session: Session):
        """
        Initialize UserService with database session.

        Args:
            session: SQLModel database session
        """
        self.session = session

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve user by email address.

        Args:
            email: User's email address

        Returns:
            User object if found, None otherwise
        """
        statement = select(User).where(User.email == email.lower())
        return self.session.exec(statement).first()

    def create_user(self, email: str, password: str) -> User:
        """
        Create a new user account.

        Args:
            email: User's email address
            password: Plain text password (will be hashed)

        Returns:
            Created User object

        Raises:
            HTTPException: 409 if email already exists
        """
        # Check if user already exists
        existing_user = self.get_user_by_email(email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        # Create new user with hashed password
        user = User(
            email=email.lower(),  # Normalize email to lowercase
            hashed_password=hash_password(password)
        )

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        return user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate user with email and password.

        Args:
            email: User's email address
            password: Plain text password to verify

        Returns:
            User object if authentication successful, None otherwise
        """
        user = self.get_user_by_email(email)

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return user

    def create_user_token(self, user: User) -> str:
        """
        Create JWT access token for user.

        Args:
            user: User object to create token for

        Returns:
            JWT token string
        """
        token_data = {
            "sub": str(user.id),  # Subject (user ID)
            "email": user.email
        }

        return create_access_token(token_data)
