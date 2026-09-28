import React from 'react';
import { Step } from '../../types';
import { StepRow } from './StepRow';

export interface PlanSpineProps {
  steps: Step[];
  caseId: string;
  readOnly?: boolean;
}

export const PlanSpine: React.FC<PlanSpineProps> = ({ steps, caseId, readOnly = false }) => {
  // Find index of first incomplete step to auto-expand it
  const firstIncompleteIdx = steps.findIndex((s) => s.status !== 'done');
  const activeExpandIdx = firstIncompleteIdx === -1 ? 0 : firstIncompleteIdx;

  return (
    <div className="relative pl-6 sm:pl-8 space-y-4">
      {/* Connected 1px vertical spine */}
      <div
        className="absolute left-[11px] sm:left-[15px] top-6 bottom-6 w-[2px] bg-border-strong pointer-events-none"
        aria-hidden="true"
      />

      {steps.map((step, idx) => (
        <div key={step.id} className="relative">
          {/* Node marker on spine */}
          <div
            className={`
              absolute -left-6 sm:-left-8 top-5 w-[14px] h-[14px] rounded-full border-2 bg-surface-elevated z-10 transition-colors
              ${step.status === 'done' ? 'border-success bg-success' : step.status === 'current' ? 'border-accent ring-2 ring-accent/20 bg-accent' : 'border-border-strong'}
            `}
            aria-hidden="true"
          />

          <StepRow
            step={step}
            caseId={caseId}
            isExpandedDefault={idx === activeExpandIdx}
            readOnly={readOnly}
          />
        </div>
      ))}
    </div>
  );
};
