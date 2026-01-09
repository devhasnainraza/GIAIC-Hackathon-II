import type { InputProps } from '@/lib/types';

/**
 * Input Component
 *
 * Reusable input component with:
 * - Label and error display
 * - Multiple input types (text, email, password)
 * - Validation state styling
 * - Proper accessibility attributes
 * - Touch-friendly sizing (min 44x44px)
 * - Required field indicator
 */
export function Input({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
}: InputProps) {
  // Base input styles (mobile-first, touch-friendly)
  const baseStyles = 'min-h-[44px] w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

  // Error state styles
  const errorStyles = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  // Combine styles
  const inputStyles = `${baseStyles} ${errorStyles}`;

  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Input */}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={inputStyles}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {/* Error Message */}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
