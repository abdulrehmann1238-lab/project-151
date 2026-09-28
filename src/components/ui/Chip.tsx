import React from 'react';
import { Check } from 'lucide-react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  variant?: 'filter' | 'answer' | 'tag' | 'accent';
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  selected = false,
  variant = 'answer',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-3 py-1.5 text-[14px] font-medium rounded-full transition-all duration-fast select-none cursor-pointer border active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2';

  let variantStyles = 'bg-surface border-border text-ink-2 hover:border-primary hover:text-ink';

  if (selected) {
    variantStyles = 'bg-primary-tint border-primary text-primary font-semibold shadow-1';
  } else if (variant === 'accent') {
    variantStyles = 'bg-accent-tint border-accent/40 text-accent font-medium';
  } else if (variant === 'tag') {
    variantStyles = 'bg-surface border-border-strong text-ink hover:border-primary';
  }

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {selected ? (
        <Check className="w-3.5 h-3.5 text-primary shrink-0 animate-in fade-in" />
      ) : icon ? (
        <span className="shrink-0 text-current">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
