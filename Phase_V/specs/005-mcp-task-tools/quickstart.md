# Quickstart Guide: MCP Server Integration

**Feature**: 005-mcp-task-tools
**Date**: 2026-01-22
**Purpose**: Setup instructions for integrating MCP server with existing Phase II backend

## Prerequisites

- Existing Phase II backend running (FastAPI + SQLModel + Neon PostgreSQL)
- Python 3.11 or higher
- MCP SDK (to be installed)
- Basic understanding of existing backend structure

## Installation

### 1. Navigate to Backend Directory

```bash
cd /path/to/Phase_III/backend
```

### 2. Install MCP SDK

Add to `requirements.txt`:
```
mcp-sdk>=1.0.0
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Verify Existing Infrastructure

Ensure these components are working:
- ✅ Database connection (`src/database.py`)
- ✅ Task model (`src/models/task.py`)
- ✅ TaskService (`src/services/task_service.py`)
- ✅ Environment variables (`.env` with `DATABASE_URL`)

## Project Structure

### New Files to Create

```text
backend/
└── src/
    └── mcp/                    # NEW MODULE
        ├── __init__.py
        ├── server.py           # MCP server initialization
        ├── schemas.py          # Response schemas
        └── tools/              # Tool implementations
            ├── __init__.py
            ├── add_task.py
            ├── list_tasks.py
            ├── complete_task.py
            ├── update_task.py
            └── delete_task.py
```

### Existing Files (No Changes Required)

```text
backend/
└── src/
    ├── models/task.py          # REUSE (no changes)
    ├── services/task_service.py # REUSE (no changes)
    ├── database.py             # REUSE (no changes)
    └── config.py               # EXTEND (add MCP settings)
```

## Configuration

### Update `src/config.py`

Add MCP-specific settings:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Existing settings
    DATABASE_URL: str
    ENVIRONMENT: str = "development"
    # ... other existing settings

    # NEW: MCP server settings
    MCP_SERVER_NAME: str = "task-tools"
    MCP_SERVER_PORT: int = 8080

    class Config:
        env_file = ".env"

settings = Settings()
```

### Update `.env`

Add MCP configuration (optional, uses defaults):

```bash
# Existing configuration
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname

# NEW: MCP server configuration (optional)
MCP_SERVER_NAME=task-tools
MCP_SERVER_PORT=8080
```

## Implementation

### Create MCP Server Module

**File**: `src/mcp/__init__.py`
```python
"""MCP server module for AI agent task management."""
```

**File**: `src/mcp/server.py`
```python
"""MCP server initialization and tool registration."""
from mcp import MCPServer
from src.config import settings

# Initialize MCP server
server = MCPServer(settings.MCP_SERVER_NAME)

# Import tools to register them
from src.mcp.tools import (
    add_task,
    list_tasks,
    complete_task,
    update_task,
    delete_task
)

def start_server():
    """Start the MCP server."""
    print(f"Starting MCP server '{settings.MCP_SERVER_NAME}'...")
    print(f"Registered tools: add_task, list_tasks, complete_task, update_task, delete_task")
    server.run(port=settings.MCP_SERVER_PORT)

if __name__ == "__main__":
    start_server()
```

### Create Tool Implementations

**File**: `src/mcp/tools/add_task.py`
```python
"""Add task MCP tool."""
from src.mcp.server import server
from src.services.task_service import TaskService
from src.database import get_session
from fastapi import HTTPException

@server.tool()
def add_task(user_id: str, title: str, description: str = "") -> dict:
    """
    Add a new task for a user.

    Args:
        user_id: User identifier (string)
        title: Task title (1-200 characters)
        description: Optional task description (0-2000 characters)

    Returns:
        Task object with id, title, description, completed, timestamps
    """
    # Validate user_id format
    try:
        user_id_int = int(user_id)
    except ValueError as e:
        return {
            "error": f"Invalid user_id format: {str(e)}",
            "error_code": "VALIDATION_ERROR"
        }

    # Call existing TaskService
    try:
        with next(get_session()) as session:
            service = TaskService(session)

            task = service.create_task(
                user_id=user_id_int,
                title=title,
                description=description,
                status="todo",  # Default for MCP-created tasks
                priority="medium"  # Default for MCP-created tasks
            )

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
        return {
            "error": e.detail,
            "error_code": "VALIDATION_ERROR" if e.status_code == 400 else "DATABASE_ERROR"
        }
```

**File**: `src/mcp/tools/__init__.py`
```python
"""MCP tool implementations."""
from src.mcp.tools.add_task import add_task
from src.mcp.tools.list_tasks import list_tasks
from src.mcp.tools.complete_task import complete_task
from src.mcp.tools.update_task import update_task
from src.mcp.tools.delete_task import delete_task

__all__ = [
    "add_task",
    "list_tasks",
    "complete_task",
    "update_task",
    "delete_task"
]
```

## Running the MCP Server

### Start MCP Server

```bash
cd backend
python -m src.mcp.server
```

Expected output:
```
Starting MCP server 'task-tools'...
Registered tools: add_task, list_tasks, complete_task, update_task, delete_task
MCP Server listening on port 8080
```

### Verify Server is Running

```bash
curl http://localhost:8080/health
```

## Tool Usage Examples

### Example 1: Add a Task

**Tool Call**:
```json
{
    "tool": "add_task",
    "parameters": {
        "user_id": "1",
        "title": "Buy groceries",
        "description": "Milk, eggs, bread"
    }
}
```

**Response**:
```json
{
    "task_id": 1,
    "user_id": "1",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-01-22T10:30:00Z",
    "updated_at": "2026-01-22T10:30:00Z"
}
```

**Verify in REST API**:
```bash
curl http://localhost:8000/api/tasks /
  -H "Authorization: Bearer <token>"
```

Task will appear with:
- `title`: "Buy groceries"
- `description`: "Milk, eggs, bread"
- `status`: "todo" (default)
- `priority`: "medium" (default)
- `is_complete`: false

### Example 2: List Tasks

**Tool Call**:
```json
{
    "tool": "list_tasks",
    "parameters": {
        "user_id": "1"
    }
}
```

**Response**:
```json
[
    {
        "task_id": 1,
        "title": "Buy groceries",
        "description": "Milk, eggs, bread",
        "completed": false,
        "created_at": "2026-01-22T10:30:00Z"
    }
]
```

## Testing

### Run MCP Tool Tests

```bash
cd backend
pytest tests/test_mcp/ -v
```

### Test User Isolation

```bash
pytest tests/test_mcp/test_isolation.py -v
```

Expected: All tests pass, demonstrating proper user isolation.

## Integration Verification

### Checklist

After setup, verify the following:

- [ ] MCP server starts without errors
- [ ] All 5 tools registered (check server logs)
- [ ] Can add a task via MCP tool
- [ ] Task appears in REST API response
- [ ] Can complete a task via MCP tool
- [ ] Completion status updates in REST API
- [ ] User isolation enforced (cannot access other users' tasks)
- [ ] Existing REST API functionality unchanged
- [ ] Frontend continues to work with REST API

## Parallel Interface Testing

### Create Task via MCP

```bash
# Via MCP tool
{
    "tool": "add_task",
    "parameters": {
        "user_id": "1",
        "title": "Test task"
    }
}
```

### View Task via REST API

```bash
curl http://localhost:8000/api/tasks /
  -H "Authorization: Bearer <token>"
```

Response includes:
```json
{
    "id": 1,
    "title": "Test task",
    "description": "",
    "status": "todo",
    "priority": "medium",
    "is_complete": false,
    ...
}
```

### Update Task via REST API

```bash
curl -X PATCH http://localhost:8000/api/tasks/1 /
  -H "Authorization: Bearer <token>" /
  -H "Content-Type: application/json" /
  -d '{"status": "in_progress", "priority": "high"}'
```

### View Updated Task via MCP

```bash
{
    "tool": "list_tasks",
    "parameters": {"user_id": "1"}
}
```

Response shows:
```json
{
    "task_id": 1,
    "title": "Test task",
    "completed": false
}
```

**Note**: MCP tools don't show `status` or `priority`, but they're preserved in the database.

## Common Issues

### Issue: MCP SDK Not Found

**Error**: `ModuleNotFoundError: No module named 'mcp'`

**Solution**:
```bash
pip install mcp-sdk
```

### Issue: Database Connection Failed

**Error**: `Database error: unable to connect to database`

**Solution**:
1. Verify `DATABASE_URL` in `.env`
2. Check Neon database status
3. Ensure existing backend can connect

### Issue: TaskService Import Error

**Error**: `ImportError: cannot import name 'TaskService'`

**Solution**:
- Ensure you're in the `backend/` directory
- Verify `src/services/task_service.py` exists
- Check Python path includes `src/`

## Production Deployment

### Docker Integration

Update `backend/Dockerfile` to include MCP server:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

# Expose both FastAPI and MCP ports
EXPOSE 8000 8080

# Start both servers (use supervisor or separate containers)
CMD ["python", "-m", "src.mcp.server"]
```

### Separate Container (Recommended)

```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}

  mcp-server:
    build: ./backend
    command: python -m src.mcp.server
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - MCP_SERVER_PORT=8080
```

## Next Steps

1. **Implement AI Agent**: Connect OpenAI Agents SDK to MCP server
2. **Add Frontend Integration**: Build ChatKit UI for conversational task management
3. **Add Monitoring**: Set up logging and metrics for MCP tools
4. **Performance Testing**: Test concurrent MCP tool calls
5. **Documentation**: Update API documentation to include MCP tools

## Support

- **Existing Backend**: See `backend/README.md`
- **MCP Tools**: See [contracts/mcp-tool-schemas.md](./contracts/mcp-tool-schemas.md)
- **Data Model**: See [data-model.md](./data-model.md)
- **Constitution**: Review [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

## Summary

This quickstart guide covers:
- ✅ Installation and setup (add MCP SDK to existing backend)
- ✅ Configuration (extend existing config)
- ✅ Implementation (create MCP module)
- ✅ Tool usage examples
- ✅ Testing procedures
- ✅ Integration verification
- ✅ Parallel interface testing (MCP + REST API)
- ✅ Common issues and solutions
- ✅ Production deployment

The MCP server is now integrated with the existing Phase II backend and ready for AI agent integration.
