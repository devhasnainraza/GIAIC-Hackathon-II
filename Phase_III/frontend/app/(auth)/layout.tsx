import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in or sign up to manage your tasks',
};

/**
 * Auth Layout
 *
 * Simple pass-through layout for authentication pages.
 * The actual layout styling is handled by the AuthLayout component
 * to enable full-screen split design.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
