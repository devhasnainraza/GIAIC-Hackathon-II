# End-to-End Test Scenarios

**Feature**: Authentication & Security Integration
**Branch**: `002-auth-security-integration`
**Created**: 2026-01-09
**Purpose**: Comprehensive end-to-end test scenarios for complete user journeys

---

## Overview

This document provides comprehensive end-to-end (E2E) test scenarios that validate the complete user experience from registration through application usage. These scenarios test the integration of all components (frontend, backend, database, authentication) working together.

**Scenario Types**:
- Complete user journeys (happy path)
- Multi-user isolation scenarios
- Token expiration and renewal
- Error handling and recovery
- Edge cases and boundary conditions

**Test Environment**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: Neon PostgreSQL
- Browser: Chrome/Firefox (latest version)

**Test Tools**:
- Manual testing via browser
- API testing via curl
- Browser DevTools for debugging
- Screen recording for evidence

---

## How to Use This Document

### Test Execution

1. **Preparation**:
   - Start application (see [`../quickstart.md`](../quickstart.md))
   - Clear browser cache and cookies
   - Open browser DevTools (F12)
   - Start screen recording (optional but recommended)

2. **Execute Scenarios**:
   - Follow each scenario step-by-step
   - Document actual results vs expected results
   - Take screenshots at key points
   - Note any deviations or issues

3. **Evidence Collection**:
   - Save screenshots for each scenario
   - Record API requests/responses from Network tab
   - Document any errors in Console tab
   - Save screen recordings for complex scenarios

4. **Report Results**:
   - Mark each scenario as Pass/Fail
   - Document any bugs or issues found
   - Provide recommendations if needed

---

## Scenario E2E-001: Complete User Journey (Happy Path)

**Objective**: Verify complete user experience from registration to task management

**Priority**: P0 (Critical)

**Duration**: ~5 minutes

**Prerequisites**: Clean database, no existing test users

### Test Steps

**Step 1: User Registration**

1. Open browser and navigate to http://localhost:3000
2. Click "Sign Up" or navigate to registration page
3. Enter credentials:
   - Email: `testuser@example.com`
   - Password: `SecurePass123`
4. Click "Sign Up" button

**Expected Result**:
- Registration successful
- User redirected to dashboard
- Welcome message displayed
- Empty task list shown

**Screenshot**: `e2e-001-step1-registration.png`

**Step 2: Create First Task**

1. Click "Add Task" or "New Task" button
2. Enter task details:
   - Title: `Complete project documentation`
   - Description: `Write comprehensive docs for authentication`
3. Click "Create" or "Save" button

**Expected Result**:
- Task created successfully
- Task appears in task list
- Task shows as incomplete (unchecked)
- Success notification displayed

**Screenshot**: `e2e-001-step2-create-task.png`

**Step 3: Create Additional Tasks**

1. Create second task:
   - Title: `Review pull requests`
   - Description: `Review team's code changes`
2. Create third task:
   - Title: `Update dependencies`
   - Description: `Update npm packages to latest versions`

**Expected Result**:
- All 3 tasks visible in list
- Tasks ordered by creation date (newest first)
- Each task has title, description, completion status

**Screenshot**: `e2e-001-step3-multiple-tasks.png`

**Step 4: Mark Task as Complete**

1. Click checkbox or "Complete" button on first task
2. Verify task marked as complete

**Expected Result**:
- Task marked as complete (checked)
- Visual indication of completion (strikethrough, different color, etc.)
- Task remains in list

**Screenshot**: `e2e-001-step4-complete-task.png`

**Step 5: Edit Task**

1. Click "Edit" button on second task
2. Update title to: `Review and merge pull requests`
3. Update description to: `Review, test, and merge team's code changes`
4. Click "Save" button

**Expected Result**:
- Task updated successfully
- New title and description displayed
- Updated timestamp changed
- Success notification displayed

**Screenshot**: `e2e-001-step5-edit-task.png`

**Step 6: Delete Task**

1. Click "Delete" button on third task
2. Confirm deletion (if confirmation dialog appears)

**Expected Result**:
- Task deleted successfully
- Task removed from list
- Task count updated (now 2 tasks)
- Success notification displayed

**Screenshot**: `e2e-001-step6-delete-task.png`

**Step 7: Sign Out**

1. Click "Sign Out" or "Logout" button
2. Confirm sign out if prompted

**Expected Result**:
- User signed out successfully
- Redirected to login page
- Cannot access dashboard without authentication
- Session cleared

**Screenshot**: `e2e-001-step7-signout.png`

**Step 8: Sign In Again**

1. Enter credentials:
   - Email: `testuser@example.com`
   - Password: `SecurePass123`
2. Click "Sign In" button

**Expected Result**:
- Sign in successful
- Redirected to dashboard
- Previous tasks still visible (2 tasks)
- Task states preserved (first task still marked complete)

**Screenshot**: `e2e-001-step8-signin-again.png`

### Verification Checklist

- [ ] Registration successful
- [ ] Tasks can be created
- [ ] Tasks can be marked complete
- [ ] Tasks can be edited
- [ ] Tasks can be deleted
- [ ] Sign out works correctly
- [ ] Sign in restores session
- [ ] Data persists across sessions

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Actual Results**: _[Document what actually happened]_

**Issues Found**: _[List any bugs or problems]_

**Evidence**: _[List screenshot files or video recording]_

---

## Scenario E2E-002: Multi-User Isolation

**Objective**: Verify complete data isolation between multiple users

**Priority**: P0 (Critical)

**Duration**: ~10 minutes

**Prerequisites**: Clean database

### Test Steps

**Step 1: Create User A (Alice)**

1. Open browser (or incognito window)
2. Navigate to http://localhost:3000
3. Register as Alice:
   - Email: `alice@example.com`
   - Password: `AlicePass123`
4. Create 3 tasks for Alice:
   - "Alice Task 1"
   - "Alice Task 2"
   - "Alice Task 3"

**Expected Result**:
- Alice registered successfully
- 3 tasks created and visible
- All tasks show `user_id: 1` (if visible in UI)

**Screenshot**: `e2e-002-step1-alice-tasks.png`

**Step 2: Create User B (Bob)**

1. Open new browser window or incognito window
2. Navigate to http://localhost:3000
3. Register as Bob:
   - Email: `bob@example.com`
   - Password: `BobPass456`
4. Create 3 tasks for Bob:
   - "Bob Task 1"
   - "Bob Task 2"
   - "Bob Task 3"

**Expected Result**:
- Bob registered successfully
- 3 tasks created and visible
- All tasks show `user_id: 2` (if visible in UI)
- Bob does NOT see Alice's tasks

**Screenshot**: `e2e-002-step2-bob-tasks.png`

**Step 3: Verify Alice's View**

1. Switch to Alice's browser window
2. Refresh page or navigate to task list

**Expected Result**:
- Alice sees only her 3 tasks
- No Bob tasks visible
- Task count shows 3

**Screenshot**: `e2e-002-step3-alice-view.png`

**Step 4: Verify Bob's View**

1. Switch to Bob's browser window
2. Refresh page or navigate to task list

**Expected Result**:
- Bob sees only his 3 tasks
- No Alice tasks visible
- Task count shows 3

**Screenshot**: `e2e-002-step4-bob-view.png`

**Step 5: Attempt Cross-User Access (API Level)**

1. Open DevTools in Alice's browser
2. Go to Network tab
3. Perform any task operation (e.g., mark task complete)
4. Copy Alice's JWT token from Authorization header
5. Open DevTools in Bob's browser
6. Get Bob's task ID from Network tab
7. Use curl to attempt Alice accessing Bob's task:

```bash
curl -X GET http://localhost:8000/api/tasks/$BOB_TASK_ID \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -v
```

**Expected Result**:
- Request returns `404 Not Found`
- Bob's task not accessible to Alice
- No data leakage

**Step 6: Concurrent Operations**

1. In Alice's browser: Create new task "Alice Task 4"
2. Simultaneously in Bob's browser: Create new task "Bob Task 4"
3. Verify both operations succeed

**Expected Result**:
- Both tasks created successfully
- No interference between users
- Each user sees only their own new task

**Screenshot**: `e2e-002-step6-concurrent.png`

**Step 7: Sign Out and Cross-Check**

1. Sign out Alice
2. Sign in as Bob in Alice's browser window
3. Verify Bob sees his 4 tasks (not Alice's)

**Expected Result**:
- Bob's session works in Alice's browser
- Bob sees only his own tasks
- Complete isolation maintained

### Verification Checklist

- [ ] Alice sees only her tasks
- [ ] Bob sees only his tasks
- [ ] No cross-user visibility
- [ ] API-level access prevention works
- [ ] Concurrent operations don't interfere
- [ ] Session switching maintains isolation

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Actual Results**: _[Document what actually happened]_

**Issues Found**: _[List any bugs or problems]_

**Evidence**: _[List screenshot files or video recording]_

---

## Scenario E2E-003: Token Expiration and Renewal

**Objective**: Verify token expiration handling and user experience

**Priority**: P1 (High)

**Duration**: ~15 minutes (includes waiting time)

**Prerequisites**: Temporarily modify token expiration for testing

### Setup

**Modify Token Expiration** (for testing only):

1. Edit `frontend/src/lib/auth.ts`
2. Change `expiresIn: "7d"` to `expiresIn: "2m"` (2 minutes)
3. Restart frontend server

### Test Steps

**Step 1: Sign In and Note Time**

1. Navigate to http://localhost:3000
2. Sign in with test credentials
3. Note current time: _________
4. Token expires at: _________ (current time + 2 minutes)

**Expected Result**:
- Sign in successful
- Dashboard accessible

**Step 2: Use Application Normally (Within Token Lifetime)**

1. Create a task
2. Edit a task
3. Mark task as complete
4. All operations within 2-minute window

**Expected Result**:
- All operations succeed
- No authentication errors
- Normal application behavior

**Screenshot**: `e2e-003-step2-normal-usage.png`

**Step 3: Wait for Token Expiration**

1. Wait 2.5 minutes (token expires after 2 minutes)
2. Do not interact with application during wait

**Step 4: Attempt Operation After Expiration**

1. Try to create a new task
2. Or try to mark task as complete
3. Or try to refresh task list

**Expected Result**:
- Operation fails with authentication error
- Error message: "Session expired" or "Please sign in again"
- User redirected to login page
- Or error notification displayed

**Screenshot**: `e2e-003-step4-expired-token.png`

**Step 5: Sign In Again**

1. Enter credentials on login page
2. Sign in

**Expected Result**:
- Sign in successful
- New token issued
- Redirected to dashboard
- Previous tasks still visible
- Can perform operations again

**Screenshot**: `e2e-003-step5-renewed-session.png`

**Step 6: Verify API-Level Expiration**

1. Get token from DevTools Network tab
2. Wait for expiration
3. Use curl to test expired token:

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $EXPIRED_TOKEN" \
  -v
```

**Expected Result**:
- API returns `401 Unauthorized`
- Error message: "Invalid or expired token"

### Cleanup

**Restore Original Expiration**:

1. Edit `frontend/src/lib/auth.ts`
2. Change back to `expiresIn: "7d"`
3. Restart frontend server

### Verification Checklist

- [ ] Token expires after configured time
- [ ] Expired token rejected by backend
- [ ] User notified of expiration
- [ ] User redirected to login
- [ ] Re-authentication works
- [ ] Data persists after re-authentication

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Actual Results**: _[Document what actually happened]_

**Issues Found**: _[List any bugs or problems]_

**Evidence**: _[List screenshot files or video recording]_

---

## Scenario E2E-004: Error Handling and Recovery

**Objective**: Verify application handles errors gracefully

**Priority**: P1 (High)

**Duration**: ~10 minutes

**Prerequisites**: Application running

### Test Steps

**Test 4A: Invalid Credentials**

1. Navigate to login page
2. Enter invalid credentials:
   - Email: `nonexistent@example.com`
   - Password: `WrongPassword123`
3. Click "Sign In"

**Expected Result**:
- Login fails
- Error message: "Invalid email or password"
- User remains on login page
- Can try again

**Screenshot**: `e2e-004-test4a-invalid-creds.png`

**Test 4B: Duplicate Email Registration**

1. Register user: `duplicate@example.com`
2. Sign out
3. Attempt to register again with same email

**Expected Result**:
- Registration fails
- Error message: "Email already registered"
- User remains on registration page
- Can try different email

**Screenshot**: `e2e-004-test4b-duplicate-email.png`

**Test 4C: Network Error Simulation**

1. Sign in successfully
2. Open DevTools → Network tab
3. Enable "Offline" mode
4. Try to create a task

**Expected Result**:
- Operation fails
- Error message: "Network error" or "Unable to connect"
- User can retry when back online
- No data corruption

**Screenshot**: `e2e-004-test4c-network-error.png`

**Test 4D: Invalid Input Validation**

1. Try to create task with empty title
2. Try to create task with very long title (>200 characters)
3. Try to create task with very long description (>2000 characters)

**Expected Result**:
- Validation errors displayed
- Clear error messages
- Form not submitted
- User can correct and retry

**Screenshot**: `e2e-004-test4d-validation.png`

**Test 4E: Backend Unavailable**

1. Stop backend server
2. Try to perform any operation in frontend

**Expected Result**:
- Error message displayed
- User notified backend unavailable
- Frontend doesn't crash
- Can retry when backend restored

**Screenshot**: `e2e-004-test4e-backend-down.png`

**Test 4F: Recovery After Error**

1. Restart backend server
2. Refresh page or retry operation

**Expected Result**:
- Application recovers
- Operations work again
- No data loss
- User can continue normally

### Verification Checklist

- [ ] Invalid credentials handled gracefully
- [ ] Duplicate email prevented
- [ ] Network errors handled
- [ ] Input validation works
- [ ] Backend unavailability handled
- [ ] Application recovers after errors

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Actual Results**: _[Document what actually happened]_

**Issues Found**: _[List any bugs or problems]_

**Evidence**: _[List screenshot files or video recording]_

---

## Scenario E2E-005: Browser Compatibility

**Objective**: Verify application works across different browsers

**Priority**: P2 (Medium)

**Duration**: ~15 minutes

**Prerequisites**: Multiple browsers installed

### Test Steps

**Test in Chrome**:
1. Complete Scenario E2E-001 in Chrome
2. Document any issues

**Test in Firefox**:
1. Complete Scenario E2E-001 in Firefox
2. Document any issues

**Test in Safari** (if on macOS):
1. Complete Scenario E2E-001 in Safari
2. Document any issues

**Test in Edge**:
1. Complete Scenario E2E-001 in Edge
2. Document any issues

### Verification Checklist

- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work
- [ ] Consistent behavior across browsers
- [ ] No browser-specific bugs

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Browser Compatibility Matrix**:

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Registration | ⬜ | ⬜ | ⬜ | ⬜ |
| Sign In | ⬜ | ⬜ | ⬜ | ⬜ |
| Create Task | ⬜ | ⬜ | ⬜ | ⬜ |
| Edit Task | ⬜ | ⬜ | ⬜ | ⬜ |
| Delete Task | ⬜ | ⬜ | ⬜ | ⬜ |
| Sign Out | ⬜ | ⬜ | ⬜ | ⬜ |

---

## Scenario E2E-006: Mobile Responsiveness

**Objective**: Verify application works on mobile devices

**Priority**: P2 (Medium)

**Duration**: ~10 minutes

**Prerequisites**: Mobile device or browser DevTools mobile emulation

### Test Steps

**Step 1: Enable Mobile Emulation**

1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select device: iPhone 12 Pro

**Step 2: Test Registration**

1. Navigate to registration page
2. Complete registration form
3. Verify form is usable on mobile

**Expected Result**:
- Form fields properly sized
- Buttons easily tappable
- No horizontal scrolling
- Keyboard doesn't obscure fields

**Screenshot**: `e2e-006-step2-mobile-registration.png`

**Step 3: Test Task Management**

1. Create task on mobile
2. Edit task on mobile
3. Delete task on mobile

**Expected Result**:
- All operations work on mobile
- UI elements properly sized
- Touch interactions work
- No layout issues

**Screenshot**: `e2e-006-step3-mobile-tasks.png`

### Verification Checklist

- [ ] Registration works on mobile
- [ ] Sign in works on mobile
- [ ] Task creation works on mobile
- [ ] Task editing works on mobile
- [ ] Task deletion works on mobile
- [ ] Layout responsive
- [ ] No horizontal scrolling
- [ ] Touch interactions work

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

---

## Scenario E2E-007: Performance and Load

**Objective**: Verify application performs well under load

**Priority**: P2 (Medium)

**Duration**: ~15 minutes

**Prerequisites**: Application running

### Test Steps

**Test 7A: Large Task List**

1. Create 100 tasks using API script:

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123"}' \
  | jq -r '.token')

for i in {1..100}; do
  curl -X POST http://localhost:8000/api/tasks \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Task $i\",\"description\":\"Description $i\"}"
done
```

2. Refresh frontend
3. Measure page load time

**Expected Result**:
- Page loads in <3 seconds
- All tasks displayed
- Scrolling smooth
- No performance issues

**Test 7B: Rapid Operations**

1. Rapidly create 10 tasks (as fast as possible)
2. Rapidly mark 10 tasks complete
3. Rapidly delete 10 tasks

**Expected Result**:
- All operations succeed
- No errors or timeouts
- UI remains responsive
- No data corruption

**Test 7C: Concurrent Users**

1. Open 5 browser windows
2. Sign in as different users in each
3. Perform operations simultaneously

**Expected Result**:
- All operations succeed
- No interference between users
- Backend handles concurrent requests
- No database deadlocks

### Verification Checklist

- [ ] Large task lists handled well
- [ ] Rapid operations work
- [ ] Concurrent users supported
- [ ] No performance degradation
- [ ] No errors under load

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

---

## Test Summary

### Scenario Results Overview

| Scenario | Priority | Status | Issues |
|----------|----------|--------|--------|
| E2E-001: Complete User Journey | P0 | ⬜ | |
| E2E-002: Multi-User Isolation | P0 | ⬜ | |
| E2E-003: Token Expiration | P1 | ⬜ | |
| E2E-004: Error Handling | P1 | ⬜ | |
| E2E-005: Browser Compatibility | P2 | ⬜ | |
| E2E-006: Mobile Responsiveness | P2 | ⬜ | |
| E2E-007: Performance | P2 | ⬜ | |

### Overall Status

**Total Scenarios**: 7
**Passed**: 0
**Failed**: 0
**Not Run**: 7

**E2E Test Status**: ⬜ Not Tested / ✅ All Pass / ⚠️ Some Failures / ❌ Critical Failures

---

## Evidence Collection Guidelines

### Screenshots

**Naming Convention**: `e2e-[scenario]-step[number]-[description].png`

**Examples**:
- `e2e-001-step1-registration.png`
- `e2e-002-step3-alice-view.png`
- `e2e-004-test4a-invalid-creds.png`

**Required Screenshots**:
- Registration success
- Task creation
- Task list view
- Error messages
- Multi-user isolation
- Token expiration handling

### Screen Recordings

**Recommended for**:
- Complete user journey (E2E-001)
- Multi-user isolation (E2E-002)
- Error handling (E2E-004)

**Tools**:
- OBS Studio (free, cross-platform)
- QuickTime Player (macOS)
- Windows Game Bar (Windows)
- Browser extensions (Loom, etc.)

### API Logs

**Capture from DevTools Network Tab**:
- Request headers (especially Authorization)
- Response status codes
- Response bodies
- Error messages

**Export as HAR file** for detailed analysis

---

## Notes for Judges

**Test Execution**:
1. Run P0 scenarios first (E2E-001, E2E-002)
2. P1 scenarios are important but not critical
3. P2 scenarios are nice-to-have

**Expected Outcome**: All P0 scenarios should pass completely.

**Time Estimate**: ~45 minutes for all scenarios

**Evidence**: Screenshots and recordings provide proof of testing

---

**End-to-End Test Scenarios Complete**: 2026-01-09
**Ready for Execution**: Yes
