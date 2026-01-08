"""Unit tests for TodoItem model."""

import pytest
from datetime import datetime
from pydantic import ValidationError
from todo_app.models.todo import TodoItem


def test_todo_item_creation_valid() -> None:
    """Test creating a valid todo item."""
    todo = TodoItem(
        id=1,
        title="Buy groceries",
        description="Milk, eggs, bread",
        completed=False,
        created_at=datetime.now(),
    )
    assert todo.id == 1
    assert todo.title == "Buy groceries"
    assert todo.description == "Milk, eggs, bread"
    assert todo.completed is False
    assert isinstance(todo.created_at, datetime)


def test_todo_item_validation_empty_title() -> None:
    """Test that empty title raises validation error."""
    with pytest.raises(ValidationError) as exc_info:
        TodoItem(id=1, title="", description="Test")
    # Check for either Pydantic's min_length error or custom validator error
    error_str = str(exc_info.value)
    assert (
        "String should have at least 1 character" in error_str
        or "Title cannot be empty" in error_str
    )


def test_todo_item_validation_title_length() -> None:
    """Test that title exceeding max length raises validation error."""
    long_title = "x" * 501
    with pytest.raises(ValidationError) as exc_info:
        TodoItem(id=1, title=long_title)
    assert "String should have at most 500 characters" in str(exc_info.value)


def test_todo_item_validation_description_length() -> None:
    """Test that description exceeding max length raises validation error."""
    long_description = "x" * 2001
    with pytest.raises(ValidationError) as exc_info:
        TodoItem(id=1, title="Test", description=long_description)
    assert "String should have at most 2000 characters" in str(exc_info.value)


def test_todo_item_defaults() -> None:
    """Test that todo item has correct default values."""
    todo = TodoItem(id=1, title="Test Todo")
    assert todo.description == ""
    assert todo.completed is False
    assert isinstance(todo.created_at, datetime)


def test_todo_item_title_trimming() -> None:
    """Test that title is trimmed of leading/trailing whitespace."""
    todo = TodoItem(id=1, title="  Test Todo  ")
    assert todo.title == "Test Todo"


def test_todo_item_whitespace_only_title() -> None:
    """Test that whitespace-only title raises validation error."""
    with pytest.raises(ValidationError) as exc_info:
        TodoItem(id=1, title="   ")
    assert "Title cannot be empty" in str(exc_info.value)
