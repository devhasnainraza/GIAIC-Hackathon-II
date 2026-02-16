"""Notification Service - Consumes reminder events and sends notifications."""
import os
import logging
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import httpx
import asyncio

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Notification Service",
    description="Microservice for processing reminder events and sending notifications",
    version="1.0.0"
)

# Configuration
DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
BACKEND_APP_ID = os.getenv("BACKEND_APP_ID", "backend")
EMAIL_SERVICE_URL = os.getenv("EMAIL_SERVICE_URL", "http://localhost:8000")


class ReminderEventData(BaseModel):
    """Reminder event data payload."""
    reminder_id: int
    task_id: int
    task_title: str
    remind_at: datetime
    reminder_type: str
    notification_channels: str


class ReminderEvent(BaseModel):
    """Reminder event schema."""
    event_id: str
    event_type: str
    timestamp: datetime
    user_id: int
    reminder_id: int
    task_id: int
    data: ReminderEventData


class CloudEvent(BaseModel):
    """Dapr CloudEvent wrapper."""
    specversion: str
    type: str
    source: str
    id: str
    time: str
    datacontenttype: str
    data: dict


class EmailNotificationRequest(BaseModel):
    """Email notification request."""
    to_email: str
    subject: str
    body: str
    user_id: int


async def send_email_notification(
    user_email: str,
    subject: str,
    body: str,
    user_id: int
) -> bool:
    """
    Send email notification via backend service.

    Args:
        user_email: Recipient email address
        subject: Email subject
        body: Email body
        user_id: User ID

    Returns:
        True if email sent successfully, False otherwise
    """
    try:
        # Use Dapr service invocation to call backend email service
        url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/invoke/{BACKEND_APP_ID}/method/api/notifications/send-email"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                url,
                json={
                    "to_email": user_email,
                    "subject": subject,
                    "body": body,
                    "user_id": user_id
                }
            )

            if response.status_code in [200, 201]:
                logger.info(f"Email notification sent successfully to {user_email}")
                return True
            else:
                logger.error(f"Failed to send email: {response.status_code} - {response.text}")
                return False

    except Exception as e:
        logger.error(f"Error sending email notification: {str(e)}")
        return False


async def get_user_email(user_id: int) -> Optional[str]:
    """
    Get user email from backend service.

    Args:
        user_id: User ID

    Returns:
        User email if found, None otherwise
    """
    try:
        # Use Dapr service invocation to get user details
        url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/invoke/{BACKEND_APP_ID}/method/api/users/{user_id}"

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)

            if response.status_code == 200:
                user_data = response.json()
                return user_data.get("email")
            else:
                logger.error(f"Failed to get user email: {response.status_code}")
                return None

    except Exception as e:
        logger.error(f"Error getting user email: {str(e)}")
        return None


async def process_reminder_event(event: ReminderEvent) -> bool:
    """
    Process a reminder event and send notifications.

    Args:
        event: Reminder event

    Returns:
        True if processed successfully, False otherwise
    """
    try:
        logger.info(
            f"Processing reminder event: {event.event_id}",
            extra={
                "event_type": event.event_type,
                "reminder_id": event.reminder_id,
                "task_id": event.task_id,
                "user_id": event.user_id
            }
        )

        # Get user email
        user_email = await get_user_email(event.user_id)
        if not user_email:
            logger.error(f"Could not get email for user {event.user_id}")
            return False

        # Parse notification channels
        channels = event.data.notification_channels.split(",")

        # Prepare email content
        subject = f"Reminder: {event.data.task_title}"
        body = f"""
        <html>
        <body>
            <h2>Task Reminder</h2>
            <p>This is a reminder for your task:</p>
            <h3>{event.data.task_title}</h3>
            <p><strong>Reminder Type:</strong> {event.data.reminder_type}</p>
            <p><strong>Scheduled Time:</strong> {event.data.remind_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p>Please check your task list for more details.</p>
            <br>
            <p>Best regards,<br>Pure Tasks Team</p>
        </body>
        </html>
        """

        # Send notifications based on channels
        success = True

        if "email" in channels:
            email_sent = await send_email_notification(
                user_email=user_email,
                subject=subject,
                body=body,
                user_id=event.user_id
            )
            success = success and email_sent

        # TODO: Add support for push notifications and in-app notifications
        if "push" in channels:
            logger.info(f"Push notification not yet implemented for reminder {event.reminder_id}")

        if "in_app" in channels:
            logger.info(f"In-app notification not yet implemented for reminder {event.reminder_id}")

        if success:
            logger.info(f"Successfully processed reminder event {event.event_id}")
        else:
            logger.warning(f"Partially processed reminder event {event.event_id}")

        return success

    except Exception as e:
        logger.error(f"Error processing reminder event: {str(e)}")
        return False


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "Notification Service",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "notification-service",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/dapr/subscribe")
async def subscribe():
    """
    Dapr subscription endpoint.
    Tells Dapr which topics this service subscribes to.
    """
    subscriptions = [
        {
            "pubsubname": "kafka-pubsub",
            "topic": "reminders",
            "route": "/reminders"
        }
    ]
    logger.info(f"Dapr subscriptions configured: {subscriptions}")
    return subscriptions


@app.post("/reminders")
async def handle_reminder_event(request: Request):
    """
    Handle reminder events from Kafka via Dapr.

    This endpoint is called by Dapr when a message arrives on the reminders topic.
    """
    try:
        # Parse CloudEvent from Dapr
        body = await request.json()
        logger.info(f"Received reminder event: {body}")

        # Extract event data from CloudEvent
        if "data" in body:
            event_data = body["data"]
        else:
            event_data = body

        # Parse reminder event
        reminder_event = ReminderEvent(**event_data)

        # Process the event
        success = await process_reminder_event(reminder_event)

        if success:
            return {"status": "success"}
        else:
            return {"status": "error", "message": "Failed to process reminder event"}

    except Exception as e:
        logger.error(f"Error handling reminder event: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
