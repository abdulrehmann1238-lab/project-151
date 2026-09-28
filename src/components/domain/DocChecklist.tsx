import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FileCheck2, Check } from 'lucide-react';

export interface DocChecklistProps {
  documents: { name: string; checked: boolean }[];
  caseId: string;
  className?: string;
}

export const DocChecklist: React.FC<DocChecklistProps> = ({
  documents,
  caseId,
  className = '',
}) => {
  const { toggleDocumentChecked } = useAppStore();

  if (!documents || documents.length === 0) return null;

  return (
    <div className={`p-4 bg-surface rounded-md border border-border text-left space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <FileCheck2 className="w-4 h-4 text-primary" />
        <h4 className="text-[13px] font-semibold uppercase tracking-wider text-ink">
          Documents to Gather
        </h4>
      </div>

      <div className="space-y-1.5">
        {documents.map((doc, idx) => (
          <label
            key={idx}
            className="flex items-start gap-2.5 p-2 rounded hover:bg-surface-elevated cursor-pointer select-none transition-colors border border-transparent hover:border-border"
          >
            <div className="pt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={doc.checked}
                onChange={() => toggleDocumentChecked(caseId, doc.name)}
                className="w-4 h-4 rounded text-primary focus:ring-accent cursor-pointer"
              />
            </div>
            <span
              className={`text-[13px] leading-snug transition-colors ${doc.checked ? 'line-through text-ink-3' : 'text-ink-2'}`}
            >
              {doc.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
