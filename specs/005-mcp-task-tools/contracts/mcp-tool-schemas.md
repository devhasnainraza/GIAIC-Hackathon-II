# MCP Tool Schemas (Simplified Interface)

**Feature**: 005-mcp-task-tools
**Date**: 2026-01-22
**Purpose**: Define simplified input/output schemas for MCP tools integrating with existing backend

## Overview

This document specifies the **simplified** input parameters and output formats for all five MCP tools. These tools provide a subset of Task model fields, focusing on core functionality (title, description, completed) while the REST API continues to support advanced features (status, priority, projects, tags).

---

## Tool 1: add_task

### Purpose
Create a new task for a user with basic fields (title, description).

### Input Schema

```python
{
    "user_id": str,        # Required: User identifier (converted to int internally)
    "title": str,          # Required: Task title (1-200 chars)
    "description": str     # Optional: Task description (0-2000 chars, default: "")
}
```

**Parameter Details**:
- `user_id`: String identifier, converted to int for TaskService
- `title`: Non-empty string, trimmed of whitespace
- `description`: Optional string, trimmed of whitespace, defaults to empty string

**Validation Rules** (enforced by TaskService):
- `user_id` must be convertible to integer
- `title` must not be empty after trimming (1-200 characters)
- `description` length ≤ 2000 characters

### Output Schema (Success)

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

**Field Types**:
- `task_id`: integer (database-generated)
- `user_id`: string (matches input parameter type)
- `title`: string
- `description`: string (empty string if not provided)
- `completed`: boolean (always false for new tasks)
- `created_at`: string (ISO 8601 UTC timestamp)
- `updated_at`: string (ISO 8601 UTC timestamp)

**Note**: Task created with default values for REST API fields:
- `status`: "todo"
- `priority`: "medium"
- `due_date`: null
- `project_id`: null

### Output Schema (Error)

See [error-responses.md](./error-responses.md) for standard error formats.

---

## Tool 2: list_tasks

### Purpose
Retrieve all tasks belonging to a specific user (simplified fields only).

### Input Schema

```python
{
    "user_id": str         # Required: User identifier (converted to int internally)
}
```

**Parameter Details**:
- `user_id`: String identifier, converted to int for TaskService

**Validation Rules**:
- `user_id` must be convertible to integer

### Output Schema (Success)

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

**Response Type**: Array of task objects

**Ordering**: Tasks ordered by `created_at` descending (newest first) - handled by TaskService

**Empty Result**: Returns empty array `[]` if user has no tasks

**Note**: List response omits `user_id` and `updated_at` for brevity

### Output Schema (Error)

See [error-responses.md](./error-responses.md) for standard error formats.

---

## Tool 3: complete_task

### Purpose
Mark a task as completed (set `is_complete=true` in database).

### Input Schema

```python
{
    "user_id": str,        # Required: User identifier (converted to int internally)
    "task_id": int         # Required: Task identifier
}
```

**Parameter Details**:
- `user_id`: String identifier, converted to int for TaskService
- `task_id`: Integer identifying the task

**Validation Rules**:
- `user_id` must be convertible to integer
- `task_id` must be a positive integer
- Task must exist and belong to the specified user (enforced by TaskService)

### Output Schema (Success)

```json
{
    "task_id": 123,
    "user_id": "456",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": true,
    "created_at": "2026-01-22T10:30:00Z",
    "updated_at": "2026-01-22T14:20:00Z"
}
```

**Field Types**: Same as add_task output

**Behavior Notes**:
- If task is already completed, operation succeeds (idempotent)
- `updated_at` timestamp is refreshed on every call
- Returns full task object with `completed=true`
- TaskService also sets `completed_at` timestamp internally

### Output Schema (Error)

See [error-responses.md](./error-responses.md) for standard error formats.

**Common Errors**:
- Task not found or access denied (task belongs to different user)

---

## Tool 4: update_task

### Purpose
Update task fields (title and/or description).

### Input Schema

```python
{
    "user_id": str,              # Required: User identifier (converted to int internally)
    "task_id": int,              # Required: Task identifier
    "title": str | None,         # Optional: New title (1-200 chars)
    "description": str | None    # Optional: New description (0-2000 chars)
}
```

**Parameter Details**:
- `user_id`: String identifier, converted to int for TaskService
- `task_id`: Integer identifying the task
- `title`: Optional new title (if provided, must not be empty)
- `description`: Optional new description (can be empty string to clear)

**Validation Rules** (enforced by TaskService):
- `user_id` must be convertible to integer
- `task_id` must be a positive integer
- At least one of `title` or `description` must be provided
- If `title` provided, must not be empty after trimming (1-200 characters)
- If `description` provided, length ≤ 2000 characters
- Task must exist and belong to the specified user

### Output Schema (Success)

```json
{
    "task_id": 123,
    "user_id": "456",
    "title": "Buy groceries and cook dinner",
    "description": "Milk, eggs, bread, chicken",
    "completed": false,
    "created_at": "2026-01-22T10:30:00Z",
    "updated_at": "2026-01-22T15:10:00Z"
}
```

**Field Types**: Same as add_task output

**Behavior Notes**:
- Only provided fields are updated (partial update)
- `updated_at` timestamp is always refreshed
- Returns full task object with updated values
- Completion status unchanged (use complete_task to mark as done)

### Output Schema (Error)

See [error-responses.md](./error-responses.md) for standard error formats.

**Common Errors**:
- Task not found or access denied
- No fields provided for update
- Invalid field values (empty title, too long, etc.)

---

## Tool 5: delete_task

### Purpose
Permanently delete a task from the database.

### Input Schema

```python
{
    "user_id": str,        # Required: User identifier (converted to int internally)
    "task_id": int         # Required: Task identifier
}
```

**Parameter Details**:
- `user_id`: String identifier, converted to int for TaskService
- `task_id`: Integer identifying the task

**Validation Rules**:
- `user_id` must be convertible to integer
- `task_id` must be a positive integer
- Task must exist and belong to the specified user (enforced by TaskService)

### Output Schema (Success)

```json
{
    "task_id": 123,
    "deleted": true,
    "message": "Task successfully deleted"
}
```

**Field Types**:
- `task_id`: integer (the deleted task's ID)
- `deleted`: boolean (always true on success)
- `message`: string (confirmation message)

**Behavior Notes**:
- Deletion is permanent (no soft delete)
- If task already deleted, returns error (not idempotent)
- Task cannot be recovered after deletion

### Output Schema (Error)

See [error-responses.md](./error-responses.md) for standard error formats.

**Common Errors**:
- Task not found or access denied

---

## Schema Validation

### Type Enforcement

The MCP SDK automatically validates input types based on Python type hints:

```python
@server.tool()
def add_task(user_id: str, title: str, description: str = "") -> dict:
    # SDK ensures:
    # - user_id is a string
    # - title is a string
    # - description is a string (uses default if not provided)
    # - Return value is a dict
    pass
```

### Runtime Validation

Additional validation performed by existing TaskService:
- String length constraints (title 1-200, description 0-2000)
- Non-empty string requirements (title)
- User ownership verification (update/delete operations)
- Database constraint validation

### Integration with TaskService

MCP tools catch TaskService exceptions and convert to error responses:

```python
from fastapi import HTTPException

try:
    task = service.create_task(...)
    return {...}  # Success response
except HTTPException as e:
    return {"error": e.detail}  # Error response
```

---

## Simplified vs Full Interface

### Field Comparison

| Field | MCP Tools | REST API |
|-------|-----------|----------|
| task_id | ✅ | ✅ |
| user_id | ✅ (string) | ✅ (int) |
| title | ✅ | ✅ |
| description | ✅ | ✅ |
| completed | ✅ | ✅ (is_complete) |
| created_at | ✅ | ✅ |
| updated_at | ✅ | ✅ |
| status | ❌ | ✅ |
| priority | ❌ | ✅ |
| due_date | ❌ | ✅ |
| project_id | ❌ | ✅ |
| completed_at | ❌ | ✅ |
| tags | ❌ | ✅ |

### Use Case Separation

**MCP Tools (AI Agents)**:
- Conversational task management
- Simple CRUD operations
- Focus on core functionality
- Natural language interface

**REST API (Frontend)**:
- Full-featured task management
- Advanced filtering and sorting
- Project and tag organization
- Status and priority tracking

---

## Common Patterns

### Timestamp Format

All timestamps use ISO 8601 format with UTC timezone:
```
2026-01-22T10:30:00Z
```

Generated in Python:
```python
task.created_at.isoformat() + "Z"
```

### User Isolation

All tools require `user_id` as first parameter:
```python
def tool_name(user_id: str, ...other_params) -> dict:
    # Convert to int and pass to TaskService
    user_id_int = int(user_id)
    service.method(user_id=user_id_int, ...)
```

### Error Responses

All tools return dict with `"error"` key on failure:
```python
try:
    task = service.method(...)
    return {...}  # Success
except HTTPException as e:
    return {"error": e.detail}  # Error
```

See [error-responses.md](./error-responses.md) for complete error format specification.

---

## Summary Table

| Tool | Required Params | Optional Params | Return Type | Idempotent |
|------|----------------|-----------------|-------------|------------|
| add_task | user_id, title | description | dict (task) | No |
| list_tasks | user_id | - | list[dict] | Yes |
| complete_task | user_id, task_id | - | dict (task) | Yes |
| update_task | user_id, task_id | title, description | dict (task) | No |
| delete_task | user_id, task_id | - | dict (confirmation) | No |

**Idempotency Notes**:
- `list_tasks`: Always returns current state (idempotent)
- `complete_task`: Can be called multiple times safely (idempotent)
- `add_task`, `update_task`, `delete_task`: Create side effects (not idempotent)
