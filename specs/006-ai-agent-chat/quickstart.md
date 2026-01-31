# Quickstart Guide: AI Agent & Chat Backend

**Feature**: 006-ai-agent-chat
**Date**: 2026-01-22
**Purpose**: Integration scenarios and testing workflows

## Prerequisites

Before starting, ensure you have:

1. **Completed Features**:
   - ✅ Feature 002: Authentication system with JWT
   - ✅ Feature 005: MCP server with task tools

2. **Environment Setup**:
   - Python 3.11+ installed
   - Node.js 18+ installed
   - PostgreSQL database (Neon) accessible
   - API keys configured in `.env`

3. **Required API Keys**:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_URL=postgresql://...
   JWT_SECRET=your_jwt_secret
   ```

## Integration Scenario 1: New Conversation

**Goal**: User starts a new conversation with the AI agent

### Frontend Flow

1. User opens chat interface (ChatKit component)
2. User types message: "Hello, can you help me?"
3. Frontend sends POST request to `/api/chat`:
   ```typescript
   const response = await fetch('/api/chat', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${jwtToken}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       message: "Hello, can you help me?",
       conversation_id: null  // New conversation
     })
   })
   ```

### Backend Flow

1. **Authentication**: Extract user_id from JWT
2. **Create Conversation**: Insert new conversation record
3. **Save User Message**: Insert message with role="user"
4. **Instantiate Agent**: Create agent with empty history
5. **Generate Response**: Agent processes message via LiteLLM/Gemini
6. **Save Assistant Message**: Insert message with role="assistant"
7. **Return Response**:
   ```json
   {
     "conversation_id": 1,
     "message": {
       "id": 2,
       "role": "assistant",
       "content": "Hello! I'm your task management assistant...",
       "created_at": "2026-01-22T10:00:05Z"
     },
     "user_message": {
       "id": 1,
       "role": "user",
       "content": "Hello, can you help me?",
       "created_at": "2026-01-22T10:00:00Z"
     }
   }
   ```

### Frontend Display

1. Display user message in chat UI
2. Display assistant response in chat UI
3. Store conversation_id for subsequent messages

**Expected Result**: User sees greeting from AI assistant, conversation is created in database

---

## Integration Scenario 2: Task Creation via Chat

**Goal**: User asks AI to create a task, agent uses MCP tool

### User Message

"Create a task to finish the project report by Friday"

### Backend Flow

1. **Load History**: Retrieve previous messages from conversation
2. **Instantiate Agent**: Create agent with conversation history
3. **Agent Processing**:
   - Agent understands user wants to create a task
   - Agent decides to call `add_task` tool
   - Tool call: `add_task(title="Finish the project report by Friday")`

4. **Tool Execution**:
   ```python
   # Agent calls tool
   tool_result = await execute_tool(
       "add_task",
       {"title": "Finish the project report by Friday"},
       user_id=42
   )
   # Result: {"task_id": 123, "title": "...", "completed": false}
   ```

5. **Agent Response**: Agent generates response using tool result
6. **Save Messages**: Save both user and assistant messages

### Agent Response

"I've created a task for you: 'Finish the project report by Friday'. The task has been added to your list with ID 123."

**Expected Result**: Task is created in database via MCP tool, user receives confirmation

---

## Integration Scenario 3: Conversation Resume

**Goal**: User returns to existing conversation, context is preserved

### Frontend Flow

1. User opens conversation list
2. User selects existing conversation (ID: 1)
3. Frontend loads conversation:
   ```typescript
   const conversation = await fetch(`/api/conversations/1`, {
     headers: { 'Authorization': `Bearer ${jwtToken}` }
   })
   ```

4. Display all previous messages
5. User sends new message with conversation_id=1

### Backend Flow

1. **Load History**: Query all messages for conversation_id=1
2. **Instantiate Agent**: Create agent with full conversation history
3. **Context Awareness**: Agent has access to all previous messages
4. **Generate Response**: Agent responds with context awareness

### Example Context-Aware Response

**Previous messages**:
- User: "Create a task to finish the report"
- Assistant: "I've created the task..."

**New message**:
- User: "Can you mark it as done?"

**Agent response** (context-aware):
- "I've marked 'Finish the project report by Friday' as completed. Great job!"

**Expected Result**: Agent demonstrates awareness of previous conversation, correctly identifies "it" as the previously created task

---

## Integration Scenario 4: Error Handling

**Goal**: System handles errors gracefully

### Scenario 4a: AI Service Unavailable

**Trigger**: Gemini API is down or rate limited

**Backend Handling**:
```python
try:
    response = agent.run(messages=history, user_message=new_message)
except Exception as e:
    logger.error(f"AI service error: {str(e)}")
    return JSONResponse(
        status_code=503,
        content={
            "detail": "AI service is temporarily unavailable. Please try again later.",
            "error_code": "SERVICE_UNAVAILABLE"
        }
    )
```

**Frontend Display**: Show error message to user with retry option

**Expected Result**: User sees friendly error message, can retry

### Scenario 4b: Invalid Conversation Access

**Trigger**: User tries to access another user's conversation

**Backend Handling**:
```python
conversation = db.query(Conversation).filter_by(
    id=conversation_id,
    user_id=user_id  # From JWT
).first()

if not conversation:
    raise HTTPException(
        status_code=403,
        detail="Conversation not found or access forbidden"
    )
```

**Expected Result**: 403 Forbidden error, user cannot access other users' conversations

---

## Integration Scenario 5: Statelessness Verification

**Goal**: Verify system operates statelessly

### Test Steps

1. **Start conversation**: User sends message, receives response
2. **Restart server**: Stop and restart FastAPI backend
3. **Continue conversation**: User sends another message with same conversation_id
4. **Verify**: Agent has full context, responds appropriately

### Verification Points

- ✅ Conversation history loaded from database
- ✅ No server-side session required
- ✅ Agent instantiated fresh with history
- ✅ Response is contextually appropriate
- ✅ No data loss after restart

**Expected Result**: System functions identically before and after restart

---

## Integration Scenario 6: MCP Tool Integration

**Goal**: Verify agent correctly uses MCP tools for all task operations

### Test Cases

1. **List Tasks**:
   - User: "What tasks do I have?"
   - Agent calls: `list_tasks()`
   - Verifies: Agent displays task list from MCP tool result

2. **Complete Task**:
   - User: "Mark task 123 as done"
   - Agent calls: `complete_task(task_id=123)`
   - Verifies: Task marked complete in database

3. **Update Task**:
   - User: "Change task 123 title to 'Updated title'"
   - Agent calls: `update_task(task_id=123, title="Updated title")`
   - Verifies: Task updated in database

4. **Delete Task**:
   - User: "Delete task 123"
   - Agent calls: `delete_task(task_id=123)`
   - Verifies: Task removed from database

**Expected Result**: All task operations go through MCP tools, agent never manipulates data directly

---

## Development Workflow

### Phase 1: Backend Setup

1. **Database Migration**:
   ```bash
   # Create Conversation and Message tables
   alembic revision --autogenerate -m "Add conversation and message models"
   alembic upgrade head
   ```

2. **Install Dependencies**:
   ```bash
   pip install openai litellm agents-sdk
   ```

3. **Configure Environment**:
   ```bash
   # Add to .env
   GEMINI_API_KEY=your_key
   OPENAI_API_KEY=your_key
   ```

4. **Implement Chat Endpoint**:
   - Create `/api/chat` route
   - Implement stateless request handling
   - Integrate with MCP tools

### Phase 2: Frontend Setup

1. **Install ChatKit**:
   ```bash
   npm install @chatscope/chat-ui-kit-react
   ```

2. **Create Chat Component**:
   - Implement ChatKit UI
   - Connect to `/api/chat` endpoint
   - Handle loading and error states

3. **Implement Conversation List**:
   - Display user's conversations
   - Allow switching between conversations
   - Show conversation metadata

### Phase 3: Testing

1. **Unit Tests**:
   - Test agent instantiation
   - Test tool execution
   - Test database operations

2. **Integration Tests**:
   - Test full chat flow
   - Test MCP tool integration
   - Test error handling

3. **Manual Testing**:
   - Test conversation creation
   - Test context awareness
   - Test statelessness (restart server)

---

## Debugging Tips

### Check Agent Configuration

```python
# Verify agent is configured correctly
agent = create_agent([])
print(f"Model: {agent.model}")
print(f"Tools: {len(agent.tools)}")
print(f"System prompt: {agent.system_prompt[:100]}...")
```

### Check LiteLLM Connection

```python
# Test LiteLLM/Gemini connection
import litellm
response = litellm.completion(
    model="gemini/gemini-pro",
    messages=[{"role": "user", "content": "Hello"}]
)
print(response)
```

### Check MCP Tool Execution

```python
# Test MCP tool directly
from src.mcp.tools.tool_handlers import HANDLERS
result = await HANDLERS["list_tasks"](user_id="1")
print(result)
```

### Check Database Queries

```python
# Verify conversation history loading
conversation = db.query(Conversation).filter_by(id=1, user_id=42).first()
messages = db.query(Message).filter_by(conversation_id=1).all()
print(f"Conversation: {conversation}")
print(f"Messages: {len(messages)}")
```

---

## Performance Benchmarks

### Target Metrics

- **Chat Response Time**: < 10 seconds (P95)
- **Database Query Time**: < 500ms
- **Concurrent Users**: 100 simultaneous conversations
- **Message Throughput**: 1000 messages/minute

### Monitoring

```python
import time

# Measure response time
start = time.time()
response = await chat_endpoint(message, conversation_id, user_id)
duration = time.time() - start

logger.info(f"Chat response time: {duration:.2f}s")

# Alert if exceeds threshold
if duration > 10:
    logger.warning(f"Slow response: {duration:.2f}s")
```

---

## Common Issues and Solutions

### Issue: Agent not calling tools

**Symptom**: Agent responds without using MCP tools

**Solution**: Improve tool descriptions, make them more specific

### Issue: Context not preserved

**Symptom**: Agent doesn't remember previous messages

**Solution**: Verify conversation history is loaded and passed to agent

### Issue: Slow responses

**Symptom**: Responses take > 10 seconds

**Solution**: Check Gemini API latency, optimize prompt length, implement timeout

### Issue: Database connection errors

**Symptom**: "Too many connections" error

**Solution**: Configure connection pool size, implement connection timeout

---

## Next Steps

After completing this feature:

1. **Test thoroughly**: Run all integration scenarios
2. **Monitor performance**: Track response times and error rates
3. **Gather feedback**: Test with real users
4. **Iterate**: Refine agent prompts and tool descriptions based on usage
