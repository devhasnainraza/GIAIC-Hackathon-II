'use client';

import { useState, useEffect, useMemo } from 'react';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Task } from '@/lib/types';

/**
 * Enhanced TaskList Component with Search, Filters, and Statistics
 */

export interface TaskListProps {
  onCreateClick: () => void;
}

type FilterType = 'all' | 'active' | 'completed';

export function TaskList({ onCreateClick }: TaskListProps) {
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
   * Fetch tasks from API
   */
  const fetchTasks = async () => {
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
  };

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
   * Handle task creation success
   */
  const handleCreateSuccess = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    setIsModalOpen(false);
  };

  /**
   * Handle task update success
   */
  const handleUpdateSuccess = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setIsModalOpen(false);
    setEditingTask(null);
  };

  /**
   * Handle task deletion
   */
  const handleDelete = async (taskId: number) => {
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
  };

  /**
   * Handle task completion toggle
   */
  const handleToggleComplete = async (taskId: number, isComplete: boolean) => {
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
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  /**
   * Handle create button click
   */
  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

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
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="bg-slate-800 dark:bg-slate-700 rounded-lg p-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
              <p className="text-2xl font-bold text-amber-500 dark:text-amber-400 mt-1">{stats.active}</p>
            </div>
            <div className="bg-amber-500 dark:bg-amber-600 rounded-lg p-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">{stats.completed}</p>
            </div>
            <div className="bg-cyan-600 dark:bg-cyan-700 rounded-lg p-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completion</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">{stats.completionRate}%</p>
            </div>
            <div className="bg-slate-800 dark:bg-slate-700 rounded-lg p-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-6 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === 'active'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Done ({stats.completed})
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-12 text-center border border-slate-200 dark:border-slate-700">
          <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 text-lg">No tasks found</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isUpdating={updatingTaskId === task.id}
            />
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
}
