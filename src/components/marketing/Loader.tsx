import React, { useState, useEffect } from 'react';

export const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'initial' | 'straightening' | 'wordmark' | 'progress' | 'exit'>('initial');
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    // Check if loader was already shown this session
    try {
      const alreadyShown = sessionStorage.getItem('ask_jerri_loader_shown');
      if (alreadyShown === 'true') {
        onComplete();
        return;
      }
    } catch (e) {
      // storage not available, proceed with animation
    }

    const t1 = setTimeout(() => setPhase('straightening'), 120);
    const t2 = setTimeout(() => setPhase('wordmark'), 550);
    const t3 = setTimeout(() => {
      setPhase('progress');
      setProgressWidth(100);
    }, 750);
    const t4 = setTimeout(() => setPhase('exit'), 1200);
    const t5 = setTimeout(() => {
      try {
        sessionStorage.setItem('ask_jerri_loader_shown', 'true');
      } catch (e) {}
      onComplete();
    }, 1550);

    const handleSkip = () => {
      try {
        sessionStorage.setItem('ask_jerri_loader_shown', 'true');
      } catch (e) {}
      onComplete();
    };

    window.addEventListener('keydown', handleSkip);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      window.removeEventListener('keydown', handleSkip);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`
        fixed inset-0 z-50 bg-bg flex flex-col items-center justify-center select-none cursor-pointer
        transition-opacity duration-400 ease-in-out
        ${phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
    >
      <div
        className={`
          flex flex-col items-center text-center transition-transform duration-300
          ${phase === 'exit' ? '-translate-y-3' : 'translate-y-0'}
        `}
      >
        {/* Six thin loose strokes resolving into single vertical line */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-4">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            {phase === 'initial' || phase === 'straightening' ? (
              <g stroke="var(--ink)" strokeWidth="1.5" fill="none" strokeLinecap="round">
                {/* 6 curving strokes straightening into center spine */}
                <path
                  d={phase === 'initial' ? 'M 20,20 Q 30,60 50,50' : 'M 50,20 L 50,70'}
                  className="transition-all duration-500 ease-in-out"
                />
                <path
                  d={phase === 'initial' ? 'M 80,25 Q 65,40 50,50' : 'M 50,20 L 50,70'}
                  className="transition-all duration-500 ease-in-out"
                />
                <path
                  d={phase === 'initial' ? 'M 35,80 Q 40,55 50,50' : 'M 50,20 L 50,70'}
                  className="transition-all duration-500 ease-in-out"
                />
                <path
                  d={phase === 'initial' ? 'M 65,75 Q 55,60 50,50' : 'M 50,20 L 50,70'}
                  className="transition-all duration-500 ease-in-out"
                />
                <path
                  d={phase === 'initial' ? 'M 15,50 Q 35,45 50,50' : 'M 50,20 L 50,70'}
                  className="transition-all duration-500 ease-in-out"
                />
                <path
                  d={phase === 'initial' ? 'M 85,55 Q 65,55 50,50' : 'M 50,20 L 50,70'}
                  className="transition-all duration-500 ease-in-out"
                />
              </g>
            ) : (
              /* Resolved 'J' Monogram */
              <g
                stroke="var(--primary)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-in fade-in zoom-in-95 duration-200"
              >
                <path d="M 58,22 L 58,62 A 14,14 0 0,1 44,76 L 41,76 A 14,14 0 0,1 27,62 L 27,59 L 34,59 L 34,62 A 7,7 0 0,0 41,69 L 44,69 A 7,7 0 0,0 51,62 L 51,22 Z" />
              </g>
            )}
          </svg>
        </div>

        {/* Wordmark "Ask Jerri" */}
        <div
          className={`
            transition-all duration-300
            ${phase === 'wordmark' || phase === 'progress' || phase === 'exit' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}
        >
          <span className="font-serif font-medium text-2xl tracking-tight text-ink">
            Ask Jerri
          </span>
        </div>

        {/* 2px Progress Hairline */}
        <div className="w-32 h-[2px] bg-border-strong rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
};
