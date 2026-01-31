'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, Search, Bell, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import UserMenu from './UserMenu';
import NotificationDropdown from './NotificationDropdown';
import SearchModal from './SearchModal';
import { getUser, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

/**
 * Premium Navigation Component
 *
 * Features:
 * - Glass morphism effect with backdrop blur
 * - Smooth shadow on scroll
 * - Mobile responsive with hamburger menu
 * - Active route highlighting
 * - Smooth transitions and animations
 * - Search and notifications icons
 * - User profile dropdown with lucide-react icons
 */
export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get user state
  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  // Handle scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const mobileMenuItems = [
    { icon: User, label: 'My Profile', href: '/profile', color: 'text-purple-600' },
    { icon: Settings, label: 'Settings', href: '/settings', color: 'text-slate-600' },
    { icon: HelpCircle, label: 'Help & Support', href: '/help', color: 'text-slate-600' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-700/50'
            : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/30 dark:border-slate-700/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-700 dark:to-slate-600 rounded-xl p-2.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Pure Tasks
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Stay organized
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActiveRoute(link.href)
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      {link.label}
                    </span>
                    {isActiveRoute(link.href) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side: Search, Notifications, User Menu & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Search Button - Always visible */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 group"
                aria-label="Search"
                title="Search (Cmd/Ctrl + K)"
              >
                <Search className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* Notifications Dropdown - Always visible */}
              <NotificationDropdown />

              {/* UserMenu - Desktop only */}
              <div className="hidden md:block">
                <UserMenu />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed top-16 right-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-40 md:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          {/* User Profile Section at Top */}
          {user && (
            <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1 mb-4">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActiveRoute(link.href)
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{link.label}</span>
                  {isActiveRoute(link.href) && (
                    <span className="ml-auto w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>

          {/* Additional Menu Items */}
          <div className="space-y-1 mb-4">
            {mobileMenuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <IconComponent className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-16" />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
