import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ALL_RESOURCES } from '../../data/resources';
import { ResourceCard } from '../../components/domain/ResourceCard';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Filter, ShieldCheck } from 'lucide-react';
import { Resource } from '../../types';

export const CaseResourcesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cases } = useAppStore();

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  const [filterType, setFilterType] = useState<string>('all');
  const [officialOnly, setOfficialOnly] = useState<boolean>(true);

  if (!currentCase) {
    return <div className="p-8 text-center text-ink-2">Case not found.</div>;
  }

  // Get resource IDs used in this case's steps
  const caseResourceIds = Array.from(
    new Set(currentCase.steps.flatMap((s) => s.resourceIds))
  );

  // If case has specific resources, show them; or show all for that category
  let relevantResources = ALL_RESOURCES.filter((r) => caseResourceIds.includes(r.id));
  if (relevantResources.length === 0) {
    // Fallback to top resources
    relevantResources = ALL_RESOURCES.slice(0, 6);
  }

  const filteredResources = relevantResources.filter((r) => {
    if (officialOnly && r.badge !== 'official') return false;
    if (filterType !== 'all' && r.type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-2 sm:py-6 text-left space-y-6">
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(`/app/case/${currentCase.id}/plan`)}
          className="text-xs text-ink-3 hover:text-ink flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to plan</span>
        </button>

        <span className="text-xs text-ink-3">
          Case: <strong className="text-ink">{currentCase.title}</strong>
        </span>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Verified Sources & Forms
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-ink">
          Official Resources for Your Case
        </h1>
        <p className="text-[15px] text-ink-2 leading-relaxed">
          Every form number, government department, and public portal used across your resolution plan steps.
        </p>
      </div>

      {/* Filter Row & Official Sources Only Toggle */}
      <div className="p-4 bg-surface rounded-md border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Type filters */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <span className="font-semibold text-ink-3 uppercase mr-1">Filter:</span>
          {(['all', 'website', 'form', 'office', 'phone'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-full border capitalize transition-colors cursor-pointer ${filterType === t ? 'bg-primary text-bg font-semibold border-primary' : 'bg-surface-elevated border-border text-ink-2 hover:border-primary'}`}
            >
              {t === 'all' ? 'All types' : `${t}s`}
            </button>
          ))}
        </div>

        {/* Official Only Toggle */}
        <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer select-none">
          <input
            type="checkbox"
            checked={officialOnly}
            onChange={(e) => setOfficialOnly(e.target.checked)}
            className="rounded text-primary focus:ring-accent w-4 h-4 cursor-pointer"
          />
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Official government sources only</span>
        </label>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-10 text-center bg-surface rounded-lg border border-border space-y-3">
          <p className="text-[14px] text-ink-2">
            Nothing matches those filters.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setFilterType('all');
              setOfficialOnly(false);
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      )}
    </div>
  );
};
