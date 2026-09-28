import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'card' | 'circle' | 'button';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'line',
  count = 1,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full aspect-square';
      case 'card':
        return 'rounded-md h-32 w-full';
      case 'button':
        return 'rounded-md h-11 w-28';
      case 'line':
      default:
        return 'rounded-sm h-4 w-full';
    }
  };

  const elements = Array.from({ length: count });

  return (
    <div className="space-y-2.5 w-full">
      {elements.map((_, i) => (
        <div
          key={i}
          className={`bg-border/60 animate-pulse duration-[1600ms] ${getVariantStyles()} ${className}`}
        />
      ))}
    </div>
  );
};
