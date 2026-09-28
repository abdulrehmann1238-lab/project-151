import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ALL_RESOURCES } from '../../data/resources';
import { SITUATION_CATEGORIES } from '../../data/copy';
import {
  Search,
  PlusCircle,
  FileText,
  Briefcase,
  HelpCircle,
  CarFront,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    cases,
    setActiveCaseId,
    openSourceDrawer,
    setGuidedPickerOpen,
    resetDemoData,
  } = useAppStore();

  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Handle global Cmd/Ctrl+K hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[560px] bg-surface-elevated rounded-lg shadow-3 border border-border overflow-hidden animate-in zoom-in-95 duration-150 text-left"
      >
        <Command label="Global Command Menu" className="flex flex-col w-full">
          <div className="flex items-center px-4 border-b border-border">
            <Search className="w-5 h-5 text-ink-3 mr-3 shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search cases, situations, official resources, or actions..."
              className="w-full h-14 bg-transparent text-[16px] text-ink placeholder:text-ink-3 outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs text-ink-3 bg-surface border border-border rounded font-mono">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[360px] overflow-y-auto p-2 space-y-1">
            <Command.Empty className="p-6 text-center text-[14px] text-ink-2">
              Nothing matches "{search}". Try a shorter search or browse situations.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Actions" className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3">
              <Command.Item
                onSelect={() => {
                  setCommandPaletteOpen(false);
                  navigate('/app/new');
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] text-ink hover:bg-primary-tint hover:text-primary cursor-pointer transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-primary" />
                <span>Start a new problem plan</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setCommandPaletteOpen(false);
                  setGuidedPickerOpen(true);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] text-ink hover:bg-primary-tint hover:text-primary cursor-pointer transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-accent" />
                <span>Not sure where to start (Guided picker)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setCommandPaletteOpen(false);
                  resetDemoData();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] text-ink hover:bg-primary-tint hover:text-primary cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-ink-3" />
                <span>Reset demo to initial state</span>
              </Command.Item>
            </Command.Group>

            {/* Active / Saved Cases */}
            <Command.Group heading="My Cases" className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3 pt-2">
              {cases.map((c) => (
                <Command.Item
                  key={c.id}
                  value={`${c.title} ${c.situation} ${c.category}`}
                  onSelect={() => {
                    setActiveCaseId(c.id);
                    setCommandPaletteOpen(false);
                    navigate(`/app/case/${c.id}/plan`);
                  }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-[14px] text-ink hover:bg-primary-tint hover:text-primary cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-4 h-4 text-ink-3 shrink-0" />
                    <span className="font-medium truncate">{c.title}</span>
                  </div>
                  <span className="text-xs text-ink-3 shrink-0 uppercase">{c.status}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Situation Library */}
            <Command.Group heading="Situations" className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3 pt-2">
              {SITUATION_CATEGORIES.map((cat) => (
                <Command.Item
                  key={cat.id}
                  value={`${cat.title} ${cat.shortDesc} ${cat.example}`}
                  onSelect={() => {
                    setCommandPaletteOpen(false);
                    navigate('/situations');
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] text-ink hover:bg-primary-tint hover:text-primary cursor-pointer transition-colors"
                >
                  <CarFront className="w-4 h-4 text-ink-3" />
                  <div>
                    <p className="font-medium">{cat.title}</p>
                    <p className="text-xs text-ink-3 truncate max-w-sm">{cat.example}</p>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Resources Finder */}
            <Command.Group heading="Official Resources" className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3 pt-2">
              {ALL_RESOURCES.slice(0, 6).map((res) => (
                <Command.Item
                  key={res.id}
                  value={`${res.name} ${res.agency} ${res.type}`}
                  onSelect={() => {
                    setCommandPaletteOpen(false);
                    openSourceDrawer(res);
                  }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-[14px] text-ink hover:bg-primary-tint hover:text-primary cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <ExternalLink className="w-4 h-4 text-ink-3 shrink-0" />
                    <span className="truncate">{res.name}</span>
                  </div>
                  <span className="text-xs text-primary font-medium shrink-0 ml-2">Open source</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
