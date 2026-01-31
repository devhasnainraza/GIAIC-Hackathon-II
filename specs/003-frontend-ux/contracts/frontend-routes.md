# Frontend Routes Contract

**Feature**: Frontend Application & User Experience
**Branch**: `003-frontend-ux`
**Created**: 2026-01-09
**Purpose**: Define all frontend routes and their authentication requirements

---

## Route Structure

### Public Routes (No Authentication Required)

#### `/` - Landing Page
- **Purpose**: Entry point for the application
- **Behavior**:
  - If user is authenticated → Redirect to `/tasks`
  - If user is not authenticated → Redirect to `/signin`
- **Component**: `app/page.tsx`
- **Layout**: Root layout only

#### `/signin` - Sign In Page
- **Purpose**: Authenticate existing users
- **Behavior**:
  - If user is authenticated → Redirect to `/tasks`
  - If user is not authenticated → Show signin form
- **Component**: `app/(auth)/signin/page.tsx`
- **Layout**: Auth layout (centered form, no header)
- **Form Fields**: Email, Password
- **Actions**: Submit → Call `/api/auth/login` → Redirect to `/tasks`

#### `/signup` - Sign Up Page
- **Purpose**: Register new users
- **Behavior**:
  - If user is authenticated → Redirect to `/tasks`
  - If user is not authenticated → Show signup form
- **Component**: `app/(auth)/signup/page.tsx`
- **Layout**: Auth layout (centered form, no header)
- **Form Fields**: Email, Password
- **Actions**: Submit → Call `/api/auth/register` → Redirect to `/tasks`

---

### Protected Routes (Authentication Required)

#### `/tasks` - Task List & Management Dashboard
- **Purpose**: Display and manage user's tasks
- **Behavior**:
  - If user is not authenticated → Redirect to `/signin`
  - If user is authenticated → Show task list with CRUD operations
- **Component**: `app/(dashboard)/tasks/page.tsx`
- **Layout**: Dashboard layout (header with logout button)
- **Data Fetching**: Fetch tasks from `GET /api/tasks` on page load
- **Actions**:
  - Create task → Modal/inline form → `POST /api/tasks`
  - Edit task → Modal/inline form → `PATCH /api/tasks/{id}`
  - Delete task → Confirmation → `DELETE /api/tasks/{id}`
  - Toggle complete → Checkbox → `PATCH /api/tasks/{id}`

---

## API Routes (Better Auth)

These routes are automatically created by Better Auth and should not be manually implemented.

#### `POST /api/auth/register`
- **Purpose**: Register new user
- **Request**: `{ email: string, password: string }`
- **Response**: `{ user: User, token: string }`
- **Errors**: 400 (validation), 409 (duplicate email)

#### `POST /api/auth/login`
- **Purpose**: Authenticate existing user
- **Request**: `{ email: string, password: string }`
- **Response**: `{ user: User, token: string }`
- **Errors**: 401 (invalid credentials)

#### `POST /api/auth/logout`
- **Purpose**: Sign out current user
- **Request**: None
- **Response**: `{ message: string }`
- **Behavior**: Clears session cookie

---

## Route Protection Strategy

### Middleware-Based Protection

**File**: `middleware.ts` (root level)

**Logic**:
```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('better-auth.session_token');
  const { pathname } = request.nextUrl;

  // Define route types
  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  const isProtectedPage = pathname.startsWith('/tasks');
  const isLandingPage = pathname === '/';

  // Redirect logic
  if (isProtectedPage && !token) {
    // Unauthenticated user trying to access protected route
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (isAuthPage && token) {
    // Authenticated user trying to access auth pages
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  if (isLandingPage) {
    // Landing page redirects based on auth status
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

**Matcher**: Applies to all routes except:
- `/api/*` - API routes
- `/_next/static/*` - Static assets
- `/_next/image/*` - Image optimization
- `/favicon.ico` - Favicon

---

## Route Groups

### `(auth)` Route Group
- **Purpose**: Group authentication-related pages
- **Layout**: `app/(auth)/layout.tsx`
- **Routes**: `/signin`, `/signup`
- **Shared UI**: Centered form container, no header/footer

### `(dashboard)` Route Group
- **Purpose**: Group protected application pages
- **Layout**: `app/(dashboard)/layout.tsx`
- **Routes**: `/tasks`
- **Shared UI**: Header with logout button, navigation

---

## Navigation Flow

### New User Journey
```
1. Visit / → Redirect to /signin
2. Click "Sign up" link → Navigate to /signup
3. Submit signup form → POST /api/auth/register
4. Success → Redirect to /tasks
5. View task list (empty state)
6. Create first task
```

### Returning User Journey
```
1. Visit / → Redirect to /signin
2. Submit signin form → POST /api/auth/login
3. Success → Redirect to /tasks
4. View task list with existing tasks
5. Manage tasks (CRUD operations)
```

### Logout Journey
```
1. On /tasks page
2. Click "Logout" button → POST /api/auth/logout
3. Success → Redirect to /signin
4. Session cleared, cannot access /tasks
```

---

## Error Handling

### 401 Unauthorized
- **Trigger**: JWT token expired or invalid
- **Behavior**: Redirect to `/signin` with message "Your session has expired. Please sign in again."
- **Implementation**: API client intercepts 401 responses

### 403 Forbidden
- **Trigger**: User attempts to access resource they don't own
- **Behavior**: Show error message "Access denied"
- **Implementation**: Display error in UI, don't redirect

### 404 Not Found
- **Trigger**: Route doesn't exist or resource not found
- **Behavior**: Show 404 page with link to `/tasks`
- **Implementation**: Next.js `not-found.tsx` file

### Network Error
- **Trigger**: Backend API unavailable or network disconnected
- **Behavior**: Show error message "Connection lost. Please check your internet connection."
- **Implementation**: API client catches network errors

---

## URL Structure

### Clean URLs (No Unnecessary Segments)
- ✅ `/signin` (not `/auth/signin`)
- ✅ `/signup` (not `/auth/signup`)
- ✅ `/tasks` (not `/dashboard/tasks`)

**Rationale**: Route groups use parentheses `(auth)` and `(dashboard)` which don't appear in URLs, keeping URLs clean and user-friendly.

---

## Metadata & SEO

### Page Titles
- `/signin` → "Sign In | Todo App"
- `/signup` → "Sign Up | Todo App"
- `/tasks` → "My Tasks | Todo App"

### Meta Descriptions
- `/signin` → "Sign in to your Todo account"
- `/signup` → "Create a new Todo account"
- `/tasks` → "Manage your tasks"

**Implementation**: Define metadata in each `page.tsx`:
```typescript
export const metadata = {
  title: 'Sign In | Todo App',
  description: 'Sign in to your Todo account',
};
```

---

## Loading & Error States

### Loading States
- **File**: `loading.tsx` in each route directory
- **Behavior**: Shown during navigation and data fetching
- **UI**: Loading spinner with message

### Error Boundaries
- **File**: `error.tsx` in each route directory
- **Behavior**: Catches errors during rendering
- **UI**: Error message with retry button

---

## Route Testing Checklist

- [ ] Unauthenticated user cannot access `/tasks`
- [ ] Authenticated user cannot access `/signin` or `/signup`
- [ ] Landing page `/` redirects correctly based on auth status
- [ ] Logout clears session and redirects to `/signin`
- [ ] 401 errors redirect to `/signin`
- [ ] All routes have proper metadata
- [ ] All routes have loading and error states
- [ ] Navigation between routes works smoothly
- [ ] Back button works correctly after redirects

---

**Route Contract Status**: ✅ COMPLETE - All routes defined with protection strategy
