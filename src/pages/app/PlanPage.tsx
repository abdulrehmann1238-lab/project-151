import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { PlanSpine } from '../../components/domain/PlanSpine';
import { NextActionCard } from '../../components/domain/NextActionCard';
import { RefineInput } from '../../components/domain/RefineInput';
import { KeyDatesList } from '../../components/domain/KeyDatesList';
import { DocChecklist } from '../../components/domain/DocChecklist';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Button } from '../../components/ui/Button';
import { DisclaimerBanner } from '../../components/ui/DisclaimerBanner';
import { Case, Step } from '../../types';
import {
  Printer,
  Share2,
  Bookmark,
  MoreVertical,
  Trash2,
  Copy,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const PlanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    cases,
    updateCaseTitle,
    updateCaseStatus,
    deleteCase,
    addToast,
    setSigninModalOpen,
    openDemoNotice,
    user,
  } = useAppStore();

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(currentCase?.title || '');
  const [menuOpen, setMenuOpen] = useState(false);

  if (!currentCase) {
    return (
      <div className="p-12 text-center">
        <p className="text-ink-2">Case not found.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/app/cases')} className="mt-4">
          Back to all cases
        </Button>
      </div>
    );
  }

  const completedCount = currentCase.steps.filter((s) => s.status === 'done').length;
  const totalCount = currentCase.steps.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isAllCompleted = completedCount === totalCount && totalCount > 0;
  const currentStep = currentCase.steps.find((s) => s.status === 'current');

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleText.trim()) {
      updateCaseTitle(currentCase.id, titleText.trim());
      setIsEditingTitle(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    openDemoNotice('Share Plan Link', 'https://askjerri.org/case/' + currentCase.id);
  };

  const handleSave = () => {
    if (!user.isAuthenticated) {
      setSigninModalOpen(true);
    } else {
      addToast({
        type: 'success',
        message: 'Plan saved to your account.',
      });
    }
  };

  const handleDelete = () => {
    deleteCase(currentCase.id);
    navigate('/app/cases');
  };

  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-6 text-left space-y-6">
      {/* Back link & Category Eyebrow */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/app/cases')}
          className="text-xs text-ink-3 hover:text-ink flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Cases</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/app/case/${currentCase.id}/resources`)}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View verified resources for this case</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Case Header */}
      <div className="bg-surface-elevated rounded-lg p-5 sm:p-6 border border-border shadow-1 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-tint px-2.5 py-0.5 rounded-full">
                {currentCase.category.toUpperCase()}
              </span>

              {/* Status Dropdown */}
              <select
                value={currentCase.status}
                onChange={(e) => updateCaseStatus(currentCase.id, e.target.value as any)}
                className="text-xs bg-surface border border-border-strong rounded px-2 py-0.5 text-ink font-semibold focus:ring-accent outline-none cursor-pointer"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Waiting on agency">Waiting on agency</option>
                <option value="Resolved">Resolved</option>
              </select>

              <span className="text-xs text-ink-3">Updated {currentCase.updatedAt}</span>
            </div>

            {/* Editable Title */}
            {isEditingTitle ? (
              <form onSubmit={handleTitleSubmit} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  className="font-serif text-2xl font-medium text-ink bg-surface border border-primary px-2 py-0.5 rounded outline-none"
                  autoFocus
                  onBlur={handleTitleSubmit}
                />
                <Button variant="primary" size="sm" type="submit">
                  Save
                </Button>
              </form>
            ) : (
              <h1
                onClick={() => {
                  setTitleText(currentCase.title);
                  setIsEditingTitle(true);
                }}
                className="text-2xl sm:text-3xl font-serif font-medium text-ink cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                title="Click to rename case"
              >
                <span>{currentCase.title}</span>
                <span className="text-xs text-ink-3 font-sans font-normal opacity-0 hover:opacity-100">
                  (edit)
                </span>
              </h1>
            )}

            <p className="text-[14px] text-ink-2 max-w-2xl leading-relaxed">
              {currentCase.restatement}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Bookmark className="w-3.5 h-3.5" />}
            >
              Save
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
            >
              Share
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print
            </Button>

            {/* Overflow menu */}
            <div className="relative">
              <Button
                variant="icon"
                size="sm"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {menuOpen && (
                <>
                  <div
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-30"
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-surface-elevated rounded-md shadow-2 border border-border p-1.5 z-40 space-y-1 text-left text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        handleShare();
                      }}
                      className="w-full px-2.5 py-1.5 text-left text-ink hover:bg-surface rounded flex items-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate case</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        handleDelete();
                      }}
                      className="w-full px-2.5 py-1.5 text-left text-error hover:bg-error/10 rounded flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete case</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Callout */}
        <DisclaimerBanner variant="general" />
      </div>

      {/* Main 2-Zone Layout: Main Plan (7 of 12) + Right Rail (4 of 12) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Column (7 of 12): Ordered Plan Spine */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
              Step-by-Step Resolution Sequence
            </span>
            <span className="text-xs text-ink-3">
              Start with step 1. Everything else waits until it's your turn.
            </span>
          </div>

          <PlanSpine steps={currentCase.steps} caseId={currentCase.id} />

          {/* Refine Input: "Something changed? Tell Jerri." (Wow moment #5) */}
          <div className="pt-4">
            <RefineInput caseId={currentCase.id} />
          </div>

          {/* When to get a professional callout (Section 10 & 11) */}
          <div className="pt-2">
            <DisclaimerBanner variant="professional" />
          </div>
        </div>

        {/* Right Rail (4 of 12, sticky): Focus & Status */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Next Action Card */}
          <NextActionCard
            currentStep={currentStep}
            caseId={currentCase.id}
            isCompleted={isAllCompleted}
            variant="rail"
          />

          {/* Progress Ring Card */}
          <div className="p-5 rounded-lg border border-border bg-surface-elevated shadow-1 flex items-center gap-6">
            <ProgressRing
              progress={progressPercent}
              size={80}
              strokeWidth={6}
              showText={false}
            />
            <div className="text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
                Overall Progress
              </span>
              <h4 className="text-xl font-semibold text-ink tabular-nums">
                {completedCount} of {totalCount} done
              </h4>
              <p className="text-xs text-ink-2">
                {isAllCompleted
                  ? 'All steps completed. Records archived.'
                  : `${totalCount - completedCount} steps remaining`}
              </p>
            </div>
          </div>

          {/* Key Dates List */}
          <KeyDatesList dates={currentCase.deadlines} />

          {/* Documents Checklist */}
          <DocChecklist documents={currentCase.documents} caseId={currentCase.id} />
        </div>
      </div>

      {/* Pinned Mobile Next Action Bar (56px) */}
      <NextActionCard
        currentStep={currentStep}
        caseId={currentCase.id}
        isCompleted={isAllCompleted}
        variant="bottom-bar"
      />
    </div>
  );
};
