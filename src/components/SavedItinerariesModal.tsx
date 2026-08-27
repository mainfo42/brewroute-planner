import React, { useState } from 'react';
import {
  X,
  FolderHeart,
  Search,
  Trash2,
  ExternalLink,
  ChevronRight,
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { HopIcon } from './HopIcon';
import { SavedItinerary, BrewTravelRoute } from '../types';

interface SavedItinerariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItineraries: SavedItinerary[];
  onSelectItinerary: (route: BrewTravelRoute) => void;
  onDeleteItinerary: (id: string) => void;
}

export const SavedItinerariesModal: React.FC<SavedItinerariesModalProps> = ({
  isOpen,
  onClose,
  savedItineraries,
  onSelectItinerary,
  onDeleteItinerary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDuration, setFilterDuration] = useState<'all' | 'single' | 'multi'>('all');

  if (!isOpen) return null;

  // Filter itineraries by title, region, or beer styles
  const filteredItineraries = savedItineraries.filter((item) => {
    const matchesSearch =
      item.route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.parameters.beerStyles.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (filterDuration === 'single') {
      return item.route.days.length === 1;
    } else if (filterDuration === 'multi') {
      return item.route.days.length > 1;
    }

    return true;
  });

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently saved';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAFDF9] rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-[#C6E2BD] flex flex-col animate-slide-up sm:animate-none">
        
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-[#B2D8A6]/60" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-6 bg-white flex items-center justify-between border-b border-[#EAF4E6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center font-bold shadow-xs">
              <FolderHeart className="w-5 h-5 text-[#58A72F]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#122610] tracking-tight font-display">
                My Saved Itineraries
              </h2>
              <p className="text-xs text-[#4D6D47] font-semibold">
                {savedItineraries.length} route{savedItineraries.length !== 1 ? 's' : ''} saved to your passport
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-saved-itineraries-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#4D6D47] hover:text-[#122610] hover:bg-[#EAF4E6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-white border-b border-[#EAF4E6] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#58A72F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="saved-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, region, or beer style..."
              className="w-full pl-10 pr-9 py-2 rounded-full bg-[#FAFDF9] border border-[#C6E2BD] text-xs sm:text-sm text-[#122610] placeholder:text-[#6D9364] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#58A72F]/20 min-h-[40px] font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                id="clear-saved-search"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D9364] hover:text-[#122610] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <span className="text-[11px] font-black text-[#4D6D47] font-brand uppercase">Filter:</span>
            {[
              { id: 'all', label: 'All Trails' },
              { id: 'single', label: '1 Day' },
              { id: 'multi', label: '2+ Days' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                id={`filter-saved-${f.id}`}
                onClick={() => setFilterDuration(f.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer font-brand uppercase tracking-wide ${
                  filterDuration === f.id
                    ? 'bg-[#162D15] text-[#DDF1D2] shadow-2xs'
                    : 'bg-[#EAF4E6] text-[#122610] hover:bg-[#DDF1D2]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5">
          {filteredItineraries.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-white rounded-3xl border border-[#C6E2BD] p-6">
              <div className="w-12 h-12 rounded-full bg-[#DDF1D2] text-[#58A72F] flex items-center justify-center mx-auto">
                <HopIcon className="w-6 h-6 text-[#58A72F]" filled />
              </div>
              <h3 className="text-base font-extrabold text-[#122610] font-display">
                {savedItineraries.length === 0
                  ? 'No saved routes yet'
                  : 'No routes match your search'}
              </h3>
              <p className="text-xs text-[#4D6D47] max-w-sm mx-auto">
                {savedItineraries.length === 0
                  ? 'When you generate a craft beer route you love, click "Save This Itinerary" to store it for offline travel!'
                  : 'Try adjusting your search terms or filters.'}
              </p>
            </div>
          ) : (
            filteredItineraries.map((item) => (
              <div
                key={item.id}
                id={`saved-itinerary-card-${item.id}`}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#C6E2BD] hover:border-[#58A72F] transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] text-[10px] font-black uppercase tracking-wider font-brand">
                      {item.route.region}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAF4E6] text-[#122610] text-[10px] font-bold">
                      {item.route.days.length} Day{item.route.days.length > 1 ? 's' : ''} • {item.route.totalBreweries} Breweries
                    </span>
                    <span className="text-[10px] text-[#6D9364] font-medium">
                      Saved {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#122610] truncate font-display">
                    {item.route.title}
                  </h3>

                  <p className="text-xs text-[#4D6D47] line-clamp-1">
                    {item.route.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.route.parameters.beerStyles.map((st) => (
                      <span
                        key={st}
                        className="px-2 py-0.5 rounded-md bg-[#EAF4E6] text-[#122610] text-[10px] font-bold border border-[#C6E2BD]"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    id={`delete-saved-itinerary-${item.id}`}
                    onClick={() => onDeleteItinerary(item.id)}
                    className="p-2.5 rounded-full text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete saved route"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id={`open-saved-itinerary-${item.id}`}
                    onClick={() => {
                      onSelectItinerary(item.route);
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#58A72F] hover:bg-[#489224] active:bg-[#3D7C1E] text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[40px] font-brand tracking-wider uppercase border border-[#7CD749]"
                  >
                    <span>LOAD ROUTE</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

