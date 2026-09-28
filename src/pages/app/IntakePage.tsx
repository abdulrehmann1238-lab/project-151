import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { ArrowRight, AlertCircle, Sparkles, MapPin, Calendar, HelpCircle } from 'lucide-react';
import { classifyProblem } from '../../mock/classify';

export const IntakePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    draftProblem,
    draftState,
    draftHasDeadline,
    setDraftProblem,
    setDraftState,
    setDraftHasDeadline,
    setDraftUnderstanding,
    setDraftCategory,
    setGuidedPickerOpen,
  } = useAppStore();

  const [text, setText] = useState(draftProblem);
  const [stateLoc, setStateLoc] = useState(draftState || 'California');
  const [hasDeadline, setHasDeadline] = useState(draftHasDeadline || 'No');
  const [isLoading, setIsLoading] = useState(false);
  const [offTopicError, setOffTopicError] = useState<string | null>(null);
  const [charWarning, setCharWarning] = useState<string | null>(null);

  const exampleStories = [
    "My California driver's license was suspended due to an unpaid ticket from another county, and I don't know who to call or where to pay to get back on the road.",
    "I was laid off from my tech job last Friday without warning. I need to file for unemployment right away and make sure my identity is verified without payment delay.",
    "My landlord kept my entire $2,400 security deposit when I moved out last month. It's been more than 21 days and they refuse to send any receipts or explain why.",
  ];

  const [exampleIdx, setExampleIdx] = useState(0);

  const handleUseExample = () => {
    setText(exampleStories[exampleIdx]);
    setExampleIdx((prev) => (prev + 1) % exampleStories.length);
    setOffTopicError(null);
    setCharWarning(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (text.trim().length < 12) {
      setCharWarning('Please share a few more details (minimum 12 characters).');
      return;
    }

    setCharWarning(null);
    const result = classifyProblem(text, stateLoc);

    if (result.offTopic) {
      setOffTopicError(
        result.offTopicMessage ||
          'Jerri can only help with everyday life and administrative paperwork problems.'
      );
      return;
    }

    setIsLoading(true);
    setDraftProblem(text);
    setDraftState(stateLoc);
    setDraftHasDeadline(hasDeadline);
    setDraftUnderstanding(result);
    setDraftCategory(result.category);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/app/case/new/understanding');
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isValidLength = text.trim().length >= 12;

  return (
    <div className="max-w-[680px] mx-auto py-4 sm:py-8 text-left space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-ink">
          What’s going on?
        </h1>
        <p className="text-[16px] text-ink-2 leading-relaxed">
          Say it the way you’d tell a friend. Details help, but you can skip anything you’re unsure of.
        </p>
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={`
            bg-surface-elevated rounded-lg border p-4 sm:p-5 shadow-1 transition-all duration-fast
            ${offTopicError ? 'border-error ring-2 ring-error/20' : 'border-border-strong focus-within:border-primary focus-within:ring-3 focus-within:ring-primary-tint'}
          `}
        >
          <textarea
            rows={6}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (offTopicError) setOffTopicError(null);
              if (charWarning) setCharWarning(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. My license was suspended because of an old ticket in another county, or my landlord won't return my deposit..."
            className="w-full bg-transparent text-[16px] text-ink placeholder:text-ink-3/80 resize-y outline-none leading-relaxed"
            autoFocus
          />

          <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-ink-3">
            <span>
              {text.length > 400 ? (
                <span className="text-accent font-medium">{text.length} characters (plenty of detail)</span>
              ) : (
                <span>{text.length} characters</span>
              )}
            </span>
            <button
              type="button"
              onClick={handleUseExample}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use an example story</span>
            </button>
          </div>
        </div>

        {/* Optional Context Chips Row */}
        <div className="p-4 bg-surface rounded-md border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          {/* State selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-ink-3 shrink-0" />
            <span className="font-semibold text-ink-2 uppercase tracking-wider">State:</span>
            <select
              value={stateLoc}
              onChange={(e) => setStateLoc(e.target.value)}
              className="bg-white border border-border-strong rounded px-2.5 py-1 text-xs text-ink font-medium focus:ring-accent outline-none cursor-pointer"
            >
              <option value="California">California (Full agency data)</option>
              <option value="New York">New York (Extensible)</option>
              <option value="Texas">Texas (Extensible)</option>
              <option value="Federal">Federal / Nationwide</option>
            </select>
          </div>

          {/* Deadline question */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ink-3 shrink-0" />
            <span className="font-semibold text-ink-2 uppercase tracking-wider">Is there a deadline?</span>
            <div className="flex items-center gap-1">
              {(['No', 'Yes', 'Not sure'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setHasDeadline(opt)}
                  className={`px-2.5 py-0.5 rounded border transition-colors cursor-pointer ${hasDeadline === opt ? 'bg-primary text-bg font-semibold border-primary' : 'bg-white border-border text-ink-2 hover:border-primary'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Warnings & Off-topic refusal */}
        {charWarning && (
          <p className="text-[13px] text-warning flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{charWarning}</span>
          </p>
        )}

        {offTopicError && (
          <div className="p-4 bg-surface border border-border-strong rounded-md text-[14px] text-ink space-y-2 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-ink-3 shrink-0 mt-0.5" />
              <p>{offTopicError}</p>
            </div>
            <button
              type="button"
              onClick={() => setGuidedPickerOpen(true)}
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 ml-6"
            >
              <span>See what Jerri helps with (open guided picker)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setGuidedPickerOpen(true)}
            className="text-xs text-ink-3 hover:text-ink flex items-center gap-1 font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Not sure how to phrase it? Use guided path</span>
          </button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isValidLength}
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};
