'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RecurringTaskForm, RecurringTask } from './RecurringTaskForm';
import { apiClient } from '@/lib/api-client';

/**
 * RecurringTaskList Component
 *
 * Displays a list of recurring tasks with:
 * - Create new recurring task
 * - View recurring task details
 * - Edit recurring task
 * - Delete recurring task
 * - Pause/Resume recurring task
 */

export function RecurringTaskList() {
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<RecurringTask | null>(null);

  // Fetch recurring tasks
  const fetchRecurringTasks = async () => {
    try {
      setLoading(true);
      const data = await apiClient.recurringTasks.list();
      setRecurringTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringTasks();
  }, []);

  // Handle create/update success
  const handleSuccess = (task: RecurringTask) => {
    setShowForm(false);
    setEditingTask(null);
    fetchRecurringTasks();
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recurring task?')) {
      return;
    }

    try {
      await apiClient.recurringTasks.delete(id);
      fetchRecurringTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  // Handle pause
  const handlePause = async (id: number) => {
    try {
      await apiClient.recurringTasks.pause(id);
      fetchRecurringTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause task');
    }
  };

  // Handle resume
  const handleResume = async (id: number) => {
    try {
      await apiClient.recurringTasks.resume(id);
      fetchRecurringTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume task');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Recurring Tasks</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
        >
          + Create Recurring Task
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? 'Edit Recurring Task' : 'Create Recurring Task'}
            </h2>
            <RecurringTaskForm
              recurringTask={editingTask || undefined}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Recurring Tasks List */}
      {recurringTasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No recurring tasks yet</p>
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            Create Your First Recurring Task
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {recurringTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.is_active ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Pattern:</span> {task.recurrence_pattern}
                </div>
                <div>
                  <span className="font-medium">Interval:</span> Every {task.recurrence_interval} {task.recurrence_pattern}
                </div>
                <div>
                  <span className="font-medium">Next:</span> {formatDate(task.next_occurrence)}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {task.status}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingTask(task);
                    setShowForm(true);
                  }}
                  className="text-sm"
                >
                  Edit
                </Button>
                {task.is_active ? (
                  <Button
                    variant="secondary"
                    onClick={() => handlePause(task.id)}
                    className="text-sm"
                  >
                    Pause
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => handleResume(task.id)}
                    className="text-sm"
                  >
                    Resume
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(task.id)}
                  className="text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
