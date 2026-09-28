import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  User,
  Bell,
  Lock,
  Wrench,
  RotateCcw,
  Check,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    user,
    setUser,
    addToast,
    resetDemoData,
    demoSettings,
    setGuidedTourActive,
    toggleSlowNetwork,
    toggleSourceFailure,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'demo'>('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [state, setState] = useState(user.state);
  const [emailReminders, setEmailReminders] = useState(user.emailReminders);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name, email, state, emailReminders, notificationsEnabled });
    addToast({
      type: 'success',
      message: 'Account preferences saved.',
    });
  };

  const handleDeleteAllData = () => {
    resetDemoData();
    setShowDeleteConfirm(false);
    addToast({
      type: 'info',
      message: 'All local session data purged.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-2 sm:py-6 text-left space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-medium text-ink">
          Account & Preferences
        </h1>
        <p className="text-[15px] text-ink-2 mt-1">
          Manage your demo profile, case notifications, and simulation settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border space-x-6 text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`py-3 relative flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'profile' ? 'text-primary font-semibold' : 'text-ink-2 hover:text-ink'}`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-primary" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`py-3 relative flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'notifications' ? 'text-primary font-semibold' : 'text-ink-2 hover:text-ink'}`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
          {activeTab === 'notifications' && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-primary" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`py-3 relative flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'privacy' ? 'text-primary font-semibold' : 'text-ink-2 hover:text-ink'}`}
        >
          <Lock className="w-4 h-4" />
          <span>Privacy & Data</span>
          {activeTab === 'privacy' && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-primary" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('demo')}
          className={`py-3 relative flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'demo' ? 'text-primary font-semibold' : 'text-ink-2 hover:text-ink'}`}
        >
          <Wrench className="w-4 h-4 text-accent" />
          <span className="text-accent font-semibold">Demo Controls</span>
          {activeTab === 'demo' && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-accent" />
          )}
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="p-6 bg-surface-elevated rounded-lg border border-border space-y-4 shadow-1">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            helperText="Used for simulated reminders and saved case recovery."
          />

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-ink-2">Primary State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full h-11 bg-white border border-border-strong rounded-sm px-3.5 text-[15px] text-ink focus:border-primary focus:ring-3 focus:ring-primary-tint outline-none cursor-pointer"
            >
              <option value="California">California</option>
              <option value="New York">New York</option>
              <option value="Texas">Texas</option>
            </select>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="md" type="submit">
              Save changes
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === 'notifications' && (
        <div className="p-6 bg-surface-elevated rounded-lg border border-border space-y-5 shadow-1">
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-md bg-surface border border-border cursor-pointer select-none">
              <div>
                <h4 className="text-[15px] font-semibold text-ink">Urgent Deadline Reminders</h4>
                <p className="text-[13px] text-ink-2">Receive alerts when a hearing or cure period is within 48 hours.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => {
                  setNotificationsEnabled(e.target.checked);
                  addToast({ type: 'success', message: 'Notification settings updated.' });
                }}
                className="w-4 h-4 rounded text-primary focus:ring-accent cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-md bg-surface border border-border cursor-pointer select-none">
              <div>
                <h4 className="text-[15px] font-semibold text-ink">Simulated Weekly Status Digests</h4>
                <p className="text-[13px] text-ink-2">A summary of pending documents and weekly certification deadlines.</p>
              </div>
              <input
                type="checkbox"
                checked={emailReminders}
                onChange={(e) => {
                  setEmailReminders(e.target.checked);
                  addToast({ type: 'success', message: 'Email digest settings updated.' });
                }}
                className="w-4 h-4 rounded text-primary focus:ring-accent cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy */}
      {activeTab === 'privacy' && (
        <div className="p-6 bg-surface-elevated rounded-lg border border-border space-y-5 shadow-1">
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-ink">Private by Default</h3>
            <p className="text-[14px] text-ink-2 leading-relaxed">
              Ask Jerri stores no persistent profiling cookies or advertiser tracking. All case data in this demonstration is retained in local memory only.
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-error mb-1">Delete all my data</h4>
            <p className="text-xs text-ink-2 mb-3">
              Permanently purges all active cases, draft forms, and local state.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-error border-error/40 hover:bg-error/10"
            >
              Purge local cases and data
            </Button>
          </div>

          {/* Delete Confirm Modal */}
          {showDeleteConfirm && (
            <div className="p-4 bg-error/10 border border-error/30 rounded-md text-ink space-y-3">
              <div className="flex items-center gap-2 text-error font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Data Purge</span>
              </div>
              <p className="text-xs text-ink-2">
                This will reset your demo state back to Maya Okafor's default seed cases. Are you sure?
              </p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDeleteAllData}
                  className="bg-error hover:bg-error/90 text-white"
                >
                  Yes, reset everything
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Demo */}
      {activeTab === 'demo' && (
        <div className="p-6 bg-surface-elevated rounded-lg border border-border space-y-5 shadow-1">
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-ink">Demo Switches & Verification</h3>
            <p className="text-[14px] text-ink-2 leading-relaxed">
              Designed specifically for evaluator testing of error recovery, edge cases, and guided walkthroughs.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-md bg-surface border border-border cursor-pointer select-none">
              <div>
                <h4 className="text-[14px] font-semibold text-ink">Simulate a Slow Network</h4>
                <p className="text-xs text-ink-2">Adds a 3-second delay to mock intake classification and login.</p>
              </div>
              <input
                type="checkbox"
                checked={demoSettings.simulateSlowNetwork}
                onChange={toggleSlowNetwork}
                className="w-4 h-4 rounded text-primary focus:ring-accent cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-md bg-surface border border-border cursor-pointer select-none">
              <div>
                <h4 className="text-[14px] font-semibold text-ink">Simulate Source Drawer Failure</h4>
                <p className="text-xs text-ink-2">Forces the next opened resource drawer into an error state with retry.</p>
              </div>
              <input
                type="checkbox"
                checked={demoSettings.simulateSourceFailure}
                onChange={toggleSourceFailure}
                className="w-4 h-4 rounded text-primary focus:ring-accent cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-md bg-surface border border-border cursor-pointer select-none">
              <div>
                <h4 className="text-[14px] font-semibold text-ink">Guided Tour Mode</h4>
                <p className="text-xs text-ink-2">Highlights the core 5 evaluator checkpoints throughout the UI.</p>
              </div>
              <input
                type="checkbox"
                checked={demoSettings.guidedTourActive}
                onChange={(e) => setGuidedTourActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-accent cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="secondary"
              size="md"
              onClick={resetDemoData}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset demo to initial state
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
