# Frontend Quickstart Guide

**Feature**: Frontend Application & User Experience
**Branch**: `003-frontend-ux`
**Created**: 2026-01-09
**Purpose**: Step-by-step guide to set up and run the frontend application

---

## Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 18+** installed (`node --version`)
- ✅ **npm** installed (`npm --version`)
- ✅ **Backend API** running at `http://localhost:8000` (from Spec 2)
- ✅ **PostgreSQL database** initialized with users and tasks tables
- ✅ **Git** installed for version control

---

## Step 1: Initialize Next.js Project

**CRITICAL**: This step MUST be completed first. Do NOT manually create any directories.

### Navigate to Project Root

```bash
cd E:/Hackathon_II/Phase_II
```

### Run Official Next.js CLI

```bash
npx create-next-app@latest frontend --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*"
```

**CLI Prompts and Answers**:
- ✅ Would you like to use TypeScript? → **Yes**
- ✅ Would you like to use ESLint? → **Yes**
- ✅ Would you like to use Tailwind CSS? → **Yes**
- ✅ Would you like to use `src/` directory? → **No**
- ✅ Would you like to use App Router? → **Yes** (recommended)
- ✅ Would you like to customize the default import alias (@/*)? → **Yes**
- ✅ What import alias would you like configured? → **@/*** (default)

**Expected Output**:
```
Creating a new Next.js app in E:/Hackathon_II/Phase_II/frontend.

Using npm.

Initializing project with template: app-tw

Installing dependencies:
- react
- react-dom
- next
- typescript
- @types/react
- @types/node
- @types/react-dom
- tailwindcss
- postcss
- autoprefixer
- eslint
- eslint-config-next

Success! Created frontend at E:/Hackathon_II/Phase_II/frontend
```

### Verify Project Structure

```bash
cd frontend
ls -la
```

**Expected Structure**:
```
frontend/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Step 2: Install Dependencies

### Install Better Auth

```bash
npm install better-auth
```

**Expected Output**:
```
added 1 package, and audited X packages in Xs

found 0 vulnerabilities
```

### Verify Installation

```bash
npm list better-auth
```

**Expected Output**:
```
frontend@0.1.0 E:\Hackathon_II\Phase_II\frontend
└── better-auth@X.X.X
```

---

## Step 3: Configure Environment Variables

### Create Environment File

```bash
# Create .env.local file in frontend directory
touch .env.local
```

### Add Environment Variables

Edit `.env.local` and add:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Secret (must match backend JWT_SECRET)
BETTER_AUTH_SECRET=your-secret-key-here-change-in-production

# Database URL (for Better Auth session management)
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
```

**IMPORTANT**:
- Replace `your-secret-key-here-change-in-production` with the same secret used in backend
- Replace database credentials with your actual PostgreSQL credentials
- Never commit `.env.local` to version control (already in .gitignore)

### Verify Environment Variables

```bash
# Check that .env.local exists and is not tracked by git
git status
```

**Expected**: `.env.local` should NOT appear in git status (ignored by .gitignore)

---

## Step 4: Configure Better Auth

### Create Auth Configuration File

```bash
mkdir -p lib
touch lib/auth.ts
```

### Add Better Auth Configuration

Edit `lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  database: {
    type: "postgres",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  jwt: {
    expiresIn: "7d",
    algorithm: "HS256",
  },
});
```

**Configuration Explanation**:
- `secret`: Shared secret for JWT signing (must match backend)
- `database`: PostgreSQL connection for session management
- `emailAndPassword`: Enable email/password authentication
- `jwt`: 7-day token expiration with HS256 algorithm

---

## Step 5: Create API Client

### Create API Client File

```bash
touch lib/api-client.ts
```

### Add API Client Implementation

Copy the API client implementation from `contracts/api-client-interface.md` into `lib/api-client.ts`.

**Key Features**:
- Automatic JWT token extraction from cookies
- Automatic Authorization header attachment
- Centralized error handling
- Type-safe methods for auth and tasks

---

## Step 6: Create Type Definitions

### Create Types File

```bash
touch lib/types.ts
```

### Add Type Definitions

Copy all TypeScript interfaces from `data-model.md` into `lib/types.ts`.

**Key Types**:
- `User`, `Task`
- `AuthResponse`, `TaskResponse`
- Form input and error types
- Validation functions

---

## Step 7: Create Middleware for Route Protection

### Create Middleware File

```bash
touch middleware.ts
```

### Add Middleware Implementation

Edit `middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('better-auth.session_token');
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  const isProtectedPage = pathname.startsWith('/tasks');
  const isLandingPage = pathname === '/';

  // Redirect unauthenticated users to signin
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  // Landing page redirects based on auth status
  if (isLandingPage) {
    if (token) {
      return NextResponse.redirect(new URL('/tasks', request.url));
    } else {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## Step 8: Implement Authentication UI

### Create Route Groups

```bash
mkdir -p app/\(auth\)/signin
mkdir -p app/\(auth\)/signup
```

**Note**: Use parentheses for route groups (they don't appear in URLs)

### Create Auth Layout

```bash
touch app/\(auth\)/layout.tsx
```

Edit `app/(auth)/layout.tsx`:

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
```

### Create Signin Page

```bash
touch app/\(auth\)/signin/page.tsx
```

### Create Signup Page

```bash
touch app/\(auth\)/signup/page.tsx
```

### Create Auth Components

```bash
mkdir -p components/auth
touch components/auth/SigninForm.tsx
touch components/auth/SignupForm.tsx
touch components/auth/LogoutButton.tsx
```

**Implementation**: Follow patterns from `contracts/component-hierarchy.md`

---

## Step 9: Implement Task Management UI

### Create Dashboard Route Group

```bash
mkdir -p app/\(dashboard\)/tasks
```

### Create Dashboard Layout

```bash
touch app/\(dashboard\)/layout.tsx
```

Edit `app/(dashboard)/layout.tsx`:

```typescript
import { LogoutButton } from '@/components/auth/LogoutButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

### Create Tasks Page

```bash
touch app/\(dashboard\)/tasks/page.tsx
```

### Create Task Components

```bash
mkdir -p components/tasks
touch components/tasks/TaskList.tsx
touch components/tasks/TaskItem.tsx
touch components/tasks/TaskForm.tsx
touch components/tasks/CreateTaskButton.tsx
```

### Create UI Components

```bash
mkdir -p components/ui
touch components/ui/Button.tsx
touch components/ui/Input.tsx
touch components/ui/Textarea.tsx
touch components/ui/ErrorMessage.tsx
touch components/ui/LoadingSpinner.tsx
touch components/ui/EmptyState.tsx
touch components/ui/Modal.tsx
```

**Implementation**: Follow patterns from `contracts/component-hierarchy.md`

---

## Step 10: Run Development Server

### Start Backend API (Terminal 1)

```bash
cd E:/Hackathon_II/Phase_II/backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
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

### Start Frontend (Terminal 2)

```bash
cd E:/Hackathon_II/Phase_II/frontend
npm run dev
```

**Expected Output**:
```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.5s
```

### Open Browser

Visit: `http://localhost:3000`

**Expected Behavior**:
- Redirects to `/signin` (not authenticated)
- Shows signin form

---

## Step 11: Verification Steps

### Test Authentication Flow

1. **Sign Up**:
   - Navigate to `/signup`
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Click "Sign Up"
   - ✅ Should redirect to `/tasks`

2. **Sign Out**:
   - Click "Logout" button in header
   - ✅ Should redirect to `/signin`
   - ✅ Cannot access `/tasks` without signing in

3. **Sign In**:
   - Navigate to `/signin`
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Click "Sign In"
   - ✅ Should redirect to `/tasks`

### Test Task Management

1. **Create Task**:
   - Click "Create Task" button
   - Enter title: "My First Task"
   - Enter description: "This is a test task"
   - Click "Create"
   - ✅ Task appears in list

2. **Edit Task**:
   - Click "Edit" on task
   - Change title to "Updated Task"
   - Click "Save"
   - ✅ Task title updates

3. **Toggle Complete**:
   - Click checkbox on task
   - ✅ Task shows as complete (strikethrough or visual indicator)

4. **Delete Task**:
   - Click "Delete" on task
   - Confirm deletion
   - ✅ Task removed from list

### Test Responsive Design

1. **Mobile (320px)**:
   - Open Chrome DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M)
   - Select "iPhone SE" or set width to 320px
   - ✅ Layout adapts to mobile
   - ✅ All buttons are touch-friendly (min 44x44px)
   - ✅ No horizontal scrolling

2. **Tablet (768px)**:
   - Set width to 768px
   - ✅ Layout uses available space efficiently

3. **Desktop (1920px)**:
   - Set width to 1920px
   - ✅ Layout takes advantage of larger screen

### Test Error Handling

1. **Invalid Credentials**:
   - Try signing in with wrong password
   - ✅ Shows error message "Invalid email or password"

2. **Network Error**:
   - Stop backend server
   - Try creating a task
   - ✅ Shows error message "Connection lost"

3. **Token Expiration**:
   - Wait 7 days (or manually expire token)
   - Try accessing `/tasks`
   - ✅ Redirects to `/signin` with message "Session expired"

---

## Step 12: Troubleshooting

### Issue: "Module not found: Can't resolve 'better-auth'"

**Solution**:
```bash
npm install better-auth
npm run dev
```

### Issue: "Error: ECONNREFUSED" when calling API

**Solution**:
- Verify backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend CORS allows `http://localhost:3000`

### Issue: "Unauthorized" on all API requests

**Solution**:
- Verify `BETTER_AUTH_SECRET` matches backend `JWT_SECRET`
- Check that JWT token is being stored in cookies
- Verify middleware is not blocking requests

### Issue: Redirects not working

**Solution**:
- Verify `middleware.ts` is in root directory (not in `app/`)
- Check middleware matcher configuration
- Clear browser cookies and try again

### Issue: TypeScript errors

**Solution**:
```bash
npm run build
```
- Fix any type errors shown
- Ensure all types are imported from `@/lib/types`

---

## Step 13: Production Build

### Build for Production

```bash
npm run build
```

**Expected Output**:
```
   ▲ Next.js 14.x.x

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (X/X)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    X kB          XX kB
├ ○ /(auth)/signin                       X kB          XX kB
├ ○ /(auth)/signup                       X kB          XX kB
└ ○ /(dashboard)/tasks                   X kB          XX kB

○  (Static)  automatically rendered as static HTML
```

### Start Production Server

```bash
npm start
```

**Expected Output**:
```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000

 ✓ Ready in 1.2s
```

---

## Step 14: Deployment Checklist

Before deploying to production:

- [ ] Set `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Set `BETTER_AUTH_SECRET` to strong random value
- [ ] Set `DATABASE_URL` to production PostgreSQL URL
- [ ] Enable HTTPS for all requests
- [ ] Configure CORS on backend for production frontend domain
- [ ] Set up environment variables in hosting platform
- [ ] Test all functionality in production environment
- [ ] Verify responsive design on real devices
- [ ] Test error handling with production backend

---

## Quick Reference

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Directory Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── signin/
│   │   └── signup/
│   ├── (dashboard)/       # Dashboard route group
│   │   └── tasks/
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── tasks/            # Task components
│   └── ui/               # UI components
├── lib/                   # Utilities
│   ├── auth.ts           # Better Auth config
│   ├── api-client.ts     # API client
│   └── types.ts          # TypeScript types
├── middleware.ts          # Route protection
└── .env.local            # Environment variables
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### API Endpoints

**Authentication**:
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out

**Tasks**:
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get task
- `PATCH /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

---

## Next Steps

After completing this quickstart:

1. **Review Implementation**: Verify all components match design contracts
2. **Test Thoroughly**: Run through all verification steps
3. **Document Issues**: Record any bugs or unexpected behavior
4. **Optimize Performance**: Check page load times and bundle sizes
5. **Prepare for Demo**: Create test data and practice user flows

---

**Quickstart Guide Status**: ✅ COMPLETE - Ready for implementation

**Estimated Setup Time**: 30-45 minutes (excluding implementation)
