# Quickstart Guide

**Feature**: Authentication & Security Integration
**Branch**: `002-auth-security-integration`
**Created**: 2026-01-09
**Purpose**: Complete setup and verification guide for hackathon judges

---

## Overview

This guide provides step-by-step instructions to set up, run, and verify the Todo Full-Stack Web Application. Follow these instructions to:

1. Set up the development environment
2. Configure environment variables
3. Initialize the database
4. Start the application (frontend + backend)
5. Create test users
6. Verify authentication and security features
7. Troubleshoot common issues

**Estimated Time**: 15-20 minutes

**Target Audience**: Hackathon judges, developers, reviewers

---

## Prerequisites

### Required Software

- **Node.js**: Version 18+ ([Download](https://nodejs.org/))
- **Python**: Version 3.10+ ([Download](https://www.python.org/))
- **Git**: For cloning the repository ([Download](https://git-scm.com/))
- **curl**: For API testing (usually pre-installed on macOS/Linux, [Windows download](https://curl.se/windows/))

### Optional Tools

- **jq**: JSON processor for pretty-printing API responses ([Download](https://stedolan.github.io/jq/))
- **Postman**: Alternative to curl for API testing ([Download](https://www.postman.com/))
- **VS Code**: Recommended code editor ([Download](https://code.visualstudio.com/))

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check Python version
python --version  # Should be 3.10.0 or higher

# Check npm version
npm --version

# Check pip version
pip --version

# Check curl
curl --version
```

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd Phase_II

# Verify directory structure
ls -la
# Should see: backend/, frontend/, specs/, .specify/, etc.
```

---

## Step 2: Database Setup (Neon PostgreSQL)

### Option A: Use Existing Neon Database

If you have a Neon PostgreSQL database URL:

1. Copy the connection string from Neon dashboard
2. Format: `postgresql://user:password@host/database?sslmode=require`
3. Save for environment configuration (Step 3)

### Option B: Create New Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Click "Create Project"
4. Project name: `todo-app-hackathon`
5. Region: Choose closest to your location
6. Click "Create Project"
7. Copy the connection string from the dashboard
8. Save for environment configuration (Step 3)

**Database Connection String Example**:
```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## Step 3: Environment Configuration

### Backend Environment Variables

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Copy example environment file**:
```bash
cp .env.example .env
```

3. **Edit `.env` file**:
```bash
# Open in your editor
nano .env  # or code .env or vim .env
```

4. **Configure variables**:
```bash
# Database connection (from Step 2)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# JWT secret (IMPORTANT: Must be at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-for-security

# CORS origins (frontend URL)
CORS_ORIGINS=http://localhost:3000

# Environment
ENVIRONMENT=development
```

**⚠️ CRITICAL**: The `JWT_SECRET` must be at least 32 characters long and randomly generated.

**Generate Secure JWT Secret**:
```bash
# Option 1: Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 2: Using OpenSSL
openssl rand -base64 32

# Option 3: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

5. **Save and close** the `.env` file

### Frontend Environment Variables

1. **Navigate to frontend directory**:
```bash
cd ../frontend
```

2. **Copy example environment file**:
```bash
cp .env.example .env.local
```

3. **Edit `.env.local` file**:
```bash
nano .env.local  # or code .env.local
```

4. **Configure variables**:
```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth secret (MUST MATCH backend JWT_SECRET)
BETTER_AUTH_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-for-security

# Database connection (same as backend)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Node environment
NODE_ENV=development
```

**⚠️ CRITICAL**: `BETTER_AUTH_SECRET` must be **identical** to backend's `JWT_SECRET`.

5. **Save and close** the `.env.local` file

### Verify Configuration

```bash
# Backend
cd ../backend
cat .env | grep -v "^#" | grep -v "^$"

# Frontend
cd ../frontend
cat .env.local | grep -v "^#" | grep -v "^$"
```

**Checklist**:
- [ ] DATABASE_URL is set in both files
- [ ] JWT_SECRET (backend) matches BETTER_AUTH_SECRET (frontend)
- [ ] JWT_SECRET is at least 32 characters
- [ ] CORS_ORIGINS includes frontend URL
- [ ] No placeholder values remain

---

## Step 4: Backend Setup

### Install Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Verify activation (should show (venv) in prompt)
which python  # Should point to venv/bin/python

# Install dependencies
pip install -r requirements.txt
```

**Expected Output**: All packages installed successfully

### Initialize Database

```bash
# Run database migrations
alembic upgrade head
```

**Expected Output**:
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> abc123, Create users and tasks tables
```

**Verify Database Tables**:
```bash
# Connect to database (optional)
psql $DATABASE_URL

# List tables
\dt

# Expected tables:
# - users
# - tasks
# - alembic_version

# Exit psql
\q
```

### Start Backend Server

```bash
# Start FastAPI server
uvicorn src.main:app --reload --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Verify Backend

**Open new terminal** and test:

```bash
# Health check
curl http://localhost:8000/health

# Expected: {"status": "healthy"}

# API documentation
curl http://localhost:8000/docs
# Or open in browser: http://localhost:8000/docs
```

**Checklist**:
- [ ] Backend running on port 8000
- [ ] Health check returns success
- [ ] Swagger UI accessible at /docs
- [ ] No error messages in terminal

---

## Step 5: Frontend Setup

### Install Dependencies

**Open new terminal** (keep backend running):

```bash
cd frontend

# Install dependencies
npm install
```

**Expected Output**: Dependencies installed successfully (may take 2-3 minutes)

### Start Frontend Server

```bash
# Start Next.js development server
npm run dev
```

**Expected Output**:
```
   ▲ Next.js 15.1.3
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 2.5s
```

### Verify Frontend

**Open browser** and navigate to:
- **Frontend**: http://localhost:3000
- **Expected**: Todo application homepage with sign-up/sign-in forms

**Checklist**:
- [ ] Frontend running on port 3000
- [ ] Homepage loads without errors
- [ ] Sign-up form visible
- [ ] Sign-in form visible
- [ ] No console errors in browser DevTools

---

## Step 6: Create Test Users

### Method A: Using Frontend UI

1. **Open browser**: http://localhost:3000
2. **Navigate to Sign Up** page
3. **Enter credentials**:
   - Email: `alice@example.com`
   - Password: `SecurePass123`
4. **Click "Sign Up"**
5. **Expected**: Redirected to dashboard with empty task list
6. **Sign Out** (if sign-out button available)
7. **Repeat** for second user:
   - Email: `bob@example.com`
   - Password: `SecurePass456`

### Method B: Using API (curl)

**User A (Alice)**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123"
  }' | jq
```

**Expected Response**:
```json
{
  "user": {
    "id": 1,
    "email": "alice@example.com",
    "created_at": "2026-01-09T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save Token**:
```bash
TOKEN_A="<paste-token-here>"
```

**User B (Bob)**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "password": "SecurePass456"
  }' | jq
```

**Save Token**:
```bash
TOKEN_B="<paste-token-here>"
```

**Checklist**:
- [ ] User A created successfully
- [ ] User B created successfully
- [ ] Both tokens saved for testing
- [ ] No error messages

---

## Step 7: Verify Authentication

### Test 1: Sign In

**Using Frontend**:
1. Navigate to Sign In page
2. Enter Alice's credentials
3. Click "Sign In"
4. **Expected**: Redirected to dashboard

**Using API**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123"
  }' | jq
```

**Expected**: `200 OK` with user object and JWT token

### Test 2: Access Protected Endpoint

**Without Token** (should fail):
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Content-Type: application/json"
```

**Expected**: `401 Unauthorized` with "Not authenticated"

**With Valid Token** (should succeed):
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A"
```

**Expected**: `200 OK` with empty array `[]` (new user has no tasks)

### Test 3: Create Task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Task",
    "description": "Testing task creation"
  }' | jq
```

**Expected Response**:
```json
{
  "id": 1,
  "user_id": 1,
  "title": "My First Task",
  "description": "Testing task creation",
  "is_complete": false,
  "created_at": "2026-01-09T10:00:00Z",
  "updated_at": "2026-01-09T10:00:00Z"
}
```

### Test 4: List Tasks

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" | jq
```

**Expected**: Array with 1 task (the one just created)

**Checklist**:
- [ ] Sign-in works with valid credentials
- [ ] Sign-in fails with invalid credentials
- [ ] Protected endpoints require authentication
- [ ] Tasks can be created
- [ ] Tasks can be listed

---

## Step 8: Verify User Isolation

### Create Tasks for Both Users

**Alice creates 2 tasks**:
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title": "Alice Task 1", "description": "Belongs to Alice"}'

curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title": "Alice Task 2", "description": "Also belongs to Alice"}'
```

**Bob creates 2 tasks**:
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"title": "Bob Task 1", "description": "Belongs to Bob"}'

curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"title": "Bob Task 2", "description": "Also belongs to Bob"}'
```

### Verify Isolation

**Alice lists tasks** (should see only her 2 tasks):
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" | jq
```

**Expected**: Array with 2 tasks (both Alice's)

**Bob lists tasks** (should see only his 2 tasks):
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" | jq
```

**Expected**: Array with 2 tasks (both Bob's)

### Test Cross-User Access Prevention

**Get Bob's task ID**:
```bash
BOB_TASK_ID=$(curl -s -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_B" | jq -r '.[0].id')

echo "Bob's task ID: $BOB_TASK_ID"
```

**Alice attempts to access Bob's task** (should fail):
```bash
curl -X GET http://localhost:8000/api/tasks/$BOB_TASK_ID \
  -H "Authorization: Bearer $TOKEN_A" \
  -v
```

**Expected**: `404 Not Found` with "Task not found"

**Checklist**:
- [ ] Alice sees only her own tasks
- [ ] Bob sees only his own tasks
- [ ] Alice cannot access Bob's tasks
- [ ] Bob cannot access Alice's tasks
- [ ] Cross-user access returns 404 (not 403)

---

## Step 9: Verify Security Features

For comprehensive security verification, see: [`contracts/security-verification.md`](./contracts/security-verification.md)

### Quick Security Checks

**1. Authorization Required**:
```bash
curl -X GET http://localhost:8000/api/tasks
# Expected: 401 Unauthorized
```

**2. Invalid Token Rejected**:
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer invalid-token"
# Expected: 401 Unauthorized
```

**3. User ID from Token Only**:
```bash
# Attempt to create task with different user_id
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 999, "title": "Test"}' | jq

# Expected: Task created with user_id=1 (from token), not 999
```

**Checklist**:
- [ ] All protected endpoints require authentication
- [ ] Invalid tokens rejected
- [ ] User ID always from verified token
- [ ] No security vulnerabilities detected

---

## Step 10: Explore API Documentation

### Swagger UI (Interactive)

1. **Open browser**: http://localhost:8000/docs
2. **Explore endpoints**:
   - Authentication: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
   - Tasks: `/api/tasks` (GET, POST), `/api/tasks/{id}` (GET, PATCH, DELETE)
3. **Try endpoints**:
   - Click "Try it out"
   - Enter parameters
   - Click "Execute"
   - View response

### OpenAPI Specifications

**Authentication API**: [`contracts/auth-api.yaml`](./contracts/auth-api.yaml)
**Tasks API**: [`contracts/tasks-api.yaml`](./contracts/tasks-api.yaml)

### Sequence Diagrams

**Authentication Flows**: [`contracts/auth-sequences.md`](./contracts/auth-sequences.md)

---

## Troubleshooting

### Issue 1: Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

---

### Issue 2: Database Connection Failed

**Error**: `sqlalchemy.exc.OperationalError: could not connect to server`

**Solution**:
1. Verify DATABASE_URL is correct
2. Check Neon database is running (check Neon console)
3. Ensure SSL mode is included: `?sslmode=require`
4. Test connection:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

---

### Issue 3: Frontend Can't Connect to Backend

**Error**: `Failed to fetch` or `Network error`

**Solution**:
1. Verify backend is running on port 8000
2. Check NEXT_PUBLIC_API_URL in frontend/.env.local
3. Verify CORS_ORIGINS in backend/.env includes `http://localhost:3000`
4. Restart both servers

---

### Issue 4: JWT Token Invalid

**Error**: `401 Unauthorized` with valid token

**Solution**:
1. **Check secret match**:
```bash
# Backend
grep JWT_SECRET backend/.env

# Frontend
grep BETTER_AUTH_SECRET frontend/.env.local
```

2. **Ensure secrets are identical**
3. **Restart both servers** after changing secrets
4. **Generate new token** (login again)

---

### Issue 5: Token Expired

**Error**: `Invalid or expired token`

**Solution**:
- Tokens expire after 7 days
- Login again to get new token
- For testing, tokens are valid for 7 days from issuance

---

### Issue 6: Port Already in Use

**Error**: `Address already in use: 8000` or `Port 3000 is already in use`

**Solution**:
```bash
# Find process using port
# macOS/Linux:
lsof -i :8000
lsof -i :3000

# Windows:
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
uvicorn src.main:app --reload --port 8001  # Backend
npm run dev -- -p 3001  # Frontend
```

---

### Issue 7: Alembic Migration Failed

**Error**: `Target database is not up to date`

**Solution**:
```bash
# Check current revision
alembic current

# Check available revisions
alembic history

# Upgrade to latest
alembic upgrade head

# If issues persist, reset database (CAUTION: deletes all data)
alembic downgrade base
alembic upgrade head
```

---

## Common Commands Reference

### Backend

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Start server
uvicorn src.main:app --reload --port 8000

# Run migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "Description"

# Run tests (if available)
pytest

# Deactivate virtual environment
deactivate
```

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run tests (if available)
npm test
```

### Database

```bash
# Connect to database
psql $DATABASE_URL

# List tables
\dt

# Describe table
\d users
\d tasks

# Query data
SELECT * FROM users;
SELECT * FROM tasks;

# Exit
\q
```

---

## Next Steps

### For Hackathon Judges

1. **Review Documentation**:
   - [`spec.md`](./spec.md) - Feature specification
   - [`plan.md`](./plan.md) - Implementation plan
   - [`data-model.md`](./data-model.md) - Database schema
   - [`contracts/auth-api.yaml`](./contracts/auth-api.yaml) - Authentication API
   - [`contracts/tasks-api.yaml`](./contracts/tasks-api.yaml) - Tasks API
   - [`contracts/auth-sequences.md`](./contracts/auth-sequences.md) - Flow diagrams

2. **Run Security Verification**:
   - Follow [`contracts/security-verification.md`](./contracts/security-verification.md)
   - Verify all 8 security requirements
   - Document results

3. **Test User Isolation**:
   - Create multiple users
   - Verify data isolation
   - Attempt cross-user access
   - Confirm 404 responses

4. **Review Code**:
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - Models: `backend/src/models/`
   - Services: `backend/src/services/`
   - API routes: `backend/src/api/`

### For Developers

1. **Explore Codebase**:
   - Review architecture and patterns
   - Understand authentication flow
   - Study user isolation implementation

2. **Add Features**:
   - Implement additional task fields
   - Add task categories or tags
   - Implement task sharing (with proper authorization)

3. **Enhance Security**:
   - Add rate limiting
   - Implement refresh tokens
   - Add email verification
   - Implement password reset

4. **Improve Testing**:
   - Add unit tests
   - Add integration tests
   - Add end-to-end tests
   - Implement CI/CD pipeline

---

## Additional Resources

### Documentation

- **Research Analysis**: [`research.md`](./research.md)
- **Task Breakdown**: [`tasks.md`](./tasks.md)
- **Constitution**: [`../.specify/memory/constitution.md`](../.specify/memory/constitution.md)

### External Documentation

- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com/
- **Better Auth**: https://www.better-auth.com/docs
- **SQLModel**: https://sqlmodel.tiangolo.com/
- **Neon**: https://neon.tech/docs
- **JWT**: https://jwt.io/introduction

### Tools

- **Swagger UI**: http://localhost:8000/docs (when backend running)
- **ReDoc**: http://localhost:8000/redoc (alternative API docs)
- **JWT Debugger**: https://jwt.io/ (decode and verify tokens)

---

## Summary

**Setup Time**: 15-20 minutes
**Components**: Frontend (Next.js), Backend (FastAPI), Database (Neon PostgreSQL)
**Authentication**: Better Auth with JWT tokens
**Security**: 8 security requirements verified

**Status**: ✅ Application ready for testing and verification

**Support**: For issues or questions, refer to troubleshooting section or review documentation artifacts.

---

**Quickstart Guide Complete**: 2026-01-09
**Ready for Judge Review**: Yes
