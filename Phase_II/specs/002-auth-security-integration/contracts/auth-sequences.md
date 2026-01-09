# Authentication Sequence Diagrams

**Feature**: Authentication & Security Integration
**Branch**: `002-auth-security-integration`
**Created**: 2026-01-09
**Purpose**: Visual documentation of authentication flows

---

## Overview

This document provides sequence diagrams for all authentication flows in the Todo Full-Stack Web Application. These diagrams illustrate the interactions between frontend, Better Auth, backend, and database components.

**Key Components**:
- **User**: End user interacting with the application
- **Frontend**: Next.js application with Better Auth
- **Better Auth**: Authentication library (JWT issuer)
- **Backend**: FastAPI application (JWT verifier)
- **Database**: Neon PostgreSQL database

---

## 1. Registration Sequence

**Flow**: New user creates an account

```
┌──────┐          ┌──────────┐          ┌─────────────┐          ┌─────────┐          ┌──────────┐
│ User │          │ Frontend │          │ Better Auth │          │ Backend │          │ Database │
└──┬───┘          └────┬─────┘          └──────┬──────┘          └────┬────┘          └────┬─────┘
   │                   │                       │                      │                     │
   │ 1. Enter email    │                       │                      │                     │
   │   and password    │                       │                      │                     │
   ├──────────────────>│                       │                      │                     │
   │                   │                       │                      │                     │
   │                   │ 2. POST /register     │                      │                     │
   │                   │   {email, password}   │                      │                     │
   │                   ├──────────────────────>│                      │                     │
   │                   │                       │                      │                     │
   │                   │                       │ 3. Validate email    │                     │
   │                   │                       │    format            │                     │
   │                   │                       │                      │                     │
   │                   │                       │ 4. Check duplicate   │                     │
   │                   │                       │    email             │                     │
   │                   │                       ├─────────────────────────────────────────>│
   │                   │                       │                      │                     │
   │                   │                       │ 5. Email unique      │                     │
   │                   │                       │<─────────────────────────────────────────┤
   │                   │                       │                      │                     │
   │                   │                       │ 6. Hash password     │                     │
   │                   │                       │    (bcrypt)          │                     │
   │                   │                       │                      │                     │
   │                   │                       │ 7. Create user       │                     │
   │                   │                       │    record            │                     │
   │                   │                       ├─────────────────────────────────────────>│
   │                   │                       │                      │                     │
   │                   │                       │ 8. User created      │                     │
   │                   │                       │    (user_id: 123)    │                     │
   │                   │                       │<─────────────────────────────────────────┤
   │                   │                       │                      │                     │
   │                   │                       │ 9. Issue JWT token   │                     │
   │                   │                       │    {sub: 123,        │                     │
   │                   │                       │     email: ...,      │                     │
   │                   │                       │     exp: +7d}        │                     │
   │                   │                       │                      │                     │
   │                   │ 10. Return user +    │                      │                     │
   │                   │     JWT token         │                      │                     │
   │                   │<──────────────────────┤                      │                     │
   │                   │                       │                      │                     │
   │                   │ 11. Store token in    │                      │                     │
   │                   │     cookies           │                      │                     │
   │                   │                       │                      │                     │
   │ 12. Redirect to   │                       │                      │                     │
   │     dashboard     │                       │                      │                     │
   │<──────────────────┤                       │                      │                     │
   │                   │                       │                      │                     │
```

**Key Points**:
- Password hashed before storage (bcrypt with cost factor 12)
- Email uniqueness checked before user creation
- JWT token issued immediately upon registration
- User authenticated automatically after registration
- Token stored in httpOnly cookies for security

**Error Cases**:
- Invalid email format → 400 Bad Request
- Duplicate email → 409 Conflict
- Password too short → 400 Bad Request

---

## 2. Sign-In Sequence

**Flow**: Existing user logs in

```
┌──────┐          ┌──────────┐          ┌─────────────┐          ┌─────────┐          ┌──────────┐
│ User │          │ Frontend │          │ Better Auth │          │ Backend │          │ Database │
└──┬───┘          └────┬─────┘          └──────┬──────┘          └────┬────┘          └────┬─────┘
   │                   │                       │                      │                     │
   │ 1. Enter email    │                       │                      │                     │
   │   and password    │                       │                      │                     │
   ├──────────────────>│                       │                      │                     │
   │                   │                       │                      │                     │
   │                   │ 2. POST /login        │                      │                     │
   │                   │   {email, password}   │                      │                     │
   │                   ├──────────────────────>│                      │                     │
   │                   │                       │                      │                     │
   │                   │                       │ 3. Find user by      │                     │
   │                   │                       │    email             │                     │
   │                   │                       ├─────────────────────────────────────────>│
   │                   │                       │                      │                     │
   │                   │                       │ 4. User found        │                     │
   │                   │                       │    {id, email,       │                     │
   │                   │                       │     hashed_password} │                     │
   │                   │                       │<─────────────────────────────────────────┤
   │                   │                       │                      │                     │
   │                   │                       │ 5. Verify password   │                     │
   │                   │                       │    hash (bcrypt)     │                     │
   │                   │                       │                      │                     │
   │                   │                       │ 6. Password valid    │                     │
   │                   │                       │                      │                     │
   │                   │                       │ 7. Issue JWT token   │                     │
   │                   │                       │    {sub: 123,        │                     │
   │                   │                       │     email: ...,      │                     │
   │                   │                       │     exp: +7d}        │                     │
   │                   │                       │                      │                     │
   │                   │ 8. Return user +     │                      │                     │
   │                   │    JWT token          │                      │                     │
   │                   │<──────────────────────┤                      │                     │
   │                   │                       │                      │                     │
   │                   │ 9. Store token in     │                      │                     │
   │                   │    cookies            │                      │                     │
   │                   │                       │                      │                     │
   │ 10. Redirect to   │                       │                      │                     │
   │     dashboard     │                       │                      │                     │
   │<──────────────────┤                       │                      │                     │
   │                   │                       │                      │                     │
```

**Key Points**:
- Password verified using constant-time comparison (bcrypt)
- Generic error message prevents email enumeration
- JWT token issued with 7-day expiration
- Token stored in httpOnly cookies

**Error Cases**:
- Invalid email → 401 Unauthorized ("Invalid email or password")
- Invalid password → 401 Unauthorized ("Invalid email or password")
- User not found → 401 Unauthorized ("Invalid email or password")

**Security Note**: Error message is intentionally generic to prevent attackers from determining which emails are registered.

---

## 3. Protected API Request Sequence

**Flow**: Authenticated user accesses protected resource

```
┌──────┐          ┌──────────┐          ┌─────────┐          ┌──────────┐          ┌──────────┐
│ User │          │ Frontend │          │ Backend │          │ JWT Lib  │          │ Database │
└──┬───┘          └────┬─────┘          └────┬────┘          └────┬─────┘          └────┬─────┘
   │                   │                     │                     │                     │
   │ 1. Request tasks  │                     │                     │                     │
   ├──────────────────>│                     │                     │                     │
   │                   │                     │                     │                     │
   │                   │ 2. GET /api/tasks   │                     │                     │
   │                   │    Authorization:   │                     │                     │
   │                   │    Bearer <token>   │                     │                     │
   │                   ├────────────────────>│                     │                     │
   │                   │                     │                     │                     │
   │                   │                     │ 3. Extract token    │                     │
   │                   │                     │    from header      │                     │
   │                   │                     │                     │                     │
   │                   │                     │ 4. Verify signature │                     │
   │                   │                     │    and expiration   │                     │
   │                   │                     ├────────────────────>│                     │
   │                   │                     │                     │                     │
   │                   │                     │ 5. Token valid      │                     │
   │                   │                     │    {sub: 123,       │                     │
   │                   │                     │     email: ...}     │                     │
   │                   │                     │<────────────────────┤                     │
   │                   │                     │                     │                     │
   │                   │                     │ 6. Load user by ID  │                     │
   │                   │                     │    (user_id: 123)   │                     │
   │                   │                     ├────────────────────────────────────────>│
   │                   │                     │                     │                     │
   │                   │                     │ 7. User object      │                     │
   │                   │                     │<────────────────────────────────────────┤
   │                   │                     │                     │                     │
   │                   │                     │ 8. Query tasks      │                     │
   │                   │                     │    WHERE user_id=123│                     │
   │                   │                     ├────────────────────────────────────────>│
   │                   │                     │                     │                     │
   │                   │                     │ 9. User's tasks     │                     │
   │                   │                     │<────────────────────────────────────────┤
   │                   │                     │                     │                     │
   │                   │ 10. Return tasks    │                     │                     │
   │                   │     (200 OK)        │                     │                     │
   │                   │<────────────────────┤                     │                     │
   │                   │                     │                     │                     │
   │ 11. Display tasks │                     │                     │                     │
   │<──────────────────┤                     │                     │                     │
   │                   │                     │                     │                     │
```

**Key Points**:
- Token extracted from Authorization header (Bearer scheme)
- Signature verified using shared secret (JWT_SECRET)
- Expiration checked automatically by JWT library
- User ID extracted from verified token claims
- Database queries filtered by authenticated user ID

**Error Cases**:
- Missing token → 401 Unauthorized
- Invalid signature → 401 Unauthorized
- Expired token → 401 Unauthorized
- User not found → 401 Unauthorized

**Security**: User ID comes from verified JWT token only, never from request parameters.

---

## 4. Token Expiration Handling Sequence

**Flow**: User attempts to use expired token

```
┌──────┐          ┌──────────┐          ┌─────────┐          ┌──────────┐
│ User │          │ Frontend │          │ Backend │          │ JWT Lib  │
└──┬───┘          └────┬─────┘          └────┬────┘          └────┬─────┘
   │                   │                     │                     │
   │ 1. Request tasks  │                     │                     │
   │   (token expired) │                     │                     │
   ├──────────────────>│                     │                     │
   │                   │                     │                     │
   │                   │ 2. GET /api/tasks   │                     │
   │                   │    Authorization:   │                     │
   │                   │    Bearer <expired> │                     │
   │                   ├────────────────────>│                     │
   │                   │                     │                     │
   │                   │                     │ 3. Extract token    │
   │                   │                     │                     │
   │                   │                     │ 4. Verify token     │
   │                   │                     ├────────────────────>│
   │                   │                     │                     │
   │                   │                     │ 5. Token expired    │
   │                   │                     │    (JWTError)       │
   │                   │                     │<────────────────────┤
   │                   │                     │                     │
   │                   │ 6. 401 Unauthorized │                     │
   │                   │    "Invalid or      │                     │
   │                   │     expired token"  │                     │
   │                   │<────────────────────┤                     │
   │                   │                     │                     │
   │                   │ 7. Clear token      │                     │
   │                   │    from storage     │                     │
   │                   │                     │                     │
   │ 8. Redirect to    │                     │                     │
   │    login page     │                     │                     │
   │<──────────────────┤                     │                     │
   │                   │                     │                     │
   │ 9. User must      │                     │                     │
   │    re-authenticate│                     │                     │
   │                   │                     │                     │
```

**Key Points**:
- Expired tokens rejected with 401 Unauthorized
- Clear error message indicates token expiration
- Frontend clears expired token from storage
- User redirected to login page for re-authentication
- No server-side token revocation needed (stateless)

**Token Lifetime**: 7 days from issuance

**Future Enhancement**: Implement refresh token mechanism for seamless re-authentication

---

## 5. Sign-Out Sequence

**Flow**: User explicitly logs out

```
┌──────┐          ┌──────────┐          ┌─────────┐
│ User │          │ Frontend │          │ Backend │
└──┬───┘          └────┬─────┘          └────┬────┘
   │                   │                     │
   │ 1. Click logout   │                     │
   │   button          │                     │
   ├──────────────────>│                     │
   │                   │                     │
   │                   │ 2. POST /api/auth/  │
   │                   │    logout           │
   │                   ├────────────────────>│
   │                   │                     │
   │                   │ 3. Acknowledge      │
   │                   │    (200 OK)         │
   │                   │<────────────────────┤
   │                   │                     │
   │                   │ 4. Clear token from │
   │                   │    cookies          │
   │                   │                     │
   │                   │ 5. Clear session    │
   │                   │    state            │
   │                   │                     │
   │ 6. Redirect to    │                     │
   │    login page     │                     │
   │<──────────────────┤                     │
   │                   │                     │
```

**Key Points**:
- Logout handled primarily client-side (clear token)
- Backend logout endpoint for API consistency
- No server-side session to invalidate (stateless JWT)
- Token will expire naturally after 7 days
- User cannot access protected resources after logout

**Security Note**: JWT tokens are stateless, so logout is handled by removing the token from client storage. The token remains technically valid until expiration, but the user no longer has access to it.

**Future Enhancement**: Implement token blacklist for immediate revocation if needed.

---

## 6. Cross-User Access Prevention Sequence

**Flow**: User A attempts to access User B's task

```
┌────────┐          ┌──────────┐          ┌─────────┐          ┌──────────┐
│ User A │          │ Frontend │          │ Backend │          │ Database │
└───┬────┘          └────┬─────┘          └────┬────┘          └────┬─────┘
    │                    │                     │                     │
    │ 1. Request task    │                     │                     │
    │    ID 999          │                     │                     │
    │    (belongs to B)  │                     │                     │
    ├───────────────────>│                     │                     │
    │                    │                     │                     │
    │                    │ 2. GET /api/tasks/  │                     │
    │                    │    999              │                     │
    │                    │    Authorization:   │                     │
    │                    │    Bearer <A-token> │                     │
    │                    ├────────────────────>│                     │
    │                    │                     │                     │
    │                    │                     │ 3. Verify token     │
    │                    │                     │    Extract user_id  │
    │                    │                     │    (user_id: 123)   │
    │                    │                     │                     │
    │                    │                     │ 4. Query task       │
    │                    │                     │    WHERE id=999     │
    │                    │                     │    AND user_id=123  │
    │                    │                     ├────────────────────>│
    │                    │                     │                     │
    │                    │                     │ 5. No match found   │
    │                    │                     │    (task belongs    │
    │                    │                     │     to user 456)    │
    │                    │                     │<────────────────────┤
    │                    │                     │                     │
    │                    │ 6. 404 Not Found    │                     │
    │                    │<────────────────────┤                     │
    │                    │                     │                     │
    │ 7. Error message   │                     │                     │
    │    "Task not found"│                     │                     │
    │<───────────────────┤                     │                     │
    │                    │                     │                     │
```

**Key Points**:
- User ID extracted from verified JWT token (user A = 123)
- Query requires both task ID AND user ID to match
- Task 999 belongs to user B (456), not user A (123)
- Query returns no results (ownership mismatch)
- Returns 404 Not Found (same as non-existent task)

**Security**: No information leakage about other users' tasks. User A cannot determine if task 999 exists or belongs to another user.

---

## Timing Diagrams

### Successful Authentication (Registration)

```
Time →
0ms     User submits form
10ms    Frontend validates input
20ms    POST /register sent
30ms    Better Auth receives request
40ms    Email format validated
50ms    Database query (check duplicate)
100ms   Email unique confirmed
110ms   Password hashed (bcrypt ~100ms)
210ms   User record created
220ms   JWT token issued
230ms   Response sent to frontend
240ms   Token stored in cookies
250ms   User redirected to dashboard
```

**Total Time**: ~250ms (dominated by bcrypt hashing)

### Successful Authentication (Login)

```
Time →
0ms     User submits form
10ms    Frontend validates input
20ms    POST /login sent
30ms    Better Auth receives request
40ms    Database query (find user by email)
90ms    User found
100ms   Password verified (bcrypt ~100ms)
200ms   JWT token issued
210ms   Response sent to frontend
220ms   Token stored in cookies
230ms   User redirected to dashboard
```

**Total Time**: ~230ms (dominated by bcrypt verification)

### Protected API Request

```
Time →
0ms     User requests data
10ms    Frontend attaches token
20ms    GET /api/tasks sent
30ms    Backend receives request
35ms    Token extracted from header
40ms    JWT signature verified (~5ms)
45ms    User ID extracted from token
50ms    Database query (load user)
100ms   User loaded
110ms   Database query (list tasks WHERE user_id)
160ms   Tasks retrieved
170ms   Response sent to frontend
180ms   Frontend displays tasks
```

**Total Time**: ~180ms (dominated by database queries)

---

## Error Paths

### Invalid Token

```
User → Frontend → Backend → JWT Lib
                     ↓
                  Invalid signature detected
                     ↓
                  401 Unauthorized
                     ↓
Frontend ← Backend
   ↓
Clear token
   ↓
Redirect to login
```

### Expired Token

```
User → Frontend → Backend → JWT Lib
                     ↓
                  Expiration check fails
                     ↓
                  401 Unauthorized
                     ↓
Frontend ← Backend
   ↓
Clear token
   ↓
Redirect to login
```

### Duplicate Email (Registration)

```
User → Frontend → Better Auth → Database
                     ↓
                  Email already exists
                     ↓
                  409 Conflict
                     ↓
Frontend ← Better Auth
   ↓
Display error message
```

---

## Summary

**Authentication Flows Documented**: 6 complete sequences
**Components Involved**: User, Frontend, Better Auth, Backend, Database, JWT Library
**Security Mechanisms**: JWT signature verification, token expiration, user data isolation
**Error Handling**: Comprehensive error paths for all failure scenarios

**Status**: ✅ All authentication flows documented and validated

---

**Documentation Complete**: 2026-01-09
**Next Steps**: Create security verification guide
