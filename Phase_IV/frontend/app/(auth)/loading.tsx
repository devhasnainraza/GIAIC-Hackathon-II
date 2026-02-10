import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Loading State for Auth Routes
 *
 * Displayed during navigation between auth pages
 * (signin, signup)
 */
export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="large" message="Loading..." centered />
    </div>
  );
}
