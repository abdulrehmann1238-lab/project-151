import React from 'react';
import { Check } from 'lucide-react';

export interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showText?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 96,
  strokeWidth = 7,
  label,
  sublabel,
  showText = true,
  className = '',
}) => {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;
  const isComplete = progress >= 100;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          height={size}
          width={size}
          className="transform -rotate-90 origin-center"
        >
          {/* Background circle */}
          <circle
            stroke="var(--border)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress stroke with smooth dashoffset transition */}
          <circle
            stroke={isComplete ? 'var(--success)' : 'var(--primary)'}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 420ms cubic-bezier(0.22, 1, 0.36, 1), stroke 420ms ease',
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
          {isComplete ? (
            <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center text-success animate-in zoom-in-75 duration-300">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
          ) : (
            <span className="font-sans font-semibold text-ink text-base md:text-lg tabular-nums">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>

      {showText && (label || sublabel) && (
        <div className="mt-2.5 space-y-0.5">
          {label && <p className="text-[14px] font-semibold text-ink">{label}</p>}
          {sublabel && <p className="text-[12px] text-ink-3 tabular-nums">{sublabel}</p>}
        </div>
      )}
    </div>
  );
};
