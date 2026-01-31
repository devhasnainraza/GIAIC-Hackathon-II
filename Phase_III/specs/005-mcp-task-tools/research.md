# Research: MCP Server & Task Tools (Updated for Integration)

**Feature**: 005-mcp-task-tools
**Date**: 2026-01-22
**Purpose**: Research MCP SDK integration with existing Phase II backend infrastructure

## Research Areas

### 1. MCP SDK with Synchronous Backend

**Decision**: Use Official MCP SDK with synchronous tool functions, integrate with existing synchronous SQLModel infrastructure

**Rationale**:
- MCP SDK supports both async and sync tool functions
- Existing backend uses synchronous SQLModel (not async)
- No need to refactor existing TaskService to async
- Simpler integration path - reuse existing code as-is

**Implementation Pattern**:
```python
from mcp import MCPServer, tool
from src.services.task_service import TaskService
from src.database import get_session

server = MCPServer("task-tools")

@server.tool()
def add_task(user_id: str, title: str, description: str = "") -> dict:
    """Add a new task for a user"""
    with next(get_session()) as session:
        service = TaskService(session)
        task = service.create_task(
            user_id=int(user_id),  # Convert string to int
            title=title,
            description=description
        )
        return {
            "task_id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.is_complete,
            "created_at": task.created_at.isoformat() + "Z"
        }
```

**Key Findings**:
- MCP SDK decorator works with both `async def` and regular `def` functions
- Synchronous tools are simpler and match existing backend architecture
- No performance penalty for sync tools (MCP SDK handles concurrency)
- Existing get_session() context manager works perfectly

**Alternatives Considered**:
- Async MCP tools with async SQLModel: Rejected (requires refactoring entire backend)
- Separate async database connection: Rejected (unnecessary complexity)

### 2. Reusing Existing TaskService

**Decision**: Call existing TaskService methods from MCP tools, no duplication of business logic

**Rationale**:
- TaskService already implements all required operations
- User isolation already enforced in TaskService
- Validation already implemented in TaskService
- Maintains single source of truth for business logic
- Reduces code duplication and maintenance burden

**Implementation Pattern**:
```python
@server.tool()
def complete_task(user_id: str, task_id: int) -> dict:
    """Mark a task as completed"""
    with next(get_session()) as session:
        service = TaskService(session)

        # Reuse existing update_task method
        try:
            task = service.update_task(
                task_id=task_id,
                user_id=int(user_id),
                is_complete=True
            )
            return {
                "task_id": task.id,
                "title": task.title,
                "completed": task.is_complete,
                "updated_at": task.updated_at.isoformat() + "Z"
            }
        except HTTPException as e:
            # Convert FastAPI exception to MCP error response
            return {"error": e.detail}
```

**Key Findings**:
- TaskService methods already handle user isolation
- TaskService raises HTTPException on errors (need to catch and convert)
- TaskService validates all inputs (title length, etc.)
- TaskService manages database transactions correctly

**Alternatives Considered**:
- Duplicate business logic in MCP tools: Rejected (violates DRY principle)
- Create new service layer: Rejected (unnecessary abstraction)

### 3. Simplified MCP Interface

**Decision**: MCP tools expose simplified Task interface (title, description, completed only)

**Rationale**:
- AI agents need simple, focused interface
- Advanced features (status, priority, projects, tags) add complexity
- REST API continues to support full feature set for frontend
- Reduces cognitive load for AI agent prompt engineering
- Easier to maintain and test

**Field Mapping**:
```python
# Existing Task model fields
Task.id              → task_id (MCP)
Task.user_id         → user_id (MCP parameter)
Task.title           → title (MCP)
Task.description     → description (MCP)
Task.is_complete     → completed (MCP)
Task.created_at      → created_at (MCP)
Task.updated_at      → updated_at (MCP)

# Fields NOT exposed in MCP interface
Task.status          → (REST API only)
Task.priority        → (REST API only)
Task.due_date        → (REST API only)
Task.project_id      → (REST API only)
Task.completed_at    → (REST API only)
```

**Key Findings**:
- Simplified interface sufficient for conversational AI use cases
- Frontend continues to use full REST API with all features
- Both interfaces access same database records
- No data loss - advanced fields remain in database

**Alternatives Considered**:
- Expose all Task fields in MCP: Rejected (too complex for AI agents)
- Create separate simplified Task model: Rejected (unnecessary duplication)

### 4. User ID Type Conversion

**Decision**: MCP tools accept user_id as string parameter, convert to int for TaskService

**Rationale**:
- MCP protocol typically uses string identifiers
- Existing TaskService expects int user_id (foreign key to users table)
- Simple conversion in MCP tool layer
- Maintains type safety in existing code

**Implementation Pattern**:
```python
@server.tool()
def list_tasks(user_id: str) -> list[dict]:
    """List all tasks for a user"""
    with next(get_session()) as session:
        service = TaskService(session)

        # Convert string to int
        try:
            user_id_int = int(user_id)
        except ValueError:
            return {"error": "Invalid user_id format"}

        tasks = service.list_tasks(user_id_int)
        return [
            {
                "task_id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.is_complete
            }
            for task in tasks
        ]
```

**Key Findings**:
- String to int conversion is straightforward
- Need to handle ValueError for invalid user_id
- Type hints in MCP tool signature: `user_id: str`
- Type hints in TaskService: `user_id: int`

**Alternatives Considered**:
- Change TaskService to accept string: Rejected (breaks existing REST API)
- Use int in MCP tools: Rejected (MCP convention is string identifiers)

### 5. Error Handling Strategy

**Decision**: Catch TaskService HTTPException, convert to MCP error response format

**Rationale**:
- TaskService raises HTTPException for validation and not-found errors
- MCP tools return dict with "error" key (not exceptions)
- Need translation layer between FastAPI exceptions and MCP responses
- Preserves existing error messages and validation logic

**Implementation Pattern**:
```python
from fastapi import HTTPException

@server.tool()
def update_task(user_id: str, task_id: int, title: str = None, description: str = None) -> dict:
    """Update a task"""
    with next(get_session()) as session:
        service = TaskService(session)

        try:
            task = service.update_task(
                task_id=task_id,
                user_id=int(user_id),
                title=title,
                description=description
            )
            return {
                "task_id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.is_complete,
                "updated_at": task.updated_at.isoformat() + "Z"
            }
        except HTTPException as e:
            # Convert to MCP error format
            return {
                "error": e.detail,
                "error_code": "VALIDATION_ERROR" if e.status_code == 400 else "NOT_FOUND_OR_FORBIDDEN"
            }
        except ValueError as e:
            return {"error": f"Invalid input: {str(e)}"}
```

**Key Findings**:
- HTTPException has status_code and detail attributes
- 400 status → VALIDATION_ERROR
- 404 status → NOT_FOUND_OR_FORBIDDEN
- Existing error messages are user-friendly and can be reused

**Alternatives Considered**:
- Let exceptions propagate: Rejected (MCP SDK expects return values)
- Create new validation logic: Rejected (duplicates existing code)

### 6. Database Session Management

**Decision**: Use existing get_session() context manager in MCP tools

**Rationale**:
- Existing get_session() handles session lifecycle correctly
- Automatic commit on success, rollback on exception
- Connection pooling already configured
- No need for new session management code

**Implementation Pattern**:
```python
from src.database import get_session

@server.tool()
def add_task(user_id: str, title: str, description: str = "") -> dict:
    """Add a new task"""
    # Use existing session management
    with next(get_session()) as session:
        service = TaskService(session)
        # ... tool implementation
```

**Key Findings**:
- `next(get_session())` returns a session from the generator
- Context manager ensures proper cleanup
- Existing connection pool settings work for MCP tools
- No changes needed to database.py

**Alternatives Considered**:
- Create new session management for MCP: Rejected (unnecessary duplication)
- Use global session: Rejected (violates statelessness)

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| MCP SDK Integration | Synchronous tools | Matches existing backend architecture |
| Business Logic | Reuse TaskService | Single source of truth, no duplication |
| Interface | Simplified (title, description, completed) | Reduces AI agent complexity |
| User ID | String parameter, convert to int | MCP convention + existing type safety |
| Error Handling | Catch HTTPException, convert to dict | MCP protocol requirement |
| Database | Reuse get_session() | Existing session management works perfectly |

## Integration Benefits

1. **Minimal Code Changes**: Only add new MCP module, no refactoring of existing code
2. **Reuse Validation**: TaskService validation logic works for both REST and MCP
3. **Consistent Data**: Both interfaces access same database records
4. **Maintainability**: Single business logic layer (TaskService) for all interfaces
5. **Backward Compatibility**: REST API unchanged, frontend unaffected

## Next Steps

Phase 1 will define:
1. **data-model.md**: Document existing Task model and MCP field mapping
2. **contracts/mcp-tool-schemas.md**: Simplified MCP tool schemas
3. **contracts/error-responses.md**: Error conversion from HTTPException to MCP format
4. **quickstart.md**: Integration setup with existing backend
