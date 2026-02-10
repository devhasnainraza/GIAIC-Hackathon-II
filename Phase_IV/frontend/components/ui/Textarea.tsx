import type { TextareaProps } from '@/lib/types';

/**
 * Textarea Component
 *
 * Reusable textarea component with:
 * - Label and error display
 * - Character count display
 * - Validation state styling
 * - Proper accessibility attributes
 * - Touch-friendly sizing
 * - Required field indicator
 * - Max length enforcement
 */
export function Textarea({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
}: TextareaProps) {
  // Base textarea styles (mobile-first, touch-friendly)
  const baseStyles = 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-vertical';

  // Error state styles
  const errorStyles = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  // Combine styles
  const textareaStyles = `${baseStyles} ${errorStyles}`;

  // Calculate character count
  const characterCount = value.length;
  const showCharacterCount = maxLength !== undefined;

  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex justify-between items-center mb-1">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        {/* Character Count */}
        {showCharacterCount && (
          <span
            className={`text-xs ${
              characterCount > maxLength
                ? 'text-red-600 font-medium'
                : 'text-gray-500'
            }`}
            aria-live="polite"
          >
            {characterCount}/{maxLength}
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={textareaStyles}
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
