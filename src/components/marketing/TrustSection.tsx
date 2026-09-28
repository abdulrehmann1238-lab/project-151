import React from 'react';
import { ShieldCheck, Scale, Lock } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto text-left">
      <div className="max-w-2xl mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Trust & Guardrails
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-medium text-ink mt-2">
          Designed for high-stakes, stressful moments.
        </h2>
        <p className="text-[16px] text-ink-2 mt-3 leading-relaxed">
          When dealing with a court date or lost benefits, guessing is dangerous. Jerri is engineered with strict boundaries.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Column 1 */}
        <div className="pt-6 border-t-2 border-primary/30 space-y-3">
          <span className="font-serif text-3xl font-semibold text-primary block">
            01
          </span>
          <h3 className="text-2xl font-serif font-medium text-ink flex items-center gap-2">
            <span>Sources you can verify</span>
          </h3>
          <p className="text-[15px] text-ink-2 leading-relaxed">
            Every plan step is grounded in public statutes and links directly to official government or court portals, complete with a visible last-verified date.
          </p>
        </div>

        {/* Column 2 */}
        <div className="pt-6 border-t-2 border-primary/30 space-y-3">
          <span className="font-serif text-3xl font-semibold text-primary block">
            02
          </span>
          <h3 className="text-2xl font-serif font-medium text-ink flex items-center gap-2">
            <span>Knows its limits</span>
          </h3>
          <p className="text-[15px] text-ink-2 leading-relaxed">
            Jerri does not pretend to be an attorney or financial advisor. If an administrative case requires licensed representation, Jerri tells you plainly and points you to free legal aid clinics.
          </p>
        </div>

        {/* Column 3 */}
        <div className="pt-6 border-t-2 border-primary/30 space-y-3">
          <span className="font-serif text-3xl font-semibold text-primary block">
            03
          </span>
          <h3 className="text-2xl font-serif font-medium text-ink flex items-center gap-2">
            <span>Your case stays yours</span>
          </h3>
          <p className="text-[15px] text-ink-2 leading-relaxed">
            No advertising trackers, no selling your personal data to lead-generation brokers. Your case is private by default and can be permanently deleted with one click anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
