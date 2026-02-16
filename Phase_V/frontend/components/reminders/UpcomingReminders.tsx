'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { apiClient } from '@/lib/api-client-optimized';

/**
 * UpcomingReminders Component
 *
 * Displays a list of upcoming reminders with:
 * - Reminder details (task title, remind time, type)
 * - Dismiss reminder action
 * - Filter by sent/dismissed status
 */

export interface Reminder {
  id: number;
  user_id: number;
  task_id: number;
  remind_at: string;
  reminder_type: string;
  notification_channels: string;
  is_sent: boolean;
  sent_at?: string;
  is_dismissed: boolean;
  created_at: string;
}

export function UpcomingReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'upcoming' | 'all'>('upcoming');

  // Fetch reminders
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = filter === 'upcoming'
        ? await apiClient.reminders.getUpcoming()
        : await apiClient.reminders.list();

      setReminders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [filter]);

  // Handle dismiss reminder
  const handleDismiss = async (id: number) => {
    try {
      await apiClient.reminders.dismiss(id);
      // Refresh reminders list
      fetchReminders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dismiss reminder');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMs < 0) {
      return 'Overdue';
    } else if (diffMins < 60) {
      return `In ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get reminder type badge color
  const getReminderTypeColor = (type: string) => {
    switch (type) {
      case 'due_today':
        return 'bg-yellow-100 text-yellow-800';
      case 'due_tomorrow':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'custom':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format reminder type
  const formatReminderType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
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
        <h2 className="text-2xl font-bold text-gray-900">Reminders</h2>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'upcoming' ? 'primary' : 'secondary'}
            onClick={() => setFilter('upcoming')}
            className="text-sm"
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
            className="text-sm"
          >
            All
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="text-gray-500 mt-4">
            {filter === 'upcoming' ? 'No upcoming reminders' : 'No reminders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                reminder.is_dismissed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getReminderTypeColor(reminder.reminder_type)}`}>
                      {formatReminderType(reminder.reminder_type)}
                    </span>
                    {reminder.is_sent && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Sent
                      </span>
                    )}
                    {reminder.is_dismissed && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Dismissed
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Task ID:</span> {reminder.task_id}
                  </p>

                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Remind at:</span>{' '}
                    {new Date(reminder.remind_at).toLocaleString()} ({formatDate(reminder.remind_at)})
                  </p>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Channels:</span>{' '}
                    {reminder.notification_channels.split(',').join(', ')}
                  </p>
                </div>

                {!reminder.is_dismissed && (
                  <Button
                    variant="secondary"
                    onClick={() => handleDismiss(reminder.id)}
                    className="text-sm ml-4"
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
