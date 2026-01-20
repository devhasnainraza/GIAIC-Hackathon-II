'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { apiClient, ApiError } from '@/lib/api-client-optimized';
import type { Task } from '@/lib/types';

/**
 * Enhanced TaskList Component with Search, Filters, and Statistics
 * Optimized with React.memo and performance hooks
 */

export interface TaskListProps {
  onCreateClick: () => void;
}

type FilterType = 'all' | 'active' | 'completed';

const TaskListComponent = ({ onCreateClick }: TaskListProps) => {
  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and search state
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Operation state
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  /**
   * Fetch tasks from API - memoized to prevent unnecessary re-renders
   */
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTasks = await apiClient.tasks.list();
      setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load tasks. Please try again.');
      }
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Filtered and searched tasks
   */
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply filter
    if (filter === 'active') {
      result = result.filter((task) => !task.is_complete);
    } else if (filter === 'completed') {
      result = result.filter((task) => task.is_complete);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    return result;
  }, [tasks, filter, searchQuery]);

  /**
   * Statistics
   */
  const stats = useMemo(() => {
    const total = Array.isArray(tasks) ? tasks.length : 0;
    const completed = Array.isArray(tasks) ? tasks.filter((t) => t && t.is_complete).length : 0;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, completionRate };
  }, [tasks]);

  /**
   * Handle task creation success - memoized to prevent unnecessary re-renders
   */
  const handleCreateSuccess = useCallback((newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    setIsModalOpen(false);
  }, []);

  /**
   * Handle task update success - memoized to prevent unnecessary re-renders
   */
  const handleUpdateSuccess = useCallback((updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  /**
   * Handle task deletion - memoized to prevent unnecessary re-renders
   */
  const handleDelete = useCallback(async (taskId: number) => {
    setUpdatingTaskId(taskId);

    try {
      await apiClient.tasks.delete(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to delete task: ${err.message}`);
      } else {
        alert('Failed to delete task. Please try again.');
      }
    } finally {
      setUpdatingTaskId(null);
    }
  }, []);

  /**
   * Handle task completion toggle - memoized to prevent unnecessary re-renders
   */
  const handleToggleComplete = useCallback(async (taskId: number, isComplete: boolean) => {
    setUpdatingTaskId(taskId);

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, is_complete: isComplete } : task
      )
    );

    try {
      const updatedTask = await apiClient.tasks.toggleComplete(
        taskId,
        isComplete
      );
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (err) {
      // Revert optimistic update on error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, is_complete: !isComplete } : task
        )
      );

      if (err instanceof ApiError) {
        alert(`Failed to update task: ${err.message}`);
      } else {
        alert('Failed to update task. Please try again.');
      }
    } finally {
      setUpdatingTaskId(null);
    }
  }, []);

  /**
   * Handle edit button click - memoized to prevent unnecessary re-renders
   */
  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  /**
   * Handle modal close - memoized to prevent unnecessary re-renders
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  /**
   * Handle create button click - memoized to prevent unnecessary re-renders
   */
  const handleCreateClick = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  /**
   * Handle search query change - memoized to prevent unnecessary re-renders
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  /**
   * Clear search query - memoized to prevent unnecessary re-renders
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  /**
   * Handle filter change - memoized to prevent unnecessary re-renders
   */
  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="large" message="Loading tasks..." centered />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage message={error} />
        <div className="mt-4 text-center">
          <button
            onClick={fetchTasks}
            className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <>
        <EmptyState
          title="No tasks yet"
          description="Get started by creating your first task. Stay organized and track your progress."
          actionLabel="Create Task"
          onAction={handleCreateClick}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingTask ? 'Edit Task' : 'Create Task'}
        >
          <TaskForm
            task={editingTask || undefined}
            onSuccess={editingTask ? handleUpdateSuccess : handleCreateSuccess}
            onCancel={handleModalClose}
          />
        </Modal>
      </>
    );
  }

  // Task list with filters and search
  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Tasks */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.active}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completionRate}%</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All <span className="ml-1 text-sm opacity-75">({stats.total})</span>
            </button>
            <button
              onClick={() => handleFilterChange('active')}
              className={`px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
                filter === 'active'
                  ? 'bg-yellow-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active <span className="ml-1 text-sm opacity-75">({stats.active})</span>
            </button>
            <button
              onClick={() => handleFilterChange('completed')}
              className={`px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
                filter === 'completed'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Done <span className="ml-1 text-sm opacity-75">({stats.completed})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-16 text-center border border-gray-200">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-900 text-xl font-semibold mb-2">No tasks found</p>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-slide-up"
            >
              <TaskItem
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isUpdating={updatingTaskId === task.id}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm
          task={editingTask || undefined}
          onSuccess={editingTask ? handleUpdateSuccess : handleCreateSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
// Only re-render if onCreateClick function changes
export const TaskList = memo(TaskListComponent, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return prevProps.onCreateClick === nextProps.onCreateClick;
});
