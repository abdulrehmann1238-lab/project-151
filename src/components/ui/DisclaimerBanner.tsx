import React from 'react';
import { Scale, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export interface DisclaimerBannerProps {
  variant?: 'general' | 'professional';
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  variant = 'general',
  className = '',
}) => {
  const { openDemoNotice } = useAppStore();

  if (variant === 'professional') {
    return (
      <div className={`p-4 bg-accent-tint/60 border border-accent/30 rounded-md text-ink flex items-start gap-3.5 ${className}`}>
        <Scale className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="text-[14px] leading-relaxed">
          <span className="font-semibold text-ink">When to get a professional: </span>
          <span>
            This may need a licensed attorney. A legal aid office can often help at no cost.
          </span>{' '}
          <button
            type="button"
            onClick={() => openDemoNotice('California Legal Aid Network', 'https://www.lawhelpca.org')}
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline cursor-pointer ml-1"
          >
            <span>Find a legal aid clinic</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 bg-surface border border-border rounded-md text-ink-2 text-[13px] flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-ink-3 shrink-0" />
        <span>
          <strong className="font-medium text-ink">Important: </strong>
          Ask Jerri provides general procedural guidance, not legal or financial advice.
        </span>
      </div>
      <button
        type="button"
        onClick={() => openDemoNotice('Ask Jerri Disclaimer and Information Policy')}
        className="text-[12px] font-semibold text-primary hover:underline shrink-0"
      >
        Read policy
      </button>
    </div>
  );
};
