import React, { useState, useEffect, useRef } from 'react';
import { Check, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export const StoryPanel: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const top = rect.top;
      const height = rect.height - window.innerHeight;

      if (top > 0) {
        setActiveStep(0);
      } else if (top < -height) {
        setActiveStep(2);
      } else {
        const progress = Math.abs(top) / height;
        if (progress < 0.35) {
          setActiveStep(0);
        } else if (progress < 0.7) {
          setActiveStep(1);
        } else {
          setActiveStep(2);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Say it your way',
      desc: 'No complicated drop-down menus or government jargon. Type what happened in everyday language, like you were explaining it to a friend.',
    },
    {
      num: '02',
      title: 'Jerri asks only what matters',
      desc: 'Instead of generic AI chat, Jerri asks 3 to 5 targeted follow-up questions with quick-tap answers. Every single answer visibly shapes your final plan.',
    },
    {
      num: '03',
      title: 'Follow a clear, verified plan',
      desc: 'Leave with an actionable checklist of numbered steps, exact agency links, document checklists, and fallback instructions if an office delays.',
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative w-full md:min-h-[260vh] bg-surface text-ink border-y border-border"
    >
      {/* Sticky stage for desktop */}
      <div className="md:sticky md:top-0 md:h-screen flex items-center py-16 md:py-0">
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-12 items-center">
          {/* Left Column: Numbered story steps */}
          <div className="md:col-span-6 space-y-8 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                How Ask Jerri Works
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-ink mt-2">
                From tangled situation to verified next action.
              </h2>
            </div>

            <div className="space-y-6">
              {steps.map((st, i) => {
                const isActive = activeStep === i;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`
                      p-4 sm:p-5 rounded-lg border transition-all duration-med cursor-pointer select-none
                      ${isActive ? 'bg-surface-elevated border-primary shadow-1' : 'bg-transparent border-transparent opacity-60 hover:opacity-90'}
                    `}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span
                        className={`text-sm font-serif font-semibold tabular-nums px-2 py-0.5 rounded ${isActive ? 'bg-primary text-bg' : 'text-ink-3'}`}
                      >
                        {st.num}
                      </span>
                      <h3 className={`text-xl font-medium ${isActive ? 'text-ink' : 'text-ink-2'}`}>
                        {st.title}
                      </h3>
                    </div>
                    <p className="text-[15px] text-ink-2 leading-relaxed pl-9">{st.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Preview Panel */}
          <div className="md:col-span-6 flex justify-center">
            <div className="w-full max-w-[480px] min-h-[380px] bg-surface-elevated rounded-lg p-6 sm:p-7 border border-border shadow-2 flex flex-col justify-between text-left transition-all duration-slow">
              {activeStep === 0 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs font-semibold text-ink-3 uppercase tracking-wider">
                      Step 1 · Plain Language Intake
                    </span>
                  </div>

                  <div className="p-4 bg-surface rounded-md border border-border-strong text-ink leading-relaxed font-sans text-[15px]">
                    "My driver's license was suspended due to an unpaid ticket from another county, and I don't know who to call or where to pay to get back on the road."
                  </div>

                  <div className="p-3 bg-primary-tint/50 border border-primary/20 rounded-md">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                      Jerri's Instant Recognition
                    </p>
                    <p className="text-[13px] text-ink-2">
                      Classified as California DMV Failure-to-Appear hold (FTA code 40508). Urgency: Time-sensitive.
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Step 2 · Adaptive Intake
                    </span>
                    <span className="text-xs text-ink-3">Question 2 of 4</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[17px] font-medium text-ink">
                      Have you received an official Notice of Suspension in the mail?
                    </h4>
                    <div className="space-y-2 pt-2">
                      <div className="p-3 rounded border border-primary bg-primary-tint/40 font-semibold text-[14px] text-ink flex items-center justify-between">
                        <span>Yes, within the last 30 days</span>
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <div className="p-3 rounded border border-border bg-surface text-[14px] text-ink-2">
                        <span>No notice ever arrived</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-ink-3 italic">
                    Answer narrowed your plan: Added Form DL 106 Court Abstract verification.
                  </p>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Step 3 · Verified Step Plan
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>3 of 7 Done (42%)</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded bg-surface/70 border border-border line-through text-ink-3 text-[13px]">
                      1. Check driver record & court docket online
                    </div>
                    <div className="p-2.5 rounded bg-surface/70 border border-border line-through text-ink-3 text-[13px]">
                      2. Pay county court fine & obtain DL 106 release
                    </div>
                    <div className="p-3 rounded bg-accent-tint/40 border border-accent/40 font-semibold text-ink text-[14px] shadow-1 flex items-center justify-between">
                      <span>3. Transmit SR-22 certificate via insurer</span>
                      <span className="text-[11px] bg-accent text-white px-2 py-0.5 rounded-full font-sans">
                        Next
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-surface border border-border text-ink-2 text-[13px]">
                      4. Pay statutory DMV reissuance fee
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-ink-3">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      <span>Official California DMV sources attached</span>
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-ink-3">
                <span>Interactive demonstration</span>
                <span className="font-semibold text-primary">Ask Jerri Methodology</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
