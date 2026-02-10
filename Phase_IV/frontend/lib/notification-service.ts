import { Task } from './types';
import NotificationPreferencesService from './notification-preferences';

/**
 * Notification Types
 */
export type NotificationType =
  | 'due_today'
  | 'due_tomorrow'
  | 'overdue'
  | 'task_completed'
  | 'task_created'
  | 'high_priority'
  | 'status_changed';

/**
 * Notification Interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  taskId?: number;
  taskTitle?: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Notification Service
 * Generates and manages notifications for tasks
 */
export class NotificationService {
  private static STORAGE_KEY = 'task_notifications';
  private static MAX_NOTIFICATIONS = 50;

  /**
   * Get all notifications from localStorage
   */
  static getNotifications(): Notification[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Save notifications to localStorage
   */
  private static saveNotifications(notifications: Notification[]): void {
    if (typeof window === 'undefined') return;

    try {
      // Keep only the most recent notifications
      const limited = notifications.slice(0, this.MAX_NOTIFICATIONS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  /**
   * Add a new notification
   */
  static addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    // Check if this notification type is enabled
    if (!NotificationPreferencesService.isNotificationTypeEnabled(notification.type)) {
      return; // Skip if disabled
    }

    const notifications = this.getNotifications();
    const preferences = NotificationPreferencesService.getPreferences();

    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    notifications.unshift(newNotification);

    // Limit to max notifications from preferences
    const limited = notifications.slice(0, preferences.maxNotifications);
    this.saveNotifications(limited);
  }

  /**
   * Mark notification as read
   */
  static markAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.saveNotifications(updated);
  }

  /**
   * Mark all notifications as read
   */
  static markAllAsRead(): void {
    const notifications = this.getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
  }

  /**
   * Delete a notification
   */
  static deleteNotification(notificationId: string): void {
    const notifications = this.getNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    this.saveNotifications(filtered);
  }

  /**
   * Clear all notifications
   */
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get unread notification count
   */
  static getUnreadCount(): number {
    const notifications = this.getNotifications();
    return notifications.filter(n => !n.read).length;
  }

  /**
   * Generate notifications from tasks
   * Checks for due dates, overdue tasks, high priority tasks, etc.
   */
  static generateNotificationsFromTasks(tasks: Task[]): void {
    if (!tasks || tasks.length === 0) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get existing notifications to avoid duplicates
    const existingNotifications = this.getNotifications();
    const existingTaskIds = new Set(
      existingNotifications
        .filter(n => n.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .map(n => `${n.type}_${n.taskId}`)
    );

    tasks.forEach(task => {
      if (!task.due_date) return;

      const dueDate = new Date(task.due_date);
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      // Check for overdue tasks (not completed)
      if (!task.is_complete && dueDateOnly < today) {
        const key = `overdue_${task.id}`;
        if (!existingTaskIds.has(key)) {
          const daysOverdue = Math.floor((today.getTime() - dueDateOnly.getTime()) / (1000 * 60 * 60 * 24));
          this.addNotification({
            type: 'overdue',
            title: 'Task Overdue',
            message: `"${task.title}" is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`,
            taskId: task.id,
            taskTitle: task.title,
            priority: 'high',
          });
        }
      }

      // Check for tasks due today (not completed)
      if (!task.is_complete && dueDateOnly.getTime() === today.getTime()) {
        const key = `due_today_${task.id}`;
        if (!existingTaskIds.has(key)) {
          this.addNotification({
            type: 'due_today',
            title: 'Task Due Today',
            message: `"${task.title}" is due today`,
            taskId: task.id,
            taskTitle: task.title,
            priority: 'high',
          });
        }
      }

      // Check for tasks due tomorrow (not completed)
      if (!task.is_complete && dueDateOnly.getTime() === tomorrow.getTime()) {
        const key = `due_tomorrow_${task.id}`;
        if (!existingTaskIds.has(key)) {
          this.addNotification({
            type: 'due_tomorrow',
            title: 'Task Due Tomorrow',
            message: `"${task.title}" is due tomorrow`,
            taskId: task.id,
            taskTitle: task.title,
            priority: 'medium',
          });
        }
      }

      // Check for high priority tasks that are not completed
      if (!task.is_complete && (task.priority === 'high' || task.priority === 'urgent')) {
        const key = `high_priority_${task.id}`;
        if (!existingTaskIds.has(key)) {
          this.addNotification({
            type: 'high_priority',
            title: 'High Priority Task',
            message: `"${task.title}" requires your attention`,
            taskId: task.id,
            taskTitle: task.title,
            priority: task.priority === 'urgent' ? 'high' : 'medium',
          });
        }
      }
    });
  }

  /**
   * Notify when a task is completed
   */
  static notifyTaskCompleted(task: Task): void {
    this.addNotification({
      type: 'task_completed',
      title: 'Task Completed',
      message: `You completed "${task.title}"`,
      taskId: task.id,
      taskTitle: task.title,
      priority: 'low',
    });
  }

  /**
   * Notify when a task is created
   */
  static notifyTaskCreated(task: Task): void {
    this.addNotification({
      type: 'task_created',
      title: 'Task Created',
      message: `New task "${task.title}" has been created`,
      taskId: task.id,
      taskTitle: task.title,
      priority: 'low',
    });
  }

  /**
   * Notify when task status changes
   */
  static notifyStatusChanged(task: Task, oldStatus: string, newStatus: string): void {
    this.addNotification({
      type: 'status_changed',
      title: 'Status Changed',
      message: `"${task.title}" moved from ${oldStatus} to ${newStatus}`,
      taskId: task.id,
      taskTitle: task.title,
      priority: 'low',
    });
  }
}

export default NotificationService;
