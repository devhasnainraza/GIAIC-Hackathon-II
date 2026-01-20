import { SigninForm } from '@/components/auth/SigninForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Pure Tasks',
  description: 'Sign in to access your tasks and boost your productivity',
};

/**
 * Signin Page with Full-Screen Split Layout
 *
 * Features:
 * - Left side: Sign in form
 * - Right side: Branding and features (Lark Base / Slack style)
 * - Responsive design (mobile shows only form)
 * - Redirects to /tasks on successful signin
 */
export default function SigninPage() {
  return (
    <AuthLayout type="signin">
      <SigninForm />
    </AuthLayout>
  );
}
