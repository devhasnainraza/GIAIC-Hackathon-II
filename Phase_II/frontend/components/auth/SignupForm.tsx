'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { apiClient, ApiError } from '@/lib/api-client-optimized';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  type SignupFormData,
  type FormErrors,
} from '@/lib/types';

/**
 * SignupForm Component
 *
 * Client-side form for user registration with:
 * - Email and password inputs
 * - Confirm password validation
 * - Client-side validation
 * - API integration with Better Auth
 * - Loading state during submission
 * - Error handling and display
 * - Redirect to /tasks on success
 */
export function SignupForm() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /**
   * Validate form fields
   * Returns true if valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Validate confirm password
    if (formData.confirmPassword) {
      const confirmPasswordError = validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );
      if (confirmPasswordError) {
        newErrors.confirmPassword = confirmPasswordError;
      }
    } else {
      newErrors.confirmPassword = 'Please confirm your password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call signup API
      await apiClient.auth.signup(formData.email, formData.password);

      // Redirect to tasks page on success
      router.push('/tasks');
    } catch (error) {
      // Handle API errors
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>
        <p className="text-sm text-slate-600">
          Get started with Pure Tasks in seconds
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
          id="signup-email"
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
          id="signup-password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={(value) => handleChange('password', value)}
          error={errors.password}
          placeholder="At least 8 characters"
          required
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        {/* Confirm Password Input */}
        <Input
          id="signup-confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword || ''}
          onChange={(value) => handleChange('confirmPassword', value)}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          required
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}
