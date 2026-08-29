import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  User,
  LogOut,
  FolderHeart,
  LogIn,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { HopIcon } from './HopIcon';
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
      className="sticky top-0 z-40 bg-[#162D15] text-white border-b border-[#254A23] transition-colors no-print shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Editorial Title */}
        <div
          id="brand-header-link"
          onClick={onReset}
          className="flex items-center gap-3.5 cursor-pointer group shrink-0 select-none py-1"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#58A72F] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0 border border-[#7DD748]/60">
            <HopIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:rotate-6 transition-transform drop-shadow-xs" filled />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-2.5">
              <span className="font-black text-2xl sm:text-3xl tracking-wide text-white drop-shadow-xs font-brand leading-none">
                BEERHOP
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#C6E2BD] font-semibold tracking-normal mt-0.5 leading-tight">
              Fresh Hop Routes!
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[#58A72F] hover:bg-[#68BF38] text-white active:bg-[#489224] shadow-xs transition-all shrink-0 cursor-pointer border border-[#7CD749]"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="hidden sm:inline font-brand tracking-wider">NEW TRAIL</span>
              <span className="sm:hidden font-brand">NEW</span>
            </button>
          )}

          {/* Saved Routes - Desktop */}
          {user && (
            <button
              type="button"
              id="nav-saved-itineraries-btn"
              onClick={onOpenSavedItineraries}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[#20401E] hover:bg-[#2A5427] text-[#DDF1D2] transition-colors relative cursor-pointer border border-[#386C35] shadow-xs"
              title="View your saved itineraries"
            >
              <FolderHeart className="w-4 h-4 text-[#8BE052]" />
              <span className="font-brand tracking-wider">SAVED ROUTES</span>
              {savedItinerariesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#58A72F] text-white text-[10px] font-black flex items-center justify-center">
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
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-[#20401E] hover:bg-[#2A5427] text-white border border-[#386C35] shadow-xs transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#58A72F] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <span className="max-w-[85px] sm:max-w-[120px] truncate text-white font-medium hidden sm:inline">
                  {user.displayName || user.email.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A6D496]" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  id="user-profile-menu"
                  className="absolute right-0 top-full mt-2 w-60 bg-white rounded-3xl border border-[#C6E2BD] shadow-xl z-50 overflow-hidden divide-y divide-[#EAF4E6] text-[#122610] animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-4 bg-[#F2F8F0]">
                    <p className="text-[10px] font-black text-[#58A72F] uppercase tracking-wider font-brand">Account</p>
                    <p className="text-xs font-bold text-[#122610] truncate mt-0.5">
                      {user.displayName || 'Craft Beer Traveler'}
                    </p>
                    <p className="text-[11px] text-[#4D6D47] truncate">{user.email}</p>
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
                        className="w-full px-3.5 py-2.5 text-xs font-bold text-[#122610] hover:bg-[#EAF4E6] rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2.5">
                          <Compass className="w-4 h-4 text-[#58A72F]" />
                          <span>Famous Beer Trails</span>
                        </span>
                        <span className="text-[10px] font-bold text-[#122B0F] bg-[#DDF1D2] px-2 py-0.5 rounded-full border border-[#B2D8A6]">
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
                      className="w-full px-3.5 py-2.5 text-xs font-bold text-[#122610] hover:bg-[#EAF4E6] rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <FolderHeart className="w-4 h-4 text-[#58A72F]" />
                        <span>Saved Itineraries</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#EAF4E6] text-[#122B0F] text-[10px] font-black">
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
                      className="w-full px-3.5 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-2xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
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
                className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold text-white hover:bg-white/10 focus:outline-hidden focus:ring-2 focus:ring-white/30 transition-colors cursor-pointer font-brand tracking-wider"
              >
                <LogIn className="w-4 h-4 text-[#A6D496]" />
                <span className="hidden sm:inline">LOG IN</span>
              </button>
              <button
                type="button"
                id="nav-signup-btn"
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-[#58A72F] hover:bg-[#68BF38] text-white shadow-xs transition-all cursor-pointer border border-[#7CD749] font-brand tracking-wider"
              >
                <span>SIGN UP</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

