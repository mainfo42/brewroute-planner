import React from 'react';
import { X, Compass, MapPin, Sparkles, ChevronRight, Check } from 'lucide-react';
import { HopIcon } from './HopIcon';
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
      <div className="bg-[#FAFDF9] rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-[#C6E2BD] flex flex-col animate-slide-up sm:animate-none">
        
        {/* Mobile Drag Pill Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-[#B2D8A6]/60" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-6 bg-white flex items-center justify-between border-b border-[#EAF4E6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center font-bold shadow-xs">
              <HopIcon className="w-5 h-5 text-[#58A72F]" filled />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#122610] tracking-tight font-display">
                Famous Microbrewery Trails
              </h2>
              <p className="text-xs text-[#4D6D47] font-normal">
                Iconic craft beer regions & instant verified itineraries
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-curated-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#4D6D47] hover:text-[#122610] hover:bg-[#EAF4E6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Trails */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Featured Ready-to-Explore Route */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-black text-[#58A72F] uppercase tracking-wider flex items-center gap-1.5 font-brand">
              <Sparkles className="w-3.5 h-3.5 text-[#58A72F]" />
              <span>Featured Complete Itinerary (Instant Preview)</span>
            </span>

            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#C6E2BD] hover:border-[#58A72F] transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#58A72F] text-white text-[10px] font-black uppercase tracking-wider font-brand">
                    2 Days • 6 Breweries
                  </span>
                  <span className="text-xs font-bold text-[#122610]">
                    {SAMPLE_CURATED_ROUTE.region}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#122610] font-display">
                  {SAMPLE_CURATED_ROUTE.title}
                </h3>
                <p className="text-xs text-[#4D6D47] max-w-xl font-normal leading-relaxed">
                  {SAMPLE_CURATED_ROUTE.summary}
                </p>
                <div className="text-[11px] text-[#122610]/80 font-medium pt-1">
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
                className="px-5 py-2.5 rounded-full bg-[#58A72F] hover:bg-[#489224] active:bg-[#3D7C1E] text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer min-h-[40px] font-brand tracking-wider uppercase border border-[#7CD749]"
              >
                <span>LOAD TRAIL</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Regional Inspirations */}
          <div className="space-y-3">
            <span className="text-[11px] font-black text-[#4D6D47] uppercase tracking-wider font-brand">
              Iconic Craft Regions (Pre-Fill Parameters)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POPULAR_DESTINATIONS.map((dest, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-[#C6E2BD] bg-white hover:border-[#58A72F] transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-extrabold text-sm text-[#122610] font-display">
                        {dest.name}
                      </h4>
                      <span className="text-[10px] font-black text-[#122B0F] bg-[#DDF1D2] border border-[#B2D8A6] px-2 py-0.5 rounded-full font-brand uppercase">
                        {dest.region}
                      </span>
                    </div>
                    <p className="text-xs text-[#4D6D47] mb-2 font-normal">
                      {dest.highlight}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {dest.suggestedStyles.map((st) => (
                        <span
                          key={st}
                          className="px-2 py-0.5 rounded-md bg-[#EAF4E6] text-[#122610] text-[10px] font-bold border border-[#C6E2BD]"
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
                    className="w-full py-2 rounded-full bg-[#EAF4E6] hover:bg-[#DDF1D2] hover:text-[#122B0F] text-[#122610] font-black text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[36px] font-brand tracking-wider uppercase"
                  >
                    <span>USE THESE PARAMETERS</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#58A72F]" />
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

