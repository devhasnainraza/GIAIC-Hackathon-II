'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { apiClient, ApiError } from '@/lib/api-client-optimized';
import {
  validateTaskTitle,
  validateTaskDescription,
  type Task,
  type TaskCreateFormData,
  type FormErrors,
} from '@/lib/types';

/**
 * TaskForm Component
 *
 * Reusable form for creating and editing tasks with:
 * - Create mode (no task prop) or Edit mode (with task prop)
 * - Title and description inputs
 * - Client-side validation
 * - API integration
 * - Loading state during submission
 * - Error handling and display
 * - Submit and cancel actions
 */

export interface TaskFormProps {
  task?: Task; // If provided, form is in edit mode
  onSuccess: (task: Task) => void; // Called after successful create/update
  onCancel: () => void; // Called when user cancels
}

export function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const isEditMode = !!task;

  // Form state
  const [formData, setFormData] = useState<TaskCreateFormData>({
    title: task?.title || '',
    description: task?.description || '',
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Update form data when task prop changes (edit mode)
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
      });
    }
  }, [task]);

  /**
   * Validate form fields
   * Returns true if valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate title
    const titleError = validateTaskTitle(formData.title);
    if (titleError) {
      newErrors.title = titleError;
    }

    // Validate description (optional field)
    if (formData.description) {
      const descriptionError = validateTaskDescription(formData.description);
      if (descriptionError) {
        newErrors.description = descriptionError;
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

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let updatedTask: Task;

      if (isEditMode) {
        // Update existing task
        updatedTask = await apiClient.tasks.update(task.id, {
          title: formData.title,
          description: formData.description || null,
        });
      } else {
        // Create new task
        updatedTask = await apiClient.tasks.create({
          title: formData.title,
          description: formData.description || undefined,
        });
      }

      // Call success callback
      onSuccess(updatedTask);
    } catch (error) {
      // Handle API errors
      if (error instanceof ApiError) {
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
  const handleChange = (field: keyof TaskCreateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* API Error */}
      {apiError && (
        <ErrorMessage message={apiError} onDismiss={() => setApiError(null)} />
      )}

      {/* Title Input */}
      <Input
        id="task-title"
        name="title"
        type="text"
        label="Title"
        value={formData.title}
        onChange={(value) => handleChange('title', value)}
        error={errors.title}
        placeholder="Enter task title"
        required
        disabled={isSubmitting}
      />

      {/* Description Textarea */}
      <Textarea
        id="task-description"
        name="description"
        label="Description"
        value={formData.description || ''}
        onChange={(value) => handleChange('description', value)}
        error={errors.description}
        placeholder="Enter task description (optional)"
        disabled={isSubmitting}
        rows={4}
        maxLength={2000}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-2">
        {/* Cancel Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditMode ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
