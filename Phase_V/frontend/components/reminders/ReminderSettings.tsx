'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { apiClient } from '@/lib/api-client-optimized';

/**
 * ReminderSettings Component
 *
 * Allows users to configure their reminder preferences:
 * - Enable/disable reminders
 * - Reminder timing (before due, on due date, overdue)
 * - Notification channels (email, push, in-app)
 * - Quiet hours
 */

export interface UserReminderPreferences {
  id: number;
  user_id: number;
  enable_reminders: boolean;
  remind_before_due_minutes: number;
  remind_on_due_date: boolean;
  remind_overdue: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  created_at: string;
  updated_at: string;
}

export function ReminderSettings() {
  const [preferences, setPreferences] = useState<UserReminderPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    enable_reminders: true,
    remind_before_due_minutes: 60,
    remind_on_due_date: true,
    remind_overdue: true,
    email_notifications: true,
    push_notifications: false,
    in_app_notifications: true,
    quiet_hours_start: '',
    quiet_hours_end: '',
  });

  // Fetch preferences
  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const data = await apiClient.reminders.getPreferences();
      setPreferences(data);

      // Update form data
      setFormData({
        enable_reminders: data.enable_reminders,
        remind_before_due_minutes: data.remind_before_due_minutes,
        remind_on_due_date: data.remind_on_due_date,
        remind_overdue: data.remind_overdue,
        email_notifications: data.email_notifications,
        push_notifications: data.push_notifications,
        in_app_notifications: data.in_app_notifications,
        quiet_hours_start: data.quiet_hours_start || '',
        quiet_hours_end: data.quiet_hours_end || '',
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      const data = await apiClient.reminders.updatePreferences({
        ...formData,
        quiet_hours_start: formData.quiet_hours_start || null,
        quiet_hours_end: formData.quiet_hours_end || null,
      });

      setPreferences(data);
      setSuccessMessage('Reminder preferences updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reminder Settings</h2>

      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Enable Reminders */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-base font-medium text-gray-900">Enable Reminders</label>
            <p className="text-sm text-gray-500">Receive notifications for your tasks</p>
          </div>
          <input
            type="checkbox"
            checked={formData.enable_reminders}
            onChange={(e) => handleChange('enable_reminders', e.target.checked)}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reminder Timing</h3>

          {/* Remind Before Due */}
          <div className="mb-4">
            <label htmlFor="remind_before_due_minutes" className="block text-sm font-medium text-gray-700 mb-2">
              Remind me before due date
            </label>
            <select
              id="remind_before_due_minutes"
              value={formData.remind_before_due_minutes}
              onChange={(e) => handleChange('remind_before_due_minutes', parseInt(e.target.value))}
              disabled={!formData.enable_reminders || saving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 minutes before</option>
              <option value={30}>30 minutes before</option>
              <option value={60}>1 hour before</option>
              <option value={120}>2 hours before</option>
              <option value={1440}>1 day before</option>
            </select>
          </div>

          {/* Remind On Due Date */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="remind_on_due_date"
              checked={formData.remind_on_due_date}
              onChange={(e) => handleChange('remind_on_due_date', e.target.checked)}
              disabled={!formData.enable_reminders || saving}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remind_on_due_date" className="ml-2 text-sm text-gray-700">
              Remind me on the due date
            </label>
          </div>

          {/* Remind Overdue */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remind_overdue"
              checked={formData.remind_overdue}
              onChange={(e) => handleChange('remind_overdue', e.target.checked)}
              disabled={!formData.enable_reminders || saving}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remind_overdue" className="ml-2 text-sm text-gray-700">
              Remind me for overdue tasks
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>

          {/* Email Notifications */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="email_notifications"
              checked={formData.email_notifications}
              onChange={(e) => handleChange('email_notifications', e.target.checked)}
              disabled={!formData.enable_reminders || saving}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="email_notifications" className="ml-2 text-sm text-gray-700">
              Email notifications
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="push_notifications"
              checked={formData.push_notifications}
              onChange={(e) => handleChange('push_notifications', e.target.checked)}
              disabled={!formData.enable_reminders || saving}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="push_notifications" className="ml-2 text-sm text-gray-700">
              Push notifications (coming soon)
            </label>
          </div>

          {/* In-App Notifications */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="in_app_notifications"
              checked={formData.in_app_notifications}
              onChange={(e) => handleChange('in_app_notifications', e.target.checked)}
              disabled={!formData.enable_reminders || saving}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="in_app_notifications" className="ml-2 text-sm text-gray-700">
              In-app notifications
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quiet Hours</h3>
          <p className="text-sm text-gray-500 mb-4">Don't send notifications during these hours</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quiet_hours_start" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                id="quiet_hours_start"
                value={formData.quiet_hours_start}
                onChange={(e) => handleChange('quiet_hours_start', e.target.value)}
                disabled={!formData.enable_reminders || saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="quiet_hours_end" className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                id="quiet_hours_end"
                value={formData.quiet_hours_end}
                onChange={(e) => handleChange('quiet_hours_end', e.target.value)}
                disabled={!formData.enable_reminders || saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={saving || !formData.enable_reminders}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
