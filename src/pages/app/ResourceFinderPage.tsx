import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_RESOURCES } from '../../data/resources';
import { ResourceCard } from '../../components/domain/ResourceCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { Search, PlusCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { Category } from '../../types';

export const ResourceFinderPage: React.FC = () => {
  const navigate = useNavigate();
  const { setDraftProblem, setDraftCategory } = useAppStore();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Agencies' },
    { id: 'dmv', label: 'DMV' },
    { id: 'edd', label: 'Unemployment (EDD)' },
    { id: 'housing', label: 'Housing & Courts' },
    { id: 'credit', label: 'Credit (CFPB)' },
    { id: 'insurance', label: 'Insurance (CDI)' },
    { id: 'business', label: 'Small Business (SOS)' },
  ];

  const filteredResources = ALL_RESOURCES.filter((res) => {
    if (selectedCategory === 'dmv' && !res.id.includes('dmv')) return false;
    if (selectedCategory === 'edd' && !res.id.includes('edd')) return false;
    if (selectedCategory === 'housing' && !res.id.includes('housing')) return false;
    if (selectedCategory === 'credit' && !res.id.includes('credit') && !res.id.includes('cfpb')) return false;
    if (selectedCategory === 'insurance' && !res.id.includes('insurance')) return false;
    if (selectedCategory === 'business' && !res.id.includes('biz')) return false;

    if (query.trim()) {
      const q = query.toLowerCase();
      const match =
        res.name.toLowerCase().includes(q) ||
        res.agency.toLowerCase().includes(q) ||
        res.why.toLowerCase().includes(q) ||
        res.type.toLowerCase().includes(q) ||
        (res.contactDetails?.formNumber && res.contactDetails.formNumber.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleAskAboutResource = (resName: string, agency: string) => {
    setDraftProblem(`I need help submitting and following up on ${resName} with ${agency}.`);
    navigate('/app/new');
  };

  return (
    <div className="max-w-5xl mx-auto py-2 sm:py-6 text-left space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Verified Directory
        </span>
        <h1 className="text-3xl font-serif font-medium text-ink mt-1">
          Agency, Form & Portal Finder
        </h1>
        <p className="text-[15px] text-ink-2 mt-1">
          Find verified government forms, direct telephone units, and official hearing branches.
        </p>
      </div>

      {/* Large Search Box */}
      <div className="p-4 sm:p-5 bg-surface rounded-lg border border-border space-y-3">
        <Input
          placeholder="Search by agency, form name (e.g. DE 1101I, DL 44), or office..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="w-5 h-5 text-ink-3" />}
          className="h-12 text-[16px]"
          autoFocus
        />

        {/* Category Filter Chips */}
        <div className="flex items-center flex-wrap gap-1.5 pt-1 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${selectedCategory === c.id ? 'bg-primary text-bg font-semibold border-primary' : 'bg-white border-border text-ink-2 hover:border-primary'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-ink-3 border-b border-border pb-2">
        <span>Showing {filteredResources.length} verified official resources</span>
        <span>Updated within last 30 days</span>
      </div>

      {/* Results Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center bg-surface rounded-lg border border-border space-y-3">
          <p className="text-[14px] text-ink-2">
            Nothing matches "{query}". Try a broader keyword like "claim", "license", or "deposit".
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
          >
            Reset search
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <div key={res.id} className="relative group">
              <ResourceCard resource={res} />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAskAboutResource(res.name, res.agency);
                }}
                className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1 pl-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Start resolution plan for this resource</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
