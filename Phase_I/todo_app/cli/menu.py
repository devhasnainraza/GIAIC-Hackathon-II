"""CLI menu and input handling."""

from typing import Optional
from todo_app.services.todo_service import TodoService
from todo_app.cli.formatter import TodoFormatter
from todo_app.exceptions import TodoNotFoundError, EmptyTitleError
from todo_app.logging_config import get_logger

logger = get_logger(__name__)


class TodoMenu:
    """CLI menu for todo application."""

    def __init__(self, service: TodoService) -> None:
        """
        Initialize the menu with a todo service.

        Args:
            service: TodoService instance for business logic
        """
        self.service = service
        self.formatter = TodoFormatter()
        self.running = True

    def display_menu(self) -> None:
        """Display the main menu."""
        print("\n" + "=" * 60)
        print("+" + "=" * 58 + "+")
        print("|              Todo Application - Phase I                    |")
        print("|                  (In-Memory Storage)                       |")
        print("+" + "=" * 58 + "+")
        print("\nMain Menu:")
        print("  1. Add Todo")
        print("  2. View All Todos")
        print("  3. Update Todo")
        print("  4. Delete Todo")
        print("  5. Mark Todo Complete/Incomplete")
        print("  6. Search Todos")
        print("  7. Exit")
        print("\n[WARNING] All data will be lost when you exit the application")

    def get_input(self, prompt: str) -> str:
        """
        Get user input with a prompt.

        Args:
            prompt: Prompt to display

        Returns:
            User input as string
        """
        return input(f"\n{prompt}: ").strip()

    def add_todo(self) -> None:
        """Handle adding a new todo."""
        print("\n=== Add New Todo ===")

        title = self.get_input("Enter todo title (required)")
        if not title:
            print(self.formatter.format_error("Title cannot be empty"))
            return

        description = self.get_input("Enter todo description (optional, press Enter to skip)")

        try:
            todo = self.service.add_todo(title, description)
            print(self.formatter.format_success("Todo created"))
            print(self.formatter.format_single_todo(todo))
        except EmptyTitleError as e:
            print(self.formatter.format_error(str(e)))
        except Exception as e:
            logger.error(f"Error adding todo: {e}")
            print(self.formatter.format_error(f"Failed to add todo: {e}"))

    def view_todos(self) -> None:
        """Handle viewing all todos."""
        try:
            todos = self.service.list_todos()
            print(self.formatter.format_todo_list(todos))
        except Exception as e:
            logger.error(f"Error viewing todos: {e}")
            print(self.formatter.format_error(f"Failed to view todos: {e}"))

    def update_todo(self) -> None:
        """Handle updating a todo."""
        print("\n=== Update Todo ===")

        try:
            todo_id_str = self.get_input("Enter todo ID to update")
            todo_id = int(todo_id_str)

            # Show current todo
            current = self.service.get_todo(todo_id)
            print("\nCurrent todo:")
            print(self.formatter.format_single_todo(current))

            new_title = self.get_input("Enter new title (press Enter to keep current)")
            new_description = self.get_input("Enter new description (press Enter to keep current)")

            title = new_title if new_title else None
            description = new_description if new_description else None

            if title is None and description is None:
                print(self.formatter.format_warning("No changes made"))
                return

            updated = self.service.update_todo(todo_id, title, description)
            print(self.formatter.format_success("Todo updated"))
            print(self.formatter.format_single_todo(updated))

        except ValueError:
            print(self.formatter.format_error("Invalid ID. Please enter a number"))
        except TodoNotFoundError as e:
            print(self.formatter.format_error(str(e)))
        except EmptyTitleError as e:
            print(self.formatter.format_error(str(e)))
        except Exception as e:
            logger.error(f"Error updating todo: {e}")
            print(self.formatter.format_error(f"Failed to update todo: {e}"))

    def delete_todo(self) -> None:
        """Handle deleting a todo."""
        print("\n=== Delete Todo ===")

        try:
            todo_id_str = self.get_input("Enter todo ID to delete")
            todo_id = int(todo_id_str)

            # Show current todo
            current = self.service.get_todo(todo_id)
            print("\nCurrent todo:")
            print(self.formatter.format_single_todo(current))

            confirmation = self.get_input("Are you sure you want to delete this todo? (yes/no)")
            if confirmation.lower() != "yes":
                print("\nOperation cancelled.")
                return

            deleted = self.service.delete_todo(todo_id)
            print(self.formatter.format_success("Todo deleted"))
            print(f"  ID: {deleted.id}")
            print(f"  Title: {deleted.title}")

        except ValueError:
            print(self.formatter.format_error("Invalid ID. Please enter a number"))
        except TodoNotFoundError as e:
            print(self.formatter.format_error(str(e)))
        except Exception as e:
            logger.error(f"Error deleting todo: {e}")
            print(self.formatter.format_error(f"Failed to delete todo: {e}"))

    def mark_complete(self) -> None:
        """Handle marking a todo as complete or incomplete."""
        print("\n=== Mark Todo Complete/Incomplete ===")

        try:
            todo_id_str = self.get_input("Enter todo ID")
            todo_id = int(todo_id_str)

            # Show current todo
            current = self.service.get_todo(todo_id)
            print("\nCurrent todo:")
            print(self.formatter.format_single_todo(current))

            action = self.get_input("Mark as (1) Complete or (2) Incomplete")

            if action == "1":
                updated = self.service.mark_complete(todo_id)
                print(self.formatter.format_success("Todo marked as complete"))
            elif action == "2":
                updated = self.service.mark_incomplete(todo_id)
                print(self.formatter.format_success("Todo marked as incomplete"))
            else:
                print(self.formatter.format_error("Invalid choice. Please enter 1 or 2"))
                return

            print(f"  ID: {updated.id}")
            print(f"  Title: {updated.title}")
            print(f"  Status: {'[X] Done' if updated.completed else 'Pending'}")

        except ValueError:
            print(self.formatter.format_error("Invalid ID. Please enter a number"))
        except TodoNotFoundError as e:
            print(self.formatter.format_error(str(e)))
        except Exception as e:
            logger.error(f"Error marking todo: {e}")
            print(self.formatter.format_error(f"Failed to mark todo: {e}"))

    def search_todos(self) -> None:
        """Handle searching todos."""
        print("\n=== Search Todos ===")
        print("\nSearch options:")
        print("  1. Search by keyword")
        print("  2. Filter by status")
        print("  3. Back to main menu")

        choice = self.get_input("Enter your choice (1-3)")

        try:
            if choice == "1":
                keyword = self.get_input("Enter search keyword")
                results = self.service.search_todos(keyword=keyword)
                print(f"\n=== Search Results ===\n")
                print(f'Found {len(results)} todo(s) matching "{keyword}":')
                print(self.formatter.format_todo_list(results))

            elif choice == "2":
                print("\nFilter by status:")
                print("  1. Pending only")
                print("  2. Completed only")
                print("  3. All (no filter)")
                status_choice = self.get_input("Enter your choice (1-3)")

                status_map = {"1": "pending", "2": "completed", "3": None}
                status = status_map.get(status_choice)

                if status_choice not in status_map:
                    print(self.formatter.format_error("Invalid choice"))
                    return

                results = self.service.search_todos(status=status)
                status_label = status.capitalize() if status else "All"
                print(f"\n=== Filtered Todos ({status_label}) ===\n")
                print(f"Found {len(results)} todo(s):")
                print(self.formatter.format_todo_list(results))

            elif choice == "3":
                return
            else:
                print(self.formatter.format_error("Invalid choice. Please enter 1-3"))

        except Exception as e:
            logger.error(f"Error searching todos: {e}")
            print(self.formatter.format_error(f"Failed to search todos: {e}"))

    def exit_app(self) -> None:
        """Handle exiting the application."""
        print(self.formatter.format_warning("All todos will be lost when you exit!"))
        confirmation = self.get_input("Are you sure you want to exit? (yes/no)")

        if confirmation.lower() == "yes":
            print("\nThank you for using Todo Application!")
            print("All data has been cleared from memory.\n")
            print("Goodbye!\n")
            self.running = False
        else:
            print("\nExit cancelled.")

    def run(self) -> None:
        """Run the main menu loop."""
        print(
            self.formatter.format_warning("In-Memory Storage: All data will be lost when you exit!")
        )

        while self.running:
            self.display_menu()

            try:
                choice = self.get_input("Enter your choice (1-7)")

                if choice == "1":
                    self.add_todo()
                elif choice == "2":
                    self.view_todos()
                elif choice == "3":
                    self.update_todo()
                elif choice == "4":
                    self.delete_todo()
                elif choice == "5":
                    self.mark_complete()
                elif choice == "6":
                    self.search_todos()
                elif choice == "7":
                    self.exit_app()
                else:
                    print(
                        self.formatter.format_error(
                            "Invalid choice. Please enter a number between 1 and 7"
                        )
                    )

                if self.running:
                    input("\nPress Enter to continue...")

            except KeyboardInterrupt:
                print(
                    "\n"
                    + self.formatter.format_warning("Interrupt detected. Exiting application...")
                )
                print("\nThank you for using Todo Application!")
                print("All data has been cleared from memory.\n")
                print("Goodbye!\n")
                break
            except Exception as e:
                logger.error(f"Unexpected error in menu loop: {e}")
                print(self.formatter.format_error(f"An unexpected error occurred: {e}"))
                input("\nPress Enter to continue...")
