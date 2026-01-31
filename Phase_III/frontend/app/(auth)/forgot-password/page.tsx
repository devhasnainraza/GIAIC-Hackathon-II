import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Pure Tasks',
  description: 'Reset your password and regain access to your account',
};

/**
 * Forgot Password Page
 *
 * Allows users to request a password reset link
 */
export default function ForgotPasswordPage() {
  return (
    <AuthLayout type="signin">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
