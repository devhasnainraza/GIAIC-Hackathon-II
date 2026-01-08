"""Pytest fixtures for Todo App tests."""

import pytest
from datetime import datetime
from todo_app.models.todo import TodoItem
from todo_app.store.todo_store import TodoStore


@pytest.fixture
def sample_todo() -> TodoItem:
    """Create a sample todo item for testing."""
    return TodoItem(
        id=1,
        title="Test Todo",
        description="Test Description",
        completed=False,
        created_at=datetime.now(),
    )


@pytest.fixture
def empty_store() -> TodoStore:
    """Create an empty todo store for testing."""
    return TodoStore()


@pytest.fixture
def populated_store(sample_todo: TodoItem) -> TodoStore:
    """Create a todo store with one sample todo."""
    store = TodoStore()
    store.create(sample_todo)
    return store
