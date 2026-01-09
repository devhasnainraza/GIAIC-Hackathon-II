import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in or sign up to manage your tasks',
};

/**
 * Auth Layout
 *
 * Layout for authentication pages (signin, signup)
 * - Centered form container
 * - No header or navigation
 * - Clean, minimal design
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
