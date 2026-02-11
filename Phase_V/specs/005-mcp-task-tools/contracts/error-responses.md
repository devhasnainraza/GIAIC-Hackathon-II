# Error Response Formats (Integration)

**Feature**: 005-mcp-task-tools
**Date**: 2026-01-22
**Purpose**: Define error response formats for MCP tools integrating with existing TaskService

## Overview

MCP tools convert exceptions from existing TaskService into structured error responses. This document specifies how FastAPI HTTPException errors are translated to MCP error format.

## Standard Error Format

### Basic Error Response

```json
{
    "error": "Human-readable error message"
}
```

**Required Fields**:
- `error` (string): Clear, actionable error message from TaskService

### Extended Error Response

```json
{
    "error": "Human-readable error message",
    "error_code": "VALIDATION_ERROR"
}
```

**Optional Fields**:
- `error_code` (string): Machine-readable error code derived from HTTP status

## Error Translation from TaskService

### HTTPException to MCP Error Mapping

TaskService raises `HTTPException` with status codes:

| HTTP Status | Error Code | MCP Error Code |
|-------------|------------|----------------|
| 400 Bad Request | Validation failure | VALIDATION_ERROR |
| 404 Not Found | Task not found | NOT_FOUND_OR_FORBIDDEN |
| 500 Internal Server Error | Database error | DATABASE_ERROR |

### Translation Pattern

```python
from fastapi import HTTPException

try:
    task = service.create_task(...)
    return {...}  # Success response
except HTTPException as e:
    # Translate HTTP status to error code
    if e.status_code == 400:
        error_code = "VALIDATION_ERROR"
    elif e.status_code == 404:
        error_code = "NOT_FOUND_OR_FORBIDDEN"
    else:
        error_code = "DATABASE_ERROR"

    return {
        "error": e.detail,  # Reuse TaskService error message
        "error_code": error_code
    }
except ValueError as e:
    # Handle user_id conversion errors
    return {
        "error": f"Invalid user_id format: {str(e)}",
        "error_code": "VALIDATION_ERROR"
    }
```

## Error Categories

### 1. Validation Errors (HTTP 400)

**Source**: TaskService validation logic

**Examples from TaskService**:

```json
{
    "error": "Task title cannot be empty",
    "error_code": "VALIDATION_ERROR"
}
```

```json
{
    "error": "Task title must be 200 characters or less",
    "error_code": "VALIDATION_ERROR"
}
```

```json
{
    "error": "Task description must be 2000 characters or less",
    "error_code": "VALIDATION_ERROR"
}
```

**MCP-Specific Validation**:

```json
{
    "error": "Invalid user_id format: invalid literal for int() with base 10: 'abc'",
    "error_code": "VALIDATION_ERROR"
}
```

### 2. Authorization Errors (HTTP 404)

**Source**: TaskService ownership verification

**Response Format**:
```json
{
    "error": "Task not found",
    "error_code": "NOT_FOUND_OR_FORBIDDEN"
}
```

**Security Note**:
- TaskService returns generic "Task not found" message
- Does not reveal whether task exists for another user
- Same response for "task doesn't exist" and "task belongs to different user"
- Prevents information leakage

**Affected Tools**:
- `complete_task`
- `update_task`
- `delete_task`

### 3. Database Errors

**Source**: Database connection or query failures

**Examples**:

```json
{
    "error": "Database error: connection timeout",
    "error_code": "DATABASE_ERROR"
}
```

```json
{
    "error": "Database error: unable to connect to database",
    "error_code": "DATABASE_ERROR"
}
```

**Note**: These errors are rare with existing connection pooling and error handling.

## Error Responses by Tool

### add_task

| Error Scenario | Source | Error Message |
|----------------|--------|---------------|
| Empty title | TaskService | "Task title cannot be empty" |
| Title too long | TaskService | "Task title must be 200 characters or less" |
| Description too long | TaskService | "Task description must be 2000 characters or less" |
| Invalid user_id | MCP tool | "Invalid user_id format: {details}" |
| Database error | Database | "Database error: {details}" |

### list_tasks

| Error Scenario | Source | Error Message |
|----------------|--------|---------------|
| Invalid user_id | MCP tool | "Invalid user_id format: {details}" |
| Database error | Database | "Database error: {details}" |

**Note**: Returns empty array `[]` if user has no tasks (not an error).

### complete_task

| Error Scenario | Source | Error Message |
|----------------|--------|---------------|
| Invalid user_id | MCP tool | "Invalid user_id format: {details}" |
| Task not found/forbidden | TaskService | "Task not found" |
| Database error | Database | "Database error: {details}" |

**Note**: If task already completed, operation succeeds (idempotent, not an error).

### update_task

| Error Scenario | Source | Error Message |
|----------------|--------|---------------|
| Invalid user_id | MCP tool | "Invalid user_id format: {details}" |
| Empty title | TaskService | "Task title cannot be empty" |
| Title too long | TaskService | "Task title must be 200 characters or less" |
| Description too long | TaskService | "Task description must be 2000 characters or less" |
| Task not found/forbidden | TaskService | "Task not found" |
| Database error | Database | "Database error: {details}" |

### delete_task

| Error Scenario | Source | Error Message |
|----------------|--------|---------------|
| Invalid user_id | MCP tool | "Invalid user_id format: {details}" |
| Task not found/forbidden | TaskService | "Task not found" |
| Database error | Database | "Database error: {details}" |

**Note**: If task already deleted, returns error (not idempotent).

## Error Handling Best Practices

### 1. Reuse TaskService Error Messages

**Good**:
```python
try:
    task = service.create_task(...)
except HTTPException as e:
    return {"error": e.detail}  # Reuse existing message
```

**Bad**:
```python
try:
    task = service.create_task(...)
except HTTPException as e:
    return {"error": "Failed to create task"}  # Generic, loses context
```

### 2. Handle Type Conversion Errors

```python
def add_task(user_id: str, title: str, description: str = "") -> dict:
    try:
        user_id_int = int(user_id)
    except ValueError as e:
        return {
            "error": f"Invalid user_id format: {str(e)}",
            "error_code": "VALIDATION_ERROR"
        }

    # Continue with TaskService call...
```

### 3. Preserve Error Context

```python
try:
    task = service.update_task(...)
except HTTPException as e:
    # Preserve HTTP status for error code mapping
    error_code = "VALIDATION_ERROR" if e.status_code == 400 else "NOT_FOUND_OR_FORBIDDEN"
    return {
        "error": e.detail,  # Preserve original message
        "error_code": error_code
    }
```

## Example Error Handling Code

### Complete MCP Tool with Error Handling

```python
from fastapi import HTTPException
from src.services.task_service import TaskService
from src.database import get_session

@server.tool()
def update_task(user_id: str, task_id: int, title: str = None, description: str = None) -> dict:
    """Update a task"""

    # Validate user_id format
    try:
        user_id_int = int(user_id)
    except ValueError as e:
        return {
            "error": f"Invalid user_id format: {str(e)}",
            "error_code": "VALIDATION_ERROR"
        }

    # Call TaskService with error handling
    try:
        with next(get_session()) as session:
            service = TaskService(session)

            task = service.update_task(
                task_id=task_id,
                user_id=user_id_int,
                title=title,
                description=description
            )

            # Success response
            return {
                "task_id": task.id,
                "user_id": user_id,
                "title": task.title,
                "description": task.description or "",
                "completed": task.is_complete,
                "created_at": task.created_at.isoformat() + "Z",
                "updated_at": task.updated_at.isoformat() + "Z"
            }

    except HTTPException as e:
        # Convert TaskService exception to MCP error
        error_code = "VALIDATION_ERROR" if e.status_code == 400 else "NOT_FOUND_OR_FORBIDDEN"
        return {
            "error": e.detail,
            "error_code": error_code
        }

    except Exception as e:
        # Catch unexpected errors
        return {
            "error": f"Unexpected error: {str(e)}",
            "error_code": "DATABASE_ERROR"
        }
```

## Integration Benefits

1. **Reuse Existing Validation**: TaskService error messages are already user-friendly
2. **Consistent Error Handling**: Same validation logic for REST API and MCP tools
3. **Security Preserved**: Generic "Task not found" message prevents information leakage
4. **Minimal Code**: Simple try-except translation layer

## Summary

**Error Translation Strategy**:
- Catch `HTTPException` from TaskService
- Map HTTP status code to MCP error code
- Reuse `e.detail` error message
- Add `error_code` for machine-readable errors

**Error Categories**:
1. **VALIDATION_ERROR**: HTTP 400 from TaskService or ValueError from type conversion
2. **NOT_FOUND_OR_FORBIDDEN**: HTTP 404 from TaskService ownership checks
3. **DATABASE_ERROR**: Database connection or query failures

**Best Practices**:
- Reuse TaskService error messages (already user-friendly)
- Handle type conversion errors (user_id string to int)
- Preserve error context (HTTP status → error code)
- Catch unexpected exceptions (return DATABASE_ERROR)
