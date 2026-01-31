/**
 * Notification Preferences Service
 * Manages user preferences for notifications
 */

export interface NotificationPreferences {
  // Notification Types
  enableDueToday: boolean;
  enableDueTomorrow: boolean;
  enableOverdue: boolean;
  enableTaskCompleted: boolean;
  enableTaskCreated: boolean;
  enableHighPriority: boolean;
  enableStatusChanged: boolean;

  // Behavior
  autoRefreshInterval: number; // in seconds (0 = disabled)
  soundEnabled: boolean;

  // Display
  showUnreadBadge: boolean;
  maxNotifications: number;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  // All notification types enabled by default
  enableDueToday: true,
  enableDueTomorrow: true,
  enableOverdue: true,
  enableTaskCompleted: true,
  enableTaskCreated: true,
  enableHighPriority: true,
  enableStatusChanged: true,

  // Behavior defaults
  autoRefreshInterval: 30, // 30 seconds
  soundEnabled: false,

  // Display defaults
  showUnreadBadge: true,
  maxNotifications: 50,
};

export class NotificationPreferencesService {
  private static STORAGE_KEY = 'notification_preferences';

  /**
   * Get notification preferences
   */
  static getPreferences(): NotificationPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return DEFAULT_PREFERENCES;

      const preferences = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      return { ...DEFAULT_PREFERENCES, ...preferences };
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  /**
   * Save notification preferences
   */
  static savePreferences(preferences: NotificationPreferences): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  }

  /**
   * Update a single preference
   */
  static updatePreference<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ): void {
    const preferences = this.getPreferences();
    preferences[key] = value;
    this.savePreferences(preferences);
  }

  /**
   * Reset to default preferences
   */
  static resetToDefaults(): void {
    this.savePreferences(DEFAULT_PREFERENCES);
  }

  /**
   * Check if a notification type is enabled
   */
  static isNotificationTypeEnabled(type: string): boolean {
    const preferences = this.getPreferences();

    switch (type) {
      case 'due_today':
        return preferences.enableDueToday;
      case 'due_tomorrow':
        return preferences.enableDueTomorrow;
      case 'overdue':
        return preferences.enableOverdue;
      case 'task_completed':
        return preferences.enableTaskCompleted;
      case 'task_created':
        return preferences.enableTaskCreated;
      case 'high_priority':
        return preferences.enableHighPriority;
      case 'status_changed':
        return preferences.enableStatusChanged;
      default:
        return true;
    }
  }
}

export default NotificationPreferencesService;
