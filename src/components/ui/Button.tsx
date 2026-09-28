import React, { forwardRef } from 'react';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'icon';
  size?: 'md' | 'sm';
  fullWidth?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      isSuccess = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: Inter font, radius md (10px), consistent 44px+ hit targets
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold transition-all duration-fast select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:translate-y-[1px]';

    const sizeStyles = {
      md: 'h-12 px-5 text-[15px] rounded-md gap-2',
      sm: 'h-9 px-3 text-[13px] rounded-md gap-1.5',
    };

    const variantStyles = {
      primary:
        'bg-primary text-bg hover:bg-primary-hover active:bg-primary-active border border-transparent shadow-1 group',
      accent:
        'bg-accent text-white hover:bg-accent-hover active:bg-accent border border-transparent shadow-1 group',
      secondary:
        'bg-transparent text-ink border border-border-strong hover:border-primary hover:text-primary active:bg-primary-tint',
      ghost:
        'bg-transparent text-ink-2 hover:bg-primary-tint hover:text-primary active:bg-border',
      icon:
        'bg-transparent text-ink-2 hover:bg-surface hover:text-ink border border-border p-2 rounded-md aspect-square',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span className="opacity-90">Please wait...</span>
          </span>
        ) : isSuccess ? (
          <span className="inline-flex items-center gap-1.5 text-current">
            <Check className="w-4 h-4" />
            <span>Done</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && (
              <span className="inline-flex shrink-0 transition-transform duration-fast group-hover:translate-x-1">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
