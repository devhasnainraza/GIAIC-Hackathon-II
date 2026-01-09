/**
 * TypeScript Type Definitions
 *
 * This file contains all type definitions for the frontend application,
 * ensuring type safety across components, API calls, and data handling.
 */

// ============================================================================
// Core Domain Models
// ============================================================================

/**
 * User entity
 * Represents an authenticated user in the system
 */
export interface User {
  id: number;
  email: string;
  created_at: string; // ISO 8601 format
}

/**
 * Task entity
 * Represents a task owned by a user
 */
export interface Task {
  id: number;
  user_id: number;
  title: string; // 1-200 characters
  description: string | null; // max 2000 characters
  is_complete: boolean;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Authentication response
 * Returned by signup and signin endpoints
 */
export interface AuthResponse {
  user: User;
  token: string; // JWT token
}

/**
 * Task response
 * Returned by task CRUD endpoints
 */
export interface TaskResponse {
  task: Task;
}

/**
 * Task list response
 * Returned by task list endpoint
 */
export interface TaskListResponse {
  tasks: Task[];
}

/**
 * Generic error response
 * Returned by API on errors
 */
export interface ErrorResponse {
  detail: string;
  status_code?: number;
}

// ============================================================================
// Form Input Types
// ============================================================================

/**
 * Signup form data
 * Input for user registration
 */
export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword?: string; // Client-side only, not sent to API
}

/**
 * Signin form data
 * Input for user authentication
 */
export interface SigninFormData {
  email: string;
  password: string;
}

/**
 * Task creation form data
 * Input for creating a new task
 */
export interface TaskCreateFormData {
  title: string; // Required, 1-200 characters
  description?: string; // Optional, max 2000 characters
}

/**
 * Task update form data
 * Input for updating an existing task
 */
export interface TaskUpdateFormData {
  title?: string; // Optional, 1-200 characters
  description?: string | null; // Optional, max 2000 characters
  is_complete?: boolean; // Optional
}

// ============================================================================
// Form State Types
// ============================================================================

/**
 * Form error state
 * Tracks validation errors for form fields
 */
export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * Form submission state
 * Tracks form submission status
 */
export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/**
 * Button props
 */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Input props
 */
export interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

/**
 * Textarea props
 */
export interface TextareaProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}

/**
 * Modal props
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Empty state props
 */
export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Email validation
 * Returns error message if invalid, undefined if valid
 */
export function validateEmail(email: string): string | undefined {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

/**
 * Password validation
 * Returns error message if invalid, undefined if valid
 */
export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return undefined;
}

/**
 * Task title validation
 * Returns error message if invalid, undefined if valid
 */
export function validateTaskTitle(title: string): string | undefined {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  if (title.length > 200) {
    return 'Title must be 200 characters or less';
  }
  return undefined;
}

/**
 * Task description validation
 * Returns error message if invalid, undefined if valid
 */
export function validateTaskDescription(description: string): string | undefined {
  if (description && description.length > 2000) {
    return 'Description must be 2000 characters or less';
  }
  return undefined;
}

/**
 * Confirm password validation
 * Returns error message if invalid, undefined if valid
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return undefined;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * API error type guard
 */
export function isErrorResponse(error: unknown): error is ErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'detail' in error &&
    typeof (error as ErrorResponse).detail === 'string'
  );
}

/**
 * Loading state type
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Async operation result
 */
export type AsyncResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
