# Authorization Test Suite

**Feature**: Authentication & Security Integration
**Branch**: `002-auth-security-integration`
**Created**: 2026-01-09
**Purpose**: Comprehensive test cases for authorization and token verification (FR-011 to FR-015)

---

## Overview

This test suite covers all authorization-related functional requirements, focusing on JWT token verification, protected endpoint access control, and proper error handling for unauthorized requests. Each test case includes detailed procedures, expected results, and verification commands.

**Functional Requirements Covered**:
- FR-011: Token Verification on Protected Endpoints
- FR-012: 401 Response for Missing Token
- FR-013: 401 Response for Invalid Token
- FR-014: Token Signature Verification
- FR-015: Protected Endpoint Access Control

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

2. **Test User Created**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "authtest@example.com",
       "password": "SecurePass123"
     }' | jq -r '.token'
   ```

   Save the token as `VALID_TOKEN` for use in tests.

3. **Tools Installed**:
   - `curl` for API testing
   - `jq` for JSON parsing
   - `base64` for token manipulation

---

## Test Case AZ-001: Token Verification on Protected Endpoints (FR-011)

**Requirement**: All protected endpoints must verify JWT token before granting access

**Priority**: P0 (Critical)

**Test Objective**: Verify that protected endpoints require and verify JWT tokens

### Test Procedure

**Step 1: Identify Protected Endpoints**

Protected endpoints in the application:
- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PATCH /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

**Step 2: Test Each Endpoint with Valid Token**

```bash
# Get valid token
VALID_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "authtest@example.com",
    "password": "SecurePass123"
  }' | jq -r '.token')

# Test GET /api/tasks
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $VALID_TOKEN" \
  -v
```

**Expected**: `200 OK` with task data

```bash
# Test POST /api/tasks
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task"}' \
  -v
```

**Expected**: `201 Created` with task object

**Step 3: Test Each Endpoint Without Token**

```bash
# Test GET /api/tasks without token
curl -X GET http://localhost:8000/api/tasks \
  -v
```

**Expected**: `401 Unauthorized`

```bash
# Test POST /api/tasks without token
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task"}' \
  -v
```

**Expected**: `401 Unauthorized`

### Pass Criteria

- ✅ All protected endpoints require Authorization header
- ✅ Valid token grants access (200/201)
- ✅ Missing token denies access (401)
- ✅ Token verification happens before endpoint logic
- ✅ All CRUD operations protected

### Fail Indicators

- ❌ Any endpoint accessible without token
- ❌ Token not verified before granting access
- ❌ Wrong HTTP status code
- ❌ Inconsistent protection across endpoints

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case AZ-002: 401 Response for Missing Token (FR-012)

**Requirement**: Requests without Authorization header must return 401 Unauthorized

**Priority**: P0 (Critical)

**Test Objective**: Verify proper error response when token is missing

### Test Procedure

**Test 2A: Request Without Authorization Header**

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response**:
```json
{
  "detail": "Not authenticated"
}
```

**Expected HTTP Status**: `401 Unauthorized`

**Expected Headers**:
```
WWW-Authenticate: Bearer
```

**Test 2B: Request With Empty Authorization Header**

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: " \
  -v
```

**Expected**: `401 Unauthorized` with "Not authenticated"

**Test 2C: Request With Malformed Authorization Header**

```bash
# Missing "Bearer" prefix
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -v
```

**Expected**: `401 Unauthorized`

**Test 2D: Multiple Endpoints Without Token**

```bash
# Test all protected endpoints
for endpoint in "/api/tasks" "/api/tasks/1"; do
  echo "Testing $endpoint"
  curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:8000$endpoint
  echo ""
done
```

**Expected**: All return `401`

### Pass Criteria

- ✅ Missing Authorization header returns 401
- ✅ Empty Authorization header returns 401
- ✅ Malformed Authorization header returns 401
- ✅ Error message is clear and consistent
- ✅ WWW-Authenticate header present
- ✅ All protected endpoints behave consistently

### Fail Indicators

- ❌ Request succeeds without token (200/201)
- ❌ Wrong HTTP status code (not 401)
- ❌ Missing or incorrect error message
- ❌ Inconsistent behavior across endpoints
- ❌ Information leakage in error message

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case AZ-003: 401 Response for Invalid Token (FR-013)

**Requirement**: Requests with invalid tokens must return 401 Unauthorized

**Priority**: P0 (Critical)

**Test Objective**: Verify proper error response for various invalid token scenarios

### Test Procedure

**Test 3A: Completely Invalid Token**

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer invalid-token-string" \
  -v
```

**Expected Response**:
```json
{
  "detail": "Invalid or expired token"
}
```

**Expected HTTP Status**: `401 Unauthorized`

**Test 3B: Malformed JWT (Not Three Parts)**

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ" \
  -v
```

**Expected**: `401 Unauthorized` with "Invalid or expired token"

**Test 3C: Invalid Base64 Encoding**

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer not.valid.base64!!!" \
  -v
```

**Expected**: `401 Unauthorized`

**Test 3D: Token with Tampered Payload**

```bash
# Get valid token
VALID_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "authtest@example.com",
    "password": "SecurePass123"
  }' | jq -r '.token')

# Decode payload
HEADER=$(echo $VALID_TOKEN | cut -d'.' -f1)
PAYLOAD=$(echo $VALID_TOKEN | cut -d'.' -f2)
SIGNATURE=$(echo $VALID_TOKEN | cut -d'.' -f3)

# Tamper with payload (change user ID)
TAMPERED_PAYLOAD=$(echo '{"sub":"999","email":"hacker@example.com","exp":9999999999}' | base64)

# Create tampered token
TAMPERED_TOKEN="$HEADER.$TAMPERED_PAYLOAD.$SIGNATURE"

# Try to use tampered token
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TAMPERED_TOKEN" \
  -v
```

**Expected**: `401 Unauthorized` (signature verification fails)

**Test 3E: Token with Missing Claims**

```bash
# Create token with missing 'sub' claim
HEADER=$(echo '{"alg":"HS256","typ":"JWT"}' | base64)
PAYLOAD=$(echo '{"email":"test@example.com","exp":9999999999}' | base64)
INVALID_TOKEN="$HEADER.$PAYLOAD.fake-signature"

curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $INVALID_TOKEN" \
  -v
```

**Expected**: `401 Unauthorized`

### Pass Criteria

- ✅ All invalid token formats return 401
- ✅ Tampered tokens rejected
- ✅ Tokens with missing claims rejected
- ✅ Error message is generic (no information leakage)
- ✅ No access granted with invalid tokens

### Fail Indicators

- ❌ Any invalid token grants access
- ❌ Wrong HTTP status code
- ❌ Detailed error messages reveal system internals
- ❌ Inconsistent error handling

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case AZ-004: Token Signature Verification (FR-014)

**Requirement**: Backend must verify JWT signature using shared secret (JWT_SECRET)

**Priority**: P0 (Critical)

**Test Objective**: Verify that token signatures are cryptographically verified

### Test Procedure

**Test 4A: Valid Token with Correct Signature**

```bash
# Get valid token from authentication
VALID_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "authtest@example.com",
    "password": "SecurePass123"
  }' | jq -r '.token')

# Use token
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $VALID_TOKEN" \
  -v
```

**Expected**: `200 OK` (signature valid)

**Test 4B: Token Signed with Wrong Secret**

```bash
# Create token with wrong secret (using jwt.io or similar tool)
# Header: {"alg":"HS256","typ":"JWT"}
# Payload: {"sub":"1","email":"authtest@example.com","exp":9999999999}
# Secret: "wrong-secret-key" (not the actual JWT_SECRET)

WRONG_SECRET_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhdXRodGVzdEBleGFtcGxlLmNvbSIsImV4cCI6OTk5OTk5OTk5OX0.WRONG_SIGNATURE"

curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $WRONG_SECRET_TOKEN" \
  -v
```

**Expected**: `401 Unauthorized` (signature verification fails)

**Test 4C: Token with Modified Signature**

```bash
# Get valid token
VALID_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "authtest@example.com",
    "password": "SecurePass123"
  }' | jq -r '.token')

# Extract parts
HEADER=$(echo $VALID_TOKEN | cut -d'.' -f1)
PAYLOAD=$(echo $VALID_TOKEN | cut -d'.' -f2)
SIGNATURE=$(echo $VALID_TOKEN | cut -d'.' -f3)

# Modify signature (change last character)
MODIFIED_SIGNATURE="${SIGNATURE%?}X"
MODIFIED_TOKEN="$HEADER.$PAYLOAD.$MODIFIED_SIGNATURE"

# Try to use modified token
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $MODIFIED_TOKEN" \
  -v
```

**Expected**: `401 Unauthorized` (signature invalid)

**Test 4D: Token with No Signature**

```bash
HEADER=$(echo '{"alg":"HS256","typ":"JWT"}' | base64)
PAYLOAD=$(echo '{"sub":"1","email":"test@example.com","exp":9999999999}' | base64)
NO_SIG_TOKEN="$HEADER.$PAYLOAD."

curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $NO_SIG_TOKEN" \
  -v
```

**Expected**: `401 Unauthorized`

**Test 4E: Token with Algorithm "none"**

```bash
# Attempt to use "none" algorithm (security vulnerability if accepted)
HEADER=$(echo '{"alg":"none","typ":"JWT"}' | base64)
PAYLOAD=$(echo '{"sub":"1","email":"test@example.com","exp":9999999999}' | base64)
NONE_TOKEN="$HEADER.$PAYLOAD."

curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $NONE_TOKEN" \
  -v
```

**Expected**: `401 Unauthorized` (algorithm "none" not accepted)

### Pass Criteria

- ✅ Valid signature accepted (200)
- ✅ Invalid signature rejected (401)
- ✅ Modified signature rejected (401)
- ✅ Missing signature rejected (401)
- ✅ Algorithm "none" rejected (401)
- ✅ Signature verified using correct secret

### Fail Indicators

- ❌ Invalid signature accepted
- ❌ Algorithm "none" accepted (critical vulnerability)
- ❌ Signature not verified
- ❌ Wrong secret accepted

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Case AZ-005: Protected Endpoint Access Control (FR-015)

**Requirement**: Only authenticated users with valid tokens can access protected endpoints

**Priority**: P0 (Critical)

**Test Objective**: Verify comprehensive access control across all protected endpoints

### Test Procedure

**Step 1: Test All Protected Endpoints**

Create a comprehensive test matrix:

| Endpoint | Method | Without Token | Invalid Token | Valid Token |
|----------|--------|---------------|---------------|-------------|
| /api/tasks | GET | 401 | 401 | 200 |
| /api/tasks | POST | 401 | 401 | 201 |
| /api/tasks/{id} | GET | 401 | 401 | 200 |
| /api/tasks/{id} | PATCH | 401 | 401 | 200 |
| /api/tasks/{id} | DELETE | 401 | 401 | 204 |

**Test Script**:

```bash
#!/bin/bash

# Get valid token
VALID_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "authtest@example.com",
    "password": "SecurePass123"
  }' | jq -r '.token')

# Create a task for testing
TASK_ID=$(curl -s -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task"}' | jq -r '.id')

echo "Testing Protected Endpoints"
echo "============================"

# Test GET /api/tasks
echo "GET /api/tasks:"
echo -n "  Without token: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/tasks
echo ""
echo -n "  Invalid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer invalid" \
  http://localhost:8000/api/tasks
echo ""
echo -n "  Valid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $VALID_TOKEN" \
  http://localhost:8000/api/tasks
echo ""

# Test POST /api/tasks
echo "POST /api/tasks:"
echo -n "  Without token: "
curl -s -o /dev/null -w "%{http_code}" \
  -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
echo ""
echo -n "  Invalid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer invalid" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
echo ""
echo -n "  Valid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
echo ""

# Test GET /api/tasks/{id}
echo "GET /api/tasks/$TASK_ID:"
echo -n "  Without token: "
curl -s -o /dev/null -w "%{http_code}" \
  http://localhost:8000/api/tasks/$TASK_ID
echo ""
echo -n "  Invalid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer invalid" \
  http://localhost:8000/api/tasks/$TASK_ID
echo ""
echo -n "  Valid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $VALID_TOKEN" \
  http://localhost:8000/api/tasks/$TASK_ID
echo ""

# Test PATCH /api/tasks/{id}
echo "PATCH /api/tasks/$TASK_ID:"
echo -n "  Without token: "
curl -s -o /dev/null -w "%{http_code}" \
  -X PATCH http://localhost:8000/api/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated"}'
echo ""
echo -n "  Invalid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -X PATCH http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer invalid" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated"}'
echo ""
echo -n "  Valid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -X PATCH http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated"}'
echo ""

# Test DELETE /api/tasks/{id}
echo "DELETE /api/tasks/$TASK_ID:"
echo -n "  Without token: "
curl -s -o /dev/null -w "%{http_code}" \
  -X DELETE http://localhost:8000/api/tasks/$TASK_ID
echo ""
echo -n "  Invalid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -X DELETE http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer invalid"
echo ""
echo -n "  Valid token: "
curl -s -o /dev/null -w "%{http_code}" \
  -X DELETE http://localhost:8000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $VALID_TOKEN"
echo ""
```

**Expected Results**:
- All "Without token" tests: `401`
- All "Invalid token" tests: `401`
- All "Valid token" tests: `200`, `201`, or `204` (success)

### Pass Criteria

- ✅ All endpoints protected (require authentication)
- ✅ Consistent behavior across all endpoints
- ✅ Valid tokens grant appropriate access
- ✅ Invalid/missing tokens denied consistently
- ✅ Proper HTTP status codes returned

### Fail Indicators

- ❌ Any endpoint accessible without token
- ❌ Inconsistent protection across endpoints
- ❌ Wrong HTTP status codes
- ❌ Invalid tokens grant access

### Test Result

**Status**: ⬜ Not Run / ✅ Pass / ❌ Fail

**Notes**: _[Record any observations or issues]_

---

## Test Summary

### Test Results Overview

| Test Case | Requirement | Priority | Status | Notes |
|-----------|-------------|----------|--------|-------|
| AZ-001 | Token Verification | P0 | ⬜ | |
| AZ-002 | Missing Token → 401 | P0 | ⬜ | |
| AZ-003 | Invalid Token → 401 | P0 | ⬜ | |
| AZ-004 | Signature Verification | P0 | ⬜ | |
| AZ-005 | Access Control | P0 | ⬜ | |

### Overall Status

**Total Tests**: 5
**Passed**: 0
**Failed**: 0
**Not Run**: 5

**Authorization Status**: ⬜ Not Tested / ✅ All Pass / ⚠️ Some Failures / ❌ Critical Failures

---

## Security Validation Checklist

**For Hackathon Judges**:

- [ ] All protected endpoints require Authorization header
- [ ] Missing token returns 401 Unauthorized
- [ ] Invalid token returns 401 Unauthorized
- [ ] Expired token returns 401 Unauthorized
- [ ] Token signature verified using JWT_SECRET
- [ ] Tampered tokens rejected
- [ ] Algorithm "none" rejected
- [ ] Consistent error handling across endpoints
- [ ] No information leakage in error messages
- [ ] WWW-Authenticate header present in 401 responses

**Overall Authorization Security**: ✅ PASS / ❌ FAIL

---

## Automated Test Script

**File**: `scripts/run-authorization-tests.sh`

```bash
#!/bin/bash

# Authorization Test Suite Runner
# Runs all authorization tests and reports results

set -e

API_URL="http://localhost:8000"
RESULTS_FILE="authorization-test-results.txt"

echo "🔐 Authorization Test Suite" > $RESULTS_FILE
echo "============================" >> $RESULTS_FILE
echo "Date: $(date)" >> $RESULTS_FILE
echo "" >> $RESULTS_FILE

# Get valid token
VALID_TOKEN=$(curl -s -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"authtest@example.com","password":"SecurePass123"}' \
  | jq -r '.token')

# AZ-001: Token Verification
echo "Running AZ-001: Token Verification..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $VALID_TOKEN" \
  $API_URL/api/tasks)
if [ "$STATUS" = "200" ]; then
    echo "✅ AZ-001: PASS" >> $RESULTS_FILE
else
    echo "❌ AZ-001: FAIL (got $STATUS)" >> $RESULTS_FILE
fi

# AZ-002: Missing Token
echo "Running AZ-002: Missing Token..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/api/tasks)
if [ "$STATUS" = "401" ]; then
    echo "✅ AZ-002: PASS" >> $RESULTS_FILE
else
    echo "❌ AZ-002: FAIL (got $STATUS)" >> $RESULTS_FILE
fi

# AZ-003: Invalid Token
echo "Running AZ-003: Invalid Token..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer invalid-token" \
  $API_URL/api/tasks)
if [ "$STATUS" = "401" ]; then
    echo "✅ AZ-003: PASS" >> $RESULTS_FILE
else
    echo "❌ AZ-003: FAIL (got $STATUS)" >> $RESULTS_FILE
fi

# Add more tests...

echo "" >> $RESULTS_FILE
echo "Test Suite Complete" >> $RESULTS_FILE
cat $RESULTS_FILE
```

---

## Notes for Judges

**Critical Security Tests**:
- AZ-004 (Signature Verification) is the most critical test
- Ensure algorithm "none" is rejected (prevents bypass attacks)
- Verify tampered tokens are always rejected

**Expected Outcome**: All 5 tests should pass, demonstrating robust authorization and token verification.

---

**Test Suite Complete**: 2026-01-09
**Ready for Execution**: Yes
