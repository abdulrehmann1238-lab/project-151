import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Check, Info, AlertCircle, RotateCcw, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4"
    >
      {toasts.map((toast) => {
        const isUndo = toast.type === 'undo';
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto w-full flex items-center justify-between gap-3 px-4 py-3 bg-ink text-bg rounded-md shadow-2 text-[14px] font-medium border border-ink-2/30 animate-in fade-in slide-in-from-bottom-2 duration-fast"
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-sky-300 shrink-0" />}
              <span>{toast.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isUndo && toast.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onUndo?.();
                    removeToast(toast.id);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[13px] font-semibold text-accent-tint bg-accent/30 hover:bg-accent/40 rounded-sm transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-ink-3 hover:text-bg transition-colors p-1"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
