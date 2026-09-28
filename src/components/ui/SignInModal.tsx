import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from './Button';
import { Input } from './Input';
import { X, Mail, CheckCircle2, UserCheck } from 'lucide-react';
import { mockApi } from '../../mock/mockApi';

export const SignInModal: React.FC = () => {
  const { signinModalOpen, setSigninModalOpen, signInAsMaya, addToast } = useAppStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!signinModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Enter a valid email like maya@example.com');
      return;
    }

    setIsLoading(true);
    try {
      await mockApi.signIn(email);
      setIsLoading(false);
      setIsSent(true);
      addToast({ type: 'info', message: 'Sign-in link simulated.' });
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || "We couldn't reach that address. Try again.");
    }
  };

  const handleDemoSignIn = () => {
    signInAsMaya();
    setSigninModalOpen(false);
    addToast({
      type: 'success',
      message: 'Signed in as Maya Okafor (Demo Profile).',
    });
  };

  const handleClose = () => {
    setSigninModalOpen(false);
    setIsSent(false);
    setError('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-modal-title"
        className="w-full max-w-[440px] bg-surface-elevated rounded-lg p-6 shadow-3 border border-border relative animate-in zoom-in-95 duration-200 text-left"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-ink-3 hover:text-ink rounded-md transition-colors"
          aria-label="Close sign in dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          <div className="py-3 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-ink">Check your inbox</h3>
              <p className="text-[14px] text-ink-2 mt-1">
                We sent a secure sign-in link to <strong>{email}</strong>.
              </p>
            </div>
            <p className="text-[13px] text-ink-3">
              This is a frontend demonstration. No real email was dispatched.
            </p>
            <div className="pt-2">
              <Button variant="secondary" size="md" fullWidth onClick={handleDemoSignIn}>
                Use the demo account instead
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h3 id="signin-modal-title" className="text-2xl font-medium text-ink mb-1.5">
              Save your plan
            </h3>
            <p className="text-[14px] text-ink-2 leading-relaxed mb-5">
              Keep your case progress, official links, and statutory deadlines accessible from any device.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                error={error}
                leftIcon={<Mail className="w-4 h-4" />}
                autoFocus
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
              >
                Continue with email
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface-elevated px-2 text-ink-3 font-semibold tracking-wider">
                  or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              leftIcon={<UserCheck className="w-4 h-4 text-primary" />}
              onClick={handleDemoSignIn}
            >
              Continue as Maya (demo)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
