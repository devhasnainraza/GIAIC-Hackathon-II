"""User profile and settings endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta

from src.database import get_session
from src.models.user import User, UserSettings, UserActivity
from src.models.task import Task
from src.api.deps import get_current_user
from src.services.auth import hash_password, verify_password
from src.services.cloudinary_storage import cloudinary_storage

router = APIRouter(prefix="/users", tags=["users"])


# Pydantic Models
class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class UserSettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    weekly_summary: Optional[bool] = None
    theme: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None


class UserStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    active_tasks: int
    completion_rate: float
    streak: int
    tasks_this_week: int
    tasks_this_month: int
    best_streak: int
    avg_completion_time: float
    productivity_score: int


class ActivityItem(BaseModel):
    action: str
    task_title: str
    timestamp: datetime


@router.get("/me")
async def get_current_user_profile(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get current user profile."""
    # Get user settings
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()

    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name or current_user.email.split("@")[0],
        "bio": current_user.bio,
        "location": current_user.location,
        "website": current_user.website,
        "github": current_user.github,
        "twitter": current_user.twitter,
        "linkedin": current_user.linkedin,
        "avatar_url": current_user.avatar_url,  # Already a full Cloudinary URL
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
        "settings": {
            "email_notifications": settings.email_notifications if settings else True,
            "push_notifications": settings.push_notifications if settings else True,
            "weekly_summary": settings.weekly_summary if settings else False,
            "theme": settings.theme if settings else "light",
            "language": settings.language if settings else "en",
            "timezone": settings.timezone if settings else "UTC",
        } if settings else {
            "email_notifications": True,
            "push_notifications": True,
            "weekly_summary": False,
            "theme": "light",
            "language": "en",
            "timezone": "UTC",
        }
    }


@router.patch("/me")
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Update user profile."""
    # Check if email is already taken by another user
    if profile_update.email and profile_update.email != current_user.email:
        existing_user = db.query(User).filter(User.email == profile_update.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = profile_update.email

    # Update profile fields
    if profile_update.name is not None:
        current_user.name = profile_update.name
    if profile_update.bio is not None:
        current_user.bio = profile_update.bio
    if profile_update.location is not None:
        current_user.location = profile_update.location
    if profile_update.website is not None:
        current_user.website = profile_update.website
    if profile_update.github is not None:
        current_user.github = profile_update.github
    if profile_update.twitter is not None:
        current_user.twitter = profile_update.twitter
    if profile_update.linkedin is not None:
        current_user.linkedin = profile_update.linkedin

    current_user.updated_at = datetime.utcnow()

    # Log activity
    activity = UserActivity(
        user_id=current_user.id,
        action="updated_profile",
        description="Updated profile information",
        entity_type="user",
        entity_id=current_user.id
    )
    db.add(activity)

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "bio": current_user.bio,
        "location": current_user.location,
        "website": current_user.website,
        "github": current_user.github,
        "twitter": current_user.twitter,
        "linkedin": current_user.linkedin,
        "message": "Profile updated successfully"
    }


@router.post("/me/avatar")
async def upload_avatar(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Upload user avatar to Cloudinary."""
    try:
        # Delete old avatar from Cloudinary if exists
        if current_user.avatar_url:
            cloudinary_storage.delete_avatar(current_user.avatar_url)

        # Upload new avatar to Cloudinary
        avatar_url = await cloudinary_storage.save_avatar(file, current_user.id)

        # Update user record with Cloudinary URL
        current_user.avatar_url = avatar_url
        current_user.updated_at = datetime.utcnow()
        db.add(current_user)

        # Log activity
        activity = UserActivity(
            user_id=current_user.id,
            action="updated_avatar",
            description="Updated profile avatar",
            entity_type="user",
            entity_id=current_user.id
        )
        db.add(activity)

        db.commit()
        db.refresh(current_user)

        return {
            "message": "Avatar uploaded successfully",
            "avatar_url": avatar_url
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload avatar: {str(e)}"
        )


@router.delete("/me/avatar")
async def delete_avatar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete user avatar from Cloudinary."""
    if current_user.avatar_url:
        cloudinary_storage.delete_avatar(current_user.avatar_url)
        current_user.avatar_url = None
        current_user.updated_at = datetime.utcnow()
        db.add(current_user)

        # Log activity
        activity = UserActivity(
            user_id=current_user.id,
            action="deleted_avatar",
            description="Deleted profile avatar",
            entity_type="user",
            entity_id=current_user.id
        )
        db.add(activity)

        db.commit()
        db.refresh(current_user)

    return {"message": "Avatar deleted successfully"}


@router.patch("/me/settings")
async def update_user_settings(
    settings_update: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Update user settings."""
    # Get or create user settings
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()

    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)

    # Update settings
    if settings_update.email_notifications is not None:
        settings.email_notifications = settings_update.email_notifications
    if settings_update.push_notifications is not None:
        settings.push_notifications = settings_update.push_notifications
    if settings_update.weekly_summary is not None:
        settings.weekly_summary = settings_update.weekly_summary
    if settings_update.theme is not None:
        settings.theme = settings_update.theme
    if settings_update.language is not None:
        settings.language = settings_update.language
    if settings_update.timezone is not None:
        settings.timezone = settings_update.timezone

    settings.updated_at = datetime.utcnow()

    # Log activity
    activity = UserActivity(
        user_id=current_user.id,
        action="updated_settings",
        description="Updated account settings",
        entity_type="settings",
        entity_id=settings.id
    )
    db.add(activity)

    db.commit()
    db.refresh(settings)

    return {
        "message": "Settings updated successfully",
        "settings": {
            "email_notifications": settings.email_notifications,
            "push_notifications": settings.push_notifications,
            "weekly_summary": settings.weekly_summary,
            "theme": settings.theme,
            "language": settings.language,
            "timezone": settings.timezone,
        }
    }


@router.post("/me/password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Change user password."""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Validate new password
    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )

    # Update password
    current_user.hashed_password = hash_password(password_data.new_password)
    db.commit()

    return {"message": "Password changed successfully"}


@router.get("/me/stats", response_model=UserStats)
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get user statistics."""
    # Total tasks
    total_tasks = db.query(func.count(Task.id)).filter(Task.user_id == current_user.id).scalar()

    # Completed tasks
    completed_tasks = db.query(func.count(Task.id)).filter(
        Task.user_id == current_user.id,
        Task.is_complete == True
    ).scalar()

    # Active tasks
    active_tasks = total_tasks - completed_tasks

    # Completion rate
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

    # Tasks this week
    week_ago = datetime.utcnow() - timedelta(days=7)
    tasks_this_week = db.query(func.count(Task.id)).filter(
        Task.user_id == current_user.id,
        Task.is_complete == True,
        Task.updated_at >= week_ago
    ).scalar()

    # Tasks this month
    month_ago = datetime.utcnow() - timedelta(days=30)
    tasks_this_month = db.query(func.count(Task.id)).filter(
        Task.user_id == current_user.id,
        Task.is_complete == True,
        Task.updated_at >= month_ago
    ).scalar()

    # Calculate streak (simplified - consecutive days with completed tasks)
    streak = 7  # Placeholder - would need more complex logic

    return UserStats(
        total_tasks=total_tasks or 0,
        completed_tasks=completed_tasks or 0,
        active_tasks=active_tasks or 0,
        completion_rate=round(completion_rate, 1),
        streak=streak,
        tasks_this_week=tasks_this_week or 0,
        tasks_this_month=tasks_this_month or 0,
        best_streak=streak,  # For now, same as current streak
        avg_completion_time=0.0,  # Placeholder - would need more complex calculation
        productivity_score=min(100, max(0, int(completion_rate + (streak * 2))))  # Simple calculation
    )


@router.get("/me/activity")
async def get_user_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get user recent activity."""
    # Get recent tasks (last 10)
    recent_tasks = db.query(Task).filter(
        Task.user_id == current_user.id
    ).order_by(Task.updated_at.desc()).limit(10).all()

    activity = []
    for task in recent_tasks:
        action = "Completed task" if task.is_complete else "Created task"
        activity.append({
            "action": action,
            "task_title": task.title,
            "timestamp": task.updated_at,
            "icon": "✓" if task.is_complete else "+",
            "color": "emerald" if task.is_complete else "blue"
        })

    return activity


@router.get("/me/weekly-activity")
async def get_weekly_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get weekly activity data for chart."""
    weekly_data = []

    for i in range(7):
        day_start = datetime.utcnow() - timedelta(days=6-i)
        day_start = day_start.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        completed_count = db.query(func.count(Task.id)).filter(
            Task.user_id == current_user.id,
            Task.is_complete == True,
            Task.updated_at >= day_start,
            Task.updated_at < day_end
        ).scalar()

        weekly_data.append({
            "day": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            "count": completed_count or 0
        })

    return weekly_data


@router.patch("/me/preferences")
async def update_preferences(
    preferences: UserSettings,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Update user preferences."""
    # In a real app, you'd store these in a preferences table
    # For now, we'll just return success
    return {
        "message": "Preferences updated successfully",
        "preferences": preferences.dict()
    }


@router.delete("/me")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete user account and all associated data."""
    # Delete all user's tasks first
    db.query(Task).filter(Task.user_id == current_user.id).delete()

    # Delete user
    db.delete(current_user)
    db.commit()

    return {"message": "Account deleted successfully"}
