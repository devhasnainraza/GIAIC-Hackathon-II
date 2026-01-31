# API Contract: Chat Endpoint

**Feature**: 006-ai-agent-chat
**Date**: 2026-01-22
**Purpose**: Define REST API contract for chat functionality

## Endpoint: POST /api/chat

Send a message to the AI agent and receive a response.

### Request

**Method**: `POST`

**Path**: `/api/chat`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "message": "string (required, 1-10000 chars)",
  "conversation_id": "integer (optional, null for new conversation)"
}
```

**Request Schema**:
```typescript
interface ChatRequest {
  message: string;           // User's message text
  conversation_id?: number;  // Existing conversation ID, or null/undefined for new
}
```

**Validation Rules**:
- `message` is required
- `message` must be 1-10,000 characters
- `message` cannot be only whitespace
- `conversation_id` must be a valid integer or null/undefined
- If `conversation_id` provided, conversation must exist and belong to authenticated user

### Response

**Success Response** (200 OK):
```json
{
  "conversation_id": 123,
  "message": {
    "id": 456,
    "role": "assistant",
    "content": "AI response text here",
    "created_at": "2026-01-22T10:00:00Z"
  },
  "user_message": {
    "id": 455,
    "role": "user",
    "content": "User's message text",
    "created_at": "2026-01-22T09:59:55Z"
  }
}
```

**Response Schema**:
```typescript
interface ChatResponse {
  conversation_id: number;    // ID of conversation (new or existing)
  message: {
    id: number;               // Message ID
    role: "assistant";        // Always "assistant" for AI responses
    content: string;          // AI-generated response text
    created_at: string;       // ISO 8601 timestamp
  };
  user_message: {
    id: number;               // User message ID
    role: "user";             // Always "user"
    content: string;          // User's original message
    created_at: string;       // ISO 8601 timestamp
  };
}
```

### Error Responses

**400 Bad Request** - Invalid input:
```json
{
  "detail": "Message cannot be empty",
  "error_code": "VALIDATION_ERROR"
}
```

**401 Unauthorized** - Missing or invalid JWT:
```json
{
  "detail": "Not authenticated",
  "error_code": "UNAUTHORIZED"
}
```

**403 Forbidden** - Conversation belongs to another user:
```json
{
  "detail": "Conversation not found or access forbidden",
  "error_code": "FORBIDDEN"
}
```

**404 Not Found** - Conversation doesn't exist:
```json
{
  "detail": "Conversation not found",
  "error_code": "NOT_FOUND"
}
```

**500 Internal Server Error** - AI service failure:
```json
{
  "detail": "Failed to generate AI response. Please try again.",
  "error_code": "AI_SERVICE_ERROR"
}
```

**503 Service Unavailable** - AI model unavailable:
```json
{
  "detail": "AI service is temporarily unavailable. Please try again later.",
  "error_code": "SERVICE_UNAVAILABLE"
}
```

### Request Flow

1. **Authentication**: Extract user_id from JWT token
2. **Validation**: Validate message content and conversation_id
3. **Authorization**: If conversation_id provided, verify it belongs to user
4. **Conversation**: Create new conversation if conversation_id is null, otherwise load existing
5. **History**: Load all messages from conversation for context
6. **Persistence**: Save user message to database
7. **Agent**: Instantiate agent with conversation history
8. **Generation**: Generate AI response via LiteLLM/Gemini
9. **Persistence**: Save assistant message to database
10. **Response**: Return conversation_id and both messages

### Example Requests

**New Conversation**:
```bash
curl -X POST https://api.example.com/api/chat /
  -H "Authorization: Bearer eyJhbGc..." /
  -H "Content-Type: application/json" /
  -d '{
    "message": "Hello! Can you help me manage my tasks?"
  }'
```

**Continue Existing Conversation**:
```bash
curl -X POST https://api.example.com/api/chat /
  -H "Authorization: Bearer eyJhbGc..." /
  -H "Content-Type: application/json" /
  -d '{
    "message": "Create a task to finish the report",
    "conversation_id": 123
  }'
```

### Performance Expectations

- **Response Time**: < 10 seconds under normal load
- **Timeout**: 30 seconds (return 504 Gateway Timeout if exceeded)
- **Concurrency**: Support 100 concurrent requests
- **Rate Limiting**: 60 requests per minute per user (configurable)

### Security Considerations

- JWT token must be verified on every request
- User ID extracted from JWT, never from request body
- Conversation ownership validated before access
- Message content sanitized to prevent XSS
- No sensitive data logged (message content excluded from logs)

---

## Endpoint: GET /api/conversations

List all conversations for the authenticated user.

### Request

**Method**: `GET`

**Path**: `/api/conversations`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
```
limit: integer (optional, default 50, max 100)
offset: integer (optional, default 0)
```

### Response

**Success Response** (200 OK):
```json
{
  "conversations": [
    {
      "id": 123,
      "title": "Task Management Help",
      "created_at": "2026-01-22T10:00:00Z",
      "updated_at": "2026-01-22T10:05:00Z",
      "message_count": 4
    },
    {
      "id": 122,
      "title": null,
      "created_at": "2026-01-21T15:30:00Z",
      "updated_at": "2026-01-21T15:35:00Z",
      "message_count": 2
    }
  ],
  "total": 2,
  "limit": 50,
  "offset": 0
}
```

**Response Schema**:
```typescript
interface ConversationsResponse {
  conversations: Array<{
    id: number;
    title: string | null;
    created_at: string;
    updated_at: string;
    message_count: number;
  }>;
  total: number;
  limit: number;
  offset: number;
}
```

### Error Responses

**401 Unauthorized** - Missing or invalid JWT:
```json
{
  "detail": "Not authenticated",
  "error_code": "UNAUTHORIZED"
}
```

---

## Endpoint: GET /api/conversations/{conversation_id}

Get full conversation history including all messages.

### Request

**Method**: `GET`

**Path**: `/api/conversations/{conversation_id}`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Path Parameters**:
- `conversation_id`: integer (required)

### Response

**Success Response** (200 OK):
```json
{
  "id": 123,
  "title": "Task Management Help",
  "created_at": "2026-01-22T10:00:00Z",
  "updated_at": "2026-01-22T10:05:00Z",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "Can you help me create a task?",
      "created_at": "2026-01-22T10:00:00Z"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "Of course! I can help you create a task...",
      "created_at": "2026-01-22T10:00:05Z"
    }
  ]
}
```

**Response Schema**:
```typescript
interface ConversationDetail {
  id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
  messages: Array<{
    id: number;
    role: "user" | "assistant";
    content: string;
    created_at: string;
  }>;
}
```

### Error Responses

**401 Unauthorized** - Missing or invalid JWT

**403 Forbidden** - Conversation belongs to another user

**404 Not Found** - Conversation doesn't exist

---

## Endpoint: DELETE /api/conversations/{conversation_id}

Delete a conversation and all its messages.

### Request

**Method**: `DELETE`

**Path**: `/api/conversations/{conversation_id}`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Path Parameters**:
- `conversation_id`: integer (required)

### Response

**Success Response** (200 OK):
```json
{
  "message": "Conversation deleted successfully",
  "conversation_id": 123
}
```

### Error Responses

**401 Unauthorized** - Missing or invalid JWT

**403 Forbidden** - Conversation belongs to another user

**404 Not Found** - Conversation doesn't exist

---

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: AI Chat API
  version: 1.0.0
  description: API for conversational AI chat with task management

paths:
  /api/chat:
    post:
      summary: Send message to AI agent
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - message
              properties:
                message:
                  type: string
                  minLength: 1
                  maxLength: 10000
                conversation_id:
                  type: integer
                  nullable: true
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '500':
          $ref: '#/components/responses/InternalError'

  /api/conversations:
    get:
      summary: List user's conversations
      security:
        - bearerAuth: []
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 50
            maximum: 100
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: List of conversations
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ConversationsResponse'

  /api/conversations/{conversation_id}:
    get:
      summary: Get conversation details
      security:
        - bearerAuth: []
      parameters:
        - name: conversation_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Conversation details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ConversationDetail'
    delete:
      summary: Delete conversation
      security:
        - bearerAuth: []
      parameters:
        - name: conversation_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Conversation deleted

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    ChatResponse:
      type: object
      properties:
        conversation_id:
          type: integer
        message:
          $ref: '#/components/schemas/Message'
        user_message:
          $ref: '#/components/schemas/Message'

    Message:
      type: object
      properties:
        id:
          type: integer
        role:
          type: string
          enum: [user, assistant]
        content:
          type: string
        created_at:
          type: string
          format: date-time

    ConversationsResponse:
      type: object
      properties:
        conversations:
          type: array
          items:
            $ref: '#/components/schemas/ConversationSummary'
        total:
          type: integer
        limit:
          type: integer
        offset:
          type: integer

    ConversationSummary:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        message_count:
          type: integer

    ConversationDetail:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        messages:
          type: array
          items:
            $ref: '#/components/schemas/Message'

  responses:
    BadRequest:
      description: Invalid request
      content:
        application/json:
          schema:
            type: object
            properties:
              detail:
                type: string
              error_code:
                type: string

    Unauthorized:
      description: Not authenticated
      content:
        application/json:
          schema:
            type: object
            properties:
              detail:
                type: string
              error_code:
                type: string

    Forbidden:
      description: Access forbidden
      content:
        application/json:
          schema:
            type: object
            properties:
              detail:
                type: string
              error_code:
                type: string

    InternalError:
      description: Internal server error
      content:
        application/json:
          schema:
            type: object
            properties:
              detail:
                type: string
              error_code:
                type: string
```
