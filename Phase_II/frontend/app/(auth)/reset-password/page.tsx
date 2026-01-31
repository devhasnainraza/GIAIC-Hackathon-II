import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Pure Tasks',
  description: 'Set a new password for your account',
};

/**
 * Reset Password Page
 *
 * Allows users to set a new password using a reset token
 */
export default function ResetPasswordPage() {
  return (
    <AuthLayout type="signin">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
