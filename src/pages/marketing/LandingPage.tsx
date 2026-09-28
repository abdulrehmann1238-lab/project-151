import React, { useState } from 'react';
import { Navbar } from '../../components/marketing/Navbar';
import { ProblemBox } from '../../components/domain/ProblemBox';
import { HeroVisual } from '../../components/marketing/HeroVisual';
import { StoryPanel } from '../../components/marketing/StoryPanel';
import { SituationGrid } from '../../components/marketing/SituationGrid';
import { SamplePlanSection } from '../../components/marketing/SamplePlanSection';
import { TrustSection } from '../../components/marketing/TrustSection';
import { Footer } from '../../components/marketing/Footer';
import { Loader } from '../../components/marketing/Loader';
import { ToastContainer } from '../../components/ui/Toast';
import { SourceDrawer } from '../../components/ui/SourceDrawer';
import { DemoNoticeModal } from '../../components/ui/DemoNoticeModal';
import { SignInModal } from '../../components/ui/SignInModal';
import { GuidedPickerModal } from '../../components/ui/GuidedPickerModal';
import { CommandPalette } from '../../components/ui/CommandPalette';
import { ArrowDown } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [loaderFinished, setLoaderFinished] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-ink relative antialiased selection:bg-primary-tint selection:text-primary">
      {/* 1.6s Staged Entry Sequence */}
      {!loaderFinished && <Loader onComplete={() => setLoaderFinished(true)} />}

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[calc(100svh-72px)] flex flex-col justify-between max-w-[1200px] mx-auto px-6 md:px-12 pt-8 pb-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center my-auto">
          {/* Left Column (7 of 12) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-tint/60 px-3 py-1 rounded-full">
                Real help for everyday problems
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-ink tracking-tight mt-3">
                Tell Jerri what's wrong. Get a plan.
              </h1>
            </div>

            <p className="text-[17px] sm:text-[18px] text-ink-2 leading-relaxed max-w-xl">
              Suspended license, missed unemployment claim, landlord holding your deposit. Describe it in your own words and get the exact next steps, forms, and offices.
            </p>

            {/* Problem Box */}
            <div className="pt-2">
              <ProblemBox variant="hero" />
            </div>
          </div>

          {/* Right Column (5 of 12): Live Untangling Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroVisual />
          </div>
        </div>

        {/* Scroll Cue (bottom) */}
        <div className="flex flex-col items-center justify-center pt-8 text-ink-3">
          <a
            href="#how-it-works"
            className="flex flex-col items-center gap-2 hover:text-ink transition-colors group cursor-pointer"
          >
            <span className="text-xs font-medium uppercase tracking-wider">How it works</span>
            <div className="w-[1.5px] h-8 bg-border-strong relative overflow-hidden">
              <div className="w-full h-3 bg-primary rounded-full animate-bounce" />
            </div>
          </a>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="w-full border-y border-border bg-surface py-5 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
            Built around official sources: state agencies, federal programs, consumer protection offices
          </p>
          <div className="flex items-center flex-wrap justify-center gap-6 text-xs font-medium text-ink-2">
            <span>California DMV</span>
            <span>·</span>
            <span>California EDD</span>
            <span>·</span>
            <span>CFPB Bureau</span>
            <span>·</span>
            <span>Judicial Council</span>
            <span>·</span>
            <span>Dept. of Insurance</span>
          </div>
        </div>
      </section>

      {/* Storytelling Pinned Section */}
      <StoryPanel />

      {/* Situations Grid */}
      <SituationGrid />

      {/* Sample Plan Section */}
      <SamplePlanSection />

      {/* Trust Section */}
      <TrustSection />

      {/* Footer & Closing CTA */}
      <Footer />

      {/* Global Overlays */}
      <ToastContainer />
      <SourceDrawer />
      <DemoNoticeModal />
      <SignInModal />
      <GuidedPickerModal />
      <CommandPalette />
    </div>
  );
};
