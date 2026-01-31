"""Newsletter subscriber model for email subscriptions."""
from datetime import datetime
from sqlmodel import Field, SQLModel
from typing import Optional


class NewsletterSubscriber(SQLModel, table=True):
    """Newsletter subscriber model."""

    __tablename__ = "newsletter_subscribers"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    is_active: bool = Field(default=True)
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)
    unsubscribed_at: Optional[datetime] = Field(default=None)
    verification_token: Optional[str] = Field(default=None, max_length=255)
    is_verified: bool = Field(default=False)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "is_active": True,
                "is_verified": True
            }
        }
