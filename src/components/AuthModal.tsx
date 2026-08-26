import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Beer,
  Sparkles,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { AuthUser } from '../types';
import { loginUser, registerUser, resetUserPassword, checkEmailRegistered } from '../utils/authStorage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
  onLogin?: (email: string, pass: string) => { success: boolean; user?: AuthUser; error?: string };
  onSignup?: (email: string, pass: string, displayName?: string) => { success: boolean; user?: AuthUser; error?: string };
  initialMode?: 'login' | 'signup' | 'forgot';
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLogin,
  onSignup,
  initialMode = 'login',
  promptMessage,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Sync mode if initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccessNotice(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleVerifyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    const check = checkEmailRegistered(email);
    if (!check.registered) {
      setError(check.error || 'No registered account found with this email.');
      setEmailVerified(false);
      return;
    }

    setEmailVerified(true);
    setSuccessNotice(`Account found for ${email.trim().toLowerCase()}. Enter your new password below.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (onSignup) {
          const res = onSignup(email, password, displayName);
          if (!res.success) {
            setError(res.error || 'Failed to sign up');
            setIsSubmitting(false);
            return;
          }
          if (res.user && typeof onSuccess === 'function') {
            onSuccess(res.user);
          }
          onClose();
        } else {
          const result = registerUser(email, password, displayName);
          if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
            return;
          }
          if (result.user && typeof onSuccess === 'function') {
            onSuccess(result.user);
          }
          onClose();
        }
      } else if (mode === 'forgot') {
        // Forgot Password Flow
        if (!email.trim() || !email.includes('@')) {
          setError('Please enter a valid email address.');
          setIsSubmitting(false);
          return;
        }

        if (password.length < 6) {
          setError('New password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter.');
          setIsSubmitting(false);
          return;
        }

        const resetRes = resetUserPassword(email, password);
        if (!resetRes.success) {
          setError(resetRes.error || 'Failed to reset password. Please check your email.');
          setIsSubmitting(false);
          return;
        }

        // Reset succeeded! Switch back to login with success notice
        setSuccessNotice('Password reset successfully! You can now log in with your new password.');
        setPassword('');
        setConfirmPassword('');
        setMode('login');
      } else {
        // Log in flow
        if (onLogin) {
          const res = onLogin(email, password);
          if (!res.success) {
            setError(res.error || 'Failed to log in');
            setIsSubmitting(false);
            return;
          }
          if (res.user && typeof onSuccess === 'function') {
            onSuccess(res.user);
          }
          onClose();
        } else {
          const result = loginUser(email, password);
          if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
            return;
          }
          if (result.user && typeof onSuccess === 'function') {
            onSuccess(result.user);
          }
          onClose();
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-50 rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-slide-up sm:animate-none">
        
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-6 bg-white flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-900 border border-orange-200 flex items-center justify-center font-bold shadow-xs">
              {mode === 'forgot' ? (
                <KeyRound className="w-5 h-5 text-orange-700" />
              ) : (
                <Beer className="w-5 h-5 text-orange-700" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {mode === 'forgot'
                  ? 'Reset Password'
                  : mode === 'login'
                  ? 'Log In to BrewRoute'
                  : 'Create an Account'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'forgot'
                  ? 'Verify your registered email to set a new password'
                  : mode === 'login'
                  ? 'Access saved itineraries & visited check-ins'
                  : 'Save custom routes & access across devices'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt banner if opened from "Save Itinerary" */}
        {promptMessage && (
          <div className="bg-orange-100 border-b border-orange-200 px-5 py-3 text-xs font-semibold text-orange-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-700 shrink-0" />
            <span>{promptMessage}</span>
          </div>
        )}

        {/* Mode Switcher Segmented Button (Hidden during forgot password) */}
        {mode !== 'forgot' ? (
          <div className="p-3 bg-white border-b border-slate-200">
            <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                type="button"
                id="tab-auth-login"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                id="tab-auth-signup"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div className="px-5 py-3 bg-orange-50/80 border-b border-orange-200 flex items-center justify-between">
            <button
              type="button"
              id="back-to-login-from-forgot-btn"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessNotice(null);
              }}
              className="text-xs font-bold text-orange-800 hover:text-orange-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Log In</span>
            </button>
            <span className="text-[11px] font-semibold text-orange-700 bg-orange-200/70 px-2 py-0.5 rounded-full">
              Email Recovery
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-display-name" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Your Name / Nickname (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="auth-display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Traveler"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl text-xs sm:text-sm text-slate-900 transition-all min-h-[42px]"
                />
              </div>
            </div>
          )}

          {/* Email input field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="auth-email-input" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {mode === 'forgot' ? 'Registered Email Address' : 'Email Address'} <span className="text-orange-600">*</span>
              </label>
              {mode === 'forgot' && !emailVerified && email.includes('@') && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="text-[11px] font-bold text-orange-700 hover:text-orange-900 hover:underline cursor-pointer"
                >
                  Verify Email
                </button>
              )}
              {mode === 'forgot' && emailVerified && (
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Account Verified
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                  setEmailVerified(false);
                }}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl text-xs sm:text-sm text-slate-900 transition-all min-h-[42px]"
              />
            </div>
          </div>

          {/* Password field */}
          {mode !== 'forgot' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-password-input" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Password <span className="text-orange-600">*</span>
                </label>
                {mode === 'signup' ? (
                  <span className="text-[10px] text-slate-400">Min 6 characters</span>
                ) : (
                  <button
                    type="button"
                    id="auth-forgot-password-link"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccessNotice(null);
                    }}
                    className="text-[11px] font-semibold text-orange-700 hover:text-orange-800 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl text-xs sm:text-sm text-slate-900 transition-all min-h-[42px]"
                />
              </div>
            </div>
          ) : (
            <>
              {/* Forgot password new password fields */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="auth-new-password-input" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    New Password <span className="text-orange-600">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Min 6 characters</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="auth-new-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl text-xs sm:text-sm text-slate-900 transition-all min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-confirm-password-input" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Confirm New Password <span className="text-orange-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="auth-confirm-password-input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl text-xs sm:text-sm text-slate-900 transition-all min-h-[42px]"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <span>
              {mode === 'forgot'
                ? 'Update Password & Return to Login'
                : mode === 'login'
                ? 'Log In'
                : 'Sign Up & Continue'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  id="switch-to-signup-btn"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setSuccessNotice(null);
                  }}
                  className="text-orange-700 font-bold hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  id="switch-to-login-btn"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessNotice(null);
                  }}
                  className="text-orange-700 font-bold hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className="text-xs text-orange-700 font-bold hover:underline cursor-pointer"
              >
                Remembered your password? Log In
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
