# Research: Phase I - In-Memory Console Todo Application

**Feature**: 001-console-todo
**Date**: 2026-01-08
**Purpose**: Document technology decisions and best practices for Phase I implementation

## Research Topics

### 1. Python 3.13+ Features

**Decision**: Use Python 3.13+ with standard library features

**Key Features to Leverage**:
- **Type Hints**: Full type annotation support for better IDE integration and type checking
- **Dataclasses**: Consider for simple data structures (though Pydantic preferred for validation)
- **Match Statements**: Use for menu option handling (cleaner than if/elif chains)
- **Exception Groups**: For handling multiple validation errors simultaneously
- **Improved Error Messages**: Better traceback information for debugging

**Rationale**: Python 3.13 provides modern language features that improve code clarity and maintainability without adding complexity.

**Alternatives Considered**:
- Python 3.11/3.12: Would work but miss some newer features
- Python 3.10: Too old, missing match statements and other improvements

**References**:
- [Python 3.13 Release Notes](https://docs.python.org/3.13/whatsnew/3.13.html)
- [PEP 636 - Structural Pattern Matching](https://peps.python.org/pep-0636/)

---

### 2. UV Project Setup

**Decision**: Use UV for project management with pyproject.toml configuration

**Setup Approach**:
```bash
# Initialize UV project
uv init todo-app

# Add dependencies
uv add pydantic
uv add --dev pytest pytest-cov black flake8 mypy
```

**Project Structure**:
- `pyproject.toml`: Project metadata, dependencies, tool configurations
- `uv.lock`: Locked dependency versions for reproducibility
- `.python-version`: Pin Python version to 3.13+

**Rationale**: UV provides fast, reliable dependency management with excellent reproducibility. It's the modern standard for Python project management.

**Alternatives Considered**:
- **pip + requirements.txt**: Traditional but less reliable, no lock file
- **Poetry**: Good but slower than UV, more complex configuration
- **Pipenv**: Deprecated in favor of modern tools like UV

**References**:
- [UV Documentation](https://github.com/astral-sh/uv)
- [Python Packaging Guide](https://packaging.python.org/)

---

### 3. Pydantic Usage

**Decision**: Use Pydantic v2 for TodoItem model with validation

**Implementation Pattern**:
```python
from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class TodoItem(BaseModel):
    id: int
    title: str = Field(..., min_length=1, max_length=500)
    description: str = Field(default="", max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)

    @field_validator('title')
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip()
```

**Key Benefits**:
- Automatic validation on model creation
- Type coercion (e.g., string to int)
- Clear error messages for validation failures
- JSON serialization/deserialization built-in
- Excellent IDE support with type hints

**Rationale**: Pydantic is the Python standard for data validation. It provides robust validation with minimal boilerplate, aligning with the Simplicity principle.

**Alternatives Considered**:
- **Dataclasses**: No built-in validation, would need manual checks
- **attrs**: Good but less popular, smaller ecosystem
- **Manual validation**: Error-prone, verbose, harder to maintain

**References**:
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Pydantic V2 Migration Guide](https://docs.pydantic.dev/latest/migration/)

---

### 4. pytest Best Practices

**Decision**: Use pytest with fixtures and parametrize for comprehensive testing

**Test Organization**:
```
tests/
├── conftest.py          # Shared fixtures
├── unit/
│   ├── test_todo_model.py
│   ├── test_todo_store.py
│   └── test_todo_service.py
└── integration/
    └── test_cli_workflows.py
```

**Key Patterns**:
- **Fixtures**: Reusable test data and setup (e.g., sample todos, store instances)
- **Parametrize**: Test multiple inputs with single test function
- **Markers**: Categorize tests (unit, integration, slow)
- **Coverage**: Use pytest-cov for coverage reporting (target: 90%+)

**Example Fixture**:
```python
# conftest.py
import pytest
from todo_app.models.todo import TodoItem
from todo_app.store.todo_store import TodoStore

@pytest.fixture
def sample_todo():
    return TodoItem(
        id=1,
        title="Test Todo",
        description="Test Description",
        completed=False
    )

@pytest.fixture
def empty_store():
    return TodoStore()

@pytest.fixture
def populated_store(sample_todo):
    store = TodoStore()
    store.create(sample_todo)
    return store
```

**Rationale**: pytest is the Python standard for testing. Fixtures and parametrize reduce code duplication and improve test maintainability.

**Alternatives Considered**:
- **unittest**: Built-in but more verbose, less flexible
- **nose**: Deprecated, not maintained
- **Manual testing**: Not acceptable per constitution (TDD required)

**References**:
- [pytest Documentation](https://docs.pytest.org/)
- [pytest Fixtures](https://docs.pytest.org/en/stable/fixture.html)
- [pytest Parametrize](https://docs.pytest.org/en/stable/parametrize.html)

---

### 5. CLI Design Patterns

**Decision**: Use numbered menu with input validation and clear feedback

**Menu Pattern**:
```
=== Todo Application ===
1. Add Todo
2. View All Todos
3. Update Todo
4. Delete Todo
5. Mark Todo Complete/Incomplete
6. Search Todos
7. Exit

Enter your choice (1-7): _
```

**Input Handling**:
- Validate all inputs before processing
- Provide clear error messages for invalid inputs
- Allow user to retry on error (don't crash)
- Confirm destructive operations (delete)

**Output Formatting**:
- Use consistent formatting for todo display
- Show visual indicators for completed todos (✓ or [X])
- Display empty state messages when no todos exist
- Provide success/error feedback after operations

**Rationale**: Numbered menus are intuitive and easy to implement. Clear feedback and validation prevent user frustration and align with the Observability principle.

**Alternatives Considered**:
- **Command-line arguments**: Less interactive, harder for users
- **Natural language input**: Too complex for Phase I, reserved for Phase III (AI chatbot)
- **TUI framework (Rich, Textual)**: Over-engineering for Phase I, violates Simplicity principle

**References**:
- [Python input() Documentation](https://docs.python.org/3/library/functions.html#input)
- [CLI Design Best Practices](https://clig.dev/)

---

## Technology Stack Summary

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| Language | Python | 3.13+ | Modern features, type hints, match statements |
| Package Manager | UV | Latest | Fast, reliable, modern standard |
| Data Validation | Pydantic | 2.x | Robust validation, type safety, JSON support |
| Testing | pytest | Latest | Flexible, powerful, Python standard |
| Coverage | pytest-cov | Latest | Integrated coverage reporting |
| Formatting | black | Latest | Consistent code style, zero config |
| Linting | flake8 | Latest | PEP8 compliance checking |
| Type Checking | mypy | Latest | Static type checking |
| CLI | Standard Library | Built-in | input(), print(), no external dependencies |

---

## Implementation Guidelines

### Code Quality
- Use type hints for all functions and methods
- Run black for formatting before commit
- Run flake8 for linting before commit
- Run mypy for type checking before commit
- Maintain 90%+ test coverage

### Error Handling
- Use custom exceptions for domain errors (TodoNotFoundError, InvalidTodoError)
- Catch and handle all exceptions at CLI layer
- Provide clear, actionable error messages
- Log all errors with context

### Testing Strategy
- Write tests before implementation (TDD)
- Test happy paths and error cases
- Use parametrize for multiple input scenarios
- Test edge cases (empty strings, special characters, large inputs)

### Documentation
- Docstrings for all public functions/classes
- Type hints serve as inline documentation
- README.md with setup and usage instructions
- quickstart.md with step-by-step guide

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Pydantic adds external dependency | Low | Acceptable per constitution for data validation |
| Python 3.13 not widely available | Medium | Document Python version requirement clearly |
| In-memory storage limits scalability | Low | Acceptable for Phase I, addressed in Phase II |
| CLI usability for non-technical users | Medium | Clear menus, help text, error messages |

---

## Next Steps

1. ✅ Research complete - all technology decisions documented
2. ⏭️ Proceed to Phase 1: Generate data-model.md
3. ⏭️ Proceed to Phase 1: Generate contracts/cli-interface.md
4. ⏭️ Proceed to Phase 1: Generate quickstart.md
5. ⏭️ Update agent context with Python/UV/pytest/Pydantic

---

## References

- [Python 3.13 Documentation](https://docs.python.org/3.13/)
- [UV Package Manager](https://github.com/astral-sh/uv)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [pytest Documentation](https://docs.pytest.org/)
- [PEP 8 Style Guide](https://peps.python.org/pep-0008/)
- [CLI Design Guidelines](https://clig.dev/)
