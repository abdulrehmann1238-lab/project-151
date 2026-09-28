import React from 'react';
import { Step } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { ArrowRight, CheckCircle2, Clock, Check } from 'lucide-react';

export interface NextActionCardProps {
  currentStep?: Step;
  caseId: string;
  isCompleted?: boolean;
  className?: string;
  variant?: 'rail' | 'bottom-bar';
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
  currentStep,
  caseId,
  isCompleted = false,
  className = '',
  variant = 'rail',
}) => {
  const { toggleStepStatus, addToast } = useAppStore();

  const handleDownloadSummary = () => {
    addToast({
      type: 'success',
      message: 'Plan summary PDF generated (simulated download).',
    });
  };

  if (isCompleted) {
    if (variant === 'bottom-bar') {
      return (
        <div className="fixed bottom-0 inset-x-0 bg-surface-elevated border-t border-border p-3.5 z-30 flex items-center justify-between md:hidden shadow-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-[14px] font-medium text-ink">All steps completed</span>
          </div>
          <Button variant="secondary" size="sm" onClick={handleDownloadSummary}>
            Download summary
          </Button>
        </div>
      );
    }

    return (
      <div className={`p-5 rounded-lg border border-success/30 bg-success/5 text-left space-y-3 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-success/15 text-success flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 stroke-[2]" />
        </div>
        <h4 className="text-lg font-medium text-ink">You're done</h4>
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Keep this plan and your confirmation numbers for your permanent records.
        </p>
        <Button variant="secondary" size="md" fullWidth onClick={handleDownloadSummary}>
          Download summary
        </Button>
      </div>
    );
  }

  if (!currentStep) return null;

  // Mobile Bottom Bar (pinned 56px with step title and "Mark done")
  if (variant === 'bottom-bar') {
    return (
      <div className="fixed bottom-0 inset-x-0 bg-surface-elevated border-t border-border-strong px-4 py-2.5 z-30 flex items-center justify-between md:hidden shadow-3">
        <div className="min-w-0 pr-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Next Action</span>
            <span className="text-[11px] text-ink-3">· {currentStep.minutes} min</span>
          </div>
          <p className="text-[14px] font-medium text-ink truncate">{currentStep.title}</p>
        </div>
        <Button
          variant="accent"
          size="sm"
          onClick={() => toggleStepStatus(caseId, currentStep.id)}
          className="shrink-0"
        >
          Mark done
        </Button>
      </div>
    );
  }

  // Desktop Right Rail Card (accent-outlined)
  return (
    <div className={`p-5 rounded-lg border-2 border-accent/40 bg-surface-elevated shadow-1 text-left space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-tint px-2.5 py-0.5 rounded-full">
          Immediate Next Action
        </span>
        <span className="text-xs text-ink-3 flex items-center gap-1 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{currentStep.minutes} min</span>
        </span>
      </div>

      <div>
        <span className="text-xs font-semibold text-ink-3 block mb-0.5">
          Step {currentStep.stepNumber}
        </span>
        <h4 className="text-[16px] font-semibold text-ink leading-snug">
          {currentStep.title}
        </h4>
      </div>

      <p className="text-[14px] text-ink-2 leading-relaxed">
        {currentStep.instructions.slice(0, 110)}...
      </p>

      <Button
        variant="accent"
        size="md"
        fullWidth
        onClick={() => toggleStepStatus(caseId, currentStep.id)}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Complete step {currentStep.stepNumber}
      </Button>
    </div>
  );
};
