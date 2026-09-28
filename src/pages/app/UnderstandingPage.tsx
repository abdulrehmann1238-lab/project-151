import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Tag,
  MapPin,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Category } from '../../types';

export const UnderstandingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    draftProblem,
    draftState,
    draftCategory,
    draftUnderstanding,
    setDraftCategory,
  } = useAppStore();

  const [stagedState, setStagedState] = useState<'skeleton' | 'text' | 'tags'>('skeleton');
  const [editingTag, setEditingTag] = useState<string | null>(null);

  // Staged 1100ms sequence specified in Section 8.3
  useEffect(() => {
    const t1 = setTimeout(() => setStagedState('text'), 400);
    const t2 = setTimeout(() => setStagedState('tags'), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const category = draftCategory || draftUnderstanding?.category || 'dmv';
  const restatement =
    draftUnderstanding?.restatement ||
    (category === 'dmv'
      ? "Your California driver's license is suspended and you're not sure why or how to clear the DMV hold, settle fines, and restore your driving privileges legally."
      : category === 'unemployment'
      ? 'You recently experienced an employment separation and need to submit a California EDD unemployment claim, verify your identity with ID.me, and maintain weekly certifications.'
      : 'Your landlord failed to return your rental security deposit within the mandatory 21 days or made unjustified deductions without itemized receipts, and you need a formal demand and recovery plan.');

  const situation = draftUnderstanding?.situation || (category === 'dmv' ? 'Driver License Suspension' : category === 'unemployment' ? 'Unemployment Claim Filing' : 'Security Deposit Dispute');
  const urgency = draftUnderstanding?.urgency || 'Time-sensitive';
  const location = draftState || 'California';

  const categoriesList: { id: Category; label: string }[] = [
    { id: 'dmv', label: 'DMV & Driving' },
    { id: 'unemployment', label: 'Unemployment & Work' },
    { id: 'housing', label: 'Housing & Landlord' },
    { id: 'credit', label: 'Credit Reports' },
    { id: 'insurance', label: 'Insurance Denials' },
    { id: 'consumer', label: 'Consumer Complaints' },
  ];

  const handleContinue = () => {
    navigate('/app/case/new/questions');
  };

  const handleRevise = () => {
    navigate('/app/new');
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 text-left space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Step 1 of 3 · Problem Understanding
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-ink mt-1.5">
          Here’s what I understood.
        </h1>
        <p className="text-[15px] text-ink-2 mt-1">
          Review Jerri's classification. If anything looks off, you can adjust the tags before proceeding.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 of 12): Understanding Card */}
        <div className="lg:col-span-7 bg-surface-elevated rounded-lg p-6 sm:p-7 border border-border shadow-1 space-y-6">
          {stagedState === 'skeleton' ? (
            <div className="space-y-4">
              <Skeleton count={3} />
              <div className="flex gap-2 pt-2">
                <Skeleton variant="button" />
                <Skeleton variant="button" />
              </div>
            </div>
          ) : (
            <>
              {/* Restatement */}
              <div className="space-y-2 animate-in fade-in duration-300">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Structured Interpretation
                </span>
                <p className="text-[17px] font-serif font-medium text-ink leading-relaxed">
                  "{restatement}"
                </p>
              </div>

              {/* Editable Tags */}
              <div
                className={`
                  space-y-3 pt-4 border-t border-border transition-all duration-300
                  ${stagedState === 'tags' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                `}
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-3">
                  <span>Classified Details (Tap any tag to edit)</span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {/* Category Tag */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setEditingTag(editingTag === 'cat' ? null : 'cat')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface border border-border-strong text-ink hover:border-primary transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      <span>Category: {category.toUpperCase()}</span>
                    </button>

                    {/* Popover to change category */}
                    {editingTag === 'cat' && (
                      <div className="absolute left-0 top-full mt-2 w-56 bg-surface-elevated rounded-md shadow-2 border border-border p-2 z-20 space-y-1">
                        {categoriesList.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setDraftCategory(c.id);
                              setEditingTag(null);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-surface font-medium cursor-pointer ${category === c.id ? 'bg-primary-tint text-primary font-semibold' : 'text-ink'}`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Situation Tag */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-surface border border-border text-ink-2">
                    <Tag className="w-3.5 h-3.5 text-ink-3" />
                    <span>{situation}</span>
                  </span>

                  {/* Location Tag */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-surface border border-border text-ink-2">
                    <MapPin className="w-3.5 h-3.5 text-ink-3" />
                    <span>{location}</span>
                  </span>

                  {/* Urgency Tag (accent-tint as specified in Section 8.3) */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-tint border border-accent/40 text-accent">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Urgency: {urgency}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleRevise}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  className="w-full sm:w-auto"
                >
                  Not quite (Edit text)
                </Button>

                <Button
                  variant="accent"
                  size="md"
                  onClick={handleContinue}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Looks right, continue
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Right Column (5 of 12): What happens next */}
        <div className="lg:col-span-5 bg-surface rounded-lg p-6 border border-border space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-3">
            What happens next
          </h3>

          <div className="space-y-4 text-xs sm:text-[14px]">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-bg flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                1
              </span>
              <div>
                <h4 className="font-semibold text-ink">A few quick questions</h4>
                <p className="text-ink-2 text-xs leading-relaxed mt-0.5">
                  Only 3 to 5 targeted questions to narrow the exact requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-surface-elevated border border-border-strong text-ink-2 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                2
              </span>
              <div>
                <h4 className="font-semibold text-ink">Your custom resolution plan</h4>
                <p className="text-ink-2 text-xs leading-relaxed mt-0.5">
                  Numbered steps with time estimates and documents you'll need.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-surface-elevated border border-border-strong text-ink-2 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                3
              </span>
              <div>
                <h4 className="font-semibold text-ink">Sources you can verify</h4>
                <p className="text-ink-2 text-xs leading-relaxed mt-0.5">
                  Direct official links, phone unit numbers, and form downloads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
