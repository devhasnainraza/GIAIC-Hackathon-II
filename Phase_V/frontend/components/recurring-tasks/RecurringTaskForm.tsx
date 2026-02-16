'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { apiClient, ApiError } from '@/lib/api-client-optimized';

/**
 * RecurringTaskForm Component
 *
 * Form for creating and editing recurring tasks with:
 * - Title, description, status, priority
 * - Recurrence pattern (daily, weekly, monthly, yearly)
 * - Recurrence interval
 * - Start date and optional end date
 * - Client-side validation
 * - API integration
 */

export interface RecurringTask {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  recurrence_pattern: string;
  recurrence_interval: number;
  start_date: string;
  end_date?: string;
  next_occurrence: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringTaskFormData {
  title: string;
  description?: string;
  status: string;
  priority: string;
  recurrence_pattern: string;
  recurrence_interval: number;
  start_date: string;
  end_date?: string;
}

export interface RecurringTaskFormProps {
  recurringTask?: RecurringTask;
  onSuccess: (task: RecurringTask) => void;
  onCancel: () => void;
}

export function RecurringTaskForm({ recurringTask, onSuccess, onCancel }: RecurringTaskFormProps) {
  const isEditMode = !!recurringTask;

  // Form state
  const [formData, setFormData] = useState<RecurringTaskFormData>({
    title: recurringTask?.title || '',
    description: recurringTask?.description || '',
    status: recurringTask?.status || 'todo',
    priority: recurringTask?.priority || 'medium',
    recurrence_pattern: recurringTask?.recurrence_pattern || 'daily',
    recurrence_interval: recurringTask?.recurrence_interval || 1,
    start_date: recurringTask?.start_date ? new Date(recurringTask.start_date).toISOString().slice(0, 16) : '',
    end_date: recurringTask?.end_date ? new Date(recurringTask.end_date).toISOString().slice(0, 16) : '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Update form data when recurringTask prop changes
  useEffect(() => {
    if (recurringTask) {
      setFormData({
        title: recurringTask.title,
        description: recurringTask.description || '',
        status: recurringTask.status,
        priority: recurringTask.priority,
        recurrence_pattern: recurringTask.recurrence_pattern,
        recurrence_interval: recurringTask.recurrence_interval,
        start_date: new Date(recurringTask.start_date).toISOString().slice(0, 16),
        end_date: recurringTask.end_date ? new Date(recurringTask.end_date).toISOString().slice(0, 16) : '',
      });
    }
  }, [recurringTask]);

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (formData.recurrence_interval < 1) {
      newErrors.recurrence_interval = 'Interval must be at least 1';
    }

    if (formData.end_date && formData.start_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end <= start) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        recurrence_pattern: formData.recurrence_pattern,
        recurrence_interval: formData.recurrence_interval,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
      };

      let result: RecurringTask;

      if (isEditMode) {
        // Update existing recurring task
        result = await apiClient.recurringTasks.update(recurringTask.id, payload);
      } else {
        // Create new recurring task
        result = await apiClient.recurringTasks.create(payload);
      }

      onSuccess(result);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (field: keyof RecurringTaskFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <ErrorMessage message={apiError} onDismiss={() => setApiError(null)} />
      )}

      {/* Title Input */}
      <Input
        id="recurring-task-title"
        name="title"
        type="text"
        label="Title"
        value={formData.title}
        onChange={(value) => handleChange('title', value)}
        error={errors.title}
        placeholder="Enter recurring task title"
        required
        disabled={isSubmitting}
      />

      {/* Description Textarea */}
      <Textarea
        id="recurring-task-description"
        name="description"
        label="Description"
        value={formData.description || ''}
        onChange={(value) => handleChange('description', value)}
        error={errors.description}
        placeholder="Enter task description (optional)"
        disabled={isSubmitting}
        rows={3}
        maxLength={2000}
      />

      {/* Status and Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Recurrence Pattern and Interval */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="recurrence_pattern" className="block text-sm font-medium text-gray-700 mb-1">
            Recurrence Pattern
          </label>
          <select
            id="recurrence_pattern"
            value={formData.recurrence_pattern}
            onChange={(e) => handleChange('recurrence_pattern', e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label htmlFor="recurrence_interval" className="block text-sm font-medium text-gray-700 mb-1">
            Every (interval)
          </label>
          <input
            id="recurrence_interval"
            type="number"
            min="1"
            value={formData.recurrence_interval}
            onChange={(e) => handleChange('recurrence_interval', parseInt(e.target.value))}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.recurrence_interval && (
            <p className="text-red-500 text-sm mt-1">{errors.recurrence_interval}</p>
          )}
        </div>
      </div>

      {/* Start Date and End Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            id="start_date"
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.start_date && (
            <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
          )}
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
            End Date (optional)
          </label>
          <input
            id="end_date"
            type="datetime-local"
            value={formData.end_date}
            onChange={(e) => handleChange('end_date', e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.end_date && (
            <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditMode ? 'Save Changes' : 'Create Recurring Task'}
        </Button>
      </div>
    </form>
  );
}
