'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

/**
 * Error Boundary for Auth Routes
 *
 * Catches and displays errors that occur in auth pages
 * Provides a user-friendly error message and reset option
 */
export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Auth error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {/* Error Icon */}
        <svg
          className="w-16 h-16 text-red-500 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        {/* Error Message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          We encountered an unexpected error. Please try again.
        </p>

        {/* Reset Button */}
        <Button variant="primary" onClick={reset} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  );
}
