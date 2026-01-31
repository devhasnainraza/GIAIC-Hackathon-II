---

description: "Task list for Phase I - In-Memory Console Todo Application"
---

# Tasks: Phase I - In-Memory Console Todo Application

**Input**: Design documents from `/specs/001-console-todo/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/cli-interface.md, research.md, quickstart.md

**Tests**: Tests are REQUIRED per constitution (Principle III: Test-Driven Development - NON-NEGOTIABLE). Unit tests must be written for all business logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `todo_app/`, `tests/` at repository root
- Paths shown below use single project structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize UV project with Python 3.13+ in repository root
- [ ] T002 Create project structure: todo_app/, tests/unit/, tests/integration/, main.py
- [ ] T003 [P] Add Pydantic dependency via uv add pydantic
- [ ] T004 [P] Add dev dependencies via uv add --dev pytest pytest-cov black flake8 mypy
- [ ] T005 [P] Configure pyproject.toml with tool settings for black, flake8, mypy, pytest
- [ ] T006 [P] Create .gitignore with Python, UV, and IDE entries
- [ ] T007 [P] Create todo_app/__init__.py as empty package marker
- [ ] T008 [P] Create tests/__init__.py as empty package marker
- [ ] T009 [P] Create tests/unit/__init__.py as empty package marker
- [ ] T010 [P] Create tests/integration/__init__.py as empty package marker

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 [P] Create custom exceptions in todo_app/exceptions.py (TodoNotFoundError, InvalidTodoError, EmptyTitleError)
- [ ] T012 [P] Configure logging in todo_app/logging_config.py with structured format
- [ ] T013 [P] Create pytest fixtures in tests/conftest.py (sample_todo, empty_store, populated_store)
- [ ] T014 [P] Create todo_app/models/__init__.py as empty package marker
- [ ] T015 [P] Create todo_app/store/__init__.py as empty package marker
- [ ] T016 [P] Create todo_app/services/__init__.py as empty package marker
- [ ] T017 [P] Create todo_app/cli/__init__.py as empty package marker

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Todos (Priority: P1) 🎯 MVP

**Goal**: Users can add new todos and view them in a list

**Independent Test**: Launch application, add several todos with different titles/descriptions, verify they appear in list view

### Tests for User Story 1 (TDD - Write tests FIRST) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Write test_todo_item_creation_valid in tests/unit/test_todo_model.py
- [ ] T019 [P] [US1] Write test_todo_item_validation_empty_title in tests/unit/test_todo_model.py
- [ ] T020 [P] [US1] Write test_todo_item_validation_title_length in tests/unit/test_todo_model.py
- [ ] T021 [P] [US1] Write test_todo_item_validation_description_length in tests/unit/test_todo_model.py
- [ ] T022 [P] [US1] Write test_todo_item_defaults in tests/unit/test_todo_model.py
- [ ] T023 [P] [US1] Write test_store_create in tests/unit/test_todo_store.py
- [ ] T024 [P] [US1] Write test_store_read in tests/unit/test_todo_store.py
- [ ] T025 [P] [US1] Write test_store_list_all in tests/unit/test_todo_store.py
- [ ] T026 [P] [US1] Write test_store_read_not_found in tests/unit/test_todo_store.py
- [ ] T027 [P] [US1] Write test_service_add_todo_valid in tests/unit/test_todo_service.py
- [ ] T028 [P] [US1] Write test_service_add_todo_empty_title in tests/unit/test_todo_service.py
- [ ] T029 [P] [US1] Write test_service_list_todos in tests/unit/test_todo_service.py

### Implementation for User Story 1

- [ ] T030 [US1] Implement TodoItem model in todo_app/models/todo.py with Pydantic validation (depends on T018-T022 failing)
- [ ] T031 [US1] Run tests for TodoItem model - verify all pass
- [ ] T032 [US1] Implement TodoStore class in todo_app/store/todo_store.py with create, read, list methods (depends on T023-T026 failing)
- [ ] T033 [US1] Run tests for TodoStore - verify all pass
- [ ] T034 [US1] Implement TodoService class in todo_app/services/todo_service.py with add_todo, list_todos methods (depends on T027-T029 failing)
- [ ] T035 [US1] Run tests for TodoService - verify all pass
- [ ] T036 [P] [US1] Implement menu display in todo_app/cli/menu.py with main menu and input handling
- [ ] T037 [P] [US1] Implement output formatter in todo_app/cli/formatter.py with todo list display
- [ ] T038 [US1] Implement add todo operation in todo_app/cli/menu.py (menu option 1)
- [ ] T039 [US1] Implement view all todos operation in todo_app/cli/menu.py (menu option 2)
- [ ] T040 [US1] Create main.py entry point with CLI loop and store initialization
- [ ] T041 [US1] Add logging for add and view operations
- [ ] T042 [US1] Add error handling for invalid inputs in add operation
- [ ] T043 [US1] Manual test: Add 3 todos and verify they appear in list view

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Mark Todos as Complete (Priority: P2)

**Goal**: Users can mark todos as complete or incomplete to track progress

**Independent Test**: Create several todos, mark some as complete, verify visual distinction between pending and completed

### Tests for User Story 2 (TDD - Write tests FIRST) ⚠️

- [ ] T044 [P] [US2] Write test_store_mark_complete in tests/unit/test_todo_store.py
- [ ] T045 [P] [US2] Write test_store_mark_incomplete in tests/unit/test_todo_store.py
- [ ] T046 [P] [US2] Write test_store_mark_complete_not_found in tests/unit/test_todo_store.py
- [ ] T047 [P] [US2] Write test_service_mark_complete in tests/unit/test_todo_service.py
- [ ] T048 [P] [US2] Write test_service_mark_incomplete in tests/unit/test_todo_service.py
- [ ] T049 [P] [US2] Write test_service_mark_complete_not_found in tests/unit/test_todo_service.py

### Implementation for User Story 2

- [ ] T050 [US2] Implement mark_complete method in todo_app/store/todo_store.py (depends on T044-T046 failing)
- [ ] T051 [US2] Run tests for mark_complete in store - verify all pass
- [ ] T052 [US2] Implement mark_complete and mark_incomplete methods in todo_app/services/todo_service.py (depends on T047-T049 failing)
- [ ] T053 [US2] Run tests for mark_complete in service - verify all pass
- [ ] T054 [US2] Update formatter in todo_app/cli/formatter.py to visually distinguish completed todos (✓ Done)
- [ ] T055 [US2] Implement mark complete/incomplete operation in todo_app/cli/menu.py (menu option 5)
- [ ] T056 [US2] Add logging for mark complete operations
- [ ] T057 [US2] Add error handling for non-existent todo IDs
- [ ] T058 [US2] Manual test: Mark todos as complete/incomplete and verify status changes

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Delete Todos (Priority: P3)

**Goal**: Users can delete todos to keep their list clean and focused

**Independent Test**: Create several todos, delete specific ones, verify they no longer appear in list

### Tests for User Story 3 (TDD - Write tests FIRST) ⚠️

- [ ] T059 [P] [US3] Write test_store_delete in tests/unit/test_todo_store.py
- [ ] T060 [P] [US3] Write test_store_delete_not_found in tests/unit/test_todo_store.py
- [ ] T061 [P] [US3] Write test_store_delete_updates_count in tests/unit/test_todo_store.py
- [ ] T062 [P] [US3] Write test_service_delete_todo in tests/unit/test_todo_service.py
- [ ] T063 [P] [US3] Write test_service_delete_todo_not_found in tests/unit/test_todo_service.py

### Implementation for User Story 3

- [ ] T064 [US3] Implement delete method in todo_app/store/todo_store.py (depends on T059-T061 failing)
- [ ] T065 [US3] Run tests for delete in store - verify all pass
- [ ] T066 [US3] Implement delete_todo method in todo_app/services/todo_service.py (depends on T062-T063 failing)
- [ ] T067 [US3] Run tests for delete in service - verify all pass
- [ ] T068 [US3] Implement delete operation in todo_app/cli/menu.py (menu option 4) with confirmation
- [ ] T069 [US3] Add logging for delete operations
- [ ] T070 [US3] Add error handling for non-existent todo IDs
- [ ] T071 [US3] Manual test: Delete todos and verify they are removed from list

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Update Todos (Priority: P4)

**Goal**: Users can edit existing todos to correct mistakes or update task details

**Independent Test**: Create a todo, edit its title and description, verify changes are reflected in list

### Tests for User Story 4 (TDD - Write tests FIRST) ⚠️

- [ ] T072 [P] [US4] Write test_store_update in tests/unit/test_todo_store.py
- [ ] T073 [P] [US4] Write test_store_update_not_found in tests/unit/test_todo_store.py
- [ ] T074 [P] [US4] Write test_store_update_partial in tests/unit/test_todo_store.py
- [ ] T075 [P] [US4] Write test_service_update_todo in tests/unit/test_todo_service.py
- [ ] T076 [P] [US4] Write test_service_update_todo_empty_title in tests/unit/test_todo_service.py
- [ ] T077 [P] [US4] Write test_service_update_todo_not_found in tests/unit/test_todo_service.py

### Implementation for User Story 4

- [ ] T078 [US4] Implement update method in todo_app/store/todo_store.py (depends on T072-T074 failing)
- [ ] T079 [US4] Run tests for update in store - verify all pass
- [ ] T080 [US4] Implement update_todo method in todo_app/services/todo_service.py (depends on T075-T077 failing)
- [ ] T081 [US4] Run tests for update in service - verify all pass
- [ ] T082 [US4] Implement update operation in todo_app/cli/menu.py (menu option 3) with keep-current option
- [ ] T083 [US4] Add logging for update operations
- [ ] T084 [US4] Add error handling for empty titles and non-existent IDs
- [ ] T085 [US4] Manual test: Update todo title and description, verify changes

**Checkpoint**: At this point, User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Search and Filter Todos (Priority: P5)

**Goal**: Users can search for todos by keyword to quickly find specific tasks

**Independent Test**: Create 10+ todos with various keywords, search for specific terms, verify only matching todos displayed

### Tests for User Story 5 (TDD - Write tests FIRST) ⚠️

- [ ] T086 [P] [US5] Write test_store_search_by_keyword in tests/unit/test_todo_store.py
- [ ] T087 [P] [US5] Write test_store_search_case_insensitive in tests/unit/test_todo_store.py
- [ ] T088 [P] [US5] Write test_store_filter_by_status in tests/unit/test_todo_store.py
- [ ] T089 [P] [US5] Write test_store_search_no_results in tests/unit/test_todo_store.py
- [ ] T090 [P] [US5] Write test_service_search_todos in tests/unit/test_todo_service.py
- [ ] T091 [P] [US5] Write test_service_filter_by_status in tests/unit/test_todo_service.py

### Implementation for User Story 5

- [ ] T092 [US5] Implement search method in todo_app/store/todo_store.py with keyword and status filter (depends on T086-T089 failing)
- [ ] T093 [US5] Run tests for search in store - verify all pass
- [ ] T094 [US5] Implement search_todos method in todo_app/services/todo_service.py (depends on T090-T091 failing)
- [ ] T095 [US5] Run tests for search in service - verify all pass
- [ ] T096 [US5] Implement search submenu in todo_app/cli/menu.py (menu option 6) with keyword and status options
- [ ] T097 [US5] Add logging for search operations
- [ ] T098 [US5] Add empty results message handling
- [ ] T099 [US5] Manual test: Search by keyword and filter by status, verify results

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T100 [P] Write integration test for add-view workflow in tests/integration/test_cli_workflows.py
- [ ] T101 [P] Write integration test for add-mark-complete workflow in tests/integration/test_cli_workflows.py
- [ ] T102 [P] Write integration test for add-update-view workflow in tests/integration/test_cli_workflows.py
- [ ] T103 [P] Write integration test for add-delete-view workflow in tests/integration/test_cli_workflows.py
- [ ] T104 [P] Write integration test for add-search workflow in tests/integration/test_cli_workflows.py
- [ ] T105 [P] Create README.md with installation, usage, and architecture overview
- [ ] T106 [P] Add docstrings to all public functions and classes
- [ ] T107 [P] Add type hints to all functions and methods
- [ ] T108 Run black formatter on all Python files
- [ ] T109 Run flake8 linter and fix any issues
- [ ] T110 Run mypy type checker and fix any issues
- [ ] T111 Run pytest with coverage report (target: 90%+ coverage)
- [ ] T112 Validate quickstart.md by following all steps
- [ ] T113 Add exit confirmation with data loss warning in todo_app/cli/menu.py (menu option 7)
- [ ] T114 Add startup warning about in-memory storage in main.py
- [ ] T115 Test edge cases: very long titles, special characters, unicode
- [ ] T116 Test error handling: invalid menu choices, non-numeric input, Ctrl+C
- [ ] T117 Performance test: Add 100 todos and verify no degradation
- [ ] T118 Final manual test: Complete all user stories end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable

### Within Each User Story

- Tests (TDD) MUST be written and FAIL before implementation
- Models before services
- Services before CLI operations
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (TDD - write tests first):
Task T018: "Write test_todo_item_creation_valid in tests/unit/test_todo_model.py"
Task T019: "Write test_todo_item_validation_empty_title in tests/unit/test_todo_model.py"
Task T020: "Write test_todo_item_validation_title_length in tests/unit/test_todo_model.py"
Task T021: "Write test_todo_item_validation_description_length in tests/unit/test_todo_model.py"
Task T022: "Write test_todo_item_defaults in tests/unit/test_todo_model.py"

# After tests fail, implement model:
Task T030: "Implement TodoItem model in todo_app/models/todo.py"

# Then verify tests pass:
Task T031: "Run tests for TodoItem model - verify all pass"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (TDD: write tests → fail → implement → pass)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (TDD approach)
   - Developer B: User Story 2 (TDD approach)
   - Developer C: User Story 3 (TDD approach)
3. Stories complete and integrate independently

---

## TDD Workflow (CRITICAL)

**Constitution Requirement**: Principle III - Test-Driven Development (NON-NEGOTIABLE)

For each user story, follow this strict workflow:

1. **Write Tests First**: Write all test cases for the component
2. **Run Tests**: Verify tests FAIL (red phase)
3. **Implement**: Write minimal code to make tests pass
4. **Run Tests**: Verify tests PASS (green phase)
5. **Refactor**: Clean up code while keeping tests passing
6. **Repeat**: Move to next component

**Example for TodoItem Model**:
```bash
# 1. Write tests (T018-T022)
pytest tests/unit/test_todo_model.py  # Should FAIL

# 2. Implement model (T030)
# Write code in todo_app/models/todo.py

# 3. Run tests (T031)
pytest tests/unit/test_todo_model.py  # Should PASS
```

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD is REQUIRED per constitution - tests must be written before implementation
- Verify tests fail before implementing (red phase)
- Verify tests pass after implementing (green phase)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Count Summary

- **Total Tasks**: 118
- **Setup (Phase 1)**: 10 tasks
- **Foundational (Phase 2)**: 7 tasks
- **User Story 1 (Phase 3)**: 26 tasks (12 tests + 14 implementation)
- **User Story 2 (Phase 4)**: 15 tasks (6 tests + 9 implementation)
- **User Story 3 (Phase 5)**: 13 tasks (5 tests + 8 implementation)
- **User Story 4 (Phase 6)**: 14 tasks (6 tests + 8 implementation)
- **User Story 5 (Phase 7)**: 14 tasks (6 tests + 8 implementation)
- **Polish (Phase 8)**: 19 tasks

**Parallel Opportunities**: 47 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1) = 43 tasks for minimum viable product
