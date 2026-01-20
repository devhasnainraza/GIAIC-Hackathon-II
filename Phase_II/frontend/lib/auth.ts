/**
 * Better Auth Configuration
 *
 * This configuration sets up JWT-based authentication with:
 * - 7-day token expiration
 * - HS256 algorithm (must match backend)
 * - PostgreSQL database for session management
 * - Email/password authentication
 *
 * CRITICAL: BETTER_AUTH_SECRET must match backend JWT_SECRET exactly
 *
 * NOTE: Auth initialization is commented out because we're using the backend API
 * for authentication instead of Better Auth directly. The helper functions below
 * handle client-side auth state using localStorage.
 */

// Lazy initialization to avoid build-time errors
// export const auth = betterAuth({
//   secret: process.env.BETTER_AUTH_SECRET!,
//   database: {
//     type: "postgres",
//     url: process.env.DATABASE_URL!,
//   },
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: false,
//   },
//   jwt: {
//     expiresIn: "7d",
//     algorithm: "HS256",
//   },
// });

/**
 * Type exports for Better Auth
 */
// export type Session = typeof auth.$Infer.Session;

/**
 * Client-side helper functions for authentication
 */

/**
 * Get the current user from localStorage
 * @returns User object or null if not logged in
 */
export function getUser() {
  if (typeof window === 'undefined') return null;

  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Get the authentication token from localStorage
 * @returns Token string or null if not logged in
 */
export function getToken() {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem('auth_token'); // Changed from 'token' to 'auth_token'
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns true if user is logged in, false otherwise
 */
export function isAuthenticated() {
  return getToken() !== null && getUser() !== null;
}

/**
 * Logout the current user
 * Clears user data and token from localStorage
 * Also clears any cached notification data
 */
export function logout() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token'); // Changed from 'token' to 'auth_token'
    // Clear notification cache to prevent cross-user data leakage
    localStorage.removeItem('notifications_cache');
    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('auth-logout'));
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

/**
 * Save user data and token to localStorage
 * @param user User object
 * @param token JWT token
 */
export function saveAuth(user: any, token: string) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_token', token); // Changed from 'token' to 'auth_token'
  } catch (error) {
    console.error('Error saving auth:', error);
  }
}

