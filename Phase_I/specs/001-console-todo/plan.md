# Implementation Plan: Phase I - In-Memory Console Todo Application

**Branch**: `001-console-todo` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-console-todo/spec.md`

## Summary

Build an in-memory Python console application for managing todo items with full CRUD operations and search capabilities. The application uses a layered architecture (CLI → Services → Domain Model → In-Memory Store) to ensure clean separation of concerns and testability. All data is stored in memory during runtime only, with no persistence to disk or database. The application targets instructors and reviewers evaluating agentic software development workflows, emphasizing correctness, clarity, and complete traceability of all development artifacts.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: Standard library only (no external dependencies for core functionality), pytest for testing
**Storage**: In-memory only (Python dict/list structures) - no database, no file persistence
**Testing**: pytest for unit tests, pytest-cov for coverage reporting
**Target Platform**: Cross-platform (Windows, macOS, Linux) - any system with Python 3.13+
**Project Type**: Single project (console application)
**Performance Goals**: Handle 100+ todos without degradation, search results within 1 second for 50+ todos
**Constraints**: In-memory only, CLI only, Python 3.13+, UV project structure, no external dependencies
**Scale/Scope**: Educational/demonstration application, 1-100 todos per session, single user, process lifetime only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Correctness First
- **Status**: PASS
- **Compliance**: All functional requirements have clear acceptance criteria in spec.md
- **Plan**: Unit tests required for all business logic (services, models, store)
- **Verification**: pytest test suite must pass 100% before phase completion

### ✅ Principle II: Simplicity & Progressive Enhancement
- **Status**: PASS
- **Compliance**: Single-process CLI application with minimal dependencies (standard library only)
- **Plan**: Layered architecture (CLI → Services → Models → Store) provides clear separation without over-engineering
- **Verification**: No unnecessary abstractions, YAGNI principles applied, code review for complexity

### ✅ Principle III: Test-Driven Development (NON-NEGOTIABLE)
- **Status**: PASS
- **Compliance**: Unit tests required for all business logic per constitution
- **Plan**:
  - Unit tests for TodoItem model (validation, state transitions)
  - Unit tests for TodoStore (CRUD operations, search)
  - Unit tests for TodoService (business logic, error handling)
  - Integration tests for CLI workflows (optional but recommended)
- **Verification**: pytest coverage report, all tests pass before implementation complete

### ✅ Principle IV: Observability
- **Status**: PASS (adapted for Phase I)
- **Compliance**: Structured logging required, errors must include context
- **Plan**:
  - Use Python logging module with structured format
  - Log all operations (create, update, delete, search) with context
  - Error messages include operation attempted and reason for failure
- **Verification**: Log output review, error handling test cases
- **Note**: Health check endpoints not applicable for Phase I (CLI only), required for Phase II+

### ✅ Principle V: Security-by-Design
- **Status**: PASS (adapted for Phase I)
- **Compliance**: Input validation required at all system boundaries
- **Plan**:
  - Validate all user inputs (non-empty titles, valid IDs, safe string handling)
  - Sanitize inputs to prevent injection attacks (even though no persistence)
  - Handle special characters safely (quotes, newlines, unicode)
- **Verification**: Input validation test cases, edge case testing
- **Note**: Authentication not applicable for Phase I (single user), required for Phase II+

### ✅ Principle VI: AI Alignment
- **Status**: N/A for Phase I
- **Compliance**: No AI features in Phase I
- **Note**: Applicable for Phase III (AI-Powered Chatbot)

### ✅ Code Standards: Python
- **Status**: PASS
- **Compliance**: PEP8 compliance, type hints required
- **Plan**:
  - Use type hints for all functions and methods
  - Run black for formatting, flake8 for linting, mypy for type checking
  - Follow PEP8 naming conventions
- **Verification**: Linting checks pass before commit

### ✅ Testing Standards
- **Status**: PASS
- **Compliance**: Unit tests required for all business logic
- **Plan**: pytest test suite with unit tests for models, services, and store
- **Verification**: All tests pass, coverage report generated

### ✅ Documentation Standards
- **Status**: PASS
- **Compliance**: README with setup steps, architecture notes required
- **Plan**:
  - README.md with installation, usage, and architecture overview
  - quickstart.md with step-by-step guide
  - Inline docstrings for all public functions/classes
- **Verification**: Documentation review, quickstart validation

### ✅ Data Modeling Standards
- **Status**: PASS
- **Compliance**: Typed models with validation (Pydantic / SQLModel)
- **Plan**: Use Pydantic for TodoItem model with validation
- **Verification**: Model validation tests
- **Note**: Pydantic is acceptable as it's a standard for Python data validation

### ✅ Phase I Constraints
- **Status**: PASS
- **Compliance**:
  - ✅ Fully in-memory (no database, no filesystem persistence)
  - ✅ Supports create/read/update/delete/list and search operations
  - ✅ Uses Python with Claude Code and Spec-Kit Plus
- **Verification**: Code review confirms no file I/O or database connections

### Summary: Constitution Compliance
- **Overall Status**: ✅ PASS - All applicable principles satisfied
- **Violations**: None
- **Justifications Required**: None
- **Ready for Phase 0**: Yes

## Project Structure

### Documentation (this feature)

```text
specs/001-console-todo/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (Python best practices, UV setup)
├── data-model.md        # Phase 1 output (TodoItem entity definition)
├── quickstart.md        # Phase 1 output (setup and usage guide)
├── contracts/           # Phase 1 output (CLI interface contracts)
│   └── cli-interface.md # Command-line interface specification
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Single project structure (Phase I)
todo_app/                # Main application package
├── __init__.py
├── models/              # Domain models
│   ├── __init__.py
│   └── todo.py          # TodoItem model with Pydantic validation
├── store/               # In-memory data storage
│   ├── __init__.py
│   └── todo_store.py    # TodoStore class (dict-based repository)
├── services/            # Business logic layer
│   ├── __init__.py
│   └── todo_service.py  # TodoService (CRUD operations, search)
└── cli/                 # Command-line interface
    ├── __init__.py
    ├── menu.py          # Menu display and input handling
    └── formatter.py     # Output formatting and display

tests/                   # Test suite
├── __init__.py
├── unit/                # Unit tests
│   ├── __init__.py
│   ├── test_todo_model.py      # TodoItem model tests
│   ├── test_todo_store.py      # TodoStore tests
│   └── test_todo_service.py    # TodoService tests
└── integration/         # Integration tests (optional)
    ├── __init__.py
    └── test_cli_workflows.py   # End-to-end CLI workflow tests

main.py                  # Application entry point
pyproject.toml           # UV project configuration
README.md                # Project documentation
.gitignore               # Git ignore rules
```

**Structure Decision**: Selected single project structure (Option 1) as this is a standalone console application with no web or mobile components. The layered architecture (CLI → Services → Store → Models) provides clear separation of concerns while maintaining simplicity. Each layer has a single responsibility:

- **CLI Layer**: User interaction, input/output, menu display
- **Services Layer**: Business logic, validation, orchestration
- **Store Layer**: In-memory data management, CRUD operations
- **Models Layer**: Domain entities, data validation

This structure supports testability (each layer can be tested independently) and aligns with the Simplicity principle (no unnecessary abstractions).

## Complexity Tracking

> **No violations detected - this section is empty**

All constitution principles are satisfied without requiring complexity justifications. The design uses standard patterns appropriate for a console application.

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLI Layer (cli/)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   menu.py    │  │ formatter.py │  │   main.py    │      │
│  │ (Input/Menu) │  │  (Output)    │  │ (Entry Point)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Services Layer (services/)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           todo_service.py (TodoService)              │   │
│  │  - add_todo()      - update_todo()                   │   │
│  │  - delete_todo()   - list_todos()                    │   │
│  │  - mark_complete() - search_todos()                  │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Store Layer (store/)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         todo_store.py (TodoStore)                    │   │
│  │  - create()   - read()    - update()                 │   │
│  │  - delete()   - list()    - search()                 │   │
│  │  Storage: Dict[int, TodoItem]                        │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Models Layer (models/)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            todo.py (TodoItem)                        │   │
│  │  - id: int                                           │   │
│  │  - title: str (required, non-empty)                  │   │
│  │  - description: str (optional)                       │   │
│  │  - completed: bool (default: False)                  │   │
│  │  - created_at: datetime                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → CLI Layer captures and validates input
2. **CLI Layer** → Calls appropriate service method
3. **Service Layer** → Validates business rules, calls store
4. **Store Layer** → Performs CRUD operation on in-memory dict
5. **Store Layer** → Returns result (TodoItem or list)
6. **Service Layer** → Processes result, handles errors
7. **CLI Layer** → Formats and displays result to user

### Key Design Decisions

1. **In-Memory Storage**: Use Python dict (Dict[int, TodoItem]) for O(1) lookups by ID
2. **ID Generation**: Auto-incrementing integer IDs (simple, sufficient for in-memory)
3. **Validation**: Pydantic models for data validation at model layer
4. **Error Handling**: Custom exceptions for domain errors (TodoNotFoundError, InvalidTodoError)
5. **Search**: Case-insensitive substring matching in title and description
6. **CLI Loop**: Continuous menu loop until user chooses to exit

## Phase 0: Research & Technology Decisions

### Research Topics

1. **Python 3.13+ Features**: Investigate new features relevant to this project
2. **UV Project Setup**: Best practices for UV-based Python projects
3. **Pydantic Usage**: Data validation patterns for domain models
4. **pytest Best Practices**: Test organization and fixtures for CLI applications
5. **CLI Design Patterns**: User-friendly menu systems and input handling

### Decisions Made

All research topics will be documented in `research.md` with:
- Decision: What was chosen
- Rationale: Why it was chosen
- Alternatives considered: What else was evaluated
- References: Links to documentation and best practices

## Phase 1: Design Artifacts

### Artifacts to Generate

1. **data-model.md**: Complete TodoItem entity specification with validation rules
2. **contracts/cli-interface.md**: CLI command specifications and user interaction flows
3. **quickstart.md**: Step-by-step setup and usage guide

### Design Validation

After Phase 1 completion, re-run Constitution Check to verify:
- All design decisions align with principles
- No unnecessary complexity introduced
- Test strategy is clear and comprehensive

## Next Steps

1. ✅ Constitution Check passed - proceed to Phase 0
2. ⏭️ Execute Phase 0: Generate research.md
3. ⏭️ Execute Phase 1: Generate data-model.md, contracts/, quickstart.md
4. ⏭️ Update agent context with Python/UV/pytest technologies
5. ⏭️ Report completion and readiness for /sp.tasks

## Notes

- This is Phase I of a 5-phase progressive enhancement project
- Future phases will build on this foundation (web app, AI chatbot, K8s, cloud)
- Design must be clean and simple to facilitate future enhancement
- All development artifacts must be captured for instructor/reviewer evaluation
