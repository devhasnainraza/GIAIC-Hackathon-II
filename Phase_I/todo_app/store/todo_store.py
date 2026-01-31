"""In-memory storage for todo items."""

from typing import Dict, List, Optional
from todo_app.models.todo import TodoItem
from todo_app.exceptions import TodoNotFoundError


class TodoStore:
    """
    In-memory storage for todo items using a dictionary.

    Attributes:
        _todos: Dictionary mapping todo IDs to TodoItem objects
        _next_id: Counter for generating unique IDs
    """

    def __init__(self) -> None:
        """Initialize an empty todo store."""
        self._todos: Dict[int, TodoItem] = {}
        self._next_id: int = 1

    def create(self, todo: TodoItem) -> TodoItem:
        """
        Create a new todo in the store.

        Args:
            todo: TodoItem to create

        Returns:
            The created TodoItem
        """
        self._todos[todo.id] = todo
        if todo.id >= self._next_id:
            self._next_id = todo.id + 1
        return todo

    def read(self, todo_id: int) -> TodoItem:
        """
        Read a todo from the store by ID.

        Args:
            todo_id: ID of the todo to read

        Returns:
            The TodoItem with the given ID

        Raises:
            TodoNotFoundError: If todo with given ID does not exist
        """
        if todo_id not in self._todos:
            raise TodoNotFoundError(todo_id)
        return self._todos[todo_id]

    def list(self) -> List[TodoItem]:
        """
        List all todos in the store.

        Returns:
            List of all TodoItem objects, sorted by ID
        """
        return sorted(self._todos.values(), key=lambda t: t.id)

    def update(
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
        """
        todo = self.read(todo_id)
        if title is not None:
            todo.title = title
        if description is not None:
            todo.description = description
        return todo

    def delete(self, todo_id: int) -> TodoItem:
        """
        Delete a todo from the store.

        Args:
            todo_id: ID of the todo to delete

        Returns:
            The deleted TodoItem

        Raises:
            TodoNotFoundError: If todo with given ID does not exist
        """
        todo = self.read(todo_id)
        del self._todos[todo_id]
        return todo

    def mark_complete(self, todo_id: int, completed: bool = True) -> TodoItem:
        """
        Mark a todo as complete or incomplete.

        Args:
            todo_id: ID of the todo to mark
            completed: True to mark complete, False to mark incomplete

        Returns:
            The updated TodoItem

        Raises:
            TodoNotFoundError: If todo with given ID does not exist
        """
        todo = self.read(todo_id)
        todo.completed = completed
        return todo

    def search(self, keyword: str = "", status: Optional[str] = None) -> List[TodoItem]:
        """
        Search todos by keyword and/or status.

        Args:
            keyword: Keyword to search in title and description (case-insensitive)
            status: Filter by status ("pending", "completed", or None for all)

        Returns:
            List of matching TodoItem objects
        """
        results = self.list()

        if keyword:
            keyword_lower = keyword.lower()
            results = [
                t
                for t in results
                if keyword_lower in t.title.lower() or keyword_lower in t.description.lower()
            ]

        if status == "pending":
            results = [t for t in results if not t.completed]
        elif status == "completed":
            results = [t for t in results if t.completed]

        return results

    def get_next_id(self) -> int:
        """
        Get the next available ID for a new todo.

        Returns:
            The next available ID
        """
        next_id = self._next_id
        self._next_id += 1
        return next_id
