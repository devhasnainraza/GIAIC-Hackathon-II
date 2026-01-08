# ADR-002: Data Validation Strategy with Pydantic and Custom Exceptions

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-01-08
- **Feature:** 001-console-todo
- **Context:** Phase I requires robust input validation to prevent invalid data from entering the system. The application must validate user inputs at system boundaries (CLI), enforce business rules in the service layer, and ensure data integrity at the model layer. The validation strategy must be type-safe, testable, and provide clear error messages to users. The constitution mandates input validation at all system boundaries (Security-by-Design principle).

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security? YES - affects data integrity and security
     2) Alternatives: Multiple viable options considered with tradeoffs? YES - Pydantic, dataclasses, manual validation
     3) Scope: Cross-cutting concern (not an isolated detail)? YES - affects all layers and error handling
-->

## Decision

Adopt **Pydantic v2 for model validation** with **custom domain exceptions** and **multi-layer validation**:

- **Model Validation**: Pydantic BaseModel with field validators
  - TodoItem model with automatic type checking
  - Field constraints (min_length, max_length, gt for positive IDs)
  - Custom validators for business rules (title trimming, whitespace detection)
  - Automatic datetime generation with default_factory

- **Custom Exceptions**: Domain-specific exception hierarchy
  - `TodoNotFoundError(todo_id)` - raised when todo doesn't exist
  - `EmptyTitleError()` - raised when title is empty or whitespace-only
  - All exceptions include context for debugging and user feedback

- **Validation Layers**: Defense in depth approach
  - CLI Layer: Basic input validation (non-empty strings, numeric IDs)
  - Service Layer: Business rule validation (title not empty after strip)
  - Model Layer: Data integrity validation (Pydantic constraints)

- **Error Handling**: Structured error messages with context
  - Catch Pydantic ValidationError and convert to user-friendly messages
  - Log all validation failures with operation context
  - Display clear error messages in CLI with guidance

## Consequences

### Positive

- **Type Safety**: Pydantic provides runtime type checking and IDE support
- **Automatic Validation**: Field constraints enforced automatically on model creation
- **Clear Error Messages**: Pydantic generates detailed validation error messages
- **Testability**: Easy to test validation rules with pytest and ValidationError assertions
- **Documentation**: Pydantic models serve as self-documenting schemas
- **Future-Ready**: Pydantic models can be serialized to JSON for Phase II REST API
- **Defense in Depth**: Multiple validation layers catch errors early
- **Developer Experience**: Type hints and validation reduce bugs during development

### Negative

- **External Dependency**: Adds Pydantic as a dependency (acceptable per constitution for data validation)
- **Learning Curve**: Developers must understand Pydantic's validation syntax
- **Performance Overhead**: Validation adds minimal overhead (~microseconds per operation)
- **Error Message Complexity**: Pydantic errors can be verbose and need translation for users
- **Version Lock-in**: Pydantic v2 has breaking changes from v1, must maintain compatibility
- **Validation Duplication**: Some validation occurs at multiple layers (intentional but redundant)

## Alternatives Considered

### Alternative A: Python Dataclasses with Manual Validation
- **Structure**: @dataclass with __post_init__ validation methods
- **Pros**: Standard library (no dependencies), simple and familiar
- **Cons**: Manual validation code, no automatic type checking, verbose error handling
- **Why Rejected**: More boilerplate code, less type safety, harder to maintain validation logic

### Alternative B: attrs Library
- **Structure**: @attrs.define with validators and converters
- **Pros**: Lightweight, good validation support, less overhead than Pydantic
- **Cons**: Less popular than Pydantic, no JSON schema generation, smaller ecosystem
- **Why Rejected**: Pydantic is more widely adopted and better suited for future API development

### Alternative C: Manual Validation Functions
- **Structure**: validate_todo(data: dict) -> TodoItem functions
- **Pros**: No dependencies, full control over validation logic
- **Cons**: Verbose, error-prone, no type safety, difficult to maintain
- **Why Rejected**: Violates DRY principle, poor developer experience, high maintenance cost

### Alternative D: JSON Schema Validation
- **Structure**: Define JSON schemas, validate with jsonschema library
- **Pros**: Language-agnostic schemas, good for API contracts
- **Cons**: Separate schema files, no Python type hints, verbose schema definitions
- **Why Rejected**: Over-engineered for Phase I, Pydantic provides better Python integration

### Alternative E: No Validation (Trust User Input)
- **Structure**: Accept all user inputs without validation
- **Pros**: Simplest implementation, no validation overhead
- **Cons**: Violates Security-by-Design principle, allows invalid data, poor user experience
- **Why Rejected**: Unacceptable - constitution mandates input validation at system boundaries

## References

- Feature Spec: [specs/001-console-todo/spec.md](../../specs/001-console-todo/spec.md)
- Implementation Plan: [specs/001-console-todo/plan.md](../../specs/001-console-todo/plan.md)
- Data Model: [specs/001-console-todo/data-model.md](../../specs/001-console-todo/data-model.md)
- Related ADRs: ADR-001 (Layered Architecture)
- Constitution: [.specify/memory/constitution.md](../../.specify/memory/constitution.md) (Principle V: Security-by-Design)
- Evaluator Evidence: [history/prompts/001-console-todo/005-phase-i-implementation.green.prompt.md](../prompts/001-console-todo/005-phase-i-implementation.green.prompt.md)
