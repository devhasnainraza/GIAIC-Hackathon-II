'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, CheckSquare, Settings, HelpCircle, LogOut } from 'lucide-react';
import { getUser, logout } from '@/lib/auth';

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsOpen(false);
  };

  if (!user) return null;

  const menuItems = [
    { icon: User, label: 'My Profile', href: '/profile', color: 'text-purple-600' },
    { icon: CheckSquare, label: 'My Tasks', href: '/tasks', color: 'text-slate-600' },
    { icon: Settings, label: 'Settings', href: '/settings', color: 'text-slate-600' },
    { icon: HelpCircle, label: 'Help & Support', href: '/help', color: 'text-slate-600' },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group"
      >
        {/* Avatar */}
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 ${user.avatar_url ? 'hidden' : ''}`}>
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>

        {/* User Info (Desktop) */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">View Profile</p>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-scale-up">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 group"
                >
                  <IconComponent className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
