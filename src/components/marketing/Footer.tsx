import React from 'react';
import { Link } from 'react-router-dom';
import { ProblemBox } from '../domain/ProblemBox';
import { Logo } from '../domain/Logo';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-primary text-bg overflow-hidden relative pt-20 pb-12 text-left">
      {/* Closing CTA */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-20 border-b border-primary-hover">
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-bg/70">
            Take the first step
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-bg">
            Stuck? Start here.
          </h2>
          <p className="text-[16px] text-bg/80 leading-relaxed max-w-lg mx-auto">
            You don't need all the answers or the right forms right now. Just tell Jerri what's going on.
          </p>
        </div>

        {/* Problem box on light surface */}
        <div className="max-w-2xl mx-auto">
          <ProblemBox variant="hero" />
          <div className="text-center mt-4">
            <Link
              to="/situations"
              className="text-[14px] text-bg/80 hover:text-bg underline font-medium inline-flex items-center gap-1"
            >
              <span>or browse all 9 situation categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4-Column Footer Navigation */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-16 pb-12 grid grid-cols-2 md:grid-cols-4 gap-10 text-[14px]">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-bg text-primary flex items-center justify-center font-serif font-bold text-sm">
              J
            </div>
            <span className="font-serif font-medium text-xl text-bg">Ask Jerri</span>
          </div>
          <p className="text-bg/70 text-xs leading-relaxed max-w-xs">
            Built to make administrative and bureaucratic systems a little easier to navigate.
          </p>
          <p className="text-bg/50 text-[11px] pt-2">
            © 2026 Ask Jerri Inc. All rights reserved.
          </p>
        </div>

        {/* Product */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-bg/90">
            Product
          </h4>
          <ul className="space-y-2 text-bg/75 text-[14px]">
            <li>
              <Link to="/situations" className="hover:text-bg transition-colors">
                Situations Library
              </Link>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-bg transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <a href="#sample-plan" className="hover:text-bg transition-colors">
                Sample Plan
              </a>
            </li>
            <li>
              <Link to="/app" className="hover:text-bg transition-colors">
                Demo App Workspace
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-bg/90">
            Information
          </h4>
          <ul className="space-y-2 text-bg/75 text-[14px]">
            <li>
              <Link to="/situations" className="hover:text-bg transition-colors">
                Directory of Agencies
              </Link>
            </li>
            <li>
              <a href="#trust" className="hover:text-bg transition-colors">
                Source Verification Policy
              </a>
            </li>
            <li>
              <span className="opacity-60 cursor-not-allowed">Editorial Standards</span>
            </li>
            <li>
              <span className="opacity-60 cursor-not-allowed">Contact Team</span>
            </li>
          </ul>
        </div>

        {/* Legal & Trust */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-bg/90">
            Trust & Legal
          </h4>
          <p className="text-[12px] text-bg/70 leading-relaxed">
            Ask Jerri provides general guidance, not legal or financial advice. Always confirm details with the official agency.
          </p>
          <div className="pt-2 flex flex-col space-y-1 text-xs text-bg/60">
            <span>California Civil Code CCPA Compliant</span>
            <span>Zero Data Broker Sharing Policy</span>
          </div>
        </div>
      </div>

      {/* Editorial Wordmark Cropped at Bottom */}
      <div className="text-center pointer-events-none select-none overflow-hidden h-24 flex items-end justify-center">
        <span className="font-serif font-bold text-[140px] sm:text-[180px] leading-none text-bg/5 tracking-tighter translate-y-12">
          Ask Jerri
        </span>
      </div>
    </footer>
  );
};
