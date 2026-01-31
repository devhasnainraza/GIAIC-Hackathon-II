'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Bell, Clock, CheckCircle, AlertCircle, Flag, TrendingUp, Plus } from 'lucide-react';
import NotificationPreferencesService, { NotificationPreferences } from '@/lib/notification-preferences';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

/**
 * Notification Settings Component
 * Allows users to customize their notification preferences
 */
export default function NotificationSettings({ isOpen, onClose, onSave }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    NotificationPreferencesService.getPreferences()
  );

  useEffect(() => {
    if (isOpen) {
      setPreferences(NotificationPreferencesService.getPreferences());
    }
  }, [isOpen]);

  const handleSave = () => {
    NotificationPreferencesService.savePreferences(preferences);
    onSave();
    onClose();
  };

  const handleReset = () => {
    NotificationPreferencesService.resetToDefaults();
    setPreferences(NotificationPreferencesService.getPreferences());
  };

  const updatePreference = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* Settings Panel */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 w-auto md:w-[500px] max-h-[90vh] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900">Notification Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Notification Types */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Notification Types</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Due Today</p>
                    <p className="text-xs text-slate-500">Tasks due today</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enableDueToday}
                  onChange={(e) => updatePreference('enableDueToday', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Due Tomorrow</p>
                    <p className="text-xs text-slate-500">Tasks due tomorrow</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enableDueTomorrow}
                  onChange={(e) => updatePreference('enableDueTomorrow', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Overdue</p>
                    <p className="text-xs text-slate-500">Tasks past due date</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enableOverdue}
                  onChange={(e) => updatePreference('enableOverdue', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Task Completed</p>
                    <p className="text-xs text-slate-500">When tasks are completed</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enableTaskCompleted}
                  onChange={(e) => updatePreference('enableTaskCompleted', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Task Created</p>
                    <p className="text-xs text-slate-500">When new tasks are created</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enableTaskCreated}
                  onChange={(e) => updatePreference('enableTaskCreated', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Flag className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">High Priority</p>
                    <p className="text-xs text-slate-500">High/urgent priority tasks</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enableHighPriority}
                  onChange={(e) => updatePreference('enableHighPriority', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Status Changed</p>
                    <p className="text-xs text-slate-500">When task status changes</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enableStatusChanged}
                  onChange={(e) => updatePreference('enableStatusChanged', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>

          {/* Behavior Settings */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Behavior</h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <label className="block">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-900">Auto-refresh Interval</p>
                    <span className="text-xs text-slate-500">
                      {preferences.autoRefreshInterval === 0 ? 'Disabled' : `${preferences.autoRefreshInterval}s`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="10"
                    value={preferences.autoRefreshInterval}
                    onChange={(e) => updatePreference('autoRefreshInterval', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Off</span>
                    <span>30s</span>
                    <span>60s</span>
                    <span>120s</span>
                  </div>
                </label>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <label className="block">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-900">Max Notifications</p>
                    <span className="text-xs text-slate-500">{preferences.maxNotifications}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={preferences.maxNotifications}
                    onChange={(e) => updatePreference('maxNotifications', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>10</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Display</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Show Unread Badge</p>
                    <p className="text-xs text-slate-500">Display unread count on bell icon</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.showUnreadBadge}
                  onChange={(e) => updatePreference('showUnreadBadge', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
