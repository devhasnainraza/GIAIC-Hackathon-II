/**
 * LoadingSpinner Component
 *
 * Reusable loading spinner with:
 * - Multiple size variants (small, medium, large)
 * - Optional loading message
 * - Proper accessibility attributes
 * - Centered layout option
 */

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  centered?: boolean;
}

export function LoadingSpinner({
  size = 'medium',
  message,
  centered = false,
}: LoadingSpinnerProps) {
  // Size variants
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  const spinnerSize = sizeClasses[size];

  // Container styles
  const containerStyles = centered
    ? 'flex flex-col items-center justify-center gap-3'
    : 'flex items-center gap-3';

  return (
    <div className={containerStyles} role="status" aria-live="polite">
      {/* Spinner SVG */}
      <svg
        className={`animate-spin text-blue-600 ${spinnerSize}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      {/* Optional Message */}
      {message && (
        <span className="text-sm text-gray-600">{message}</span>
      )}

      {/* Screen reader text */}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
