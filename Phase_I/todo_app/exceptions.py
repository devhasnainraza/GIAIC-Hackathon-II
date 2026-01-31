"""Custom exceptions for Todo App."""


class TodoNotFoundError(Exception):
    """Raised when a todo item is not found."""

    def __init__(self, todo_id: int) -> None:
        self.todo_id = todo_id
        super().__init__(f"Todo with ID {todo_id} not found")


class InvalidTodoError(Exception):
    """Raised when a todo item has invalid data."""

    def __init__(self, message: str) -> None:
        super().__init__(message)


class EmptyTitleError(InvalidTodoError):
    """Raised when a todo title is empty or whitespace only."""

    def __init__(self) -> None:
        super().__init__("Title cannot be empty or whitespace only")
