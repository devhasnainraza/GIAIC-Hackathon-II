'use client';

/**
 * Enhanced CreateTaskButton with Premium Blue Design
 * Matches the Pure Tasks color palette (Blue theme)
 */

export interface CreateTaskButtonProps {
  onClick: () => void;
}

export function CreateTaskButton({ onClick }: CreateTaskButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
      <button
        onClick={onClick}
        className="group relative bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 font-semibold"
        aria-label="Create new task"
      >
        {/* Ripple Effect Background */}
        <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative flex items-center gap-3">
          {/* Plus Icon with Animation */}
          <div className="bg-white/20 rounded-lg p-1.5 group-hover:rotate-90 transition-transform duration-300">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

          {/* Text */}
          <span className="hidden sm:inline text-base">Create Task</span>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-blue-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      </button>
    </div>
  );
}
