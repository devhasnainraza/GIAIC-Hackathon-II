
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { InputProps } from '@/lib/types';

/**
 * Enhanced Input Component
 *
 * Reusable input component with:
 * - Label and error display
 * - Multiple input types (text, email, password)
 * - Password visibility toggle (eye icon)
 * - Validation state styling
 * - Proper accessibility attributes
 * - Touch-friendly sizing (min 44x44px)
 * - Required field indicator
 * - Smooth animations and transitions
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
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Determine if this is a password field
  const isPasswordField = type === 'password';

  // Toggle between password and text type
  const inputType = isPasswordField && showPassword ? 'text' : type;

  // Base input styles with enhanced visual design
  const baseStyles = `
    min-h-[48px] 
    w-full 
    px-4 
    py-3 
    border-2 
    rounded-xl 
    bg-white 
    shadow-sm 
    transition-all 
    duration-200 
    ease-in-out
    focus:outline-none 
    focus:ring-0 
    focus:shadow-md
    disabled:opacity-60 
    disabled:cursor-not-allowed
    placeholder:text-gray-400
    text-gray-900
  `;

  // Error state styles with enhanced feedback
  const errorStyles = error
    ? 'border-red-300 focus:border-red-500 focus:shadow-red-100'
    : 'border-gray-200 focus:border-blue-500 focus:shadow-blue-50/[0.15]';

  // Add padding for password toggle button
  const paddingStyles = isPasswordField ? 'pr-14' : '';

  // Combine styles
  const inputStyles = `${baseStyles} ${errorStyles} ${paddingStyles}`;

  return (
    <div className="w-full">
      {/* Enhanced Label */}
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-800 mb-2 flex items-center"
      >
        {label}
        {required && (
          <span 
            className="ml-1 text-red-500 text-base animate-pulse-slow" 
            aria-label="required"
          >
            *
          </span>
        )}
      </label>

      {/* Enhanced Input Container */}
      <div className="relative group">
        {/* Input with enhanced focus effects */}
        <input
          id={id}
          name={name}
          type={inputType}
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

        {/* Focus glow effect */}
        <div className={`absolute inset-0 rounded-xl pointer-events-none z-[-1] transition-opacity duration-200 ${
          error 
            ? 'bg-red-500/10 opacity-0 group-focus-within:opacity-100' 
            : 'bg-blue-500/10 opacity-0 group-focus-within:opacity-100'
        }`} />

        {/* Password Toggle Button with enhanced styling */}
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`
              absolute 
              right-3 
              top-1/2 
              -translate-y-1/2 
              text-gray-500 
              hover:text-gray-700 
              transition-all 
              duration-200 
              focus:outline-none 
              focus:ring-2 
              focus:ring-blue-500/50 
              focus:rounded-lg 
              focus:bg-blue-50
              active:scale-95
              p-1.5
              rounded-md
              hover:bg-gray-100
            `}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
            ) : (
              <Eye className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
            )}
          </button>
        )}
      </div>

      {/* Enhanced Error Message */}
      {error && (
        <div className="mt-2 flex items-start">
          <svg 
            className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p
            id={`${id}-error`}
            className="text-sm text-red-600 leading-relaxed"
            role="alert"
          >
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

// Add global CSS for the animation (you can add this to your global CSS file)
const globalStyles = `
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;

// You might want to inject this globally or add it to your main CSS file
if (typeof document !== 'undefined') {
  const styleId = 'enhanced-input-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = globalStyles;
    document.head.appendChild(style);
  }
}