"""Authentication API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session
from src.database import get_session
from src.schemas.user import (
    UserRegisterRequest,
    UserLoginRequest,
    AuthResponse,
    UserResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from src.services.user_service import UserService
from src.services.email_service import email_service, generate_reset_token, get_token_expiry
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/auth", tags=["authentication"])

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

@router.post("/forgot-password")
@limiter.limit("3/hour")  # Rate limit: 3 requests per hour per IP
async def forgot_password(
    request: Request,
    request_data: ForgotPasswordRequest,
    session: Session = Depends(get_session)
):
    """
    Request a password reset link.

    Sends a password reset email to the user if the email exists.
    For security, always returns success even if email doesn't exist.

    Rate Limited: 3 requests per hour per IP address.

    Args:
        request: FastAPI request object (for rate limiting)
        request_data: Email address for password reset
        session: Database session

    Returns:
        Success message
    """
    service = UserService(session)

    logger.info(f"Password reset requested for email: {request_data.email}")

    # Check if user exists
    user = service.get_user_by_email(request_data.email)

    if user:
        try:
            # Generate secure reset token
            reset_token = generate_reset_token()
            token_expiry = get_token_expiry()

            # Store token in database
            service.set_password_reset_token(user, reset_token, token_expiry)
            logger.info(f"Reset token generated for user: {user.email}")

            # Send password reset email
            email_sent = await email_service.send_password_reset_email(user.email, reset_token)

            if email_sent:
                logger.info(f"Password reset email sent successfully to: {user.email}")
            else:
                logger.error(f"Failed to send password reset email to: {user.email}")
                # Don't fail the request - user can retry

        except Exception as e:
            logger.error(f"Error processing password reset for {request_data.email}: {e}", exc_info=True)
            # Don't reveal error details to user
    else:
        logger.info(f"Password reset requested for non-existent email: {request_data.email}")

    # Always return success for security (don't reveal if email exists)
    return {
        "message": "If an account exists with this email, you will receive a password reset link.",
        "email": request_data.email
    }

@router.post("/reset-password")
@limiter.limit("5/hour")  # Rate limit: 5 attempts per hour per IP
async def reset_password(
    request: Request,
    request_data: ResetPasswordRequest,
    session: Session = Depends(get_session)
):
    """
    Reset password using a valid reset token.

    Rate Limited: 5 attempts per hour per IP address.

    Args:
        request: FastAPI request object (for rate limiting)
        request_data: Reset token and new password
        session: Database session

    Returns:
        Success message

    Raises:
        HTTPException: 400 if token is invalid or expired
    """
    service = UserService(session)

    logger.info(f"Password reset attempt with token: {request_data.token[:10]}...")

    # Get user by reset token
    user = service.get_user_by_reset_token(request_data.token)

    if not user:
        logger.warning(f"Invalid or expired reset token: {request_data.token[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    try:
        # Update password and clear reset token
        service.update_user_password(user, request_data.new_password)
        logger.info(f"Password reset successful for user: {user.email}")

        return {
            "message": "Password has been reset successfully. You can now sign in with your new password."
        }
    except Exception as e:
        logger.error(f"Error resetting password for user {user.email}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while resetting your password. Please try again."
        )
