import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SourceBadge } from './SourceBadge';
import { Button } from './Button';
import { ErrorCard } from './ErrorCard';
import { Skeleton } from './Skeleton';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Phone,
  Clock,
  MapPin,
  FileText,
  Calendar,
} from 'lucide-react';

export const SourceDrawer: React.FC = () => {
  const {
    activeSourceResource,
    closeSourceDrawer,
    openDemoNotice,
    addToast,
    demoSettings,
    incrementSourceFailure,
  } = useAppStore();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (activeSourceResource) {
      if (demoSettings.simulateSourceFailure && demoSettings.sourceFailureCount === 0) {
        setIsLoading(true);
        const timer = setTimeout(() => {
          setIsLoading(false);
          setHasError(true);
          incrementSourceFailure();
        }, 500);
        return () => clearTimeout(timer);
      } else {
        setHasError(false);
        setIsLoading(false);
      }
    }
  }, [activeSourceResource, demoSettings.simulateSourceFailure]);

  if (!activeSourceResource) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    addToast({ type: 'success', message: `Copied ${label}.` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeSourceDrawer}
        className="fixed inset-0 bg-ink/35 transition-opacity duration-med"
        aria-hidden="true"
      />

      {/* Drawer panel: Desktop right drawer 480px, mobile bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-drawer-title"
        className={`
          relative z-10 w-full md:w-[480px] bg-surface-elevated shadow-3 border-l border-border flex flex-col h-full
          max-md:rounded-t-lg max-md:max-h-[85vh] max-md:mt-auto
          animate-in slide-in-from-right duration-med
        `}
      >
        {/* Mobile handle */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-border-strong rounded-full" />
        </div>

        {/* Header */}
        <div className="p-5 border-b border-border flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <SourceBadge type={activeSourceResource.badge} lastChecked={activeSourceResource.lastChecked} />
              <span className="text-[12px] text-ink-3 uppercase tracking-wider font-semibold">
                {activeSourceResource.type}
              </span>
            </div>
            <h3 id="source-drawer-title" className="text-xl font-medium text-ink leading-snug">
              {activeSourceResource.name}
            </h3>
            <p className="text-[14px] text-ink-2 mt-1">{activeSourceResource.agency}</p>
          </div>
          <button
            type="button"
            onClick={closeSourceDrawer}
            className="p-1.5 text-ink-3 hover:text-ink rounded-md transition-colors"
            aria-label="Close source drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-left">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton count={4} />
              <Skeleton variant="card" />
            </div>
          ) : hasError ? (
            <ErrorCard
              title="Couldn't load this source"
              message="Check your connection or source service availability. (Triggered by demo simulation switch)"
              onRetry={handleRetry}
            />
          ) : (
            <>
              {/* Why this applies */}
              <div className="p-3.5 bg-primary-tint/40 border border-primary/20 rounded-md">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-primary block mb-1">
                  Why this applies to your case
                </span>
                <p className="text-[14px] text-ink leading-relaxed font-medium">
                  {activeSourceResource.why}
                </p>
              </div>

              {/* Summary overview */}
              {activeSourceResource.summary && (
                <div>
                  <h4 className="text-[14px] font-semibold text-ink uppercase tracking-wider text-ink-3 mb-1.5">
                    Official Overview
                  </h4>
                  <p className="text-[15px] text-ink-2 leading-relaxed">
                    {activeSourceResource.summary}
                  </p>
                </div>
              )}

              {/* Contact Details & Coordinates */}
              {activeSourceResource.contactDetails && (
                <div className="p-4 bg-surface border border-border rounded-md space-y-3">
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider text-ink-3">
                    Contact & Access Details
                  </h4>

                  {activeSourceResource.contactDetails.formNumber && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="flex items-center gap-2 text-ink-2">
                        <FileText className="w-4 h-4 text-ink-3" />
                        <span>Form ID: {activeSourceResource.contactDetails.formNumber}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeSourceResource.contactDetails!.formNumber!, 'Form ID')}
                        className="text-xs text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copiedField === 'Form ID' ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'Form ID' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {activeSourceResource.contactDetails.phone && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="flex items-center gap-2 text-ink-2">
                        <Phone className="w-4 h-4 text-ink-3" />
                        <span>{activeSourceResource.contactDetails.phone}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeSourceResource.contactDetails!.phone!, 'Phone')}
                        className="text-xs text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copiedField === 'Phone' ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'Phone' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {activeSourceResource.contactDetails.hours && (
                    <div className="flex items-start gap-2 text-[14px] text-ink-2">
                      <Clock className="w-4 h-4 text-ink-3 mt-0.5 shrink-0" />
                      <span>{activeSourceResource.contactDetails.hours}</span>
                    </div>
                  )}

                  {activeSourceResource.contactDetails.address && (
                    <div className="flex items-start gap-2 text-[14px] text-ink-2">
                      <MapPin className="w-4 h-4 text-ink-3 mt-0.5 shrink-0" />
                      <span>{activeSourceResource.contactDetails.address}</span>
                    </div>
                  )}

                  {activeSourceResource.contactDetails.url && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="flex items-center gap-2 text-ink-2 truncate pr-2">
                        <ExternalLink className="w-4 h-4 text-ink-3 shrink-0" />
                        <span className="truncate">{activeSourceResource.contactDetails.url}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeSourceResource.contactDetails!.url!, 'Link')}
                        className="text-xs text-primary font-medium flex items-center gap-1 hover:underline shrink-0 cursor-pointer"
                      >
                        {copiedField === 'Link' ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'Link' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Verification & Trust Marker */}
              <div className="flex items-center gap-2 text-[13px] text-ink-3 border-t border-border pt-4">
                <Calendar className="w-4 h-4 text-ink-3" />
                <span>Last verified by Ask Jerri editorial review: {activeSourceResource.lastChecked}</span>
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-between gap-3">
          <Button variant="secondary" size="md" onClick={closeSourceDrawer}>
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() =>
              openDemoNotice(
                activeSourceResource.name,
                activeSourceResource.contactDetails?.url || activeSourceResource.agency
              )
            }
            rightIcon={<ExternalLink className="w-4 h-4" />}
          >
            Open official site
          </Button>
        </div>
      </div>
    </div>
  );
};
