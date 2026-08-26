import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight, Beer, Sparkles } from 'lucide-react';
import { AuthUser } from '../types';
import { loginUser, registerUser } from '../utils/authStorage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
  onLogin?: (email: string, pass: string) => { success: boolean; user?: AuthUser; error?: string };
  onSignup?: (email: string, pass: string, displayName?: string) => { success: boolean; user?: AuthUser; error?: string };
  initialMode?: 'login' | 'signup';
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
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode if initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
      } else {
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
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center font-bold shadow-xs">
              <Beer className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {mode === 'login' ? 'Log In to BrewRoute' : 'Create an Account'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'login'
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
          <div className="bg-amber-100 border-b border-amber-200 px-5 py-3 text-xs font-semibold text-amber-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{promptMessage}</span>
          </div>
        )}

        {/* Mode Switcher Segmented Button */}
        <div className="p-3 bg-white border-b border-slate-200">
          <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              type="button"
              id="tab-auth-login"
              onClick={() => {
                setMode('login');
                setError(null);
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
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
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl text-xs sm:text-sm text-slate-900 transition-all min-h-[42px]"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email-input" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-amber-600">*</span>
            </label>
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
                }}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl text-xs sm:text-sm text-slate-900 transition-all min-h-[42px]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="auth-password-input" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Password <span className="text-amber-600">*</span>
              </label>
              {mode === 'signup' && (
                <span className="text-[10px] text-slate-400">Min 6 characters</span>
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
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl text-xs sm:text-sm text-slate-900 transition-all min-h-[42px]"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <span>{mode === 'login' ? 'Log In' : 'Sign Up & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-amber-700 font-bold hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-amber-700 font-bold hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
