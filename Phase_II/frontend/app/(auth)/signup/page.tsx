import { SignupForm } from '@/components/auth/SignupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account to start managing your tasks',
};

/**
 * Signup Page
 *
 * Public page for user registration
 * - Renders SignupForm component
 * - Uses auth layout (centered form)
 * - Redirects to /tasks on successful signup (handled by SignupForm)
 */
export default function SignupPage() {
  return <SignupForm />;
}
