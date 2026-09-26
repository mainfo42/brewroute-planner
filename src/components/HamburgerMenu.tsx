import React, { useEffect } from 'react';
import {
  X,
  Home,
  MapPin,
  Sparkles,
  Compass,
  FolderHeart,
  User,
  Info,
  Newspaper,
  ChevronRight,
  ShieldCheck,
  Beer,
  LogIn,
  LogOut,
  Mail,
} from 'lucide-react';
import { HopIcon } from './HopIcon';
import { AppPageView, AuthUser } from '../types';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: AppPageView;
  onNavigate: (page: AppPageView) => void;
  onOpenCurated: () => void;
  onOpenSavedItineraries: () => void;
  savedItinerariesCount: number;
  user: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'signup' | 'forgot') => void;
  onLogout: () => void;
  hasActiveRoute: boolean;
  onPlanTrip?: () => void;
  onOpenContact?: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  onOpenCurated,
  onOpenSavedItineraries,
  savedItinerariesCount,
  user,
  onOpenAuth,
  onLogout,
  hasActiveRoute,
  onPlanTrip,
  onOpenContact,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavClick = (page: AppPageView) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div
      id="hamburger-menu-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="hamburger-menu-drawer-panel"
        className="w-full max-w-sm sm:max-w-md h-full bg-[#121E11] text-white border-l border-[#244220] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#213B1E] flex items-center justify-between bg-[#162D15]/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3B18] border border-[#58A72F]/50 flex items-center justify-center text-[#66DE37] shadow-inner">
              <HopIcon className="w-6 h-6 text-[#66DE37]" filled />
            </div>
            <div>
              <span className="font-black text-xl tracking-wider font-brand text-white block leading-tight">
                BREWHOP
              </span>
              <span className="text-[11px] text-[#A6D496] font-medium block">
                Microbrewery Trail Architect
              </span>
            </div>
          </div>

          <button
            type="button"
            id="hamburger-close-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#1F371B] hover:bg-[#2B4E26] text-[#DDF1D2] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#31572B]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-4 py-5 space-y-2">
          <p className="px-3 text-[11px] font-bold text-[#7AA86F] uppercase tracking-wider font-brand">
            Navigation
          </p>

          {/* Home / Purpose */}
          <a
            href="/"
            id="menu-nav-home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left cursor-pointer border ${
              currentPage === 'home'
                ? 'bg-[#D97706] text-white border-[#F59E0B] shadow-md'
                : 'bg-[#182816] hover:bg-[#20361E] text-[#E5F3E1] border-transparent hover:border-[#385E32]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  currentPage === 'home'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#223B1E] text-[#8BE052]'
                }`}
              >
                <Home className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm block">Home</span>
                <span className={`text-[11px] ${currentPage === 'home' ? 'text-white/80' : 'text-[#8EAD84]'}`}>
                  Site Purpose & Craft Philosophy
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 ${currentPage === 'home' ? 'text-white' : 'text-[#628B59]'}`} />
          </a>

          {/* Plan Trip */}
          <a
            href="/plan"
            id="menu-nav-plan"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              if (onPlanTrip) {
                onPlanTrip();
              } else {
                handleNavClick('plan');
              }
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left cursor-pointer border ${
              currentPage === 'plan'
                ? 'bg-[#58A72F] text-white border-[#7DD748] shadow-md'
                : 'bg-[#182816] hover:bg-[#20361E] text-[#E5F3E1] border-transparent hover:border-[#385E32]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  currentPage === 'plan'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#223B1E] text-[#8BE052]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Plan Trip</span>
                  {hasActiveRoute && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#181818] text-[#8BE052] border border-[#58A72F]/50">
                      Active
                    </span>
                  )}
                </div>
                <span className={`text-[11px] ${currentPage === 'plan' ? 'text-white/80' : 'text-[#8EAD84]'}`}>
                  Interactive Route Architect & Map
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 ${currentPage === 'plan' ? 'text-white' : 'text-[#628B59]'}`} />
          </a>

          {/* Global Beer Updates / News */}
          <a
            href="/news"
            id="menu-nav-news"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('news');
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left cursor-pointer border ${
              currentPage === 'news'
                ? 'bg-[#D97706] text-white border-[#F59E0B] shadow-md'
                : 'bg-[#182816] hover:bg-[#20361E] text-[#E5F3E1] border-transparent hover:border-[#385E32]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  currentPage === 'news'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#223B1E] text-[#F59E0B]'
                }`}
              >
                <Newspaper className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Beer Updates & News</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#D97706] text-white font-brand uppercase tracking-wider animate-pulse">
                    Live
                  </span>
                </div>
                <span className={`text-[11px] ${currentPage === 'news' ? 'text-white/80' : 'text-[#8EAD84]'}`}>
                  Launches, New Hops, Festivals & Conferences
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 ${currentPage === 'news' ? 'text-white' : 'text-[#628B59]'}`} />
          </a>

          {/* About Page (Purpose of Website) */}
          <a
            href="/about"
            id="menu-nav-about"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('about');
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left cursor-pointer border ${
              currentPage === 'about'
                ? 'bg-[#D97706] text-white border-[#F59E0B] shadow-md'
                : 'bg-[#182816] hover:bg-[#20361E] text-[#E5F3E1] border-transparent hover:border-[#385E32]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  currentPage === 'about'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#223B1E] text-[#A6D496]'
                }`}
              >
                <Info className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm block">About BrewHop</span>
                <span className={`text-[11px] ${currentPage === 'about' ? 'text-white/80' : 'text-[#8EAD84]'}`}>
                  Mission, Purpose & Routing Science
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 ${currentPage === 'about' ? 'text-white' : 'text-[#628B59]'}`} />
          </a>

          {/* Contact Us */}
          {onOpenContact && (
            <button
              type="button"
              id="menu-nav-contact"
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left cursor-pointer border bg-[#182816] hover:bg-[#20361E] text-[#E5F3E1] border-transparent hover:border-[#385E32]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#223B1E] text-[#66DE37]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm block">Contact Us</span>
                  <span className="text-[11px] text-[#8EAD84]">
                    Feedback, Suggestions & Inquiries
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#628B59]" />
            </button>
          )}

          <div className="pt-3 pb-1">
            <p className="px-3 text-[11px] font-bold text-[#7AA86F] uppercase tracking-wider font-brand">
              Quick Shortcuts
            </p>
          </div>

          {/* Famous Curated Trails */}
          <button
            type="button"
            id="menu-nav-curated"
            onClick={() => {
              onClose();
              onOpenCurated();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#182816] hover:bg-[#20361E] text-[#E5F3E1] transition-all text-left cursor-pointer border border-transparent hover:border-[#385E32]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#223B1E] text-[#66DE37] flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm block">Famous Curated Routes</span>
                <span className="text-[11px] text-[#8EAD84]">
                  Vermont, Asheville, Denver, Portland
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#628B59]" />
          </button>

          {/* Saved Trails */}
          <button
            type="button"
            id="menu-nav-saved"
            onClick={() => {
              onClose();
              onOpenSavedItineraries();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#182816] hover:bg-[#20361E] text-[#E5F3E1] transition-all text-left cursor-pointer border border-transparent hover:border-[#385E32]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#223B1E] text-[#8BE052] flex items-center justify-center">
                <FolderHeart className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Saved Itineraries</span>
                  {savedItinerariesCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#58A72F] text-white text-xs font-bold flex items-center justify-center">
                      {savedItinerariesCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#8EAD84]">
                  Access your custom bookmarked trails
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#628B59]" />
          </button>

          {/* User Account / Auth */}
          <div className="pt-2">
            {user ? (
              <div className="p-3.5 rounded-2xl bg-[#142312] border border-[#264422]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#58A72F] text-white flex items-center justify-center text-xs font-bold">
                      {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">
                        {user.displayName || 'Craft Traveler'}
                      </p>
                      <p className="text-[10px] text-[#8EAD84] truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  id="menu-logout-btn"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full mt-2 py-1.5 px-3 rounded-xl bg-[#21371F] hover:bg-[#2B4628] text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="menu-login-btn"
                onClick={() => {
                  onClose();
                  onOpenAuth('login');
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#1E3B18] hover:bg-[#284E20] text-[#DDF1D2] border border-[#58A72F]/50 font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <LogIn className="w-4 h-4 text-[#8BE052]" />
                <span>Sign In / Create Free Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 sm:p-5 border-t border-[#213B1E] bg-[#0E1A0D]/90 space-y-2">
          <div className="flex items-center gap-2 text-[#9CB394] text-[11px] leading-tight">
            <ShieldCheck className="w-4 h-4 text-[#58A72F] shrink-0" />
            <span>Always taste responsibly. Arrange a designated driver or rideshare on craft beer trails.</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#63835D] pt-1">
            <span>© 2026 BrewHop. All rights reserved.</span>
            <span>≤ 25 min transit rules</span>
          </div>
        </div>
      </div>
    </div>
  );
};
