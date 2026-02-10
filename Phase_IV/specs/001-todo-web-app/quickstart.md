# Quickstart Guide: Todo Full-Stack Web Application

**Date**: 2026-01-09
**Feature**: 001-todo-web-app
**Purpose**: Setup and run instructions for local development

## Overview

This guide provides step-by-step instructions to set up and run the Todo Full-Stack Web Application locally. The application consists of a Next.js frontend, FastAPI backend, and Neon PostgreSQL database.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**: Comes with Node.js
- **Python**: Version 3.11+ ([Download](https://www.python.org/))
- **pip**: Python package manager (comes with Python)
- **Git**: Version control ([Download](https://git-scm.com/))
- **Neon Account**: Free PostgreSQL database ([Sign up](https://neon.tech/))

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check Python version
python --version  # Should be 3.11.0 or higher

# Check pip
pip --version

# Check Git
git --version
```

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd Phase_II
git checkout 001-todo-web-app
```

## Step 2: Database Setup (Neon PostgreSQL)

### 2.1 Create Neon Project

1. Go to [Neon Console](https://console.neon.tech/)
2. Click "Create Project"
3. Choose a project name (e.g., "todo-app")
4. Select a region (closest to your location)
5. Click "Create Project"

### 2.2 Get Connection String

1. In Neon Console, go to your project dashboard
2. Click "Connection Details"
3. Copy the connection string (format: `postgresql://user:password@host/database`)
4. **Important**: Ensure `?sslmode=require` is appended to the connection string

**Example Connection String**:
```
postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 2.3 Save Connection String

You'll need this connection string for both backend and frontend environment variables.

## Step 3: Backend Setup

### 3.1 Navigate to Backend Directory

```bash
cd backend
```

### 3.2 Create Virtual Environment

**Linux/macOS**:
```bash
python -m venv venv
source venv/bin/activate
```

**Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```

### 3.3 Install Dependencies

```bash
pip install -r requirements.txt
```

**Expected Dependencies**:
- fastapi
- uvicorn[standard]
- sqlmodel
- psycopg2-binary
- python-jose[cryptography]
- passlib[bcrypt]
- python-multipart
- alembic

### 3.4 Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# backend/.env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your-secret-key-minimum-32-characters-long
CORS_ORIGINS=http://localhost:3000
```

**Generate JWT Secret**:
```bash
# Generate a secure random secret (32+ characters)
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Important**: Copy the generated secret - you'll need it for the frontend too.

### 3.5 Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Create users and tasks tables"

# Apply migrations
alembic upgrade head
```

**Verify Migration**:
```bash
# Check Neon Console to see tables created: users, tasks
```

### 3.6 Start Backend Server

```bash
uvicorn src.main:app --reload --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 3.7 Verify Backend

Open browser and navigate to:
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Health Check**: http://localhost:8000/ (should return API info)

**Test API**:
```bash
# Test health endpoint
curl http://localhost:8000/

# Expected response: {"message": "Todo API", "version": "1.0.0"}
```

## Step 4: Frontend Setup

### 4.1 Open New Terminal

Keep the backend server running and open a new terminal window.

### 4.2 Navigate to Frontend Directory

```bash
cd frontend
```

### 4.3 Install Dependencies

```bash
npm install
# or
yarn install
```

**Expected Dependencies**:
- next (16+)
- react (18+)
- react-dom
- better-auth
- tailwindcss
- typescript

### 4.4 Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters-long
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**Important**: Use the **same JWT secret** as the backend (`JWT_SECRET` = `BETTER_AUTH_SECRET`).

### 4.5 Start Frontend Development Server

```bash
npm run dev
# or
yarn dev
```

**Expected Output**:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 4.6 Verify Frontend

Open browser and navigate to:
- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register

## Step 5: Test the Application

### 5.1 Register a New User

1. Navigate to http://localhost:3000/register
2. Enter email: `test@example.com`
3. Enter password: `TestPass123`
4. Click "Register"
5. You should be redirected to the task dashboard

### 5.2 Create a Task

1. On the dashboard, enter task title: "Test Task"
2. (Optional) Enter description: "This is a test task"
3. Click "Create Task"
4. Task should appear in the list

### 5.3 Mark Task Complete

1. Click the checkbox next to the task
2. Task should show as complete (strikethrough or checkmark)

### 5.4 Edit Task

1. Click "Edit" button on the task
2. Update title or description
3. Click "Save"
4. Changes should be reflected

### 5.5 Delete Task

1. Click "Delete" button on the task
2. Confirm deletion
3. Task should be removed from the list

### 5.6 Logout and Login

1. Click "Logout" button
2. You should be redirected to login page
3. Login with same credentials
4. Your tasks should still be there

## Step 6: Run Tests (Optional)

### Backend Tests

```bash
cd backend
pytest
```

**Expected Output**:
```
============================= test session starts ==============================
collected 15 items

tests/test_auth.py ........                                              [ 53%]
tests/test_tasks.py .......                                              [100%]

============================== 15 passed in 2.34s ===============================
```

### Frontend Tests

```bash
cd frontend
npm test
# or
yarn test
```

## Troubleshooting

### Issue: Backend won't start - "ModuleNotFoundError"

**Solution**: Ensure virtual environment is activated and dependencies installed:
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Issue: Database connection error

**Solution**: Verify connection string in `.env`:
- Check username, password, host, database name
- Ensure `?sslmode=require` is appended
- Test connection in Neon Console

### Issue: Frontend can't connect to backend

**Solution**: Check CORS configuration:
- Verify `CORS_ORIGINS=http://localhost:3000` in backend `.env`
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL=http://localhost:8000` in frontend `.env.local`

### Issue: JWT token verification fails

**Solution**: Ensure secrets match:
- Backend `JWT_SECRET` must equal frontend `BETTER_AUTH_SECRET`
- Both must be minimum 32 characters
- Regenerate secret if needed

### Issue: Alembic migration fails

**Solution**: Check database connection and permissions:
```bash
# Test connection
python -c "from sqlmodel import create_engine; engine = create_engine('your-connection-string'); print('Connected!')"
```

### Issue: Port already in use

**Solution**: Kill process using the port:
```bash
# Find process on port 8000 (backend)
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| JWT_SECRET | Secret key for JWT signing (32+ chars) | `your-secret-key-min-32-chars` |
| CORS_ORIGINS | Allowed frontend origins (comma-separated) | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API base URL | `http://localhost:8000` |
| BETTER_AUTH_SECRET | JWT secret (must match backend) | `your-secret-key-min-32-chars` |
| DATABASE_URL | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |

## Development Workflow

### Daily Development

1. **Start Backend**:
```bash
cd backend
source venv/bin/activate
uvicorn src.main:app --reload --port 8000
```

2. **Start Frontend** (new terminal):
```bash
cd frontend
npm run dev
```

3. **Make Changes**: Edit code, changes auto-reload

4. **Test Changes**: Use browser and API docs

### Database Changes

1. **Modify Models**: Edit `backend/src/models/*.py`
2. **Generate Migration**: `alembic revision --autogenerate -m "Description"`
3. **Review Migration**: Check `alembic/versions/*.py`
4. **Apply Migration**: `alembic upgrade head`

### Adding New Endpoints

1. **Define Schema**: Add Pydantic models in `backend/src/schemas/`
2. **Implement Service**: Add business logic in `backend/src/services/`
3. **Create Route**: Add endpoint in `backend/src/api/`
4. **Update OpenAPI**: Regenerate docs at http://localhost:8000/docs
5. **Test Endpoint**: Use Swagger UI or curl

## Next Steps

After successful setup:

1. **Review API Documentation**: http://localhost:8000/docs
2. **Explore Codebase**: Understand project structure
3. **Run Tests**: Ensure all tests pass
4. **Read Specification**: Review `specs/001-todo-web-app/spec.md`
5. **Check Implementation Plan**: Review `specs/001-todo-web-app/plan.md`

## Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **SQLModel Documentation**: https://sqlmodel.tiangolo.com/
- **Neon Documentation**: https://neon.tech/docs
- **Better Auth Documentation**: https://better-auth.com/docs

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review error messages carefully
3. Consult API documentation
4. Check Neon Console for database issues

## Security Reminders

- ✅ Never commit `.env` or `.env.local` files to Git
- ✅ Use strong, unique JWT secrets (32+ characters)
- ✅ Keep dependencies updated
- ✅ Use HTTPS in production
- ✅ Rotate secrets regularly

## Deployment (Future)

This guide covers local development. For production deployment:
- Backend: Deploy to Render, Railway, or Fly.io
- Frontend: Deploy to Vercel or Netlify
- Database: Use Neon production branch
- Environment: Set production environment variables
- SSL: Enable HTTPS for all connections

---

**Congratulations!** You now have a fully functional Todo application running locally. Happy coding!
