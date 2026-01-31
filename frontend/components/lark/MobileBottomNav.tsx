'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  User,
  Plus,
  Zap,
  Bell,
  Search
} from 'lucide-react';

/**
 * VVIP Mobile Bottom Navigation - Premium Design
 *
 * Features:
 * - Smooth animations and micro-interactions
 * - Haptic feedback simulation
 * - Premium visual design with gradients
 * - Floating action button
 * - Badge notifications
 * - Gesture-friendly touch targets
 * - Accessibility optimized
 */
export default function MobileBottomNav() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide/show navigation based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide when scrolling down
      } else {
        setIsVisible(true); // Show when scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Home',
      badge: null,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      href: '/tasks',
      icon: CheckSquare,
      label: 'Tasks',
      badge: 3, // Example badge count
      color: 'from-emerald-500 to-teal-600'
    },
    {
      href: '/calendar',
      icon: Calendar,
      label: 'Calendar',
      badge: null,
      color: 'from-purple-500 to-pink-600'
    },
    {
      href: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
      badge: null,
      color: 'from-orange-500 to-red-600'
    },
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
      badge: null,
      color: 'from-slate-600 to-slate-800'
    },
  ];

  // Update active index based on current path
  useEffect(() => {
    const currentIndex = navItems.findIndex(item =>
      pathname === item.href || pathname.startsWith(item.href + '/')
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname]);

  // Simulate haptic feedback
  const simulateHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10); // Very short vibration
    }
  };

  return (
    <>
      {/* Premium Mobile Bottom Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50" />

        {/* Active indicator background */}
        <div
          className="absolute top-0 h-1 bg-gradient-to-r transition-all duration-500 ease-out rounded-full"
          style={{
            left: `${(activeIndex * 20)}%`,
            width: '20%',
            background: `linear-gradient(to right, ${navItems[activeIndex]?.color.replace('from-', '').replace('to-', ', ')})`
          }}
        />

        <div className="relative flex items-center justify-around h-20 px-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={simulateHaptic}
                className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300 group ${
                  isActive ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                {/* Icon container with premium styling */}
                <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} shadow-lg shadow-black/20`
                    : 'bg-transparent group-hover:bg-slate-100 dark:group-hover:bg-slate-800/50'
                }`}>
                  <Icon
                    className={`w-6 h-6 transition-all duration-300 ${
                      isActive
                        ? 'text-white stroke-[2.5] drop-shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 stroke-2'
                    }`}
                  />

                  {/* Badge notification */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {item.badge > 9 ? '9+' : item.badge}
                    </div>
                  )}

                  {/* Active glow effect */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-20 animate-pulse`} />
                  )}
                </div>

                {/* Label with enhanced typography */}
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                }`}>
                  {item.label}
                </span>

                {/* Ripple effect on tap */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-active:translate-x-full transition-transform duration-500" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Premium shadow effect */}
        <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </nav>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          simulateHaptic();
          // Handle FAB action - could open quick add modal
        }}
        className={`fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-110 active:scale-95 z-40 md:hidden ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <Plus className="w-6 h-6 mx-auto" />

        {/* FAB glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-50 animate-pulse" />
      </button>

      {/* Quick Actions Panel (Hidden by default, can be toggled) */}
      <div className="fixed bottom-24 right-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-4 z-30 md:hidden opacity-0 pointer-events-none transition-all duration-300">
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:scale-105 transition-transform duration-200">
            <CheckSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Add Task</span>
          </button>
          <button className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:scale-105 transition-transform duration-200">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Schedule</span>
          </button>
          <button className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white hover:scale-105 transition-transform duration-200">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">Quick Note</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Slide down from top) */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 p-4 z-40 md:hidden transform -translate-y-full transition-transform duration-300">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, notes, or anything..."
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500"
            />
          </div>
          <button className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:scale-105 transition-transform duration-200">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Notification Panel */}
      <div className="fixed top-0 right-0 w-80 max-w-[90vw] h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-white/20 dark:border-slate-700/50 z-50 md:hidden transform translate-x-full transition-transform duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Example notifications */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Task reminder</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Complete project proposal by 5 PM</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Achievement unlocked</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">7-day streak completed! 🔥</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gesture hint for first-time users */}
      <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-medium z-30 md:hidden opacity-0 pointer-events-none transition-opacity duration-300">
        Swipe up for quick actions
      </div>
    </>
  );
}