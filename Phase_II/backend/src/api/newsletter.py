"""Newsletter subscription API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session, select
from typing import List
import secrets
from datetime import datetime

from src.database import get_session
from src.models.newsletter import NewsletterSubscriber
from src.services.newsletter_service import send_newsletter_confirmation, send_newsletter_update, send_welcome_newsletter
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/newsletter", tags=["Newsletter"])


class NewsletterSubscribeRequest(BaseModel):
    """Newsletter subscription request."""
    email: EmailStr


class NewsletterResponse(BaseModel):
    """Newsletter subscription response."""
    message: str
    email: str


class SendNewsletterRequest(BaseModel):
    """Send newsletter request."""
    subject: str
    content: str


@router.post("/subscribe", response_model=NewsletterResponse)
async def subscribe_to_newsletter(
    request: NewsletterSubscribeRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_session)
):
    """
    Subscribe to newsletter.

    - Checks if email already exists
    - Creates new subscriber with verification token
    - Sends confirmation email
    """
    # Check if email already exists
    statement = select(NewsletterSubscriber).where(
        NewsletterSubscriber.email == request.email
    )
    existing_subscriber = db.exec(statement).first()

    if existing_subscriber:
        if existing_subscriber.is_active:
            return NewsletterResponse(
                message="You are already subscribed to our newsletter!",
                email=request.email
            )
        else:
            # Reactivate subscription
            existing_subscriber.is_active = True
            existing_subscriber.subscribed_at = datetime.utcnow()
            existing_subscriber.unsubscribed_at = None
            db.add(existing_subscriber)
            db.commit()
            db.refresh(existing_subscriber)

            return NewsletterResponse(
                message="Welcome back! You have been resubscribed to our newsletter.",
                email=request.email
            )

    # Create new subscriber
    verification_token = secrets.token_urlsafe(32)
    subscriber = NewsletterSubscriber(
        email=request.email,
        verification_token=verification_token,
        is_verified=False
    )

    db.add(subscriber)
    db.commit()
    db.refresh(subscriber)

    # Send confirmation email in background
    background_tasks.add_task(
        send_newsletter_confirmation,
        request.email,
        verification_token
    )

    return NewsletterResponse(
        message="Thank you for subscribing! Please check your email to confirm your subscription.",
        email=request.email
    )


@router.get("/verify/{token}")
async def verify_newsletter_subscription(
    token: str,
    db: Session = Depends(get_session)
):
    """
    Verify newsletter subscription via email token.
    """
    statement = select(NewsletterSubscriber).where(
        NewsletterSubscriber.verification_token == token
    )
    subscriber = db.exec(statement).first()

    if not subscriber:
        raise HTTPException(status_code=404, detail="Invalid verification token")

    if subscriber.is_verified:
        return {"message": "Your email is already verified!"}

    subscriber.is_verified = True
    subscriber.verification_token = None
    db.add(subscriber)
    db.commit()

    return {
        "message": "Email verified successfully! You will now receive our newsletter updates."
    }


@router.post("/unsubscribe", response_model=NewsletterResponse)
async def unsubscribe_from_newsletter(
    request: NewsletterSubscribeRequest,
    db: Session = Depends(get_session)
):
    """
    Unsubscribe from newsletter.
    """
    statement = select(NewsletterSubscriber).where(
        NewsletterSubscriber.email == request.email
    )
    subscriber = db.exec(statement).first()

    if not subscriber:
        raise HTTPException(status_code=404, detail="Email not found in our newsletter list")

    if not subscriber.is_active:
        return NewsletterResponse(
            message="You are already unsubscribed from our newsletter.",
            email=request.email
        )

    subscriber.is_active = False
    subscriber.unsubscribed_at = datetime.utcnow()
    db.add(subscriber)
    db.commit()

    return NewsletterResponse(
        message="You have been successfully unsubscribed from our newsletter.",
        email=request.email
    )


@router.get("/subscribers", response_model=List[dict])
async def get_all_subscribers(
    db: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100
):
    """
    Get all newsletter subscribers (Admin only).

    TODO: Add authentication middleware for admin access
    """
    statement = select(NewsletterSubscriber).where(
        NewsletterSubscriber.is_active == True
    ).offset(skip).limit(limit)

    subscribers = db.exec(statement).all()

    return [
        {
            "id": sub.id,
            "email": sub.email,
            "subscribed_at": sub.subscribed_at.isoformat(),
            "is_verified": sub.is_verified
        }
        for sub in subscribers
    ]


@router.post("/send")
async def send_newsletter_to_all(
    request: SendNewsletterRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_session)
):
    """
    Send newsletter to all active subscribers (Admin only).

    TODO: Add authentication middleware for admin access
    """
    statement = select(NewsletterSubscriber).where(
        NewsletterSubscriber.is_active == True,
        NewsletterSubscriber.is_verified == True
    )

    subscribers = db.exec(statement).all()

    if not subscribers:
        return {"message": "No active subscribers found"}

    # Send emails in background
    for subscriber in subscribers:
        background_tasks.add_task(
            send_newsletter_update,
            subscriber.email,
            request.subject,
            request.content
        )

    return {
        "message": f"Newsletter queued for {len(subscribers)} subscribers",
        "count": len(subscribers)
    }
