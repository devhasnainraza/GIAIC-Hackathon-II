import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Loading State for Dashboard Routes
 *
 * Displayed during navigation between dashboard pages
 * (tasks, etc.)
 */
export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="large" message="Loading..." centered />
    </div>
  );
}
