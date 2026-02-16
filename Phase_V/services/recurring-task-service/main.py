"""Recurring Task Service - Creates task instances from recurring tasks."""
import os
import logging
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timedelta
from enum import Enum
import httpx
import asyncio
from croniter import croniter

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Recurring Task Service",
    description="Microservice for creating task instances from recurring tasks",
    version="1.0.0"
)

# Configuration
DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
BACKEND_APP_ID = os.getenv("BACKEND_APP_ID", "backend")


class RecurringTaskEventData(BaseModel):
    """Recurring task event data payload."""
    recurring_task_id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    recurrence_pattern: str
    recurrence_interval: int
    next_occurrence: datetime
    is_active: bool


class RecurringTaskEvent(BaseModel):
    """Recurring task event schema."""
    event_id: str
    event_type: str
    timestamp: datetime
    user_id: int
    recurring_task_id: int
    data: RecurringTaskEventData


class TaskCreateRequest(BaseModel):
    """Task creation request."""
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    due_date: Optional[datetime] = None
    project_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None


async def create_task_instance(
    user_id: int,
    recurring_task_id: int,
    title: str,
    description: Optional[str],
    status: str,
    priority: str,
    due_date: Optional[datetime],
    project_id: Optional[int],
    auth_token: Optional[str] = None
) -> Optional[dict]:
    """
    Create a task instance via backend service.

    Args:
        user_id: User ID
        recurring_task_id: Recurring task ID
        title: Task title
        description: Task description
        status: Task status
        priority: Task priority
        due_date: Task due date
        project_id: Project ID
        auth_token: Optional JWT token for authentication

    Returns:
        Created task data if successful, None otherwise
    """
    try:
        # Use Dapr service invocation to call backend task creation API
        url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/invoke/{BACKEND_APP_ID}/method/api/tasks"

        task_data = {
            "title": title,
            "description": description,
            "status": status,
            "priority": priority,
            "due_date": due_date.isoformat() if due_date else None,
            "project_id": project_id,
            "tag_ids": []
        }

        headers = {"Content-Type": "application/json"}
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=task_data, headers=headers)

            if response.status_code in [200, 201]:
                task = response.json()
                logger.info(
                    f"Created task instance from recurring task {recurring_task_id}",
                    extra={"task_id": task.get("id"), "user_id": user_id}
                )
                return task
            else:
                logger.error(
                    f"Failed to create task instance: {response.status_code} - {response.text}",
                    extra={"recurring_task_id": recurring_task_id}
                )
                return None

    except Exception as e:
        logger.error(f"Error creating task instance: {str(e)}")
        return None


async def update_recurring_task_next_occurrence(
    recurring_task_id: int,
    next_occurrence: datetime,
    last_created_task_id: Optional[int] = None
) -> bool:
    """
    Update recurring task's next occurrence via backend service.

    Args:
        recurring_task_id: Recurring task ID
        next_occurrence: Next occurrence datetime
        last_created_task_id: ID of the last created task

    Returns:
        True if updated successfully, False otherwise
    """
    try:
        # Use Dapr service invocation to update recurring task
        url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/invoke/{BACKEND_APP_ID}/method/api/recurring-tasks/{recurring_task_id}/next-occurrence"

        update_data = {
            "next_occurrence": next_occurrence.isoformat(),
            "last_created_task_id": last_created_task_id
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.patch(url, json=update_data)

            if response.status_code in [200, 204]:
                logger.info(f"Updated next occurrence for recurring task {recurring_task_id}")
                return True
            else:
                logger.error(
                    f"Failed to update next occurrence: {response.status_code} - {response.text}"
                )
                return False

    except Exception as e:
        logger.error(f"Error updating next occurrence: {str(e)}")
        return False


def calculate_next_occurrence(
    pattern: str,
    interval: int,
    current_date: datetime
) -> datetime:
    """
    Calculate the next occurrence based on recurrence pattern.

    Args:
        pattern: Recurrence pattern (daily, weekly, monthly, yearly)
        interval: Recurrence interval
        current_date: Current occurrence date

    Returns:
        Next occurrence datetime
    """
    if pattern == "daily":
        return current_date + timedelta(days=interval)
    elif pattern == "weekly":
        return current_date + timedelta(weeks=interval)
    elif pattern == "monthly":
        # Add months (approximate)
        month = current_date.month + interval
        year = current_date.year + (month - 1) // 12
        month = ((month - 1) % 12) + 1
        try:
            return current_date.replace(year=year, month=month)
        except ValueError:
            # Handle day overflow (e.g., Jan 31 -> Feb 31)
            next_month = month + 1 if month < 12 else 1
            next_year = year if month < 12 else year + 1
            return datetime(next_year, next_month, 1) - timedelta(days=1)
    elif pattern == "yearly":
        return current_date.replace(year=current_date.year + interval)
    else:
        # Default to daily
        return current_date + timedelta(days=1)


async def process_recurring_task_event(event: RecurringTaskEvent) -> bool:
    """
    Process a recurring task event and create task instances if needed.

    Args:
        event: Recurring task event

    Returns:
        True if processed successfully, False otherwise
    """
    try:
        logger.info(
            f"Processing recurring task event: {event.event_id}",
            extra={
                "event_type": event.event_type,
                "recurring_task_id": event.recurring_task_id,
                "user_id": event.user_id
            }
        )

        # Only process active recurring tasks
        if not event.data.is_active:
            logger.info(f"Recurring task {event.recurring_task_id} is not active, skipping")
            return True

        # Check if it's time to create a new task instance
        now = datetime.utcnow()
        next_occurrence = event.data.next_occurrence

        # If next occurrence is in the past or now, create task instance
        if next_occurrence <= now:
            logger.info(
                f"Creating task instance for recurring task {event.recurring_task_id}",
                extra={"next_occurrence": next_occurrence.isoformat()}
            )

            # Create task instance
            task = await create_task_instance(
                user_id=event.user_id,
                recurring_task_id=event.recurring_task_id,
                title=event.data.title,
                description=event.data.description,
                status=event.data.status,
                priority=event.data.priority,
                due_date=next_occurrence,
                project_id=None
            )

            if task:
                # Calculate next occurrence
                new_next_occurrence = calculate_next_occurrence(
                    pattern=event.data.recurrence_pattern,
                    interval=event.data.recurrence_interval,
                    current_date=next_occurrence
                )

                # Update recurring task with new next occurrence
                await update_recurring_task_next_occurrence(
                    recurring_task_id=event.recurring_task_id,
                    next_occurrence=new_next_occurrence,
                    last_created_task_id=task.get("id")
                )

                logger.info(
                    f"Successfully processed recurring task {event.recurring_task_id}",
                    extra={"new_next_occurrence": new_next_occurrence.isoformat()}
                )
                return True
            else:
                logger.error(f"Failed to create task instance for recurring task {event.recurring_task_id}")
                return False
        else:
            logger.info(
                f"Next occurrence not yet due for recurring task {event.recurring_task_id}",
                extra={"next_occurrence": next_occurrence.isoformat()}
            )
            return True

    except Exception as e:
        logger.error(f"Error processing recurring task event: {str(e)}")
        return False


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "Recurring Task Service",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "recurring-task-service",
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
            "topic": "task-events",
            "route": "/task-events"
        }
    ]
    logger.info(f"Dapr subscriptions configured: {subscriptions}")
    return subscriptions


@app.post("/task-events")
async def handle_task_event(request: Request):
    """
    Handle task events from Kafka via Dapr.

    This endpoint is called by Dapr when a message arrives on the task-events topic.
    """
    try:
        # Parse CloudEvent from Dapr
        body = await request.json()
        logger.info(f"Received task event: {body}")

        # Extract event data from CloudEvent
        if "data" in body:
            event_data = body["data"]
        else:
            event_data = body

        # Only process recurring task events
        event_type = event_data.get("event_type", "")
        if not event_type.startswith("recurring_task."):
            logger.info(f"Ignoring non-recurring task event: {event_type}")
            return {"status": "ignored"}

        # Parse recurring task event
        recurring_task_event = RecurringTaskEvent(**event_data)

        # Process the event
        success = await process_recurring_task_event(recurring_task_event)

        if success:
            return {"status": "success"}
        else:
            return {"status": "error", "message": "Failed to process recurring task event"}

    except Exception as e:
        logger.error(f"Error handling task event: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
