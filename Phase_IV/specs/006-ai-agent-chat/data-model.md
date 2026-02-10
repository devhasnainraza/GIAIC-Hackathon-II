# Data Model: AI Agent & Chat Backend

**Feature**: 006-ai-agent-chat
**Date**: 2026-01-22
**Purpose**: Define database entities and relationships for chat system

## Entity Definitions

### Conversation

Represents a chat session between a user and the AI agent.

**Attributes**:
- `id` (Integer, Primary Key): Unique conversation identifier
- `user_id` (Integer, Foreign Key → users.id, NOT NULL, Indexed): Owner of the conversation
- `title` (String, 200 chars, Nullable): Optional conversation title (can be auto-generated from first message)
- `created_at` (DateTime, NOT NULL): When conversation was created
- `updated_at` (DateTime, NOT NULL): Last activity timestamp (updated when new message added)

**Relationships**:
- `user`: Many-to-One with User (one user has many conversations)
- `messages`: One-to-Many with Message (one conversation has many messages)

**Indexes**:
- Primary key on `id`
- Foreign key index on `user_id`
- Composite index on `(user_id, updated_at DESC)` for efficient conversation list queries

**Validation Rules**:
- `user_id` must reference existing user
- `title` max length 200 characters
- `created_at` and `updated_at` must be valid timestamps
- `updated_at` must be >= `created_at`

**Business Rules**:
- Conversations are owned by a single user (no sharing)
- Conversations persist indefinitely (no automatic deletion)
- Empty conversations (no messages) are allowed
- Conversation title can be null (frontend can display "New Conversation")

---

### Message

Represents a single message in a conversation (from user or AI assistant).

**Attributes**:
- `id` (Integer, Primary Key): Unique message identifier
- `conversation_id` (Integer, Foreign Key → conversations.id, NOT NULL, Indexed): Parent conversation
- `role` (String, 20 chars, NOT NULL): Message sender - "user" or "assistant"
- `content` (Text, NOT NULL): Message text content
- `created_at` (DateTime, NOT NULL): When message was sent/generated

**Relationships**:
- `conversation`: Many-to-One with Conversation (many messages belong to one conversation)

**Indexes**:
- Primary key on `id`
- Foreign key index on `conversation_id`
- Composite index on `(conversation_id, created_at ASC)` for efficient message history queries

**Validation Rules**:
- `conversation_id` must reference existing conversation
- `role` must be either "user" or "assistant"
- `content` cannot be empty (min length 1 character)
- `content` max length 10,000 characters (prevent abuse)
- `created_at` must be valid timestamp

**Business Rules**:
- Messages are immutable (no editing after creation)
- Messages are ordered by `created_at` within a conversation
- User messages and assistant responses alternate (enforced at application level)
- Messages are deleted when parent conversation is deleted (CASCADE)

---

## Relationships Diagram

```
User (existing)
  |
  | 1:N
  |
Conversation
  |
  | 1:N
  |
Message
```

**Explanation**:
- One User has many Conversations
- One Conversation has many Messages
- Messages belong to exactly one Conversation
- Conversations belong to exactly one User

---

## Database Schema (SQLModel)

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class Conversation(SQLModel, table=True):
    """
    Conversation model representing a chat session.

    Each conversation belongs to a user and contains multiple messages.
    Conversations persist indefinitely and maintain full history.
    """
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True, nullable=False)
    title: Optional[str] = Field(default=None, max_length=200)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    user: "User" = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class Message(SQLModel, table=True):
    """
    Message model representing a single message in a conversation.

    Messages can be from 'user' or 'assistant' and are immutable.
    Messages are ordered by created_at within a conversation.
    """
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversations.id", index=True, nullable=False)
    role: str = Field(max_length=20, nullable=False)  # "user" or "assistant"
    content: str = Field(nullable=False)  # Text content, max 10000 chars
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    conversation: Conversation = Relationship(back_populates="messages")
```

---

## State Transitions

### Conversation Lifecycle

1. **Created**: User starts new conversation
   - State: Empty (no messages)
   - Action: Create Conversation record

2. **Active**: User and assistant exchange messages
   - State: Contains messages
   - Action: Add Message records, update Conversation.updated_at

3. **Resumed**: User returns to existing conversation
   - State: Load all messages from database
   - Action: Display history, allow new messages

4. **Archived** (Future): User archives conversation
   - State: Hidden from main list but not deleted
   - Action: Add `archived` boolean field (not in MVP)

### Message Lifecycle

Messages are immutable - no state transitions after creation.

1. **Created**: Message added to conversation
   - User message: Immediately persisted
   - Assistant message: Persisted after AI response generated

---

## Data Access Patterns

### Common Queries

1. **List user's conversations** (for conversation list UI):
```sql
SELECT id, title, updated_at
FROM conversations
WHERE user_id = ?
ORDER BY updated_at DESC
LIMIT 50
```

2. **Load conversation history** (for chat interface):
```sql
SELECT id, role, content, created_at
FROM messages
WHERE conversation_id = ?
ORDER BY created_at ASC
```

3. **Create new conversation**:
```sql
INSERT INTO conversations (user_id, created_at, updated_at)
VALUES (?, NOW(), NOW())
RETURNING id
```

4. **Add message to conversation**:
```sql
INSERT INTO messages (conversation_id, role, content, created_at)
VALUES (?, ?, ?, NOW())
RETURNING id
```

5. **Update conversation timestamp**:
```sql
UPDATE conversations
SET updated_at = NOW()
WHERE id = ?
```

---

## Data Integrity

### Foreign Key Constraints

- `conversations.user_id` → `users.id` (ON DELETE CASCADE)
- `messages.conversation_id` → `conversations.id` (ON DELETE CASCADE)

**Rationale**: When a user is deleted, all their conversations and messages should be deleted. When a conversation is deleted, all its messages should be deleted.

### Check Constraints

- `messages.role IN ('user', 'assistant')`
- `messages.content` length between 1 and 10,000 characters
- `conversations.title` length <= 200 characters

### Unique Constraints

None required - multiple conversations and messages are allowed.

---

## Performance Considerations

### Indexing Strategy

1. **conversations.user_id**: Fast lookup of user's conversations
2. **conversations.(user_id, updated_at DESC)**: Efficient conversation list with sorting
3. **messages.conversation_id**: Fast lookup of conversation messages
4. **messages.(conversation_id, created_at ASC)**: Efficient message history with ordering

### Query Optimization

- Use `LIMIT` on conversation list queries (pagination)
- Consider message count limit per conversation (e.g., last 100 messages)
- Use connection pooling for concurrent requests
- Index on `updated_at` for efficient "recent conversations" queries

### Scalability

- Conversations table: Expected ~1000 rows per active user
- Messages table: Expected ~50-100 messages per conversation
- Total messages: Potentially millions (requires efficient indexing)
- Consider partitioning messages table by date if volume becomes very large

---

## Migration Strategy

### Initial Migration

```sql
-- Create conversations table
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at DESC);

-- Create messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 10000),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at ASC);
```

### Rollback Plan

```sql
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
```

---

## Testing Data

### Sample Conversation

```json
{
  "conversation": {
    "id": 1,
    "user_id": 42,
    "title": "Task Management Help",
    "created_at": "2026-01-22T10:00:00Z",
    "updated_at": "2026-01-22T10:05:00Z"
  },
  "messages": [
    {
      "id": 1,
      "conversation_id": 1,
      "role": "user",
      "content": "Can you help me create a task?",
      "created_at": "2026-01-22T10:00:00Z"
    },
    {
      "id": 2,
      "conversation_id": 1,
      "role": "assistant",
      "content": "Of course! I can help you create a task. What would you like the task to be?",
      "created_at": "2026-01-22T10:00:05Z"
    },
    {
      "id": 3,
      "conversation_id": 1,
      "role": "user",
      "content": "Create a task to finish the project report by Friday",
      "created_at": "2026-01-22T10:01:00Z"
    },
    {
      "id": 4,
      "conversation_id": 1,
      "role": "assistant",
      "content": "I've created a task for you: 'Finish the project report by Friday'. The task has been added to your list.",
      "created_at": "2026-01-22T10:01:10Z"
    }
  ]
}
```
