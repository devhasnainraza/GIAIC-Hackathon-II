---
description: "Task list for MCP Server & Task Tools integration"
---

# Tasks: MCP Server & Task Tools

**Input**: Design documents from `/specs/005-mcp-task-tools/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: No tests explicitly requested in specification. Tasks focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/` at repository root
- **MCP Module**: `backend/src/mcp/` (new module)
- **Tests**: `backend/tests/test_mcp/` (new test directory)
- Paths shown below use backend/ prefix

## Phase 1: Setup (MCP SDK Installation)

**Purpose**: Install MCP SDK and prepare project for MCP server integration

- [x] T001 Add mcp-sdk>=1.0.0 to backend/requirements.txt
- [x] T002 Install dependencies with pip install -r backend/requirements.txt
- [x] T003 Verify existing backend infrastructure (database, Task model, TaskService)

---

## Phase 2: Foundational (MCP Server Infrastructure)

**Purpose**: Core MCP server infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create backend/src/mcp/__init__.py module initialization file
- [x] T005 [P] Extend backend/src/config.py with MCP_SERVER_NAME and MCP_SERVER_PORT settings
- [x] T006 [P] Create backend/src/mcp/schemas.py for MCP response schema definitions
- [x] T007 Create backend/src/mcp/server.py with MCPServer initialization and tool registration
- [x] T008 Create backend/src/mcp/tools/__init__.py for tool module initialization

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Task Creation and Listing (Priority: P1) 🎯 MVP

**Goal**: Enable AI agents to create tasks and retrieve task lists through MCP tools

**Independent Test**: Call add_task to create a task, verify it persists in database, then call list_tasks to retrieve all user tasks

### Implementation for User Story 1

- [x] T009 [P] [US1] Create backend/src/mcp/tools/add_task.py with @server.tool() decorator
- [x] T010 [P] [US1] Create backend/src/mcp/tools/list_tasks.py with @server.tool() decorator
- [x] T011 [US1] Implement add_task tool: validate user_id format, call TaskService.create_task(), return simplified response
- [x] T012 [US1] Implement list_tasks tool: validate user_id format, call TaskService.list_tasks(), return simplified response array
- [x] T013 [US1] Add error handling in add_task: catch HTTPException, convert to MCP error format
- [x] T014 [US1] Add error handling in list_tasks: catch HTTPException, convert to MCP error format
- [x] T015 [US1] Update backend/src/mcp/tools/__init__.py to import and export add_task and list_tasks
- [x] T016 [US1] Update backend/src/mcp/server.py to import tools and verify registration

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

**Manual Verification**:
1. Start MCP server: `python -m src.mcp.server`
2. Call add_task with user_id="1", title="Test task"
3. Verify task created in database
4. Call list_tasks with user_id="1"
5. Verify task appears in response

---

## Phase 4: User Story 2 - Task Completion (Priority: P2)

**Goal**: Enable AI agents to mark tasks as completed through MCP tool

**Independent Test**: Create a task with add_task, call complete_task with task ID, verify task.is_complete=True in database

### Implementation for User Story 2

- [x] T017 [US2] Create backend/src/mcp/tools/complete_task.py with @server.tool() decorator
- [x] T018 [US2] Implement complete_task tool: validate user_id format, call TaskService.update_task() with is_complete=True
- [x] T019 [US2] Add error handling in complete_task: catch HTTPException for not found/forbidden, convert to MCP error format
- [x] T020 [US2] Return simplified task response with completed=True and updated timestamp
- [x] T021 [US2] Update backend/src/mcp/tools/__init__.py to import and export complete_task
- [x] T022 [US2] Update backend/src/mcp/server.py to verify complete_task tool registration

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

**Manual Verification**:
1. Create task with add_task
2. Call complete_task with task_id and user_id
3. Verify task.is_complete=True in database
4. Call list_tasks and verify completed=True in response

---

## Phase 5: User Story 3 - Task Modification (Priority: P3)

**Goal**: Enable AI agents to update task title and description through MCP tool

**Independent Test**: Create a task with add_task, call update_task with new title/description, verify changes persisted in database

### Implementation for User Story 3

- [x] T023 [US3] Create backend/src/mcp/tools/update_task.py with @server.tool() decorator
- [x] T024 [US3] Implement update_task tool: validate user_id format, accept optional title and description parameters
- [x] T025 [US3] Call TaskService.update_task() with provided fields, handle partial updates
- [x] T026 [US3] Add error handling in update_task: catch HTTPException for validation errors and not found/forbidden
- [x] T027 [US3] Return simplified task response with updated fields and updated timestamp
- [x] T028 [US3] Update backend/src/mcp/tools/__init__.py to import and export update_task
- [x] T029 [US3] Update backend/src/mcp/server.py to verify update_task tool registration

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

**Manual Verification**:
1. Create task with add_task
2. Call update_task with task_id, user_id, and new title="Updated title"
3. Verify title updated in database
4. Call list_tasks and verify new title in response

---

## Phase 6: User Story 4 - Task Deletion (Priority: P4)

**Goal**: Enable AI agents to permanently delete tasks through MCP tool

**Independent Test**: Create a task with add_task, call delete_task with task ID, verify task removed from database

### Implementation for User Story 4

- [x] T030 [US4] Create backend/src/mcp/tools/delete_task.py with @server.tool() decorator
- [x] T031 [US4] Implement delete_task tool: validate user_id format, call TaskService.delete_task()
- [x] T032 [US4] Add error handling in delete_task: catch HTTPException for not found/forbidden
- [x] T033 [US4] Return deletion confirmation response with task_id, deleted=True, and message
- [x] T034 [US4] Update backend/src/mcp/tools/__init__.py to import and export delete_task
- [x] T035 [US4] Update backend/src/mcp/server.py to verify delete_task tool registration

**Checkpoint**: All user stories should now be independently functional

**Manual Verification**:
1. Create task with add_task
2. Call delete_task with task_id and user_id
3. Verify task removed from database
4. Call list_tasks and verify task does not appear

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, documentation, and verification

- [x] T036 [P] Create backend/src/mcp/README.md with MCP server documentation
- [x] T037 [P] Update backend/README.md to document MCP server integration
- [ ] T038 Verify all 5 tools registered correctly in MCP server startup logs
- [ ] T039 Test user isolation: verify user A cannot access user B's tasks through MCP tools
- [ ] T040 Test error handling: verify all tools return structured error responses for invalid inputs
- [ ] T041 Test statelessness: restart MCP server and verify all data persists correctly
- [ ] T042 Verify parallel interface: create task via MCP, view via REST API, update via REST API, view via MCP
- [ ] T043 Performance test: verify tool response times <500ms under normal load
- [x] T044 Create backend/.env.example with MCP_SERVER_NAME and MCP_SERVER_PORT variables

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 but typically done after for testing
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent of US1/US2/US3

### Within Each User Story

- Tool file creation (T009, T010, T017, etc.) can be done in parallel
- Implementation must follow tool creation
- Error handling follows implementation
- Module updates follow all tool implementations in that story

### Parallel Opportunities

- **Setup Phase**: T001, T002, T003 must be sequential
- **Foundational Phase**: T005, T006, T008 can run in parallel (marked [P])
- **User Story 1**: T009 and T010 can run in parallel (marked [P])
- **Once Foundational completes**: All user stories (US1, US2, US3, US4) can be worked on in parallel by different team members
- **Polish Phase**: T036, T037 can run in parallel (marked [P])

---

## Parallel Example: User Story 1

```bash
# Create both tool files in parallel:
Task T009: Create backend/src/mcp/tools/add_task.py
Task T010: Create backend/src/mcp/tools/list_tasks.py

# Then implement sequentially:
Task T011: Implement add_task logic
Task T012: Implement list_tasks logic
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (add_task, list_tasks)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**MVP Deliverable**: AI agents can create and list tasks through MCP tools

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (add_task, list_tasks)
   - Developer B: User Story 2 (complete_task)
   - Developer C: User Story 3 (update_task)
   - Developer D: User Story 4 (delete_task)
3. Stories complete and integrate independently

---

## Integration Notes

### Reusing Existing Components

**No changes required to**:
- `backend/src/models/task.py` - Task model (reuse as-is)
- `backend/src/services/task_service.py` - TaskService (reuse as-is)
- `backend/src/database.py` - Database connection (reuse as-is)

**Extend**:
- `backend/src/config.py` - Add MCP_SERVER_NAME and MCP_SERVER_PORT

**Create new**:
- `backend/src/mcp/` - Entire MCP module (new)
- `backend/src/mcp/tools/` - All 5 tool implementations (new)

### Simplified MCP Interface

MCP tools expose **7 fields**:
- task_id, user_id, title, description, completed, created_at, updated_at

REST API continues to support **12 fields**:
- All above + status, priority, due_date, project_id, completed_at

### Type Conversions

- **user_id**: String (MCP parameter) → int (TaskService)
- **completed**: Boolean (MCP) ↔ is_complete (Task model)
- **Timestamps**: datetime (Task model) → ISO 8601 string (MCP response)

### Error Translation

- **HTTPException 400** → `{"error": message, "error_code": "VALIDATION_ERROR"}`
- **HTTPException 404** → `{"error": "Task not found", "error_code": "NOT_FOUND_OR_FORBIDDEN"}`
- **ValueError** → `{"error": "Invalid user_id format", "error_code": "VALIDATION_ERROR"}`

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 44
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 5 tasks
- Phase 3 (US1 - MVP): 8 tasks
- Phase 4 (US2): 6 tasks
- Phase 5 (US3): 7 tasks
- Phase 6 (US4): 6 tasks
- Phase 7 (Polish): 9 tasks

**Parallel Opportunities**: 8 tasks marked [P]

**MVP Scope**: Phases 1-3 (16 tasks) deliver add_task and list_tasks functionality

**Independent Test Criteria**:
- US1: Create task, list tasks, verify persistence
- US2: Create task, complete task, verify status change
- US3: Create task, update task, verify changes
- US4: Create task, delete task, verify removal
