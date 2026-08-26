import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Car,
  Beer,
  Utensils,
  Star,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Calendar,
  Share2,
  Printer,
  Building,
  Home,
  BedDouble,
  DollarSign,
  Info,
  Map as MapIcon,
  ListOrdered,
  Sparkles,
  Bookmark,
  Award,
  ArrowRight,
  RotateCcw,
  FolderHeart,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BrewTravelRoute, BreweryStop, StayRecommendation } from '../types';
import { RouteMap } from './RouteMap';

interface RouteDisplayProps {
  route: BrewTravelRoute;
  onOpenExport: () => void;
  onToggleVisited: (breweryId: string) => void;
  visitedBreweries: Record<string, boolean>;
  onPlanNew: () => void;
  isSaved?: boolean;
  onSaveItinerary?: () => void;
  isLoggedIn?: boolean;
  onRegenerateAlternative?: () => void;
  isRegenerating?: boolean;
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({
  route,
  onOpenExport,
  onToggleVisited,
  visitedBreweries,
  onPlanNew,
  isSaved = false,
  onSaveItinerary,
  isLoggedIn = false,
  onRegenerateAlternative,
  isRegenerating = false,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'map' | 'all'>('timeline');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | 'all'>('all');
  const [copiedMapsLink, setCopiedMapsLink] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const toggleExpandBrewery = (breweryId: string) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [breweryId]: !prev[breweryId],
    }));
  };

  const handleCopyMapsUrl = () => {
    if (route.googleMapsMultiStopUrl) {
      navigator.clipboard.writeText(route.googleMapsMultiStopUrl);
      setCopiedMapsLink(true);
      setTimeout(() => setCopiedMapsLink(false), 2500);
    }
  };

  const getStayIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return Building;
      case 'airbnb':
        return Home;
      default:
        return Building;
    }
  };

  // Filter days based on tab
  const displayDays = selectedDayNumber === 'all'
    ? route.days
    : route.days.filter((d) => d.dayNumber === selectedDayNumber);

  // Format minutes into hours and minutes
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `~${minutes} mins`;
    const hrs = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `~${hrs} hr ${remainingMins} min` : `~${hrs} hr`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-8 px-4 sm:px-6 space-y-5 pb-28 md:pb-12">
      
      {/* Top Banner & Overview Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pb-6 border-b border-slate-100">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold tracking-wide">
                {route.region}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {route.days.length} Day{route.days.length > 1 ? 's' : ''} • {route.totalBreweries} Breweries
              </span>
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ≤ 20 Min Between Stops
              </span>
              <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                Round-Trip
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {route.title}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {route.summary}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full sm:w-auto">
            {/* Google Maps Primary Launch Button */}
            {route.googleMapsMultiStopUrl && (
              <div className="flex flex-col gap-1.5 w-full">
                <a
                  id="open-google-maps-full-route-btn"
                  href={route.googleMapsMultiStopUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer min-h-[46px] group"
                >
                  <Navigation className="w-4 h-4 shrink-0 text-amber-200 group-hover:rotate-12 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold leading-tight flex items-center gap-1.5">
                      <span>Launch Google Maps Route</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </div>
                  </div>
                </a>

                <button
                  type="button"
                  id="copy-google-maps-link-btn"
                  onClick={handleCopyMapsUrl}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
                >
                  {copiedMapsLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Maps Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Google Maps Link</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Save Itinerary Button */}
            {onSaveItinerary && (
              <button
                type="button"
                id="save-route-header-btn"
                onClick={onSaveItinerary}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer min-h-[42px] ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved to Account ✓</span>
                  </>
                ) : (
                  <>
                    <FolderHeart className="w-4 h-4 text-amber-700" />
                    <span>Save This Itinerary</span>
                  </>
                )}
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="export-itinerary-modal-btn"
                onClick={onOpenExport}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors min-h-[38px] cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Export</span>
              </button>

              <button
                type="button"
                id="print-itinerary-btn"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors min-h-[38px] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-600" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Route Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-5">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5 mb-1">
              <Beer className="w-3.5 h-3.5 text-amber-600" />
              <span>Total Stops</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              {route.totalBreweries} Breweries
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Max 3 / day limit</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Total Drive</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              {formatTime(route.totalTravelTimeMin)}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold truncate mt-0.5" title="Includes departure from home and return trip">
              Includes start & return
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5 mb-1">
              <Car className="w-3.5 h-3.5 text-amber-600" />
              <span>Total Distance</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              ~{route.totalDistanceMiles.toFixed(1)} mi
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              From: {route.parameters.startLocation}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Beer Styles</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {route.parameters.beerStyles.slice(0, 3).join(', ')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Curated selection</div>
          </div>
        </div>
      </div>

      {/* Segmented Control & Day Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Day Selector Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full border border-slate-200 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            id="day-filter-all"
            onClick={() => setSelectedDayNumber('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[34px] ${
              selectedDayNumber === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Days ({route.days.length})
          </button>
          {route.days.map((day) => (
            <button
              key={day.dayNumber}
              type="button"
              id={`day-filter-${day.dayNumber}`}
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[34px] ${
                selectedDayNumber === day.dayNumber
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Day {day.dayNumber} ({day.breweries.length} stops)
            </button>
          ))}
        </div>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 self-end sm:self-auto">
          <button
            type="button"
            id="view-toggle-timeline"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 text-amber-600" />
            <span>Itinerary</span>
          </button>
          <button
            type="button"
            id="view-toggle-map"
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Map Only</span>
          </button>
          <button
            type="button"
            id="view-toggle-all"
            onClick={() => setActiveTab('all')}
            className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Split View</span>
          </button>
        </div>
      </div>

      {/* Main Content View Grid */}
      <div className={`grid grid-cols-1 ${activeTab === 'all' ? 'lg:grid-cols-12 gap-6' : 'gap-6'}`}>
        
        {/* Itinerary Timeline Column */}
        {(activeTab === 'timeline' || activeTab === 'all') && (
          <div className={`${activeTab === 'all' ? 'lg:col-span-7' : 'w-full'} space-y-6`}>
            {displayDays.map((day) => {
              const isFirstDay = day.dayNumber === 1;
              const isLastDay = day.dayNumber === route.days.length;

              return (
                <div
                  key={day.dayNumber}
                  id={`day-section-${day.dayNumber}`}
                  className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-5"
                >
                  {/* Day Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-amber-600 text-white font-bold text-xs uppercase tracking-wider">
                          Day {day.dayNumber}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          Start ~{day.recommendedStartTime}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                        {day.dayTitle}
                      </h2>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      {day.breweries.length} Brewery Stops (Spaced ≤ 20 min)
                    </div>
                  </div>

                  {/* Departure Leg Card (Day 1) */}
                  {isFirstDay && route.departureTransit && (
                    <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
                          🚗
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            Departure from {route.departureTransit.fromName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Drive ~{route.departureTransit.driveTimeMin} mins ({route.departureTransit.distanceMiles.toFixed(1)} mi) to Stop 1
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold shrink-0">
                        Origin
                      </span>
                    </div>
                  )}

                  {/* Brewery Stops List */}
                  <div className="space-y-4">
                    {day.breweries.map((brewery, bIdx) => {
                      const isVisited = !!visitedBreweries[brewery.id || `${day.dayNumber}-${bIdx}`];
                      const isExpanded = !!expandedDetails[brewery.id || `${day.dayNumber}-${bIdx}`];

                      return (
                        <div key={brewery.id || bIdx} className="space-y-3">
                          {/* Inter-Stop Transit Connector */}
                          {brewery.driveTimeFromPreviousMin !== undefined && (
                            <div className="flex items-center gap-2 pl-4 py-1 text-xs text-slate-500">
                              <div className="w-0.5 h-4 bg-slate-300" />
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center gap-1 border border-slate-200">
                                <span>🚗 ~{brewery.driveTimeFromPreviousMin} min drive</span>
                                {brewery.driveTimeFromPreviousMin <= 20 && (
                                  <span className="text-emerald-600">✓ ≤20 min</span>
                                )}
                              </span>
                            </div>
                          )}

                          {/* Brewery Card */}
                          <div
                            id={`brewery-card-${brewery.id || bIdx}`}
                            className={`rounded-3xl border transition-all overflow-hidden ${
                              isVisited
                                ? 'bg-emerald-50/50 border-emerald-300'
                                : 'bg-white border-slate-200 hover:border-amber-400 shadow-xs'
                            }`}
                          >
                            <div className="p-4 sm:p-5 space-y-3">
                              {/* Header: Badge, Name, Visited Checkbox */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  {/* Stop Number Circle */}
                                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                    {bIdx + 1}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                        {brewery.name}
                                      </h3>
                                      <span className="text-xs text-slate-500 font-medium">
                                        ({brewery.city}, {brewery.state || route.region})
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                                      <span>{brewery.address}</span>
                                    </p>
                                  </div>
                                </div>

                                {/* Visited Toggle */}
                                <button
                                  type="button"
                                  id={`toggle-visited-btn-${brewery.id || bIdx}`}
                                  onClick={() => onToggleVisited(brewery.id || `${day.dayNumber}-${bIdx}`)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                                    isVisited
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                  }`}
                                  title="Mark as visited in your tasting passport"
                                >
                                  <Check className={`w-3.5 h-3.5 ${isVisited ? 'text-emerald-700 stroke-[3]' : 'text-transparent'}`} />
                                  <span>{isVisited ? 'Visited' : 'Check In'}</span>
                                </button>
                              </div>

                              {/* Ratings & Recommended Tasting Time Chips */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-600 text-amber-600" />
                                  <span>Untappd {brewery.ratings.untappd.score.toFixed(2)} ★</span>
                                </span>

                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold flex items-center gap-1 border border-slate-200">
                                  <span>Google {brewery.ratings.google.score.toFixed(1)} ★</span>
                                  <span className="text-[10px] text-slate-500">({brewery.ratings.google.reviewCount})</span>
                                </span>

                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>~{brewery.suggestedDurationMin} min tasting</span>
                                </span>
                              </div>

                              {/* Renowned For & Specialties */}
                              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <Beer className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Renowned For:</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {brewery.beerHighlights.map((bh, bhIdx) => (
                                    <span
                                      key={bhIdx}
                                      className="px-2.5 py-1 rounded-xl bg-white text-slate-900 text-xs font-medium border border-slate-200 shadow-xs"
                                    >
                                      <strong>{bh.name}</strong>{' '}
                                      <span className="text-[11px] text-amber-700">({bh.style}, {bh.abv} ABV)</span>
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Food & Amenities */}
                              {brewery.foodHighlights && (
                                <div className="text-xs text-slate-700 flex items-center gap-2 pt-0.5">
                                  <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span className="font-medium"><strong>Food Pairing:</strong> {brewery.foodHighlights}</span>
                                </div>
                              )}

                              {/* Action: Open in Google Maps */}
                              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brewery.name + ' ' + brewery.address)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors"
                                >
                                  <Navigation className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Navigate to Stop</span>
                                  <ExternalLink className="w-3 h-3 opacity-60" />
                                </a>

                                {brewery.atmosphere && (
                                  <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                                    "{brewery.atmosphere}"
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Day Stay Recommendation (if applicable) */}
                  {day.stay && (
                    <div className="bg-amber-50/70 rounded-3xl p-4 sm:p-5 border border-amber-200 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                            🛏️
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                                Night {day.dayNumber} Recommended Stay
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-white text-slate-800 text-[10px] font-bold border border-slate-200">
                                {day.stay.type.toUpperCase()}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                              {day.stay.name}
                            </h3>
                            <p className="text-[11px] text-slate-500">{day.stay.address}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-bold text-amber-800">
                            {day.stay.estimatedPricePerNight}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold">
                            ~{day.stay.driveTimeFromLastBreweryMin} min from final brewery
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 leading-relaxed pt-1">
                        {day.stay.whyRecommended}
                      </div>
                    </div>
                  )}

                  {/* Return Home Leg Card (Final Day) */}
                  {isLastDay && route.returnHomeTransit && (
                    <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold shrink-0">
                          🏡
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            Return Home to {route.returnHomeTransit.toName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Drive ~{route.returnHomeTransit.driveTimeMin} mins ({route.returnHomeTransit.distanceMiles.toFixed(1)} mi) from final stop
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold shrink-0">
                        Completed
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Map Column */}
        {(activeTab === 'map' || activeTab === 'all') && (
          <div className={`${activeTab === 'all' ? 'lg:col-span-5' : 'w-full'} space-y-4 sticky top-20`}>
            <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-xs">
              <div className="h-[450px] sm:h-[540px]">
                <RouteMap route={route} selectedDay={selectedDayNumber} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions Card: Alternative Route & Plan New */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Want to explore different microbreweries?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate an alternative route with new top-rated stops or start fresh.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onRegenerateAlternative && (
            <button
              type="button"
              id="regenerate-alternative-route-btn"
              disabled={isRegenerating}
              onClick={onRegenerateAlternative}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-amber-600 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Brewing Alternative...' : 'Alternative Route'}</span>
            </button>
          )}

          <button
            type="button"
            id="plan-new-route-bottom-btn"
            onClick={onPlanNew}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Plan New Route</span>
          </button>
        </div>
      </div>
    </div>
  );
};
