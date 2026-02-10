# Research & Technical Decisions: Frontend Application & User Experience

**Feature**: Frontend Application & User Experience
**Branch**: `003-frontend-ux`
**Created**: 2026-01-09
**Purpose**: Resolve all technical unknowns before implementation

---

## R1: Next.js 16+ App Router Patterns

### Decision

Use **Route Groups** with the following structure:
- `(auth)` route group for public authentication pages (signin, signup)
- `(dashboard)` route group for protected pages (tasks)
- Shared layouts at each route group level
- Middleware for route protection at the root level

### Rationale

**Route Groups** (directories with parentheses) allow us to:
1. Organize routes logically without affecting the URL structure
2. Apply different layouts to different route groups (auth layout vs. dashboard layout)
3. Keep authentication pages separate from protected pages
4. Share common UI elements within each group

**Example Structure**:
```
app/
├── layout.tsx                 # Root layout (global styles, fonts)
├── page.tsx                   # Landing page (redirects based on auth status)
├── (auth)/
│   ├── layout.tsx            # Auth layout (centered form, no header)
│   ├── signin/
│   │   └── page.tsx          # /signin
│   └── signup/
│       └── page.tsx          # /signup
└── (dashboard)/
    ├── layout.tsx            # Dashboard layout (header with logout)
    └── tasks/
        └── page.tsx          # /tasks
```

### Alternatives Considered

**Alternative 1: Flat structure without route groups**
- Rejected: Harder to apply different layouts, less organized

**Alternative 2: Nested routes (auth/signin, dashboard/tasks)**
- Rejected: Adds unnecessary URL segments (/auth/signin instead of /signin)

**Alternative 3: Pages Router (legacy)**
- Rejected: Spec requires App Router, Pages Router is legacy

### Implementation Notes

- Use `middleware.ts` at root level to check authentication before rendering protected routes
- Use `loading.tsx` files for loading states during navigation
- Use `error.tsx` files for error boundaries
- Metadata can be defined in each `page.tsx` for SEO

---

## R2: Better Auth Integration with Next.js

### Decision

Use **Better Auth** with the following configuration:
- JWT plugin with 7-day expiration and HS256 algorithm
- Store tokens in **httpOnly cookies** (not localStorage)
- Database connection to PostgreSQL for session management
- API routes at `/api/auth/*` for authentication endpoints

### Rationale

**httpOnly Cookies** are the most secure option because:
1. JavaScript cannot access them (XSS protection)
2. Automatically sent with requests (no manual attachment needed)
3. Can be configured with Secure and SameSite flags
4. Better Auth supports this pattern natively

**Configuration**:
```typescript
// lib/auth.ts
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

**Middleware for Route Protection**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('better-auth.session_token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/signin') ||
                     request.nextUrl.pathname.startsWith('/signup');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/tasks');

  // Redirect unauthenticated users to signin
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Alternatives Considered

**Alternative 1: localStorage for token storage**
- Rejected: Vulnerable to XSS attacks, not recommended for sensitive tokens

**Alternative 2: NextAuth.js**
- Rejected: Spec requires Better Auth specifically

**Alternative 3: Custom JWT implementation**
- Rejected: Better Auth provides battle-tested implementation

### Implementation Notes

- Better Auth automatically creates API routes at `/api/auth/*`
- Token is automatically included in requests to same domain
- For cross-origin requests to backend API, we need to extract token and add to Authorization header manually

---

## R3: API Client Architecture

### Decision

Create a **centralized API client** using native Fetch API with:
- Automatic JWT token extraction from cookies
- Automatic Authorization header attachment
- Centralized error handling with user-friendly messages
- TypeScript interfaces for type safety
- Retry logic for network errors

### Rationale

**Centralized API Client** provides:
1. Single source of truth for API communication
2. Consistent error handling across all requests
3. Type safety for requests and responses
4. Easy to test and mock
5. Automatic token management

**Implementation Pattern**:
```typescript
// lib/api-client.ts
import { cookies } from 'next/headers';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async getToken(): Promise<string | null> {
    // Extract token from httpOnly cookie
    const cookieStore = cookies();
    const token = cookieStore.get('better-auth.session_token');
    return token?.value || null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid - redirect to signin
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Authentication methods
  auth = {
    signup: (email: string, password: string) =>
      this.request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    signin: (email: string, password: string) =>
      this.request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    logout: () =>
      this.request<void>('/api/auth/logout', { method: 'POST' }),
  };

  // Task methods
  tasks = {
    list: () => this.request<Task[]>('/api/tasks'),

    get: (id: number) => this.request<Task>(`/api/tasks/${id}`),

    create: (data: TaskCreateInput) =>
      this.request<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: TaskUpdateInput) =>
      this.request<Task>(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: number) =>
      this.request<void>(`/api/tasks/${id}`, { method: 'DELETE' }),
  };
}

export const apiClient = new ApiClient();
```

### Alternatives Considered

**Alternative 1: Axios library**
- Rejected: Adds unnecessary dependency, Fetch API is sufficient

**Alternative 2: SWR or React Query**
- Rejected: Adds complexity, we want backend as single source of truth (no caching)

**Alternative 3: Next.js Server Actions**
- Rejected: Requires server components, adds complexity for simple CRUD operations

### Implementation Notes

- Use TypeScript interfaces for all request/response types
- Handle 401 errors by redirecting to signin
- Handle 500 errors with user-friendly messages
- Handle network errors with retry logic
- Never log tokens or sensitive data

---

## R4: Form Handling and Validation

### Decision

Use **native React state** with **client-side validation** before API submission:
- React useState for form state
- Custom validation functions for each field
- Display inline error messages
- Disable submit button during API request
- Show loading state during submission

### Rationale

**Native React State** is sufficient because:
1. Forms are simple (2-3 fields max)
2. No complex validation rules
3. Reduces dependencies
4. Easy to understand and maintain
5. Backend provides authoritative validation

**Implementation Pattern**:
```typescript
// components/auth/SignupForm.tsx
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await apiClient.auth.signup(email, password);
      // Redirect handled by Better Auth
    } catch (error) {
      setErrors({ email: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing up...' : 'Sign up'}
      </button>
    </form>
  );
}
```

### Alternatives Considered

**Alternative 1: React Hook Form**
- Rejected: Overkill for simple forms, adds dependency

**Alternative 2: Formik**
- Rejected: Adds unnecessary complexity and bundle size

**Alternative 3: Server Actions with useFormState**
- Rejected: Requires server components, adds complexity

### Implementation Notes

- Validate on submit, not on every keystroke (better UX)
- Show field-specific errors inline
- Disable form during submission to prevent duplicates
- Clear errors when user starts typing again
- Backend validation is authoritative (client-side is UX only)

---

## R5: Responsive Design with Tailwind CSS

### Decision

Use **mobile-first responsive design** with Tailwind CSS breakpoints:
- Default styles for mobile (320px-767px)
- `md:` prefix for tablet (768px-1023px)
- `lg:` prefix for desktop (1024px+)
- Touch-friendly tap targets (min 44x44px)
- Responsive typography and spacing

### Rationale

**Mobile-First Approach** because:
1. Ensures mobile experience is prioritized
2. Progressive enhancement for larger screens
3. Smaller CSS bundle (mobile styles are default)
4. Tailwind CSS is designed for mobile-first
5. Most users access web apps on mobile devices

**Breakpoint Strategy**:
```typescript
// Tailwind default breakpoints (mobile-first)
// sm: 640px   - Small tablets
// md: 768px   - Tablets
// lg: 1024px  - Desktops
// xl: 1280px  - Large desktops
// 2xl: 1536px - Extra large desktops

// Example usage:
<div className="
  p-4 md:p-6 lg:p-8           // Padding increases with screen size
  text-sm md:text-base lg:text-lg  // Font size increases
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  // Columns increase
">
```

**Touch-Friendly Controls**:
```typescript
// Minimum tap target size: 44x44px (iOS Human Interface Guidelines)
<button className="
  min-h-[44px] min-w-[44px]   // Minimum touch target
  px-4 py-2                    // Comfortable padding
  text-base                    // Readable text size
  active:scale-95              // Visual feedback on tap
">
```

### Alternatives Considered

**Alternative 1: Desktop-first approach**
- Rejected: Requires more media queries, larger CSS bundle

**Alternative 2: CSS Modules or styled-components**
- Rejected: Spec requires Tailwind CSS

**Alternative 3: Fixed breakpoints with px values**
- Rejected: Tailwind's default breakpoints are industry-standard

### Implementation Notes

- Test on real devices (iPhone SE 320px, iPad 768px, Desktop 1920px)
- Use Tailwind's responsive utilities (hidden, flex, grid)
- Ensure no horizontal scrolling on any screen size
- Use relative units (rem, %) for scalability
- Consider touch vs. mouse interactions (hover states)

---

## R6: State Management Strategy

### Decision

Use **minimal client state** with the following approach:
- React useState for local component state (forms, UI toggles)
- No global state management library (Redux, Zustand)
- Fetch data from backend on every page load (no caching)
- Use React Server Components where possible for data fetching
- Client Components only when interactivity is needed

### Rationale

**Minimal State Management** because:
1. Application scope is small (task list, auth forms)
2. Backend is single source of truth (no client-side caching)
3. Reduces complexity and dependencies
4. Easier to reason about data flow
5. Constitution requires backend as authoritative source

**State Categories**:

**Server State** (fetched from backend):
- User authentication status
- Task list
- Individual task details
- Fetched on every page load, not cached

**Client State** (local to components):
- Form input values
- Loading states
- Error messages
- UI toggles (modals, dropdowns)

**No Global State** needed because:
- Authentication status checked via middleware (cookie)
- Task data fetched per page (no cross-page sharing)
- No complex state synchronization required

**Implementation Pattern**:
```typescript
// Server Component (default in App Router)
// app/(dashboard)/tasks/page.tsx
import { apiClient } from '@/lib/api-client';

export default async function TasksPage() {
  // Fetch data on server
  const tasks = await apiClient.tasks.list();

  return <TaskList initialTasks={tasks} />;
}

// Client Component (for interactivity)
// components/tasks/TaskList.tsx
'use client';

import { useState } from 'react';

export function TaskList({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data) => {
    setIsLoading(true);
    const newTask = await apiClient.tasks.create(data);
    setTasks([...tasks, newTask]);
    setIsLoading(false);
  };

  // ... other handlers
}
```

### Alternatives Considered

**Alternative 1: Redux or Zustand for global state**
- Rejected: Overkill for application scope, adds complexity

**Alternative 2: SWR or React Query for data fetching**
- Rejected: Caching conflicts with "backend as single source of truth" requirement

**Alternative 3: Context API for shared state**
- Rejected: No need for cross-component state sharing

### Implementation Notes

- Use Server Components by default (faster initial load)
- Use Client Components only when needed ('use client' directive)
- Refetch data after mutations (create, update, delete)
- No optimistic updates (wait for backend confirmation)
- Loading states for all async operations

---

## Summary of Technical Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Routing** | Route Groups with App Router | Organized structure, different layouts per group |
| **Authentication** | Better Auth with httpOnly cookies | Most secure, XSS protection, automatic inclusion |
| **API Client** | Centralized Fetch wrapper | Type safety, consistent error handling, token management |
| **Forms** | Native React state with validation | Simple forms, reduces dependencies, sufficient for scope |
| **Responsive Design** | Mobile-first with Tailwind | Industry standard, progressive enhancement, smaller bundle |
| **State Management** | Minimal client state, no global store | Backend as truth, reduces complexity, sufficient for scope |

---

## Implementation Readiness

All technical decisions have been made with concrete implementation patterns. The following artifacts can now be created:

1. ✅ **data-model.md** - TypeScript interfaces for User, Task, and API responses
2. ✅ **contracts/frontend-routes.md** - Route structure with authentication requirements
3. ✅ **contracts/component-hierarchy.md** - Component organization and responsibilities
4. ✅ **contracts/api-client-interface.md** - API client methods and error handling
5. ✅ **quickstart.md** - Step-by-step setup guide from CLI to running app

**Research Status**: ✅ COMPLETE - All technical unknowns resolved

**Next Phase**: Design & Contracts (Phase 1)
