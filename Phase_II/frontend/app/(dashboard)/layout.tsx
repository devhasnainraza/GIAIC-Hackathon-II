import { Suspense } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import LarkLayout from '@/components/lark/LarkLayout';

// Disable static generation for authenticated dashboard pages
export const dynamic = 'force-dynamic';

/**
 * Simple Dashboard Layout - Clean Design
 *
 * Features:
 * - Simple imports for better reliability
 * - Clean loading states
 * - Protected by AuthGuard
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      }>
        <LarkLayout>
          {children}
        </LarkLayout>
      </Suspense>
    </AuthGuard>
  );
}
