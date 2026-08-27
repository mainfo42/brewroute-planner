import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Car,
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
  AlertTriangle,
  SlidersHorizontal,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { HopIcon } from './HopIcon';
import { BrewTravelRoute, BreweryStop, StayRecommendation } from '../types';
import { RouteMap } from './RouteMap';
import { checkBeerMatchesStyle } from '../utils/styleMatcher';

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
      
      {/* Optional Proximity / Style Modification Warning Banner */}
      {route.hasRouteWarning && (
        <div 
          id="beer-preference-warning-banner"
          className="bg-[#FEF9EE] border-2 border-[#D97706]/40 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-[#B45309]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-extrabold text-[#78350F] font-display">
                Beer Preference & Route Proximity Notice
              </h3>
              <p className="text-xs sm:text-sm text-[#92400E] leading-relaxed max-w-2xl">
                {route.routeWarningMessage ||
                  'No combination within the 25-minute drive limit matching all your selected beer styles was found. Please consider modifying or broadening your beer preferences.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="modify-beer-preferences-btn"
            onClick={onPlanNew}
            className="self-end sm:self-center shrink-0 px-4 py-2 rounded-full bg-[#58A72F] hover:bg-[#489224] text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-xs cursor-pointer font-brand tracking-wider uppercase"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Modify Preferences</span>
          </button>
        </div>
      )}

      {/* Top Banner & Overview Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#C6E2BD] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pb-6 border-b border-[#EAF4E6]">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] text-xs font-black tracking-wider uppercase font-brand">
                {route.region}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#EAF4E6] text-[#122610] text-xs font-extrabold font-brand tracking-wide">
                {route.days.length} DAY{route.days.length > 1 ? 'S' : ''} • {route.totalBreweries} BREWERIES
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#58A72F]" />
                ≤ 25 Min Between Stops
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#EAF4E6] text-[#122610] text-xs font-bold flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-[#58A72F]" />
                Round-Trip
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#122610] tracking-tight leading-tight font-display">
              {route.title}
            </h1>
            <p className="text-[#3B5734] text-xs sm:text-sm max-w-3xl leading-relaxed font-medium">
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
                  className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-[#58A72F] hover:bg-[#489224] active:bg-[#3D7C1E] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer min-h-[46px] group font-brand tracking-wider uppercase border border-[#7CD749]"
                >
                  <Navigation className="w-4 h-4 shrink-0 text-[#DDF1D2] group-hover:rotate-12 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-black leading-tight flex items-center gap-1.5">
                      <span>Launch Google Maps Route</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </div>
                  </div>
                </a>

                <button
                  type="button"
                  id="copy-google-maps-link-btn"
                  onClick={handleCopyMapsUrl}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-[#FAFDF9] hover:bg-[#EAF4E6] text-[#122610] text-xs font-bold border border-[#C6E2BD] transition-colors cursor-pointer font-brand tracking-wide"
                >
                  {copiedMapsLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#58A72F]" />
                      <span className="text-[#58A72F] font-black">MAPS LINK COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#58A72F]" />
                      <span>COPY GOOGLE MAPS LINK</span>
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
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer min-h-[42px] font-brand tracking-wider uppercase ${
                  isSaved
                    ? 'bg-[#58A72F] text-white border border-[#7CD749]'
                    : 'bg-[#DDF1D2] hover:bg-[#C8E7B8] text-[#122B0F] border border-[#B2D8A6]'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>SAVED TO ACCOUNT ✓</span>
                  </>
                ) : (
                  <>
                    <FolderHeart className="w-4 h-4 text-[#58A72F]" />
                    <span>SAVE THIS ITINERARY</span>
                  </>
                )}
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="export-itinerary-modal-btn"
                onClick={onOpenExport}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#FAFDF9] hover:bg-[#EAF4E6] text-[#122610] text-xs font-black border border-[#C6E2BD] transition-colors min-h-[38px] cursor-pointer font-brand tracking-wider uppercase"
              >
                <Share2 className="w-3.5 h-3.5 text-[#58A72F]" />
                <span>Export</span>
              </button>

              <button
                type="button"
                id="print-itinerary-btn"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#FAFDF9] hover:bg-[#EAF4E6] text-[#122610] text-xs font-black border border-[#C6E2BD] transition-colors min-h-[38px] cursor-pointer font-brand tracking-wider uppercase"
              >
                <Printer className="w-3.5 h-3.5 text-[#58A72F]" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Route Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-5">
          <div className="p-3.5 bg-[#FAFDF9] rounded-2xl border border-[#C6E2BD]">
            <div className="text-[11px] text-[#3B5734] font-black flex items-center gap-1.5 mb-1 font-brand tracking-wide uppercase">
              <HopIcon className="w-3.5 h-3.5 text-[#58A72F]" filled />
              <span>Total Stops</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#122610] font-display">
              {route.totalBreweries} Breweries
            </div>
            <div className="text-[10px] text-[#6D9364] mt-0.5 font-medium">Max 3 / day limit</div>
          </div>

          <div className="p-3.5 bg-[#FAFDF9] rounded-2xl border border-[#C6E2BD]">
            <div className="text-[11px] text-[#3B5734] font-black flex items-center gap-1.5 mb-1 font-brand tracking-wide uppercase">
              <Clock className="w-3.5 h-3.5 text-[#58A72F]" />
              <span>Total Drive</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#122610] font-display">
              {formatTime(route.totalTravelTimeMin)}
            </div>
            <div className="text-[10px] text-[#58A72F] font-bold truncate mt-0.5" title="Includes departure from home and return trip">
              Includes start & return
            </div>
          </div>

          <div className="p-3.5 bg-[#FAFDF9] rounded-2xl border border-[#C6E2BD]">
            <div className="text-[11px] text-[#3B5734] font-black flex items-center gap-1.5 mb-1 font-brand tracking-wide uppercase">
              <Car className="w-3.5 h-3.5 text-[#58A72F]" />
              <span>Total Distance</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#122610] font-display">
              ~{route.totalDistanceMiles.toFixed(1)} mi
            </div>
            <div className="text-[10px] text-[#6D9364] truncate mt-0.5 font-medium">
              From: {route.parameters.startLocation}
            </div>
          </div>

          <div className="p-3.5 bg-[#FAFDF9] rounded-2xl border border-[#C6E2BD]">
            <div className="text-[11px] text-[#3B5734] font-black flex items-center gap-1.5 mb-1 font-brand tracking-wide uppercase">
              <Award className="w-3.5 h-3.5 text-[#58A72F]" />
              <span>Beer Styles</span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-[#122610] truncate font-display">
              {route.parameters.beerStyles.slice(0, 3).join(', ')}
            </div>
            <div className="text-[10px] text-[#6D9364] mt-0.5 font-medium">Curated selection</div>
          </div>
        </div>
      </div>

      {/* Segmented Control & Day Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Day Selector Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EAF4E6] rounded-full border border-[#C6E2BD] w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            id="day-filter-all"
            onClick={() => setSelectedDayNumber('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap min-h-[34px] font-brand tracking-wider uppercase ${
              selectedDayNumber === 'all'
                ? 'bg-[#162D15] text-[#DDF1D2] shadow-2xs'
                : 'text-[#162D15] hover:bg-[#DDF1D2]'
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
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap min-h-[34px] font-brand tracking-wider uppercase ${
                selectedDayNumber === day.dayNumber
                  ? 'bg-[#162D15] text-[#DDF1D2] shadow-2xs'
                  : 'text-[#162D15] hover:bg-[#DDF1D2]'
              }`}
            >
              Day {day.dayNumber} ({day.breweries.length} stops)
            </button>
          ))}
        </div>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center gap-1 bg-[#EAF4E6] p-1 rounded-full border border-[#C6E2BD] self-end sm:self-auto">
          <button
            type="button"
            id="view-toggle-timeline"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer font-brand tracking-wider uppercase ${
              activeTab === 'timeline'
                ? 'bg-white text-[#122610] shadow-2xs'
                : 'text-[#3B5734] hover:text-[#122610]'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 text-[#58A72F]" />
            <span>Itinerary</span>
          </button>
          <button
            type="button"
            id="view-toggle-map"
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer font-brand tracking-wider uppercase ${
              activeTab === 'map'
                ? 'bg-white text-[#122610] shadow-2xs'
                : 'text-[#3B5734] hover:text-[#122610]'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-[#58A72F]" />
            <span>Map Only</span>
          </button>
          <button
            type="button"
            id="view-toggle-all"
            onClick={() => setActiveTab('all')}
            className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer font-brand tracking-wider uppercase ${
              activeTab === 'all'
                ? 'bg-white text-[#122610] shadow-2xs'
                : 'text-[#3B5734] hover:text-[#122610]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#58A72F]" />
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
                  className="bg-white rounded-3xl p-4 sm:p-6 border border-[#C6E2BD] shadow-xs space-y-5"
                >
                  {/* Day Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-4 border-b border-[#EAF4E6]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-[#162D15] text-[#DDF1D2] font-black text-xs uppercase tracking-wider font-brand">
                          Day {day.dayNumber}
                        </span>
                        <span className="text-xs text-[#4D6D47] font-bold">
                          Start ~{day.recommendedStartTime}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-extrabold text-[#122610] mt-1 font-display">
                        {day.dayTitle}
                      </h2>
                    </div>

                    <div className="text-xs text-[#4D6D47] font-bold">
                      {day.breweries.length} Brewery Stops (Spaced ≤ 25 min)
                    </div>
                  </div>

                  {/* Departure Leg Card (Day 1) */}
                  {isFirstDay && route.departureTransit && (
                    <div className="bg-[#FAFDF9] rounded-2xl p-3.5 sm:p-4 border border-[#C6E2BD] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#DDF1D2] text-[#122B0F] flex items-center justify-center font-bold shrink-0">
                          🚗
                        </div>
                        <div>
                          <div className="font-extrabold text-[#122610]">
                            Departure from {route.departureTransit.fromName}
                          </div>
                          <div className="text-[11px] text-[#4D6D47]">
                            Drive ~{route.departureTransit.driveTimeMin} mins ({route.departureTransit.distanceMiles.toFixed(1)} mi) to Stop 1
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] text-[10px] font-black uppercase font-brand tracking-wider shrink-0">
                        Origin
                      </span>
                    </div>
                  )}

                  {/* Brewery Stops List */}
                  <div className="space-y-4">
                    {day.breweries.map((brewery, bIdx) => {
                      const isVisited = !!visitedBreweries[brewery.id || `${day.dayNumber}-${bIdx}`];
                      const isExpanded = !!expandedDetails[brewery.id || `${day.dayNumber}-${bIdx}`];
                      const driveTime = brewery.driveTimeFromPrevMin ?? (brewery as any).driveTimeFromPreviousMin;

                      return (
                        <div key={brewery.id || bIdx} className="space-y-3">
                          {/* Inter-Stop Transit Connector */}
                          {driveTime !== undefined && bIdx > 0 && (
                            <div className="flex items-center gap-2 pl-4 py-1 text-xs text-[#4D6D47]">
                              <div className="w-0.5 h-4 bg-[#B2D8A6]" />
                              <span className="px-2.5 py-0.5 rounded-full bg-[#FAFDF9] text-[#162D15] text-[10px] font-bold flex items-center gap-1 border border-[#C6E2BD]">
                                <span>🚗 ~{driveTime} min drive</span>
                                {driveTime <= 25 && (
                                  <span className="text-[#58A72F] font-black">✓ ≤25 min</span>
                                )}
                              </span>
                            </div>
                          )}

                          {/* Brewery Card */}
                          <div
                            id={`brewery-card-${brewery.id || bIdx}`}
                            className={`rounded-3xl border transition-all overflow-hidden ${
                              isVisited
                                ? 'bg-[#DDF1D2]/40 border-[#58A72F]/40'
                                : 'bg-white border-[#C6E2BD] hover:border-[#58A72F] shadow-xs'
                            }`}
                          >
                            <div className="p-4 sm:p-5 space-y-3">
                              {/* Header: Badge, Name, Visited Checkbox */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  {/* Stop Number Circle */}
                                  <div className="w-8 h-8 rounded-full bg-[#58A72F] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs font-brand">
                                    {bIdx + 1}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="text-sm sm:text-base font-extrabold text-[#122610] font-display">
                                        {brewery.name}
                                      </h3>
                                      <span className="text-xs text-[#4D6D47] font-semibold">
                                        ({brewery.city}, {brewery.state || route.region})
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-[#4D6D47] mt-0.5 flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-[#58A72F] shrink-0" />
                                      <span>{brewery.address}</span>
                                    </p>
                                  </div>
                                </div>

                                {/* Visited Toggle */}
                                <button
                                  type="button"
                                  id={`toggle-visited-btn-${brewery.id || bIdx}`}
                                  onClick={() => onToggleVisited(brewery.id || `${day.dayNumber}-${bIdx}`)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0 font-brand tracking-wider uppercase ${
                                    isVisited
                                      ? 'bg-[#58A72F] text-white border border-[#489224]'
                                      : 'bg-[#FAFDF9] hover:bg-[#EAF4E6] text-[#122610] border border-[#C6E2BD]'
                                  }`}
                                  title="Mark as visited in your tasting passport"
                                >
                                  <Check className={`w-3.5 h-3.5 ${isVisited ? 'text-white stroke-[3]' : 'text-transparent'}`} />
                                  <span>{isVisited ? 'VISITED' : 'CHECK IN'}</span>
                                </button>
                              </div>

                              {/* Ratings, Recommended Tasting Time, and Matched Style Chips */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#FEF9EE] text-[#78350F] border border-[#FDE68A] text-[11px] font-bold flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-[#D97706] text-[#D97706]" />
                                  <span>Untappd {brewery.ratings.untappd.score.toFixed(2)} ★</span>
                                </span>

                                <span className="px-2.5 py-0.5 rounded-full bg-[#FAFDF9] text-[#162D15] text-[11px] font-bold flex items-center gap-1 border border-[#C6E2BD]">
                                  <span>Google {brewery.ratings.google.score.toFixed(1)} ★</span>
                                  <span className="text-[10px] text-[#6D9364]">({brewery.ratings.google.reviewCount})</span>
                                </span>

                                <span className="px-2.5 py-0.5 rounded-full bg-[#FAFDF9] text-[#4D6D47] text-[11px] font-medium flex items-center gap-1 border border-[#EAF4E6]">
                                  <Clock className="w-3 h-3 text-[#58A72F]" />
                                  <span>~{brewery.suggestedDurationMin} min tasting</span>
                                </span>

                                {brewery.matchedStyles && brewery.matchedStyles.length > 0 && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] text-[11px] font-black flex items-center gap-1 font-brand uppercase tracking-wider">
                                    ✓ {brewery.matchedStyles.join(', ')}
                                  </span>
                                )}
                              </div>

                              {/* On Tap & Acclaimed Beer Offerings */}
                              <div className="bg-[#FAFDF9] p-3.5 rounded-2xl border border-[#C6E2BD] space-y-2.5 text-xs">
                                <div className="flex items-center justify-between">
                                  <div className="font-extrabold text-[#122610] flex items-center gap-1.5 font-display">
                                    <HopIcon className="w-3.5 h-3.5 text-[#58A72F]" filled />
                                    <span>On Tap & Acclaimed Offerings:</span>
                                  </div>
                                  <span className="text-[10px] text-[#4D6D47] font-semibold">
                                    Live Taplist & Catalog
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {brewery.beerHighlights.map((bh, bhIdx) => {
                                    const preferredStylesToCheck =
                                      route.parameters?.beerStyles && route.parameters.beerStyles.length > 0
                                        ? route.parameters.beerStyles
                                        : brewery.matchedStyles || [];
                                    const isStyleMatch = preferredStylesToCheck.some((st) =>
                                      checkBeerMatchesStyle(bh, st)
                                    );

                                    return (
                                      <div
                                        key={bhIdx}
                                        className={`p-2.5 rounded-xl text-xs transition-all ${
                                          isStyleMatch
                                            ? 'bg-[#DDF1D2]/60 border border-[#58A72F]/50 shadow-2xs'
                                            : 'bg-white border border-[#C6E2BD] shadow-2xs'
                                        }`}
                                      >
                                        <div className="flex items-start justify-between gap-1">
                                          <strong className="text-[#122610] font-extrabold text-[13px]">{bh.name}</strong>
                                          {isStyleMatch && (
                                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[#58A72F] text-white shrink-0 font-brand uppercase tracking-wider">
                                              Style Match
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[11px] text-[#58A72F] font-bold mt-0.5 flex items-center gap-1">
                                          <span>{bh.style}</span>
                                          {bh.abv && <span className="text-[#A2D093]">•</span>}
                                          {bh.abv && <span className="font-bold text-[#122610]">{bh.abv} ABV</span>}
                                        </div>
                                        {bh.description && (
                                          <p className="text-[11px] text-[#3B5734] mt-1 leading-snug font-medium">
                                            {bh.description}
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Multi-Source Beer Style Verification & External Listings */}
                              <div className="bg-[#FAFDF9]/80 p-3 rounded-2xl border border-[#C6E2BD] space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <div className="font-extrabold text-[#122610] flex items-center gap-1.5 font-display">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#58A72F]" />
                                    <span>Beer Style & Taplist Sources:</span>
                                  </div>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] font-brand uppercase tracking-wider">
                                    3-Way Verified
                                  </span>
                                </div>

                                {brewery.styleVerificationSources?.details && (
                                  <p className="text-[11px] text-[#3B5734] leading-relaxed">
                                    {brewery.styleVerificationSources.details}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                  {/* Brewery Website / Tap List */}
                                  {brewery.websiteUrl && (
                                    <a
                                      href={brewery.websiteUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      id={`website-link-${brewery.id || bIdx}`}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-[#EAF4E6] text-[#122610] text-[11px] font-bold border border-[#C6E2BD] transition-colors shadow-2xs cursor-pointer"
                                      title="Open official brewery website & live tap list"
                                    >
                                      <Globe className="w-3 h-3 text-[#58A72F]" />
                                      <span>Official Website / Taplist</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                    </a>
                                  )}

                                  {/* Untappd Profile */}
                                  {brewery.untappdUrl && (
                                    <a
                                      href={brewery.untappdUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      id={`untappd-link-${brewery.id || bIdx}`}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FEF9EE] hover:bg-[#FEF3C7] text-[#78350F] text-[11px] font-bold border border-[#FDE68A] transition-colors shadow-2xs cursor-pointer"
                                      title="Open Untappd brewery page & check-in beer catalog"
                                    >
                                      <HopIcon className="w-3 h-3 text-[#D97706]" filled />
                                      <span>Untappd Menu</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                    </a>
                                  )}

                                  {/* RateBeer Profile */}
                                  {brewery.rateBeerUrl && (
                                    <a
                                      href={brewery.rateBeerUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      id={`ratebeer-link-${brewery.id || bIdx}`}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EAF4E6] hover:bg-[#DDF1D2] text-[#122610] text-[11px] font-bold border border-[#C6E2BD] transition-colors shadow-2xs cursor-pointer"
                                      title="Open RateBeer brewer profile and style reviews"
                                    >
                                      <Star className="w-3 h-3 text-[#58A72F]" />
                                      <span>RateBeer Profile</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Style Fallback Notice (if brewery has no matching preferred styles) */}
                              {brewery.styleNotice && (
                                <div className="p-3 rounded-2xl bg-[#FEF9EE] border border-[#FDE68A] text-[#78350F] text-xs flex items-start gap-2.5 shadow-2xs">
                                  <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                                  <div className="space-y-0.5">
                                    <span className="font-bold text-[#78350F]">Style Note: </span>
                                    <span className="text-[#92400E]">{brewery.styleNotice}</span>
                                  </div>
                                </div>
                              )}

                              {/* Food & Amenities */}
                              {brewery.foodHighlights && (
                                <div className="text-xs text-[#162D15] flex items-center gap-2 pt-0.5">
                                  <Utensils className="w-3.5 h-3.5 text-[#58A72F] shrink-0" />
                                  <span className="font-medium"><strong>Food Pairing:</strong> {brewery.foodHighlights}</span>
                                </div>
                              )}

                              {/* Action: Open in Google Maps */}
                              <div className="pt-2 flex items-center justify-between border-t border-[#EAF4E6]">
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brewery.name + ' ' + brewery.address)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAFDF9] hover:bg-[#EAF4E6] text-[#122610] text-xs font-bold border border-[#C6E2BD] transition-colors"
                                >
                                  <Navigation className="w-3.5 h-3.5 text-[#58A72F]" />
                                  <span>Navigate to Stop</span>
                                  <ExternalLink className="w-3 h-3 opacity-60" />
                                </a>

                                {brewery.atmosphere && (
                                  <span className="text-[11px] text-[#4D6D47] italic hidden sm:inline">
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
                    <div className="bg-[#DDF1D2]/50 rounded-3xl p-4 sm:p-5 border border-[#B2D8A6] space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-[#58A72F] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                            🛏️
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-[#58A72F] uppercase tracking-wider font-brand">
                                Night {day.dayNumber} Recommended Stay
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-white text-[#122610] text-[10px] font-black uppercase font-brand border border-[#C6E2BD]">
                                {day.stay.type.toUpperCase()}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-extrabold text-[#122610] mt-0.5 font-display">
                              {day.stay.name}
                            </h3>
                            <p className="text-[11px] text-[#4D6D47]">{day.stay.address}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-extrabold text-[#122610] font-display">
                            {day.stay.estimatedPricePerNight}
                          </div>
                          <span className="text-[10px] text-[#58A72F] font-bold">
                            ~{day.stay.driveTimeFromLastBreweryMin} min from final brewery
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-[#3B5734] leading-relaxed pt-1 font-medium">
                        {day.stay.whyRecommended}
                      </div>
                    </div>
                  )}

                  {/* Return Home Leg Card (Final Day) */}
                  {isLastDay && route.returnHomeTransit && (
                    <div className="bg-[#FAFDF9] rounded-2xl p-3.5 sm:p-4 border border-[#C6E2BD] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#DDF1D2] text-[#122B0F] flex items-center justify-center font-bold shrink-0">
                          🏡
                        </div>
                        <div>
                          <div className="font-extrabold text-[#122610]">
                            Return Home to {route.returnHomeTransit.toName}
                          </div>
                          <div className="text-[11px] text-[#4D6D47]">
                            Drive ~{route.returnHomeTransit.driveTimeMin} mins ({route.returnHomeTransit.distanceMiles.toFixed(1)} mi) from final stop
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] text-[10px] font-black uppercase font-brand tracking-wider shrink-0">
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
            <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#C6E2BD] shadow-xs">
              <div className="h-[450px] sm:h-[540px]">
                <RouteMap route={route} selectedDay={selectedDayNumber} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions Card: Alternative Route & Plan New */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#C6E2BD] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h4 className="text-sm font-extrabold text-[#122610] font-display">Want to explore different microbreweries?</h4>
          <p className="text-xs text-[#4D6D47] mt-0.5">
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
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#FAFDF9] hover:bg-[#EAF4E6] text-[#122610] text-xs font-black border border-[#C6E2BD] transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] disabled:opacity-50 font-brand tracking-wider uppercase"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-[#58A72F] ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'BREWING ALTERNATIVE...' : 'ALTERNATIVE ROUTE'}</span>
            </button>
          )}

          <button
            type="button"
            id="plan-new-route-bottom-btn"
            onClick={onPlanNew}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#58A72F] hover:bg-[#489224] active:bg-[#3D7C1E] text-white text-xs font-black shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] font-brand tracking-wider uppercase border border-[#7CD749]"
          >
            <HopIcon className="w-3.5 h-3.5 text-[#DDF1D2]" filled />
            <span>PLAN NEW ROUTE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

