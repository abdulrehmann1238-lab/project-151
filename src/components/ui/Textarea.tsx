import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-[13px] font-medium text-ink-2">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            className={`
              w-full p-3.5 bg-white border rounded-sm text-[16px] md:text-[15px] text-ink placeholder:text-ink-3
              transition-all duration-fast resize-y
              ${error ? 'border-error focus:ring-2 focus:ring-error/20 focus:border-error' : 'border-border-strong focus:border-primary focus:ring-3 focus:ring-primary-tint'}
              ${props.disabled ? 'bg-surface opacity-60 cursor-not-allowed' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[13px] text-error flex items-center gap-1 mt-1 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
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

Textarea.displayName = 'Textarea';
