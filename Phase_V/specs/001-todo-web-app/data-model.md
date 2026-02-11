# Data Model: Todo Full-Stack Web Application

**Date**: 2026-01-09
**Feature**: 001-todo-web-app
**Purpose**: Define database schema, relationships, and validation rules

## Overview

This document defines the data model for a multi-user todo application with strict user isolation. The schema consists of two primary entities: User and Task, with a one-to-many relationship enforcing ownership.

## Entity Definitions

### User Entity

**Purpose**: Represents a registered user of the system with authentication credentials.

**Table Name**: `users`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| email | String(255) | UNIQUE, NOT NULL, INDEX | User's email address (login identifier) |
| hashed_password | String(255) | NOT NULL | Bcrypt-hashed password (never store plain text) |
| created_at | Timestamp | NOT NULL, DEFAULT NOW() | Account creation timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email` (for login lookups and duplicate prevention)

**Validation Rules**:
- Email must match RFC 5322 format (validated by Pydantic EmailStr)
- Password minimum 8 characters (enforced at application layer)
- Email uniqueness enforced at database level

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
from pydantic import EmailStr

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: List["Task"] = Relationship(back_populates="owner", cascade_delete=True)
```

**Business Rules**:
- Users cannot be deleted if they have tasks (enforce at application layer or use CASCADE)
- Email addresses are case-insensitive (normalize to lowercase before storage)
- Passwords must be hashed using bcrypt with cost factor 12

---

### Task Entity

**Purpose**: Represents a todo item owned by a specific user.

**Table Name**: `tasks`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | PRIMARY KEY, AUTO_INCREMENT | Unique task identifier |
| user_id | Integer | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner of the task |
| title | String(200) | NOT NULL | Task title (required) |
| description | Text | NULLABLE | Optional task description |
| is_complete | Boolean | NOT NULL, DEFAULT FALSE | Completion status |
| created_at | Timestamp | NOT NULL, DEFAULT NOW() | Task creation timestamp |
| updated_at | Timestamp | NOT NULL, DEFAULT NOW() | Last modification timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `user_id` (for efficient user-specific queries)
- COMPOSITE INDEX on `(user_id, created_at)` (for sorted task lists)

**Foreign Keys**:
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**Validation Rules**:
- Title: 1-200 characters (enforced at application and database level)
- Description: 0-2000 characters (enforced at application level)
- is_complete: Boolean only (true/false)
- user_id must reference existing user

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_complete: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    owner: User = Relationship(back_populates="tasks")
```

**Business Rules**:
- Tasks are always owned by exactly one user (user_id required)
- Tasks cannot be transferred between users
- Deleting a user cascades to delete all their tasks
- Empty titles are not allowed (minimum 1 character)
- Completion status can be toggled freely

---

## Relationships

### User → Tasks (One-to-Many)

**Relationship Type**: One User has Many Tasks

**Cardinality**: 1:N (one-to-many)

**Foreign Key**: `tasks.user_id` → `users.id`

**Cascade Behavior**: ON DELETE CASCADE (deleting user deletes all their tasks)

**Diagram**:
```
┌─────────────┐         ┌─────────────┐
│    User     │         │    Task     │
├─────────────┤         ├─────────────┤
│ id (PK)     │────────<│ id (PK)     │
│ email       │    1:N  │ user_id (FK)│
│ hashed_pwd  │         │ title       │
│ created_at  │         │ description │
└─────────────┘         │ is_complete │
                        │ created_at  │
                        │ updated_at  │
                        └─────────────┘
```

**Query Patterns**:
```python
# Get all tasks for a user
user = session.get(User, user_id)
tasks = user.tasks  # Via relationship

# Or via query
tasks = session.exec(
    select(Task).where(Task.user_id == user_id)
).all()

# Get task owner
task = session.get(Task, task_id)
owner = task.owner  # Via relationship
```

---

## User Isolation Enforcement

### Database Level
- Foreign key constraint ensures every task has a valid user_id
- Index on user_id enables efficient filtering
- Cascade delete prevents orphaned tasks

### Application Level
- All task queries MUST filter by user_id
- Service layer enforces user_id in WHERE clauses
- Endpoints verify task ownership before operations

### Query Pattern (REQUIRED)
```python
# ✅ CORRECT: Always filter by user_id
statement = select(Task).where(
    Task.id == task_id,
    Task.user_id == current_user.id  # User isolation
)

# ❌ INCORRECT: Missing user_id filter (data leakage risk)
statement = select(Task).where(Task.id == task_id)
```

---

## Database Migrations

### Initial Migration (Alembic)

**Migration Name**: `001_create_users_and_tasks_tables`

**Up Migration**:
```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at);
```

**Down Migration**:
```sql
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;
```

**Alembic Command**:
```bash
# Generate migration
alembic revision --autogenerate -m "Create users and tasks tables"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## Validation Rules Summary

### User Validation
- ✅ Email format: RFC 5322 compliant
- ✅ Email uniqueness: Database constraint + application check
- ✅ Password strength: Minimum 8 characters, hashed with bcrypt
- ✅ Email case-insensitive: Normalize to lowercase

### Task Validation
- ✅ Title required: 1-200 characters
- ✅ Description optional: 0-2000 characters
- ✅ User ownership: user_id must reference existing user
- ✅ Completion status: Boolean only
- ✅ Timestamps: Auto-generated, immutable (created_at), auto-updated (updated_at)

---

## Performance Considerations

### Indexes
- `users.email`: Unique index for fast login lookups
- `tasks.user_id`: Index for user-specific task queries
- `tasks(user_id, created_at)`: Composite index for sorted task lists

### Query Optimization
- Use `select()` with explicit WHERE clauses (avoid loading all tasks)
- Leverage relationship loading for user → tasks navigation
- Connection pooling configured (pool_size=5, max_overflow=10)

### Scalability
- Expected load: 100 concurrent users, 1000 tasks per user
- Database: Neon Serverless PostgreSQL (auto-scaling)
- Query performance: <100ms for task list retrieval

---

## Security Considerations

### Data Protection
- Passwords never stored in plain text (bcrypt hashing)
- User isolation enforced at query level
- Foreign key constraints prevent orphaned data

### Access Control
- All task operations require authenticated user
- User ID extracted from verified JWT token
- Resource ownership validated before operations

### Audit Trail
- `created_at` timestamp for all entities
- `updated_at` timestamp for tasks (tracks modifications)
- Consider adding `deleted_at` for soft deletes (future enhancement)

---

## Future Enhancements (Out of Scope)

The following enhancements are explicitly out of scope for initial release but documented for future consideration:

- Task categories/tags (many-to-many relationship)
- Task priorities (enum field)
- Due dates (timestamp field)
- Task sharing (join table: task_shares)
- Task history/audit log (separate audit table)
- Soft deletes (deleted_at timestamp)
- Full-text search on title/description (PostgreSQL FTS)

---

## Conclusion

Data model defined with two entities (User, Task) and one-to-many relationship. User isolation enforced through foreign keys, indexes, and application-level query filtering. Schema supports all functional requirements (FR-001 to FR-018) and enables efficient queries for expected scale (100 users, 1000 tasks per user).

**Next Steps**: Define API contracts (OpenAPI specification) based on this data model.
