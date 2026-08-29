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
import { AdSenseBanner } from './AdSenseBanner';
import { BrewTravelRoute, BreweryStop, StayRecommendation } from '../types';
import { RouteMap } from './RouteMap';
import { checkBeerMatchesStyle } from '../utils/styleMatcher';
import { resolveCoordinates, calculateDrivingTransit } from '../utils/geoDistance';

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

  // Dynamic coordinate and transit resolution for Origin Departure & Return Home
  const startLocationStr = route.parameters?.startLocation || route.departureTransit?.fromName || 'Burlington, VT';
  const startCoord = resolveCoordinates(startLocationStr, route.startLocationCoord);

  const firstBrewery = route.days[0]?.breweries[0];
  const lastDay = route.days[route.days.length - 1];
  const lastBrewery = lastDay?.breweries[lastDay?.breweries.length - 1];
  const lastStop = lastDay?.stay || lastBrewery;

  const firstBreweryCoord = firstBrewery ? { lat: firstBrewery.lat, lng: firstBrewery.lng } : { lat: 44.4654, lng: -72.6874 };
  const lastStopCoord = lastStop ? { lat: lastStop.lat, lng: lastStop.lng } : firstBreweryCoord;

  // Real Departure and Return Estimates
  const calculatedDepartureTransit = calculateDrivingTransit(startCoord, firstBreweryCoord);
  const calculatedReturnTransit = calculateDrivingTransit(lastStopCoord, startCoord);

  const departureDriveMin = (route.departureTransit?.driveTimeMin && route.departureTransit.driveTimeMin > 0)
    ? route.departureTransit.driveTimeMin
    : calculatedDepartureTransit.driveTimeMin;

  const returnHomeDriveMin = (route.returnHomeTransit?.driveTimeMin && route.returnHomeTransit.driveTimeMin > 0)
    ? route.returnHomeTransit.driveTimeMin
    : calculatedReturnTransit.driveTimeMin;

  const departureDistMiles = (route.departureTransit?.distanceMiles && route.departureTransit.distanceMiles > 0)
    ? route.departureTransit.distanceMiles
    : calculatedDepartureTransit.distanceMiles;

  const returnHomeDistMiles = (route.returnHomeTransit?.distanceMiles && route.returnHomeTransit.distanceMiles > 0)
    ? route.returnHomeTransit.distanceMiles
    : calculatedReturnTransit.distanceMiles;

  let intermediateDriveMin = 0;
  let intermediateDistMiles = 0;

  route.days.forEach((day, dIdx) => {
    day.breweries.forEach((b, bi) => {
      if (bi > 0) {
        intermediateDriveMin += (b.driveTimeFromPrevMin || 12);
        intermediateDistMiles += (b.driveDistanceFromPrevMiles || 4.5);
      }
    });
    if (day.stay) {
      intermediateDriveMin += (day.stay.driveTimeFromLastBreweryMin || 14);
      intermediateDistMiles += 5.0;
    }
    if (dIdx > 0 && route.days[dIdx - 1]?.stay) {
      intermediateDriveMin += (route.days[dIdx - 1].stay?.driveTimeToNextBreweryMin || 15);
      intermediateDistMiles += 6.0;
    }
  });

  const fullTotalDriveTimeMin = departureDriveMin + intermediateDriveMin + returnHomeDriveMin;
  const fullTotalDistanceMiles = parseFloat((departureDistMiles + intermediateDistMiles + returnHomeDistMiles).toFixed(1));

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

        {/* Route Stats Ribbon - Standout Key Gauges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-5">
          {/* Gauge 1: Total Stops */}
          <div className="p-4 bg-gradient-to-br from-white via-[#FAFDF9] to-[#F1F8EE] rounded-2xl border-2 border-[#C6E2BD] hover:border-[#58A72F] transition-all shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#3B5734] font-black font-brand tracking-wider uppercase">
                TOTAL STOPS
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center shadow-2xs">
                <HopIcon className="w-3.5 h-3.5 text-[#58A72F]" filled />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#122610] font-display tracking-tight leading-none">
                {route.totalBreweries}
                <span className="text-xs sm:text-sm font-bold text-[#4D6D47] ml-1.5 font-brand uppercase">
                  Breweries
                </span>
              </div>
            </div>
            <div className="pt-1 border-t border-[#EAF4E6] flex items-center justify-between">
              <span className="text-[10px] font-black text-[#122B0F] bg-[#DDF1D2] px-2 py-0.5 rounded-full font-brand uppercase tracking-wide">
                ✓ Max 3 / Day
              </span>
              <span className="text-[10px] text-[#6D9364] font-semibold">{route.days.length} Day{route.days.length > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Gauge 2: Total Drive Time (Fully includes Start departure, all stops, and Return Home) */}
          <div className="p-4 bg-gradient-to-br from-white via-[#FAFDF9] to-[#F1F8EE] rounded-2xl border-2 border-[#C6E2BD] hover:border-[#58A72F] transition-all shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#3B5734] font-black font-brand tracking-wider uppercase">
                TOTAL DRIVE
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#58A72F]" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#122610] font-display tracking-tight leading-none">
                {formatTime(fullTotalDriveTimeMin)}
              </div>
              <div className="text-[10px] text-[#4D6D47] font-semibold mt-1">
                Start ➔ All Stops ➔ Return Home
              </div>
            </div>
            <div className="pt-1 border-t border-[#EAF4E6] flex items-center justify-between">
              <span className="text-[10px] font-black text-[#122B0F] bg-[#DDF1D2] px-2 py-0.5 rounded-full font-brand uppercase tracking-wide flex items-center gap-1">
                <RotateCcw className="w-2.5 h-2.5 text-[#58A72F]" />
                Full Round-Trip
              </span>
              <span className="text-[10px] text-[#58A72F] font-bold">Start & Return Inc.</span>
            </div>
          </div>

          {/* Gauge 3: Total Distance in KM (Fully includes Start departure and Return Home) */}
          <div className="p-4 bg-gradient-to-br from-white via-[#FAFDF9] to-[#F1F8EE] rounded-2xl border-2 border-[#C6E2BD] hover:border-[#58A72F] transition-all shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#3B5734] font-black font-brand tracking-wider uppercase">
                TOTAL DISTANCE
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center shadow-2xs">
                <Car className="w-3.5 h-3.5 text-[#58A72F]" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#122610] font-display tracking-tight leading-none">
                ~{(fullTotalDistanceMiles * 1.60934).toFixed(1)}
                <span className="text-xs sm:text-sm font-bold text-[#4D6D47] ml-1.5 font-brand uppercase">
                  KM
                </span>
              </div>
              <div className="text-[10px] text-[#4D6D47] font-semibold mt-1 truncate">
                ~{fullTotalDistanceMiles.toFixed(1)} Miles Total
              </div>
            </div>
            <div className="pt-1 border-t border-[#EAF4E6] flex items-center justify-between overflow-hidden">
              <span className="text-[10px] font-black text-[#122B0F] bg-[#DDF1D2] px-2 py-0.5 rounded-full font-brand uppercase tracking-wide truncate max-w-full">
                From {route.parameters.startLocation}
              </span>
            </div>
          </div>

          {/* Gauge 4: Beer Styles */}
          <div className="p-4 bg-gradient-to-br from-white via-[#FAFDF9] to-[#F1F8EE] rounded-2xl border-2 border-[#C6E2BD] hover:border-[#58A72F] transition-all shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#3B5734] font-black font-brand tracking-wider uppercase">
                BEER STYLES
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center shadow-2xs">
                <Award className="w-3.5 h-3.5 text-[#58A72F]" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-[#122610] font-display truncate leading-tight">
                {route.parameters.beerStyles.slice(0, 3).join(', ')}
              </div>
            </div>
            <div className="pt-1 border-t border-[#EAF4E6] flex items-center justify-between">
              <span className="text-[10px] font-black text-[#122B0F] bg-[#DDF1D2] px-2 py-0.5 rounded-full font-brand uppercase tracking-wide">
                {route.parameters.beerStyles.length} Selected
              </span>
              <span className="text-[10px] text-[#6D9364] font-semibold">Curated Match</span>
            </div>
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
                  {isFirstDay && (
                    <div className="bg-[#FAFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#C6E2BD] flex items-center justify-between gap-3 text-xs shadow-xs">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center font-black text-lg shrink-0 shadow-2xs">
                          🚗
                        </div>
                        <div>
                          <div className="font-black text-[#122610] text-sm sm:text-base font-display">
                            Departure from {route.departureTransit?.fromName || startLocationStr}
                          </div>
                          <div className="text-xs text-[#4D6D47] font-semibold mt-0.5">
                            Drive {formatTime(departureDriveMin)} ({(departureDistMiles * 1.60934).toFixed(1)} km / {departureDistMiles.toFixed(1)} mi) to Stop 1
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] text-xs font-black uppercase font-brand tracking-wider shrink-0">
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
                      const distKm = brewery.driveDistanceFromPrevMiles 
                        ? (brewery.driveDistanceFromPrevMiles * 1.60934).toFixed(1)
                        : (driveTime !== undefined ? Math.max(1, Math.round(driveTime * 0.8)).toFixed(1) : undefined);

                      return (
                        <div key={brewery.id || bIdx} className="space-y-3">
                          {/* Inter-Stop Transit Connector (Enhanced & Bigger) */}
                          {driveTime !== undefined && bIdx > 0 && (
                            <div className="flex items-center gap-3 py-2 px-2 sm:px-4">
                              <div className="flex flex-col items-center">
                                <div className="w-1 h-3 bg-[#B2D8A6] rounded-full" />
                                <div className="w-3 h-3 rounded-full bg-[#58A72F] border-2 border-white shadow-2xs" />
                                <div className="w-1 h-3 bg-[#B2D8A6] rounded-full" />
                              </div>
                              <div className="flex items-center flex-wrap gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#F0F8EC] to-[#FAFDF9] border-2 border-[#C6E2BD] text-[#122610] shadow-xs">
                                <div className="flex items-center gap-2">
                                  <Car className="w-4 h-4 text-[#58A72F] shrink-0" />
                                  <span className="text-xs sm:text-sm font-black font-display tracking-tight text-[#122610]">
                                    ~{driveTime} MIN DRIVE
                                  </span>
                                </div>
                                {distKm && (
                                  <span className="text-xs text-[#4D6D47] font-bold">
                                    (~{distKm} km)
                                  </span>
                                )}
                                {driveTime <= 25 && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#58A72F] text-white text-[10px] font-black uppercase font-brand tracking-wider ml-auto sm:ml-0 shadow-2xs">
                                    ✓ ≤25 MIN PACED
                                  </span>
                                )}
                              </div>
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
                            <div className="p-4 sm:p-6 space-y-3.5">
                              {/* Header: Badge, Name, Visited Checkbox */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3.5">
                                  {/* Stop Number Circle */}
                                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#58A72F] text-white flex items-center justify-center font-black text-sm sm:text-base shrink-0 shadow-xs font-brand">
                                    {bIdx + 1}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#122610] font-display tracking-tight leading-snug">
                                        {brewery.name}
                                      </h3>
                                      <span className="text-xs sm:text-sm text-[#4D6D47] font-bold">
                                        ({brewery.city}, {brewery.state || route.region})
                                      </span>
                                    </div>
                                    <p className="text-xs text-[#4D6D47] mt-1 flex items-center gap-1.5 font-medium">
                                      <MapPin className="w-3.5 h-3.5 text-[#58A72F] shrink-0" />
                                      <span>{brewery.address}</span>
                                    </p>
                                  </div>
                                </div>

                                {/* Visited Toggle */}
                                <button
                                  type="button"
                                  id={`toggle-visited-btn-${brewery.id || bIdx}`}
                                  onClick={() => onToggleVisited(brewery.id || `${day.dayNumber}-${bIdx}`)}
                                  className={`px-3.5 py-2 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shrink-0 font-brand tracking-wider uppercase shadow-2xs ${
                                    isVisited
                                      ? 'bg-[#58A72F] text-white border border-[#489224]'
                                      : 'bg-[#FAFDF9] hover:bg-[#EAF4E6] text-[#122610] border-2 border-[#C6E2BD]'
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
                  {isLastDay && (
                    <div className="bg-[#FAFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#C6E2BD] flex items-center justify-between gap-3 text-xs shadow-xs">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center font-black text-lg shrink-0 shadow-2xs">
                          🏡
                        </div>
                        <div>
                          <div className="font-black text-[#122610] text-sm sm:text-base font-display">
                            Return Home to {route.returnHomeTransit?.toName || startLocationStr}
                          </div>
                          <div className="text-xs text-[#4D6D47] font-semibold mt-0.5">
                            Drive {formatTime(returnHomeDriveMin)} ({(returnHomeDistMiles * 1.60934).toFixed(1)} km / {returnHomeDistMiles.toFixed(1)} mi) from final stop
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] text-xs font-black uppercase font-brand tracking-wider shrink-0">
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

      {/* Bottom Google Maps Navigation Section (Accessible & Prominent) */}
      {route.googleMapsMultiStopUrl && (
        <div className="bg-gradient-to-br from-[#162D15] via-[#122610] to-[#0A1A08] rounded-3xl p-5 sm:p-7 border border-[#58A72F]/50 shadow-lg text-white space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#58A72F] text-white font-black text-[10px] uppercase tracking-wider font-brand">
                  TURN-BY-TURN NAVIGATION
                </span>
                <span className="text-xs text-[#DDF1D2] font-semibold">
                  ~{(fullTotalDistanceMiles * 1.60934).toFixed(1)} km Round-Trip
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-display tracking-tight text-white">
                Launch Full Multi-Stop Google Maps Route
              </h3>
              <p className="text-xs sm:text-sm text-[#B2D8A6] max-w-2xl leading-relaxed">
                Seamlessly routes all {route.totalBreweries} brewery stops in order with departure from {route.parameters.startLocation} and return home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <a
                id="open-google-maps-bottom-btn"
                href={route.googleMapsMultiStopUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#58A72F] hover:bg-[#489224] active:bg-[#3D7C1E] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer min-h-[46px] group font-brand tracking-wider uppercase border border-[#7CD749]"
              >
                <Navigation className="w-4 h-4 shrink-0 text-[#DDF1D2] group-hover:rotate-12 transition-transform" />
                <span>OPEN IN GOOGLE MAPS</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                type="button"
                id="copy-google-maps-link-bottom-btn"
                onClick={handleCopyMapsUrl}
                className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 text-[#DDF1D2] text-xs font-bold border border-white/20 transition-colors cursor-pointer font-brand tracking-wide min-h-[46px]"
              >
                {copiedMapsLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#58A72F]" />
                    <span className="text-[#58A72F] font-black">LINK COPIED!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#DDF1D2]" />
                    <span>COPY LINK</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sponsored Ad Unit */}
      <AdSenseBanner format="horizontal" className="my-6" />

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

