import type { EmptyStateProps } from '@/lib/types';

/**
 * Enhanced EmptyState Component with Premium Sober Design
 * No gradients, using slate and amber colors
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Animated Empty State Illustration */}
      <div className="relative mb-8">
        {/* Background Circle - No gradient, solid color with subtle animation */}
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full blur-2xl opacity-30 animate-pulse"></div>

        {/* Icon */}
        <div className="relative bg-white dark:bg-slate-800 rounded-full p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <svg
            className="w-20 h-20 text-slate-400 dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {/* Optional Action Button - No gradient, solid amber color */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="group relative bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
