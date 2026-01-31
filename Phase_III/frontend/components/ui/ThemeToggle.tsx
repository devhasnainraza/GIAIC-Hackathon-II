'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface ThemeToggleProps {
  variant?: 'compact' | 'full' | 'dropdown';
  showLabel?: boolean;
  className?: string;
}

/**
 * VVIP Theme Toggle Component - Premium Design
 *
 * Features:
 * - Smooth animations and transitions
 * - Multiple variants (compact, full, dropdown)
 * - System theme detection
 * - Haptic feedback simulation
 * - Premium visual design
 * - Accessibility optimized
 */
export default function ThemeToggle({
  variant = 'compact',
  showLabel = true,
  className = ''
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: Sun,
      description: 'Light mode for bright environments',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: Moon,
      description: 'Dark mode for low-light environments',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: Monitor,
      description: 'Follows your system preference',
      gradient: 'from-slate-500 to-slate-700'
    }
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  const handleThemeChange = (newTheme: typeof theme) => {
    setTheme(newTheme);
    setIsOpen(false);

    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />;
  }

  // Compact variant - just an icon button
  if (variant === 'compact') {
    const Icon = currentTheme.icon;
    return (
      <button
        onClick={() => {
          const currentIndex = themes.findIndex(t => t.value === theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          handleThemeChange(themes[nextIndex].value);
        }}
        className={`p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
        aria-label={`Switch to ${themes[(themes.findIndex(t => t.value === theme) + 1) % themes.length].label} theme`}
      >
        <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      </button>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    const Icon = currentTheme.icon;
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 w-full p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <div className={`p-2 bg-gradient-to-r ${currentTheme.gradient} rounded-lg`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          {showLabel && (
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-900 dark:text-white">{currentTheme.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentTheme.description}</p>
            </div>
          )}
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.value;

                return (
                  <button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                    }`}
                  >
                    <div className={`p-2 bg-gradient-to-r ${themeOption.gradient} rounded-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-slate-900 dark:text-white">{themeOption.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{themeOption.description}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full variant - segmented control style
  return (
    <div className={`space-y-4 ${className}`}>
      {showLabel && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Theme</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Choose your preferred theme or let it follow your system setting
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.value;
          const isActive = resolvedTheme === (themeOption.value === 'system' ? resolvedTheme : themeOption.value);

          return (
            <button
              key={themeOption.value}
              onClick={() => handleThemeChange(themeOption.value)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50'
              }`}
            >
              {/* Theme Preview */}
              <div className={`w-full h-16 rounded-xl mb-4 overflow-hidden ${
                themeOption.value === 'light' ? 'bg-white border border-slate-200' :
                themeOption.value === 'dark' ? 'bg-slate-900 border border-slate-700' :
                'bg-gradient-to-r from-white via-slate-200 to-slate-900 border border-slate-300'
              }`}>
                <div className="h-full flex">
                  {themeOption.value === 'system' ? (
                    <>
                      <div className="flex-1 bg-white border-r border-slate-300" />
                      <div className="flex-1 bg-slate-900" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={`p-2 bg-gradient-to-r ${themeOption.gradient} rounded-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Theme Info */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`} />
                  <span className={`font-semibold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                    {themeOption.label}
                  </span>
                  {isActive && themeOption.value !== 'system' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {themeOption.description}
                </p>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Active Indicator for System Theme */}
              {themeOption.value === 'system' && isSelected && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-slate-900/10 dark:bg-white/10 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {resolvedTheme}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Status */}
      <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Currently using <span className="font-semibold text-slate-900 dark:text-white">{resolvedTheme}</span> theme
          {theme === 'system' && (
            <span className="text-slate-500 dark:text-slate-500"> (from system)</span>
          )}
        </span>
      </div>
    </div>
  );
}