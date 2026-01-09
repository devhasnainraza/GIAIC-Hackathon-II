# Component Hierarchy

**Feature**: Frontend Application & User Experience
**Branch**: `003-frontend-ux`
**Created**: 2026-01-09
**Purpose**: Define component structure, responsibilities, and reusability strategy

---

## Layout Components

### Root Layout
**File**: `app/layout.tsx`

**Purpose**: Global layout for entire application

**Responsibilities**:
- Define HTML structure (html, body tags)
- Load global styles and fonts
- Set up metadata defaults
- Provide root-level error boundaries

**Children**: All pages in the application

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

### Auth Layout
**File**: `app/(auth)/layout.tsx`

**Purpose**: Layout for authentication pages (signin, signup)

**Responsibilities**:
- Center form container on page
- Provide consistent styling for auth pages
- No header or navigation (clean, focused experience)

**Children**: Signin page, Signup page

```typescript
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
```

---

### Dashboard Layout
**File**: `app/(dashboard)/layout.tsx`

**Purpose**: Layout for protected application pages

**Responsibilities**:
- Display header with logout button
- Provide consistent navigation
- Container for main content area

**Children**: Tasks page

```typescript
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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

---

## Page Components

### Landing Page
**File**: `app/page.tsx`

**Purpose**: Entry point that redirects based on auth status

**Responsibilities**:
- Check authentication status
- Redirect to /signin or /tasks

**Data**: None (redirect only)

```typescript
export default function HomePage() {
  // Middleware handles redirect
  return null;
}
```

---

### Signin Page
**File**: `app/(auth)/signin/page.tsx`

**Purpose**: User authentication page

**Responsibilities**:
- Render SigninForm component
- Display link to signup page
- Handle post-signin redirect

**Data**: None (form handles submission)

```typescript
export default function SigninPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      <SigninForm />
      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
```

---

### Signup Page
**File**: `app/(auth)/signup/page.tsx`

**Purpose**: User registration page

**Responsibilities**:
- Render SignupForm component
- Display link to signin page
- Handle post-signup redirect

**Data**: None (form handles submission)

```typescript
export default function SignupPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <SignupForm />
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/signin" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
```

---

### Tasks Page
**File**: `app/(dashboard)/tasks/page.tsx`

**Purpose**: Task list and management dashboard

**Responsibilities**:
- Fetch tasks from API on page load
- Pass tasks to TaskList component
- Handle page-level loading and error states

**Data**: Fetches tasks from `GET /api/tasks`

```typescript
export default async function TasksPage() {
  const tasks = await apiClient.tasks.list();

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Tasks</h2>
        <CreateTaskButton />
      </div>
      <TaskList initialTasks={tasks} />
    </div>
  );
}
```

---

## Authentication Components

### SigninForm
**File**: `components/auth/SigninForm.tsx`

**Type**: Client Component (`'use client'`)

**Purpose**: Handle user signin

**Responsibilities**:
- Manage form state (email, password)
- Validate inputs before submission
- Call API client signin method
- Display loading state during submission
- Display error messages
- Redirect on success (handled by Better Auth)

**Props**: None

**State**:
- `email: string`
- `password: string`
- `errors: { email?: string; password?: string }`
- `isLoading: boolean`

---

### SignupForm
**File**: `components/auth/SignupForm.tsx`

**Type**: Client Component (`'use client'`)

**Purpose**: Handle user registration

**Responsibilities**:
- Manage form state (email, password)
- Validate inputs before submission
- Call API client signup method
- Display loading state during submission
- Display error messages
- Redirect on success (handled by Better Auth)

**Props**: None

**State**:
- `email: string`
- `password: string`
- `errors: { email?: string; password?: string }`
- `isLoading: boolean`

---

### LogoutButton
**File**: `components/auth/LogoutButton.tsx`

**Type**: Client Component (`'use client'`)

**Purpose**: Handle user logout

**Responsibilities**:
- Call API client logout method
- Display loading state during logout
- Redirect to signin on success

**Props**: None

**State**:
- `isLoading: boolean`

---

## Task Components

### TaskList
**File**: `components/tasks/TaskList.tsx`

**Type**: Client Component (`'use client'`)

**Purpose**: Display and manage list of tasks

**Responsibilities**:
- Manage task list state
- Handle task CRUD operations
- Display loading, error, and empty states
- Render TaskItem components for each task
- Provide create task functionality

**Props**:
- `initialTasks: Task[]` - Initial tasks from server

**State**:
- `tasks: Task[]`
- `isLoading: boolean`
- `error: string | null`
- `modalState: { isOpen: boolean; mode: 'create' | 'edit' | 'delete'; taskId?: number }`

**Methods**:
- `handleCreate(data: TaskCreateFormData)`
- `handleUpdate(id: number, data: TaskUpdateFormData)`
- `handleDelete(id: number)`
- `handleToggleComplete(id: number, isComplete: boolean)`

---

### TaskItem
**File**: `components/tasks/TaskItem.tsx`

**Type**: Client Component (`'use client'`)

**Purpose**: Display individual task with actions

**Responsibilities**:
- Display task title, description, completion status
- Provide edit, delete, and toggle complete actions
- Handle responsive layout (mobile vs desktop)

**Props**:
- `task: Task`
- `onEdit: (id: number) => void`
- `onDelete: (id: number) => void`
- `onToggleComplete: (id: number, isComplete: boolean) => void`

**State**: None (controlled by parent)

---

### TaskForm
**File**: `components/tasks/TaskForm.tsx`

**Type**: Client Component (`'use client'`)

**Purpose**: Create or edit task

**Responsibilities**:
- Manage form state (title, description)
- Validate inputs before submission
- Call onSubmit callback with form data
- Display loading state during submission
- Display error messages

**Props**:
- `mode: 'create' | 'edit'`
- `initialData?: Task` - For edit mode
- `onSubmit: (data: TaskCreateFormData | TaskUpdateFormData) => Promise<void>`
- `onCancel: () => void`

**State**:
- `title: string`
- `description: string`
- `errors: { title?: string; description?: string }`
- `isSubmitting: boolean`

---

### CreateTaskButton
**File**: `components/tasks/CreateTaskButton.tsx`

**Type**: Client Component (`'use client'`)

**Purpose**: Trigger task creation modal/form

**Responsibilities**:
- Open task creation modal
- Responsive design (button vs icon)

**Props**:
- `onClick: () => void`

**State**: None

---

## UI Components (Reusable)

### Button
**File**: `components/ui/Button.tsx`

**Type**: Client Component

**Purpose**: Reusable button with consistent styling

**Props**:
- `children: React.ReactNode`
- `variant?: 'primary' | 'secondary' | 'danger'`
- `size?: 'sm' | 'md' | 'lg'`
- `disabled?: boolean`
- `isLoading?: boolean`
- `onClick?: () => void`
- `type?: 'button' | 'submit' | 'reset'`

**Variants**:
- `primary`: Blue background, white text
- `secondary`: Gray background, dark text
- `danger`: Red background, white text

---

### Input
**File**: `components/ui/Input.tsx`

**Type**: Client Component

**Purpose**: Reusable input field with label and error

**Props**:
- `label: string`
- `type?: 'text' | 'email' | 'password'`
- `value: string`
- `onChange: (value: string) => void`
- `error?: string`
- `placeholder?: string`
- `disabled?: boolean`
- `required?: boolean`

---

### Textarea
**File**: `components/ui/Textarea.tsx`

**Type**: Client Component

**Purpose**: Reusable textarea with label and error

**Props**:
- `label: string`
- `value: string`
- `onChange: (value: string) => void`
- `error?: string`
- `placeholder?: string`
- `disabled?: boolean`
- `rows?: number`

---

### ErrorMessage
**File**: `components/ui/ErrorMessage.tsx`

**Type**: Client Component

**Purpose**: Display error messages consistently

**Props**:
- `message: string`
- `onRetry?: () => void` - Optional retry button

---

### LoadingSpinner
**File**: `components/ui/LoadingSpinner.tsx`

**Type**: Client Component

**Purpose**: Display loading indicator

**Props**:
- `size?: 'sm' | 'md' | 'lg'`
- `message?: string` - Optional loading message

---

### EmptyState
**File**: `components/ui/EmptyState.tsx`

**Type**: Client Component

**Purpose**: Display empty state with helpful message

**Props**:
- `title: string`
- `description: string`
- `action?: { label: string; onClick: () => void }` - Optional action button

---

### Modal
**File**: `components/ui/Modal.tsx`

**Type**: Client Component

**Purpose**: Reusable modal dialog

**Props**:
- `isOpen: boolean`
- `onClose: () => void`
- `title: string`
- `children: React.ReactNode`

---

## Component Dependency Graph

```
RootLayout
├── AuthLayout
│   ├── SigninPage
│   │   └── SigninForm
│   │       ├── Input
│   │       ├── Button
│   │       └── ErrorMessage
│   └── SignupPage
│       └── SignupForm
│           ├── Input
│           ├── Button
│           └── ErrorMessage
└── DashboardLayout
    ├── LogoutButton
    └── TasksPage
        └── TaskList
            ├── CreateTaskButton
            ├── TaskItem (multiple)
            │   └── Button
            ├── TaskForm (in Modal)
            │   ├── Input
            │   ├── Textarea
            │   ├── Button
            │   └── ErrorMessage
            ├── LoadingSpinner
            ├── ErrorMessage
            └── EmptyState
```

---

## Component Responsibilities Matrix

| Component | Data Fetching | State Management | User Interaction | Presentation |
|-----------|---------------|------------------|------------------|--------------|
| **Layouts** | ❌ | ❌ | ❌ | ✅ |
| **Pages** | ✅ | ❌ | ❌ | ✅ |
| **Forms** | ❌ | ✅ | ✅ | ✅ |
| **Lists** | ❌ | ✅ | ✅ | ✅ |
| **UI Components** | ❌ | ❌ | ✅ | ✅ |

---

## Server vs Client Components

### Server Components (Default)
- `app/layout.tsx`
- `app/(auth)/layout.tsx`
- `app/(dashboard)/layout.tsx`
- `app/page.tsx`
- `app/(auth)/signin/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(dashboard)/tasks/page.tsx`

**Rationale**: Faster initial load, SEO-friendly, can fetch data on server

### Client Components (`'use client'`)
- All form components (SigninForm, SignupForm, TaskForm)
- All interactive components (TaskList, TaskItem, LogoutButton)
- All UI components (Button, Input, Modal, etc.)

**Rationale**: Require interactivity, state management, event handlers

---

## Responsive Design Strategy

### Mobile (320px-767px)
- Stack elements vertically
- Full-width buttons and inputs
- Larger tap targets (min 44x44px)
- Hide non-essential UI elements
- Single-column task list

### Tablet (768px-1023px)
- Two-column layouts where appropriate
- Larger spacing and padding
- Show more UI elements
- Two-column task list (optional)

### Desktop (1024px+)
- Multi-column layouts
- Sidebar navigation (future)
- Hover states for interactive elements
- Three-column task list (optional)

---

## Accessibility Considerations

- All interactive elements keyboard accessible
- Form inputs have associated labels
- Error messages announced to screen readers
- Focus management in modals
- ARIA labels for icon buttons
- Semantic HTML elements

---

## Component Testing Strategy

### Unit Tests (Out of Scope)
- Test individual components in isolation
- Mock API calls and dependencies
- Test user interactions and state changes

### Integration Tests (Out of Scope)
- Test component interactions
- Test form submissions
- Test navigation flows

### Manual Testing (In Scope)
- Test all user flows end-to-end
- Test responsive design on multiple devices
- Test error handling and edge cases

---

**Component Hierarchy Status**: ✅ COMPLETE - All components defined with clear responsibilities
