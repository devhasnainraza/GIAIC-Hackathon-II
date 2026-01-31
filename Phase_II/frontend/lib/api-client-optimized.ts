import type {
  AuthResponse,
  Task,
  TaskCreateFormData,
  TaskUpdateFormData,
} from './types';

/**
 * Optimized API Client with Caching and Request Deduplication
 *
 * Performance Features:
 * - Request deduplication to prevent duplicate API calls
 * - In-memory caching with TTL (Time To Live)
 * - Request timeout handling
 * - Retry logic for failed requests
 * - Optimistic updates for better UX
 */

/**
 * API Client Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hasnain-raza3-pure-tasks-backend.hf.space';
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;

/**
 * Cache Entry Interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Request Cache
 */
class RequestCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Get cached data if valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache data with TTL
   */
  set<T>(key: string, data: T, ttl: number = DEFAULT_CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Get or set pending request to prevent duplicates
   */
  getPendingRequest<T>(key: string): Promise<T> | null {
    return this.pendingRequests.get(key) || null;
  }

  /**
   * Set pending request
   */
  setPendingRequest<T>(key: string, promise: Promise<T>): Promise<T> {
    this.pendingRequests.set(key, promise);

    // Clean up when request completes
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });

    return promise;
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Global cache instance
 */
const cache = new RequestCache();

/**
 * API Error Class
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
 * Request timeout utility
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Retry utility with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx) except 408, 429
      if (error instanceof ApiError && error.statusCode) {
        const status = error.statusCode;
        if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
          throw error;
        }
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Generate cache key for request
 */
function getCacheKey(endpoint: string, options: RequestInit = {}): string {
  const method = options.method || 'GET';
  const body = options.body || '';
  return `${method}:${endpoint}:${body}`;
}

/**
 * Make authenticated API request with caching and optimization
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  cacheOptions: { ttl?: number; skipCache?: boolean } = {}
): Promise<T> {
  const method = options.method || 'GET';
  const cacheKey = getCacheKey(endpoint, options);

  // Check cache for GET requests (unless skipCache is true)
  if (method === 'GET' && !cacheOptions.skipCache) {
    const cachedData = cache.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check for pending request to prevent duplicates
    const pendingRequest = cache.getPendingRequest<T>(cacheKey);
    if (pendingRequest) {
      return pendingRequest;
    }
  }

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

  // Create request function
  const makeRequest = async (): Promise<T> => {
    const response = await withTimeout(
      fetch(url, {
        ...options,
        headers,
      }),
      DEFAULT_TIMEOUT
    );

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'An unexpected error occurred',
      }));

      // Map status codes to user-friendly messages
      switch (response.status) {
        case 401:
          // Clear auth data on 401
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          }
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
        case 408:
          throw new ApiError('Request timeout. Please try again.', 408, errorData);
        case 429:
          throw new ApiError('Too many requests. Please wait a moment.', 429, errorData);
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
  };

  // Execute request with retry logic
  const requestPromise = withRetry(makeRequest);

  // Set pending request for GET requests
  if (method === 'GET') {
    cache.setPendingRequest(cacheKey, requestPromise);
  }

  try {
    const result = await requestPromise;

    // Cache GET requests
    if (method === 'GET') {
      cache.set(cacheKey, result, cacheOptions.ttl);
    }

    // Invalidate related cache entries for mutations
    if (method !== 'GET') {
      const baseEndpoint = endpoint.split('/')[1]; // e.g., 'tasks' from '/api/tasks/123'
      cache.invalidatePattern(`GET:/api/${baseEndpoint}`);
    }

    return result;
  } catch (error) {
    // Handle network errors
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new ApiError(
          'Request timeout. Please check your connection and try again.',
          408,
          error
        );
      }

      if (error.message.includes('fetch')) {
        throw new ApiError(
          'Connection lost. Please check your internet connection.',
          undefined,
          error
        );
      }
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
 * Optimized API Client
 */
export const apiClient = {
  /**
   * Cache management
   */
  cache: {
    clear: () => cache.clear(),
    invalidate: (pattern: string) => cache.invalidatePattern(pattern),
  },

  /**
   * Authentication methods
   */
  auth: {
    /**
     * Sign up a new user
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
     */
    async logout(): Promise<void> {
      // Clear cache
      cache.clear();

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

    /**
     * Request a password reset link
     */
    async forgotPassword(email: string): Promise<{ message: string; email: string }> {
      const response = await request<{ message: string; email: string }>(
        '/api/auth/forgot-password',
        {
          method: 'POST',
          body: JSON.stringify({ email }),
        }
      );

      return response;
    },

    /**
     * Reset password using a reset token
     */
    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
      const response = await request<{ message: string }>(
        '/api/auth/reset-password',
        {
          method: 'POST',
          body: JSON.stringify({ token, new_password: newPassword }),
        }
      );

      return response;
    },
  },

  /**
   * Task methods with optimized caching
   */
  tasks: {
    /**
     * List all tasks with caching
     */
    async list(forceRefresh: boolean = false): Promise<Task[]> {
      return request<Task[]>('/api/tasks', {}, {
        skipCache: forceRefresh,
        ttl: 2 * 60 * 1000 // 2 minutes cache for task list
      });
    },

    /**
     * Get a single task by ID with caching
     */
    async get(id: number): Promise<Task> {
      return request<Task>(`/api/tasks/${id}`, {}, {
        ttl: 5 * 60 * 1000 // 5 minutes cache for individual tasks
      });
    },

    /**
     * Create a new task with optimistic updates
     */
    async create(data: TaskCreateFormData): Promise<Task> {
      const response = await request<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },

    /**
     * Update an existing task with optimistic updates
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
     */
    async delete(id: number): Promise<void> {
      await request<void>(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
    },

    /**
     * Toggle task completion status
     */
    async toggleComplete(id: number, isComplete: boolean): Promise<Task> {
      return this.update(id, { is_complete: isComplete });
    },
  },
};

/**
 * Export optimized API client as default
 */
export default apiClient;