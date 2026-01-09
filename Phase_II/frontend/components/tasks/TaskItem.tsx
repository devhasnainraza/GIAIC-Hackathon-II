'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types';

/**
 * Enhanced TaskItem Component with Modern Design and Animations
 */

export interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: number, isComplete: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  isUpdating?: boolean;
}

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isUpdating = false,
}: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handle delete with confirmation
   */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  return (
    <div
      className={`group bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border transition-all duration-300 hover:shadow-md ${
        isUpdating || isDeleting ? 'opacity-50' : 'opacity-100'
      } ${task.is_complete ? 'border-cyan-200 dark:border-cyan-700 bg-cyan-50/30 dark:bg-cyan-900/10' : 'border-slate-200 dark:border-slate-700'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={task.is_complete}
              onChange={(e) => onToggleComplete(task.id, e.target.checked)}
              disabled={isUpdating || isDeleting}
              className="sr-only peer"
              aria-label={`Mark "${task.title}" as ${
                task.is_complete ? 'incomplete' : 'complete'
              }`}
            />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              task.is_complete
                ? 'bg-cyan-600 border-cyan-600 dark:bg-cyan-700 dark:border-cyan-700'
                : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-amber-500 dark:hover:border-amber-400 peer-focus:ring-2 peer-focus:ring-amber-500 dark:peer-focus:ring-amber-400'
            } ${isUpdating || isDeleting ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              {task.is_complete && (
                <svg className="w-3 h-3 text-white dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title with Status Badge */}
          <div className="flex items-start gap-2">
            <h3
              className={`text-base font-medium break-words transition-all duration-200 ${
                task.is_complete
                  ? 'line-through text-slate-500 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400'
              }`}
            >
              {task.title}
            </h3>
            {task.is_complete && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-400">
                ✓ Done
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`mt-1 text-sm break-words transition-all duration-200 ${
                task.is_complete
                  ? 'line-through text-slate-400 dark:text-slate-600'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {task.updated_at !== task.created_at && (
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Updated {new Date(task.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex-shrink-0 flex gap-1 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(task)}
            disabled={isUpdating || isDeleting}
            className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Edit "${task.title}"`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isUpdating || isDeleting}
            className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete "${task.title}"`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Indicator for Updating */}
      {isUpdating && (
        <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 dark:bg-amber-400 animate-pulse" style={{ width: '60%' }}></div>
        </div>
      )}
    </div>
  );
}
