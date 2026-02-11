'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Flag,
  TrendingUp,
  X,
  Settings
} from 'lucide-react';
import { getUser, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import NotificationService, { Notification } from '@/lib/notification-service';
import NotificationPreferencesService from '@/lib/notification-preferences';
import NotificationSettings from './NotificationSettings';
import SearchModal from '@/components/ui/SearchModal';

interface LarkTopHeaderProps {
  // No props needed anymore
}

/**
 * Lark Base-inspired Top Header - Clean & Professional
 */
export default function LarkTopHeader({}: LarkTopHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications on mount and set up refresh interval
  useEffect(() => {
    loadNotifications();

    // Get refresh interval from preferences
    const preferences = NotificationPreferencesService.getPreferences();

    if (preferences.autoRefreshInterval > 0) {
      const interval = setInterval(loadNotifications, preferences.autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, []);

  // Handle keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadNotifications = () => {
    const allNotifications = NotificationService.getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(NotificationService.getUnreadCount());
  };

  const handleMarkAsRead = (notificationId: string) => {
    NotificationService.markAsRead(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
    loadNotifications();
  };

  const handleDeleteNotification = (notificationId: string) => {
    NotificationService.deleteNotification(notificationId);
    loadNotifications();
  };

  const handleClearAll = () => {
    NotificationService.clearAll();
    loadNotifications();
  };

  const handleSettingsSave = () => {
    // Reload notifications after settings change
    loadNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'due_today':
      case 'due_tomorrow':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'task_completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'high_priority':
        return <Flag className="w-4 h-4" />;
      case 'status_changed':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (type === 'overdue') return 'text-red-600 bg-red-50';
    if (type === 'due_today') return 'text-orange-600 bg-orange-50';
    if (type === 'due_tomorrow') return 'text-amber-600 bg-amber-50';
    if (type === 'task_completed') return 'text-emerald-600 bg-emerald-50';
    if (type === 'high_priority') return 'text-purple-600 bg-purple-50';
    return 'text-blue-600 bg-blue-50';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
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

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard' || pathname === '/') return 'Dashboard';
    if (pathname === '/tasks') return 'Tasks';
    if (pathname === '/calendar') return 'Calendar';
    if (pathname === '/analytics') return 'Analytics';
    if (pathname === '/profile') return 'Profile';
    if (pathname === '/settings') return 'Settings';
    return 'Pure Tasks';
  };

  // Get breadcrumbs
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return ['Home'];
    return ['Home', ...parts.map(part => part.charAt(0).toUpperCase() + part.slice(1))];
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-30 shadow-sm">
      {/* Left Section - Breadcrumbs */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm min-w-0">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-400">/</span>}
              <span
                className={`truncate ${
                  index === breadcrumbs.length - 1
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {crumb}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* New Task Button */}
        <button
          onClick={() => router.push('/tasks?action=new')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Search Button */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Search"
          title="Search (Cmd/Ctrl + K)"
        >
          <Search className="w-5 h-5 text-slate-600" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && NotificationPreferencesService.getPreferences().showUnreadBadge && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown - Responsive */}
          {showNotifications && (
            <>
              {/* Overlay - Full screen on mobile, partial on desktop */}
              <div
                className="fixed inset-0 z-40 bg-black/50 md:bg-transparent"
                onClick={() => setShowNotifications(false)}
              />

              {/* Notification Panel - Full screen on mobile, dropdown on desktop */}
              <div className={`
                fixed md:absolute
                inset-x-0 bottom-0 md:inset-x-auto md:bottom-auto
                md:right-0 md:top-full md:mt-2
                w-full md:w-96
                max-h-[85vh] md:max-h-[600px]
                bg-white rounded-t-3xl md:rounded-xl
                shadow-2xl border-t md:border border-slate-200
                z-50 flex flex-col
                animate-slide-up md:animate-none
              `}>
                {/* Header */}
                <div className="p-4 md:p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-base md:text-base">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <p className="text-xs text-slate-500 mt-0.5">{unreadCount} unread</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Settings Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNotificationSettings(true);
                      }}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                      aria-label="Notification settings"
                      title="Notification settings"
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                    </button>

                    {notifications.length > 0 && (
                      <>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1 hover:bg-emerald-50 rounded transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={handleClearAll}
                          className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                        >
                          Clear all
                        </button>
                      </>
                    )}
                    {/* Close button - Mobile only */}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                      aria-label="Close notifications"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Notifications List - Scrollable */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  {notifications.length === 0 ? (
                    <div className="p-8 md:p-8 text-center">
                      <Bell className="w-12 h-12 md:w-12 md:h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm font-medium">No notifications</p>
                      <p className="text-slate-400 text-xs mt-1">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 md:p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                          onClick={() => {
                            if (!notification.read) {
                              handleMarkAsRead(notification.id);
                            }
                            if (notification.taskId) {
                              router.push(`/tasks?taskId=${notification.taskId}`);
                              setShowNotifications(false);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className={`p-2 rounded-lg flex-shrink-0 ${getNotificationColor(notification.type, notification.priority)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-900 truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    {formatTimestamp(notification.timestamp)}
                                  </p>
                                </div>

                                {/* Delete Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all flex-shrink-0"
                                  aria-label="Delete notification"
                                >
                                  <X className="w-4 h-4 text-slate-500" />
                                </button>
                              </div>

                              {/* Unread Indicator */}
                              {!notification.read && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                    Unread
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer - Mobile only */}
                <div className="md:hidden p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notification Settings Modal */}
        <NotificationSettings
          isOpen={showNotificationSettings}
          onClose={() => setShowNotificationSettings(false)}
          onSave={handleSettingsSave}
        />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover shadow-lg shadow-emerald-500/30"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 ${user?.avatar_url ? 'hidden' : ''}`}>
              {user?.email.charAt(0).toUpperCase() || 'U'}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-600 hidden sm:block" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
                <div className="p-3 border-b border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover shadow-lg"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ${user?.avatar_url ? 'hidden' : ''}`}>
                      {user?.email.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <p className="font-medium text-slate-900 truncate">
                    {user?.email.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      router.push('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push('/settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Settings
                  </button>
                </div>
                <div className="border-t border-slate-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </header>
  );
}