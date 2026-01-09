"""Authentication API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.database import get_session
from src.schemas.user import UserRegisterRequest, UserLoginRequest, AuthResponse, UserResponse
from src.services.user_service import UserService

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegisterRequest,
    session: Session = Depends(get_session)
):
    """
    Register a new user account.

    Args:
        user_data: User registration data (email, password)
        session: Database session

    Returns:
        AuthResponse with user data and JWT token

    Raises:
        HTTPException: 409 if email already registered
        HTTPException: 400 if validation fails
    """
    service = UserService(session)

    # Create user
    user = service.create_user(user_data.email, user_data.password)

    # Generate JWT token
    token = service.create_user_token(user)

    # Return user data and token
    return AuthResponse(
        user=UserResponse.model_validate(user),
        token=token
    )

@router.post("/login", response_model=AuthResponse)
async def login(
    credentials: UserLoginRequest,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return JWT token.

    Args:
        credentials: User login credentials (email, password)
        session: Database session

    Returns:
        AuthResponse with user data and JWT token

    Raises:
        HTTPException: 401 if credentials are invalid
    """
    service = UserService(session)

    # Authenticate user
    user = service.authenticate_user(credentials.email, credentials.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Generate JWT token
    token = service.create_user_token(user)

    # Return user data and token
    return AuthResponse(
        user=UserResponse.model_validate(user),
        token=token
    )

@router.post("/logout")
async def logout():
    """
    Logout endpoint (client-side token removal).

    Note: JWT tokens are stateless, so logout is handled client-side
    by removing the token from storage. This endpoint exists for
    API consistency and future enhancements (e.g., token blacklisting).

    Returns:
        Success message
    """
    return {"message": "Logged out successfully"}
