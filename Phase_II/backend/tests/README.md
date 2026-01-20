# Pure Tasks API - Testing Guide

## Overview

This directory contains comprehensive tests for the Pure Tasks API backend. The test suite covers:

- **Authentication & Authorization** - User registration, login, JWT tokens
- **Task Management** - CRUD operations, filtering, user isolation
- **User Management** - Profile, stats, password changes
- **Projects & Tags** - Organization features
- **Notifications** - Real-time updates
- **Service Layer** - Business logic validation
- **Integration Tests** - End-to-end workflows

## Test Coverage

Current test coverage: **80%+** (target)

### Test Categories

- **Unit Tests** (`@pytest.mark.unit`) - Fast, isolated tests
- **Integration Tests** (`@pytest.mark.integration`) - Database and service integration
- **API Tests** (`@pytest.mark.api`) - HTTP endpoint testing
- **Smoke Tests** (`@pytest.mark.smoke`) - Critical functionality validation

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies including test dependencies
pip install -r requirements.txt

# Or install test dependencies separately
pip install -r requirements-test.txt
```

### 2. Run All Tests

```bash
# Run all tests with coverage
pytest

# Run with verbose output
pytest -v

# Run with coverage report
pytest --cov=src --cov-report=html
```

### 3. Run Specific Test Categories

```bash
# Run only unit tests (fast)
pytest -m unit

# Run only API tests
pytest -m api

# Run only integration tests
pytest -m integration

# Run smoke tests (critical functionality)
pytest -m smoke

# Run authentication tests
pytest -m auth
```

### 4. Run Specific Test Files

```bash
# Run authentication tests
pytest tests/test_auth.py

# Run task tests
pytest tests/test_tasks.py

# Run service layer tests
pytest tests/test_services.py
```

### 5. Run Specific Test Classes or Functions

```bash
# Run specific test class
pytest tests/test_auth.py::TestAuthRegistration

# Run specific test function
pytest tests/test_auth.py::TestAuthRegistration::test_register_success

# Run tests matching pattern
pytest -k "test_create"
```

## Test Structure

```
tests/
├── __init__.py                              # Test package
├── conftest.py                              # Shared fixtures and configuration
├── test_auth.py                             # Authentication tests
├── test_tasks.py                            # Task API tests
├── test_users.py                            # User API tests
├── test_projects_tags_notifications.py      # Project, tag, notification tests
└── test_services.py                         # Service layer tests
```

## Fixtures

Common fixtures available in all tests (defined in `conftest.py`):

### Database Fixtures
- `engine` - Test database engine (in-memory SQLite)
- `session` - Database session for each test

### Client Fixtures
- `client` - FastAPI TestClient with database override

### User Fixtures
- `test_user` - Primary test user
- `test_user_token` - JWT token for test user
- `auth_headers` - Authorization headers with token
- `second_user` - Secondary user for isolation testing
- `second_user_token` - JWT token for second user

### Data Fixtures
- `test_task` - Single test task
- `test_project` - Single test project
- `test_tag` - Single test tag
- `multiple_tasks` - 10 test tasks with varied properties

## Writing New Tests

### Example: API Endpoint Test

```python
import pytest
from fastapi.testclient import TestClient

@pytest.mark.api
def test_create_task(client: TestClient, auth_headers: dict):
    """Test creating a new task."""
    response = client.post(
        "/api/tasks",
        headers=auth_headers,
        json={
            "title": "New Task",
            "description": "Task description",
            "priority": "high"
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "New Task"
    assert "id" in data
```

### Example: Service Layer Test

```python
import pytest
from sqlmodel import Session
from src.services.task_service import TaskService

@pytest.mark.unit
def test_task_service_create(session: Session, test_user):
    """Test creating task through service."""
    service = TaskService(session)

    task = service.create_task(
        user_id=test_user.id,
        title="Service Task",
        status="todo",
        priority="medium"
    )

    assert task.id is not None
    assert task.title == "Service Task"
```

### Example: Integration Test

```python
import pytest

@pytest.mark.integration
def test_complete_task_workflow(client, auth_headers):
    """Test complete task lifecycle."""
    # Create
    create_response = client.post(
        "/api/tasks",
        headers=auth_headers,
        json={"title": "Workflow Task"}
    )
    task_id = create_response.json()["id"]

    # Update
    update_response = client.patch(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
        json={"status": "done"}
    )
    assert update_response.status_code == 200

    # Verify
    get_response = client.get(
        f"/api/tasks/{task_id}",
        headers=auth_headers
    )
    assert get_response.json()["status"] == "done"
```

## Test Markers

Use markers to categorize tests:

```python
@pytest.mark.unit          # Fast, isolated unit tests
@pytest.mark.integration   # Integration tests with database
@pytest.mark.api           # API endpoint tests
@pytest.mark.auth          # Authentication/authorization tests
@pytest.mark.slow          # Slow-running tests
@pytest.mark.smoke         # Critical smoke tests
```

## Coverage Reports

### Generate HTML Coverage Report

```bash
pytest --cov=src --cov-report=html
```

View report: Open `htmlcov/index.html` in browser

### Generate Terminal Coverage Report

```bash
pytest --cov=src --cov-report=term-missing
```

### Coverage Configuration

Coverage settings in `pytest.ini`:
- Minimum coverage: 80%
- Source: `src/` directory
- Omit: tests, migrations, cache

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest --cov=src --cov-report=xml
      - uses: codecov/codecov-action@v3
```

## Performance Testing

Run tests with timing information:

```bash
# Show slowest 10 tests
pytest --durations=10

# Run tests in parallel (faster)
pytest -n auto
```

## Debugging Tests

### Run with Debug Output

```bash
# Show print statements
pytest -s

# Show local variables on failure
pytest -l

# Drop into debugger on failure
pytest --pdb

# Stop on first failure
pytest -x
```

### Debug Specific Test

```python
def test_something(client, auth_headers):
    import pdb; pdb.set_trace()  # Breakpoint
    response = client.get("/api/tasks", headers=auth_headers)
    assert response.status_code == 200
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use fixtures for setup/teardown
- Don't rely on test execution order

### 2. Clear Test Names
```python
# Good
def test_create_task_with_valid_data_returns_201():
    pass

# Bad
def test_task():
    pass
```

### 3. Arrange-Act-Assert Pattern
```python
def test_example():
    # Arrange - Set up test data
    user = create_test_user()

    # Act - Perform action
    result = user.do_something()

    # Assert - Verify result
    assert result == expected_value
```

### 4. Test Edge Cases
- Empty inputs
- Invalid data
- Boundary conditions
- Error scenarios
- User isolation

### 5. Use Descriptive Assertions
```python
# Good
assert response.status_code == 201, f"Expected 201, got {response.status_code}"

# Better
assert response.status_code == 201
assert "id" in response.json()
assert response.json()["title"] == "Expected Title"
```

## Common Issues

### Issue: Tests Fail with Database Errors

**Solution**: Ensure test database is properly configured in `conftest.py`

### Issue: Authentication Tests Fail

**Solution**: Check JWT_SECRET is set in test environment

### Issue: Slow Test Execution

**Solution**:
- Run unit tests only: `pytest -m unit`
- Use parallel execution: `pytest -n auto`
- Profile slow tests: `pytest --durations=10`

### Issue: Import Errors

**Solution**: Install all dependencies: `pip install -r requirements.txt`

## Test Data

### Creating Test Users

```python
from src.models.user import User
from src.services.auth import hash_password

user = User(
    email="test@example.com",
    name="Test User",
    hashed_password=hash_password("password123")
)
session.add(user)
session.commit()
```

### Creating Test Tasks

```python
from src.models.task import Task

task = Task(
    title="Test Task",
    description="Description",
    status="todo",
    priority="medium",
    user_id=user.id
)
session.add(task)
session.commit()
```

## Maintenance

### Adding New Tests

1. Create test file in `tests/` directory
2. Import necessary fixtures from `conftest.py`
3. Add appropriate markers (`@pytest.mark.api`, etc.)
4. Follow naming convention: `test_*.py`
5. Run tests to verify: `pytest tests/test_new_file.py`

### Updating Fixtures

Edit `tests/conftest.py` to add or modify shared fixtures.

### Updating Configuration

Edit `pytest.ini` for pytest settings and markers.

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [SQLModel Testing](https://sqlmodel.tiangolo.com/tutorial/testing/)
- [Coverage.py](https://coverage.readthedocs.io/)

## Support

For issues or questions about tests:
1. Check this README
2. Review existing test examples
3. Check pytest documentation
4. Open an issue in the project repository

---

**Last Updated**: 2026-01-12
**Test Framework**: pytest 7.4.3
**Coverage Target**: 80%+
