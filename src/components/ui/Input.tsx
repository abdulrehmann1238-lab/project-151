import React, { forwardRef } from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSuccess?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, isSuccess, helperText, leftIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-medium text-ink-2">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-ink-3 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`
              w-full h-11 bg-white border rounded-sm text-[16px] md:text-[15px] text-ink placeholder:text-ink-3
              transition-all duration-fast
              ${leftIcon ? 'pl-10 pr-3.5' : 'px-3.5'}
              ${error ? 'border-error focus:ring-2 focus:ring-error/20 focus:border-error' : 'border-border-strong focus:border-primary focus:ring-3 focus:ring-primary-tint'}
              ${props.disabled ? 'bg-surface opacity-60 cursor-not-allowed' : ''}
              ${className}
            `}
            {...props}
          />
          {error && (
            <span className="absolute right-3 text-error pointer-events-none">
              <AlertCircle className="w-4 h-4" />
            </span>
          )}
          {!error && isSuccess && (
            <span className="absolute right-3 text-success pointer-events-none">
              <Check className="w-4 h-4" />
            </span>
          )}
        </div>
        {error && (
          <p className="text-[13px] text-error flex items-center gap-1 mt-1 font-medium">
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="text-[13px] text-ink-3 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
