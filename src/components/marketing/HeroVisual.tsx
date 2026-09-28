import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  const [phase, setPhase] = useState<'messy' | 'straightening' | 'steps' | 'checked'>('messy');
  const [activeScenario, setActiveScenario] = useState<0 | 1>(0); // 0: DMV, 1: Unemployment
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const scenarios = [
    {
      title: 'California DMV Hold Clearance',
      category: 'DMV and Driving',
      messyLabels: ['DMV letter?', 'points?', 'court date', 'fees?', 'who do I call?'],
      steps: [
        '1 Confirm suspension reason',
        '2 Gather documents',
        '3 Pay reinstatement fee',
        '4 Book DMV appointment',
      ],
    },
    {
      title: 'Unemployment Filing Roadmap',
      category: 'Unemployment & Work',
      messyLabels: ['last day?', 'ID.me error?', 'UI Online', 'severance tax', 'weekly claim?'],
      steps: [
        '1 Verify ID with ID.me',
        '2 Gather 18-mo pay history',
        '3 File UI Online claim',
        '4 Register with CalJOBS',
      ],
    },
  ];

  const current = scenarios[activeScenario];

  // 14s choreograph loop (pauses when hidden or reduced motion)
  useEffect(() => {
    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;
    let timer3: ReturnType<typeof setTimeout>;
    let timer4: ReturnType<typeof setTimeout>;

    const runLoop = () => {
      // 0s: start messy
      setPhase('messy');

      // 2.2s: straightening into clean spine
      timer1 = setTimeout(() => {
        setPhase('straightening');
      }, 2200);

      // 4.5s: settling into ordered steps
      timer2 = setTimeout(() => {
        setPhase('steps');
      }, 4500);

      // 7.5s: Step 2 ticks itself, progress nudges from 25% to 50%
      timer3 = setTimeout(() => {
        setPhase('checked');
      }, 7500);

      // 12s: switch scenario and reset
      timer4 = setTimeout(() => {
        setActiveScenario((prev) => (prev === 0 ? 1 : 0));
        runLoop();
      }, 12500);
    };

    runLoop();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Subtle 8px pointer parallax for interactive tactile feel
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const progressPercent = phase === 'checked' ? 50 : phase === 'steps' ? 25 : 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
      className="w-full max-w-[440px] aspect-[4/5] mx-auto bg-surface-elevated rounded-lg p-6 sm:p-7 border border-border shadow-2 flex flex-col justify-between transition-transform duration-150 ease-out select-none"
    >
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-border pb-3.5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-tint/60 px-2.5 py-0.5 rounded-full">
            {current.category}
          </span>
          <h4 className="text-[16px] font-serif font-medium text-ink mt-1.5">{current.title}</h4>
        </div>

        {/* Small live progress ring */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-10 h-10 transform -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="15"
              stroke="var(--border)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="20"
              cy="20"
              r="15"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeDasharray={94.2}
              style={{
                strokeDashoffset: 94.2 - (progressPercent / 100) * 94.2,
                transition: 'stroke-dashoffset 420ms ease-out',
              }}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="absolute text-[11px] font-semibold text-ink tabular-nums">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Untangling Stage (Upper / Mid Area) */}
      <div className="relative flex-1 my-4 flex flex-col items-center justify-center overflow-hidden">
        {phase === 'messy' ? (
          <div className="relative w-full h-44 animate-in fade-in duration-300">
            {/* Messy tangled ink strokes */}
            <svg viewBox="0 0 300 160" className="w-full h-full stroke-ink/70">
              <path
                d="M 30,50 Q 80,10 140,80 T 260,40"
                fill="none"
                strokeWidth="1.8"
                strokeDasharray="4,2"
              />
              <path
                d="M 50,110 Q 120,150 180,60 T 270,120"
                fill="none"
                strokeWidth="1.8"
              />
              <path
                d="M 40,80 C 100,20 180,140 250,70"
                fill="none"
                strokeWidth="2"
              />
            </svg>

            {/* Floating anxiety fragments */}
            {current.messyLabels.map((lbl, idx) => {
              const positions = [
                'top-3 left-4',
                'top-6 right-8',
                'bottom-8 left-8',
                'bottom-4 right-12',
                'top-20 left-28',
              ];
              return (
                <span
                  key={idx}
                  className={`absolute ${positions[idx]} px-2 py-0.5 rounded bg-surface border border-border text-[11px] font-medium text-ink-2 shadow-1 animate-pulse`}
                >
                  {lbl}
                </span>
              );
            })}
          </div>
        ) : (
          /* Untangled vertical spine resolving into ordered steps */
          <div className="w-full h-full flex flex-col justify-center pl-6 relative animate-in fade-in slide-in-from-bottom-2 duration-slow">
            {/* Straight vertical spine */}
            <div className="absolute left-7 top-4 bottom-4 w-[2px] bg-primary/40" />

            <div className="space-y-3.5 relative">
              {current.steps.map((st, i) => {
                const isStep1Done = i === 0;
                const isStep2Done = i === 1 && phase === 'checked';
                const isStep2Current = i === 1 && phase === 'steps';

                return (
                  <div key={i} className="flex items-center gap-3">
                    {/* Node on spine */}
                    <div
                      className={`
                        w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center -ml-[11px] z-10 transition-colors
                        ${isStep1Done || isStep2Done ? 'bg-success border-success text-white' : isStep2Current ? 'border-accent bg-accent text-white' : 'border-border-strong'}
                      `}
                    >
                      {(isStep1Done || isStep2Done) && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div
                      className={`
                        flex-1 p-2.5 rounded border text-[13px] font-medium transition-all duration-300
                        ${isStep1Done || isStep2Done ? 'bg-surface/60 border-border line-through text-ink-3' : isStep2Current ? 'bg-accent-tint/40 border-accent/40 text-ink shadow-1 font-semibold' : 'bg-surface-elevated border-border text-ink-2'}
                      `}
                    >
                      {st}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Untangling Caption */}
      <div className="border-t border-border pt-3 flex items-center justify-between text-[12px] text-ink-3">
        <span className="italic">
          {phase === 'messy'
            ? 'Messy situation...'
            : phase === 'straightening'
            ? 'Untangling into verified sequence...'
            : phase === 'checked'
            ? 'Step 2 completed · Progress updated'
            : 'Ordered resolution plan'}
        </span>
        <span className="font-semibold text-primary uppercase tracking-wider text-[11px]">
          Demo Loop
        </span>
      </div>
    </div>
  );
};
