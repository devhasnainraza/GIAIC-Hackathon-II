# CLI Interface Contract: Phase I - In-Memory Console Todo Application

**Feature**: 001-console-todo
**Date**: 2026-01-08
**Purpose**: Define the command-line interface specifications and user interaction flows

## Overview

The CLI provides a menu-driven interface for managing todos. Users interact through numbered menu options, with clear prompts for input and feedback for all operations.

## Main Menu

### Display Format

```
╔════════════════════════════════════════════════════════════╗
║              Todo Application - Phase I                    ║
║                  (In-Memory Storage)                       ║
╚════════════════════════════════════════════════════════════╝

Main Menu:
  1. Add Todo
  2. View All Todos
  3. Update Todo
  4. Delete Todo
  5. Mark Todo Complete/Incomplete
  6. Search Todos
  7. Exit

⚠️  Warning: All data will be lost when you exit the application

Enter your choice (1-7): _
```

### Menu Behavior

- Display menu after every operation completes
- Validate input (must be 1-7)
- Show error message for invalid input and re-display menu
- Clear screen before showing menu (optional, for better UX)
- Display warning about in-memory storage on startup and in menu

## Operation 1: Add Todo

### User Flow

```
Enter your choice (1-7): 1

=== Add New Todo ===

Enter todo title (required): Buy groceries
Enter todo description (optional, press Enter to skip): Milk, eggs, bread

✓ Success! Todo created with ID: 1
  Title: Buy groceries
  Description: Milk, eggs, bread
  Status: Pending

Press Enter to continue...
```

### Input Specifications

| Field | Required | Validation | Error Message |
|-------|----------|------------|---------------|
| Title | Yes | 1-500 chars, non-empty | "Error: Title cannot be empty" |
| Description | No | 0-2000 chars | "Error: Description too long (max 2000 characters)" |

### Success Response

```
✓ Success! Todo created with ID: {id}
  Title: {title}
  Description: {description}
  Status: Pending
```

### Error Responses

```
✗ Error: Title cannot be empty
Please try again.

✗ Error: Description too long (max 2000 characters)
Please try again.
```

## Operation 2: View All Todos

### User Flow

```
Enter your choice (1-7): 2

=== All Todos ===

Total: 3 todos (2 pending, 1 completed)

┌────┬─────────────────────────┬──────────────────────────┬──────────┐
│ ID │ Title                   │ Description              │ Status   │
├────┼─────────────────────────┼──────────────────────────┼──────────┤
│ 1  │ Buy groceries           │ Milk, eggs, bread        │ Pending  │
│ 2  │ Call dentist            │                          │ ✓ Done   │
│ 3  │ Finish project report   │ Due Friday               │ Pending  │
└────┴─────────────────────────┴──────────────────────────┴──────────┘

Press Enter to continue...
```

### Display Specifications

- Show total count and status breakdown
- Display todos in table format
- Show ID, title (truncated if > 25 chars), description (truncated if > 25 chars), status
- Use visual indicator for completed todos (✓ Done)
- Sort by ID (ascending)

### Empty State

```
=== All Todos ===

No todos found. Add your first todo to get started!

Press Enter to continue...
```

## Operation 3: Update Todo

### User Flow

```
Enter your choice (1-7): 3

=== Update Todo ===

Enter todo ID to update: 1

Current todo:
  ID: 1
  Title: Buy groceries
  Description: Milk, eggs, bread
  Status: Pending

Enter new title (press Enter to keep current): Buy groceries and supplies
Enter new description (press Enter to keep current): Milk, eggs, bread, butter

✓ Success! Todo updated
  ID: 1
  Title: Buy groceries and supplies
  Description: Milk, eggs, bread, butter
  Status: Pending

Press Enter to continue...
```

### Input Specifications

| Field | Required | Validation | Behavior |
|-------|----------|------------|----------|
| ID | Yes | Must exist | Show error if not found |
| New Title | No | 1-500 chars if provided | Keep current if empty |
| New Description | No | 0-2000 chars | Keep current if empty |

### Success Response

```
✓ Success! Todo updated
  ID: {id}
  Title: {new_title}
  Description: {new_description}
  Status: {status}
```

### Error Responses

```
✗ Error: Todo with ID {id} not found
Please try again with a valid ID.

✗ Error: New title cannot be empty
Please try again.
```

## Operation 4: Delete Todo

### User Flow

```
Enter your choice (1-7): 4

=== Delete Todo ===

Enter todo ID to delete: 2

Current todo:
  ID: 2
  Title: Call dentist
  Description:
  Status: Done

⚠️  Are you sure you want to delete this todo? (yes/no): yes

✓ Success! Todo deleted
  ID: 2
  Title: Call dentist

Press Enter to continue...
```

### Input Specifications

| Field | Required | Validation | Behavior |
|-------|----------|------------|----------|
| ID | Yes | Must exist | Show error if not found |
| Confirmation | Yes | "yes" or "no" | Case-insensitive, cancel if "no" |

### Success Response

```
✓ Success! Todo deleted
  ID: {id}
  Title: {title}
```

### Error Responses

```
✗ Error: Todo with ID {id} not found
Please try again with a valid ID.

Operation cancelled.
```

## Operation 5: Mark Todo Complete/Incomplete

### User Flow

```
Enter your choice (1-7): 5

=== Mark Todo Complete/Incomplete ===

Enter todo ID: 1

Current todo:
  ID: 1
  Title: Buy groceries
  Description: Milk, eggs, bread
  Status: Pending

Mark as (1) Complete or (2) Incomplete: 1

✓ Success! Todo marked as complete
  ID: 1
  Title: Buy groceries
  Status: ✓ Done

Press Enter to continue...
```

### Input Specifications

| Field | Required | Validation | Behavior |
|-------|----------|------------|----------|
| ID | Yes | Must exist | Show error if not found |
| Action | Yes | 1 or 2 | 1 = Complete, 2 = Incomplete |

### Success Response

```
✓ Success! Todo marked as {complete/incomplete}
  ID: {id}
  Title: {title}
  Status: {new_status}
```

### Error Responses

```
✗ Error: Todo with ID {id} not found
Please try again with a valid ID.

✗ Error: Invalid choice. Please enter 1 or 2.
```

## Operation 6: Search Todos

### User Flow

```
Enter your choice (1-7): 6

=== Search Todos ===

Search options:
  1. Search by keyword
  2. Filter by status
  3. Back to main menu

Enter your choice (1-3): 1

Enter search keyword: grocery

=== Search Results ===

Found 1 todo(s) matching "grocery":

┌────┬─────────────────────────┬──────────────────────────┬──────────┐
│ ID │ Title                   │ Description              │ Status   │
├────┼─────────────────────────┼──────────────────────────┼──────────┤
│ 1  │ Buy groceries           │ Milk, eggs, bread        │ ✓ Done   │
└────┴─────────────────────────┴──────────────────────────┴──────────┘

Press Enter to continue...
```

### Search by Keyword

- Case-insensitive substring matching
- Search in both title and description
- Display results in same format as "View All Todos"
- Show count of matching todos

### Filter by Status

```
Enter your choice (1-3): 2

Filter by status:
  1. Pending only
  2. Completed only
  3. All (no filter)

Enter your choice (1-3): 1

=== Filtered Todos (Pending) ===

Found 2 pending todo(s):

┌────┬─────────────────────────┬──────────────────────────┬──────────┐
│ ID │ Title                   │ Description              │ Status   │
├────┼─────────────────────────┼──────────────────────────┼──────────┤
│ 3  │ Finish project report   │ Due Friday               │ Pending  │
│ 4  │ Review pull requests    │                          │ Pending  │
└────┴─────────────────────────┴──────────────────────────┴──────────┘

Press Enter to continue...
```

### Empty Search Results

```
=== Search Results ===

No todos found matching "xyz"

Press Enter to continue...
```

## Operation 7: Exit

### User Flow

```
Enter your choice (1-7): 7

⚠️  Warning: All todos will be lost when you exit!

Are you sure you want to exit? (yes/no): yes

Thank you for using Todo Application!
All data has been cleared from memory.

Goodbye!
```

### Exit Confirmation

- Require explicit confirmation ("yes" or "no")
- Case-insensitive
- Cancel exit if "no"
- Display warning about data loss

## Error Handling

### Invalid Menu Choice

```
Enter your choice (1-7): 9

✗ Error: Invalid choice. Please enter a number between 1 and 7.

Press Enter to continue...
```

### Non-Numeric Input

```
Enter your choice (1-7): abc

✗ Error: Invalid input. Please enter a number between 1 and 7.

Press Enter to continue...
```

### Keyboard Interrupt (Ctrl+C)

```
^C
⚠️  Interrupt detected. Exiting application...

Thank you for using Todo Application!
All data has been cleared from memory.

Goodbye!
```

## Input Validation Rules

| Input Type | Validation | Error Handling |
|------------|------------|----------------|
| Menu choice | Integer 1-7 | Show error, re-prompt |
| Todo ID | Positive integer, must exist | Show error, re-prompt |
| Title | 1-500 chars, non-empty | Show error, re-prompt |
| Description | 0-2000 chars | Show error, re-prompt |
| Confirmation | "yes" or "no" (case-insensitive) | Show error, re-prompt |
| Search keyword | Any string | Accept empty (show all) |

## Output Formatting Standards

### Success Messages
- Prefix: `✓ Success!`
- Color: Green (if terminal supports)
- Format: Clear, concise confirmation

### Error Messages
- Prefix: `✗ Error:`
- Color: Red (if terminal supports)
- Format: Specific error description + guidance

### Warning Messages
- Prefix: `⚠️  Warning:`
- Color: Yellow (if terminal supports)
- Format: Clear warning + consequences

### Information Messages
- No special prefix
- Color: Default
- Format: Clear, structured information

## Accessibility Considerations

- Use ASCII art for borders (compatible with all terminals)
- Provide text-based status indicators (not just colors)
- Clear, descriptive prompts
- Consistent formatting throughout
- Support for screen readers (plain text output)

## Performance Requirements

- Menu display: < 100ms
- Todo list display: < 500ms for 100 todos
- Search results: < 1 second for 50+ todos
- All operations: Immediate feedback (< 100ms)

## Testing Requirements

### Integration Tests

1. **Menu Navigation**: Test all menu options
2. **Add Todo Flow**: Complete add operation with valid/invalid inputs
3. **View Todos Flow**: Display empty state and populated list
4. **Update Todo Flow**: Update with valid/invalid inputs
5. **Delete Todo Flow**: Delete with confirmation
6. **Mark Complete Flow**: Toggle completion status
7. **Search Flow**: Keyword search and status filter
8. **Exit Flow**: Exit with confirmation
9. **Error Handling**: Invalid inputs, non-existent IDs
10. **Edge Cases**: Empty strings, max length strings, special characters

## Summary

The CLI interface provides a user-friendly, menu-driven experience for managing todos. All operations include clear prompts, validation, and feedback. The interface emphasizes simplicity and clarity, with consistent formatting and comprehensive error handling.
