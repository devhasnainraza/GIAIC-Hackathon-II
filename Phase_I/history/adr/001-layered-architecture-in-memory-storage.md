# ADR-001: Layered Architecture with In-Memory Storage

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-01-08
- **Feature:** 001-console-todo
- **Context:** Phase I requires a simple, testable console application with in-memory storage. The application must support full CRUD operations, be easy to understand for reviewers, and provide a clean foundation for Phase II (web application with SQLite persistence). The architecture must enforce separation of concerns while avoiding over-engineering.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security? YES - defines system structure for all phases
     2) Alternatives: Multiple viable options considered with tradeoffs? YES - monolithic, 3-layer, repository pattern
     3) Scope: Cross-cutting concern (not an isolated detail)? YES - affects all components and future phases
-->

## Decision

Adopt a **4-layer architecture** with **dict-based in-memory storage** and **auto-incrementing integer IDs**:

- **Architecture Pattern**: 4-layer separation (CLI → Services → Store → Models)
  - CLI Layer: User interaction, input/output, menu display
  - Services Layer: Business logic, validation, orchestration
  - Store Layer: In-memory data management, CRUD operations
  - Models Layer: Domain entities, data validation

- **Storage Implementation**: Python Dict[int, TodoItem] for O(1) lookups
  - In-memory only (no persistence to disk or database)
  - Auto-incrementing integer IDs starting from 1
  - Counter-based ID generation (_next_id tracker)

- **Data Flow**: Unidirectional (User → CLI → Services → Store → Models)
  - Each layer only communicates with adjacent layers
  - No layer bypassing (CLI cannot access Store directly)

## Consequences

### Positive

- **Testability**: Each layer can be tested independently with clear boundaries
- **Simplicity**: Straightforward architecture appropriate for educational/demo application
- **Performance**: Dict provides O(1) lookups by ID, sufficient for 100+ todos
- **Maintainability**: Clear separation of concerns makes code easy to understand and modify
- **Future-Ready**: Clean architecture enables Phase II transition to SQLite (only Store layer changes)
- **Type Safety**: Strong typing at layer boundaries with type hints
- **Low Complexity**: No unnecessary abstractions, follows YAGNI principle

### Negative

- **Memory Constraints**: All data lost on exit, limited by process memory
- **No Persistence**: Cannot save todos between sessions (intentional for Phase I)
- **ID Collision Risk**: Auto-incrementing IDs reset on restart (acceptable for in-memory)
- **Scalability Limits**: Dict-based storage not suitable for large datasets (>10,000 items)
- **Layer Overhead**: 4 layers may seem excessive for simple CRUD operations
- **Refactoring Cost**: Changing architecture later requires touching multiple layers

## Alternatives Considered

### Alternative A: Monolithic Single-File Application
- **Structure**: All logic in main.py (functions for CRUD, no classes)
- **Pros**: Simplest possible implementation, minimal code
- **Cons**: Poor testability, no separation of concerns, difficult to extend for Phase II
- **Why Rejected**: Violates Simplicity principle (hard to maintain), poor foundation for future phases

### Alternative B: 3-Layer Architecture (No Services Layer)
- **Structure**: CLI → Store → Models (business logic in Store)
- **Pros**: One less layer, slightly simpler
- **Cons**: Store layer becomes bloated with business logic, harder to test validation separately
- **Why Rejected**: Mixing data access and business logic violates single responsibility principle

### Alternative C: Repository Pattern with Interfaces
- **Structure**: Abstract repository interfaces, dependency injection
- **Pros**: More flexible, easier to swap storage implementations
- **Cons**: Over-engineered for Phase I, adds unnecessary complexity
- **Why Rejected**: Violates YAGNI principle, too complex for in-memory console app

### Alternative D: List-Based Storage with Linear Search
- **Structure**: List[TodoItem] instead of Dict[int, TodoItem]
- **Pros**: Simpler data structure, natural ordering
- **Cons**: O(n) lookups by ID, slower for update/delete operations
- **Why Rejected**: Performance degradation with 100+ todos, dict provides better performance

## References

- Feature Spec: [specs/001-console-todo/spec.md](../../specs/001-console-todo/spec.md)
- Implementation Plan: [specs/001-console-todo/plan.md](../../specs/001-console-todo/plan.md)
- Related ADRs: ADR-002 (Data Validation Strategy)
- Evaluator Evidence: [history/prompts/001-console-todo/002-phase-i-console-todo-implementation-plan.plan.prompt.md](../prompts/001-console-todo/002-phase-i-console-todo-implementation-plan.plan.prompt.md)
