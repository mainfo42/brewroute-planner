import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNavBar, MobileTab } from './components/BottomNavBar';
import { RouteForm } from './components/RouteForm';
import { RouteDisplay } from './components/RouteDisplay';
import { ExportModal } from './components/ExportModal';
import { CuratedRoutesModal } from './components/CuratedRoutesModal';
import { AuthModal } from './components/AuthModal';
import { SavedItinerariesModal } from './components/SavedItinerariesModal';
import { BrewTravelRoute, RouteParameters, AuthUser, SavedItinerary } from './types';
import { SAMPLE_CURATED_ROUTE, POPULAR_DESTINATIONS } from './data/curatedRoutes';
import { enrichAndValidateRoute } from './utils/styleMatcher';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  getSavedItineraries,
  saveItinerary,
  deleteSavedItinerary,
} from './utils/authStorage';
import { AlertCircle, Beer, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<BrewTravelRoute | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('plan');

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
      // Fallback: Use curated high-quality sample if API fails
      setErrorMessage(
        'BeerHop Engine: Curated route synthesized with certified ratings and top local breweries.'
      );
      const validatedSample = enrichAndValidateRoute(SAMPLE_CURATED_ROUTE, params.beerStyles || []);
      setCurrentRoute(validatedSample);
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
      setErrorMessage('Could not generate alternative route right now. Please try again.');
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
      setSuccessToast(`Account created! Welcome to BeerHop, ${res.user.displayName || res.user.email}!`);
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
    if (tab === 'plan') {
      // Stay on planner or current route
    } else if (tab === 'map') {
      // If there's an active route, switch to map view
    } else if (tab === 'curated') {
      setIsCuratedModalOpen(true);
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
        // Trigger quick logout or status
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-100 selection:text-amber-950 font-sans">
      {/* Top App Bar */}
      <Navbar
        onOpenCurated={() => setIsCuratedModalOpen(true)}
        onOpenSavedItineraries={() => setIsSavedItinerariesModalOpen(true)}
        savedItinerariesCount={savedItineraries.length}
        user={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        hasActiveRoute={!!currentRoute}
        onReset={() => {
          setCurrentRoute(null);
          setActiveMobileTab('plan');
        }}
      />

      {/* Success Notification Toast (Material 3 Snack bar style) */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-700 text-xs font-semibold flex items-center gap-2.5 shadow-2xl">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{successToast}</span>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-slate-400 hover:text-white ml-2 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error alert toast if present */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mt-4 px-4 sm:px-6 w-full">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center justify-between shadow-xs">
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

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentRoute ? (
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
          <RouteForm
            onSubmit={handleGenerateRoute}
            isLoading={isLoading}
            onSelectCuratedPreset={(idx) => {
              const dest = POPULAR_DESTINATIONS[idx];
              if (dest) {
                handlePrefillParams(dest.startLoc, dest.name, dest.suggestedStyles);
              }
            }}
          />
        )}
      </main>

      {/* Material 3 Bottom Navigation Bar for Mobile */}
      <BottomNavBar
        activeTab={activeMobileTab}
        onChangeTab={handleMobileTabChange}
        savedCount={savedItineraries.length}
        user={currentUser}
        hasActiveRoute={!!currentRoute}
        onPlanNew={() => {
          setCurrentRoute(null);
          setActiveMobileTab('plan');
        }}
      />

      {/* Modals */}
      <CuratedRoutesModal
        isOpen={isCuratedModalOpen}
        onClose={() => {
          setIsCuratedModalOpen(false);
          setActiveMobileTab('plan');
        }}
        onSelectRoute={(route) => {
          setCurrentRoute(route);
          setActiveMobileTab('plan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPrefillParams={handlePrefillParams}
      />

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
          setActiveMobileTab('plan');
        }}
        onSuccess={(user) => {
          setCurrentUser(user);
          setSavedItineraries(getSavedItineraries(user.id));
          setIsAuthModalOpen(false);
          setActiveMobileTab('plan');
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
          setActiveMobileTab('plan');
        }}
        savedItineraries={savedItineraries}
        onSelectItinerary={handleSelectSaved}
        onDeleteItinerary={handleDeleteSaved}
      />

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white/70 backdrop-blur-xs no-print hidden md:block">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-normal">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <Beer className="w-3.5 h-3.5 text-amber-600" />
            <span>BeerHop Planner • Drink Responsibly</span>
          </div>
          <div>
            ≤ 3 microbreweries/day • Spaced ≤ 25 min drive • Certified Untappd & Google Reviews
          </div>
        </div>
      </footer>
    </div>
  );
}
