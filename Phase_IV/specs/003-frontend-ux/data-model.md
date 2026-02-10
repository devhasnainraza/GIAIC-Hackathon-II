# Frontend Data Models

**Feature**: Frontend Application & User Experience
**Branch**: `003-frontend-ux`
**Created**: 2026-01-09
**Purpose**: Define TypeScript interfaces for all data models used in the frontend

---

## User Model (from Backend API)

Represents an authenticated user in the system.

```typescript
interface User {
  id: number;
  email: string;
  created_at: string; // ISO 8601 format
}
```

**Source**: Backend API `/api/auth/register` and `/api/auth/login` responses

**Usage**: Displayed in user profile, used for authentication context

---

## Task Model (from Backend API)

Represents a todo task owned by a user.

```typescript
interface Task {
  id: number;
  user_id: number;
  title: string; // 1-200 characters
  description: string | null; // max 2000 characters
  is_complete: boolean;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}
```

**Source**: Backend API `/api/tasks` endpoints

**Validation Rules**:
- `title`: Required, 1-200 characters
- `description`: Optional, max 2000 characters
- `is_complete`: Boolean, defaults to false

**Usage**: Task list display, task forms, task detail views

---

## Authentication Token (JWT)

Represents the user's authenticated session.

```typescript
interface JWTToken {
  // Token is stored in httpOnly cookie, not directly accessible
  // Claims (decoded):
  sub: string; // User ID
  email: string;
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}
```

**Storage**: httpOnly cookie named `better-auth.session_token`

**Expiration**: 7 days from issuance

**Algorithm**: HS256

**Security**: Never exposed in JavaScript, automatically included in same-origin requests

---

## Form Input Models (Client-Side)

### SignupForm

```typescript
interface SignupFormData {
  email: string;
  password: string;
}

interface SignupFormErrors {
  email?: string;
  password?: string;
}
```

**Validation Rules**:
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters

### SigninForm

```typescript
interface SigninFormData {
  email: string;
  password: string;
}

interface SigninFormErrors {
  email?: string;
  password?: string;
}
```

**Validation Rules**:
- `email`: Required, valid email format
- `password`: Required

### TaskCreateForm

```typescript
interface TaskCreateFormData {
  title: string;
  description?: string;
}

interface TaskCreateFormErrors {
  title?: string;
  description?: string;
}
```

**Validation Rules**:
- `title`: Required, 1-200 characters
- `description`: Optional, max 2000 characters

### TaskUpdateForm

```typescript
interface TaskUpdateFormData {
  title?: string;
  description?: string;
  is_complete?: boolean;
}

interface TaskUpdateFormErrors {
  title?: string;
  description?: string;
}
```

**Validation Rules**:
- `title`: If provided, 1-200 characters
- `description`: If provided, max 2000 characters
- `is_complete`: Boolean

---

## API Response Types

### AuthResponse

```typescript
interface AuthResponse {
  user: User;
  token: string; // JWT token (stored in httpOnly cookie by Better Auth)
}
```

**Returned by**:
- `POST /api/auth/register`
- `POST /api/auth/login`

### TaskResponse

```typescript
type TaskResponse = Task;
```

**Returned by**:
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PATCH /api/tasks/{id}`

### TaskListResponse

```typescript
type TaskListResponse = Task[];
```

**Returned by**:
- `GET /api/tasks`

### ErrorResponse

```typescript
interface ErrorResponse {
  error: string; // User-friendly error message
}
```

**Returned by**: All endpoints on error (4xx, 5xx status codes)

---

## Component State Models

### TaskListState

```typescript
interface TaskListState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean; // Computed: tasks.length === 0
}
```

**Usage**: Task list component state management

### FormState

```typescript
interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  submitError: string | null;
}
```

**Usage**: Generic form state for all forms

---

## UI State Models

### LoadingState

```typescript
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

**Usage**: Track async operation states

### ModalState

```typescript
interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'delete' | null;
  taskId: number | null; // For edit/delete modes
}
```

**Usage**: Task form modal state

---

## Type Guards

Utility functions for type checking at runtime.

```typescript
function isTask(obj: any): obj is Task {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.user_id === 'number' &&
    typeof obj.title === 'string' &&
    (obj.description === null || typeof obj.description === 'string') &&
    typeof obj.is_complete === 'boolean' &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string'
  );
}

function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.email === 'string' &&
    typeof obj.created_at === 'string'
  );
}

function isErrorResponse(obj: any): obj is ErrorResponse {
  return typeof obj === 'object' && typeof obj.error === 'string';
}
```

---

## Validation Functions

Client-side validation helpers.

```typescript
function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

function validateTaskTitle(title: string): string | null {
  if (!title) return 'Title is required';
  if (title.length > 200) return 'Title must be 200 characters or less';
  return null;
}

function validateTaskDescription(description: string): string | null {
  if (description && description.length > 2000) {
    return 'Description must be 2000 characters or less';
  }
  return null;
}
```

---

## TypeScript Configuration

All types should be defined in `lib/types.ts` for centralized type management.

```typescript
// lib/types.ts
export type {
  User,
  Task,
  AuthResponse,
  TaskResponse,
  TaskListResponse,
  ErrorResponse,
  SignupFormData,
  SignupFormErrors,
  SigninFormData,
  SigninFormErrors,
  TaskCreateFormData,
  TaskCreateFormErrors,
  TaskUpdateFormData,
  TaskUpdateFormErrors,
  TaskListState,
  FormState,
  LoadingState,
  ModalState,
};

export {
  isTask,
  isUser,
  isErrorResponse,
  validateEmail,
  validatePassword,
  validateTaskTitle,
  validateTaskDescription,
};
```

---

## Data Flow

```
Backend API → API Client → TypeScript Interfaces → React Components → UI

1. Backend returns JSON
2. API Client parses and validates types
3. TypeScript ensures type safety
4. React components render with typed data
5. User sees UI with correct data
```

**Type Safety Guarantees**:
- All API responses are typed
- All form inputs are typed
- All component props are typed
- Runtime validation with type guards
- Compile-time type checking with TypeScript

---

**Data Model Status**: ✅ COMPLETE - All types defined and validated
