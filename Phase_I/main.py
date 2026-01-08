"""Main entry point for Todo Application."""

from todo_app.store.todo_store import TodoStore
from todo_app.services.todo_service import TodoService
from todo_app.cli.menu import TodoMenu
from todo_app.logging_config import setup_logging


def main() -> None:
    """Main function to run the Todo Application."""
    # Setup logging
    setup_logging()

    # Initialize components
    store = TodoStore()
    service = TodoService(store)
    menu = TodoMenu(service)

    # Run the application
    menu.run()


if __name__ == "__main__":
    main()
