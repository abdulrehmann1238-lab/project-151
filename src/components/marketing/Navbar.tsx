import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../domain/Logo';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { DemoTray } from '../ui/DemoTray';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setSigninModalOpen, user } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-30 w-full h-[72px] transition-all duration-200
        ${isScrolled ? 'bg-surface/95 backdrop-blur-sm border-b border-border shadow-1' : 'bg-transparent'}
      `}
    >
      <div className="max-w-[1200px] h-full mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <Logo />
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-ink-2">
          <Link
            to="/situations"
            className="hover:text-ink transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary hover:after:w-full after:transition-all after:duration-200"
          >
            Situations
          </Link>
          <a
            href="#how-it-works"
            className="hover:text-ink transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary hover:after:w-full after:transition-all after:duration-200"
          >
            How it works
          </a>
          <a
            href="#sample-plan"
            className="hover:text-ink transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary hover:after:w-full after:transition-all after:duration-200"
          >
            Sample plan
          </a>
          <a
            href="#trust"
            className="hover:text-ink transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary hover:after:w-full after:transition-all after:duration-200"
          >
            Trust & Sources
          </a>
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <DemoTray />

          <button
            type="button"
            onClick={() => setSigninModalOpen(true)}
            className="text-[14px] font-semibold text-ink-2 hover:text-ink px-3 py-2 cursor-pointer"
          >
            {user.isAuthenticated ? `Hi, ${user.name.split(' ')[0]}` : 'Sign in'}
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open demo app
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <DemoTray />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink rounded-md hover:bg-surface border border-border"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[72px] bg-surface-elevated border-b border-border shadow-3 p-6 space-y-4 animate-in slide-in-from-top-2 duration-fast text-left">
          <nav className="flex flex-col space-y-3 text-[17px] font-medium text-ink">
            <Link
              to="/situations"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border hover:text-primary"
            >
              Situations Library
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border hover:text-primary"
            >
              How It Works
            </a>
            <a
              href="#sample-plan"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border hover:text-primary"
            >
              Sample Plan
            </a>
            <a
              href="#trust"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border hover:text-primary"
            >
              Trust & Guardrails
            </a>
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/app');
              }}
            >
              Open demo app
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                setSigninModalOpen(true);
              }}
            >
              Sign in
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
