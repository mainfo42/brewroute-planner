import React from 'react';
import { X, Compass, MapPin, Beer, Sparkles, ChevronRight, Check } from 'lucide-react';
import { POPULAR_DESTINATIONS, SAMPLE_CURATED_ROUTE } from '../data/curatedRoutes';
import { BrewTravelRoute } from '../types';

interface CuratedRoutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoute: (route: BrewTravelRoute) => void;
  onPrefillParams: (startLoc: string, area: string, styles: string[]) => void;
}

export const CuratedRoutesModal: React.FC<CuratedRoutesModalProps> = ({
  isOpen,
  onClose,
  onSelectRoute,
  onPrefillParams,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-50 rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-slide-up sm:animate-none">
        
        {/* Mobile Drag Pill Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-6 bg-white flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Famous Microbrewery Trails
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Iconic craft beer regions & instant verified itineraries
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-curated-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Trails */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Featured Ready-to-Explore Route */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Featured Complete Itinerary (Instant Preview)</span>
            </span>

            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    2 Days • 6 Breweries
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    {SAMPLE_CURATED_ROUTE.region}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {SAMPLE_CURATED_ROUTE.title}
                </h3>
                <p className="text-xs text-slate-500 max-w-xl font-normal leading-relaxed">
                  {SAMPLE_CURATED_ROUTE.summary}
                </p>
                <div className="text-[11px] text-slate-700 font-medium pt-1">
                  Featuring: The Alchemist, von Trapp Bierhall, Idletyme, Prohibition Pig, Freak Folk & Lawson's + Stowe B&B stay.
                </div>
              </div>

              <button
                type="button"
                id="load-sample-vermont-btn"
                onClick={() => {
                  onSelectRoute(SAMPLE_CURATED_ROUTE);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer min-h-[40px]"
              >
                <span>Load Trail</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Regional Inspirations */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Iconic Craft Regions (Pre-Fill Parameters)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POPULAR_DESTINATIONS.map((dest, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-slate-900">
                        {dest.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                        {dest.region}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 font-normal">
                      {dest.highlight}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {dest.suggestedStyles.map((st) => (
                        <span
                          key={st}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    id={`prefill-dest-${idx}`}
                    onClick={() => {
                      onPrefillParams(dest.startLoc, dest.name, dest.suggestedStyles);
                      onClose();
                    }}
                    className="w-full py-2 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[36px]"
                  >
                    <span>Use These Parameters</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
