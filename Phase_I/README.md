# Phase I - In-Memory Console Todo Application

A simple, in-memory console-based todo application built with Python 3.13+ following Test-Driven Development (TDD) principles.

## Features

- ✅ **Add Todos**: Create new todo items with title and optional description
- ✅ **View Todos**: Display all todos in a formatted table
- ✅ **Update Todos**: Edit existing todo titles and descriptions
- ✅ **Delete Todos**: Remove todos with confirmation
- ✅ **Mark Complete**: Toggle completion status of todos
- ✅ **Search & Filter**: Search by keyword or filter by status

## Requirements

- Python 3.13 or higher
- UV package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Hackathon_II
```

2. Install dependencies using UV:
```bash
uv sync
```

## Usage

Run the application:
```bash
uv run python main.py
```

Or using UV's run command:
```bash
uv run main.py
```

### Menu Options

1. **Add Todo** - Create a new todo item
2. **View All Todos** - Display all todos in a table
3. **Update Todo** - Edit an existing todo
4. **Delete Todo** - Remove a todo (with confirmation)
5. **Mark Todo Complete/Incomplete** - Toggle completion status
6. **Search Todos** - Search by keyword or filter by status
7. **Exit** - Exit the application (with data loss warning)

## Architecture

The application follows a layered architecture:

```
User → CLI Layer → Services Layer → Store Layer → Models Layer
```

### Project Structure

```
Hackathon_II/
├── todo_app/              # Main application package
│   ├── models/            # Domain models (TodoItem)
│   ├── store/             # In-memory storage (TodoStore)
│   ├── services/          # Business logic (TodoService)
│   ├── cli/               # CLI interface (Menu, Formatter)
│   ├── exceptions.py      # Custom exceptions
│   └── logging_config.py  # Logging configuration
├── tests/                 # Test suite
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
├── main.py                # Application entry point
└── pyproject.toml         # Project configuration

```

## Development

### Running Tests

Run all tests:
```bash
uv run pytest
```

Run with coverage:
```bash
uv run pytest --cov=todo_app --cov-report=html
```

Run specific test file:
```bash
uv run pytest tests/unit/test_todo_model.py -v
```

### Code Quality

Format code:
```bash
uv run black .
```

Lint code:
```bash
uv run flake8 .
```

Type checking:
```bash
uv run mypy todo_app/
```

## Important Notes

⚠️ **In-Memory Storage**: All data is stored in memory only and will be lost when the application exits. This is intentional for Phase I.

## Testing

The application includes comprehensive unit tests:
- TodoItem model validation tests
- TodoStore CRUD operation tests
- TodoService business logic tests

All tests follow TDD principles and achieve high code coverage.

## License

This project is part of a multi-phase hackathon demonstrating agentic software development workflows.
