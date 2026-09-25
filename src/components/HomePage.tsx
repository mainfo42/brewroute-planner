import React from 'react';
import {
  Sparkles,
  Clock,
  Compass,
  Bed,
  Route as RouteIcon,
  ShieldCheck,
  ChevronRight,
  Beer,
} from 'lucide-react';
import { AppPageView } from '../types';
import { POPULAR_DESTINATIONS } from '../data/curatedRoutes';
import breweryHeroBg from '../assets/images/brewery_hero_bg_1790276576404.jpg';
import breweryTapsPintsBg from '../assets/images/beer_taps_pints_flow_1790279604710.jpg';

interface HomePageProps {
  onStartPlanning: () => void;
  onNavigate: (page: AppPageView) => void;
  onSelectCuratedDestination: (index: number) => void;
  onOpenCuratedModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartPlanning,
  onNavigate,
  onSelectCuratedDestination,
  onOpenCuratedModal,
}) => {
  return (
    <div id="brewhop-home-page" className="w-full text-white bg-black animate-in fade-in duration-200">
      {/* Hero Section with Atmospheric Microbrewery Background */}
      <section className="relative isolate overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#1E301B]">
        {/* Microbrewery Background Atmosphere - positioned with z-0 within isolated stacking context */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <img
            src={breweryHeroBg}
            alt="Craft microbrewery brewhouse and taproom atmosphere"
            className="w-full h-full object-cover object-center brightness-105 contrast-105 scale-100 transition-opacity duration-500"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay: keeps the microbrewery photo rich and clearly visible while smoothly transitioning at edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Frosted text scrim card: guarantees WCAG AAA accessibility contrast while letting the brewery atmosphere shine through */}
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-black/50 backdrop-blur-[2px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-6">
            {/* Main Hero Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white font-display uppercase leading-[1.08] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Curate Your Perfect <br className="hidden sm:inline" />
              <span className="text-[#66DE37] drop-shadow-[0_2px_22px_rgba(102,222,55,0.7)]">
                Craft Beer Road Trip
              </span>
            </h1>

            {/* Purpose & Mission Statement */}
            <p className="text-base sm:text-xl text-zinc-100 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              BrewHop is engineered to eliminate the stress and guesswork from brewery touring. 
              We automatically craft custom itineraries tailored to your favorite beer styles, 
              spacing every stop strictly within scenic 25-minute drives, backed by 4-platform 
              verified ratings, seamless round-trip Google Maps navigation, and boutique overnight stays.
            </p>

            {/* Primary Action Button */}
            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                id="home-cta-plan-trail"
                onClick={onStartPlanning}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-black text-base sm:text-lg tracking-wide font-brand shadow-xl hover:shadow-[#D97706]/40 transition-all cursor-pointer flex items-center justify-center gap-3 border-2 border-[#F59E0B] active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>PLAN YOUR BEER TRAIL NOW</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-[#0F1A0E]/90 backdrop-blur-md border border-[#233A1F] text-center shadow-lg">
              <span className="text-xl sm:text-2xl font-black text-[#66DE37] font-brand block">≤ 25 MIN</span>
              <span className="text-[11px] text-[#A8C4A2] font-medium">Drive Time Between Stops</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0F1A0E]/90 backdrop-blur-md border border-[#233A1F] text-center shadow-lg">
              <span className="text-xl sm:text-2xl font-black text-[#F59E0B] font-brand block">4 PLATFORMS</span>
              <span className="text-[11px] text-[#A8C4A2] font-medium">Untappd + Google + RateBeer</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0F1A0E]/90 backdrop-blur-md border border-[#233A1F] text-center shadow-lg">
              <span className="text-xl sm:text-2xl font-black text-white font-brand block">ROUND-TRIP</span>
              <span className="text-[11px] text-[#A8C4A2] font-medium">Turn-by-Turn Google Maps</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0F1A0E]/90 backdrop-blur-md border border-[#233A1F] text-center shadow-lg">
              <span className="text-xl sm:text-2xl font-black text-[#66DE37] font-brand block">CURATED STAYS</span>
              <span className="text-[11px] text-[#A8C4A2] font-medium">Within 30 min of Final Taproom</span>
            </div>
          </div>
        </div>
      </section>

      {/* The BrewHop Purpose: Why We Built This */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black text-[#D97706] tracking-widest uppercase font-brand">
            OUR PURPOSE & PHILOSOPHY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight uppercase">
            Solving the Craft Beer Travel Dilemma
          </h2>
          <p className="text-sm sm:text-base text-[#9CB394] leading-relaxed">
            Planning a microbrewery trip usually means wrestling with open browser tabs, inaccurate taproom hours, 
            disappointing beer menus that don't fit your taste, and zig-zagging highway drives that waste precious weekend hours. 
            BrewHop replaces all of that with intelligent, palate-first craft travel curation.
          </p>
        </div>

        {/* 4 Pillars of BrewHop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pillar 1 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#131F12] border border-[#223920] hover:border-[#58A72F]/50 transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#1D361A] text-[#66DE37] border border-[#58A72F]/40 flex items-center justify-center">
              <Beer className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white font-display tracking-tight uppercase">
              1. Tailored to Your Palate
            </h3>
            <p className="text-sm text-[#A9C4A2] leading-relaxed">
              Whether you crave pillowy Double Dry-Hopped Hazy IPAs, funky spontaneous wild ales, 
              rich imperial pastry stouts, or crisp German pilsners, BrewHop prioritizes breweries 
              that specialize in your selected styles so every tasting flight hits the mark.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#131F12] border border-[#223920] hover:border-[#58A72F]/50 transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#282110] text-[#F59E0B] border border-[#D97706]/40 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white font-display tracking-tight uppercase">
              2. Strict ≤ 25-Minute Hop Limits
            </h3>
            <p className="text-sm text-[#A9C4A2] leading-relaxed">
              We know travel fatigue ruins good beer. Our route engine clusters stops along scenic, 
              sensible geographic corridors, ensuring drives between taprooms stay under 25 minutes. 
              Less time behind the wheel, more time enjoying fresh pours and local conversations.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#131F12] border border-[#223920] hover:border-[#58A72F]/50 transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#1D361A] text-[#66DE37] border border-[#58A72F]/40 flex items-center justify-center">
              <RouteIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white font-display tracking-tight uppercase">
              3. Door-to-Door Round-Trip Navigation
            </h3>
            <p className="text-sm text-[#A9C4A2] leading-relaxed">
              Input where you start—your home, hotel, or airport—and BrewHop models the entire drive: 
              from departure to Stop 1, between each brewery in logical succession, and back to your starting 
              point with a one-click Google Maps multi-stop export.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#131F12] border border-[#223920] hover:border-[#58A72F]/50 transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#282110] text-[#F59E0B] border border-[#D97706]/40 flex items-center justify-center">
              <Bed className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white font-display tracking-tight uppercase">
              4. Curated Overnight Lodging
            </h3>
            <p className="text-sm text-[#A9C4A2] leading-relaxed">
              For 2-day and 3-day weekend road trips, safe travel is paramount. BrewHop automatically 
              locates vetted boutique hotels, historic inns, or cozy Airbnbs located within 30 minutes 
              of each day’s final brewery stop, matching your preferred lodging budget.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) with Atmospheric Draft Taps & Pints Background */}
      <section className="relative isolate overflow-hidden py-16 sm:py-24 border-y border-[#253D20] px-4 sm:px-6 lg:px-8">
        {/* Background Atmosphere Image - clear, vibrant craft beer bar scene */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <img
            src={breweryTapsPintsBg}
            alt="Craft beer taps and fresh poured pints on a rustic brewery bar counter"
            className="w-full h-full object-cover object-center brightness-105 contrast-105 scale-100"
            referrerPolicy="no-referrer"
          />
          {/* Balanced gradient scrim: keeps the image richly visible while smoothly fading at top and bottom edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.5)_100%)]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header Scrim Card for High Contrast Accessibility */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2 p-5 sm:p-6 rounded-3xl bg-black/60 backdrop-blur-[3px] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
            <span className="text-xs font-black text-[#66DE37] tracking-widest uppercase font-brand drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              SIMPLE 3-STEP EXPERIENCE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display uppercase tracking-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
              From Idea to Pint in 30 Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-black/70 backdrop-blur-md border border-white/15 space-y-4 relative shadow-[0_12px_32px_rgba(0,0,0,0.65)] hover:border-[#66DE37]/50 hover:bg-black/80 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-black text-xl font-brand border-2 border-[#F59E0B] shadow-lg">
                1
              </div>
              <h4 className="text-lg font-bold text-white font-display uppercase tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                Choose Your Preferences
              </h4>
              <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed font-medium">
                Tell us where you start, what destination you want to explore, your favored beer styles, and trip duration (1 day, 2 days, or weekend).
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-black/70 backdrop-blur-md border border-white/15 space-y-4 relative shadow-[0_12px_32px_rgba(0,0,0,0.65)] hover:border-[#66DE37]/50 hover:bg-black/80 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-black text-xl font-brand border-2 border-[#F59E0B] shadow-lg">
                2
              </div>
              <h4 className="text-lg font-bold text-white font-display uppercase tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                Engine Architects The Trail
              </h4>
              <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed font-medium">
                Our engine screens verified microbreweries, verifies style offerings, optimizes drive times, and locates top-rated overnight stays.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-black/70 backdrop-blur-md border border-white/15 space-y-4 relative shadow-[0_12px_32px_rgba(0,0,0,0.65)] hover:border-[#66DE37]/50 hover:bg-black/80 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-black text-xl font-brand border-2 border-[#F59E0B] shadow-lg">
                3
              </div>
              <h4 className="text-lg font-bold text-white font-display uppercase tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                Hit The Craft Trail
              </h4>
              <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed font-medium">
                Inspect taproom details, launch multi-stop Google Maps directions, check in visited breweries, or save trails to your profile.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onStartPlanning}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#58A72F] hover:bg-[#68BF38] text-white font-black text-sm sm:text-base tracking-wide font-brand transition-all cursor-pointer border border-[#7DD748] shadow-[0_8px_25px_rgba(88,167,47,0.4)] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>LAUNCH TRAIL PLANNER</span>
            </button>
          </div>
        </div>
      </section>

      {/* Popular Handcrafted Destinations Preview */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black text-[#D97706] tracking-widest uppercase font-brand">
              POPULAR CRAFT MECCAS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight mt-1">
              Iconic Beer Regions Ready to Explore
            </h2>
            <p className="text-xs sm:text-sm text-[#9CB394] mt-1">
              Select any classic craft destination below to prefill your itinerary planner instantly.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCuratedModal}
            className="flex items-center gap-1.5 text-xs font-bold text-[#66DE37] hover:text-[#8BE052] transition-colors cursor-pointer shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>View All Curated Itineraries →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {POPULAR_DESTINATIONS.map((dest, idx) => (
            <div
              key={dest.name}
              id={`curated-dest-card-${idx}`}
              onClick={() => onSelectCuratedDestination(idx)}
              className="p-5 rounded-3xl bg-[#131F12] border border-[#223920] hover:border-[#D97706] transition-all cursor-pointer group space-y-3 flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="text-xs text-[#8EAD84] mb-2">
                  <span className="font-semibold">{dest.region}</span>
                </div>
                <h4 className="text-base font-black text-white font-display group-hover:text-[#F59E0B] transition-colors leading-snug">
                  {dest.name}
                </h4>
                <p className="text-xs text-[#9CB394] mt-1.5 leading-relaxed line-clamp-3">
                  {dest.highlight}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1F331D] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#66DE37] font-brand tracking-wider">PREFILL TRAIL</span>
                <ChevronRight className="w-4 h-4 text-[#8EAD84] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Beer Updates Teaser Banner */}
      <section className="py-12 bg-gradient-to-r from-[#172B15] via-[#1E2014] to-[#2B1B10] border-t border-[#294225] px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
              GLOBAL BEER NEWS UPDATES & EVENTS
            </h3>
            <p className="text-xs sm:text-sm text-[#C3D9BF] max-w-xl">
              Stay ahead of the international craft beer scene. Read dynamic articles covering new beer launches, 
              breakthrough hop breeding (like Krush™ and Superdelic™), brewing summits, and world beer festivals.
            </p>
          </div>

          <a
            href="/news"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('news');
            }}
            className="px-6 py-3.5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm tracking-wider font-brand shrink-0 cursor-pointer shadow-lg border border-[#F59E0B] transition-all flex items-center gap-2"
          >
            <span>LATEST UPDATES</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Responsible Craft Drinking Commitment */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#172E15] text-[#66DE37] border border-[#58A72F]/40 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">
          Our Commitment to Responsible Craft Tasting
        </h3>
        <p className="text-xs sm:text-sm text-[#9CB394] leading-relaxed max-w-2xl mx-auto">
          Craft beer is about savoring flavor, artistry, and terroir. BrewHop encourages choosing a designated driver, 
          using rideshare services, ordering tasting flights (4 oz pours), spacing visits with wholesome meals, and 
          staying hydrated with water at every stop.
        </p>
      </section>
    </div>
  );
};
