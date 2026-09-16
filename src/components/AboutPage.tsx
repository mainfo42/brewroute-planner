import React from 'react';
import {
  Info,
  Sparkles,
  MapPin,
  Clock,
  Award,
  Bed,
  ShieldCheck,
  ChevronRight,
  Heart,
  Compass,
  CheckCircle2,
  Newspaper,
  BookOpen,
} from 'lucide-react';
import { HopIcon } from './HopIcon';
import { AppPageView } from '../types';

interface AboutPageProps {
  onStartPlanning: () => void;
  onNavigate: (page: AppPageView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onStartPlanning,
  onNavigate,
}) => {
  return (
    <div id="beerhop-about-page" className="w-full text-white bg-black py-10 sm:py-16 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Breadcrumb & Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182B16] border border-[#58A72F]/40 text-[#A6E88B] text-xs font-bold font-brand tracking-wider">
            <Info className="w-4 h-4 text-[#66DE37]" />
            <span>ABOUT BEERHOP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display uppercase leading-tight">
            The Purpose Behind <br />
            <span className="text-[#66DE37]">BeerHop</span>
          </h1>

          <p className="text-base sm:text-lg text-[#C3D9BF] max-w-2xl mx-auto leading-relaxed">
            Craft beer is more than a beverage—it is an agricultural art form, a community anchor, 
            and one of the greatest reasons to explore new roads and towns.
          </p>
        </div>

        {/* The Origin Story & Purpose */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#131F12] border border-[#233A1F] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1D361A] text-[#66DE37] border border-[#58A72F]/40 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
              Why We Created BeerHop
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#A9C4A2] leading-relaxed">
            <p>
              Like countless craft beer lovers, we’ve spent weekends opening dozens of mapping apps, 
              Untappd pages, and social media feeds trying to stitch together a coherent brewery crawl. 
              Too often, the result was grueling 90-minute drives between stops, arriving at taprooms that 
              didn't pour the styles we loved, or zigzagging across busy highways instead of enjoying peaceful scenic backroads.
            </p>
            <p>
              <strong className="text-white">BeerHop exists to solve this completely.</strong> Our purpose is to serve 
              as an intelligent travel architect for beer lovers, road trippers, and weekend adventurers. We automate 
              the complex logistics of brewery touring so you can spend your time where it belongs: in sunny beer gardens, 
              chatting with passionate brewmasters, and discovering fresh local pints.
            </p>
          </div>
        </div>

        {/* The 4 Foundational Pillars */}
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <span className="text-xs font-black text-[#D97706] tracking-widest uppercase font-brand">
              CORE PRINCIPLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight mt-1">
              The Architecture of a Great Beer Trail
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-[#152314] border border-[#243F21] space-y-3">
              <div className="flex items-center gap-2.5 text-[#66DE37]">
                <Clock className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-bold text-white text-base uppercase font-display">The ≤ 25-Minute Rule</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#9CB394] leading-relaxed">
                We strictly limit inter-brewery drives to 25 minutes or less. This preserves your energy, 
                minimizes road fatigue, and ensures your day is paced with relaxation rather than endless transit.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#152314] border border-[#243F21] space-y-3">
              <div className="flex items-center gap-2.5 text-[#66DE37]">
                <Award className="w-5 h-5 text-[#66DE37]" />
                <h3 className="font-bold text-white text-base uppercase font-display">Composite Quality Screening</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#9CB394] leading-relaxed">
                Rather than relying on a single biased review score, BeerHop cross-references verified data from 
                Untappd, Google Reviews, RateBeer, and TripAdvisor to highlight truly exceptional craft producers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#152314] border border-[#243F21] space-y-3">
              <div className="flex items-center gap-2.5 text-[#66DE37]">
                <MapPin className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-bold text-white text-base uppercase font-display">Round-Trip Geography</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#9CB394] leading-relaxed">
                Every route considers your actual starting point and calculates safe return travel. We don't just dump 
                pins on a map; we sequence them logically along a scenic loop or forward corridor.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#152314] border border-[#243F21] space-y-3">
              <div className="flex items-center gap-2.5 text-[#66DE37]">
                <Bed className="w-5 h-5 text-[#66DE37]" />
                <h3 className="font-bold text-white text-base uppercase font-display">Overnight Stay Intelligence</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#9CB394] leading-relaxed">
                For 2-day and weekend trails, we identify verified boutique hotels and Airbnbs located within 30 minutes 
                of your final taproom of the day, ensuring you never have to scramble for lodging late at night.
              </p>
            </div>
          </div>
        </div>

        {/* Responsible Craft Drinking Charter */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#172215] border border-[#2B4628] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#213D1D] text-[#66DE37] border border-[#58A72F]/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white font-display uppercase tracking-tight">
              Our Safety & Responsibility Charter
            </h2>
          </div>

          <p className="text-sm text-[#A9C4A2] leading-relaxed">
            BeerHop is dedicated to responsible appreciation of craft beer. We encourage our community to:
          </p>

          <ul className="space-y-2 text-xs sm:text-sm text-[#C3D9BF]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#66DE37] shrink-0 mt-0.5" />
              <span>Designate a non-drinking driver or use rideshare services when visiting taprooms.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#66DE37] shrink-0 mt-0.5" />
              <span>Opt for 4-ounce taster flights to sample diverse styles without consuming high volumes.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#66DE37] shrink-0 mt-0.5" />
              <span>Hydrate with a glass of water between every sample and pair beer with wholesome meals.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#66DE37] shrink-0 mt-0.5" />
              <span>Respect local brewery staff and taproom communities—independent beer thrives on respect.</span>
            </li>
          </ul>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onStartPlanning}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-black text-base tracking-wide font-brand shadow-xl border-2 border-[#F59E0B] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>START PLANNING YOUR ROUTE</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('news')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#172816] hover:bg-[#20361E] text-[#DDF1D2] font-bold text-sm tracking-normal transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#30522B]"
          >
            <Newspaper className="w-4 h-4 text-[#F59E0B]" />
            <span>Read Global Beer Updates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
