import React from 'react';
import { ShieldCheck, Building2, HelpCircle } from 'lucide-react';

export interface SourceBadgeProps {
  type: 'official' | 'nonprofit' | 'community';
  lastChecked?: string;
  onClick?: () => void;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  type,
  lastChecked,
  onClick,
  className = '',
}) => {
  const isOfficial = type === 'official';
  const isNonprofit = type === 'nonprofit';

  const styles = isOfficial
    ? 'bg-primary-tint/80 text-primary border-primary/25 hover:bg-primary-tint'
    : isNonprofit
    ? 'bg-secondary/10 text-secondary border-secondary/25 hover:bg-secondary/15'
    : 'bg-surface text-ink-2 border-border';

  const label = isOfficial ? 'Official Source' : isNonprofit ? 'Nonprofit Legal Aid' : 'Resource';

  return (
    <button
      type="button"
      onClick={onClick}
      title={lastChecked ? `Verified ${lastChecked}` : label}
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-semibold tracking-wide border
        transition-all duration-fast select-none cursor-pointer
        ${styles}
        ${className}
      `}
    >
      {isOfficial ? (
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
      ) : isNonprofit ? (
        <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
      ) : (
        <HelpCircle className="w-3.5 h-3.5 text-ink-3 shrink-0" />
      )}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{isOfficial ? 'Official' : 'Nonprofit'}</span>
      {lastChecked && (
        <span className="text-[11px] opacity-75 font-normal ml-0.5 hidden md:inline">
          · {lastChecked}
        </span>
      )}
    </button>
  );
};
