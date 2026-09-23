import React from 'react';
import {
  Sparkles,
  MapPin,
  Clock,
  Compass,
  Award,
  Bed,
  Route as RouteIcon,
  ShieldCheck,
  ChevronRight,
  Beer,
  Star,
  Newspaper,
  CheckCircle,
} from 'lucide-react';
import { HopIcon } from './HopIcon';
import { AppPageView } from '../types';
import { POPULAR_DESTINATIONS } from '../data/curatedRoutes';

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
    <div id="beerhop-home-page" className="w-full text-white bg-black animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#1E301B]">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#58A72F]/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Brand Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182B16] border border-[#58A72F]/40 text-[#A6E88B] text-xs font-bold font-brand tracking-wider shadow-xs">
            <HopIcon className="w-4 h-4 text-[#66DE37]" filled />
            <span>THE MICROBREWERY TRAIL ARCHITECT</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white font-display uppercase leading-[1.08] max-w-4xl mx-auto">
            Curate Your Perfect <br className="hidden sm:inline" />
            <span className="text-[#66DE37] drop-shadow-[0_2px_15px_rgba(102,222,55,0.3)]">
              Craft Beer Road Trip
            </span>
          </h1>

          {/* Purpose & Mission Statement */}
          <p className="text-base sm:text-xl text-[#C3D9BF] max-w-3xl mx-auto font-normal leading-relaxed">
            BeerHop is engineered to eliminate the stress and guesswork from brewery touring. 
            We automatically craft custom itineraries tailored to your favorite beer styles, 
            spacing every stop strictly within scenic 25-minute drives, backed by 4-platform 
            verified ratings, seamless round-trip Google Maps navigation, and boutique overnight stays.
          </p>

          {/* Primary Action Button */}
          <div className="flex items-center justify-center pt-4">
            <button
              type="button"
              id="home-cta-plan-trail"
              onClick={onStartPlanning}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-black text-base sm:text-lg tracking-wide font-brand shadow-xl hover:shadow-[#D97706]/30 transition-all cursor-pointer flex items-center justify-center gap-3 border-2 border-[#F59E0B] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>PLAN YOUR BEER TRAIL NOW</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto">
            <div className="p-3 rounded-2xl bg-[#121E11] border border-[#233A1F] text-center">
              <span className="text-xl sm:text-2xl font-black text-[#66DE37] font-brand block">≤ 25 MIN</span>
              <span className="text-[11px] text-[#9CB394] font-medium">Drive Time Between Stops</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#121E11] border border-[#233A1F] text-center">
              <span className="text-xl sm:text-2xl font-black text-[#F59E0B] font-brand block">4 PLATFORMS</span>
              <span className="text-[11px] text-[#9CB394] font-medium">Untappd + Google + RateBeer</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#121E11] border border-[#233A1F] text-center">
              <span className="text-xl sm:text-2xl font-black text-white font-brand block">ROUND-TRIP</span>
              <span className="text-[11px] text-[#9CB394] font-medium">Turn-by-Turn Google Maps</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#121E11] border border-[#233A1F] text-center">
              <span className="text-xl sm:text-2xl font-black text-[#66DE37] font-brand block">CURATED STAYS</span>
              <span className="text-[11px] text-[#9CB394] font-medium">Within 30 min of Final Taproom</span>
            </div>
          </div>
        </div>
      </section>

      {/* The BeerHop Purpose: Why We Built This */}
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
            BeerHop replaces all of that with intelligent, palate-first craft travel curation.
          </p>
        </div>

        {/* 4 Pillars of BeerHop */}
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
              rich imperial pastry stouts, or crisp German pilsners, BeerHop prioritizes breweries 
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
              Input where you start—your home, hotel, or airport—and BeerHop models the entire drive: 
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
              For 2-day and 3-day weekend road trips, safe travel is paramount. BeerHop automatically 
              locates vetted boutique hotels, historic inns, or cozy Airbnbs located within 30 minutes 
              of each day’s final brewery stop, matching your preferred lodging budget.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="py-14 bg-[#0E170D] border-y border-[#1E301B] px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black text-[#58A72F] tracking-widest uppercase font-brand">
              SIMPLE 3-STEP EXPERIENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
              From Idea to Pint in 30 Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#142312] border border-[#243D20] space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-black text-xl font-brand border-2 border-[#F59E0B]">
                1
              </div>
              <h4 className="text-lg font-bold text-white font-display uppercase">Choose Your Preferences</h4>
              <p className="text-xs sm:text-sm text-[#9CB394] leading-relaxed">
                Tell us where you start, what destination you want to explore, your favored beer styles, and trip duration (1 day, 2 days, or weekend).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#142312] border border-[#243D20] space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-black text-xl font-brand border-2 border-[#F59E0B]">
                2
              </div>
              <h4 className="text-lg font-bold text-white font-display uppercase">Engine Architects The Trail</h4>
              <p className="text-xs sm:text-sm text-[#9CB394] leading-relaxed">
                Our engine screens verified microbreweries, verifies style offerings, optimizes drive times, and locates top-rated overnight stays.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#142312] border border-[#243D20] space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-black text-xl font-brand border-2 border-[#F59E0B]">
                3
              </div>
              <h4 className="text-lg font-bold text-white font-display uppercase">Hit The Craft Trail</h4>
              <p className="text-xs sm:text-sm text-[#9CB394] leading-relaxed">
                Inspect taproom details, launch multi-stop Google Maps directions, check in visited breweries, or save trails to your profile.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onStartPlanning}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#58A72F] hover:bg-[#68BF38] text-white font-bold text-sm tracking-wide font-brand transition-all cursor-pointer border border-[#7DD748] shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
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
                <div className="flex items-center justify-between text-xs text-[#8EAD84] mb-2">
                  <span className="font-semibold truncate pr-2">{dest.region}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1E331B] text-[#A6D496] font-bold shrink-0">
                    {dest.suggestedStyles.length} Styles
                  </span>
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

          <button
            type="button"
            onClick={() => onNavigate('news')}
            className="px-6 py-3.5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm tracking-wider font-brand shrink-0 cursor-pointer shadow-lg border border-[#F59E0B] transition-all flex items-center gap-2"
          >
            <span>LATEST UPDATES</span>
            <ChevronRight className="w-4 h-4" />
          </button>
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
          Craft beer is about savoring flavor, artistry, and terroir. BeerHop encourages choosing a designated driver, 
          using rideshare services, ordering tasting flights (4 oz pours), spacing visits with wholesome meals, and 
          staying hydrated with water at every stop.
        </p>
      </section>
    </div>
  );
};
