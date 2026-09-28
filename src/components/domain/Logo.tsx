import React from 'react';
import { Link } from 'react-router-dom';

export interface LogoProps {
  markOnly?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  markOnly = false,
  className = '',
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 group select-none text-ink hover:text-primary transition-colors ${className}`}
      aria-label="Ask Jerri Home"
    >
      {/* Untangling Monogram 'J': straight stem resolving into clean hook */}
      <div
        className={`relative ${iconSizes[size]} rounded-sm bg-primary flex items-center justify-center text-bg shadow-1 group-hover:bg-primary-hover transition-colors shrink-0`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          {/* Straight untangled spine with clean serif hook */}
          <path
            d="M19 7v13a4.5 4.5 0 0 1-4.5 4.5h-1a4.5 4.5 0 0 1-4.5-4.5v-1h2.5v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7h-2.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {!markOnly && (
        <span
          className={`font-serif font-medium tracking-tight ${textSizes[size]} text-ink group-hover:text-primary transition-colors`}
        >
          Ask Jerri
        </span>
      )}
    </Link>
  );
};
