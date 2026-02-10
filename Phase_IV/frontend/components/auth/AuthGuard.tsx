'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, getUser } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard Component
 *
 * Protects routes by checking for valid authentication token
 * - Redirects to /signin if not authenticated
 * - Shows loading state while checking auth
 * - Persists authentication across page refreshes
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const user = getUser();

      // Check if user has valid token and user data
      if (!token || !user) {
        // Save current path to redirect back after login
        const redirectPath = pathname !== '/signin' && pathname !== '/signup'
          ? pathname
          : '/dashboard';

        router.push(`/signin?redirect=${encodeURIComponent(redirectPath)}`);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
