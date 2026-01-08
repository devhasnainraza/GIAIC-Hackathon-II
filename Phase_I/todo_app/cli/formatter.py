"""Output formatting for CLI display."""

from typing import List
from todo_app.models.todo import TodoItem


class TodoFormatter:
    """Formatter for displaying todos in the CLI."""

    @staticmethod
    def format_todo_list(todos: List[TodoItem]) -> str:
        """
        Format a list of todos for display.

        Args:
            todos: List of TodoItem objects to format

        Returns:
            Formatted string representation of the todo list
        """
        if not todos:
            return "\nNo todos found. Add your first todo to get started!\n"

        # Count pending and completed
        pending_count = sum(1 for t in todos if not t.completed)
        completed_count = sum(1 for t in todos if t.completed)

        output = [
            f"\n=== All Todos ===\n",
            f"Total: {len(todos)} todos ({pending_count} pending, {completed_count} completed)\n",
            "",
            "+----+-------------------------+--------------------------+----------+",
            "| ID | Title                   | Description              | Status   |",
            "+----+-------------------------+--------------------------+----------+",
        ]

        for todo in todos:
            title = todo.title[:23] + ".." if len(todo.title) > 25 else todo.title
            desc = todo.description[:23] + ".." if len(todo.description) > 25 else todo.description
            status = "[X] Done" if todo.completed else "Pending"

            output.append(f"| {todo.id:<2} | {title:<23} | {desc:<24} | {status:<8} |")

        output.append("+----+-------------------------+--------------------------+----------+")
        return "\n".join(output)

    @staticmethod
    def format_single_todo(todo: TodoItem) -> str:
        """
        Format a single todo for display.

        Args:
            todo: TodoItem to format

        Returns:
            Formatted string representation of the todo
        """
        status = "[X] Done" if todo.completed else "Pending"
        return f"""
  ID: {todo.id}
  Title: {todo.title}
  Description: {todo.description}
  Status: {status}
"""

    @staticmethod
    def format_success(message: str) -> str:
        """Format a success message."""
        return f"\n[SUCCESS] {message}\n"

    @staticmethod
    def format_error(message: str) -> str:
        """Format an error message."""
        return f"\n[ERROR] {message}\n"

    @staticmethod
    def format_warning(message: str) -> str:
        """Format a warning message."""
        return f"\n[WARNING] {message}\n"
