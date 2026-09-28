import React, { useState } from 'react';
import { SCENARIOS } from '../../data/scenarios';
import { PlanSpine } from '../domain/PlanSpine';
import { ProgressRing } from '../ui/ProgressRing';
import { KeyDatesList } from '../domain/KeyDatesList';
import { DocChecklist } from '../domain/DocChecklist';
import { Step } from '../../types';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const SamplePlanSection: React.FC = () => {
  const navigate = useNavigate();
  // Interactive demo state for landing page sample
  const [sampleSteps, setSampleSteps] = useState<Step[]>(() => {
    const raw = SCENARIOS.dmv.buildSteps({ q1: 'fine', q2: 'yes_recent', q3: 'yes_work', q4: 'no_sr22', q5: 'pending_court' });
    raw[0].status = 'done';
    raw[1].status = 'done';
    raw[2].status = 'current';
    return raw;
  });

  const [sampleDocs, setSampleDocs] = useState([
    { name: 'California Driver’s License Number', checked: true },
    { name: 'Order of Suspension Notice', checked: true },
    { name: 'Proof of Insurance (SR-22 Certificate)', checked: false },
    { name: 'DMV Reissuance Fee Confirmation', checked: false },
  ]);

  const completedCount = sampleSteps.filter((s) => s.status === 'done').length;
  const progressPercent = Math.round((completedCount / sampleSteps.length) * 100);

  return (
    <section id="sample-plan" className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto text-left">
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Real Plan Format
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-medium text-ink mt-2">
          This is what clarity looks like.
        </h2>
        <p className="text-[16px] text-ink-2 mt-3 leading-relaxed">
          Try interacting below: check off a step, expand fallback options, and see how deadlines and documents are organized.
        </p>
      </div>

      <div className="bg-surface-elevated rounded-lg p-6 sm:p-8 border border-border shadow-2">
        {/* Sample Plan Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-tint px-2.5 py-0.5 rounded-full">
                Interactive Sample Plan
              </span>
              <span className="text-xs text-ink-3">California DMV</span>
            </div>
            <h3 className="text-2xl font-serif font-medium text-ink">
              Driver's License Suspension Resolution
            </h3>
            <p className="text-[14px] text-ink-2 mt-1">
              Case status: In progress · 7 total sequential steps
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ProgressRing
              progress={progressPercent}
              size={64}
              strokeWidth={5}
              showText={false}
            />
            <div className="text-left">
              <span className="text-sm font-semibold text-ink block tabular-nums">
                {completedCount} of {sampleSteps.length} steps done
              </span>
              <span className="text-xs text-ink-3">Click any step checkbox to try</span>
            </div>
          </div>
        </div>

        {/* Plan Body & Rail */}
        <div className="grid lg:grid-cols-12 gap-8 pt-8">
          <div className="lg:col-span-8">
            <PlanSpine steps={sampleSteps} caseId="sample-landing-case" readOnly={false} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-4 bg-primary-tint/40 border border-primary/20 rounded-md text-left">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Data Guarantee</span>
              </div>
              <p className="text-[13px] text-ink-2 leading-relaxed">
                Every external link in your plan is verified by editorial review within 30 days and directly connects to state or federal authorities.
              </p>
            </div>

            <KeyDatesList dates={SCENARIOS.dmv.deadlines} />

            <div className="p-4 bg-surface rounded-md border border-border text-left space-y-3">
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-ink">
                Documents Needed for This Plan
              </h4>
              <div className="space-y-1.5">
                {sampleDocs.map((doc, i) => (
                  <label key={i} className="flex items-center gap-2 text-[13px] text-ink-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={doc.checked}
                      onChange={() => {
                        setSampleDocs((prev) =>
                          prev.map((d, idx) => (idx === i ? { ...d, checked: !d.checked } : d))
                        );
                      }}
                      className="rounded text-primary focus:ring-accent"
                    />
                    <span className={doc.checked ? 'line-through text-ink-3' : ''}>{doc.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="accent"
                size="md"
                fullWidth
                onClick={() => navigate('/app/new')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create your own plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
