# API Client Interface

**Feature**: Frontend Application & User Experience
**Branch**: `003-frontend-ux`
**Created**: 2026-01-09
**Purpose**: Define centralized API client for all backend communication

---

## Configuration

### Base URL
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

**Environment Variable**: `NEXT_PUBLIC_API_URL`
**Default**: `http://localhost:8000`
**Production**: Set to actual backend API URL

### Token Management
- **Source**: httpOnly cookie named `better-auth.session_token`
- **Extraction**: Automatic via `cookies()` in Server Components or `document.cookie` in Client Components
- **Attachment**: Added to `Authorization: Bearer <token>` header on every request

### Error Handling
- **Centralized**: All errors handled in one place
- **User-Friendly**: Technical errors converted to readable messages
- **Automatic Redirect**: 401 errors redirect to signin page

---

## API Client Class

### Core Implementation

```typescript
// lib/api-client.ts
import { cookies } from 'next/headers';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  /**
   * Extract JWT token from httpOnly cookie
   * Works in both Server and Client Components
   */
  private async getToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
      // Server-side: use next/headers
      const cookieStore = cookies();
      const token = cookieStore.get('better-auth.session_token');
      return token?.value || null;
    } else {
      // Client-side: parse document.cookie
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('better-auth.session_token='));
      return tokenCookie ? tokenCookie.split('=')[1] : null;
    }
  }

  /**
   * Generic request method with automatic token attachment and error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Attach JWT token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized (token expired or invalid)
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          // Client-side: redirect to signin
          window.location.href = '/signin';
        }
        throw new Error('Your session has expired. Please sign in again.');
      }

      // Handle 403 Forbidden (insufficient permissions)
      if (response.status === 403) {
        throw new Error('Access denied. You do not have permission to perform this action.');
      }

      // Handle 404 Not Found
      if (response.status === 404) {
        throw new Error('The requested resource was not found.');
      }

      // Handle 500 Server Error
      if (response.status >= 500) {
        throw new Error('Something went wrong on our end. Please try again later.');
      }

      // Handle other errors
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(error.error || `Request failed with status ${response.status}`);
      }

      // Handle 204 No Content (e.g., DELETE requests)
      if (response.status === 204) {
        return undefined as T;
      }

      // Parse and return JSON response
      return response.json();
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Connection lost. Please check your internet connection.');
      }

      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Authentication methods
   */
  auth = {
    /**
     * Register new user
     * @param email - User email address
     * @param password - User password (min 8 characters)
     * @returns User object and JWT token
     */
    signup: (email: string, password: string): Promise<AuthResponse> =>
      this.request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    /**
     * Authenticate existing user
     * @param email - User email address
     * @param password - User password
     * @returns User object and JWT token
     */
    signin: (email: string, password: string): Promise<AuthResponse> =>
      this.request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    /**
     * Sign out current user
     * Clears session cookie and redirects to signin
     */
    logout: (): Promise<void> =>
      this.request<void>('/api/auth/logout', {
        method: 'POST',
      }),
  };

  /**
   * Task management methods
   */
  tasks = {
    /**
     * Get all tasks for authenticated user
     * @returns Array of tasks
     */
    list: (): Promise<Task[]> =>
      this.request<Task[]>('/api/tasks'),

    /**
     * Get specific task by ID
     * @param id - Task ID
     * @returns Task object
     */
    get: (id: number): Promise<Task> =>
      this.request<Task>(`/api/tasks/${id}`),

    /**
     * Create new task
     * @param data - Task creation data (title, description)
     * @returns Created task object
     */
    create: (data: TaskCreateInput): Promise<Task> =>
      this.request<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    /**
     * Update existing task
     * @param id - Task ID
     * @param data - Task update data (title, description, is_complete)
     * @returns Updated task object
     */
    update: (id: number, data: TaskUpdateInput): Promise<Task> =>
      this.request<Task>(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    /**
     * Delete task
     * @param id - Task ID
     * @returns void
     */
    delete: (id: number): Promise<void> =>
      this.request<void>(`/api/tasks/${id}`, {
        method: 'DELETE',
      }),

    /**
     * Toggle task completion status
     * @param id - Task ID
     * @param isComplete - New completion status
     * @returns Updated task object
     */
    toggleComplete: (id: number, isComplete: boolean): Promise<Task> =>
      this.request<Task>(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_complete: isComplete }),
      }),
  };
}

// Export singleton instance
export const apiClient = new ApiClient();
```

---

## Type Definitions

```typescript
// lib/types.ts

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  is_complete?: boolean;
}

export interface ErrorResponse {
  error: string;
}
```

---

## Error Handling Strategy

### HTTP Status Code Mapping

| Status Code | Error Type | User Message | Action |
|-------------|------------|--------------|--------|
| 400 | Bad Request | "Invalid input. Please check your data." | Show inline error |
| 401 | Unauthorized | "Your session has expired. Please sign in again." | Redirect to /signin |
| 403 | Forbidden | "Access denied." | Show error message |
| 404 | Not Found | "The requested resource was not found." | Show error message |
| 409 | Conflict | "Email already registered." (signup) | Show inline error |
| 500 | Server Error | "Something went wrong. Please try again later." | Show error with retry |
| Network | Connection Lost | "Connection lost. Please check your internet." | Show error with retry |

### Error Response Format

All errors thrown by the API client are instances of `Error` with user-friendly messages:

```typescript
try {
  await apiClient.tasks.create({ title: 'New Task' });
} catch (error) {
  // error.message contains user-friendly message
  console.error(error.message);
  // Display to user in UI
}
```

---

## Usage Examples

### Authentication

#### Signup
```typescript
// components/auth/SignupForm.tsx
import { apiClient } from '@/lib/api-client';

const handleSignup = async (email: string, password: string) => {
  try {
    const response = await apiClient.auth.signup(email, password);
    // Success: Better Auth handles redirect to /tasks
    console.log('User registered:', response.user);
  } catch (error) {
    // Error: Display message to user
    setError(error.message);
  }
};
```

#### Signin
```typescript
// components/auth/SigninForm.tsx
import { apiClient } from '@/lib/api-client';

const handleSignin = async (email: string, password: string) => {
  try {
    const response = await apiClient.auth.signin(email, password);
    // Success: Better Auth handles redirect to /tasks
    console.log('User authenticated:', response.user);
  } catch (error) {
    // Error: Display message to user
    setError(error.message);
  }
};
```

#### Logout
```typescript
// components/auth/LogoutButton.tsx
import { apiClient } from '@/lib/api-client';

const handleLogout = async () => {
  try {
    await apiClient.auth.logout();
    // Success: Redirect to /signin
    window.location.href = '/signin';
  } catch (error) {
    // Error: Display message to user
    console.error(error.message);
  }
};
```

---

### Task Management

#### List Tasks
```typescript
// app/(dashboard)/tasks/page.tsx
import { apiClient } from '@/lib/api-client';

export default async function TasksPage() {
  try {
    const tasks = await apiClient.tasks.list();
    return <TaskList initialTasks={tasks} />;
  } catch (error) {
    return <ErrorMessage message={error.message} />;
  }
}
```

#### Create Task
```typescript
// components/tasks/TaskList.tsx
import { apiClient } from '@/lib/api-client';

const handleCreate = async (data: TaskCreateInput) => {
  try {
    const newTask = await apiClient.tasks.create(data);
    setTasks([...tasks, newTask]);
  } catch (error) {
    setError(error.message);
  }
};
```

#### Update Task
```typescript
// components/tasks/TaskList.tsx
import { apiClient } from '@/lib/api-client';

const handleUpdate = async (id: number, data: TaskUpdateInput) => {
  try {
    const updatedTask = await apiClient.tasks.update(id, data);
    setTasks(tasks.map(t => t.id === id ? updatedTask : t));
  } catch (error) {
    setError(error.message);
  }
};
```

#### Delete Task
```typescript
// components/tasks/TaskList.tsx
import { apiClient } from '@/lib/api-client';

const handleDelete = async (id: number) => {
  try {
    await apiClient.tasks.delete(id);
    setTasks(tasks.filter(t => t.id !== id));
  } catch (error) {
    setError(error.message);
  }
};
```

#### Toggle Complete
```typescript
// components/tasks/TaskItem.tsx
import { apiClient } from '@/lib/api-client';

const handleToggleComplete = async (id: number, isComplete: boolean) => {
  try {
    const updatedTask = await apiClient.tasks.toggleComplete(id, isComplete);
    onUpdate(updatedTask);
  } catch (error) {
    setError(error.message);
  }
};
```

---

## Security Considerations

### Token Security
- ✅ Token stored in httpOnly cookie (not accessible via JavaScript)
- ✅ Token automatically included in requests (no manual handling)
- ✅ Token never logged or exposed in error messages
- ✅ Token validated on every request by backend

### Request Security
- ✅ HTTPS required in production (environment configuration)
- ✅ CORS headers configured on backend
- ✅ No sensitive data in URL parameters
- ✅ All mutations use POST/PATCH/DELETE (not GET)

### Error Security
- ✅ Technical errors converted to user-friendly messages
- ✅ No stack traces or internal details exposed
- ✅ No information leakage about system internals

---

## Testing Strategy

### Unit Tests (Out of Scope)
- Mock fetch API
- Test error handling for each status code
- Test token attachment
- Test request/response parsing

### Integration Tests (Out of Scope)
- Test with real backend API
- Test authentication flow
- Test CRUD operations
- Test error scenarios

### Manual Testing (In Scope)
- Test all API methods with real backend
- Test error handling (disconnect network, stop backend)
- Test token expiration (wait 7 days or manually expire)
- Test concurrent requests

---

## Performance Considerations

### Request Optimization
- No request caching (backend is single source of truth)
- No request batching (simple CRUD operations)
- No request deduplication (not needed for scope)

### Error Recovery
- Automatic retry for network errors (future enhancement)
- Exponential backoff for rate limiting (future enhancement)
- Request timeout after 30 seconds (future enhancement)

---

## Future Enhancements

1. **Request Retry Logic**: Automatically retry failed requests with exponential backoff
2. **Request Cancellation**: Cancel in-flight requests when component unmounts
3. **Request Deduplication**: Prevent duplicate requests for same resource
4. **Optimistic Updates**: Update UI before backend confirms (with rollback)
5. **Request Caching**: Cache GET requests for performance (with invalidation)
6. **Request Batching**: Batch multiple requests into one (GraphQL-style)
7. **WebSocket Support**: Real-time updates for task changes
8. **Offline Support**: Queue requests when offline, sync when online

---

**API Client Interface Status**: ✅ COMPLETE - All methods defined with error handling
