import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from './Button';
import { X, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { Category } from '../../types';

interface BranchOption {
  id: string;
  label: string;
  category: Category;
  prefilledPrompt: string;
}

const PICKER_DATA: Record<string, { label: string; desc: string; options: BranchOption[] }> = {
  driving: {
    label: 'Driving & DMV',
    desc: 'Licenses, tickets, registration, or vehicle paperwork',
    options: [
      { id: 'd-1', label: 'My license was suspended or revoked', category: 'dmv', prefilledPrompt: "My California driver's license was suspended and I don't know the exact reason or how to get it reinstated." },
      { id: 'd-2', label: 'Unpaid traffic ticket hold on my license', category: 'dmv', prefilledPrompt: 'I missed a court appearance or fine deadline and have an administrative hold on my driving privilege.' },
      { id: 'd-3', label: 'Proof of Insurance / SR-22 requirements', category: 'dmv', prefilledPrompt: 'The DMV says I need an SR-22 certificate on file before I can drive again.' },
      { id: 'd-4', label: 'Vehicle registration expired or smog hold', category: 'dmv', prefilledPrompt: 'My registration renewal is blocked due to a smog check failure or unpaid bridge tolls.' },
    ],
  },
  work: {
    label: 'Work & Employment',
    desc: 'Layoffs, unpaid wages, unemployment benefits, or severance',
    options: [
      { id: 'w-1', label: 'I just got laid off or lost my job', category: 'unemployment', prefilledPrompt: 'I was laid off due to company reduction and need to file my unemployment claim with EDD immediately.' },
      { id: 'w-2', label: 'Missed unemployment weekly certification', category: 'unemployment', prefilledPrompt: 'My UI Online certification window expired and I need to certify without losing benefit weeks.' },
      { id: 'w-3', label: 'Employer withheld my final paycheck or wages', category: 'employment', prefilledPrompt: 'My former employer has not provided my final paycheck or unpaid overtime wages after separation.' },
      { id: 'w-4', label: 'ID.me verification freeze on my claim', category: 'unemployment', prefilledPrompt: 'My unemployment benefits are paused because my identity verification could not be completed online.' },
    ],
  },
  home: {
    label: 'Home & Landlord',
    desc: 'Security deposits, rent disputes, repairs, or leases',
    options: [
      { id: 'h-1', label: 'Landlord won’t return my deposit (21+ days)', category: 'housing', prefilledPrompt: 'My landlord failed to return my rental security deposit within the legal 21-day deadline after moving out.' },
      { id: 'h-2', label: 'Unfair deductions without receipts or invoices', category: 'housing', prefilledPrompt: 'My landlord kept most of my deposit for routine cleaning without sending itemized contractor receipts.' },
      { id: 'h-3', label: 'Major repair ignored (heating, plumbing, leaks)', category: 'housing', prefilledPrompt: 'The property management is ignoring serious habitability defects in my apartment.' },
      { id: 'h-4', label: 'Improper notice or eviction threat', category: 'housing', prefilledPrompt: 'Received an informal text message demanding I vacate without proper statutory notice.' },
    ],
  },
  money: {
    label: 'Money & Debt',
    desc: 'Credit report errors, collection calls, or denied insurance',
    options: [
      { id: 'm-1', label: 'Error or fake account on my credit report', category: 'credit', prefilledPrompt: "There's an account on my credit report that isn't mine and I need to file a formal dispute." },
      { id: 'm-2', label: 'Insurance company refused my repair claim', category: 'insurance', prefilledPrompt: 'My auto insurance denied a collision claim citing an unclear exclusion clause.' },
      { id: 'm-3', label: 'Merchant charged me and refused refund', category: 'consumer', prefilledPrompt: 'A store refused to refund defective goods delivered in damaged condition.' },
      { id: 'm-4', label: 'Debt collector demanding payment on old debt', category: 'credit', prefilledPrompt: 'A collection agency is contacting me for an old balance past the statute of limitations.' },
    ],
  },
  gov: {
    label: 'Government & Small Business',
    desc: 'Starting a business, vital records, or agency documents',
    options: [
      { id: 'g-1', label: 'Register a small business or California LLC', category: 'business', prefilledPrompt: 'I want to register an LLC in California and understand the necessary state and local filings.' },
      { id: 'g-2', label: 'Urgent certified birth certificate copy', category: 'government', prefilledPrompt: 'I need an official certified copy of my birth certificate from the county vital records office.' },
      { id: 'g-3', label: 'Replace lost Social Security card', category: 'government', prefilledPrompt: 'I misplaced my physical Social Security card and need to request an official replacement.' },
      { id: 'g-4', label: 'Something else with state or local agency', category: 'government', prefilledPrompt: 'I need help identifying the right state department and official form for my paperwork issue.' },
    ],
  },
};

export const GuidedPickerModal: React.FC = () => {
  const { guidedPickerOpen, setGuidedPickerOpen, setDraftProblem, setDraftCategory } = useAppStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<BranchOption | null>(null);
  const [customizedPrompt, setCustomizedPrompt] = useState('');

  if (!guidedPickerOpen) return null;

  const handleSelectTopic = (topicKey: string) => {
    setSelectedTopic(topicKey);
    setStep(2);
  };

  const handleSelectOption = (opt: BranchOption) => {
    setSelectedOption(opt);
    setCustomizedPrompt(opt.prefilledPrompt);
    setStep(3);
  };

  const handleConfirmAndStart = () => {
    if (!selectedOption) return;
    setDraftProblem(customizedPrompt);
    setDraftCategory(selectedOption.category);
    setGuidedPickerOpen(false);
    navigate('/app/new');
  };

  const handleClose = () => {
    setGuidedPickerOpen(false);
    setStep(1);
    setSelectedTopic(null);
    setSelectedOption(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-picker-title"
        className="w-full max-w-xl bg-surface-elevated rounded-lg p-6 shadow-3 border border-border relative animate-in zoom-in-95 duration-200 text-left"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-ink-3 hover:text-ink rounded-md transition-colors"
          aria-label="Close guided picker"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Guided Path · Step {step} of 3</span>
          </div>
          <div className="flex-1 flex gap-1 h-1.5 bg-border rounded-full overflow-hidden ml-2">
            <div className={`h-full bg-primary transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
          </div>
        </div>

        {/* STEP 1: What is it about? */}
        {step === 1 && (
          <div>
            <h3 id="guided-picker-title" className="text-2xl font-medium text-ink mb-1">
              What’s it about?
            </h3>
            <p className="text-[14px] text-ink-2 mb-5">
              Choose the general area where you’re facing a hurdle or deadline.
            </p>

            <div className="space-y-2.5">
              {Object.entries(PICKER_DATA).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectTopic(key)}
                  className="w-full text-left p-3.5 rounded-md border border-border bg-surface hover:border-primary hover:bg-primary-tint/30 transition-all duration-fast flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <h4 className="text-[15px] font-semibold text-ink group-hover:text-primary">
                      {item.label}
                    </h4>
                    <p className="text-[13px] text-ink-2 mt-0.5">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Narrowed options */}
        {step === 2 && selectedTopic && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-ink-2 hover:text-ink flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>
            <h3 className="text-2xl font-medium text-ink mb-1">
              Which one sounds closest?
            </h3>
            <p className="text-[14px] text-ink-2 mb-5">
              Tap the situation that matches your circumstances.
            </p>

            <div className="space-y-2.5">
              {PICKER_DATA[selectedTopic].options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-3.5 rounded-md border border-border bg-surface hover:border-primary hover:bg-primary-tint/40 transition-all duration-fast flex items-center justify-between group cursor-pointer"
                >
                  <span className="text-[15px] font-medium text-ink group-hover:text-primary pr-2">
                    {opt.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-3 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Confirm and refine prefilled prompt */}
        {step === 3 && selectedOption && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-ink-2 hover:text-ink flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>
            <h3 className="text-2xl font-medium text-ink mb-1">
              Ready to start
            </h3>
            <p className="text-[14px] text-ink-2 mb-4">
              Here is how Jerri will summarize your starting point. You can edit this now or continue.
            </p>

            <div className="mb-5">
              <textarea
                value={customizedPrompt}
                onChange={(e) => setCustomizedPrompt(e.target.value)}
                rows={4}
                className="w-full p-3.5 bg-white border border-border-strong rounded-sm text-[15px] text-ink focus:border-primary focus:ring-3 focus:ring-primary-tint"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" size="md" onClick={() => setStep(2)}>
                Change choice
              </Button>
              <Button
                variant="accent"
                size="md"
                onClick={handleConfirmAndStart}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue with this problem
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
