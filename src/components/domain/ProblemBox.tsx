import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { ArrowRight, AlertCircle, HelpCircle } from 'lucide-react';
import { ROTATING_EXAMPLES } from '../../data/copy';
import { classifyProblem } from '../../mock/classify';

export interface ProblemBoxProps {
  variant?: 'hero' | 'compact' | 'footer';
  className?: string;
  initialText?: string;
  onSubmitted?: () => void;
}

export const ProblemBox: React.FC<ProblemBoxProps> = ({
  variant = 'hero',
  className = '',
  initialText = '',
  onSubmitted,
}) => {
  const navigate = useNavigate();
  const { setDraftProblem, setDraftUnderstanding, setDraftCategory, setGuidedPickerOpen } = useAppStore();

  const [text, setText] = useState(initialText);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTypingAnimation, setIsTypingAnimation] = useState(false);
  const [offTopicError, setOffTopicError] = useState<string | null>(null);
  const [charWarning, setCharWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Rotating placeholder every 4 seconds when input is empty
  useEffect(() => {
    if (text.length > 0 || isTypingAnimation) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_EXAMPLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [text, isTypingAnimation]);

  // Wow moment #1: Type character by character when an example chip is clicked (35ms per char)
  const handleChipClick = (exampleText: string) => {
    if (isTypingAnimation) return;
    setOffTopicError(null);
    setText('');
    setIsTypingAnimation(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      setText(exampleText.slice(0, currentIndex));

      if (currentIndex >= exampleText.length) {
        clearInterval(interval);
        setIsTypingAnimation(false);
        submitButtonRef.current?.focus();
      }
    }, 35);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (text.trim().length < 12) {
      setCharWarning('Please provide a bit more detail (at least 12 characters).');
      return;
    }

    setCharWarning(null);

    // Classification & off-topic check
    const understanding = classifyProblem(text);

    if (understanding.offTopic) {
      setOffTopicError(
        understanding.offTopicMessage ||
          'Jerri helps with everyday problems and paperwork, not open-ended questions. Try describing something you’re trying to fix or file.'
      );
      return;
    }

    setIsSubmitting(true);
    setDraftProblem(text);
    setDraftUnderstanding(understanding);
    setDraftCategory(understanding.category);

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmitted) {
        onSubmitted();
      } else {
        // Navigate to the Understanding screen for the new case
        navigate('/app/case/new/understanding');
      }
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`w-full text-left ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            relative bg-surface-elevated rounded-md border border-border-strong p-3.5 sm:p-4 shadow-1
            transition-all duration-fast focus-within:border-primary focus-within:ring-3 focus-within:ring-primary-tint
            ${offTopicError ? 'border-error ring-2 ring-error/20' : ''}
          `}
        >
          <textarea
            ref={textareaRef}
            rows={variant === 'hero' ? 3 : 2}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (offTopicError) setOffTopicError(null);
              if (charWarning) setCharWarning(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={ROTATING_EXAMPLES[placeholderIndex]}
            aria-label="Describe your problem"
            className="w-full bg-transparent text-[16px] text-ink placeholder:text-ink-3/80 placeholder:transition-opacity placeholder:duration-300 resize-none outline-none leading-relaxed"
          />

          {/* Action Row inside bottom */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-border/60 mt-1">
            <span className="text-[12px] text-ink-3 hidden sm:inline">
              Press <kbd className="px-1 py-0.5 bg-surface border border-border rounded text-[11px] font-mono">⌘+Enter</kbd> to submit
            </span>

            <div className="flex items-center justify-end w-full sm:w-auto">
              <Button
                ref={submitButtonRef}
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Get my plan
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Warnings & Off-topic refusal */}
      {charWarning && (
        <p className="text-[13px] text-warning mt-2 flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{charWarning}</span>
        </p>
      )}

      {offTopicError && (
        <div className="mt-3 p-3.5 bg-surface border border-border-strong rounded-md text-[14px] text-ink leading-relaxed flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-ink-3 shrink-0 mt-0.5" />
          <div>
            <p>{offTopicError}</p>
            <button
              type="button"
              onClick={() => setGuidedPickerOpen(true)}
              className="text-xs font-semibold text-primary hover:underline mt-1.5 inline-flex items-center gap-1"
            >
              <span>See situations Jerri helps with</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Example Chips below the box (as specified in Section 6.2) */}
      {variant === 'hero' && (
        <div className="mt-3 flex items-center flex-wrap gap-2">
          <span className="text-[13px] text-ink-3 font-medium mr-1">Or try:</span>
          {ROTATING_EXAMPLES.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(example)}
              className="text-xs px-2.5 py-1.5 bg-surface hover:bg-primary-tint/60 text-ink-2 hover:text-ink rounded-full border border-border hover:border-primary/40 transition-colors cursor-pointer text-left"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
