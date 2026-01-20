'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/api-client-optimized';

/**
 * Enhanced LogoutButton with Premium Sober Design
 * No gradients, using slate colors with amber accents
 */
export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await apiClient.auth.logout();
      router.push('/signin');
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Logout error:', error.message);
      } else {
        console.error('Unexpected logout error:', error);
      }
      router.push('/signin');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="group relative px-5 py-2.5 bg-slate-700/80 backdrop-blur-sm text-white rounded-lg font-medium transition-all duration-300 hover:bg-slate-600/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-slate-600/50"
    >
      {isLoggingOut ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </>
      )}
    </button>
  );
}
