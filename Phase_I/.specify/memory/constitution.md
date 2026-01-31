<!--
Sync Impact Report:
- Version: NEW → 1.0.0 (Initial constitution)
- Modified Principles: N/A (new constitution)
- Added Sections: All sections (initial creation)
- Removed Sections: None
- Templates Status:
  ✅ spec-template.md - Reviewed, aligned with principles
  ✅ plan-template.md - Reviewed, Constitution Check section present
  ✅ tasks-template.md - Reviewed, aligned with testing and quality principles
- Follow-up TODOs: None
-->

# AI-Native Multi-Phase Todo Application Platform Constitution

## Core Principles

### I. Correctness First

All features MUST behave exactly as specified and tested. No feature may be considered complete until it passes all acceptance criteria and automated tests. Correctness supersedes speed of delivery.

**Rationale**: In a progressive multi-phase system, each phase builds on the previous. Bugs in early phases compound and block future work. Correctness at each phase ensures a solid foundation.

### II. Simplicity & Progressive Enhancement

Each phase MUST be minimal, readable, and maintainable. Start with the simplest solution that meets requirements. Each phase MUST cleanly build on the previous phase without requiring rewrites.

**Rationale**: Progressive enhancement allows for learning and validation at each stage. Premature complexity creates technical debt and obscures the core functionality being built.

**Rules**:
- No premature optimization
- No unnecessary abstractions
- YAGNI (You Aren't Gonna Need It) principles apply
- Each phase must be independently runnable and documented

### III. Test-Driven Development (NON-NEGOTIABLE)

Unit tests MUST be written for all business logic. Integration tests MUST be written for all APIs. Tests MUST pass before advancing to the next phase.

**Rationale**: In a multi-phase project, untested code becomes a liability that blocks future phases. TDD ensures each component works correctly before integration.

**Rules**:
- Unit tests required for all business logic
- Integration tests required for all API endpoints
- All tests must pass before phase completion
- Test coverage must be maintained across phases

### IV. Observability

Logging, errors, and system behavior MUST be inspectable at all times. Structured logging is required. All errors MUST be logged with sufficient context for debugging.

**Rationale**: As the system grows from console app to distributed cloud system, observability becomes critical for debugging and monitoring.

**Rules**:
- Structured logging required (JSON format preferred)
- All errors must include context (stack traces, request IDs, user context)
- Health check endpoints required for all services
- Metrics collection required for production deployments

### V. Security-by-Design

Follow best practices for secrets management, authentication, and access control. No secrets may be committed to source control. All user data must be protected.

**Rationale**: Security vulnerabilities introduced early are difficult to remediate later. Security must be built in from the start.

**Rules**:
- All secrets MUST be injected via environment variables or secret managers
- No production secrets committed to source control
- Authentication required for all multi-user features (Phase II+)
- Input validation required at all system boundaries
- OWASP Top 10 vulnerabilities must be avoided

### VI. AI Alignment

AI features MUST be safe, explainable, and controllable. No training on or storage of sensitive personal data. AI behavior must be auditable and reversible.

**Rationale**: AI features introduce unique risks around data privacy, bias, and unpredictable behavior. Alignment principles ensure AI enhances rather than compromises the system.

**Rules**:
- No training on sensitive personal data
- AI responses must be auditable (logged with prompts and responses)
- Users must be able to opt out of AI features
- AI features must have fallback mechanisms for failures
- AI costs must be monitored and capped

## Code Standards

### Code Quality

- **Python**: PEP8 compliance, type hints required
- **TypeScript**: ESLint + Prettier, strict mode enabled
- **API Design**: RESTful, versioned, OpenAPI/Swagger documented
- All code must pass linting and formatting checks before commit

### Testing Standards

- **Unit Tests**: Required for all business logic
- **Integration Tests**: Required for all API endpoints
- **Contract Tests**: Required for service boundaries (Phase III+)
- **Test Frameworks**: pytest (Python), Jest (TypeScript)
- All tests must be automated and run in CI/CD

### Documentation Standards

- Each phase MUST include README with setup steps
- Architecture notes required for each phase
- API documentation via OpenAPI/Swagger (Phase II+)
- Inline code comments only where logic is non-obvious

### Data Modeling Standards

- Typed models with validation (Pydantic / SQLModel)
- Schema migrations must be versioned and reversible
- No raw SQL queries; use ORM (SQLModel for Phase II+)

### Containerization Standards

- Dockerfiles must be minimal, reproducible, and secure
- Multi-stage builds required for production images
- No secrets in Docker images
- Base images must be from trusted sources and regularly updated

### Infrastructure as Code Standards

- Helm charts and manifests must be declarative and versioned
- All infrastructure changes must be code-reviewed
- Infrastructure must be reproducible from scratch

## Phase Constraints

### Phase I: In-Memory Python Console App

- MUST be fully in-memory (no database, no filesystem persistence)
- MUST support create/read/update/delete/list and search operations
- MUST use Python with Claude Code and Spec-Kit Plus

### Phase II: Full-Stack Web Application

- MUST use Neon as the primary database
- MUST use SQLModel for ORM
- MUST support authentication and multi-user Todo management
- MUST use Next.js (frontend) and FastAPI (backend)

### Phase III: AI-Powered Todo Chatbot

- MUST integrate via official OpenAI SDKs
- MUST use MCP (Model Context Protocol) where applicable
- MUST support conversational query, create, and summarize operations
- MUST use OpenAI ChatKit and Agents SDK

### Phase IV: Local Kubernetes Deployment

- MUST run fully locally using Minikube
- MUST deploy with one command
- MUST pass health checks
- MUST use Docker, Helm, kubectl-ai, and kagent

### Phase V: Advanced Cloud Deployment

- MUST support async messaging (Kafka)
- MUST use Dapr for service mesh
- MUST deploy to DigitalOcean DOKS
- MUST support scaling and zero-downtime deploys

## Quality Gates

All phases MUST pass these gates before completion:

- **Linting**: All code passes linting and formatting checks
- **Testing**: All tests pass (unit, integration, contract as applicable)
- **Documentation**: README, setup steps, and architecture notes complete
- **Deployability**: System can be deployed from scratch following documentation
- **Independence**: Phase can be run independently without requiring future phases

## Non-Goals

- No premature optimization
- No unnecessary abstractions
- No production secrets committed to source control
- No vendor lock-in beyond explicitly stated services (Neon, DigitalOcean)

## Ethical & Safety Guidelines

- No training on or storage of sensitive personal data
- User data must be protected according to security principles
- AI features must respect user privacy and consent
- System must be transparent about AI usage
- Users must have control over their data (export, delete)

## Governance

This constitution supersedes all other development practices. All pull requests and code reviews MUST verify compliance with these principles.

**Amendment Process**:
- Amendments require documentation of rationale and impact
- Amendments require approval from project stakeholders
- Amendments require migration plan for existing code
- Version must be incremented according to semantic versioning

**Compliance Review**:
- All PRs must pass quality gates
- Complexity must be justified against Simplicity principle
- Security vulnerabilities must be addressed before merge
- Phase constraints must be respected

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
