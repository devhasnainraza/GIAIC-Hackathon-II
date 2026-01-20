import { SignupForm } from '@/components/auth/SignupForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Pure Tasks',
  description: 'Create a new account and start managing your tasks efficiently',
};

/**
 * Signup Page with Full-Screen Split Layout
 *
 * Features:
 * - Left side: Sign up form
 * - Right side: Branding and features (Lark Base / Slack style)
 * - Responsive design (mobile shows only form)
 * - Redirects to /tasks on successful signup
 */
export default function SignupPage() {
  return (
    <AuthLayout type="signup">
      <SignupForm />
    </AuthLayout>
  );
}
