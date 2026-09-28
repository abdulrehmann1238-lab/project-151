import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/marketing/Navbar';
import { Footer } from '../../components/marketing/Footer';
import { SITUATION_CATEGORIES } from '../../data/copy';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, ArrowRight, HelpCircle, FileText } from 'lucide-react';
import { Category } from '../../types';

export const SituationsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { setDraftProblem, setDraftCategory, setGuidedPickerOpen } = useAppStore();

  const handleStartSituation = (category: Category, prompt: string) => {
    setDraftCategory(category);
    setDraftProblem(prompt);
    navigate('/app/new');
  };

  const filteredCategories = SITUATION_CATEGORIES.map((cat) => {
    const matchesSearch =
      cat.title.toLowerCase().includes(search.toLowerCase()) ||
      cat.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      cat.popularCases.some((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.prompt.toLowerCase().includes(search.toLowerCase())
      );

    return { ...cat, matches: matchesSearch };
  }).filter((cat) => cat.matches);

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-12 py-12 text-left space-y-10">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Situation Library
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-ink">
            Paperwork, resolved step by step.
          </h1>
          <p className="text-[16px] text-ink-2 leading-relaxed">
            Browse commonly encountered administrative issues or search below. Every scenario connects to verified forms and agencies.
          </p>
        </div>

        {/* Search Bar + Guided Trigger */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-6 border-b border-border">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search situations (e.g. license, deposit, severance)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setGuidedPickerOpen(true)}
            leftIcon={<HelpCircle className="w-4 h-4 text-accent" />}
          >
            Not sure where to start?
          </Button>
        </div>

        {/* Category Sections with Situation Rows */}
        <div className="space-y-12">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center bg-surface rounded-lg border border-border">
              <p className="text-ink-2">Nothing matches "{search}". Try searching another keyword.</p>
              <Button variant="secondary" size="sm" onClick={() => setSearch('')} className="mt-3">
                Clear search
              </Button>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <section key={cat.id} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div>
                    <h2 className="text-2xl font-serif font-medium text-ink">
                      {cat.title}
                    </h2>
                    <p className="text-xs text-ink-3 mt-0.5">{cat.shortDesc}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase">
                    {cat.popularCases.length} core scenarios
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3.5">
                  {cat.popularCases.map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleStartSituation(cat.id, c.prompt)}
                      className="p-4 rounded-md border border-border bg-surface hover:bg-surface-elevated hover:border-primary transition-all duration-fast cursor-pointer group flex items-start justify-between gap-3 shadow-1"
                    >
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-ink-3 group-hover:text-primary transition-colors" />
                          <h4 className="text-[15px] font-semibold text-ink group-hover:text-primary transition-colors">
                            {c.title}
                          </h4>
                        </div>
                        <p className="text-[13px] text-ink-2 line-clamp-2 pl-6">
                          "{c.prompt}"
                        </p>
                      </div>

                      <span className="text-xs font-medium text-primary flex items-center gap-1 shrink-0 pt-1">
                        <span className="hidden sm:inline">Start</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
