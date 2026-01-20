<!--
Sync Impact Report - Constitution v1.0.0
========================================
Version Change: Initial → 1.0.0
Created: 2026-01-09

New Sections:
- Core Principles (6 principles defined)
- Security Requirements
- Quality Standards
- Development Constraints
- Governance

Templates Status:
✅ plan-template.md - Constitution Check section aligns with principles
✅ spec-template.md - Requirements structure supports security and user isolation
✅ tasks-template.md - Task organization supports agentic workflow and testing

Follow-up Actions:
- None - all placeholders resolved
- Constitution ready for use in development workflow
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Correctness & Specification Adherence

**All features MUST behave exactly as specified in requirements documents.**

- Every API endpoint MUST match the defined REST contract precisely
- All functional requirements MUST be implemented without deviation
- Any ambiguity in specifications MUST be clarified before implementation
- Implementation MUST be verifiable against acceptance criteria
- No feature may be considered complete until it passes all specified tests

**Rationale**: In a hackathon evaluation context, correctness is paramount. Reviewers must be able to verify that prompts produce the exact specified behavior. Deviation from specifications, even if technically superior, fails the reproducibility requirement.

### II. Security-First Design

**Security MUST be enforced at every layer; no unauthorized data access is acceptable.**

- JWT tokens MUST be verified on every protected request
- All endpoints MUST return 401 Unauthorized for unauthenticated requests
- Backend MUST extract user identity from verified JWT, never trust client-provided IDs
- All secrets MUST be stored in environment variables (`.env` files)
- No hardcoded credentials, API keys, or tokens in source code
- HTTPS MUST be used for all token transmission in production

**Rationale**: Security violations are disqualifying. A single endpoint that leaks another user's data invalidates the entire submission. Security must be architectural, not an afterthought.

### III. User Data Isolation (NON-NEGOTIABLE)

**Each user MUST only access their own data; cross-user data leakage is a critical failure.**

- All database queries MUST filter by authenticated user ID
- User ID MUST be extracted from verified JWT token, not request parameters
- API endpoints MUST validate that requested resource belongs to authenticated user
- No endpoint may return, modify, or delete another user's data
- Database foreign keys MUST enforce user ownership relationships

**Rationale**: User isolation is the core security requirement. This principle is non-negotiable and must be verified in every API endpoint. Failure here means complete project failure.

### IV. Agentic Development Workflow (NON-NEGOTIABLE)

**All code MUST be generated through Claude Code and Spec-Kit Plus; no manual coding allowed.**

- Every implementation MUST follow: Spec → Plan → Tasks → Implementation workflow
- All code changes MUST be traceable to specific prompts
- Prompt History Records (PHRs) MUST be created for all development sessions
- Iterations and refinements MUST be documented in PHR files
- Manual code edits invalidate the submission

**Rationale**: The hackathon evaluates the agentic development process, not just the final product. Reproducibility requires that any reviewer can follow the same prompts and achieve the same result. Manual coding breaks this chain of evidence.

### V. Technology Stack Immutability

**The specified technology stack MUST NOT change; substitutions are not permitted.**

**Required Stack:**
- **Frontend**: Next.js 16+ with App Router (not Pages Router)
- **Backend**: Python FastAPI (not Flask, Django, or alternatives)
- **ORM**: SQLModel (not SQLAlchemy directly, Prisma, or alternatives)
- **Database**: Neon Serverless PostgreSQL (not local PostgreSQL, MySQL, or alternatives)
- **Authentication**: Better Auth with JWT (not NextAuth, Passport, or custom solutions)

**Rationale**: Stack consistency ensures fair evaluation. Changing technologies invalidates comparisons between submissions and may introduce unfair advantages or disadvantages.

### VI. Quality & Reproducibility

**Code MUST be production-quality, well-structured, and fully reproducible.**

- Code MUST be logically correct and free of critical bugs
- API responses MUST use consistent JSON structures
- Frontend MUST handle loading, error, and empty states gracefully
- Application MUST be responsive (desktop and mobile)
- No console errors or unhandled promise rejections
- All workflows MUST be traceable through prompts and PHRs

**Rationale**: Quality demonstrates that agentic development can produce production-ready code. Reproducibility ensures that the process, not just the product, is being evaluated.

## Security Requirements

### Authentication Flow

1. **User Registration/Login**
   - User submits credentials via Next.js frontend
   - Better Auth validates credentials and creates session
   - Better Auth issues JWT token with user claims
   - Frontend stores token securely (httpOnly cookie preferred)

2. **API Request Authorization**
   - Frontend includes JWT in `Authorization: Bearer <token>` header
   - Backend middleware extracts and verifies JWT signature
   - Backend decodes token to extract user ID and claims
   - Backend validates token expiry and signature

3. **Data Access Control**
   - Backend matches authenticated user ID with resource ownership
   - Database queries filter by `user_id` foreign key
   - Unauthorized access attempts return 403 Forbidden
   - Missing authentication returns 401 Unauthorized

### Security Validation Checklist

Every protected endpoint MUST pass these checks:

- [ ] Requires `Authorization: Bearer <token>` header
- [ ] Returns 401 if token missing or invalid
- [ ] Verifies JWT signature using shared secret
- [ ] Checks token expiration
- [ ] Extracts user ID from token claims
- [ ] Filters database queries by authenticated user ID
- [ ] Returns 403 if user attempts to access another user's resource
- [ ] Never trusts client-provided user IDs in request body or URL

## Quality Standards

### API Design

- **Consistency**: All endpoints follow RESTful conventions
- **Error Handling**: Structured error responses with appropriate HTTP status codes
- **Validation**: Request validation using Pydantic models
- **Documentation**: OpenAPI/Swagger documentation auto-generated by FastAPI

### Frontend Standards

- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Loading States**: Show loading indicators during async operations
- **Error States**: Display user-friendly error messages
- **Empty States**: Provide guidance when no data exists
- **Form Validation**: Client-side validation with clear error messages

### Code Quality

- **Readability**: Clear variable names, logical structure, appropriate comments
- **Modularity**: Separation of concerns (models, services, routes, components)
- **Error Handling**: Graceful degradation, no unhandled exceptions
- **Type Safety**: TypeScript on frontend, type hints on backend

## Development Constraints

### Workflow Requirements

1. **Specification Phase** (`/sp.specify`)
   - Define user stories with acceptance criteria
   - Identify functional requirements
   - Establish success criteria

2. **Planning Phase** (`/sp.plan`)
   - Research existing codebase patterns
   - Design architecture and data models
   - Define API contracts
   - Document technical decisions

3. **Task Generation** (`/sp.tasks`)
   - Break plan into atomic, testable tasks
   - Organize tasks by user story
   - Identify parallel execution opportunities

4. **Implementation Phase** (`/sp.implement`)
   - Execute tasks using specialized agents
   - Create PHRs for each development session
   - Verify each task against acceptance criteria

### Agent Usage

- **Authentication**: Use `auth-security-specialist` for all auth-related tasks
- **Frontend**: Use `nextjs-ui-builder` for UI components and pages
- **Backend**: Use `fastapi-backend-dev` for API endpoints and business logic
- **Database**: Use `neon-db-architect` for schema design and queries

### Prohibited Practices

- ❌ Manual code editing outside Claude Code workflow
- ❌ Changing the technology stack
- ❌ Implementing features not in the specification
- ❌ Hardcoding secrets or credentials
- ❌ Trusting client-provided user IDs
- ❌ Skipping authentication on protected endpoints
- ❌ Allowing cross-user data access

## Governance

### Amendment Process

This constitution may be amended only through documented decision-making:

1. Proposed changes MUST be documented with rationale
2. Impact on existing code and workflows MUST be assessed
3. Version number MUST be incremented according to semantic versioning:
   - **MAJOR**: Breaking changes to principles or workflow
   - **MINOR**: New principles or significant expansions
   - **PATCH**: Clarifications, typos, non-semantic refinements
4. All dependent templates MUST be updated for consistency
5. Amendment MUST be recorded in Sync Impact Report

### Compliance Verification

All development work MUST verify compliance with this constitution:

- **During Planning**: Constitution Check section in `plan.md`
- **During Implementation**: Each task references applicable principles
- **During Review**: Verify no principle violations occurred
- **Before Deployment**: Security checklist validation

### Conflict Resolution

In case of conflicting requirements:

1. **Security principles override all other concerns**
2. **User data isolation is non-negotiable**
3. **Specification adherence takes precedence over technical preferences**
4. **When unclear, ask for clarification rather than assume**

### Complexity Justification

Any violation of simplicity or standard patterns MUST be justified:

- Document the specific problem requiring complexity
- Explain why simpler alternatives were insufficient
- Record decision in Architecture Decision Record (ADR)
- Include in Constitution Check section of plan.md

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
