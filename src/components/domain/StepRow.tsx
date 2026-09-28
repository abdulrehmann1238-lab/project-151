import React, { useState } from 'react';
import { Step } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { ALL_RESOURCES } from '../../data/resources';
import { SourceBadge } from '../ui/SourceBadge';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  AlertTriangle,
  FileText,
  ExternalLink,
  Check,
} from 'lucide-react';

export interface StepRowProps {
  step: Step;
  caseId: string;
  isExpandedDefault?: boolean;
  readOnly?: boolean;
}

export const StepRow: React.FC<StepRowProps> = ({
  step,
  caseId,
  isExpandedDefault = false,
  readOnly = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);
  const { toggleStepStatus, openSourceDrawer } = useAppStore();

  const isDone = step.status === 'done';
  const isCurrent = step.status === 'current';

  // Find associated resources
  const resources = ALL_RESOURCES.filter((r) => step.resourceIds.includes(r.id));

  return (
    <div
      className={`
        relative rounded-md border transition-all duration-med text-left
        ${isDone ? 'bg-surface/50 border-border opacity-75' : isCurrent ? 'bg-surface-elevated border-primary/40 shadow-1' : 'bg-surface-elevated border-border'}
        ${step.isHighlighted ? 'ring-2 ring-accent bg-accent-tint/30 transition-colors duration-1000' : ''}
      `}
    >
      {/* Main Step Header Row */}
      <div className="p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4">
        {/* Checkbox */}
        <div className="pt-0.5 shrink-0">
          <button
            type="button"
            disabled={readOnly}
            onClick={() => toggleStepStatus(caseId, step.id)}
            aria-label={`Mark step ${step.stepNumber}: ${step.title} as ${isDone ? 'incomplete' : 'complete'}`}
            className={`
              w-6 h-6 rounded border flex items-center justify-center transition-all duration-fast cursor-pointer
              ${isDone ? 'bg-success border-success text-white' : isCurrent ? 'border-primary hover:border-primary-hover bg-white' : 'border-border-strong hover:border-primary bg-white'}
              ${readOnly ? 'cursor-default' : ''}
            `}
          >
            {isDone && <Check className="w-4 h-4 stroke-[3]" />}
          </button>
        </div>

        {/* Step Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`
                text-xs font-semibold px-2 py-0.5 rounded tabular-nums
                ${isDone ? 'bg-success/10 text-success' : isCurrent ? 'bg-primary text-bg' : 'bg-surface border border-border text-ink-3'}
              `}
            >
              Step {step.stepNumber}
            </span>

            {isCurrent && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-accent bg-accent-tint px-2 py-0.5 rounded-full">
                Next action
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-xs text-ink-3">
              <Clock className="w-3.5 h-3.5" />
              <span>{step.minutes} min</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-ink-3">
              <User className="w-3.5 h-3.5" />
              <span>{step.who}</span>
            </span>

            {step.deadline && (
              <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded">
                {step.deadline}
              </span>
            )}
          </div>

          <h4
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              text-[16px] sm:text-[17px] font-medium leading-snug cursor-pointer transition-colors
              ${isDone ? 'line-through text-ink-3' : isCurrent ? 'text-ink font-semibold' : 'text-ink hover:text-primary'}
            `}
          >
            {step.title}
          </h4>
        </div>

        {/* Expand/Collapse Chevron */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse step details' : 'Expand step details'}
          className="p-1.5 text-ink-3 hover:text-ink rounded-md transition-colors shrink-0 mt-0.5 cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="px-4 pb-5 pt-1 sm:px-5 border-t border-border/70 space-y-4 text-[14px] animate-in fade-in duration-med">
          {/* Instructions */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
              Action Instructions
            </span>
            <p className="text-ink leading-relaxed text-[15px]">{step.instructions}</p>
          </div>

          {/* Why this step */}
          <div className="p-3 bg-surface rounded-md border border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-0.5">
              Why this step is required
            </span>
            <p className="text-ink-2 leading-relaxed">{step.why}</p>
          </div>

          {/* Documents needed */}
          {step.documents.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Documents & Items Needed</span>
              </span>
              <ul className="grid sm:grid-cols-2 gap-1.5">
                {step.documents.map((doc, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 p-2 rounded bg-surface border border-border text-[13px] text-ink-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verified Resources & Forms */}
          {resources.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
                Verified Official Links & Forms
              </span>
              <div className="flex flex-wrap gap-2">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-md bg-surface-elevated border border-border hover:border-primary transition-colors w-full sm:w-auto"
                  >
                    <div className="flex items-center gap-2">
                      <SourceBadge type={res.badge} />
                      <span className="font-medium text-ink text-[13px]">{res.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openSourceDrawer(res)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback "What if this doesn't work?" */}
          {step.fallback && (
            <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-md text-[13px] text-ink-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>What if this doesn't work?</span>
              </div>
              <p className="leading-relaxed">{step.fallback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
