# Research: AI Agent & Chat Backend

**Feature**: 006-ai-agent-chat
**Date**: 2026-01-22
**Purpose**: Resolve technical unknowns and establish implementation patterns

## Research Questions

### 1. OpenAI Agents SDK Integration

**Question**: How do we configure and use OpenAI Agents SDK for stateless conversation orchestration?

**Research Findings**:
- OpenAI Agents SDK provides `Agent` class for orchestrating conversations
- Agent can be instantiated per request with conversation history
- Supports tool calling via function definitions
- Agent maintains no state between requests (perfect for stateless architecture)
- Configuration includes: model name, system prompt, tools, temperature

**Decision**: Use OpenAI Agents SDK with per-request agent instantiation

**Rationale**:
- Aligns with stateless architecture requirement
- Built-in tool calling support for MCP integration
- Industry-standard pattern for agent orchestration
- Deterministic behavior with same inputs

**Implementation Pattern**:
```python
from openai import OpenAI
from agents import Agent

# Per request
agent = Agent(
    model="gemini-pro",  # via LiteLLM
    system_prompt="You are a helpful task management assistant...",
    tools=[...],  # MCP tool definitions
    temperature=0.7
)

response = agent.run(
    messages=conversation_history,  # from database
    user_message=new_message
)
```

### 2. LiteLLM Model Routing

**Question**: How do we route all AI model requests through LiteLLM to access Google Gemini?

**Research Findings**:
- LiteLLM provides unified interface for multiple AI providers
- Supports Google Gemini via `gemini/gemini-pro` model identifier
- Requires `GEMINI_API_KEY` environment variable
- Translates OpenAI-compatible requests to Gemini API format
- Handles rate limiting and retries automatically

**Decision**: Configure LiteLLM as model router with Gemini backend

**Rationale**:
- Single point of model access (satisfies "unified model access layer" requirement)
- No direct OpenAI or Gemini API calls in application code
- Easy to switch models by changing configuration
- Built-in error handling and retry logic

**Implementation Pattern**:
```python
import litellm

# Configure LiteLLM
litellm.set_verbose = True  # for debugging
os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY

# All model calls go through LiteLLM
response = litellm.completion(
    model="gemini/gemini-pro",
    messages=messages,
    tools=tools
)
```

### 3. ChatKit UI Integration

**Question**: How do we integrate ChatKit with Next.js App Router for the chat interface?

**Research Findings**:
- ChatKit is a React component library for chat interfaces
- Provides `ChatContainer`, `MessageList`, `MessageInput` components
- Supports custom message rendering and styling
- Works with Next.js App Router (client components)
- Handles message display, input, and loading states

**Decision**: Use ChatKit components in Next.js client component

**Rationale**:
- Pre-built chat UI reduces development time
- Handles common chat UX patterns (scrolling, input, loading)
- Customizable for branding and styling
- React-based, integrates naturally with Next.js

**Implementation Pattern**:
```tsx
'use client'

import { ChatContainer, MessageList, MessageInput } from '@chatscope/chat-ui-kit-react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])

  const handleSend = async (message) => {
    // Call POST /api/chat
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, conversation_id })
    })
    // Update messages
  }

  return (
    <ChatContainer>
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </ChatContainer>
  )
}
```

### 4. Agent-MCP Tool Integration

**Question**: How does the OpenAI agent call MCP tools for task operations?

**Research Findings**:
- OpenAI Agents SDK supports function calling via tool definitions
- MCP tools can be exposed as function definitions to the agent
- Agent decides when to call tools based on user intent
- Tool results are returned to agent for response generation
- MCP server from feature 005 already implements 5 tools

**Decision**: Define MCP tools as agent functions, proxy calls to MCP server

**Rationale**:
- Maintains separation: agent orchestrates, MCP tools execute
- Reuses existing MCP implementation from feature 005
- Agent can intelligently decide which tools to call
- User isolation enforced by MCP tools (user_id parameter)

**Implementation Pattern**:
```python
# Define MCP tools as agent functions
tools = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Create a new task for the user",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "description": {"type": "string"}
                },
                "required": ["title"]
            }
        }
    },
    # ... other MCP tools
]

# When agent calls tool, proxy to MCP server
def execute_tool(tool_name, arguments, user_id):
    # Call MCP tool with user_id
    return mcp_client.call_tool(tool_name, {**arguments, "user_id": user_id})
```

### 5. Conversation Context Management

**Question**: How do we manage conversation history for context-aware responses?

**Research Findings**:
- OpenAI Agents SDK accepts message history as input
- Messages should be in format: `[{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]`
- Database stores all messages with role, content, timestamp
- On each request, load conversation history and append new message
- Agent uses full history for context-aware responses

**Decision**: Load full conversation history from database per request

**Rationale**:
- Stateless architecture requires loading history each time
- Agent needs full context for coherent responses
- Database query is fast enough for reasonable conversation lengths
- Can implement pagination if conversations become very long

**Implementation Pattern**:
```python
# Load conversation history
conversation = db.query(Conversation).filter_by(
    id=conversation_id,
    user_id=user_id
).first()

messages = db.query(Message).filter_by(
    conversation_id=conversation_id
).order_by(Message.created_at).all()

# Format for agent
history = [
    {"role": msg.role, "content": msg.content}
    for msg in messages
]

# Add new user message
history.append({"role": "user", "content": new_message})

# Get agent response
response = agent.run(messages=history)
```

### 6. Stateless Chat System Best Practices

**Question**: What are best practices for building stateless chat systems?

**Research Findings**:
- Load conversation history from database on every request
- Use JWT for user authentication (no server sessions)
- Store all state in database (conversations, messages, user preferences)
- Agent instantiation should be lightweight and fast
- Use connection pooling for database efficiency
- Implement request timeouts to prevent hanging

**Decision**: Follow stateless REST API pattern with database-backed state

**Rationale**:
- Aligns with Phase III constitution requirements
- Enables horizontal scaling (any server can handle any request)
- Simplifies debugging (no hidden state)
- Makes system reproducible and testable

**Best Practices Applied**:
1. No global variables or module-level state
2. All user context from JWT + database
3. Agent created and destroyed per request
4. Database connection pooling for performance
5. Request timeout of 30 seconds
6. Graceful error handling with user-friendly messages

## Technology Decisions Summary

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Agent Orchestration | OpenAI Agents SDK | Industry standard, stateless, tool calling support |
| Model Access | LiteLLM → Gemini | Unified interface, no direct API calls, easy switching |
| Chat UI | ChatKit | Pre-built components, React-based, customizable |
| MCP Integration | Proxy to existing MCP server | Reuse feature 005, maintain separation of concerns |
| Context Management | Database-backed history | Stateless, scalable, auditable |
| Architecture Pattern | Stateless REST API | Constitution requirement, scalable, reproducible |

## Alternatives Considered

### Agent Framework
- **LangChain**: More complex, harder to maintain stateless architecture
- **Custom Agent**: Reinventing the wheel, more bugs, less maintainable
- **OpenAI Agents SDK**: ✅ Chosen - simpler, stateless-friendly, standard

### Model Access
- **Direct OpenAI API**: Doesn't support Gemini
- **Direct Gemini API**: Violates "unified model access layer" requirement
- **LiteLLM**: ✅ Chosen - supports multiple providers, unified interface

### Chat UI
- **Custom React Components**: More work, reinventing common patterns
- **Headless UI**: Still need to build all chat logic
- **ChatKit**: ✅ Chosen - pre-built, handles common patterns, customizable

## Implementation Risks

1. **Agent Response Time**: Gemini API latency may exceed 10-second target
   - **Mitigation**: Use streaming if needed, optimize prompt length, implement timeout

2. **MCP Tool Integration**: Agent may not correctly map user intent to tools
   - **Mitigation**: Clear tool descriptions, test with various user inputs, refine prompts

3. **Conversation History Size**: Very long conversations may slow down requests
   - **Mitigation**: Implement message limit (e.g., last 50 messages), summarization if needed

4. **Database Connection Pool**: High concurrency may exhaust connections
   - **Mitigation**: Configure appropriate pool size, implement connection timeout

## Next Steps

Phase 1 will define:
1. **Data Model**: Conversation and Message entities with relationships
2. **API Contracts**: POST /api/chat endpoint specification
3. **Agent Configuration**: System prompt and tool definitions
4. **Frontend Integration**: ChatKit component structure
