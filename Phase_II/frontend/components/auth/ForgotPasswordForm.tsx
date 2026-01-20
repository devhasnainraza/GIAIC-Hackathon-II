'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { validateEmail, type FormErrors } from '@/lib/types';
import { apiClient, ApiError } from '@/lib/api-client-optimized';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

/**
 * Forgot Password Form Component
 *
 * Allows users to request a password reset link via email
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call forgot password API
      await apiClient.auth.forgotPassword(email);

      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('Failed to send reset link. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
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

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
        <p className="text-sm text-slate-600 mb-6">
          We've sent a password reset link to <strong>{email}</strong>
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-emerald-800">
            <strong>Didn't receive the email?</strong> Check your spam folder or try again in a few minutes.
          </p>
        </div>

        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Forgot your password?</h2>
        <p className="text-sm text-slate-600">
          Enter your email and we'll send you a reset link
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
        {/* Email Input */}
        <Input
          id="forgot-email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          required
          autoComplete="email"
          disabled={isSubmitting}
          icon={<Mail className="w-5 h-5 text-slate-400" />}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>

        {/* Back to Sign In */}
        <div className="text-center pt-2">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
