import type {
  AuthResponse,
  Task,
  TaskCreateFormData,
  TaskUpdateFormData,
} from './types';

/**
 * API Client Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * API Error Class
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Make authenticated API request
 * Centralized request handler with automatic token attachment and error handling
 *
 * NOTE: For production, consider using httpOnly cookies with a Next.js API route proxy
 * to avoid storing JWT in localStorage (XSS vulnerability). For this hackathon demo,
 * we use localStorage for simplicity.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get JWT token from localStorage
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge existing headers if provided
  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Attach JWT token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Build full URL
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    // Make request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'An unexpected error occurred',
      }));

      // Map status codes to user-friendly messages
      switch (response.status) {
        case 401:
          throw new ApiError(
            'Your session has expired. Please sign in again.',
            401,
            errorData
          );
        case 403:
          throw new ApiError('Access denied.', 403, errorData);
        case 404:
          throw new ApiError(
            'The requested resource was not found.',
            404,
            errorData
          );
        case 500:
          throw new ApiError(
            'Something went wrong. Please try again later.',
            500,
            errorData
          );
        default:
          throw new ApiError(
            errorData.detail || 'An unexpected error occurred',
            response.status,
            errorData
          );
      }
    }

    // Parse and return response
    return await response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Connection lost. Please check your internet connection.',
        undefined,
        error
      );
    }

    // Unknown error
    throw new ApiError(
      'An unexpected error occurred. Please try again.',
      undefined,
      error
    );
  }
}

/**
 * API Client
 * Centralized API client with type-safe methods
 */
export const apiClient = {
  /**
   * Authentication methods
   */
  auth: {
    /**
     * Sign up a new user
     * @param email - User email address
     * @param password - User password
     * @returns AuthResponse with user and token
     */
    async signup(email: string, password: string): Promise<AuthResponse> {
      const response = await request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store JWT token and user data in localStorage
      if (typeof window !== 'undefined' && response.token) {
        localStorage.setItem('auth_token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }

      return response;
    },

    /**
     * Sign in an existing user
     * @param email - User email address
     * @param password - User password
     * @returns AuthResponse with user and token
     */
    async signin(email: string, password: string): Promise<AuthResponse> {
      const response = await request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store JWT token and user data in localStorage
      if (typeof window !== 'undefined' && response.token) {
        localStorage.setItem('auth_token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }

      return response;
    },

    /**
     * Sign out the current user
     * Clears the JWT token from localStorage
     */
    async logout(): Promise<void> {
      // Remove JWT token and user data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }

      // Optionally call backend logout endpoint
      try {
        await request<void>('/api/auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        // Ignore logout errors - token is already removed locally
        console.error('Logout API error:', error);
      }
    },
  },

  /**
   * Task methods
   */
  tasks: {
    /**
     * List all tasks for the authenticated user
     * @returns Array of tasks
     */
    async list(): Promise<Task[]> {
      const response = await request<Task[]>('/api/tasks');
      return response;
    },

    /**
     * Get a single task by ID
     * @param id - Task ID
     * @returns Task object
     */
    async get(id: number): Promise<Task> {
      const response = await request<Task>(`/api/tasks/${id}`);
      return response;
    },

    /**
     * Create a new task
     * @param data - Task creation data (title, description)
     * @returns Created task
     */
    async create(data: TaskCreateFormData): Promise<Task> {
      const response = await request<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },

    /**
     * Update an existing task
     * @param id - Task ID
     * @param data - Task update data (title, description, is_complete)
     * @returns Updated task
     */
    async update(id: number, data: TaskUpdateFormData): Promise<Task> {
      const response = await request<Task>(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response;
    },

    /**
     * Delete a task
     * @param id - Task ID
     */
    async delete(id: number): Promise<void> {
      await request<void>(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
    },

    /**
     * Toggle task completion status
     * @param id - Task ID
     * @param isComplete - New completion status
     * @returns Updated task
     */
    async toggleComplete(id: number, isComplete: boolean): Promise<Task> {
      return this.update(id, { is_complete: isComplete });
    },
  },
};

/**
 * Export API client as default
 */
export default apiClient;
