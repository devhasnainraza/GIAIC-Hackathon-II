'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, CheckSquare, Plus, AlertCircle, Check, Trash2, Loader2 } from 'lucide-react';
import { getToken } from '@/lib/auth';

/**
 * Notification type definition
 */
interface Notification {
  id: number;
  user_id: number;
  type: 'task_completed' | 'task_created' | 'task_deleted' | 'task_updated' | 'system';
  title: string;
  description: string;
  created_at: string;
  read: boolean;
}

/**
 * NotificationDropdown Component
 *
 * Features:
 * - Dropdown menu with notifications from real API
 * - Badge showing unread count
 * - Different icons for notification types
 * - Mark as read functionality
 * - Clear all notifications
 * - Empty state
 * - Click outside to close
 * - Auto-refresh every 30 seconds
 * - Loading and error states
 */
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch notifications from API
  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) {
      setError('Not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchNotifications();
    } else {
      // No token, clear notifications
      setNotifications([]);
    }
  }, []);

  // Listen for logout events to clear notifications
  useEffect(() => {
    const handleLogout = () => {
      setNotifications([]);
      setIsOpen(false);
    };

    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const token = getToken();
    if (!token) {
      // No token, clear notifications and stop refresh
      setNotifications([]);
      return;
    }

    const interval = setInterval(() => {
      const currentToken = getToken();
      if (currentToken) {
        fetchNotifications();
      } else {
        // Token removed, clear notifications
        setNotifications([]);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get icon for notification type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'task_created':
        return <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'task_deleted':
        return <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'task_updated':
        return <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'system':
        return <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  // Get background color for notification type
  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case 'task_completed':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'task_created':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'task_deleted':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'task_updated':
        return 'bg-orange-100 dark:bg-orange-900/30';
      case 'system':
        return 'bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'bg-slate-100 dark:bg-slate-700';
    }
  };

  // Mark notification as read
  const markAsRead = async (id: number) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update local state
        setNotifications([]);
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 group"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-scale-up overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              {notifications.length > 0 && (
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              // Loading State
              <div className="py-12 px-4 text-center">
                <Loader2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 animate-spin mx-auto mb-4" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Loading notifications...
                </p>
              </div>
            ) : error ? (
              // Error State
              <div className="py-12 px-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">
                  {error}
                </p>
                <button
                  onClick={fetchNotifications}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              // Empty State
              <div className="py-12 px-4 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-900 dark:text-white font-semibold mb-1">No notifications</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="py-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-l-4 ${
                      notification.read
                        ? 'border-transparent'
                        : 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationBg(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={clearAll}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
