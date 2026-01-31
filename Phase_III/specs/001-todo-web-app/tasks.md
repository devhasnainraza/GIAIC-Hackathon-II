# Tasks: Todo Full-Stack Web Application

**Input**: Design documents from `/specs/001-todo-web-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-spec.yaml

**Tests**: Tests are not explicitly requested in the specification, so test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- All paths are relative to repository root (Phase_II/)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend directory structure (backend/src/, backend/tests/, backend/alembic/)
- [ ] T002 Create frontend directory structure (frontend/src/app/, frontend/src/components/, frontend/src/lib/)
- [ ] T003 [P] Initialize Python project with requirements.txt in backend/
- [ ] T004 [P] Initialize Next.js project with package.json in frontend/
- [ ] T005 [P] Configure backend environment variables template in backend/.env.example
- [ ] T006 [P] Configure frontend environment variables template in frontend/.env.local.example
- [ ] T007 [P] Setup Alembic for database migrations in backend/alembic/
- [ ] T008 [P] Configure Tailwind CSS in frontend/tailwind.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Create database configuration in backend/src/database.py (SQLModel engine, session management)
- [ ] T010 [P] Create User SQLModel in backend/src/models/user.py (id, email, hashed_password, created_at)
- [ ] T011 [P] Create Task SQLModel in backend/src/models/task.py (id, user_id, title, description, is_complete, timestamps)
- [ ] T012 Generate initial Alembic migration for users and tasks tables in backend/alembic/versions/
- [ ] T013 Create FastAPI application entry point in backend/src/main.py (app initialization, CORS)
- [ ] T014 [P] Create environment configuration in backend/src/config.py (DATABASE_URL, JWT_SECRET)
- [ ] T015 [P] Implement JWT verification utilities in backend/src/services/auth.py (verify_token, hash_password)
- [ ] T016 Create authentication dependency in backend/src/api/deps.py (get_current_user with JWT verification)
- [ ] T017 [P] Configure Better Auth in frontend/src/lib/auth.ts (JWT configuration, database connection)
- [ ] T018 [P] Create API client utility in frontend/src/lib/api.ts (fetch wrapper with Bearer token)
- [ ] T019 [P] Create TypeScript types in frontend/src/lib/types.ts (User, Task, AuthResponse)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to register, login, and logout with JWT-based authentication

**Independent Test**: Register a new account, login with credentials, verify JWT token received, logout and verify session ends

### Backend Implementation for User Story 1

- [ ] T020 [P] [US1] Create User Pydantic schemas in backend/src/schemas/user.py (UserRegisterRequest, UserLoginRequest, AuthResponse)
- [ ] T021 [US1] Implement UserService in backend/src/services/user_service.py (create_user, authenticate_user, get_user_by_email)
- [ ] T022 [US1] Implement POST /api/auth/register endpoint in backend/src/api/auth.py (user registration with password hashing)
- [ ] T023 [US1] Implement POST /api/auth/login endpoint in backend/src/api/auth.py (authentication with JWT token issuance)
- [ ] T024 [US1] Implement POST /api/auth/logout endpoint in backend/src/api/auth.py (session termination)
- [ ] T025 [US1] Add email validation and duplicate check in registration endpoint
- [ ] T026 [US1] Add error handling for invalid credentials in login endpoint

### Frontend Implementation for User Story 1

- [ ] T027 [P] [US1] Create Better Auth API route handlers in frontend/src/app/api/auth/[...auth]/route.ts
- [ ] T028 [P] [US1] Create useAuth hook in frontend/src/hooks/useAuth.ts (session management, token access)
- [ ] T029 [US1] Create registration page in frontend/src/app/(auth)/register/page.tsx (form with email/password)
- [ ] T030 [US1] Create login page in frontend/src/app/(auth)/login/page.tsx (form with email/password)
- [ ] T031 [US1] Create AuthForm component in frontend/src/components/AuthForm.tsx (reusable form for login/register)
- [ ] T032 [US1] Implement route protection middleware in frontend/src/middleware.ts (redirect unauthenticated users)
- [ ] T033 [US1] Add form validation for email format and password length in AuthForm component
- [ ] T034 [US1] Add error message display for authentication failures

**Checkpoint**: At this point, User Story 1 should be fully functional - users can register, login, and logout

---

## Phase 4: User Story 2 - Create and View Tasks (Priority: P2)

**Goal**: Enable authenticated users to create new tasks and view their task list

**Independent Test**: Login, create multiple tasks with titles and descriptions, verify tasks appear in list, verify only user's own tasks are visible

### Backend Implementation for User Story 2

- [ ] T035 [P] [US2] Create Task Pydantic schemas in backend/src/schemas/task.py (TaskCreateRequest, TaskResponse)
- [ ] T036 [US2] Implement TaskService in backend/src/services/task_service.py (list_tasks, create_task with user_id filtering)
- [ ] T037 [US2] Implement GET /api/tasks endpoint in backend/src/api/tasks.py (list user's tasks with user isolation)
- [ ] T038 [US2] Implement POST /api/tasks endpoint in backend/src/api/tasks.py (create task with automatic user_id assignment)
- [ ] T039 [US2] Add title validation (1-200 characters) in create task endpoint
- [ ] T040 [US2] Add description validation (max 2000 characters) in create task endpoint
- [ ] T041 [US2] Verify user isolation in list tasks endpoint (filter by authenticated user_id)

### Frontend Implementation for User Story 2

- [ ] T042 [P] [US2] Create task dashboard page in frontend/src/app/(dashboard)/tasks/page.tsx (protected route)
- [ ] T043 [P] [US2] Create TaskList component in frontend/src/components/TaskList.tsx (display array of tasks)
- [ ] T044 [P] [US2] Create TaskItem component in frontend/src/components/TaskItem.tsx (individual task display)
- [ ] T045 [P] [US2] Create TaskForm component in frontend/src/components/TaskForm.tsx (create task form)
- [ ] T046 [US2] Create useTasks hook in frontend/src/hooks/useTasks.ts (fetch tasks, create task, state management)
- [ ] T047 [US2] Integrate TaskForm with API in task dashboard (POST /api/tasks)
- [ ] T048 [US2] Integrate TaskList with API in task dashboard (GET /api/tasks)
- [ ] T049 [US2] Add empty state message when no tasks exist
- [ ] T050 [US2] Add loading state while fetching tasks

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can authenticate and manage their task list

---

## Phase 5: User Story 3 - Mark Tasks Complete/Incomplete (Priority: P3)

**Goal**: Enable users to toggle task completion status

**Independent Test**: Create tasks, mark as complete (verify visual indication), mark as incomplete (verify status reverts), refresh page (verify status persists)

### Backend Implementation for User Story 3

- [ ] T051 [US3] Implement toggle_complete method in backend/src/services/task_service.py (toggle is_complete with user isolation)
- [ ] T052 [US3] Implement PATCH /api/tasks/{task_id}/complete endpoint in backend/src/api/tasks.py (mark task complete)
- [ ] T053 [US3] Implement PATCH /api/tasks/{task_id}/incomplete endpoint in backend/src/api/tasks.py (mark task incomplete)
- [ ] T054 [US3] Verify task ownership before toggling completion status (403 if not owner)
- [ ] T055 [US3] Update updated_at timestamp when toggling completion

### Frontend Implementation for User Story 3

- [ ] T056 [US3] Add completion toggle UI to TaskItem component (checkbox or button)
- [ ] T057 [US3] Implement toggleComplete function in useTasks hook (PATCH /api/tasks/{id}/complete or /incomplete)
- [ ] T058 [US3] Add visual indication for completed tasks (strikethrough, checkmark, or different styling)
- [ ] T059 [US3] Update task list state optimistically when toggling completion
- [ ] T060 [US3] Add error handling for failed toggle operations

**Checkpoint**: All core todo functionality now works - users can create, view, and mark tasks complete

---

## Phase 6: User Story 4 - Edit Task Details (Priority: P4)

**Goal**: Enable users to update task title and description

**Independent Test**: Create task, edit title and description, verify changes saved, cancel edit (verify no changes), refresh page (verify edits persist)

### Backend Implementation for User Story 4

- [ ] T061 [P] [US4] Create TaskUpdateRequest schema in backend/src/schemas/task.py (title, description)
- [ ] T062 [US4] Implement update_task method in backend/src/services/task_service.py (update with user isolation)
- [ ] T063 [US4] Implement PUT /api/tasks/{task_id} endpoint in backend/src/api/tasks.py (update task)
- [ ] T064 [US4] Verify task ownership before updating (403 if not owner)
- [ ] T065 [US4] Validate title and description in update endpoint
- [ ] T066 [US4] Update updated_at timestamp when editing task

### Frontend Implementation for User Story 4

- [ ] T067 [US4] Add edit mode state to TaskItem component (toggle between view and edit)
- [ ] T068 [US4] Create inline edit form in TaskItem component (editable title and description fields)
- [ ] T069 [US4] Implement updateTask function in useTasks hook (PUT /api/tasks/{id})
- [ ] T070 [US4] Add save and cancel buttons for edit mode
- [ ] T071 [US4] Implement cancel functionality (revert to original values)
- [ ] T072 [US4] Add validation for empty title in edit form
- [ ] T073 [US4] Update task list state after successful edit

**Checkpoint**: Users can now fully manage their tasks - create, view, complete, and edit

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P5)

**Goal**: Enable users to permanently delete tasks

**Independent Test**: Create tasks, delete one task (verify removed from list), verify other tasks remain, refresh page (verify deletion persists)

### Backend Implementation for User Story 5

- [ ] T074 [US5] Implement delete_task method in backend/src/services/task_service.py (delete with user isolation)
- [ ] T075 [US5] Implement DELETE /api/tasks/{task_id} endpoint in backend/src/api/tasks.py (delete task)
- [ ] T076 [US5] Verify task ownership before deleting (403 if not owner)
- [ ] T077 [US5] Return 404 if task not found or not owned by user

### Frontend Implementation for User Story 5

- [ ] T078 [US5] Add delete button to TaskItem component
- [ ] T079 [US5] Implement deleteTask function in useTasks hook (DELETE /api/tasks/{id})
- [ ] T080 [US5] Add confirmation dialog before deleting task
- [ ] T081 [US5] Remove task from list state after successful deletion
- [ ] T082 [US5] Add error handling for failed delete operations

**Checkpoint**: All user stories complete - full CRUD functionality for tasks with authentication

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and ensure production readiness

- [ ] T083 [P] Add loading indicators for all async operations in frontend
- [ ] T084 [P] Add error boundaries in frontend/src/app/error.tsx
- [ ] T085 [P] Implement consistent error message display across all forms
- [ ] T086 [P] Add responsive design verification (test 320px to 1920px)
- [ ] T087 [P] Implement proper HTTP status codes for all error cases in backend
- [ ] T088 [P] Add request validation error messages in backend endpoints
- [ ] T089 [P] Create root layout with navigation in frontend/src/app/layout.tsx
- [ ] T090 [P] Add logout button to navigation bar
- [ ] T091 [P] Implement session persistence verification (test browser refresh)
- [ ] T092 [P] Add empty state illustrations or messages for empty task list
- [ ] T093 [P] Verify all environment variables documented in .env.example files
- [ ] T094 [P] Test user isolation (attempt to access another user's tasks via URL manipulation)
- [ ] T095 [P] Verify JWT token expiration handling (401 response, redirect to login)
- [ ] T096 Run quickstart.md validation (follow setup steps, verify application works)
- [ ] T097 Create README.md in repository root with project overview and setup link
- [ ] T098 Update API documentation in backend (FastAPI auto-generated docs at /docs)

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires US1 for authentication but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Requires US2 for tasks but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Requires US2 for tasks but independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Requires US2 for tasks but independently testable

### Within Each User Story

- Backend schemas before services
- Services before endpoints
- Backend endpoints before frontend integration
- Core implementation before error handling
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: T003-T008 can all run in parallel (different files)
- **Phase 2 (Foundational)**: T010-T011, T014-T015, T017-T019 can run in parallel
- **Phase 3 (US1)**: T020 and T027-T028 can run in parallel (backend schemas + frontend hooks)
- **Phase 4 (US2)**: T035, T042-T045 can run in parallel (backend schemas + frontend components)
- **Phase 8 (Polish)**: T083-T095 can all run in parallel (different concerns)

---

## Parallel Example: User Story 1 (Authentication)

```bash
# Launch backend and frontend tasks together:
Task T020: "Create User Pydantic schemas in backend/src/schemas/user.py"
Task T027: "Create Better Auth API route handlers in frontend/src/app/api/auth/[...auth]/route.ts"
Task T028: "Create useAuth hook in frontend/src/hooks/useAuth.ts"

# Then proceed with dependent tasks:
Task T021: "Implement UserService" (depends on T020)
Task T022-T024: "Implement auth endpoints" (depends on T021)
Task T029-T031: "Create auth pages" (depends on T027, T028)
```

---

## Parallel Example: User Story 2 (Create/View Tasks)

```bash
# Launch all independent components together:
Task T035: "Create Task Pydantic schemas in backend/src/schemas/task.py"
Task T042: "Create task dashboard page in frontend/src/app/(dashboard)/tasks/page.tsx"
Task T043: "Create TaskList component in frontend/src/components/TaskList.tsx"
Task T044: "Create TaskItem component in frontend/src/components/TaskItem.tsx"
Task T045: "Create TaskForm component in frontend/src/components/TaskForm.tsx"

# Then proceed with integration:
Task T036: "Implement TaskService" (depends on T035)
Task T037-T038: "Implement task endpoints" (depends on T036)
Task T046-T048: "Integrate components with API" (depends on T037-T038, T042-T045)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T019) - CRITICAL
3. Complete Phase 3: User Story 1 (T020-T034)
4. **STOP and VALIDATE**: Test authentication independently
5. Deploy/demo if ready

**MVP Deliverable**: Users can register, login, and logout with JWT authentication

### Incremental Delivery

1. **Foundation** (Phases 1-2): Setup + Database + Auth Infrastructure → T001-T019
2. **MVP** (Phase 3): Add User Story 1 → T020-T034 → Test independently → Deploy/Demo
3. **Core Features** (Phase 4): Add User Story 2 → T035-T050 → Test independently → Deploy/Demo
4. **Enhanced Features** (Phases 5-7): Add User Stories 3-5 → T051-T082 → Test independently → Deploy/Demo
5. **Production Ready** (Phase 8): Polish → T083-T098 → Final validation → Production deployment

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T019)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (T020-T034)
   - Developer B: User Story 2 (T035-T050) - starts after US1 auth is available
   - Developer C: User Story 3 (T051-T060) - starts after US2 tasks are available
3. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 98 tasks

**Tasks by Phase**:
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 11 tasks
- Phase 3 (US1 - Authentication): 15 tasks
- Phase 4 (US2 - Create/View Tasks): 16 tasks
- Phase 5 (US3 - Mark Complete): 10 tasks
- Phase 6 (US4 - Edit Tasks): 13 tasks
- Phase 7 (US5 - Delete Tasks): 9 tasks
- Phase 8 (Polish): 16 tasks

**Parallel Opportunities**: 35 tasks marked [P] can run in parallel with other tasks

**Independent Test Criteria**:
- US1: Register, login, logout flow works end-to-end
- US2: Create and view tasks with user isolation
- US3: Toggle task completion with persistence
- US4: Edit task details with validation
- US5: Delete tasks with confirmation

**Suggested MVP Scope**: Phases 1-3 (T001-T034) - Authentication only

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All tasks follow strict checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- File paths are exact and match project structure from plan.md
- User isolation is enforced in every backend task that queries tasks
- JWT authentication is required for all protected endpoints
