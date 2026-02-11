# Data Model Documentation

**Feature**: Authentication & Security Integration
**Branch**: `002-auth-security-integration`
**Created**: 2026-01-09
**Purpose**: Document database entities and relationships

---

## Overview

The Todo Full-Stack Web Application uses two primary entities: **User** and **Task**. These entities are implemented using SQLModel (combining SQLAlchemy and Pydantic) and stored in a Neon Serverless PostgreSQL database.

**Key Design Principles**:
- User data isolation enforced through foreign key relationships
- Cascade delete ensures data consistency
- Indexes on frequently queried fields for performance
- Validation rules enforced at model level

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────┐
│             User                     │
├─────────────────────────────────────┤
│ PK  id: int                         │
│ UQ  email: EmailStr                 │
│     hashed_password: str            │
│     created_at: datetime            │
└─────────────────┬───────────────────┘
                  │
                  │ 1:N (one-to-many)
                  │ CASCADE DELETE
                  │
┌─────────────────▼───────────────────┐
│             Task                     │
├─────────────────────────────────────┤
│ PK  id: int                         │
│ FK  user_id: int → users.id         │
│     title: str                      │
│     description: str (optional)     │
│     is_complete: bool               │
│     created_at: datetime            │
│     updated_at: datetime            │
└─────────────────────────────────────┘
```

**Relationship**: One User can have many Tasks (1:N)
**Cascade**: Deleting a User automatically deletes all their Tasks
**Isolation**: Tasks are always filtered by user_id to enforce data isolation

---

## User Entity

**Table Name**: `users`
**Location**: `backend/src/models/user.py`

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `int` | PRIMARY KEY, AUTO INCREMENT | Unique user identifier |
| `email` | `EmailStr` | UNIQUE, NOT NULL, INDEX, MAX 255 | User's email address (login credential) |
| `hashed_password` | `str` | NOT NULL, MAX 255 | Bcrypt-hashed password (never plaintext) |
| `created_at` | `datetime` | NOT NULL, DEFAULT NOW | Account creation timestamp |

### Constraints

**Primary Key**: `id`
- Auto-generated integer
- Unique identifier for each user
- Used in foreign key relationships

**Unique Constraint**: `email`
- Ensures no duplicate email addresses
- Enforces one account per email
- Used for login authentication

**Index**: `email`
- Indexed for fast lookup during login
- Improves authentication query performance

### Validation Rules

1. **Email Format**: Must be valid email address (validated by Pydantic EmailStr)
2. **Email Length**: Maximum 255 characters
3. **Password**: Must be hashed before storage (never store plaintext)
4. **Created At**: Automatically set to current UTC time on creation

### Relationships

**tasks**: One-to-Many relationship with Task entity
- A user can have zero or more tasks
- Relationship name: `tasks` (list of Task objects)
- Back-populates: `owner` in Task entity
- Cascade delete: Deleting user deletes all their tasks

### Security Considerations

1. **Password Storage**: Only hashed passwords stored (bcrypt with cost factor 12)
2. **Email Uniqueness**: Prevents duplicate accounts
3. **No Sensitive Data**: No additional PII stored beyond email
4. **Cascade Delete**: Ensures no orphaned tasks when user deleted

### Example

```python
user = User(
    email="user@example.com",
    hashed_password="$2b$12$...",  # Bcrypt hash
    created_at=datetime.utcnow()
)
```

---

## Task Entity

**Table Name**: `tasks`
**Location**: `backend/src/models/task.py`

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `int` | PRIMARY KEY, AUTO INCREMENT | Unique task identifier |
| `user_id` | `int` | FOREIGN KEY → users.id, NOT NULL, INDEX | Owner user ID (enforces ownership) |
| `title` | `str` | NOT NULL, MIN 1, MAX 200 | Task title (required) |
| `description` | `str` | OPTIONAL, MAX 2000 | Task description (optional) |
| `is_complete` | `bool` | NOT NULL, DEFAULT FALSE | Completion status |
| `created_at` | `datetime` | NOT NULL, DEFAULT NOW | Task creation timestamp |
| `updated_at` | `datetime` | NOT NULL, DEFAULT NOW | Last modification timestamp |

### Constraints

**Primary Key**: `id`
- Auto-generated integer
- Unique identifier for each task

**Foreign Key**: `user_id` → `users.id`
- References User entity
- Enforces referential integrity
- Prevents orphaned tasks
- Indexed for query performance

**Index**: `user_id`
- Indexed for fast filtering by owner
- Critical for user isolation queries
- Improves list/filter performance

### Validation Rules

1. **Title**: Required, minimum 1 character, maximum 200 characters
2. **Description**: Optional, maximum 2000 characters if provided
3. **User ID**: Must reference existing user (foreign key constraint)
4. **Completion Status**: Boolean, defaults to false (incomplete)
5. **Timestamps**: Automatically managed (created_at on creation, updated_at on modification)

### Relationships

**owner**: Many-to-One relationship with User entity
- Each task belongs to exactly one user
- Relationship name: `owner` (User object)
- Back-populates: `tasks` in User entity
- Foreign key: `user_id` references `users.id`

### User Isolation Enforcement

**Query Pattern**: All task queries MUST filter by user_id
```python
# Correct: Filter by authenticated user
tasks = session.exec(
    select(Task).where(Task.user_id == authenticated_user.id)
).all()

# Incorrect: No user filter (returns all users' tasks)
tasks = session.exec(select(Task)).all()  # ❌ SECURITY VIOLATION
```

**Ownership Verification**: Dual-condition queries prevent cross-user access
```python
# Verify task belongs to user
task = session.exec(
    select(Task).where(Task.id == task_id, Task.user_id == user_id)
).first()
```

### Security Considerations

1. **User Isolation**: Foreign key + query filtering enforces data isolation
2. **Ownership Verification**: All operations verify task belongs to authenticated user
3. **No Direct Access**: Task ID alone insufficient - must also match user_id
4. **Cascade Delete**: Tasks deleted when owner user deleted (data consistency)

### Example

```python
task = Task(
    user_id=123,
    title="Complete project documentation",
    description="Write comprehensive docs for authentication system",
    is_complete=False,
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow()
)
```

---

## Database Schema

### SQL Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

### Indexes

**Performance Indexes**:
1. `idx_users_email` - Fast email lookup during authentication
2. `idx_tasks_user_id` - Fast task filtering by owner

**Index Strategy**:
- Index on foreign keys for join performance
- Index on unique constraints for fast lookups
- Index on frequently filtered columns (user_id)

### Constraints

**Foreign Key Constraints**:
- `tasks.user_id` → `users.id` (ON DELETE CASCADE)
- Ensures referential integrity
- Prevents orphaned tasks
- Automatic cleanup on user deletion

**Unique Constraints**:
- `users.email` - One account per email address

**Check Constraints** (enforced by SQLModel):
- `tasks.title` - Minimum 1 character, maximum 200
- `tasks.description` - Maximum 2000 characters if provided

---

## Data Access Patterns

### User Operations

**Create User** (Registration):
```python
user = User(email=email, hashed_password=hash_password(password))
session.add(user)
session.commit()
```

**Find User by Email** (Login):
```python
user = session.exec(
    select(User).where(User.email == email)
).first()
```

**Find User by ID** (Token Verification):
```python
user = session.exec(
    select(User).where(User.id == user_id)
).first()
```

### Task Operations

**List User's Tasks**:
```python
tasks = session.exec(
    select(Task)
    .where(Task.user_id == user_id)
    .order_by(Task.created_at.desc())
).all()
```

**Get Single Task** (with ownership verification):
```python
task = session.exec(
    select(Task)
    .where(Task.id == task_id, Task.user_id == user_id)
).first()
```

**Create Task**:
```python
task = Task(user_id=user_id, title=title, description=description)
session.add(task)
session.commit()
```

**Update Task** (with ownership verification):
```python
task = session.exec(
    select(Task)
    .where(Task.id == task_id, Task.user_id == user_id)
).first()
if task:
    task.title = new_title
    task.updated_at = datetime.utcnow()
    session.commit()
```

**Delete Task** (with ownership verification):
```python
task = session.exec(
    select(Task)
    .where(Task.id == task_id, Task.user_id == user_id)
).first()
if task:
    session.delete(task)
    session.commit()
```

---

## Migration Strategy

### Alembic Migrations

**Location**: `backend/alembic/versions/`

**Initial Migration**: Creates users and tasks tables
```bash
alembic revision --autogenerate -m "Create users and tasks tables"
alembic upgrade head
```

**Migration Best Practices**:
1. Always review auto-generated migrations
2. Test migrations on development database first
3. Backup production database before migration
4. Use transactions for rollback capability

### Schema Evolution

**Adding Fields**:
- Add nullable fields or provide defaults
- Create migration with `alembic revision`
- Test migration on development environment
- Apply to production with `alembic upgrade`

**Modifying Constraints**:
- Consider backward compatibility
- Plan for data migration if needed
- Test with production-like data volume

---

## Performance Considerations

### Query Optimization

**Indexed Queries** (Fast):
- User lookup by email: `WHERE email = ?` (indexed)
- Task filtering by user: `WHERE user_id = ?` (indexed)

**Non-Indexed Queries** (Slower):
- Task search by title: `WHERE title LIKE ?` (not indexed)
- Task filtering by completion: `WHERE is_complete = ?` (not indexed)

**Optimization Strategies**:
1. Always filter tasks by user_id first (indexed)
2. Use pagination for large result sets
3. Consider full-text search for title/description search
4. Add composite indexes if needed for common query patterns

### Connection Pooling

**Configuration** (`backend/src/database.py`):
```python
engine = create_engine(
    DATABASE_URL,
    pool_size=5,           # Maximum 5 connections
    max_overflow=10,       # Allow 10 additional connections
    pool_pre_ping=True     # Verify connections before use
)
```

**Benefits**:
- Reuse database connections
- Reduce connection overhead
- Handle connection failures gracefully

---

## Data Integrity

### Referential Integrity

**Foreign Key Enforcement**:
- PostgreSQL enforces foreign key constraints
- Cannot create task with non-existent user_id
- Cannot delete user with existing tasks (unless CASCADE)

**Cascade Delete**:
- Deleting user automatically deletes all their tasks
- Maintains data consistency
- Prevents orphaned records

### Transaction Management

**Atomic Operations**:
```python
with Session(engine) as session:
    # All operations in transaction
    user = User(...)
    session.add(user)
    session.commit()  # Commit or rollback together
```

**Rollback on Error**:
- Exceptions trigger automatic rollback
- Database remains consistent
- No partial updates

---

## Security & Privacy

### Data Protection

**Password Security**:
- Only hashed passwords stored (bcrypt)
- Original passwords never persisted
- Cost factor 12 for strong hashing

**User Isolation**:
- Foreign key relationships enforce ownership
- Query filtering prevents cross-user access
- No shared data between users

**Data Minimization**:
- Only essential user data stored (email)
- No unnecessary PII collection
- Task data private to owner

### Compliance Considerations

**GDPR Compliance** (if applicable):
- User can delete account (cascade deletes tasks)
- Email is only PII stored
- Data export possible through API

**Data Retention**:
- No automatic deletion policy
- User controls their data lifetime
- Cascade delete ensures cleanup

---

## Summary

**Entity Count**: 2 entities (User, Task)
**Relationship**: 1:N (One User to Many Tasks)
**Isolation**: Enforced through foreign keys and query filtering
**Performance**: Indexed on frequently queried fields
**Security**: User data isolation, password hashing, referential integrity

**Status**: ✅ Data model is production-ready and secure

---

**Documentation Complete**: 2026-01-09
**Next Steps**: Create API contracts (OpenAPI specifications)
