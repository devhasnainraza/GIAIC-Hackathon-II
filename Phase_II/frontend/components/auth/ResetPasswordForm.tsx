'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { validatePassword, validateConfirmPassword, type FormErrors } from '@/lib/types';
import { apiClient, ApiError } from '@/lib/api-client-optimized';
import { Lock, CheckCircle } from 'lucide-react';

/**
 * Reset Password Form Component
 *
 * Allows users to set a new password using a reset token
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!token) {
      setApiError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call reset password API
      await apiClient.auth.resetPassword(token, formData.password);

      setIsSuccess(true);

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('Failed to reset password. The link may have expired. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: 'password' | 'confirmPassword', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Password reset successful!</h2>
        <p className="text-sm text-slate-600 mb-6">
          Your password has been updated. Redirecting to sign in...
        </p>

        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Set new password</h2>
        <p className="text-sm text-slate-600">
          Enter your new password below
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="mb-4">
          <ErrorMessage message={apiError} onDismiss={() => setApiError(null)} />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password Input */}
        <Input
          id="reset-password"
          name="password"
          type="password"
          label="New Password"
          value={formData.password}
          onChange={(value) => handleChange('password', value)}
          error={errors.password}
          placeholder="At least 8 characters"
          required
          autoComplete="new-password"
          disabled={isSubmitting}
          icon={<Lock className="w-5 h-5 text-slate-400" />}
        />

        {/* Confirm Password Input */}
        <Input
          id="reset-confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={(value) => handleChange('confirmPassword', value)}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          required
          autoComplete="new-password"
          disabled={isSubmitting}
          icon={<Lock className="w-5 h-5 text-slate-400" />}
        />

        {/* Password Requirements */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-700 mb-2">Password must contain:</p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              Mix of letters and numbers recommended
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>

        {/* Back to Sign In */}
        <div className="text-center pt-2">
          <Link
            href="/signin"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
