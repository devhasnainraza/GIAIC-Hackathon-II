"""Unit tests for TodoService."""

import pytest
from todo_app.services.todo_service import TodoService
from todo_app.store.todo_store import TodoStore
from todo_app.exceptions import EmptyTitleError, TodoNotFoundError


def test_service_add_todo_valid(empty_store: TodoStore) -> None:
    """Test adding a valid todo via service."""
    service = TodoService(empty_store)
    todo = service.add_todo("Buy groceries", "Milk, eggs, bread")
    assert todo.title == "Buy groceries"
    assert todo.description == "Milk, eggs, bread"
    assert todo.completed is False
    assert len(service.list_todos()) == 1


def test_service_add_todo_empty_title(empty_store: TodoStore) -> None:
    """Test adding todo with empty title raises EmptyTitleError."""
    service = TodoService(empty_store)
    with pytest.raises(EmptyTitleError):
        service.add_todo("", "Description")


def test_service_list_todos(populated_store: TodoStore) -> None:
    """Test listing todos via service."""
    service = TodoService(populated_store)
    todos = service.list_todos()
    assert len(todos) == 1
    assert todos[0].title == "Test Todo"


def test_service_add_todo_no_description(empty_store: TodoStore) -> None:
    """Test adding todo without description."""
    service = TodoService(empty_store)
    todo = service.add_todo("Test Todo")
    assert todo.title == "Test Todo"
    assert todo.description == ""


def test_service_list_todos_empty(empty_store: TodoStore) -> None:
    """Test listing todos from empty store."""
    service = TodoService(empty_store)
    todos = service.list_todos()
    assert len(todos) == 0


def test_service_get_todo(populated_store: TodoStore, sample_todo) -> None:
    """Test getting a single todo via service."""
    service = TodoService(populated_store)
    todo = service.get_todo(sample_todo.id)
    assert todo.id == sample_todo.id
    assert todo.title == sample_todo.title


def test_service_get_todo_not_found(empty_store: TodoStore) -> None:
    """Test getting a non-existent todo raises TodoNotFoundError."""
    service = TodoService(empty_store)
    with pytest.raises(TodoNotFoundError) as exc_info:
        service.get_todo(999)
    assert exc_info.value.todo_id == 999


def test_service_update_todo(populated_store: TodoStore, sample_todo) -> None:
    """Test updating a todo via service."""
    service = TodoService(populated_store)
    updated = service.update_todo(
        sample_todo.id, title="Updated Title", description="Updated Description"
    )
    assert updated.title == "Updated Title"
    assert updated.description == "Updated Description"


def test_service_update_todo_title_only(populated_store: TodoStore, sample_todo) -> None:
    """Test updating only the title via service."""
    service = TodoService(populated_store)
    original_description = sample_todo.description
    updated = service.update_todo(sample_todo.id, title="New Title")
    assert updated.title == "New Title"
    assert updated.description == original_description


def test_service_update_todo_empty_title(populated_store: TodoStore, sample_todo) -> None:
    """Test updating with empty title raises EmptyTitleError."""
    service = TodoService(populated_store)
    with pytest.raises(EmptyTitleError):
        service.update_todo(sample_todo.id, title="")


def test_service_update_todo_not_found(empty_store: TodoStore) -> None:
    """Test updating a non-existent todo raises TodoNotFoundError."""
    service = TodoService(empty_store)
    with pytest.raises(TodoNotFoundError):
        service.update_todo(999, title="New Title")


def test_service_delete_todo(populated_store: TodoStore, sample_todo) -> None:
    """Test deleting a todo via service."""
    service = TodoService(populated_store)
    deleted = service.delete_todo(sample_todo.id)
    assert deleted.id == sample_todo.id
    assert deleted.title == sample_todo.title
    assert len(service.list_todos()) == 0


def test_service_delete_todo_not_found(empty_store: TodoStore) -> None:
    """Test deleting a non-existent todo raises TodoNotFoundError."""
    service = TodoService(empty_store)
    with pytest.raises(TodoNotFoundError):
        service.delete_todo(999)


def test_service_mark_complete(populated_store: TodoStore, sample_todo) -> None:
    """Test marking a todo as complete via service."""
    service = TodoService(populated_store)
    assert sample_todo.completed is False
    updated = service.mark_complete(sample_todo.id)
    assert updated.completed is True


def test_service_mark_incomplete(populated_store: TodoStore, sample_todo) -> None:
    """Test marking a todo as incomplete via service."""
    service = TodoService(populated_store)
    # First mark it complete
    service.mark_complete(sample_todo.id)
    # Then mark it incomplete
    updated = service.mark_incomplete(sample_todo.id)
    assert updated.completed is False


def test_service_mark_complete_not_found(empty_store: TodoStore) -> None:
    """Test marking a non-existent todo raises TodoNotFoundError."""
    service = TodoService(empty_store)
    with pytest.raises(TodoNotFoundError):
        service.mark_complete(999)


def test_service_search_todos_by_keyword(empty_store: TodoStore) -> None:
    """Test searching todos by keyword via service."""
    service = TodoService(empty_store)
    service.add_todo("Buy groceries", "Milk and eggs")
    service.add_todo("Clean house", "Vacuum and dust")
    service.add_todo("Buy books", "Python programming")

    results = service.search_todos(keyword="buy")
    assert len(results) == 2
    assert all("buy" in t.title.lower() for t in results)


def test_service_search_todos_by_status_pending(empty_store: TodoStore) -> None:
    """Test searching todos by pending status via service."""
    service = TodoService(empty_store)
    todo1 = service.add_todo("Todo 1", "")
    todo2 = service.add_todo("Todo 2", "")
    todo3 = service.add_todo("Todo 3", "")

    # Mark one as complete
    service.mark_complete(todo2.id)

    results = service.search_todos(status="pending")
    assert len(results) == 2
    assert all(not t.completed for t in results)


def test_service_search_todos_by_status_completed(empty_store: TodoStore) -> None:
    """Test searching todos by completed status via service."""
    service = TodoService(empty_store)
    todo1 = service.add_todo("Todo 1", "")
    todo2 = service.add_todo("Todo 2", "")
    todo3 = service.add_todo("Todo 3", "")

    # Mark two as complete
    service.mark_complete(todo2.id)
    service.mark_complete(todo3.id)

    results = service.search_todos(status="completed")
    assert len(results) == 2
    assert all(t.completed for t in results)


def test_service_search_todos_keyword_and_status(empty_store: TodoStore) -> None:
    """Test searching todos by both keyword and status via service."""
    service = TodoService(empty_store)
    todo1 = service.add_todo("Buy groceries", "")
    todo2 = service.add_todo("Buy books", "")
    todo3 = service.add_todo("Clean house", "")

    # Mark one "buy" todo as complete
    service.mark_complete(todo2.id)

    results = service.search_todos(keyword="buy", status="pending")
    assert len(results) == 1
    assert results[0].title == "Buy groceries"


def test_service_search_todos_no_results(empty_store: TodoStore) -> None:
    """Test searching with no matching results via service."""
    service = TodoService(empty_store)
    service.add_todo("Buy groceries", "")

    results = service.search_todos(keyword="nonexistent")
    assert len(results) == 0
