# Implementation Plan: AI Agent & Chat Backend

**Branch**: `006-ai-agent-chat` | **Date**: 2026-01-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-ai-agent-chat/spec.md` and detailed requirements from `prompt.md`

## Summary

Build a stateless AI chat system where users interact with an AI agent through a ChatKit-based UI. The FastAPI backend uses OpenAI Agents SDK to orchestrate conversations powered by Google Gemini via LiteLLM. All conversation state persists in the database, with no server-side session storage. The agent uses MCP tools (from feature 005) for task operations, maintaining clear separation between conversation orchestration and data manipulation.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript/Next.js 16+ (frontend)

**Primary Dependencies**:
- **Frontend**: Next.js 16+ App Router, ChatKit UI library, Better Auth client
- **Backend**: FastAPI, OpenAI Agents SDK, LiteLLM, SQLModel, psycopg2-binary
- **AI Model**: Google Gemini (accessed via LiteLLM)
- **Database**: Neon Serverless PostgreSQL (existing connection)
- **MCP Tools**: Existing MCP server from feature 005-mcp-task-tools

**Storage**: Neon Serverless PostgreSQL (existing DATABASE_URL)

**Testing**: pytest (backend), Jest/React Testing Library (frontend)

**Target Platform**: Web browsers (desktop and mobile), Linux server (Docker)

**Project Type**: Full-stack conversational AI application with stateless backend

**Performance Goals**:
- AI response generation < 10 seconds
- Support 100 concurrent conversations
- Database query response < 500ms

**Constraints**:
- MUST maintain stateless architecture (no server-side sessions)
- MUST persist all conversation data in database
- MUST route all AI model requests through LiteLLM (no direct OpenAI/Gemini calls)
- MUST use OpenAI Agents SDK for agent orchestration
- MUST integrate with existing MCP tools for task operations
- MUST enforce user data isolation on all operations
- Agent logic MUST be deterministic and auditable

**Scale/Scope**: Multi-user chat system, 2 new database entities (Conversation, Message), integration with existing User and MCP tools, designed for conversational task management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle VII: Stateless Architecture (NON-NEGOTIABLE)

- ✅ **PASS**: Chat endpoint will be stateless per request
- ✅ **PASS**: Conversation history loads from database on every request
- ✅ **PASS**: No server-side session storage planned
- ✅ **PASS**: Agent instantiated fresh per request
- ✅ **PASS**: All user context derived from JWT + database queries
- ✅ **PASS**: Server restarts will not lose any data

**Validation**: Architecture design explicitly avoids in-memory state. Each POST /api/chat request will:
1. Extract user_id from JWT
2. Load conversation history from database
3. Instantiate agent with history context
4. Generate response via LiteLLM
5. Persist new messages to database
6. Return response (no state retained)

### Principle VIII: MCP Tool Primacy (NON-NEGOTIABLE)

- ✅ **PASS**: Agent will use existing MCP tools for all task CRUD operations
- ✅ **PASS**: MCP tools are single source of truth for task data
- ✅ **PASS**: Agent will not access database directly
- ✅ **PASS**: MCP tools already implement user_id filtering
- ✅ **PASS**: Agent's role is conversation orchestration, not data manipulation

**Validation**: Agent will be configured with MCP tool definitions from feature 005. All task operations (add_task, list_tasks, complete_task, update_task, delete_task) will be delegated to MCP server.

### Principle III: User Data Isolation (NON-NEGOTIABLE)

- ✅ **PASS**: All conversation queries will filter by user_id from JWT
- ✅ **PASS**: User ID extracted from verified JWT, never from request body
- ✅ **PASS**: Database foreign keys enforce conversation ownership
- ✅ **PASS**: MCP tools already enforce user isolation
- ✅ **PASS**: No cross-user conversation access possible

**Validation**: Conversation and Message models will have user_id foreign keys. All queries will include WHERE user_id = <authenticated_user>.

### Principle V: Technology Stack Immutability

- ✅ **PASS**: Using Next.js 16+ with App Router (frontend)
- ✅ **PASS**: Using ChatKit for conversational UI
- ✅ **PASS**: Using FastAPI (backend)
- ✅ **PASS**: Using OpenAI Agents SDK for agent orchestration
- ✅ **PASS**: Using MCP SDK (already implemented in feature 005)
- ✅ **PASS**: Using SQLModel ORM
- ✅ **PASS**: Using Neon Serverless PostgreSQL
- ✅ **PASS**: Using Better Auth with JWT

**Validation**: No technology substitutions. All required stack components are specified.

### Principle I: Correctness & Specification Adherence

- ✅ **PASS**: All 15 functional requirements mapped to implementation phases
- ✅ **PASS**: 3 user stories have clear acceptance criteria
- ✅ **PASS**: API contracts will match REST conventions
- ✅ **PASS**: Implementation will be verifiable against success criteria

**Validation**: Implementation will follow spec.md requirements exactly. Each user story will be independently testable.

### Principle IV: Agentic Development Workflow

- ✅ **PASS**: Following Spec → Plan → Tasks → Implementation workflow
- ✅ **PASS**: All code will be agent-generated (no manual edits)
- ✅ **PASS**: PHRs will be created for all development sessions
- ✅ **PASS**: Implementation traceable to prompts

**Validation**: This plan follows /sp.plan workflow. Tasks will be generated via /sp.tasks.

**GATE STATUS**: ✅ ALL CHECKS PASSED - Proceed to Phase 0 Research

## Complexity Tracking

> **No violations detected** - All constitution checks passed without requiring complexity justification.

The architecture is intentionally simple:
- Single chat endpoint (POST /api/chat)
- Two new database entities (Conversation, Message)
- Agent orchestration via OpenAI Agents SDK (standard pattern)
- Model routing via LiteLLM (standard pattern)
- Integration with existing MCP tools (already implemented)
- Stateless request handling (standard REST pattern)

This simplicity aligns with constitution principles and spec requirements.

---

## Phase 0: Research & Technical Decisions

**Status**: ✅ COMPLETE

**Output**: [research.md](./research.md)

### Key Decisions Made

1. **Agent Orchestration**: OpenAI Agents SDK
   - Stateless per-request instantiation
   - Built-in tool calling support
   - Industry-standard pattern

2. **Model Access**: LiteLLM → Google Gemini
   - Unified interface for all model calls
   - No direct API calls in application code
   - Easy model switching via configuration

3. **Chat UI**: ChatKit React components
   - Pre-built chat interface components
   - Handles common UX patterns
   - Customizable styling

4. **MCP Integration**: Proxy to existing MCP server
   - Reuse feature 005 implementation
   - Agent defines tools, proxies calls to MCP
   - Maintains separation of concerns

5. **Context Management**: Database-backed conversation history
   - Load full history per request
   - Stateless architecture compliant
   - Scalable and auditable

6. **Architecture Pattern**: Stateless REST API
   - No server-side sessions
   - All state in database
   - Horizontally scalable

### Alternatives Considered

- **LangChain** vs OpenAI Agents SDK: Rejected (more complex, harder to maintain stateless)
- **Direct Gemini API** vs LiteLLM: Rejected (violates unified model access requirement)
- **Custom React Components** vs ChatKit: Rejected (reinventing common patterns)

---

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETE

**Outputs**:
- [data-model.md](./data-model.md) - Database entities and relationships
- [contracts/api-endpoints.md](./contracts/api-endpoints.md) - REST API specifications
- [contracts/agent-config.md](./contracts/agent-config.md) - Agent configuration and tool definitions
- [quickstart.md](./quickstart.md) - Integration scenarios and testing workflows

### Data Model Summary

**New Entities**:
1. **Conversation**: Chat session between user and AI
   - Fields: id, user_id, title, created_at, updated_at
   - Relationships: belongs to User, has many Messages

2. **Message**: Single message in conversation
   - Fields: id, conversation_id, role, content, created_at
   - Relationships: belongs to Conversation
   - Role: "user" or "assistant"

**Indexes**:
- `conversations(user_id, updated_at DESC)` - efficient conversation list
- `messages(conversation_id, created_at ASC)` - efficient history loading

### API Contracts Summary

**Endpoints**:
1. `POST /api/chat` - Send message, receive AI response
2. `GET /api/conversations` - List user's conversations
3. `GET /api/conversations/{id}` - Get conversation details
4. `DELETE /api/conversations/{id}` - Delete conversation

**Authentication**: JWT Bearer token required on all endpoints

**Stateless Design**: Each request loads conversation history from database

### Agent Configuration Summary

**System Prompt**: Task management assistant with access to 5 MCP tools

**Tools**: add_task, list_tasks, complete_task, update_task, delete_task

**Model**: gemini/gemini-pro (via LiteLLM)

**Temperature**: 0.7 (balanced creativity and consistency)

---

## Constitution Check (Post-Design)

*Re-validation after Phase 1 design completion*

### Principle VII: Stateless Architecture (NON-NEGOTIABLE)

- ✅ **PASS**: Chat endpoint design is stateless
- ✅ **PASS**: Conversation history loaded from database per request
- ✅ **PASS**: No server-side session storage in design
- ✅ **PASS**: Agent instantiated fresh per request
- ✅ **PASS**: All user context from JWT + database
- ✅ **PASS**: Server restart will not affect functionality

**Post-Design Validation**: Data model and API contracts confirm stateless architecture. No in-memory state required.

### Principle VIII: MCP Tool Primacy (NON-NEGOTIABLE)

- ✅ **PASS**: Agent configuration includes all 5 MCP tools
- ✅ **PASS**: Tool execution proxies to existing MCP server
- ✅ **PASS**: Agent does not access database directly
- ✅ **PASS**: MCP tools enforce user_id filtering
- ✅ **PASS**: Clear separation: agent orchestrates, tools execute

**Post-Design Validation**: Agent configuration contract confirms MCP tool integration. All task operations delegated to MCP server.

### Principle III: User Data Isolation (NON-NEGOTIABLE)

- ✅ **PASS**: Conversation model has user_id foreign key
- ✅ **PASS**: All queries filter by user_id from JWT
- ✅ **PASS**: API contracts show user_id extraction from JWT
- ✅ **PASS**: No client-provided user IDs accepted
- ✅ **PASS**: 403 Forbidden for unauthorized access attempts

**Post-Design Validation**: Data model and API contracts enforce user isolation at database and API layers.

### Principle V: Technology Stack Immutability

- ✅ **PASS**: Next.js 16+ with App Router (frontend)
- ✅ **PASS**: ChatKit for UI (specified)
- ✅ **PASS**: FastAPI (backend)
- ✅ **PASS**: OpenAI Agents SDK (agent orchestration)
- ✅ **PASS**: MCP SDK (existing from feature 005)
- ✅ **PASS**: SQLModel ORM
- ✅ **PASS**: Neon PostgreSQL
- ✅ **PASS**: Better Auth with JWT

**Post-Design Validation**: All technology choices match required stack. No substitutions made.

### Principle I: Correctness & Specification Adherence

- ✅ **PASS**: All 15 functional requirements addressed in design
- ✅ **PASS**: 3 user stories mapped to implementation phases
- ✅ **PASS**: API contracts match REST conventions
- ✅ **PASS**: Success criteria are measurable in design

**Post-Design Validation**: Design artifacts directly map to specification requirements.

### Principle IV: Agentic Development Workflow

- ✅ **PASS**: Following Spec → Plan → Tasks workflow
- ✅ **PASS**: All design artifacts agent-generated
- ✅ **PASS**: PHR will be created for planning session
- ✅ **PASS**: Implementation will be traceable to prompts

**Post-Design Validation**: Planning process follows required workflow. Ready for /sp.tasks.

**FINAL GATE STATUS**: ✅ ALL CHECKS PASSED - Ready for Task Generation

---

## Project Structure

### Documentation (this feature)

```text
specs/006-ai-agent-chat/
├── spec.md                    # Feature specification
├── plan.md                    # This file (implementation plan)
├── research.md                # Phase 0: Technical decisions
├── data-model.md              # Phase 1: Database entities
├── quickstart.md              # Phase 1: Integration scenarios
├── contracts/
│   ├── api-endpoints.md       # REST API specifications
│   └── agent-config.md        # Agent configuration
└── tasks.md                   # Phase 2: Task breakdown (not yet created)
```

### Source Code (to be implemented)

**Backend** (Python/FastAPI):
```text
backend/
├── src/
│   ├── models/
│   │   ├── conversation.py    # NEW: Conversation model
│   │   └── message.py         # NEW: Message model
│   ├── services/
│   │   ├── chat_service.py    # NEW: Chat orchestration
│   │   └── agent_service.py   # NEW: Agent management
│   ├── api/
│   │   └── chat.py            # NEW: Chat endpoints
│   ├── config.py              # EXTEND: Add Gemini/OpenAI keys
│   └── main.py                # EXTEND: Register chat routes
└── tests/
    └── test_chat/             # NEW: Chat tests
```

**Frontend** (Next.js/TypeScript):
```text
frontend/
├── app/
│   └── chat/
│       ├── page.tsx           # NEW: Chat page
│       └── [id]/
│           └── page.tsx       # NEW: Conversation detail page
├── components/
│   ├── ChatInterface.tsx      # NEW: ChatKit integration
│   ├── ConversationList.tsx   # NEW: Conversation sidebar
│   └── MessageBubble.tsx      # NEW: Message display
└── lib/
    └── api/
        └── chat.ts            # NEW: Chat API client
```

---

## Implementation Phases

### Phase 1: Backend Foundation
- Create Conversation and Message models
- Implement database migration
- Set up LiteLLM configuration
- Configure OpenAI Agents SDK

### Phase 2: Chat Endpoint
- Implement POST /api/chat
- Integrate agent orchestration
- Connect to MCP tools
- Add error handling

### Phase 3: Conversation Management
- Implement GET /api/conversations
- Implement GET /api/conversations/{id}
- Implement DELETE /api/conversations/{id}
- Add pagination support

### Phase 4: Frontend Chat UI
- Install and configure ChatKit
- Create chat interface component
- Implement message sending/receiving
- Add loading and error states

### Phase 5: Conversation List
- Create conversation list component
- Implement conversation switching
- Add conversation metadata display
- Handle empty states

### Phase 6: Integration & Testing
- Test full chat flow
- Verify MCP tool integration
- Test statelessness (server restart)
- Test user isolation
- Performance testing

### Phase 7: Polish
- Refine agent prompts
- Improve error messages
- Add conversation titles
- Optimize database queries

---

## Next Steps

1. **Generate Tasks**: Run `/sp.tasks` to create detailed task breakdown
2. **Implementation**: Execute tasks using specialized agents
3. **Testing**: Verify all integration scenarios from quickstart.md
4. **Validation**: Confirm all success criteria from spec.md are met

**Planning Complete**: Ready for task generation phase.

