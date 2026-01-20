'use client';

import { useState, memo, useCallback } from 'react';
import type { Task } from '@/lib/types';

/**
 * Enhanced TaskItem Component with Modern Design and Animations
 * Optimized with React.memo for performance
 */

export interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: number, isComplete: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  isUpdating?: boolean;
}

const TaskItemComponent = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isUpdating = false,
}: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handle delete with confirmation - memoized to prevent unnecessary re-renders
   */
  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  }, [onDelete, task.id]);

  /**
   * Handle toggle complete - memoized to prevent unnecessary re-renders
   */
  const handleToggleComplete = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleComplete(task.id, e.target.checked);
  }, [onToggleComplete, task.id]);

  /**
   * Handle edit - memoized to prevent unnecessary re-renders
   */
  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  /**
   * Handle mouse enter - memoized to prevent unnecessary re-renders
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  /**
   * Handle mouse leave - memoized to prevent unnecessary re-renders
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={`group bg-white rounded-lg shadow-sm p-5 border transition-all duration-300 hover:shadow-md ${
        isUpdating || isDeleting ? 'opacity-50' : 'opacity-100'
      } ${task.is_complete ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 hover:border-blue-200'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={task.is_complete}
              onChange={handleToggleComplete}
              disabled={isUpdating || isDeleting}
              className="sr-only peer"
              aria-label={`Mark "${task.title}" as ${
                task.is_complete ? 'incomplete' : 'complete'
              }`}
            />
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
              task.is_complete
                ? 'bg-blue-600 border-blue-600 scale-110'
                : 'bg-white border-gray-300 hover:border-blue-500 hover:scale-110 peer-focus:ring-2 peer-focus:ring-blue-500'
            } ${isUpdating || isDeleting ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              {task.is_complete && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`text-base font-semibold break-words transition-all duration-200 ${
                task.is_complete
                  ? 'line-through text-gray-500'
                  : 'text-gray-900 group-hover:text-green-600'
              }`}
            >
              {task.title}
            </h3>
            {task.is_complete && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                ✓ Done
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`mt-1 text-sm break-words transition-all duration-200 ${
                task.is_complete
                  ? 'line-through text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {task.updated_at !== task.created_at && (
              <div className="flex items-center gap-1 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Updated {new Date(task.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex-shrink-0 flex gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
          {/* Edit Button */}
          <button
            type="button"
            onClick={handleEdit}
            disabled={isUpdating || isDeleting}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Edit "${task.title}"`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isUpdating || isDeleting}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete "${task.title}"`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Indicator for Updating */}
      {isUpdating && (
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }}></div>
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
// Only re-render if task, isUpdating, or callback functions change
export const TaskItem = memo(TaskItemComponent, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.is_complete === nextProps.task.is_complete &&
    prevProps.task.created_at === nextProps.task.created_at &&
    prevProps.task.updated_at === nextProps.task.updated_at &&
    prevProps.task.due_date === nextProps.task.due_date &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.isUpdating === nextProps.isUpdating &&
    prevProps.onToggleComplete === nextProps.onToggleComplete &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete
  );
});
