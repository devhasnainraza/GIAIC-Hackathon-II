import { SigninForm } from '@/components/auth/SigninForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to access your tasks',
};

/**
 * Signin Page
 *
 * Public page for user authentication
 * - Renders SigninForm component
 * - Uses auth layout (centered form)
 * - Redirects to /tasks on successful signin (handled by SigninForm)
 * - Supports redirect parameter for post-auth navigation
 */
export default function SigninPage() {
  return <SigninForm />;
}
