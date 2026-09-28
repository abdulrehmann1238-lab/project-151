import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Search,
  PlusCircle,
  MoreVertical,
  Trash2,
  Copy,
  Calendar,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { Case } from '../../types';

export const MyCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases, setActiveCaseId, deleteCase, addToast } = useAppStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'deadline'>('updated');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (
        search.trim() &&
        !c.title.toLowerCase().includes(search.toLowerCase()) &&
        !c.situation.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [cases, search, statusFilter, categoryFilter]);

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    navigate(`/app/case/${caseId}/plan`);
  };

  const handleDuplicate = (c: Case) => {
    addToast({
      type: 'info',
      message: `Duplicated case "${c.title}".`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-6 text-left space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-ink">
            My Cases
          </h1>
          <p className="text-[15px] text-ink-2 mt-1">
            Track active resolution roadmaps, court deadlines, and agency status.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/app/new')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          New problem
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-surface rounded-lg border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search by case title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-3 bg-white border border-border-strong rounded text-ink font-medium focus:ring-accent outline-none cursor-pointer text-xs"
          >
            <option value="all">All statuses</option>
            <option value="In progress">In progress</option>
            <option value="Waiting on agency">Waiting on agency</option>
            <option value="Resolved">Resolved</option>
            <option value="Not started">Not started</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 px-3 bg-white border border-border-strong rounded text-ink font-medium focus:ring-accent outline-none cursor-pointer text-xs"
          >
            <option value="all">All categories</option>
            <option value="dmv">DMV</option>
            <option value="unemployment">Unemployment</option>
            <option value="housing">Housing</option>
            <option value="credit">Credit</option>
            <option value="insurance">Insurance</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-11 px-3 bg-white border border-border-strong rounded text-ink font-medium focus:ring-accent outline-none cursor-pointer text-xs"
          >
            <option value="updated">Recently updated</option>
            <option value="deadline">Upcoming deadline</option>
          </select>
        </div>
      </div>

      {/* Cases Table (Desktop) / Cards (Mobile) */}
      {filteredCases.length === 0 ? (
        <div className="p-12 text-center bg-surface rounded-lg border border-border space-y-3">
          <Briefcase className="w-8 h-8 text-ink-3 mx-auto" />
          <h3 className="text-lg font-medium text-ink">No cases found</h3>
          <p className="text-sm text-ink-2 max-w-sm mx-auto">
            {search
              ? `Nothing matches "${search}". Try a shorter search term.`
              : 'You have no cases matching the selected filters.'}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-surface-elevated rounded-lg border border-border shadow-1 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-ink-3 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Case</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 w-40">Progress</th>
                  <th className="py-3.5 px-4">Next Deadline</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCases.map((c) => {
                  const doneCount = c.steps.filter((s) => s.status === 'done').length;
                  const total = c.steps.length;
                  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
                  const urgentDeadline = c.deadlines[0]?.dateStr || 'None';

                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleOpenCase(c.id)}
                      className="hover:bg-surface transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-5">
                        <span className="font-semibold text-sm text-ink group-hover:text-primary transition-colors block">
                          {c.title}
                        </span>
                        <span className="text-xs text-ink-3 line-clamp-1 max-w-xs">
                          {c.situation}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-surface border border-border text-ink-2 font-medium uppercase text-[10px]">
                          {c.category}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`
                            px-2 py-0.5 rounded-full font-semibold text-[11px]
                            ${c.status === 'Resolved' ? 'bg-success/10 text-success' : c.status === 'In progress' ? 'bg-primary-tint text-primary' : 'bg-surface border border-border text-ink-2'}
                          `}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-ink-2 font-medium tabular-nums">
                            <span>{percent}%</span>
                            <span>{doneCount}/{total}</span>
                          </div>
                          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-ink-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-warning shrink-0" />
                          <span className="truncate max-w-[140px]">{urgentDeadline}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-ink-3 tabular-nums">
                        {c.updatedAt}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(activeMenuId === c.id ? null : c.id)}
                            className="p-1.5 text-ink-3 hover:text-ink rounded transition-colors"
                            aria-label="Case menu"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === c.id && (
                            <>
                              <div
                                onClick={() => setActiveMenuId(null)}
                                className="fixed inset-0 z-30"
                                aria-hidden="true"
                              />
                              <div className="absolute right-0 top-full mt-1 w-36 bg-surface-elevated rounded shadow-2 border border-border p-1 z-40 space-y-0.5 text-left text-xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    handleDuplicate(c);
                                  }}
                                  className="w-full px-2.5 py-1.5 text-ink hover:bg-surface rounded flex items-center gap-2 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Duplicate</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    deleteCase(c.id);
                                  }}
                                  className="w-full px-2.5 py-1.5 text-error hover:bg-error/10 rounded flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="md:hidden space-y-3">
            {filteredCases.map((c) => {
              const doneCount = c.steps.filter((s) => s.status === 'done').length;
              const total = c.steps.length;
              const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

              return (
                <div
                  key={c.id}
                  onClick={() => handleOpenCase(c.id)}
                  className="p-4 rounded-lg border border-border bg-surface-elevated shadow-1 space-y-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase">
                      {c.category}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface border border-border text-ink-2">
                      {c.status}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-ink">{c.title}</h3>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-ink-3">
                      <span>Progress</span>
                      <span>{doneCount} of {total} done ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-ink-3">
                    <span>Updated {c.updatedAt}</span>
                    <span className="font-semibold text-primary flex items-center gap-1">
                      <span>Open plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
