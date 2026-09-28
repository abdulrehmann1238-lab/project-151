import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`p-4 bg-error/10 border border-error/20 rounded-md text-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[15px] font-semibold text-ink">{title}</h4>
          <p className="text-[14px] text-ink-2 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="shrink-0"
        >
          Try again
        </Button>
      )}
    </div>
  );
};
