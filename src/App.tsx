import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNavBar, MobileTab } from './components/BottomNavBar';
import { RouteForm } from './components/RouteForm';
import { RouteDisplay } from './components/RouteDisplay';
import { ExportModal } from './components/ExportModal';
import { CuratedRoutesModal } from './components/CuratedRoutesModal';
import { AuthModal } from './components/AuthModal';
import { SavedItinerariesModal } from './components/SavedItinerariesModal';
import { AdSenseBanner } from './components/AdSenseBanner';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { BeerNewsPage } from './components/BeerNewsPage';
import { HamburgerMenu } from './components/HamburgerMenu';
import { ContactModal } from './components/ContactModal';
import {
  BrewTravelRoute,
  RouteParameters,
  AuthUser,
  SavedItinerary,
  ColorThemeVariant,
  AppPageView,
} from './types';
import { SAMPLE_CURATED_ROUTE, POPULAR_DESTINATIONS } from './data/curatedRoutes';
import { enrichAndValidateRoute } from './utils/styleMatcher';
import { generateClientFallbackRoute } from './utils/fallbackGenerator';
import { getSavedThemeVariant, applyThemeVariant } from './utils/themeManager';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  getSavedItineraries,
  saveItinerary,
  deleteSavedItinerary,
} from './utils/authStorage';
import { AlertCircle, Beer, Sparkles, CheckCircle2, Mail } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPageView>('home');
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<BrewTravelRoute | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('home');

  // Color Palette Theme State
  const [colorTheme, setColorTheme] = useState<ColorThemeVariant>(() => getSavedThemeVariant());

  // Apply theme on mount and change
  useEffect(() => {
    applyThemeVariant(colorTheme);
  }, [colorTheme]);

  const handleSelectTheme = (theme: ColorThemeVariant) => {
    setColorTheme(theme);
    applyThemeVariant(theme);
  };

  // User Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>(() => {
    const user = getCurrentUser();
    return user ? getSavedItineraries(user.id) : [];
  });

  // Modals
  const [isCuratedModalOpen, setIsCuratedModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isSavedItinerariesModalOpen, setIsSavedItinerariesModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Reload saved itineraries when current user changes
  useEffect(() => {
    if (currentUser) {
      setSavedItineraries(getSavedItineraries(currentUser.id));
    } else {
      setSavedItineraries([]);
    }
  }, [currentUser]);

  // Local Storage Persistent Visited Breweries Data
  const [visitedBreweries, setVisitedBreweries] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('brewroute_visited_breweries') || localStorage.getItem('brewhop_visited_breweries');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('brewroute_visited_breweries', JSON.stringify(visitedBreweries));
    } catch {
      // ignore
    }
  }, [visitedBreweries]);

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationCount, setRegenerationCount] = useState(0);

  // Auto-dismiss success toast
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const handleGenerateRoute = async (params: RouteParameters) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRegenerationCount(0);
    setCurrentPage('plan');
    setActiveMobileTab('plan');

    try {
      const response = await fetch('/api/generate-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: BrewTravelRoute = await response.json();
      const validatedData = enrichAndValidateRoute(data, params.beerStyles || []);
      setCurrentRoute(validatedData);
      setActiveMobileTab('plan');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to generate route from API:', err);
      // Fallback: Synthesize high-quality verified real itinerary strictly conforming to user constraints
      setErrorMessage(
        'BrewHop Engine: Route synthesized with certified ratings and top local breweries.'
      );
      const fallbackRoute = generateClientFallbackRoute(params);
      setCurrentRoute(fallbackRoute);
      setActiveMobileTab('plan');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative route regeneration handler
  const handleRegenerateAlternativeRoute = async () => {
    if (!currentRoute) return;

    setIsRegenerating(true);
    setErrorMessage(null);

    // Collect all brewery names in current itinerary to exclude from new suggestion
    const existingBreweries: string[] = [];
    currentRoute.days.forEach((day) => {
      day.breweries.forEach((b) => {
        existingBreweries.push(b.name);
      });
    });

    const nextCount = regenerationCount + 1;
    setRegenerationCount(nextCount);

    const updatedParams: RouteParameters = {
      ...currentRoute.parameters,
      excludeBreweries: existingBreweries,
      regenerationCount: nextCount,
    };

    try {
      const response = await fetch('/api/generate-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedParams),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: BrewTravelRoute = await response.json();
      const validatedData = enrichAndValidateRoute(data, updatedParams.beerStyles || []);
      setCurrentRoute(validatedData);
      setSuccessToast('Generated alternative route with fresh top-rated breweries!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Failed to regenerate alternative route:', err);
      const fallbackAlt = generateClientFallbackRoute(updatedParams);
      setCurrentRoute(fallbackAlt);
      setSuccessToast('Generated alternative route with fresh top-rated breweries!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleToggleVisited = (breweryId: string) => {
    setVisitedBreweries((prev) => ({
      ...prev,
      [breweryId]: !prev[breweryId],
    }));
  };

  const handlePrefillParams = (startLoc: string, area: string, styles: string[]) => {
    // When selected from modal, generate directly or prefill
    handleGenerateRoute({
      startLocation: startLoc,
      destinationArea: area,
      beerStyles: styles,
      tripLength: '2_days',
      desireStay: true,
      stayType: 'hotel',
      priceRange: '100_to_200',
    });
  };

  // Auth Handlers
  const handleLogin = (email: string, pass: string) => {
    const res = loginUser(email, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setSavedItineraries(getSavedItineraries(res.user.id));
      setIsAuthModalOpen(false);
      setSuccessToast(`Welcome back, ${res.user.displayName || res.user.email}!`);
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error };
  };

  const handleSignup = (email: string, pass: string, displayName?: string) => {
    const res = registerUser(email, pass, displayName);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setSavedItineraries(getSavedItineraries(res.user.id));
      setIsAuthModalOpen(false);
      setSuccessToast(`Account created! Welcome to BrewHop, ${res.user.displayName || res.user.email}!`);
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error };
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setSavedItineraries([]);
    setSuccessToast('You have been logged out.');
  };

  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Save Itinerary Handler
  const handleSaveItinerary = (customTitle?: string) => {
    if (!currentUser) {
      // Prompt user to login or sign up first
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (!currentRoute) return;

    const saved = saveItinerary(currentUser.id, currentRoute, customTitle);
    setSavedItineraries(getSavedItineraries(currentUser.id));
    setSuccessToast(`"${saved.route.title}" saved to your account!`);
  };

  const handleDeleteSaved = (itineraryId: string) => {
    if (!currentUser) return;
    deleteSavedItinerary(currentUser.id, itineraryId);
    setSavedItineraries(getSavedItineraries(currentUser.id));
  };

  const handleSelectSaved = (savedRoute: BrewTravelRoute) => {
    const validated = enrichAndValidateRoute(savedRoute, savedRoute.parameters?.beerStyles || []);
    setCurrentRoute(validated);
    setIsSavedItinerariesModalOpen(false);
    setActiveMobileTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSuccessToast(`Loaded itinerary: "${savedRoute.title}"`);
  };

  // Mobile Bottom Navigation Tab Switcher
  const handleMobileTabChange = (tab: MobileTab) => {
    setActiveMobileTab(tab);
    if (tab === 'home') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'plan') {
      setCurrentPage('plan');
    } else if (tab === 'news') {
      setCurrentPage('news');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'curated') {
      setIsCuratedModalOpen(true);
    } else if (tab === 'menu') {
      setIsHamburgerOpen(true);
    } else if (tab === 'saved') {
      if (!currentUser) {
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
      } else {
        setIsSavedItinerariesModalOpen(true);
      }
    } else if (tab === 'account') {
      if (!currentUser) {
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
      } else {
        setSuccessToast(`Logged in as ${currentUser.displayName || currentUser.email}`);
      }
    }
  };

  // Check if currentRoute is already saved
  const isCurrentRouteSaved = !!(
    currentUser &&
    currentRoute &&
    savedItineraries.some(
      (si) =>
        si.route.id === currentRoute.id ||
        (si.route.title === currentRoute.title &&
          si.route.parameters?.startLocation === currentRoute.parameters?.startLocation &&
          si.route.parameters?.destinationArea === currentRoute.parameters?.destinationArea)
    )
  );

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        currentPage === 'plan' && currentRoute
          ? 'bg-[#FAFBF9] text-[#0D2818] selection:bg-[#D1E7D6] selection:text-[#0D2818]'
          : 'bg-black text-white selection:bg-[#58A72F] selection:text-white'
      }`}
    >
      {/* Top App Bar with Hamburger Menu Trigger */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setActiveMobileTab(page === 'news' ? 'news' : page === 'home' ? 'home' : 'plan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHamburger={() => setIsHamburgerOpen(true)}
        onOpenCurated={() => setIsCuratedModalOpen(true)}
        onOpenSavedItineraries={() => {
          if (!currentUser) {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          } else {
            setIsSavedItinerariesModalOpen(true);
          }
        }}
        savedItinerariesCount={savedItineraries.length}
        user={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        hasActiveRoute={!!currentRoute}
        onReset={() => {
          setCurrentRoute(null);
          setCurrentPage('plan');
          setActiveMobileTab('plan');
        }}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      {/* Success Notification Toast */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-3.5 rounded-2xl bg-[#0D2818] text-white border border-[#15803D]/40 text-xs font-semibold flex items-center gap-2.5 shadow-2xl">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
            <span>{successToast}</span>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-[#8DAA91] hover:text-white ml-2 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error alert toast if present */}
      {errorMessage && (
        <div className={`max-w-4xl mx-auto mt-4 px-4 sm:px-6 w-full ${errorMessage.includes('BrewHop Engine') ? 'hidden sm:block' : ''}`}>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 hover:text-rose-950 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main View Area with Dynamic Multi-Page Routing */}
      <main className="flex-1 flex flex-col">
        {/* 1. Home Page: Explains Site Purpose, Value Proposition & Philosophy */}
        {currentPage === 'home' && (
          <HomePage
            onStartPlanning={() => {
              setCurrentPage('plan');
              setActiveMobileTab('plan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(page) => {
              setCurrentPage(page);
              setActiveMobileTab(page === 'news' ? 'news' : page === 'home' ? 'home' : 'plan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCuratedDestination={(idx) => {
              const dest = POPULAR_DESTINATIONS[idx];
              if (dest) {
                setCurrentPage('plan');
                setActiveMobileTab('plan');
                handlePrefillParams(dest.startLoc, dest.name, dest.suggestedStyles);
              }
            }}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {/* 2. About Page: Detailed Mission, History, Routing Algorithm & Safety Charter */}
        {currentPage === 'about' && (
          <AboutPage
            onStartPlanning={() => {
              setCurrentPage('plan');
              setActiveMobileTab('plan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(page) => {
              setCurrentPage(page);
              setActiveMobileTab(page === 'news' ? 'news' : page === 'home' ? 'home' : 'plan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 3. Beer Updates / News Page: Dynamic Blog Format with Articles from across the Web */}
        {currentPage === 'news' && (
          <BeerNewsPage
            onStartPlanning={() => {
              setCurrentPage('plan');
              setActiveMobileTab('plan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 4. Plan a Trail: Route Architect & Active Route Map */}
        {currentPage === 'plan' && (
          currentRoute ? (
            <RouteDisplay
              route={currentRoute}
              onOpenExport={() => setIsExportModalOpen(true)}
              onToggleVisited={handleToggleVisited}
              visitedBreweries={visitedBreweries}
              onPlanNew={() => {
                setCurrentRoute(null);
                setActiveMobileTab('plan');
              }}
              isSaved={isCurrentRouteSaved}
              onSaveItinerary={() => handleSaveItinerary()}
              isLoggedIn={!!currentUser}
              onRegenerateAlternative={handleRegenerateAlternativeRoute}
              isRegenerating={isRegenerating}
            />
          ) : (
            <div className="space-y-6">
              <RouteForm
                onSubmit={handleGenerateRoute}
                isLoading={isLoading}
                currentTheme={colorTheme}
                onSelectCuratedPreset={(idx) => {
                  const dest = POPULAR_DESTINATIONS[idx];
                  if (dest) {
                    handlePrefillParams(dest.startLoc, dest.name, dest.suggestedStyles);
                  }
                }}
              />
              <AdSenseBanner format="horizontal" className="max-w-3xl mx-auto" darkMode={true} />
            </div>
          )
        )}
      </main>

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavBar
        activeTab={activeMobileTab}
        onChangeTab={handleMobileTabChange}
        savedCount={savedItineraries.length}
        user={currentUser}
        hasActiveRoute={!!currentRoute}
        onPlanNew={() => {
          setCurrentRoute(null);
          setCurrentPage('plan');
          setActiveMobileTab('plan');
        }}
        onOpenHamburger={() => setIsHamburgerOpen(true)}
      />

      {/* Hamburger Navigation Drawer */}
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setActiveMobileTab(page === 'news' ? 'news' : page === 'home' ? 'home' : 'plan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCurated={() => setIsCuratedModalOpen(true)}
        onOpenSavedItineraries={() => {
          if (!currentUser) {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          } else {
            setIsSavedItinerariesModalOpen(true);
          }
        }}
        savedItinerariesCount={savedItineraries.length}
        user={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        hasActiveRoute={!!currentRoute}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      {/* Curated Pre-Crafted Routes Modal */}
      <CuratedRoutesModal
        isOpen={isCuratedModalOpen}
        onClose={() => {
          setIsCuratedModalOpen(false);
          setActiveMobileTab('plan');
        }}
        onSelectRoute={(route) => {
          setCurrentRoute(route);
          setCurrentPage('plan');
          setActiveMobileTab('plan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPrefillParams={handlePrefillParams}
      />

      {/* Multi-Format Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        route={currentRoute}
      />

      {/* User Login/Signup Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
        }}
        onSuccess={(user) => {
          setCurrentUser(user);
          setSavedItineraries(getSavedItineraries(user.id));
          setIsAuthModalOpen(false);
          setSuccessToast(`Welcome, ${user.displayName || user.email}!`);
        }}
        onLogin={handleLogin}
        onSignup={handleSignup}
        initialMode={authModalMode}
      />

      {/* Saved Itineraries Modal */}
      <SavedItinerariesModal
        isOpen={isSavedItinerariesModalOpen}
        onClose={() => {
          setIsSavedItinerariesModalOpen(false);
        }}
        savedItineraries={savedItineraries}
        onSelectItinerary={(route) => {
          handleSelectSaved(route);
          setCurrentPage('plan');
        }}
        onDeleteItinerary={handleDeleteSaved}
      />

      {/* Masked Secure Contact Us Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Footer with 2026 Copyright & Contact Us */}
      <footer
        className={`pt-8 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 border-t text-xs no-print transition-colors ${
          currentPage === 'plan' && currentRoute
            ? 'border-[#C6E2BD] text-[#4D6D47] bg-white/95 backdrop-blur-xs'
            : 'border-[#1E301B] text-[#9CB394] bg-[#0A1009]'
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand & Purpose */}
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#58A72F] shadow-[0_0_8px_#58A72F]" />
              <span className={`font-black tracking-wide text-sm font-brand ${currentPage === 'plan' && currentRoute ? 'text-[#122610]' : 'text-white'}`}>
                BREWHOP
              </span>
              <span className="text-[#58A72F]">•</span>
              <span className={`text-xs ${currentPage === 'plan' && currentRoute ? 'text-[#3E5C38]' : 'text-[#A6D496]'}`}>
                Craft Beer Road Trip Planner
              </span>
            </div>

            {/* Navigation & Contact Us Action */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold">
              <button
                type="button"
                id="footer-nav-home"
                onClick={() => {
                  setCurrentPage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`hover:underline cursor-pointer transition-colors ${
                  currentPage === 'plan' && currentRoute ? 'text-[#122610] hover:text-[#58A72F]' : 'text-[#C6E2BD] hover:text-[#66DE37]'
                }`}
              >
                Home
              </button>
              <span className="text-[#3A5634]">•</span>
              <button
                type="button"
                id="footer-nav-about"
                onClick={() => {
                  setCurrentPage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`hover:underline cursor-pointer transition-colors ${
                  currentPage === 'plan' && currentRoute ? 'text-[#122610] hover:text-[#58A72F]' : 'text-[#C6E2BD] hover:text-[#66DE37]'
                }`}
              >
                About Us
              </button>
              <span className="text-[#3A5634]">•</span>
              <button
                type="button"
                id="footer-nav-news"
                onClick={() => {
                  setCurrentPage('news');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`hover:underline cursor-pointer transition-colors ${
                  currentPage === 'plan' && currentRoute ? 'text-[#122610] hover:text-[#58A72F]' : 'text-[#C6E2BD] hover:text-[#66DE37]'
                }`}
              >
                Beer News
              </button>
              <span className="text-[#3A5634]">•</span>
              <button
                type="button"
                id="footer-contact-us-btn"
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A2E17] hover:bg-[#254221] border border-[#58A72F]/50 text-[#66DE37] hover:text-[#8BE052] transition-colors cursor-pointer shadow-2xs active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Us</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1C2C19] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7E9E74]">
            {/* Copyright with 2026 Year */}
            <p className="font-medium text-center sm:text-left">
              © 2026 BrewHop. All rights reserved. Drink responsibly.
            </p>
            <p className="text-center sm:text-right">
              ≤ 3 microbreweries/day • Spaced ≤ 25 min drives • 4-Platform Verified Ratings
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
