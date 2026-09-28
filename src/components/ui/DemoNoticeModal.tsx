import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, X, ExternalLink } from 'lucide-react';
import { Button } from './Button';

export const DemoNoticeModal: React.FC = () => {
  const { demoNoticeModal, closeDemoNotice } = useAppStore();

  if (!demoNoticeModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-notice-title"
        className="w-full max-w-md bg-surface-elevated rounded-lg p-6 shadow-3 border border-border relative animate-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={closeDemoNotice}
          className="absolute top-4 right-4 p-1.5 text-ink-3 hover:text-ink rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-primary-tint flex items-center justify-center text-primary mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 id="demo-notice-title" className="text-xl font-medium text-ink mb-2">
          Demo Resource Link
        </h3>

        <p className="text-[15px] text-ink-2 leading-relaxed mb-4">
          In production, this button would connect directly to official services at{' '}
          <span className="font-semibold text-ink font-mono text-sm px-1.5 py-0.5 bg-surface rounded border border-border">
            {demoNoticeModal.url || demoNoticeModal.title}
          </span>
          .
        </p>

        <div className="p-3.5 bg-surface rounded-md border border-border text-[13px] text-ink-2 leading-normal mb-6">
          <strong>Ask Jerri Demo Guardrail:</strong> External navigation is intentionally isolated so no live agency filings or third-party tracking are triggered during product demonstrations.
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="primary" size="md" onClick={closeDemoNotice} fullWidth>
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
};
