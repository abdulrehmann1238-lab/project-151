import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { SCENARIOS } from '../../data/scenarios';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

export const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    draftCategory,
    draftAnswers,
    setDraftAnswer,
    createCaseFromDraft,
  } = useAppStore();

  const category = (draftCategory === 'unemployment' || draftCategory === 'housing') ? draftCategory : 'dmv';
  const scenario = SCENARIOS[category];
  const questions = scenario.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    draftAnswers[questions[0]?.id] || null
  );
  const [isBuildingPlan, setIsBuildingPlan] = useState(false);
  const [buildingStep, setBuildingStep] = useState(0);

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Keyboard navigation: 1-5 to select, Backspace to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBuildingPlan) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= currentQ.options.length) {
        handleSelectOption(currentQ.options[num - 1].id);
      } else if (e.key === 'Backspace' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        setSelectedOptionId(draftAnswers[questions[currentIndex - 1]?.id] || null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQ, draftAnswers, isBuildingPlan]);

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setDraftAnswer(currentQ.id, optionId);

    // Auto-advance after 320ms as specified in Section 8.4
    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOptionId(draftAnswers[questions[currentIndex + 1]?.id] || null);
      }
    }, 320);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOptionId(draftAnswers[questions[currentIndex - 1]?.id] || null);
    } else {
      navigate('/app/case/new/understanding');
    }
  };

  const handleBuildPlan = () => {
    setIsBuildingPlan(true);

    // Staged 1400ms calm build sequence (Section 8.4)
    setTimeout(() => setBuildingStep(1), 400);
    setTimeout(() => setBuildingStep(2), 850);
    setTimeout(() => setBuildingStep(3), 1300);

    setTimeout(() => {
      const newCaseId = createCaseFromDraft();
      navigate(`/app/case/${newCaseId}/plan`);
    }, 1600);
  };

  // Preview steps that sharpen as questions are answered (Wow moment #3)
  const answersSoFar = { ...draftAnswers, ...(selectedOptionId ? { [currentQ.id]: selectedOptionId } : {}) };
  const previewSteps = scenario.buildSteps(answersSoFar);

  // Full screen calm build state
  if (isBuildingPlan) {
    return (
      <div className="fixed inset-0 z-50 bg-bg flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300">
        <div className="max-w-md w-full space-y-6">
          <div className="w-12 h-12 rounded-full bg-primary-tint text-primary flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6 animate-spin duration-1000" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-ink">
            Assembling your resolution plan
          </h2>

          <div className="space-y-4 text-left p-6 bg-surface-elevated rounded-lg border border-border shadow-1">
            <div className={`flex items-center gap-3 transition-opacity duration-300 ${buildingStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${buildingStep >= 1 ? 'bg-success text-white' : 'border border-border'}`}>
                {buildingStep >= 1 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-[15px] font-medium text-ink">Checking state agency requirements</span>
            </div>

            <div className={`flex items-center gap-3 transition-opacity duration-300 ${buildingStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${buildingStep >= 2 ? 'bg-success text-white' : 'border border-border'}`}>
                {buildingStep >= 2 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-[15px] font-medium text-ink">Finding the right office and forms</span>
            </div>

            <div className={`flex items-center gap-3 transition-opacity duration-300 ${buildingStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${buildingStep >= 3 ? 'bg-success text-white' : 'border border-border'}`}>
                {buildingStep >= 3 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-[15px] font-medium text-ink">Ordering steps & calculating deadlines</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 text-left">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Main Question Column (7 of 12, max 640px) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-ink-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 hover:text-ink transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <span className="uppercase tracking-wider tabular-nums">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Thin 2px progress bar */}
            <div className="w-full h-[2px] bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1.5 pt-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-ink leading-tight">
              {currentQ.question}
            </h2>
            {currentQ.helperText && (
              <p className="text-[15px] text-ink-2 leading-relaxed">
                {currentQ.helperText}
              </p>
            )}
          </div>

          {/* Answer Options: 56px tall tappable rows */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`
                    w-full min-h-[56px] p-4 rounded-md border text-left flex items-start justify-between gap-4 transition-all duration-fast select-none cursor-pointer
                    ${isSelected ? 'bg-primary-tint border-primary shadow-1 ring-1 ring-primary' : 'bg-surface-elevated border-border-strong hover:border-primary hover:bg-surface'}
                  `}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-surface border border-border text-ink-3 tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-[16px] font-medium text-ink">{opt.label}</span>
                    </div>
                    {opt.detail && (
                      <p className="text-[13px] text-ink-2 pl-7">{opt.detail}</p>
                    )}
                  </div>

                  <div
                    className={`
                      w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors
                      ${isSelected ? 'bg-primary border-primary text-white' : 'border-border-strong bg-white'}
                    `}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Question Footer & Build Trigger */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-ink-3">
            <span>You can change any answer later.</span>

            {isLastQuestion ? (
              <Button
                variant="accent"
                size="md"
                onClick={handleBuildPlan}
                disabled={!selectedOptionId}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Build my plan
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (selectedOptionId) {
                    setCurrentIndex((prev) => prev + 1);
                    setSelectedOptionId(draftAnswers[questions[currentIndex + 1]?.id] || null);
                  }
                }}
                disabled={!selectedOptionId}
              >
                Next question
              </Button>
            )}
          </div>
        </div>

        {/* Right Rail (4 of 12, desktop only, 280px): Live Plan Preview (Wow moment #3) */}
        <div className="hidden lg:block lg:col-span-4 bg-surface rounded-lg p-5 border border-border space-y-3 sticky top-24">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Live Plan Preview
            </span>
            <span className="text-xs text-ink-3">Adapting live</span>
          </div>

          <p className="text-xs text-ink-2 leading-relaxed">
            Steps sharpen and adjust in real time as you answer each question.
          </p>

          <div className="space-y-2 pt-2">
            {previewSteps.slice(0, 5).map((step, idx) => {
              const isSharpened = idx <= currentIndex + 1;
              return (
                <div
                  key={step.id}
                  className={`
                    p-2.5 rounded border text-xs transition-all duration-300 flex items-center gap-2
                    ${isSharpened ? 'bg-surface-elevated border-border text-ink opacity-100 shadow-1' : 'bg-surface/50 border-border/60 text-ink-3 opacity-40'}
                  `}
                >
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="truncate font-medium">{step.title}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-ink-3 italic">
            Estimated resolution: ~7 steps total
          </div>
        </div>
      </div>
    </div>
  );
};
