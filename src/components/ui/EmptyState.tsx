import React from 'react';
import { LucideIcon, FileQuestion } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 max-w-[420px] mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-ink-2 mb-4">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-medium text-ink mb-1.5">{title}</h3>
      <p className="text-[15px] text-ink-2 leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
