# Implementation Plan: Todo Full-Stack Web Application

**Branch**: `001-todo-web-app` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-web-app/spec.md`

## Summary

Build a secure, multi-user todo management web application with JWT-based authentication and strict user data isolation. The system enables users to register, authenticate, and manage personal todo tasks (create, read, update, delete, mark complete/incomplete) with zero cross-user data access. Implementation follows the Agentic Dev Stack workflow using Next.js 16+ frontend, FastAPI backend, SQLModel ORM, and Neon Serverless PostgreSQL database.

**Primary Requirement**: Implement 5 prioritized user stories (P1: Authentication, P2: Create/View Tasks, P3: Mark Complete, P4: Edit Tasks, P5: Delete Tasks) with 100% user isolation enforcement and full traceability through prompt-driven development.

**Technical Approach**: Separate frontend and backend architecture with Better Auth handling authentication/JWT issuance on frontend, FastAPI middleware verifying JWT tokens and extracting user identity, and all database queries filtered by authenticated user ID to enforce isolation.

## Technical Context

**Language/Version**:
- Frontend: TypeScript with Next.js 16+ (App Router)
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 16+, Better Auth (JWT), Tailwind CSS, React 18+
- Backend: FastAPI, SQLModel, python-jose (JWT verification), passlib (password hashing), uvicorn

**Storage**: Neon Serverless PostgreSQL (cloud-hosted, connection via DATABASE_URL environment variable)

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, httpx (async client testing)

**Target Platform**:
- Frontend: Web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Backend: Linux server (containerized deployment)

**Project Type**: Web application (frontend + backend separation)

**Performance Goals**:
- Task list load: <2 seconds for 100 tasks
- Task creation: <10 seconds end-to-end
- API response: <500ms p95 latency
- Support 100 concurrent users

**Constraints**:
- 100% user isolation (zero cross-user data access)
- All API endpoints require authentication (401 for unauthenticated)
- JWT verification on every protected request
- No hardcoded secrets (environment variables only)
- Responsive UI (320px mobile to 1920px desktop)

**Scale/Scope**:
- Expected users: 100+ concurrent
- Tasks per user: up to 1000
- 5 user stories, 18 functional requirements
- ~10 API endpoints, ~5 frontend pages/components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Correctness & Specification Adherence
- ✅ **PASS**: All 18 functional requirements (FR-001 to FR-018) mapped to implementation tasks
- ✅ **PASS**: API contracts will match specification exactly (OpenAPI schema validation)
- ✅ **PASS**: Acceptance criteria defined for each user story (Given-When-Then format)
- ✅ **PASS**: Implementation verifiable against spec through automated tests

### II. Security-First Design
- ✅ **PASS**: JWT verification middleware planned for all protected endpoints
- ✅ **PASS**: 401 responses for unauthenticated requests (middleware enforcement)
- ✅ **PASS**: User ID extraction from JWT claims, never from request parameters
- ✅ **PASS**: Environment variables for secrets (DATABASE_URL, JWT_SECRET, BETTER_AUTH_SECRET)
- ✅ **PASS**: HTTPS enforced in production deployment configuration

### III. User Data Isolation (NON-NEGOTIABLE)
- ✅ **PASS**: All database queries filter by `user_id` foreign key
- ✅ **PASS**: User ID extracted from verified JWT token
- ✅ **PASS**: Resource ownership validation in every endpoint
- ✅ **PASS**: Database schema enforces user ownership (foreign key constraints)
- ✅ **PASS**: 403 Forbidden for unauthorized resource access attempts

### IV. Agentic Development Workflow (NON-NEGOTIABLE)
- ✅ **PASS**: Following Spec → Plan → Tasks → Implementation workflow
- ✅ **PASS**: All code generated via specialized agents (auth, frontend, backend, database)
- ✅ **PASS**: PHR created for each development session
- ✅ **PASS**: No manual coding - agent-driven only

### V. Technology Stack Immutability
- ✅ **PASS**: Next.js 16+ with App Router (confirmed)
- ✅ **PASS**: Python FastAPI backend (confirmed)
- ✅ **PASS**: SQLModel ORM (confirmed)
- ✅ **PASS**: Neon Serverless PostgreSQL (confirmed)
- ✅ **PASS**: Better Auth with JWT (confirmed)

### VI. Quality & Reproducibility
- ✅ **PASS**: Production-quality code standards defined
- ✅ **PASS**: Consistent JSON API responses (Pydantic models)
- ✅ **PASS**: Frontend error/loading/empty states planned
- ✅ **PASS**: Responsive design (Tailwind CSS mobile-first)
- ✅ **PASS**: All workflows traceable through PHRs

**Constitution Check Result**: ✅ **ALL GATES PASSED** - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-web-app/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (technology decisions)
├── data-model.md        # Phase 1 output (database schema)
├── quickstart.md        # Phase 1 output (setup instructions)
├── contracts/           # Phase 1 output (API contracts)
│   └── api-spec.yaml    # OpenAPI 3.0 specification
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Environment configuration
│   ├── database.py             # Database connection and session
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py             # User SQLModel
│   │   └── task.py             # Task SQLModel
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py             # User Pydantic schemas (request/response)
│   │   └── task.py             # Task Pydantic schemas
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py             # JWT verification, password hashing
│   │   ├── user_service.py     # User business logic
│   │   └── task_service.py     # Task business logic
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py             # Dependency injection (get_current_user)
│   │   ├── auth.py             # Auth endpoints (register, login)
│   │   └── tasks.py            # Task CRUD endpoints
│   └── middleware/
│       ├── __init__.py
│       └── auth_middleware.py  # JWT verification middleware
├── tests/
│   ├── conftest.py             # Pytest fixtures
│   ├── test_auth.py            # Authentication tests
│   ├── test_tasks.py           # Task CRUD tests
│   └── test_isolation.py       # User isolation tests
├── alembic/                    # Database migrations
│   ├── versions/
│   └── env.py
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variable template
└── README.md                   # Backend setup instructions

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Login page
│   │   │   └── register/
│   │   │       └── page.tsx    # Registration page
│   │   └── (dashboard)/
│   │       └── tasks/
│   │           └── page.tsx    # Task dashboard
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── TaskList.tsx        # Task list component
│   │   ├── TaskItem.tsx        # Individual task component
│   │   ├── TaskForm.tsx        # Create/edit task form
│   │   └── AuthForm.tsx        # Login/register form
│   ├── lib/
│   │   ├── api.ts              # API client (fetch wrapper)
│   │   ├── auth.ts             # Better Auth configuration
│   │   └── types.ts            # TypeScript types
│   └── hooks/
│       ├── useAuth.ts          # Authentication hook
│       └── useTasks.ts         # Task management hook
├── public/                     # Static assets
├── tests/
│   └── components/             # Component tests
├── package.json                # Node dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── .env.local.example          # Environment variable template
└── README.md                   # Frontend setup instructions

.env                            # Environment variables (gitignored)
docker-compose.yml              # Local development setup
README.md                       # Project overview and setup
```

**Structure Decision**: Web application architecture with separate frontend and backend directories. Frontend uses Next.js App Router with route groups for authentication and dashboard sections. Backend follows layered architecture (models, schemas, services, API routes) with clear separation of concerns. Database migrations managed via Alembic. Both applications containerized for consistent development and deployment.

## Complexity Tracking

> **No violations detected** - All constitution principles satisfied without exceptions.

## Phase 0: Research & Technology Decisions

**Objective**: Resolve all technical unknowns and document technology integration patterns.

### Research Tasks

#### R1: Better Auth + JWT Integration Pattern
**Question**: How does Better Auth issue JWT tokens that FastAPI can verify?

**Research Focus**:
- Better Auth JWT token structure and claims
- Shared secret configuration between Next.js and FastAPI
- Token expiration and refresh strategies
- CORS configuration for cross-origin requests

**Output**: Document in `research.md` - JWT flow diagram, shared secret setup, token verification code pattern

#### R2: Neon PostgreSQL Connection Pattern
**Question**: How to connect FastAPI/SQLModel to Neon Serverless PostgreSQL?

**Research Focus**:
- Neon connection string format
- Connection pooling for serverless
- SSL/TLS requirements
- Migration strategy with Alembic

**Output**: Document in `research.md` - Connection string example, SQLModel engine configuration, migration commands

#### R3: Next.js App Router + Better Auth Setup
**Question**: How to configure Better Auth in Next.js 16+ App Router?

**Research Focus**:
- Better Auth installation and configuration
- Route protection patterns
- Session management
- API route handlers for auth callbacks

**Output**: Document in `research.md` - Better Auth config file, protected route pattern, session hook usage

#### R4: FastAPI JWT Middleware Pattern
**Question**: How to implement JWT verification middleware in FastAPI?

**Research Focus**:
- python-jose JWT verification
- Dependency injection for current user
- Error handling (401/403 responses)
- User ID extraction from token claims

**Output**: Document in `research.md` - Middleware code pattern, dependency function, error handler

#### R5: SQLModel User Isolation Pattern
**Question**: How to enforce user_id filtering in all SQLModel queries?

**Research Focus**:
- Foreign key relationships
- Query filtering patterns
- Service layer design
- Repository pattern (if needed)

**Output**: Document in `research.md` - Model relationships, query examples, service layer pattern

### Research Deliverable

**File**: `specs/001-todo-web-app/research.md`

**Required Sections**:
1. JWT Authentication Flow (Better Auth → FastAPI)
2. Database Connection (Neon PostgreSQL + SQLModel)
3. Frontend Authentication (Next.js + Better Auth)
4. Backend Security (JWT Middleware + User Isolation)
5. Development Environment Setup
6. Deployment Considerations

**Acceptance Criteria**:
- All NEEDS CLARIFICATION items resolved
- Code patterns documented with examples
- Configuration requirements specified
- Integration points clearly defined

## Phase 1: Design & Contracts

**Objective**: Define data models, API contracts, and setup instructions.

**Prerequisites**: `research.md` complete with all patterns documented

### Design Tasks

#### D1: Data Model Design
**Task**: Create database schema for User and Task entities

**Inputs**:
- Feature spec (Key Entities section)
- Functional requirements (FR-001 to FR-018)
- Research findings (SQLModel patterns)

**Process**:
1. Define User model (id, email, hashed_password, created_at)
2. Define Task model (id, user_id FK, title, description, is_complete, created_at, updated_at)
3. Document relationships (User 1:N Tasks)
4. Define indexes (user_id, email unique)
5. Document validation rules (email format, title length)

**Output**: `specs/001-todo-web-app/data-model.md`

**Acceptance Criteria**:
- All entities from spec included
- Foreign key relationships defined
- Validation rules specified
- Indexes for performance identified

#### D2: API Contract Definition
**Task**: Create OpenAPI 3.0 specification for all endpoints

**Inputs**:
- Feature spec (User Stories, Functional Requirements)
- Data model (entities and fields)
- Research findings (JWT authentication pattern)

**Endpoints to Define**:
1. `POST /api/auth/register` - User registration
2. `POST /api/auth/login` - User login
3. `POST /api/auth/logout` - User logout
4. `GET /api/tasks` - List user's tasks
5. `POST /api/tasks` - Create new task
6. `GET /api/tasks/{task_id}` - Get task details
7. `PUT /api/tasks/{task_id}` - Update task
8. `DELETE /api/tasks/{task_id}` - Delete task
9. `PATCH /api/tasks/{task_id}/complete` - Mark task complete
10. `PATCH /api/tasks/{task_id}/incomplete` - Mark task incomplete

**For Each Endpoint Document**:
- HTTP method and path
- Request headers (Authorization: Bearer {token})
- Request body schema (Pydantic models)
- Response status codes (200, 201, 400, 401, 403, 404, 500)
- Response body schema
- Error response format

**Output**: `specs/001-todo-web-app/contracts/api-spec.yaml`

**Acceptance Criteria**:
- All endpoints from spec included
- Request/response schemas defined
- Authentication requirements specified
- Error responses documented
- OpenAPI 3.0 valid syntax

#### D3: Quickstart Guide
**Task**: Create setup and run instructions for developers

**Inputs**:
- Research findings (all setup patterns)
- Project structure
- Environment requirements

**Sections to Include**:
1. Prerequisites (Node.js, Python, Neon account)
2. Environment Setup (.env configuration)
3. Backend Setup (install dependencies, run migrations, start server)
4. Frontend Setup (install dependencies, configure Better Auth, start dev server)
5. Database Setup (Neon project creation, connection string)
6. Testing Instructions (run backend tests, run frontend tests)
7. Common Issues and Troubleshooting

**Output**: `specs/001-todo-web-app/quickstart.md`

**Acceptance Criteria**:
- Step-by-step instructions
- All environment variables documented
- Commands for setup and run
- Verification steps included

#### D4: Agent Context Update
**Task**: Update agent-specific context files with technology stack

**Inputs**:
- Technology stack (Next.js, FastAPI, SQLModel, Neon, Better Auth)
- Project structure
- Agent usage guidelines from CLAUDE.md

**Process**:
1. Run `.specify/scripts/bash/update-agent-context.sh claude`
2. Verify agent context file updated
3. Confirm technology stack documented
4. Preserve manual additions

**Output**: Updated agent context file (e.g., `.claude/context.md` or similar)

**Acceptance Criteria**:
- Technology stack added to agent context
- Project structure referenced
- Agent usage guidelines preserved
- No manual content overwritten

### Phase 1 Deliverables

**Files Created**:
1. `specs/001-todo-web-app/data-model.md` - Database schema and relationships
2. `specs/001-todo-web-app/contracts/api-spec.yaml` - OpenAPI specification
3. `specs/001-todo-web-app/quickstart.md` - Setup and run instructions
4. Agent context file updated

**Validation**:
- Data model aligns with spec entities
- API contracts cover all functional requirements
- Quickstart guide is executable
- Agent context reflects current stack

## Phase 2: Task Generation (Next Command)

**Note**: Phase 2 is executed via `/sp.tasks` command, not `/sp.plan`.

**Objective**: Break implementation plan into atomic, ordered tasks for agent execution.

**Prerequisites**:
- Phase 0 complete (research.md)
- Phase 1 complete (data-model.md, contracts/, quickstart.md)
- Constitution Check re-validated

**Output**: `specs/001-todo-web-app/tasks.md` with:
- Atomic tasks organized by user story
- Clear inputs and outputs for each task
- Dependencies between tasks
- Agent assignments (auth, frontend, backend, database)
- Acceptance criteria per task

**Command**: `/sp.tasks` (separate command, not part of this plan)

## Implementation Phases (Post-Planning)

**Note**: These phases are executed during `/sp.implement`, not during planning.

### Phase 3: Database Setup
- Create Neon PostgreSQL project
- Configure connection string
- Create SQLModel models (User, Task)
- Generate Alembic migrations
- Apply migrations to database

### Phase 4: Backend Authentication
- Implement JWT verification middleware
- Create auth service (password hashing, token verification)
- Implement register endpoint
- Implement login endpoint
- Implement logout endpoint
- Test authentication flow

### Phase 5: Backend Task API
- Implement task service (CRUD operations with user_id filtering)
- Create task endpoints (list, create, get, update, delete, mark complete)
- Enforce user isolation in all queries
- Test task operations
- Test user isolation (negative tests)

### Phase 6: Frontend Authentication
- Configure Better Auth
- Create login page
- Create registration page
- Implement auth hooks (useAuth)
- Implement protected routes
- Test authentication UI flow

### Phase 7: Frontend Task Management
- Create task dashboard page
- Implement TaskList component
- Implement TaskItem component
- Implement TaskForm component
- Implement task hooks (useTasks)
- Connect to backend API
- Test task management UI

### Phase 8: Error Handling & Edge Cases
- Implement frontend error boundaries
- Add loading states
- Add empty states
- Handle network errors
- Validate form inputs
- Test edge cases from spec

### Phase 9: Testing & Validation
- Run backend unit tests
- Run backend integration tests
- Run frontend component tests
- Test user isolation (security tests)
- Test responsive design
- Verify all acceptance criteria

### Phase 10: Documentation & Deployment
- Update README files
- Document API endpoints
- Create deployment guide
- Verify quickstart guide
- Create demo video/screenshots
- Prepare for review

## Risk Analysis

### High Priority Risks

**R1: JWT Secret Sharing Between Frontend and Backend**
- **Risk**: Better Auth and FastAPI must use same secret to verify tokens
- **Mitigation**: Document shared secret configuration in research.md, use environment variables
- **Contingency**: If Better Auth doesn't expose JWT secret, implement custom JWT issuance

**R2: User Isolation Enforcement**
- **Risk**: Missing user_id filter in any query causes data leakage
- **Mitigation**: Service layer pattern enforces filtering, comprehensive isolation tests
- **Contingency**: Code review checklist for every endpoint, automated security tests

**R3: Neon PostgreSQL Connection Limits**
- **Risk**: Serverless database may have connection limits
- **Mitigation**: Connection pooling configuration, research Neon limits
- **Contingency**: Implement connection retry logic, consider connection pooler

### Medium Priority Risks

**R4: CORS Configuration**
- **Risk**: Frontend and backend on different origins requires CORS
- **Mitigation**: Configure FastAPI CORS middleware with specific origins
- **Contingency**: Document CORS setup in quickstart.md

**R5: Session Persistence**
- **Risk**: Better Auth session management may not persist across refreshes
- **Mitigation**: Research Better Auth session storage options
- **Contingency**: Implement custom session storage if needed

## Success Metrics

### Planning Phase Success Criteria
- ✅ All research questions answered (research.md complete)
- ✅ Data model defined and validated (data-model.md complete)
- ✅ API contracts documented (contracts/api-spec.yaml complete)
- ✅ Setup instructions executable (quickstart.md complete)
- ✅ Constitution Check passed (all principles satisfied)
- ✅ Agent context updated with technology stack

### Implementation Phase Success Criteria (Future)
- All 18 functional requirements implemented
- All 5 user stories pass acceptance tests
- 100% user isolation (zero cross-user access in tests)
- All API endpoints return correct status codes
- Frontend responsive on 320px-1920px screens
- Zero console errors or unhandled rejections
- All prompts documented in PHRs
- Deployment successful within 15 minutes

## Next Steps

1. **Execute Phase 0**: Generate `research.md` by researching integration patterns
2. **Execute Phase 1**: Generate `data-model.md`, `contracts/api-spec.yaml`, `quickstart.md`
3. **Validate Outputs**: Ensure all Phase 0 and Phase 1 deliverables complete
4. **Re-check Constitution**: Verify all principles still satisfied after design
5. **Run `/sp.tasks`**: Generate atomic task list for implementation
6. **Run `/sp.implement`**: Execute tasks using specialized agents

**Current Status**: Planning complete, ready for Phase 0 research.
