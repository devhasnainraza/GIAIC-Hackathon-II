'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { apiClient, ApiError } from '@/lib/api-client-optimized';
import {
  validateEmail,
  validatePassword,
  type SigninFormData,
  type FormErrors,
} from '@/lib/types';

/**
 * Enhanced SigninForm with Modern Design
 */
export function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/tasks';

  const [formData, setFormData] = useState<SigninFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
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
      await apiClient.auth.signin(formData.email, formData.password);
      router.push(redirectTo);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          setApiError('Invalid email or password. Please try again.');
        } else {
          setApiError(error.message);
        }
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof SigninFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h2>
        <p className="text-sm text-slate-600">
          Enter your credentials to access your tasks
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
          id="signin-email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={(value) => handleChange('email', value)}
          error={errors.email}
          placeholder="you@example.com"
          required
          autoComplete="email"
          disabled={isSubmitting}
        />

        {/* Password Input */}
        <Input
          id="signin-password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={(value) => handleChange('password', value)}
          error={errors.password}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          disabled={isSubmitting}
        />

        {/* Forgot Password Link */}
        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
