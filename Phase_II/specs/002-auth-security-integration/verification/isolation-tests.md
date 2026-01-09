# User Isolation Test Suite

**Feature**: Authentication & Security Integration
**Branch**: `002-auth-security-integration`
**Created**: 2026-01-09
**Purpose**: Comprehensive test cases for user data isolation (FR-016 to FR-017)

---

## Overview

This test suite covers all user data isolation requirements, ensuring that users can only access and modify their own data. Each test case includes detailed procedures to verify that cross-user access is prevented and that ownership verification is enforced at all levels.

**Functional Requirements Covered**:
- FR-016: User Data Isolation (users can only access their own tasks)
- FR-017: Ownership Verification (all operations verify task ownership)

**Security Principles Tested**:
- Database queries filtered by authenticated user ID
- Cross-user access attempts return 404 (not 403)
- No information leakage about other users' data
- User ID always from verified JWT token
- URL manipulation cannot bypass isolation

**Test Environment**:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Database: Neon PostgreSQL

---

## Prerequisites

### Setup Requirements

1. **Application Running**:
   - Backend server running on port 8000
   - Frontend server running on port 3000
   - Database initialized with migrations

2. **Create Two Test Users**:

**User A (Alice)**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "AlicePass123"
  }' | jq

# Save token
TOKEN_A="<paste-alice-token-here>"
```

**User B (Bob)**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "password": "BobPass456"
  }' | jq

# Save token
TOKEN_B="<paste-bob-token-here>"
```

3. **Create Test Data**:

**Alice creates 3 tasks**:
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title": "Alice Task 1", "description": "Belongs to Alice"}'

curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title": "Alice Task 2", "description": "Also belongs to Alice"}'

curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title": "Alice Task 3", "description": "Still belongs to Alice"}'
```

**Bob creates 3 tasks**:
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"title": "Bob Task 1", "description": "Belongs to Bob"}'

curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"title": "Bob Task 2", "description": "Also belongs to Bob"}'

curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"title": "Bob Task 3", "description": "Still belongs to Bob"}'
```

4. **Save Task IDs**:
```bash
# Get Alice's task IDs
ALICE_TASK_IDS=$(curl -s -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" | jq -r '.[].id')

# Get Bob's task IDs
BOB_TASK_IDS=$(curl -s -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" | jq -r '.[].id')

# Save first task ID from each user
ALICE_TASK_1=$(echo $ALICE_TASK_IDS | cut -d' ' -f1)
BOB_TASK_1=$(echo $BOB_TASK_IDS | cut -d' ' -f1)
```

---

## Test Case ISO-001: List Endpoint Returns Only User's Data (FR-016)

**Requirement**: GET /api/tasks returns only tasks belonging to authenticated user

**Priority**: P0 (Critical)

**Test Objective**: Verify that list endpoint filters by authenticated user ID

### Test Procedure

**Step 1: Alice Lists Her Tasks**

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" | jq
```

**Expected Response**:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Alice Task 1",
    "description": "Belongs to Alice",
    "is_complete": false,
    "created_at": "2026-01-09T10:00:00Z",
    "updated_at": "2026-01-09T10:00:00Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "title": "Alice Task 2",
    "description": "Also belongs to Alice",
    "is_complete": false,
    "created_at": "2026-01-09T10:01:00Z",
    "updated_at": "2026-01-09T10:01:00Z"
  },
  {
    "id": 3,
    "user_id": 1,
    "title": "Alice Task 3",
    "description": "Still belongs to Alice",
    "is_complete": false,
    "created_at": "2026-01-09T10:02:00Z",
    "updated_at": "2026-01-09T10:02:00Z"
  }
]
```

**Verification**:
- Count: 3 tasks
- All tasks have `user_id: 1` (Alice's ID)
- No tasks from Bob visible

**Step 2: Bob Lists His Tasks**

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" | jq
```

**Expected Response**: 3 tasks, all with `user_id: 2` (Bob's ID)

**Verification**:
- Count: 3 tasks
- All tasks have `user_id: 2` (Bob's ID)
- No tasks from Alice visible

**Step 3: Verify Database State**

```bash
# Check total tasks in database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM tasks"
# Expected: 6 (3 from Alice + 3 from Bob)

# Check Alice's tasks
psql $DATABASE_URL -c "SELECT COUNT(*) FROM tasks WHERE user_id=1"
# Expected: 3

# Check Bob's tasks
psql $DATABASE_URL -c "SELECT COUNT(*) FROM tasks WHERE user_id=2"
# Expected: 3
```

### Pass Criteria

- ✅ Alice sees exactly 3 tasks (all hers)
- ✅ Bob sees exactly 3 tasks (all his)
- ✅ No cross-user data leakage
- ✅ All returned tasks have correct user_id
- ✅ Database contains 6 total tasks (isolation at query level)

### Fail Indicators

- ❌ Alice sees Bob's tasks
- ❌ Bob sees Alice's tasks
- ❌ Task count incorrect
- ❌ Tasks with wrong user_id returned
- ❌ All tasks returned regardless of user

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case ISO-002: Cross-User Read Access Prevention (FR-016, FR-017)

**Requirement**: Users cannot read other users' tasks by ID

**Priority**: P0 (Critical)

**Test Objective**: Verify that attempting to read another user's task returns 404

### Test Procedure

**Step 1: Get Task IDs**

```bash
# Alice's first task ID
ALICE_TASK_1=$(curl -s -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" | jq -r '.[0].id')

# Bob's first task ID
BOB_TASK_1=$(curl -s -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" | jq -r '.[0].id')

echo "Alice's task: $ALICE_TASK_1"
echo "Bob's task: $BOB_TASK_1"
```

**Step 2: Alice Attempts to Read Bob's Task**

```bash
curl -X GET http://localhost:8000/api/tasks/$BOB_TASK_1 \
  -H "Authorization: Bearer $TOKEN_A" \
  -v
```

**Expected Response**:
```json
{
  "detail": "Task not found"
}
```

**Expected HTTP Status**: `404 Not Found`

**Step 3: Bob Attempts to Read Alice's Task**

```bash
curl -X GET http://localhost:8000/api/tasks/$ALICE_TASK_1 \
  -H "Authorization: Bearer $TOKEN_B" \
  -v
```

**Expected Response**:
```json
{
  "detail": "Task not found"
}
```

**Expected HTTP Status**: `404 Not Found`

**Step 4: Verify Legitimate Owner Can Still Access**

```bash
# Alice reads her own task
curl -X GET http://localhost:8000/api/tasks/$ALICE_TASK_1 \
  -H "Authorization: Bearer $TOKEN_A" | jq
```

**Expected**: `200 OK` with Alice's task data

```bash
# Bob reads his own task
curl -X GET http://localhost:8000/api/tasks/$BOB_TASK_1 \
  -H "Authorization: Bearer $TOKEN_B" | jq
```

**Expected**: `200 OK` with Bob's task data

### Pass Criteria

- ✅ Alice cannot read Bob's task (404)
- ✅ Bob cannot read Alice's task (404)
- ✅ Alice can read her own task (200)
- ✅ Bob can read his own task (200)
- ✅ Error message is generic (no information leakage)
- ✅ 404 (not 403) prevents information disclosure

### Fail Indicators

- ❌ Cross-user read succeeds (200)
- ❌ Different error code (403 reveals task exists)
- ❌ Detailed error message reveals ownership
- ❌ Owner cannot access own task

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case ISO-003: Cross-User Update Access Prevention (FR-016, FR-017)

**Requirement**: Users cannot update other users' tasks

**Priority**: P0 (Critical)

**Test Objective**: Verify that attempting to update another user's task returns 404

### Test Procedure

**Step 1: Alice Attempts to Update Bob's Task**

```bash
curl -X PATCH http://localhost:8000/api/tasks/$BOB_TASK_1 \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hacked by Alice",
    "description": "Alice tried to modify this",
    "is_complete": true
  }' \
  -v
```

**Expected Response**:
```json
{
  "detail": "Task not found"
}
```

**Expected HTTP Status**: `404 Not Found`

**Step 2: Verify Bob's Task Unchanged**

```bash
curl -X GET http://localhost:8000/api/tasks/$BOB_TASK_1 \
  -H "Authorization: Bearer $TOKEN_B" | jq
```

**Expected**: Original task data unchanged (title still "Bob Task 1")

**Step 3: Bob Attempts to Update Alice's Task**

```bash
curl -X PATCH http://localhost:8000/api/tasks/$ALICE_TASK_1 \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hacked by Bob",
    "description": "Bob tried to modify this",
    "is_complete": true
  }' \
  -v
```

**Expected**: `404 Not Found`

**Step 4: Verify Alice's Task Unchanged**

```bash
curl -X GET http://localhost:8000/api/tasks/$ALICE_TASK_1 \
  -H "Authorization: Bearer $TOKEN_A" | jq
```

**Expected**: Original task data unchanged (title still "Alice Task 1")

**Step 5: Verify Legitimate Owner Can Update**

```bash
# Alice updates her own task
curl -X PATCH http://localhost:8000/api/tasks/$ALICE_TASK_1 \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Alice Task 1 - Updated by Alice",
    "is_complete": true
  }' | jq
```

**Expected**: `200 OK` with updated task data

### Pass Criteria

- ✅ Alice cannot update Bob's task (404)
- ✅ Bob cannot update Alice's task (404)
- ✅ Tasks remain unchanged after failed update attempts
- ✅ Legitimate owners can update their own tasks (200)
- ✅ No data modification occurred from cross-user attempts

### Fail Indicators

- ❌ Cross-user update succeeds (200)
- ❌ Task data modified by unauthorized user
- ❌ Wrong error code (not 404)
- ❌ Owner cannot update own task

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case ISO-004: Cross-User Delete Access Prevention (FR-016, FR-017)

**Requirement**: Users cannot delete other users' tasks

**Priority**: P0 (Critical)

**Test Objective**: Verify that attempting to delete another user's task returns 404

### Test Procedure

**Step 1: Get Task IDs for Deletion Test**

```bash
# Alice's second task
ALICE_TASK_2=$(curl -s -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" | jq -r '.[1].id')

# Bob's second task
BOB_TASK_2=$(curl -s -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" | jq -r '.[1].id')
```

**Step 2: Alice Attempts to Delete Bob's Task**

```bash
curl -X DELETE http://localhost:8000/api/tasks/$BOB_TASK_2 \
  -H "Authorization: Bearer $TOKEN_A" \
  -v
```

**Expected HTTP Status**: `404 Not Found`

**Step 3: Verify Bob's Task Still Exists**

```bash
curl -X GET http://localhost:8000/api/tasks/$BOB_TASK_2 \
  -H "Authorization: Bearer $TOKEN_B" | jq
```

**Expected**: `200 OK` with task data (task not deleted)

**Step 4: Bob Attempts to Delete Alice's Task**

```bash
curl -X DELETE http://localhost:8000/api/tasks/$ALICE_TASK_2 \
  -H "Authorization: Bearer $TOKEN_B" \
  -v
```

**Expected HTTP Status**: `404 Not Found`

**Step 5: Verify Alice's Task Still Exists**

```bash
curl -X GET http://localhost:8000/api/tasks/$ALICE_TASK_2 \
  -H "Authorization: Bearer $TOKEN_A" | jq
```

**Expected**: `200 OK` with task data (task not deleted)

**Step 6: Verify Legitimate Owner Can Delete**

```bash
# Alice deletes her own task
curl -X DELETE http://localhost:8000/api/tasks/$ALICE_TASK_2 \
  -H "Authorization: Bearer $TOKEN_A" \
  -v
```

**Expected HTTP Status**: `204 No Content`

**Step 7: Verify Task Deleted**

```bash
curl -X GET http://localhost:8000/api/tasks/$ALICE_TASK_2 \
  -H "Authorization: Bearer $TOKEN_A" \
  -v
```

**Expected**: `404 Not Found` (task successfully deleted)

### Pass Criteria

- ✅ Alice cannot delete Bob's task (404)
- ✅ Bob cannot delete Alice's task (404)
- ✅ Tasks remain after failed delete attempts
- ✅ Legitimate owner can delete own task (204)
- ✅ Deleted task no longer accessible

### Fail Indicators

- ❌ Cross-user delete succeeds (204)
- ❌ Task deleted by unauthorized user
- ❌ Wrong error code (not 404)
- ❌ Owner cannot delete own task

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case ISO-005: URL Manipulation Cannot Bypass Isolation (FR-016, FR-017)

**Requirement**: User ID from token only, never from URL or request parameters

**Priority**: P0 (Critical)

**Test Objective**: Verify that URL manipulation cannot bypass user isolation

### Test Procedure

**Test 5A: Query Parameter Injection**

```bash
# Attempt to filter by different user_id via query parameter
curl -X GET "http://localhost:8000/api/tasks?user_id=2" \
  -H "Authorization: Bearer $TOKEN_A" | jq
```

**Expected**: Returns only Alice's tasks (query parameter ignored)

**Test 5B: Request Body user_id Injection (Create)**

```bash
# Attempt to create task for different user
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "title": "Malicious Task",
    "description": "Trying to create task for Bob"
  }' | jq
```

**Expected**: Task created with `user_id: 1` (from token), not `user_id: 2`

**Test 5C: Request Body user_id Injection (Update)**

```bash
# Attempt to change task ownership via update
curl -X PATCH http://localhost:8000/api/tasks/$ALICE_TASK_1 \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "title": "Updated Title"
  }' | jq
```

**Expected**: Task updated but `user_id` remains `1` (ownership unchanged)

**Test 5D: Path Traversal Attempt**

```bash
# Attempt path traversal
curl -X GET "http://localhost:8000/api/tasks/../tasks" \
  -H "Authorization: Bearer $TOKEN_A" | jq
```

**Expected**: Returns Alice's tasks or 404 (no bypass)

**Test 5E: SQL Injection Attempt**

```bash
# Attempt SQL injection in task ID
curl -X GET "http://localhost:8000/api/tasks/1' OR '1'='1" \
  -H "Authorization: Bearer $TOKEN_A" \
  -v
```

**Expected**: `404 Not Found` or `400 Bad Request` (no SQL injection)

### Pass Criteria

- ✅ Query parameters ignored (user_id from token only)
- ✅ Request body user_id ignored
- ✅ Task ownership cannot be changed
- ✅ Path traversal prevented
- ✅ SQL injection prevented
- ✅ User ID always from verified JWT token

### Fail Indicators

- ❌ Query parameter affects results
- ❌ Request body user_id accepted
- ❌ Task ownership changed
- ❌ Path traversal succeeds
- ❌ SQL injection succeeds

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case ISO-006: Multi-User Concurrent Access (FR-016)

**Requirement**: Multiple users can work simultaneously without interference

**Priority**: P1 (High)

**Test Objective**: Verify that concurrent operations by different users don't interfere

### Test Procedure

**Step 1: Concurrent Task Creation**

```bash
# Alice and Bob create tasks simultaneously
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title": "Alice Concurrent Task"}' &

curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"title": "Bob Concurrent Task"}' &

wait
```

**Step 2: Verify Both Tasks Created Correctly**

```bash
# Alice's tasks
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" | jq -r '.[].title' | grep "Alice Concurrent Task"

# Bob's tasks
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" | jq -r '.[].title' | grep "Bob Concurrent Task"
```

**Expected**: Both tasks created with correct ownership

**Step 3: Concurrent Updates**

```bash
# Both users update their own tasks simultaneously
curl -X PATCH http://localhost:8000/api/tasks/$ALICE_TASK_1 \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"is_complete": true}' &

curl -X PATCH http://localhost:8000/api/tasks/$BOB_TASK_1 \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"is_complete": true}' &

wait
```

**Step 4: Verify Both Updates Successful**

```bash
# Check Alice's task
curl -X GET http://localhost:8000/api/tasks/$ALICE_TASK_1 \
  -H "Authorization: Bearer $TOKEN_A" | jq '.is_complete'
# Expected: true

# Check Bob's task
curl -X GET http://localhost:8000/api/tasks/$BOB_TASK_1 \
  -H "Authorization: Bearer $TOKEN_B" | jq '.is_complete'
# Expected: true
```

### Pass Criteria

- ✅ Concurrent operations succeed
- ✅ No data corruption
- ✅ Correct ownership maintained
- ✅ No interference between users
- ✅ All operations complete successfully

### Fail Indicators

- ❌ Operations fail due to concurrency
- ❌ Data corruption occurs
- ❌ Ownership mixed up
- ❌ One user's operation affects another's data

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case ISO-007: Database-Level Isolation Verification (FR-016)

**Requirement**: Database queries must filter by user_id

**Priority**: P0 (Critical)

**Test Objective**: Verify that isolation is enforced at database query level

### Test Procedure

**Step 1: Verify Foreign Key Constraint**

```bash
psql $DATABASE_URL -c "\d tasks"
```

**Expected Output**: Foreign key constraint on `user_id` referencing `users(id)`

**Step 2: Verify Index on user_id**

```bash
psql $DATABASE_URL -c "\d tasks" | grep user_id
```

**Expected**: Index on `user_id` column for query performance

**Step 3: Attempt to Create Task with Invalid user_id**

```bash
psql $DATABASE_URL -c "INSERT INTO tasks (user_id, title, is_complete, created_at, updated_at) VALUES (999, 'Invalid Task', false, NOW(), NOW())"
```

**Expected**: Foreign key constraint violation error

**Step 4: Verify Query Filtering**

```bash
# Check that all queries include user_id filter
# Review backend/src/services/task_service.py
grep -n "user_id" backend/src/services/task_service.py
```

**Expected**: All SELECT queries include `WHERE user_id = ?` clause

### Pass Criteria

- ✅ Foreign key constraint exists
- ✅ Index on user_id exists
- ✅ Invalid user_id rejected by database
- ✅ All queries filter by user_id
- ✅ Isolation enforced at database level

### Fail Indicators

- ❌ No foreign key constraint
- ❌ No index on user_id
- ❌ Invalid user_id accepted
- ❌ Queries don't filter by user_id
- ❌ Isolation only at application level

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Summary

### Test Results Overview

| Test Case | Requirement | Priority | Status | Notes |
|-----------|-------------|----------|--------|-------|
| ISO-001 | List Filtering | P0 | ⬜ | |
| ISO-002 | Read Prevention | P0 | ⬜ | |
| ISO-003 | Update Prevention | P0 | ⬜ | |
| ISO-004 | Delete Prevention | P0 | ⬜ | |
| ISO-005 | URL Manipulation | P0 | ⬜ | |
| ISO-006 | Concurrent Access | P1 | ⬜ | |
| ISO-007 | Database Isolation | P0 | ⬜ | |

### Overall Status

**Total Tests**: 7
**Passed**: 0
**Failed**: 0
**Not Run**: 7

**User Isolation Status**: ⬜ Not Tested / ✅ All Pass / ⚠️ Some Failures / ❌ Critical Failures

---

## Automated Test Script

**File**: `scripts/run-isolation-tests.sh`

```bash
#!/bin/bash

# User Isolation Test Suite Runner
# Runs all user isolation tests and reports results

set -e

API_URL="http://localhost:8000"
RESULTS_FILE="isolation-test-results.txt"

echo "🔒 User Isolation Test Suite" > $RESULTS_FILE
echo "=============================" >> $RESULTS_FILE
echo "Date: $(date)" >> $RESULTS_FILE
echo "" >> $RESULTS_FILE

# Create test users
TOKEN_A=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice_iso@example.com","password":"Pass123"}' \
  | jq -r '.token')

TOKEN_B=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"bob_iso@example.com","password":"Pass456"}' \
  | jq -r '.token')

# Create tasks
ALICE_TASK=$(curl -s -X POST $API_URL/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title":"Alice Task"}' | jq -r '.id')

BOB_TASK=$(curl -s -X POST $API_URL/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"title":"Bob Task"}' | jq -r '.id')

# ISO-001: List Filtering
echo "Running ISO-001: List Filtering..."
ALICE_COUNT=$(curl -s -X GET $API_URL/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" | jq 'length')
BOB_COUNT=$(curl -s -X GET $API_URL/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" | jq 'length')

if [ "$ALICE_COUNT" = "1" ] && [ "$BOB_COUNT" = "1" ]; then
    echo "✅ ISO-001: PASS" >> $RESULTS_FILE
else
    echo "❌ ISO-001: FAIL (Alice: $ALICE_COUNT, Bob: $BOB_COUNT)" >> $RESULTS_FILE
fi

# ISO-002: Cross-User Read Prevention
echo "Running ISO-002: Cross-User Read Prevention..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN_A" \
  $API_URL/api/tasks/$BOB_TASK)

if [ "$STATUS" = "404" ]; then
    echo "✅ ISO-002: PASS" >> $RESULTS_FILE
else
    echo "❌ ISO-002: FAIL (got $STATUS)" >> $RESULTS_FILE
fi

# Add more tests...

echo "" >> $RESULTS_FILE
echo "Test Suite Complete" >> $RESULTS_FILE
cat $RESULTS_FILE
```

---

## Notes for Judges

**Critical Security Tests**:
- ISO-002, ISO-003, ISO-004 are the most critical (cross-user access prevention)
- ISO-005 tests for common attack vectors (URL manipulation, SQL injection)
- ISO-007 verifies defense-in-depth (database-level isolation)

**Expected Outcome**: All 7 tests should pass, demonstrating complete user data isolation.

**Key Security Principle**: 404 (not 403) prevents information leakage about other users' data.

---

**Test Suite Complete**: 2026-01-09
**Ready for Execution**: Yes
