import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Logo } from '../domain/Logo';
import { DemoTray } from '../ui/DemoTray';
import { ToastContainer } from '../ui/Toast';
import { SourceDrawer } from '../ui/SourceDrawer';
import { DemoNoticeModal } from '../ui/DemoNoticeModal';
import { SignInModal } from '../ui/SignInModal';
import { GuidedPickerModal } from '../ui/GuidedPickerModal';
import { CommandPalette } from '../ui/CommandPalette';
import {
  Home,
  PlusCircle,
  Briefcase,
  FileText,
  User,
  Search,
  Bell,
  Check,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const {
    user,
    notifications,
    markNotificationRead,
    setCommandPaletteOpen,
    setSigninModalOpen,
    setGuidedPickerOpen,
  } = useAppStore();

  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: 'Home', path: '/app', icon: Home, end: true },
    { label: 'New problem', path: '/app/new', icon: PlusCircle },
    { label: 'My Cases', path: '/app/cases', icon: Briefcase },
    { label: 'Resources', path: '/app/resources', icon: FileText },
    { label: 'Account', path: '/app/account', icon: User },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col antialiased">
      {/* 64px Top Bar */}
      <header className="sticky top-0 z-30 h-16 w-full bg-surface-elevated border-b border-border shadow-1 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Monogram + Mobile Title */}
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-ink-3 border-l border-border pl-4">
            Resolution Guide
          </span>
        </div>

        {/* Center: Cmd+K Global Search Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full h-9 px-3 bg-surface hover:bg-surface-elevated border border-border-strong rounded-sm text-[13px] text-ink-3 hover:text-ink flex items-center justify-between transition-colors shadow-1 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search cases, forms, situations...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[11px] bg-surface-elevated border border-border rounded font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons: Demo Chip, Notifications, Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* Quick Guided Path Trigger */}
          <button
            type="button"
            onClick={() => setGuidedPickerOpen(true)}
            className="hidden lg:flex items-center gap-1.5 text-xs text-ink-2 hover:text-primary font-medium px-2 py-1 rounded hover:bg-surface transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span>Not sure?</span>
          </button>

          <DemoTray />

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 text-ink-2 hover:text-ink rounded-md hover:bg-surface border border-border relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {notifOpen && (
              <>
                <div
                  onClick={() => setNotifOpen(false)}
                  className="fixed inset-0 z-40"
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-surface-elevated rounded-lg shadow-3 border border-border p-4 z-50 text-left animate-in fade-in duration-fast">
                  <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3">
                    <h4 className="text-sm font-semibold text-ink">Notifications & Deadlines</h4>
                    <span className="text-xs text-ink-3">{unreadNotifs} unread</span>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded border text-xs cursor-pointer transition-colors ${n.read ? 'bg-surface/50 border-border text-ink-3' : 'bg-primary-tint/30 border-primary/20 text-ink'}`}
                      >
                        <div className="flex items-center justify-between font-semibold mb-0.5">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-ink-3">{n.timestamp}</span>
                        </div>
                        <p className="text-ink-2">{n.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={() => navigate('/app/account')}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-surface border border-border hover:border-primary transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-primary text-bg flex items-center justify-center text-xs font-semibold">
              {user.name.charAt(0)}
            </div>
            <span className="text-xs font-medium text-ink hidden sm:inline">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body with Sidebar */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto pb-20 md:pb-6">
        {/* Left Sidebar (240px desktop, collapsed to bottom bar on mobile) */}
        <aside className="hidden md:flex flex-col w-60 border-r border-border p-4 shrink-0 space-y-6">
          <nav className="space-y-1 text-left">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-all duration-fast
                    ${isActive ? 'bg-primary text-bg font-semibold shadow-1' : 'text-ink-2 hover:bg-surface hover:text-ink'}
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Guided CTA Card in Sidebar */}
          <div className="mt-auto p-4 bg-surface rounded-md border border-border text-left space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
              Guidance
            </span>
            <h4 className="text-sm font-semibold text-ink">Need step-by-step help?</h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              Answer 3 simple questions to prefill your problem.
            </p>
            <button
              type="button"
              onClick={() => setGuidedPickerOpen(true)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Launch guided path</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (64px, 5 icons plus labels under 768px) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-surface-elevated border-t border-border z-30 flex items-center justify-around shadow-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors
                ${isActive ? 'text-primary font-semibold' : 'text-ink-3 hover:text-ink'}
              `}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

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
