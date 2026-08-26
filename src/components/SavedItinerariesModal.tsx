import React, { useState } from 'react';
import {
  X,
  FolderHeart,
  Search,
  Trash2,
  ExternalLink,
  ChevronRight,
  Beer,
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
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
      <div className="bg-slate-50 rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-slide-up sm:animate-none">
        
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-6 bg-white flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center font-bold shadow-xs">
              <FolderHeart className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                My Saved Itineraries
              </h2>
              <p className="text-xs text-slate-500">
                {savedItineraries.length} route{savedItineraries.length !== 1 ? 's' : ''} saved to your passport
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-saved-itineraries-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-white border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="saved-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, region, or beer style..."
              className="w-full pl-10 pr-9 py-2 rounded-full bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 min-h-[40px]"
            />
            {searchQuery && (
              <button
                type="button"
                id="clear-saved-search"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <span className="text-[11px] font-semibold text-slate-500">Filter:</span>
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
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filterDuration === f.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            <div className="py-12 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Beer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {savedItineraries.length === 0
                  ? 'No saved routes yet'
                  : 'No routes match your search'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
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
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                      {item.route.region}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {item.route.days.length} Day{item.route.days.length > 1 ? 's' : ''} • {item.route.totalBreweries} Breweries
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Saved {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {item.route.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {item.route.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.route.parameters.beerStyles.map((st) => (
                      <span
                        key={st}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
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
                    className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[40px]"
                  >
                    <span>Load Route</span>
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
