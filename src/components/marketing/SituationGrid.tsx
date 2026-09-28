import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { SITUATION_CATEGORIES } from '../../data/copy';
import {
  CarFront,
  Briefcase,
  Home,
  CreditCard,
  ShieldCheck,
  Receipt,
  Building2,
  Store,
  Landmark,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { Category } from '../../types';

export const SituationGrid: React.FC = () => {
  const navigate = useNavigate();
  const { setDraftCategory, setDraftProblem, setGuidedPickerOpen } = useAppStore();

  const getIcon = (name: string) => {
    switch (name) {
      case 'CarFront':
        return <CarFront className="w-5 h-5 text-primary" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-primary" />;
      case 'Home':
        return <Home className="w-5 h-5 text-primary" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-primary" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-primary" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-primary" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-primary" />;
      case 'Store':
        return <Store className="w-5 h-5 text-primary" />;
      case 'Landmark':
      default:
        return <Landmark className="w-5 h-5 text-primary" />;
    }
  };

  const handleSelectCategory = (cat: Category, examplePrompt: string) => {
    setDraftCategory(cat);
    setDraftProblem(examplePrompt);
    navigate('/app/new');
  };

  return (
    <section id="situations" className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto text-left">
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Where to start
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-medium text-ink mt-2">
          Whatever you’re stuck on, Jerri has seen the paperwork.
        </h2>
        <p className="text-[16px] text-ink-2 mt-3 leading-relaxed">
          From state DMV holds and unemployment appeals to unreturned deposits and credit disputes. Select a category below or let Jerri guide you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SITUATION_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelectCategory(cat.id, cat.popularCases[0]?.prompt || cat.example)}
            className="p-6 rounded-md border border-border bg-surface hover:bg-primary-tint/30 hover:border-primary transition-all duration-180 cursor-pointer flex flex-col justify-between group shadow-1 hover:shadow-2"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 rounded bg-surface-elevated border border-border group-hover:border-primary/40 transition-colors">
                  {getIcon(cat.iconName)}
                </span>
                <span className="text-xs text-ink-3 font-semibold uppercase tracking-wider">
                  {cat.count} situations
                </span>
              </div>

              <h3 className="text-xl font-medium text-ink group-hover:text-primary transition-colors">
                {cat.title}
              </h3>

              <p className="text-[14px] text-ink-2 mt-2 leading-relaxed">
                {cat.shortDesc}
              </p>

              <div className="mt-4 p-2.5 rounded bg-surface-elevated border border-border-strong/60 text-xs text-ink-3 italic line-clamp-1">
                "{cat.example}"
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
              <span>Start with this category</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}

        {/* 10th Tile: Guided Picker card */}
        <div
          onClick={() => setGuidedPickerOpen(true)}
          className="p-6 rounded-md border-2 border-dashed border-accent/40 bg-accent-tint/30 hover:bg-accent-tint/50 transition-all duration-180 cursor-pointer flex flex-col justify-between group text-left"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-medium text-ink group-hover:text-accent transition-colors">
              Not sure where to start?
            </h3>

            <p className="text-[14px] text-ink-2 mt-2 leading-relaxed">
              If your situation spans multiple offices or you don’t know what paperwork to ask for, answer three simple questions.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-accent/30 flex items-center justify-between text-xs font-semibold text-accent">
            <span>Open 3-step guided path</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </section>
  );
};
