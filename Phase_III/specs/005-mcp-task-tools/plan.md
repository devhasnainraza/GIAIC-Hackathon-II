# Implementation Plan: MCP Server & Task Tools (Updated)

**Branch**: `005-mcp-task-tools` | **Date**: 2026-01-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-mcp-task-tools/spec.md`

**Note**: This plan integrates MCP server with existing Phase II backend infrastructure.

## Summary

Build a stateless MCP server that exposes five simplified task management tools (add_task, list_tasks, complete_task, update_task, delete_task) using the Official MCP SDK. The MCP server integrates with the existing Phase II backend by reusing the Task model, TaskService, and database infrastructure. MCP tools provide a simplified interface (title, description, completed) while the REST API continues to support the full feature set (status, priority, projects, tags). All tools are stateless, persist data via existing TaskService to Neon PostgreSQL, and enforce user isolation.

## Technical Context

**Language/Version**: Python 3.11+ (existing backend)
**Primary Dependencies**:
- **New**: MCP SDK (Official Python package)
- **Existing**: FastAPI, SQLModel, psycopg2-binary, Neon PostgreSQL
**Storage**: Neon Serverless PostgreSQL (existing connection via DATABASE_URL)
**Testing**: pytest with existing test infrastructure
**Target Platform**: Linux server (existing Docker setup)
**Project Type**: Backend service extension (MCP module added to existing FastAPI backend)
**Performance Goals**: <500ms response time per tool call, support concurrent operations
**Constraints**:
- Integrate with existing synchronous SQLModel infrastructure
- Reuse existing Task model and TaskService
- Maintain backward compatibility with REST API
- Stateless architecture (no in-memory state)
- User isolation enforced on all operations
**Scale/Scope**: Multi-user system, 5 MCP tools, reuse existing Task entity, designed for AI agent integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle VII: Stateless Architecture (NON-NEGOTIABLE)
- ✅ **PASS**: All MCP tools are stateless functions
- ✅ **PASS**: No in-memory caches or global variables
- ✅ **PASS**: All task data persisted via existing TaskService to database
- ✅ **PASS**: Server restarts do not affect functionality
- ✅ **PASS**: Each tool call is independently processable

**Validation**: MCP tools will be implemented as functions that call existing TaskService methods. TaskService already handles database persistence correctly.

### Principle VIII: MCP Tool Primacy (NON-NEGOTIABLE)
- ✅ **PASS**: All task operations exposed as MCP tools
- ✅ **PASS**: MCP tools use TaskService (no direct database access)
- ✅ **PASS**: Tools are single source of truth for AI agent task operations
- ✅ **PASS**: Each tool accepts user_id for isolation
- ✅ **PASS**: Tools return structured, schema-compliant data

**Validation**: Five MCP tools will handle CRUD operations for AI agents. REST API continues to serve frontend. Both interfaces use the same TaskService.

### Principle III: User Data Isolation (NON-NEGOTIABLE)
- ✅ **PASS**: All tools require user_id parameter
- ✅ **PASS**: TaskService already filters all queries by user_id
- ✅ **PASS**: Tools validate user ownership via TaskService
- ✅ **PASS**: Cross-user access attempts return authorization errors
- ✅ **PASS**: Database foreign keys enforce user ownership (existing)

**Validation**: Existing TaskService already implements user isolation correctly. MCP tools will pass user_id to TaskService methods.

### Principle V: Technology Stack Immutability
- ✅ **PASS**: Using Official MCP SDK (required)
- ✅ **PASS**: Using SQLModel ORM (existing)
- ✅ **PASS**: Using Neon Serverless PostgreSQL (existing)
- ✅ **PASS**: Using Python FastAPI ecosystem (existing)

**Validation**: No technology substitutions. MCP SDK added to existing stack.

### Principle I: Correctness & Specification Adherence
- ✅ **PASS**: All 15 functional requirements mapped to implementation phases
- ✅ **PASS**: All 4 user stories have clear acceptance criteria
- ✅ **PASS**: Tool schemas will match declared input/output formats exactly
- ✅ **PASS**: Error handling follows structured response format

**Validation**: Implementation will be verified against spec.md acceptance scenarios.

### Principle IV: Agentic Development Workflow
- ✅ **PASS**: Following Spec → Plan → Tasks → Implementation workflow
- ✅ **PASS**: All code will be agent-generated (no manual edits)
- ✅ **PASS**: PHRs created for all development sessions
- ✅ **PASS**: Implementation traceable to prompts

**Validation**: This plan follows `/sp.plan` workflow. Tasks will be generated via `/sp.tasks`.

**GATE STATUS**: ✅ ALL CHECKS PASSED - Proceed to Phase 0 Research

## Project Structure

### Documentation (this feature)

```text
specs/005-mcp-task-tools/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command) - UPDATED
├── data-model.md        # Phase 1 output (/sp.plan command) - UPDATED
├── quickstart.md        # Phase 1 output (/sp.plan command) - UPDATED
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── mcp-tool-schemas.md - UPDATED
│   └── error-responses.md - UPDATED
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

**Existing Backend Structure** (Phase II):
```text
backend/
├── src/
│   ├── api/                # REST API endpoints (existing)
│   │   ├── tasks.py        # Task REST endpoints
│   │   ├── auth.py         # Authentication endpoints
│   │   └── ...
│   ├── models/             # SQLModel entities (existing)
│   │   ├── task.py         # Task model (REUSE for MCP)
│   │   ├── user.py
│   │   └── ...
│   ├── services/           # Business logic (existing)
│   │   ├── task_service.py # Task operations (REUSE for MCP)
│   │   └── ...
│   ├── database.py         # Database connection (REUSE)
│   ├── config.py           # Configuration (EXTEND)
│   └── main.py             # FastAPI app (existing)
└── tests/                  # Existing tests
```

**New MCP Server Structure** (Phase III - this feature):
```text
backend/
├── src/
│   ├── mcp/                # NEW: MCP server module
│   │   ├── __init__.py
│   │   ├── server.py       # MCP server initialization
│   │   ├── tools/          # MCP tool implementations
│   │   │   ├── __init__.py
│   │   │   ├── add_task.py
│   │   │   ├── list_tasks.py
│   │   │   ├── complete_task.py
│   │   │   ├── update_task.py
│   │   │   └── delete_task.py
│   │   └── schemas.py      # MCP-specific response schemas
│   └── ...                 # Existing modules unchanged
└── tests/
    └── test_mcp/           # NEW: MCP tool tests
        ├── __init__.py
        ├── conftest.py
        ├── test_add_task.py
        ├── test_list_tasks.py
        ├── test_complete_task.py
        ├── test_update_task.py
        ├── test_delete_task.py
        └── test_isolation.py
```

**Structure Decision**:
- **Integration approach**: Add MCP server as a new module (`src/mcp/`) within the existing backend
- **Reuse existing infrastructure**: Task model, TaskService, database connection, configuration
- **Parallel interfaces**: REST API (for frontend) and MCP tools (for AI agents) both access the same data
- **Simplified MCP interface**: MCP tools provide basic fields (title, description, completed) - no status, priority, projects, tags
- **User isolation**: MCP tools accept user_id parameter and pass to TaskService

## Integration Strategy

### Reusing Existing Components

**1. Task Model** (`src/models/task.py`):
- Existing model has: id, user_id, title, description, status, priority, due_date, project_id, is_complete, timestamps
- MCP tools will use: id, user_id, title, description, is_complete (completed), created_at, updated_at
- MCP tools ignore: status, priority, due_date, project_id (REST API exclusive features)

**2. TaskService** (`src/services/task_service.py`):
- Existing methods: list_tasks(), get_task(), create_task(), update_task(), delete_task()
- MCP tools will call these methods directly
- User isolation already implemented in TaskService
- Validation already implemented in TaskService

**3. Database** (`src/database.py`):
- Existing synchronous SQLModel engine and session management
- MCP tools will use existing get_session() dependency
- No async required (MCP SDK supports sync tools)

**4. Configuration** (`src/config.py`):
- Extend with MCP-specific settings (server name, port)
- Reuse existing DATABASE_URL

### MCP Tool Simplification

MCP tools provide a **simplified interface** for AI agents:

| Feature | REST API | MCP Tools |
|---------|----------|-----------|
| Title | ✅ | ✅ |
| Description | ✅ | ✅ |
| Completed (is_complete) | ✅ | ✅ |
| Status (todo/in_progress/done) | ✅ | ❌ |
| Priority (low/medium/high) | ✅ | ❌ |
| Due Date | ✅ | ❌ |
| Projects | ✅ | ❌ |
| Tags | ✅ | ❌ |

**Rationale**:
- Simplified interface reduces AI agent complexity
- Core todo functionality (title, description, completed) sufficient for conversational AI
- Advanced features (status, priority, projects, tags) remain available via REST API for frontend

## Complexity Tracking

> **No violations detected** - All constitution checks passed without requiring complexity justification.

The architecture is intentionally simple:
- Single backend service (existing FastAPI app)
- New MCP module added to existing structure
- Five stateless tools (one per CRUD operation)
- Reuse existing Task model and TaskService
- No new database entities or migrations needed
- Standard MCP SDK patterns (no custom protocols)

This simplicity aligns with constitution principles and spec requirements.
