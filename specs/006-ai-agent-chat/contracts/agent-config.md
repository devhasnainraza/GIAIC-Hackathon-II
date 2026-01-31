# Agent Configuration Contract

**Feature**: 006-ai-agent-chat
**Date**: 2026-01-22
**Purpose**: Define AI agent configuration and tool integration

## Agent System Prompt

```
You are a helpful task management assistant integrated with a todo application. Your role is to help users manage their tasks through natural conversation.

You have access to the following tools for task management:
- add_task: Create a new task
- list_tasks: View all tasks
- complete_task: Mark a task as completed
- update_task: Modify task details
- delete_task: Remove a task

When users ask about their tasks or want to manage them, use these tools to help them. Always confirm actions before executing them, and provide clear feedback about what was done.

Be conversational, friendly, and helpful. If a user's request is ambiguous, ask clarifying questions before taking action.

Important guidelines:
- Always use the tools for task operations - never make up task data
- Confirm task creation/modification with the user
- Provide clear summaries of task lists
- Be proactive in suggesting task management actions
- Handle errors gracefully and explain what went wrong
```

## Tool Definitions

### add_task

```json
{
  "type": "function",
  "function": {
    "name": "add_task",
    "description": "Create a new task for the user. Use this when the user wants to add, create, or remember something to do.",
    "parameters": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "The task title or main description (1-200 characters)"
        },
        "description": {
          "type": "string",
          "description": "Optional detailed description or notes about the task (max 2000 characters)"
        }
      },
      "required": ["title"]
    }
  }
}
```

### list_tasks

```json
{
  "type": "function",
  "function": {
    "name": "list_tasks",
    "description": "Retrieve all tasks for the user. Use this when the user wants to see their tasks, check what they need to do, or review their todo list.",
    "parameters": {
      "type": "object",
      "properties": {},
      "required": []
    }
  }
}
```

### complete_task

```json
{
  "type": "function",
  "function": {
    "name": "complete_task",
    "description": "Mark a task as completed. Use this when the user indicates they've finished a task or want to mark it as done.",
    "parameters": {
      "type": "object",
      "properties": {
        "task_id": {
          "type": "integer",
          "description": "The ID of the task to mark as completed"
        }
      },
      "required": ["task_id"]
    }
  }
}
```

### update_task

```json
{
  "type": "function",
  "function": {
    "name": "update_task",
    "description": "Update a task's title or description. Use this when the user wants to modify, change, or edit an existing task.",
    "parameters": {
      "type": "object",
      "properties": {
        "task_id": {
          "type": "integer",
          "description": "The ID of the task to update"
        },
        "title": {
          "type": "string",
          "description": "New task title (optional, only if changing)"
        },
        "description": {
          "type": "string",
          "description": "New task description (optional, only if changing)"
        }
      },
      "required": ["task_id"]
    }
  }
}
```

### delete_task

```json
{
  "type": "function",
  "function": {
    "name": "delete_task",
    "description": "Permanently delete a task. Use this when the user wants to remove or delete a task from their list.",
    "parameters": {
      "type": "object",
      "properties": {
        "task_id": {
          "type": "integer",
          "description": "The ID of the task to delete"
        }
      },
      "required": ["task_id"]
    }
  }
}
```

## Agent Configuration

```python
from openai import OpenAI
import litellm

# Agent configuration
AGENT_CONFIG = {
    "model": "gemini/gemini-pro",  # Routed through LiteLLM
    "temperature": 0.7,
    "max_tokens": 1000,
    "system_prompt": SYSTEM_PROMPT,  # Defined above
    "tools": TOOL_DEFINITIONS,  # Defined above
}

# LiteLLM configuration
litellm.set_verbose = False  # Set to True for debugging
os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY

# Agent instantiation (per request)
def create_agent(conversation_history: List[dict]) -> Agent:
    """
    Create a fresh agent instance for a single request.

    Args:
        conversation_history: List of previous messages in format:
            [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]

    Returns:
        Configured agent ready to process user message
    """
    return Agent(
        model=AGENT_CONFIG["model"],
        system_prompt=AGENT_CONFIG["system_prompt"],
        tools=AGENT_CONFIG["tools"],
        temperature=AGENT_CONFIG["temperature"],
        max_tokens=AGENT_CONFIG["max_tokens"],
        history=conversation_history
    )
```

## Tool Execution Handler

```python
async def execute_tool(tool_name: str, arguments: dict, user_id: int) -> dict:
    """
    Execute MCP tool and return result.

    Args:
        tool_name: Name of the tool to execute
        arguments: Tool arguments from agent
        user_id: Authenticated user ID

    Returns:
        Tool execution result
    """
    # Import MCP tool handlers
    from src.mcp.tools.tool_handlers import HANDLERS

    # Add user_id to arguments
    tool_args = {**arguments, "user_id": str(user_id)}

    # Execute tool
    handler = HANDLERS.get(tool_name)
    if not handler:
        return {"error": f"Unknown tool: {tool_name}"}

    result = await handler(**tool_args)
    return result
```

## Agent Response Flow

```
1. User sends message
   ↓
2. Load conversation history from database
   ↓
3. Create agent with history + system prompt + tools
   ↓
4. Agent processes message
   ↓
5. Agent decides: respond directly OR call tool
   ↓
6. If tool call:
   - Execute tool via MCP server
   - Return result to agent
   - Agent generates response with tool result
   ↓
7. Return assistant message to user
   ↓
8. Persist both user and assistant messages to database
```

## Example Agent Interactions

### Simple Conversation

**User**: "Hello!"

**Agent** (no tool call):
```
Hello! I'm your task management assistant. I can help you create, view, update, and complete tasks. What would you like to do today?
```

### Task Creation

**User**: "Create a task to finish the project report by Friday"

**Agent** (calls add_task):
```
Tool Call: add_task
Arguments: {
  "title": "Finish the project report by Friday",
  "description": null
}

Tool Result: {
  "task_id": 123,
  "title": "Finish the project report by Friday",
  "completed": false,
  "created_at": "2026-01-22T10:00:00Z"
}

Response: "I've created a task for you: 'Finish the project report by Friday'. The task has been added to your list with ID 123."
```

### Task Listing

**User**: "What tasks do I have?"

**Agent** (calls list_tasks):
```
Tool Call: list_tasks
Arguments: {}

Tool Result: {
  "tasks": [
    {"task_id": 123, "title": "Finish the project report by Friday", "completed": false},
    {"task_id": 124, "title": "Review pull requests", "completed": false}
  ],
  "count": 2
}

Response: "You have 2 tasks:
1. Finish the project report by Friday (ID: 123)
2. Review pull requests (ID: 124)

Would you like to work on any of these?"
```

### Task Completion

**User**: "Mark the report task as done"

**Agent** (calls complete_task):
```
Tool Call: complete_task
Arguments: {
  "task_id": 123
}

Tool Result: {
  "task_id": 123,
  "title": "Finish the project report by Friday",
  "completed": true,
  "updated_at": "2026-01-22T10:05:00Z"
}

Response: "Great job! I've marked 'Finish the project report by Friday' as completed. Keep up the good work!"
```

## Error Handling

### Tool Execution Error

```python
# If tool returns error
tool_result = {
    "error": "Task not found",
    "error_code": "NOT_FOUND_OR_FORBIDDEN"
}

# Agent should handle gracefully
agent_response = "I couldn't find that task. It may have been deleted or you might not have access to it. Could you check the task ID and try again?"
```

### AI Model Error

```python
try:
    response = agent.run(messages=history, user_message=new_message)
except Exception as e:
    # Log error
    logger.error(f"Agent error: {str(e)}")

    # Return user-friendly message
    return {
        "error": "I'm having trouble generating a response right now. Please try again in a moment.",
        "error_code": "AI_SERVICE_ERROR"
    }
```

## Configuration Environment Variables

```bash
# Required for agent operation
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # For OpenAI Agents SDK

# Optional configuration
AGENT_TEMPERATURE=0.7
AGENT_MAX_TOKENS=1000
AGENT_MODEL=gemini/gemini-pro
```

## Testing Agent Configuration

```python
# Test agent instantiation
def test_agent_creation():
    agent = create_agent([])
    assert agent is not None
    assert agent.model == "gemini/gemini-pro"
    assert len(agent.tools) == 5

# Test tool execution
async def test_tool_execution():
    result = await execute_tool(
        "add_task",
        {"title": "Test task"},
        user_id=1
    )
    assert "task_id" in result
    assert result["title"] == "Test task"

# Test agent response
async def test_agent_response():
    agent = create_agent([])
    response = await agent.run(
        messages=[],
        user_message="Hello"
    )
    assert response is not None
    assert len(response) > 0
```
