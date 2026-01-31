# Research: Todo Full-Stack Web Application

**Date**: 2026-01-09
**Feature**: 001-todo-web-app
**Purpose**: Resolve technical unknowns and document integration patterns

## Overview

This document captures research findings for integrating Next.js 16+ (Better Auth), FastAPI, SQLModel, and Neon PostgreSQL in a secure, multi-user todo application with JWT-based authentication and user isolation.

## R1: Better Auth + JWT Integration Pattern

### Decision: Shared JWT Secret Between Frontend and Backend

**How It Works**:
1. Better Auth (frontend) issues JWT tokens upon successful login
2. JWT contains user claims (user_id, email, exp, iat)
3. Frontend includes token in `Authorization: Bearer <token>` header
4. FastAPI backend verifies token signature using same secret
5. Backend extracts user_id from verified token claims

### Configuration

**Frontend (Better Auth)**:
```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!, // Shared secret
  jwt: {
    expiresIn: "7d", // Token expiration
    algorithm: "HS256" // HMAC SHA-256
  },
  database: {
    // Better Auth can use its own DB or share with backend
    type: "postgres",
    url: process.env.DATABASE_URL
  }
});
```

**Backend (FastAPI)**:
```python
# src/services/auth.py
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv("JWT_SECRET")  # Same as BETTER_AUTH_SECRET
ALGORITHM = "HS256"

def verify_token(token: str) -> dict:
    """Verify JWT token and return claims"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")  # User ID in 'sub' claim
        if user_id is None:
            raise JWTError("Invalid token")
        return {"user_id": user_id, "email": payload.get("email")}
    except JWTError:
        raise ValueError("Invalid or expired token")
```

### Environment Variables

```bash
# .env (shared between frontend and backend)
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
JWT_SECRET=your-secret-key-min-32-chars  # Must match BETTER_AUTH_SECRET
```

**Rationale**: Using the same secret allows FastAPI to verify tokens issued by Better Auth without additional API calls. HS256 algorithm is sufficient for this use case and widely supported.

**Alternatives Considered**:
- RS256 (asymmetric): More complex, requires public/private key pair, overkill for this scale
- Custom JWT issuance: Duplicates Better Auth functionality, increases complexity

## R2: Neon PostgreSQL Connection Pattern

### Decision: SQLModel with Neon Connection String

**Connection String Format**:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**SQLModel Engine Configuration**:
```python
# src/database.py
from sqlmodel import create_engine, Session, SQLModel
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# Neon requires SSL
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Log SQL queries in development
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,  # Connection pool size
    max_overflow=10  # Max connections beyond pool_size
)

def get_session():
    """Dependency for FastAPI routes"""
    with Session(engine) as session:
        yield session

def init_db():
    """Create all tables"""
    SQLModel.metadata.create_all(engine)
```

### Alembic Migration Setup

```python
# alembic/env.py
from sqlmodel import SQLModel
from src.models.user import User
from src.models.task import Task

target_metadata = SQLModel.metadata

# Use DATABASE_URL from environment
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))
```

**Migration Commands**:
```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Create users and tasks tables"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Neon-Specific Considerations

- **SSL Required**: Neon enforces SSL connections (`sslmode=require`)
- **Connection Pooling**: Neon supports connection pooling, configure pool_size appropriately
- **Serverless**: Neon scales to zero, first connection may be slower (cold start)
- **Branching**: Neon supports database branches for testing (optional feature)

**Rationale**: SQLModel provides type-safe ORM with Pydantic integration. Neon's serverless PostgreSQL eliminates database management overhead while providing production-grade reliability.

**Alternatives Considered**:
- Local PostgreSQL: Requires manual setup, not serverless
- SQLAlchemy directly: More verbose, SQLModel provides better DX with FastAPI
- Prisma: Not Python-native, adds Node.js dependency

## R3: Next.js App Router + Better Auth Setup

### Decision: Better Auth with App Router Route Handlers

**Installation**:
```bash
npm install better-auth
```

**Configuration**:
```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  database: {
    type: "postgres",
    url: process.env.DATABASE_URL!
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false  // Per spec assumptions
  }
});

export type Session = typeof auth.$Infer.Session;
```

**API Route Handlers**:
```typescript
// src/app/api/auth/[...auth]/route.ts
import { auth } from "@/lib/auth";

export const { GET, POST } = auth.handler;
```

**Client-Side Hook**:
```typescript
// src/hooks/useAuth.ts
"use client";
import { useSession } from "better-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    token: session?.token  // JWT token for API calls
  };
}
```

**Protected Route Pattern**:
```typescript
// src/app/(dashboard)/tasks/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function TasksPage() {
  const session = await auth.api.getSession();

  if (!session) {
    redirect("/login");
  }

  return <TaskDashboard user={session.user} />;
}
```

**Middleware for Route Protection**:
```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("better-auth.session_token");

  if (!token && request.nextUrl.pathname.startsWith("/tasks")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*"]
};
```

**Rationale**: Better Auth provides built-in JWT support, session management, and integrates seamlessly with Next.js App Router. Route handlers simplify authentication endpoints.

**Alternatives Considered**:
- NextAuth.js: More complex setup, not as modern as Better Auth
- Custom auth: Reinventing the wheel, security risks
- Clerk/Auth0: Third-party services, adds external dependency

## R4: FastAPI JWT Middleware Pattern

### Decision: Dependency Injection for User Authentication

**JWT Verification Middleware**:
```python
# src/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from src.database import get_session
from src.services.auth import verify_token
from src.models.user import User

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """
    Verify JWT token and return current user.
    Raises 401 if token invalid or user not found.
    """
    token = credentials.credentials

    try:
        payload = verify_token(token)
        user_id = payload["user_id"]
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user
```

**Usage in Endpoints**:
```python
# src/api/tasks.py
from fastapi import APIRouter, Depends
from src.api.deps import get_current_user
from src.models.user import User

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("/")
async def list_tasks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """List all tasks for authenticated user"""
    tasks = session.query(Task).filter(Task.user_id == current_user.id).all()
    return {"tasks": tasks}
```

**Error Handling**:
```python
# src/main.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )
```

**CORS Configuration**:
```python
# src/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

**Rationale**: Dependency injection pattern is idiomatic FastAPI. `get_current_user` dependency automatically verifies JWT and provides user object to endpoints, enforcing authentication consistently.

**Alternatives Considered**:
- Global middleware: Less flexible, harder to exclude specific routes
- Manual token verification in each endpoint: Code duplication, error-prone
- Decorator pattern: Not idiomatic for FastAPI

## R5: SQLModel User Isolation Pattern

### Decision: Service Layer with Automatic User Filtering

**Models with Relationships**:
```python
# src/models/user.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    tasks: List["Task"] = Relationship(back_populates="owner")

# src/models/task.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_complete: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    owner: User = Relationship(back_populates="tasks")
```

**Service Layer with User Filtering**:
```python
# src/services/task_service.py
from sqlmodel import Session, select
from src.models.task import Task
from src.models.user import User
from typing import List, Optional

class TaskService:
    def __init__(self, session: Session, user: User):
        self.session = session
        self.user = user

    def list_tasks(self) -> List[Task]:
        """List all tasks for current user"""
        statement = select(Task).where(Task.user_id == self.user.id)
        return self.session.exec(statement).all()

    def get_task(self, task_id: int) -> Optional[Task]:
        """Get task by ID, only if owned by current user"""
        statement = select(Task).where(
            Task.id == task_id,
            Task.user_id == self.user.id  # User isolation
        )
        return self.session.exec(statement).first()

    def create_task(self, title: str, description: Optional[str] = None) -> Task:
        """Create new task for current user"""
        task = Task(
            user_id=self.user.id,  # Automatically set user_id
            title=title,
            description=description
        )
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def update_task(self, task_id: int, title: str, description: Optional[str]) -> Optional[Task]:
        """Update task, only if owned by current user"""
        task = self.get_task(task_id)  # Uses user isolation
        if not task:
            return None

        task.title = title
        task.description = description
        task.updated_at = datetime.utcnow()
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete_task(self, task_id: int) -> bool:
        """Delete task, only if owned by current user"""
        task = self.get_task(task_id)  # Uses user isolation
        if not task:
            return False

        self.session.delete(task)
        self.session.commit()
        return True

    def toggle_complete(self, task_id: int) -> Optional[Task]:
        """Toggle task completion status"""
        task = self.get_task(task_id)
        if not task:
            return None

        task.is_complete = not task.is_complete
        task.updated_at = datetime.utcnow()
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task
```

**Usage in Endpoints**:
```python
# src/api/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status
from src.services.task_service import TaskService
from src.api.deps import get_current_user

@router.post("/")
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    service = TaskService(session, current_user)
    task = service.create_task(task_data.title, task_data.description)
    return task

@router.get("/{task_id}")
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    service = TaskService(session, current_user)
    task = service.get_task(task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task
```

**Rationale**: Service layer pattern encapsulates user isolation logic. Every query automatically filters by user_id, preventing accidental data leakage. Service constructor requires User object, making isolation explicit.

**Alternatives Considered**:
- Repository pattern: More abstraction, overkill for this scale
- Direct queries in endpoints: Code duplication, easy to forget user_id filter
- Global query filter: SQLModel doesn't support this natively, would require custom implementation

## Development Environment Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+
- Neon PostgreSQL account
- Git

### Environment Variables

**Backend (.env)**:
```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your-secret-key-min-32-chars
CORS_ORIGINS=http://localhost:3000
```

**Frontend (.env.local)**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Local Development Workflow

1. **Start Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn src.main:app --reload --port 8000
```

2. **Start Frontend**:
```bash
cd frontend
npm install
npm run dev
```

3. **Access Application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Deployment Considerations

### Backend Deployment (Render/Railway/Fly.io)
- Set environment variables (DATABASE_URL, JWT_SECRET)
- Run migrations: `alembic upgrade head`
- Start with: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (Vercel/Netlify)
- Set environment variables (NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET, DATABASE_URL)
- Build command: `npm run build`
- Output directory: `.next`

### Database (Neon)
- Production branch for live data
- Development branch for testing
- Automatic backups enabled
- Connection pooling configured

## Security Checklist

- ✅ JWT secret minimum 32 characters
- ✅ Passwords hashed with bcrypt (cost factor 12)
- ✅ HTTPS enforced in production
- ✅ CORS restricted to frontend origin
- ✅ SQL injection prevented (parameterized queries via SQLModel)
- ✅ User isolation enforced in service layer
- ✅ Token expiration configured (7 days)
- ✅ Environment variables for all secrets
- ✅ Database SSL required

## Performance Optimization

- Connection pooling (pool_size=5, max_overflow=10)
- Database indexes on user_id and email
- JWT verification cached (stateless)
- Frontend code splitting (Next.js automatic)
- API response caching (if needed, add Redis)

## Testing Strategy

### Backend Tests
- Unit tests: Service layer logic
- Integration tests: API endpoints with test database
- Security tests: User isolation, unauthorized access attempts

### Frontend Tests
- Component tests: React Testing Library
- Integration tests: User flows (login, create task, etc.)
- E2E tests: Playwright (optional)

## Conclusion

All technical unknowns resolved. Integration patterns documented with code examples. Ready to proceed to Phase 1 (data model, API contracts, quickstart guide).
