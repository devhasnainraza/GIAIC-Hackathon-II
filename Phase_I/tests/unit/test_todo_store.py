"""Unit tests for TodoStore."""

import pytest
from todo_app.models.todo import TodoItem
from todo_app.store.todo_store import TodoStore
from todo_app.exceptions import TodoNotFoundError


def test_store_create(empty_store: TodoStore, sample_todo: TodoItem) -> None:
    """Test creating a todo in the store."""
    created = empty_store.create(sample_todo)
    assert created.id == sample_todo.id
    assert created.title == sample_todo.title
    assert len(empty_store.list()) == 1


def test_store_read(populated_store: TodoStore, sample_todo: TodoItem) -> None:
    """Test reading a todo from the store."""
    todo = populated_store.read(sample_todo.id)
    assert todo.id == sample_todo.id
    assert todo.title == sample_todo.title


def test_store_list_all(populated_store: TodoStore) -> None:
    """Test listing all todos from the store."""
    todos = populated_store.list()
    assert len(todos) == 1
    assert todos[0].title == "Test Todo"


def test_store_read_not_found(empty_store: TodoStore) -> None:
    """Test reading a non-existent todo raises TodoNotFoundError."""
    with pytest.raises(TodoNotFoundError) as exc_info:
        empty_store.read(999)
    assert exc_info.value.todo_id == 999


def test_store_list_empty(empty_store: TodoStore) -> None:
    """Test listing todos from empty store returns empty list."""
    todos = empty_store.list()
    assert len(todos) == 0
    assert todos == []


def test_store_update(populated_store: TodoStore, sample_todo: TodoItem) -> None:
    """Test updating a todo in the store."""
    updated = populated_store.update(
        sample_todo.id, title="Updated Title", description="Updated Description"
    )
    assert updated.id == sample_todo.id
    assert updated.title == "Updated Title"
    assert updated.description == "Updated Description"


def test_store_update_title_only(populated_store: TodoStore, sample_todo: TodoItem) -> None:
    """Test updating only the title of a todo."""
    original_description = sample_todo.description
    updated = populated_store.update(sample_todo.id, title="New Title")
    assert updated.title == "New Title"
    assert updated.description == original_description


def test_store_update_description_only(populated_store: TodoStore, sample_todo: TodoItem) -> None:
    """Test updating only the description of a todo."""
    original_title = sample_todo.title
    updated = populated_store.update(sample_todo.id, description="New Description")
    assert updated.title == original_title
    assert updated.description == "New Description"


def test_store_update_not_found(empty_store: TodoStore) -> None:
    """Test updating a non-existent todo raises TodoNotFoundError."""
    with pytest.raises(TodoNotFoundError) as exc_info:
        empty_store.update(999, title="New Title")
    assert exc_info.value.todo_id == 999


def test_store_delete(populated_store: TodoStore, sample_todo: TodoItem) -> None:
    """Test deleting a todo from the store."""
    deleted = populated_store.delete(sample_todo.id)
    assert deleted.id == sample_todo.id
    assert deleted.title == sample_todo.title
    assert len(populated_store.list()) == 0


def test_store_delete_not_found(empty_store: TodoStore) -> None:
    """Test deleting a non-existent todo raises TodoNotFoundError."""
    with pytest.raises(TodoNotFoundError) as exc_info:
        empty_store.delete(999)
    assert exc_info.value.todo_id == 999


def test_store_mark_complete(populated_store: TodoStore, sample_todo: TodoItem) -> None:
    """Test marking a todo as complete."""
    assert sample_todo.completed is False
    updated = populated_store.mark_complete(sample_todo.id, True)
    assert updated.completed is True


def test_store_mark_incomplete(populated_store: TodoStore, sample_todo: TodoItem) -> None:
    """Test marking a todo as incomplete."""
    # First mark it complete
    populated_store.mark_complete(sample_todo.id, True)
    # Then mark it incomplete
    updated = populated_store.mark_complete(sample_todo.id, False)
    assert updated.completed is False


def test_store_mark_complete_not_found(empty_store: TodoStore) -> None:
    """Test marking a non-existent todo raises TodoNotFoundError."""
    with pytest.raises(TodoNotFoundError) as exc_info:
        empty_store.mark_complete(999, True)
    assert exc_info.value.todo_id == 999


def test_store_search_by_keyword(empty_store: TodoStore) -> None:
    """Test searching todos by keyword."""
    from datetime import datetime

    # Create multiple todos
    todo1 = TodoItem(
        id=1, title="Buy groceries", description="Milk and eggs", created_at=datetime.now()
    )
    todo2 = TodoItem(
        id=2, title="Clean house", description="Vacuum and dust", created_at=datetime.now()
    )
    todo3 = TodoItem(
        id=3, title="Buy books", description="Python programming", created_at=datetime.now()
    )

    empty_store.create(todo1)
    empty_store.create(todo2)
    empty_store.create(todo3)

    # Search for "buy"
    results = empty_store.search(keyword="buy")
    assert len(results) == 2
    assert all("buy" in t.title.lower() for t in results)


def test_store_search_by_status_pending(empty_store: TodoStore) -> None:
    """Test searching todos by pending status."""
    from datetime import datetime

    todo1 = TodoItem(
        id=1, title="Todo 1", description="", completed=False, created_at=datetime.now()
    )
    todo2 = TodoItem(
        id=2, title="Todo 2", description="", completed=True, created_at=datetime.now()
    )
    todo3 = TodoItem(
        id=3, title="Todo 3", description="", completed=False, created_at=datetime.now()
    )

    empty_store.create(todo1)
    empty_store.create(todo2)
    empty_store.create(todo3)

    results = empty_store.search(status="pending")
    assert len(results) == 2
    assert all(not t.completed for t in results)


def test_store_search_by_status_completed(empty_store: TodoStore) -> None:
    """Test searching todos by completed status."""
    from datetime import datetime

    todo1 = TodoItem(
        id=1, title="Todo 1", description="", completed=False, created_at=datetime.now()
    )
    todo2 = TodoItem(
        id=2, title="Todo 2", description="", completed=True, created_at=datetime.now()
    )
    todo3 = TodoItem(
        id=3, title="Todo 3", description="", completed=True, created_at=datetime.now()
    )

    empty_store.create(todo1)
    empty_store.create(todo2)
    empty_store.create(todo3)

    results = empty_store.search(status="completed")
    assert len(results) == 2
    assert all(t.completed for t in results)


def test_store_search_keyword_and_status(empty_store: TodoStore) -> None:
    """Test searching todos by both keyword and status."""
    from datetime import datetime

    todo1 = TodoItem(
        id=1, title="Buy groceries", description="", completed=False, created_at=datetime.now()
    )
    todo2 = TodoItem(
        id=2, title="Buy books", description="", completed=True, created_at=datetime.now()
    )
    todo3 = TodoItem(
        id=3, title="Clean house", description="", completed=False, created_at=datetime.now()
    )

    empty_store.create(todo1)
    empty_store.create(todo2)
    empty_store.create(todo3)

    results = empty_store.search(keyword="buy", status="pending")
    assert len(results) == 1
    assert results[0].title == "Buy groceries"


def test_store_search_no_results(empty_store: TodoStore) -> None:
    """Test searching with no matching results."""
    from datetime import datetime

    todo1 = TodoItem(id=1, title="Buy groceries", description="", created_at=datetime.now())
    empty_store.create(todo1)

    results = empty_store.search(keyword="nonexistent")
    assert len(results) == 0
