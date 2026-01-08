# Quickstart Guide: Phase I - In-Memory Console Todo Application

**Feature**: 001-console-todo
**Date**: 2026-01-08
**Purpose**: Step-by-step guide to set up, run, and use the todo application

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.13 or higher**: [Download Python](https://www.python.org/downloads/)
- **UV package manager**: [Install UV](https://github.com/astral-sh/uv)
- **Git**: [Download Git](https://git-scm.com/downloads)

### Verify Installation

```bash
# Check Python version (should be 3.13+)
python --version

# Check UV installation
uv --version

# Check Git installation
git --version
```

## Setup Instructions

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd todo-app

# Switch to the feature branch
git checkout 001-console-todo
```

### Step 2: Initialize UV Project

```bash
# Initialize UV project (if not already done)
uv init

# Install dependencies
uv sync
```

This will:
- Create a virtual environment
- Install all required dependencies (pydantic, pytest, etc.)
- Generate `uv.lock` file for reproducible builds

### Step 3: Verify Installation

```bash
# Run tests to verify setup
uv run pytest

# Check code formatting
uv run black --check .

# Check linting
uv run flake8 .

# Check type hints
uv run mypy todo_app/
```

All checks should pass. If any fail, review the error messages and fix issues before proceeding.

## Running the Application

### Start the Application

```bash
# Run the application
uv run python main.py
```

You should see the main menu:

```
╔════════════════════════════════════════════════════════════╗
║              Todo Application - Phase I                    ║
║                  (In-Memory Storage)                       ║
╚════════════════════════════════════════════════════════════╝

Main Menu:
  1. Add Todo
  2. View All Todos
  3. Update Todo
  4. Delete Todo
  5. Mark Todo Complete/Incomplete
  6. Search Todos
  7. Exit

⚠️  Warning: All data will be lost when you exit the application

Enter your choice (1-7): _
```

## Usage Guide

### Adding Your First Todo

1. Select option `1` (Add Todo)
2. Enter a title when prompted (e.g., "Buy groceries")
3. Enter a description (optional, press Enter to skip)
4. The todo is created and assigned an ID

**Example**:
```
Enter your choice (1-7): 1

=== Add New Todo ===

Enter todo title (required): Buy groceries
Enter todo description (optional, press Enter to skip): Milk, eggs, bread

✓ Success! Todo created with ID: 1
  Title: Buy groceries
  Description: Milk, eggs, bread
  Status: Pending

Press Enter to continue...
```

### Viewing All Todos

1. Select option `2` (View All Todos)
2. See a table of all your todos with their status

**Example**:
```
Enter your choice (1-7): 2

=== All Todos ===

Total: 1 todo (1 pending, 0 completed)

┌────┬─────────────────────────┬──────────────────────────┬──────────┐
│ ID │ Title                   │ Description              │ Status   │
├────┼─────────────────────────┼──────────────────────────┼──────────┤
│ 1  │ Buy groceries           │ Milk, eggs, bread        │ Pending  │
└────┴─────────────────────────┴──────────────────────────┴──────────┘

Press Enter to continue...
```

### Marking a Todo as Complete

1. Select option `5` (Mark Todo Complete/Incomplete)
2. Enter the todo ID
3. Choose `1` to mark as complete or `2` to mark as incomplete

**Example**:
```
Enter your choice (1-7): 5

=== Mark Todo Complete/Incomplete ===

Enter todo ID: 1

Current todo:
  ID: 1
  Title: Buy groceries
  Description: Milk, eggs, bread
  Status: Pending

Mark as (1) Complete or (2) Incomplete: 1

✓ Success! Todo marked as complete
  ID: 1
  Title: Buy groceries
  Status: ✓ Done

Press Enter to continue...
```

### Updating a Todo

1. Select option `3` (Update Todo)
2. Enter the todo ID
3. Enter new title (or press Enter to keep current)
4. Enter new description (or press Enter to keep current)

**Example**:
```
Enter your choice (1-7): 3

=== Update Todo ===

Enter todo ID to update: 1

Current todo:
  ID: 1
  Title: Buy groceries
  Description: Milk, eggs, bread
  Status: Done

Enter new title (press Enter to keep current): Buy groceries and supplies
Enter new description (press Enter to keep current):

✓ Success! Todo updated
  ID: 1
  Title: Buy groceries and supplies
  Description: Milk, eggs, bread
  Status: Done

Press Enter to continue...
```

### Searching Todos

1. Select option `6` (Search Todos)
2. Choose search type:
   - `1` for keyword search
   - `2` for status filter
3. Enter search criteria

**Example - Keyword Search**:
```
Enter your choice (1-7): 6

=== Search Todos ===

Search options:
  1. Search by keyword
  2. Filter by status
  3. Back to main menu

Enter your choice (1-3): 1

Enter search keyword: grocery

=== Search Results ===

Found 1 todo(s) matching "grocery":

┌────┬─────────────────────────┬──────────────────────────┬──────────┐
│ ID │ Title                   │ Description              │ Status   │
├────┼─────────────────────────┼──────────────────────────┼──────────┤
│ 1  │ Buy groceries and sup...│ Milk, eggs, bread        │ ✓ Done   │
└────┴─────────────────────────┴──────────────────────────┴──────────┘

Press Enter to continue...
```

**Example - Status Filter**:
```
Enter your choice (1-7): 6

=== Search Todos ===

Search options:
  1. Search by keyword
  2. Filter by status
  3. Back to main menu

Enter your choice (1-3): 2

Filter by status:
  1. Pending only
  2. Completed only
  3. All (no filter)

Enter your choice (1-3): 2

=== Filtered Todos (Completed) ===

Found 1 completed todo(s):

┌────┬─────────────────────────┬──────────────────────────┬──────────┐
│ ID │ Title                   │ Description              │ Status   │
├────┼─────────────────────────┼──────────────────────────┼──────────┤
│ 1  │ Buy groceries and sup...│ Milk, eggs, bread        │ ✓ Done   │
└────┴─────────────────────────┴──────────────────────────┴──────────┘

Press Enter to continue...
```

### Deleting a Todo

1. Select option `4` (Delete Todo)
2. Enter the todo ID
3. Confirm deletion by typing "yes"

**Example**:
```
Enter your choice (1-7): 4

=== Delete Todo ===

Enter todo ID to delete: 1

Current todo:
  ID: 1
  Title: Buy groceries and supplies
  Description: Milk, eggs, bread
  Status: Done

⚠️  Are you sure you want to delete this todo? (yes/no): yes

✓ Success! Todo deleted
  ID: 1
  Title: Buy groceries and supplies

Press Enter to continue...
```

### Exiting the Application

1. Select option `7` (Exit)
2. Confirm exit by typing "yes"
3. **Important**: All data will be lost!

**Example**:
```
Enter your choice (1-7): 7

⚠️  Warning: All todos will be lost when you exit!

Are you sure you want to exit? (yes/no): yes

Thank you for using Todo Application!
All data has been cleared from memory.

Goodbye!
```

## Common Tasks

### Task 1: Create a Simple Todo List

```
1. Start the application
2. Add todo: "Buy groceries"
3. Add todo: "Call dentist"
4. Add todo: "Finish project report"
5. View all todos
6. Mark "Call dentist" as complete
7. View all todos again
```

### Task 2: Manage Your Daily Tasks

```
1. Start the application
2. Add 5-10 todos for your day
3. Mark completed tasks as done throughout the day
4. Update todos if plans change
5. Delete todos that are no longer relevant
6. Search for specific todos by keyword
```

### Task 3: Test Edge Cases

```
1. Try adding a todo with an empty title (should fail)
2. Try adding a todo with a very long title (500+ chars)
3. Try updating a non-existent todo ID
4. Try deleting a non-existent todo ID
5. Search for a keyword that doesn't exist
6. Filter by status when no todos match
```

## Development Workflow

### Running Tests

```bash
# Run all tests
uv run pytest

# Run with coverage report
uv run pytest --cov=todo_app --cov-report=html

# Run specific test file
uv run pytest tests/unit/test_todo_model.py

# Run tests with verbose output
uv run pytest -v

# Run tests and stop on first failure
uv run pytest -x
```

### Code Quality Checks

```bash
# Format code with black
uv run black .

# Check formatting without making changes
uv run black --check .

# Run linting
uv run flake8 .

# Run type checking
uv run mypy todo_app/

# Run all quality checks
uv run black --check . && uv run flake8 . && uv run mypy todo_app/
```

### Project Structure

```
todo-app/
├── todo_app/              # Main application package
│   ├── __init__.py
│   ├── models/            # Domain models
│   │   ├── __init__.py
│   │   └── todo.py
│   ├── store/             # In-memory storage
│   │   ├── __init__.py
│   │   └── todo_store.py
│   ├── services/          # Business logic
│   │   ├── __init__.py
│   │   └── todo_service.py
│   └── cli/               # CLI interface
│       ├── __init__.py
│       ├── menu.py
│       └── formatter.py
├── tests/                 # Test suite
│   ├── unit/
│   └── integration/
├── main.py                # Entry point
├── pyproject.toml         # Project configuration
├── uv.lock                # Locked dependencies
└── README.md              # Project documentation
```

## Troubleshooting

### Issue: "Python version not found"

**Solution**: Ensure Python 3.13+ is installed and in your PATH.

```bash
# Check Python version
python --version

# If using pyenv, set local version
pyenv local 3.13.0
```

### Issue: "UV command not found"

**Solution**: Install UV package manager.

```bash
# Install UV (Unix/macOS)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install UV (Windows)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Issue: "Module not found" errors

**Solution**: Ensure dependencies are installed.

```bash
# Sync dependencies
uv sync

# Reinstall all dependencies
rm -rf .venv uv.lock
uv sync
```

### Issue: Tests failing

**Solution**: Check test output for specific errors.

```bash
# Run tests with verbose output
uv run pytest -v

# Run specific failing test
uv run pytest tests/unit/test_todo_model.py::test_name -v
```

### Issue: Application crashes on startup

**Solution**: Check for syntax errors or missing dependencies.

```bash
# Check for syntax errors
uv run python -m py_compile main.py

# Run with Python directly to see full traceback
uv run python main.py
```

## Important Notes

### Data Persistence

⚠️ **Warning**: This is an in-memory application. All data is lost when you exit!

- No database or file storage
- Data exists only during application runtime
- Closing the application deletes all todos
- No backup or recovery mechanism

This is intentional for Phase I. Future phases will add persistence:
- Phase II: Database storage (Neon PostgreSQL)
- Phase III: Cloud sync
- Phase IV: Kubernetes persistent volumes

### Performance

The application is designed to handle:
- 100+ todos without performance degradation
- Search through 50+ todos in under 1 second
- Instant response for all CRUD operations

### Security

Phase I security considerations:
- Input validation prevents crashes
- No authentication (single user, local only)
- No network access
- No file system access

Future phases will add:
- Phase II: User authentication
- Phase III: API security
- Phase IV: Network policies
- Phase V: Production security hardening

## Next Steps

After completing this quickstart:

1. **Explore the codebase**: Review the implementation in `todo_app/`
2. **Run the tests**: Understand the test coverage in `tests/`
3. **Review the documentation**: Read `README.md` for architecture details
4. **Experiment**: Try adding features or modifying behavior
5. **Prepare for Phase II**: Review Phase II requirements (web application)

## Getting Help

- **Documentation**: See `README.md` for detailed architecture
- **Specification**: See `specs/001-console-todo/spec.md` for requirements
- **Implementation Plan**: See `specs/001-console-todo/plan.md` for design decisions
- **Data Model**: See `specs/001-console-todo/data-model.md` for entity details
- **CLI Interface**: See `specs/001-console-todo/contracts/cli-interface.md` for UI specs

## Feedback

This is an educational project demonstrating agentic software development workflows. All development artifacts (spec, plan, tasks, code) are captured for review and evaluation.

---

**Congratulations!** You're now ready to use the Phase I Todo Application. Enjoy managing your tasks!
