"""Business logic services for todo operations."""

from typing import List, Optional
from datetime import datetime
from todo_app.models.todo import TodoItem
from todo_app.store.todo_store import TodoStore
from todo_app.exceptions import EmptyTitleError, TodoNotFoundError
from todo_app.logging_config import get_logger

logger = get_logger(__name__)


class TodoService:
    """
    Service layer for todo operations.

    Provides business logic and validation for todo CRUD operations.
    """

    def __init__(self, store: TodoStore) -> None:
        """
        Initialize the service with a todo store.

        Args:
            store: TodoStore instance for data persistence
        """
        self.store = store

    def add_todo(self, title: str, description: str = "") -> TodoItem:
        """
        Add a new todo item.

        Args:
            title: Todo title (required, non-empty)
            description: Optional todo description

        Returns:
            The created TodoItem

        Raises:
            EmptyTitleError: If title is empty or whitespace only
        """
        if not title.strip():
            logger.error("Attempted to add todo with empty title")
            raise EmptyTitleError()

        todo_id = self.store.get_next_id()
        todo = TodoItem(
            id=todo_id, title=title.strip(), description=description, created_at=datetime.now()
        )
        created = self.store.create(todo)
        logger.info(f"Created todo: ID={created.id}, title='{created.title}'")
        return created

    def get_todo(self, todo_id: int) -> TodoItem:
        """
        Get a single todo by ID.

        Args:
            todo_id: ID of the todo to retrieve

        Returns:
            The TodoItem with the given ID

        Raises:
            TodoNotFoundError: If todo with given ID does not exist
        """
        todo = self.store.read(todo_id)
        logger.info(f"Retrieved todo: ID={todo.id}, title='{todo.title}'")
        return todo

    def list_todos(self) -> List[TodoItem]:
        """
        List all todos.

        Returns:
            List of all TodoItem objects
        """
        todos = self.store.list()
        logger.info(f"Listed {len(todos)} todos")
        return todos

    def update_todo(
        self, todo_id: int, title: Optional[str] = None, description: Optional[str] = None
    ) -> TodoItem:
        """
        Update a todo's title and/or description.

        Args:
            todo_id: ID of the todo to update
            title: New title (None to keep current)
            description: New description (None to keep current)

        Returns:
            The updated TodoItem

        Raises:
            TodoNotFoundError: If todo with given ID does not exist
            EmptyTitleError: If new title is empty or whitespace only
        """
        if title is not None and not title.strip():
            logger.error(f"Attempted to update todo {todo_id} with empty title")
            raise EmptyTitleError()

        updated = self.store.update(todo_id, title, description)
        logger.info(f"Updated todo: ID={updated.id}, title='{updated.title}'")
        return updated

    def delete_todo(self, todo_id: int) -> TodoItem:
        """
        Delete a todo.

        Args:
            todo_id: ID of the todo to delete

        Returns:
            The deleted TodoItem

        Raises:
            TodoNotFoundError: If todo with given ID does not exist
        """
        deleted = self.store.delete(todo_id)
        logger.info(f"Deleted todo: ID={deleted.id}, title='{deleted.title}'")
        return deleted

    def mark_complete(self, todo_id: int) -> TodoItem:
        """
        Mark a todo as complete.

        Args:
            todo_id: ID of the todo to mark complete

        Returns:
            The updated TodoItem

        Raises:
            TodoNotFoundError: If todo with given ID does not exist
        """
        updated = self.store.mark_complete(todo_id, True)
        logger.info(f"Marked todo {todo_id} as complete")
        return updated

    def mark_incomplete(self, todo_id: int) -> TodoItem:
        """
        Mark a todo as incomplete.

        Args:
            todo_id: ID of the todo to mark incomplete

        Returns:
            The updated TodoItem

        Raises:
            TodoNotFoundError: If todo with given ID does not exist
        """
        updated = self.store.mark_complete(todo_id, False)
        logger.info(f"Marked todo {todo_id} as incomplete")
        return updated

    def search_todos(self, keyword: str = "", status: Optional[str] = None) -> List[TodoItem]:
        """
        Search todos by keyword and/or status.

        Args:
            keyword: Keyword to search in title and description
            status: Filter by status ("pending", "completed", or None)

        Returns:
            List of matching TodoItem objects
        """
        results = self.store.search(keyword, status)
        logger.info(
            f"Search returned {len(results)} results (keyword='{keyword}', status={status})"
        )
        return results
