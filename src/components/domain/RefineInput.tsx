import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';

export interface RefineInputProps {
  caseId: string;
  className?: string;
}

export const RefineInput: React.FC<RefineInputProps> = ({ caseId, className = '' }) => {
  const [query, setQuery] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { refinePlan } = useAppStore();

  const suggestions = [
    "I don't have my notice",
    "I can't pay the fee",
    "I moved to a different county",
  ];

  const handleRefine = (textToApply: string) => {
    if (!textToApply.trim()) return;
    setIsApplying(true);

    setTimeout(() => {
      refinePlan(caseId, textToApply);
      setQuery('');
      setIsApplying(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRefine(query);
  };

  return (
    <div className={`p-4 sm:p-5 rounded-lg border border-border bg-surface-elevated shadow-1 text-left ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <SlidersHorizontal className="w-4 h-4 text-primary" />
        <h4 className="text-[15px] font-semibold text-ink">Something changed? Tell Jerri.</h4>
      </div>
      <p className="text-[13px] text-ink-2 mb-3.5 leading-relaxed">
        If you received new correspondence, cannot afford a fee, or an appointment date shifted, Jerri will re-order your plan immediately.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. I can't afford the reinstatement fee right now..."
          className="flex-1 h-11 px-3.5 bg-surface border border-border-strong rounded-sm text-[16px] md:text-[14px] text-ink placeholder:text-ink-3 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary-tint outline-none"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!query.trim()}
          isLoading={isApplying}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Update plan
        </Button>
      </form>

      {/* Suggestion Chips */}
      <div className="flex items-center flex-wrap gap-1.5 text-xs text-ink-3">
        <span className="font-medium mr-1">Quick adjustments:</span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleRefine(s)}
            className="px-2.5 py-1 rounded-full bg-surface border border-border hover:border-primary hover:text-ink transition-colors cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
