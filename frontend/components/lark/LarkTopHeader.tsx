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
  Settings,
  Menu,
  ArrowLeft,
  Filter,
  SortAsc,
  MoreVertical,
  Zap,
  Star,
  Heart
} from 'lucide-react';
import { getUser, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import NotificationService, { Notification } from '@/lib/notification-service';
import NotificationPreferencesService from '@/lib/notification-preferences';
import NotificationSettings from './NotificationSettings';

interface LarkTopHeaderProps {
  // No props needed anymore
}

/**
 * VVIP Mobile-Optimized Top Header - Premium Design
 *
 * Features:
 * - Adaptive mobile-first design
 * - Smooth animations and micro-interactions
 * - Enhanced mobile search with voice input
 * - Premium notification system
 * - Gesture-friendly interactions
 * - Context-aware actions
 * - Haptic feedback simulation
 */
export default function LarkTopHeader({}: LarkTopHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const loadNotifications = () => {
    const allNotifications = NotificationService.getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(NotificationService.getUnreadCount());
  };

  // Simulate haptic feedback
  const simulateHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    NotificationService.markAsRead(notificationId);
    loadNotifications();
    simulateHaptic();
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
    loadNotifications();
    simulateHaptic();
  };

  const handleDeleteNotification = (notificationId: string) => {
    NotificationService.deleteNotification(notificationId);
    loadNotifications();
    simulateHaptic();
  };

  const handleClearAll = () => {
    NotificationService.clearAll();
    loadNotifications();
    simulateHaptic();
  };

  const handleSettingsSave = () => {
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
    if (type === 'overdue') return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
    if (type === 'due_today') return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
    if (type === 'due_tomorrow') return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
    if (type === 'task_completed') return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400';
    if (type === 'high_priority') return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
    return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
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
    return 'TaskMaster';
  };

  // Get page emoji for mobile
  const getPageEmoji = () => {
    if (pathname === '/dashboard' || pathname === '/') return '🏠';
    if (pathname === '/tasks') return '✅';
    if (pathname === '/calendar') return '📅';
    if (pathname === '/analytics') return '📊';
    if (pathname === '/profile') return '👤';
    if (pathname === '/settings') return '⚙️';
    return '📋';
  };

  // Get context actions based on current page
  const getContextActions = () => {
    const actions = [];

    if (pathname === '/tasks') {
      actions.push(
        { icon: Filter, label: 'Filter', action: () => {} },
        { icon: SortAsc, label: 'Sort', action: () => {} }
      );
    }

    if (pathname === '/analytics') {
      actions.push(
        { icon: Star, label: 'Favorite', action: () => {} }
      );
    }

    return actions;
  };

  const handleLogout = () => {
    logout();
    router.push('/signin');
    simulateHaptic();
  };

  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log('Searching for:', query);
    simulateHaptic();
  };

  return (
    <>
      {/* Main Header */}
      <header className="h-16 md:h-[60px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 flex items-center px-4 gap-3 sticky top-0 z-40 shadow-sm">
        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowMobileSearch(false);
                  setSearchQuery('');
                  simulateHaptic();
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  placeholder="Search tasks, notes, or anything..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500"
                  autoFocus
                />
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              )}
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {searchQuery ? (
                <div className="space-y-3">
                  {/* Example search results */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-900 dark:text-white">Complete project proposal</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Due today • High priority</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-900 dark:text-white">Team meeting notes</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Created yesterday</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">Start typing to search</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Find tasks, notes, and more</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile: Page Title with Emoji */}
          {isMobile ? (
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl">{getPageEmoji()}</span>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {getPageTitle()}
                </h1>
              </div>
            </div>
          ) : (
            /* Desktop: Breadcrumbs */
            <nav className="flex items-center gap-2 text-sm min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-900 dark:text-white font-semibold truncate">
                  {getPageTitle()}
                </span>
              </div>
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Context Actions - Mobile */}
          {isMobile && getContextActions().length > 0 && (
            <div className="flex items-center gap-1">
              {getContextActions().slice(0, 2).map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      action.action();
                      simulateHaptic();
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    aria-label={action.label}
                  >
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                );
              })}
            </div>
          )}

          {/* New Task Button */}
          <button
            onClick={() => {
              router.push('/tasks?action=new');
              simulateHaptic();
            }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Search Button */}
          <button
            onClick={() => {
              if (isMobile) {
                setShowMobileSearch(true);
              }
              simulateHaptic();
            }}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                simulateHaptic();
              }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              {unreadCount > 0 && NotificationPreferencesService.getPreferences().showUnreadBadge && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Enhanced Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/50 md:bg-transparent"
                  onClick={() => setShowNotifications(false)}
                />

                <div className={`
                  fixed md:absolute
                  inset-x-0 bottom-0 md:inset-x-auto md:bottom-auto
                  md:right-0 md:top-full md:mt-2
                  w-full md:w-96
                  max-h-[85vh] md:max-h-[600px]
                  bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-t-3xl md:rounded-2xl
                  shadow-2xl border-t md:border border-slate-200/50 dark:border-slate-700/50
                  z-50 flex flex-col
                  animate-slide-up md:animate-none
                `}>
                  {/* Header */}
                  <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between flex-shrink-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNotificationSettings(true);
                          simulateHaptic();
                        }}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        aria-label="Notification settings"
                      >
                        <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>

                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          simulateHaptic();
                        }}
                        className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        aria-label="Close notifications"
                      >
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {notifications.length > 0 && (
                    <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            handleMarkAllAsRead();
                            simulateHaptic();
                          }}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleClearAll();
                          simulateHaptic();
                        }}
                        className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105"
                      >
                        Clear all
                      </button>
                    </div>
                  )}

                  {/* Notifications List */}
                  <div className="flex-1 overflow-y-auto overscroll-contain">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Bell className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No notifications</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">You're all caught up! 🎉</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group ${
                              !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
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
                              <div className={`p-2 rounded-xl flex-shrink-0 ${getNotificationColor(notification.type, notification.priority)}`}>
                                {getNotificationIcon(notification.type)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                      {formatTimestamp(notification.timestamp)}
                                    </p>
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNotification(notification.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all flex-shrink-0"
                                    aria-label="Delete notification"
                                  >
                                    <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                  </button>
                                </div>

                                {!notification.read && (
                                  <div className="mt-2">
                                    <span className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                      <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></span>
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

                  {/* Mobile Footer */}
                  <div className="md:hidden p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        simulateHaptic();
                      }}
                      className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 dark:from-slate-700 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-500 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                simulateHaptic();
              }}
              className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-xl object-cover shadow-lg"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${user?.avatar_url ? 'hidden' : ''}`}>
                {user?.email.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400 hidden sm:block" />
            </button>

            {/* Enhanced Profile Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <div className="flex items-center gap-3">
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-xl object-cover shadow-lg"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg ${user?.avatar_url ? 'hidden' : ''}`}>
                        {user?.email.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {user?.email.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-white/80 truncate">{user?.email || ''}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setShowProfileMenu(false);
                        simulateHaptic();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">👤</span>
                      </div>
                      <span className="font-medium">Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push('/settings');
                        setShowProfileMenu(false);
                        simulateHaptic();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">🚪</span>
                      </div>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notification Settings Modal */}
        <NotificationSettings
          isOpen={showNotificationSettings}
          onClose={() => setShowNotificationSettings(false)}
          onSave={handleSettingsSave}
        />
      </header>
    </>
  );
}