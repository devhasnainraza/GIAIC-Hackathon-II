# Data Model: MCP Server & Task Tools (Integration)

**Feature**: 005-mcp-task-tools
**Date**: 2026-01-22
**Purpose**: Document existing Task model and MCP field mapping for integration

## Overview

This feature **reuses the existing Task model** from Phase II backend. The MCP server provides a **simplified interface** to the Task entity, exposing only core fields (title, description, completed) while the REST API continues to support the full feature set.

## Existing Task Entity (Phase II)

### SQLModel Definition

The Task model already exists in `backend/src/models/task.py`:

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    """Task model representing a todo item owned by a user."""
    __tablename__ = "tasks"

    # Primary key
    id: Optional[int] = Field(default=None, primary_key=True)

    # User ownership (foreign key to users table)
    user_id: int = Field(foreign_key="users.id", index=True)

    # Task content
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)

    # Status and priority (REST API features)
    status: str = Field(default="todo", max_length=20)  # todo, in_progress, review, done
    priority: str = Field(default="medium", max_length=20)  # low, medium, high, urgent

    # Completion tracking
    is_complete: bool = Field(default=False)
    completed_at: Optional[datetime] = Field(default=None)

    # Optional associations (REST API features)
    due_date: Optional[datetime] = Field(default=None)
    project_id: Optional[int] = Field(default=None, foreign_key="projects.id")

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    owner: "User" = Relationship(back_populates="tasks")
    project: Optional["Project"] = Relationship(back_populates="tasks")
```

### Database Schema

The `tasks` table already exists with this schema:

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    status VARCHAR(20) NOT NULL DEFAULT 'todo',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    due_date TIMESTAMP,
    project_id INTEGER REFERENCES projects(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_tasks_user_id ON tasks(user_id);
```

## MCP Field Mapping

MCP tools expose a **simplified subset** of Task fields:

### Fields Exposed in MCP Interface

| Task Model Field | MCP Field Name | Type | Description |
|------------------|----------------|------|-------------|
| `id` | `task_id` | int | Unique task identifier |
| `user_id` | `user_id` | str (param) | Owner identifier (passed as parameter) |
| `title` | `title` | str | Task title (1-200 chars) |
| `description` | `description` | str | Task description (0-2000 chars) |
| `is_complete` | `completed` | bool | Completion status |
| `created_at` | `created_at` | str (ISO 8601) | Creation timestamp |
| `updated_at` | `updated_at` | str (ISO 8601) | Last modification timestamp |

### Fields NOT Exposed in MCP Interface

These fields remain available via REST API but are not exposed to AI agents:

| Task Model Field | Reason for Exclusion |
|------------------|---------------------|
| `status` | Simplified interface - use `completed` boolean instead |
| `priority` | Not needed for basic conversational AI task management |
| `due_date` | Advanced feature - REST API only |
| `project_id` | Advanced feature - REST API only |
| `completed_at` | Internal tracking - not needed by AI agents |

### Type Conversions

**user_id**:
- MCP parameter: `str` (MCP convention)
- Task model: `int` (database foreign key)
- Conversion: `int(user_id)` in MCP tool

**Timestamps**:
- Task model: `datetime` object
- MCP response: `str` in ISO 8601 format with 'Z' suffix
- Conversion: `task.created_at.isoformat() + "Z"`

**completed**:
- Task model: `is_complete` (bool)
- MCP field: `completed` (bool)
- Direct mapping, no conversion needed

## MCP Tool Response Format

### Success Response

```json
{
    "task_id": 123,
    "user_id": "456",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-01-22T10:30:00Z",
    "updated_at": "2026-01-22T10:30:00Z"
}
```

**Note**: `user_id` returned as string to match MCP parameter type.

### List Response

```json
[
    {
        "task_id": 123,
        "title": "Buy groceries",
        "description": "Milk, eggs, bread",
        "completed": false,
        "created_at": "2026-01-22T10:30:00Z"
    },
    {
        "task_id": 124,
        "title": "Call dentist",
        "description": "",
        "completed": true,
        "created_at": "2026-01-22T09:15:00Z"
    }
]
```

**Note**: List responses omit `user_id` and `updated_at` for brevity.

## Integration with TaskService

MCP tools call existing TaskService methods:

### TaskService Method Mapping

| MCP Tool | TaskService Method | Notes |
|----------|-------------------|-------|
| `add_task` | `create_task()` | Pass title, description; ignore status, priority |
| `list_tasks` | `list_tasks()` | Returns all tasks for user |
| `complete_task` | `update_task()` | Set `is_complete=True` |
| `update_task` | `update_task()` | Update title and/or description |
| `delete_task` | `delete_task()` | Permanent deletion |

### Example Integration

```python
from src.services.task_service import TaskService
from src.database import get_session

@server.tool()
def add_task(user_id: str, title: str, description: str = "") -> dict:
    """Add a new task for a user"""
    with next(get_session()) as session:
        service = TaskService(session)

        # Call existing service method
        task = service.create_task(
            user_id=int(user_id),  # Convert string to int
            title=title,
            description=description,
            status="todo",  # Default value
            priority="medium"  # Default value
        )

        # Return simplified MCP response
        return {
            "task_id": task.id,
            "user_id": user_id,  # Return as string
            "title": task.title,
            "description": task.description or "",
            "completed": task.is_complete,
            "created_at": task.created_at.isoformat() + "Z",
            "updated_at": task.updated_at.isoformat() + "Z"
        }
```

## Validation Rules

Validation is handled by existing TaskService:

### Title Validation
- **Required**: Cannot be empty or whitespace-only
- **Length**: 1-200 characters (enforced by TaskService)
- **Trimming**: Whitespace trimmed automatically

### Description Validation
- **Optional**: Can be empty string or None
- **Length**: 0-2000 characters (enforced by TaskService)
- **Trimming**: Whitespace trimmed automatically

### User ID Validation
- **Required**: Cannot be empty
- **Format**: Must be convertible to integer
- **Ownership**: Verified by TaskService for update/delete operations

## User Isolation

User isolation is enforced by existing TaskService:

### Query Filtering
All TaskService methods filter by `user_id`:
```python
statement = select(Task).where(Task.user_id == user_id)
```

### Ownership Verification
Update and delete operations verify ownership:
```python
task = service.get_task(task_id, user_id)
if not task:
    raise HTTPException(status_code=404, detail="Task not found")
```

MCP tools convert HTTPException to error response:
```python
try:
    task = service.update_task(task_id, user_id, ...)
except HTTPException as e:
    return {"error": e.detail}
```

## Database Migrations

**No migrations required** - Task table already exists with all necessary fields.

MCP tools use existing schema without modifications.

## Parallel Interface Support

Both REST API and MCP tools access the same Task records:

### REST API (Frontend)
- Full feature set: status, priority, due_date, project_id, tags
- Returns all Task fields
- Supports advanced filtering and sorting

### MCP Tools (AI Agents)
- Simplified interface: title, description, completed
- Returns subset of Task fields
- Basic CRUD operations only

### Data Consistency
- Both interfaces use same TaskService
- Both interfaces access same database records
- Changes via MCP tools visible in REST API (and vice versa)
- Advanced fields (status, priority) retain default values when created via MCP

## Summary

**Integration Approach**:
- ✅ Reuse existing Task model (no new entity)
- ✅ Reuse existing TaskService (no duplicate logic)
- ✅ Reuse existing database schema (no migrations)
- ✅ Simplified MCP interface (7 fields vs 12 fields)
- ✅ Parallel interfaces (REST + MCP) access same data
- ✅ User isolation enforced by existing TaskService
- ✅ Validation enforced by existing TaskService

**Benefits**:
- Minimal code changes (only add MCP module)
- No database schema changes
- No refactoring of existing code
- Consistent data across interfaces
- Single source of truth for business logic
