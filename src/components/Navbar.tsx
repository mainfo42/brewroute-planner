import React, { useState, useRef, useEffect } from 'react';
import {
  Beer,
  Compass,
  Sparkles,
  User,
  LogOut,
  FolderHeart,
  LogIn,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { AuthUser } from '../types';

interface NavbarProps {
  onOpenCurated?: () => void;
  onOpenSavedItineraries: () => void;
  savedItinerariesCount: number;
  user: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'signup' | 'forgot') => void;
  onLogout: () => void;
  hasActiveRoute: boolean;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCurated,
  onOpenSavedItineraries,
  savedItinerariesCount,
  user,
  onOpenAuth,
  onLogout,
  hasActiveRoute,
  onReset,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="m3-top-app-bar"
      className="sticky top-0 z-40 bg-orange-600 text-white border-b border-orange-700/70 transition-colors no-print shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Editorial Title */}
        <div
          id="brand-header-link"
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <Beer className="w-5 h-5 text-orange-600 group-hover:rotate-6 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white drop-shadow-xs">
                BrewRoute
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-800/80 text-orange-100 border border-orange-400/40 tracking-wide">
                Trail Guide
              </span>
            </div>
            <p className="text-[11px] text-orange-100/90 font-medium hidden sm:block">
              Multi-stop microbrewery itinerary & Google Maps guide
            </p>
          </div>
        </div>

        {/* Action Buttons & User Auth (Desktop & Mobile Top Row) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Plan New Route button (Desktop & Header) */}
          {hasActiveRoute && (
            <button
              type="button"
              id="nav-new-route-btn"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-white text-orange-700 hover:bg-orange-50 active:bg-orange-100 shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Trail</span>
              <span className="sm:hidden">New</span>
            </button>
          )}

          {/* Saved Routes - Desktop */}
          {user && (
            <button
              type="button"
              id="nav-saved-itineraries-btn"
              onClick={onOpenSavedItineraries}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-orange-700/80 hover:bg-orange-700 text-white transition-colors relative cursor-pointer border border-orange-400/40 shadow-xs"
              title="View your saved itineraries"
            >
              <FolderHeart className="w-4 h-4 text-orange-200" />
              <span>Saved Routes</span>
              {savedItinerariesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-orange-700 text-[10px] font-bold flex items-center justify-center">
                  {savedItinerariesCount}
                </span>
              )}
            </button>
          )}

          {/* User Auth Section */}
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                id="user-account-dropdown-btn"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-700/80 hover:bg-orange-700 text-white border border-orange-400/50 shadow-xs transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <span className="max-w-[85px] sm:max-w-[120px] truncate text-white font-medium hidden sm:inline">
                  {user.displayName || user.email.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-orange-200" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  id="user-profile-menu"
                  className="absolute right-0 top-full mt-2 w-60 bg-white rounded-3xl border border-slate-200 shadow-xl z-50 overflow-hidden divide-y divide-slate-100 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-4 bg-slate-50">
                    <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Account</p>
                    <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                      {user.displayName || 'Brewer Traveler'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    {onOpenCurated && (
                      <button
                        type="button"
                        id="dropdown-famous-trails"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenCurated();
                        }}
                        className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-100 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2.5">
                          <Compass className="w-4 h-4 text-orange-600" />
                          <span>Famous Beer Trails</span>
                        </span>
                        <span className="text-[10px] font-semibold text-orange-900 bg-orange-100 px-2 py-0.5 rounded-full">
                          Curated
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      id="dropdown-my-saved-routes"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenSavedItineraries();
                      }}
                      className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-100 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <FolderHeart className="w-4 h-4 text-orange-600" />
                        <span>Saved Itineraries</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                        {savedItinerariesCount}
                      </span>
                    </button>
                  </div>

                  <div className="p-1.5">
                    <button
                      type="button"
                      id="user-logout-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-3.5 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-2xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                id="nav-login-btn"
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold text-white hover:bg-white/15 focus:outline-hidden focus:ring-2 focus:ring-white/40 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-orange-200" />
                <span className="hidden sm:inline">Log In</span>
              </button>
              <button
                type="button"
                id="nav-signup-btn"
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-white hover:bg-orange-50 text-orange-700 shadow-sm transition-all cursor-pointer"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
