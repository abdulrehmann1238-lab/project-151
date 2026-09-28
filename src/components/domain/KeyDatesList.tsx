import React from 'react';
import { KeyDate } from '../../types';
import { Calendar, AlertCircle } from 'lucide-react';

export interface KeyDatesListProps {
  dates: KeyDate[];
  className?: string;
}

export const KeyDatesList: React.FC<KeyDatesListProps> = ({ dates, className = '' }) => {
  if (!dates || dates.length === 0) return null;

  return (
    <div className={`p-4 bg-surface rounded-md border border-border text-left space-y-2.5 ${className}`}>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-warning" />
        <h4 className="text-[13px] font-semibold uppercase tracking-wider text-ink">
          Key Dates & Statutory Deadlines
        </h4>
      </div>

      <div className="space-y-2">
        {dates.map((date) => (
          <div
            key={date.id}
            className={`p-2.5 rounded border text-[13px] flex items-start gap-2 ${date.isUrgent ? 'bg-amber-50/70 border-amber-300/80 text-amber-900' : 'bg-surface-elevated border-border text-ink'}`}
          >
            {date.isUrgent && <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{date.label}</p>
              <p className="text-xs opacity-85 mt-0.5 tabular-nums">{date.dateStr}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
