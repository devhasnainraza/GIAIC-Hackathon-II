'use client';

import { Button } from '@/components/ui/Button';

/**
 * Enhanced CreateTaskButton with Premium Sober Design
 * No gradients, using amber accent color
 */

export interface CreateTaskButtonProps {
  onClick: () => void;
}

export function CreateTaskButton({ onClick }: CreateTaskButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
      <button
        onClick={onClick}
        className="group relative bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium"
        aria-label="Create new task"
      >
        {/* Content */}
        <div className="flex items-center gap-2">
          {/* Plus Icon */}
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

          {/* Text */}
          <span className="hidden sm:inline text-sm">Create Task</span>
        </div>
      </button>
    </div>
  );
}
