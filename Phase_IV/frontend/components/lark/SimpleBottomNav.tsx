'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, Calendar, BarChart3, User } from 'lucide-react';

/**
 * Mobile Bottom Navigation - Clean Lark Base Style
 * Only working features
 */
export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Home',
    },
    {
      href: '/tasks',
      icon: CheckSquare,
      label: 'Tasks',
    },
    {
      href: '/calendar',
      icon: Calendar,
      label: 'Calendar',
    },
    {
      href: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
    },
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-emerald-500 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}