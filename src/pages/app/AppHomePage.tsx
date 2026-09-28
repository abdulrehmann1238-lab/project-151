import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ProblemBox } from '../../components/domain/ProblemBox';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/ui/ProgressRing';
import {
  ArrowRight,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export const AppHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, cases, setActiveCaseId } = useAppStore();

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Find most recent in-progress case
  const inProgressCase = cases.find((c) => c.status === 'In progress' || c.status === 'Waiting on agency') || cases[0];

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    navigate(`/app/case/${caseId}/plan`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Greeting and Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-ink">
          {greeting}, {user.name.split(' ')[0]}
        </h1>
        <p className="text-[15px] text-ink-2 mt-1">
          Here is your active paperwork roadmap and recommended next actions.
        </p>
      </div>

      {/* Quick Problem Intake Box */}
      <div className="p-5 sm:p-6 bg-surface rounded-lg border border-border space-y-3">
        <h2 className="text-xl font-serif font-medium text-ink">
          Need help with something new?
        </h2>
        <ProblemBox variant="compact" />
      </div>

      {/* Continue where you left off */}
      {inProgressCase ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-medium text-ink">
              Continue where you left off
            </h3>
            <button
              type="button"
              onClick={() => navigate('/app/cases')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all cases ({cases.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {(() => {
            const totalSteps = inProgressCase.steps.length;
            const doneSteps = inProgressCase.steps.filter((s) => s.status === 'done').length;
            const progress = totalSteps > 0 ? (doneSteps / totalSteps) * 100 : 0;
            const currentStep = inProgressCase.steps.find((s) => s.status === 'current');

            return (
              <div
                onClick={() => handleOpenCase(inProgressCase.id)}
                className="p-5 sm:p-6 rounded-lg border border-border bg-surface-elevated hover:border-primary transition-all duration-fast shadow-1 hover:shadow-2 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-tint px-2.5 py-0.5 rounded-full">
                      {inProgressCase.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-ink-3">Updated {inProgressCase.updatedAt}</span>
                  </div>

                  <h4 className="text-xl font-serif font-medium text-ink group-hover:text-primary transition-colors">
                    {inProgressCase.title}
                  </h4>

                  {currentStep && (
                    <div className="p-3 bg-accent-tint/30 border border-accent/20 rounded-md text-[13px] text-ink flex items-start gap-2 max-w-lg">
                      <span className="font-bold text-accent uppercase text-[11px] mt-0.5">Next:</span>
                      <span className="font-medium truncate">{currentStep.title}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-5 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                  <ProgressRing
                    progress={progress}
                    size={72}
                    strokeWidth={6}
                    showText={false}
                  />
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-ink block tabular-nums">
                      {doneSteps} of {totalSteps} done
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCase(inProgressCase.id);
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Open plan
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      ) : (
        /* Empty state */
        <div className="p-10 text-center bg-surface rounded-lg border border-border space-y-2">
          <FileText className="w-8 h-8 text-ink-3 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-ink">Nothing yet</h3>
          <p className="text-sm text-ink-2 max-w-md mx-auto">
            Tell Jerri what's going on above, and your first step-by-step resolution plan will appear here.
          </p>
        </div>
      )}

      {/* 3-Card Row */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Card 1: Suggested Next Actions */}
        <div className="p-5 rounded-lg border border-border bg-surface flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Next Urgent Task</span>
            </span>
            <h4 className="text-[15px] font-semibold text-ink">
              EDD Weekly Certification
            </h4>
            <p className="text-[13px] text-ink-2 leading-relaxed">
              Bi-weekly California UI certification window closes Sunday 11:59 PM.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenCase('case-edd-202')}
            className="w-full"
          >
            Review task
          </Button>
        </div>

        {/* Card 2: Upcoming Deadlines */}
        <div className="p-5 rounded-lg border border-border bg-surface flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-warning flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Deadlines</span>
            </span>
            <div className="space-y-2 pt-1 text-xs text-ink-2">
              <div className="p-2 rounded bg-surface-elevated border border-border flex items-center justify-between">
                <span>DMV Hearing request</span>
                <span className="font-semibold text-warning">9 days</span>
              </div>
              <div className="p-2 rounded bg-surface-elevated border border-border flex items-center justify-between">
                <span>Security deposit demand</span>
                <span className="font-semibold text-warning">5 days</span>
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/app/cases')}
            className="w-full"
          >
            View all dates
          </Button>
        </div>

        {/* Card 3: Explore Situations */}
        <div className="p-5 rounded-lg border border-border bg-surface flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Categories</span>
            </span>
            <h4 className="text-[15px] font-semibold text-ink">
              9 State & Bureau Domains
            </h4>
            <p className="text-[13px] text-ink-2 leading-relaxed">
              Browse guides for landlord disputes, credit bureau errors, and small business permits.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/situations')}
            className="w-full"
          >
            Browse library
          </Button>
        </div>
      </div>
    </div>
  );
};
