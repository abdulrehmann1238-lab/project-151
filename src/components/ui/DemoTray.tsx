import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from './Button';
import {
  Wrench,
  RotateCcw,
  Sparkles,
  WifiOff,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';

export const DemoTray: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    demoSettings,
    toggleSlowNetwork,
    toggleSourceFailure,
    setGuidedTourActive,
    resetDemoData,
  } = useAppStore();

  return (
    <div className="relative">
      {/* Demo Chip Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary-tint transition-all cursor-pointer"
        aria-label="Open Demo Settings and Controls"
      >
        <Wrench className="w-3.5 h-3.5 text-primary" />
        <span>Demo Controls</span>
        {demoSettings.simulateSlowNetwork && (
          <span className="w-1.5 h-1.5 rounded-full bg-warning" title="Slow network active" />
        )}
      </button>

      {/* Popover Tray */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-surface-elevated rounded-lg shadow-3 border border-border p-4 z-50 text-left animate-in fade-in zoom-in-95 duration-fast">
            <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Evaluator Demo Tray
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-ink-3 hover:text-ink p-1 rounded transition-colors"
                aria-label="Close demo settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13px] text-ink-2 mb-3 leading-relaxed">
              Use these switches to test edge cases, error fallbacks, and state resilience.
            </p>

            <div className="space-y-2.5 text-[14px]">
              {/* Simulate Slow Network */}
              <label className="flex items-center justify-between p-2 rounded-md hover:bg-surface border border-transparent hover:border-border cursor-pointer select-none">
                <span className="flex items-center gap-2 text-ink">
                  <WifiOff className="w-4 h-4 text-ink-3" />
                  <span>Slow network (3s delay)</span>
                </span>
                <input
                  type="checkbox"
                  checked={demoSettings.simulateSlowNetwork}
                  onChange={toggleSlowNetwork}
                  className="rounded text-primary focus:ring-accent w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Simulate Source Failure */}
              <label className="flex items-center justify-between p-2 rounded-md hover:bg-surface border border-transparent hover:border-border cursor-pointer select-none">
                <span className="flex items-center gap-2 text-ink">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span>Simulate source drawer error</span>
                </span>
                <input
                  type="checkbox"
                  checked={demoSettings.simulateSourceFailure}
                  onChange={toggleSourceFailure}
                  className="rounded text-primary focus:ring-accent w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Guided Tour Toggle */}
              <label className="flex items-center justify-between p-2 rounded-md hover:bg-surface border border-transparent hover:border-border cursor-pointer select-none">
                <span className="flex items-center gap-2 text-ink">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Guided walkthrough hints</span>
                </span>
                <input
                  type="checkbox"
                  checked={demoSettings.guidedTourActive}
                  onChange={(e) => setGuidedTourActive(e.target.checked)}
                  className="rounded text-primary focus:ring-accent w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => {
                  resetDemoData();
                  setIsOpen(false);
                }}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset demo data
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
