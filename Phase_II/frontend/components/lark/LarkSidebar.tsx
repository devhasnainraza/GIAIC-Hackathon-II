'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  User,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getUser } from '@/lib/auth';

interface LarkSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  width: number;
  isCollapsed: boolean;
  isResizing: boolean;
  onClose: () => void;
  onResizeStart: () => void;
  onToggleCollapse: () => void;
}

/**
 * Lark Base-inspired Resizable Sidebar
 * Features:
 * - Resizable (200-400px) with drag handle
 * - Collapsible to icon-only mode (64px)
 * - Smooth animations and hover states
 * - Tooltips in collapsed state
 */
export default function LarkSidebar({
  isOpen,
  isMobile,
  width,
  isCollapsed,
  isResizing,
  onClose,
  onResizeStart,
  onToggleCollapse
}: LarkSidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Get user only on client side to prevent hydration mismatch
  useEffect(() => {
    setUser(getUser());
  }, []);

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-white text-slate-900 transition-all duration-300 shadow-lg border-r border-slate-200 ${
          isMobile ? 'z-50' : 'z-10'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? '' : 'md:translate-x-0'}`}
        style={{
          width: isMobile ? '280px' : `${width}px`,
          transitionProperty: isResizing ? 'none' : 'all'
        }}
      >
        <div className="flex flex-col h-full relative">
          {/* Resize Handle - Desktop Only - Enhanced */}
          {!isMobile && !isCollapsed && (
            <div
              className="absolute right-0 top-0 bottom-0 w-[3px] group z-20"
              onMouseDown={onResizeStart}
              style={{ cursor: 'col-resize' }}
            >
              {/* Invisible hit area for easier grabbing */}
              <div className="absolute inset-y-0 -left-2 -right-2" />

              {/* Visual handle */}
              <div className={`absolute inset-0 bg-slate-200 transition-all duration-200 group-hover:bg-emerald-500 group-hover:w-[4px] ${
                isResizing ? 'bg-emerald-500 w-[4px] shadow-lg shadow-emerald-500/50' : ''
              }`}>
                {/* Grip indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Section - Logo & Close Button - Enhanced */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
            {!isCollapsed ? (
              <div className="transition-all duration-300 flex items-center">
                <Image
                  src="/full-logo.png"
                  alt="Pure Tasks"
                  width={150}
                  height={50}
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 overflow-hidden">
                  <Image
                    src="/brand-logo.PNG"
                    alt="Pure Tasks Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            {isMobile && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:rotate-90"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </div>

          {/* Navigation Items - Enhanced */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                        active
                          ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      {/* Active indicator - Enhanced */}
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-r-full shadow-md" />
                      )}

                      <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                        active ? 'text-emerald-600 scale-110' : 'group-hover:scale-110'
                      }`} />
                      {!isCollapsed && (
                        <span className="font-medium transition-all duration-200">{item.label}</span>
                      )}
                    </Link>

                    {/* Tooltip for collapsed state - Enhanced */}
                    {isCollapsed && hoveredItem === item.href && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-2xl whitespace-nowrap z-50 pointer-events-none animate-in fade-in slide-in-from-left-2 duration-200">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Bottom Section - Enhanced */}
          <div className="border-t border-slate-200 p-2 bg-slate-50/50">
            {/* Bottom Navigation */}
            <div className="space-y-1 mb-3">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                        active
                          ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <Icon className={`w-5 h-5 transition-all duration-200 ${
                        active ? 'text-emerald-600 scale-110' : 'group-hover:scale-110'
                      }`} />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </Link>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && hoveredItem === item.href && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-2xl whitespace-nowrap z-50 pointer-events-none animate-in fade-in slide-in-from-left-2 duration-200">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* User Info - Enhanced */}
            {user && !isCollapsed && (
              <div className="px-3 py-3 bg-slate-100 rounded-xl mb-2 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-200">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-full object-cover shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-100"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-100 ${user.avatar_url ? 'hidden' : ''}`}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.email.split('@')[0]}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Avatar in collapsed state - Enhanced */}
            {user && isCollapsed && (
              <div className="flex justify-center mb-2">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-100 hover:scale-110 transition-transform"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-100 hover:scale-110 transition-transform ${user.avatar_url ? 'hidden' : ''}`}>
                  {user.email.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Collapse/Expand Button - Desktop Only - Enhanced */}
            {!isMobile && (
              <button
                onClick={onToggleCollapse}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 group border border-slate-200 hover:border-emerald-200"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                ) : (
                  <>
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-sm font-medium">Collapse</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
