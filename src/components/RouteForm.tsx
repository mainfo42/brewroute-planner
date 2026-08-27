import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Calendar,
  Building,
  Home,
  DollarSign,
  Sparkles,
  Check,
  ChevronRight,
  Compass,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { HopIcon } from './HopIcon';
import { RouteParameters, TripDuration, StayType, PriceRange } from '../types';
import { BEER_STYLE_OPTIONS } from '../data/curatedRoutes';
import { LocationAutocomplete } from './LocationAutocomplete';

interface RouteFormProps {
  onSubmit: (params: RouteParameters) => void;
  isLoading: boolean;
  onSelectCuratedPreset?: (presetIndex: number) => void;
}

export const RouteForm: React.FC<RouteFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  // All fields initialize empty with NO default pre-selected items
  const [startLocation, setStartLocation] = useState<string>('');
  const [destinationArea, setDestinationArea] = useState<string>('');
  const [selectedBeerStyles, setSelectedBeerStyles] = useState<string[]>([]);
  const [tripLength, setTripLength] = useState<TripDuration | null>(null);
  const [desireStay, setDesireStay] = useState<boolean | null>(null);
  const [stayType, setStayType] = useState<StayType | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Condition: Multi-day if 2 days or weekend
  const isMultiDay = tripLength === '2_days' || tripLength === 'weekend';

  const toggleBeerStyle = (styleId: string) => {
    setValidationError(null);
    if (selectedBeerStyles.includes(styleId)) {
      setSelectedBeerStyles(selectedBeerStyles.filter((s) => s !== styleId));
    } else {
      setSelectedBeerStyles([...selectedBeerStyles, styleId]);
    }
  };

  const selectStylePreset = (category: string) => {
    setValidationError(null);
    if (category === 'all') {
      setSelectedBeerStyles(BEER_STYLE_OPTIONS.map((s) => s.id));
    } else if (category === 'hoppy') {
      setSelectedBeerStyles(['NEIPA', 'IPA']);
    } else if (category === 'crisp') {
      setSelectedBeerStyles(['Lager', 'Pilsner', 'Wheat']);
    } else if (category === 'dark') {
      setSelectedBeerStyles(['Stout', 'Porter', 'Scotch Ale']);
    } else if (category === 'sour') {
      setSelectedBeerStyles(['Gose', 'Sour', 'Saison']);
    } else if (category === 'clear') {
      setSelectedBeerStyles([]);
    }
  };

  const handleUseCurrentLocation = () => {
    setValidationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setStartLocation(`Lat: ${pos.coords.latitude.toFixed(3)}, Lng: ${pos.coords.longitude.toFixed(3)}`);
        },
        () => {
          setStartLocation('Current Location');
        }
      );
    }
  };

  const handleClearAll = () => {
    setStartLocation('');
    setDestinationArea('');
    setSelectedBeerStyles([]);
    setTripLength(null);
    setDesireStay(null);
    setStayType(null);
    setPriceRange(null);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!startLocation.trim()) {
      setValidationError('Please enter a starting location.');
      return;
    }
    if (!destinationArea.trim()) {
      setValidationError('Please enter an area or city to visit.');
      return;
    }
    if (selectedBeerStyles.length === 0) {
      setValidationError('Please select at least one preferred beer style in Step 2.');
      return;
    }
    if (!tripLength) {
      setValidationError('Please select the total length of your trip in Step 3.');
      return;
    }
    if (isMultiDay) {
      if (desireStay === null) {
        setValidationError('Please indicate whether you want an overnight stay included (Yes / No) in Step 4.');
        return;
      }
      if (desireStay === true) {
        if (!stayType) {
          setValidationError('Please choose a lodging type (Hotel or Airbnb) for your overnight stay.');
          return;
        }
        if (!priceRange) {
          setValidationError('Please select a price range per night for your overnight stay.');
          return;
        }
      }
    }

    const params: RouteParameters = {
      startLocation: startLocation.trim(),
      destinationArea: destinationArea.trim(),
      beerStyles: selectedBeerStyles,
      tripLength: tripLength,
      desireStay: isMultiDay ? (desireStay ?? false) : false,
      stayType: isMultiDay && desireStay && stayType ? stayType : 'none',
      priceRange: isMultiDay && desireStay && priceRange ? priceRange : undefined,
    };

    onSubmit(params);
  };

  const hasAnyInput = Boolean(
    startLocation || destinationArea || selectedBeerStyles.length > 0 || tripLength !== null
  );

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-9 px-4 sm:px-6 space-y-6 pb-28 md:pb-14">
      {/* Hero Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] text-xs font-black tracking-widest uppercase shadow-2xs font-brand">
          <HopIcon className="w-4 h-4 text-[#58A72F]" filled />
          <span>FRESH GREEN HOP TRAIL PLANNER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#122610] tracking-tight leading-tight font-display">
          Plan Your Microbrewery Route
        </h1>
        <p className="text-[#3B5734] text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-medium">
          Craft multi-stop tasting tours with verified ratings, drive times under 25 mins, and round-trip Google Maps routes.
        </p>

        {/* Reset Action Bar (when inputs are active) */}
        {hasAnyInput && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              id="reset-form-fields-btn"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-[#58A72F] bg-[#EAF4E6] hover:bg-[#DDF1D2] border border-[#B2D8A6] transition-colors cursor-pointer font-brand tracking-wider"
            >
              <RotateCcw className="w-3 h-3 text-[#58A72F]" />
              <span>RESET ALL FIELDS</span>
            </button>
          </div>
        )}
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200 border border-rose-200 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Craft Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#C6E2BD] shadow-xs overflow-hidden">
        <div className="p-5 sm:p-7 space-y-7">
          
          {/* STEP 1: Starting Location & Area to Visit */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 pb-3 border-b border-[#EAF4E6]">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#162D15] text-[#DDF1D2] flex items-center justify-center font-black text-lg sm:text-xl shadow-md ring-4 ring-[#DDF1D2] shrink-0 font-brand">
                1
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#122610] tracking-tight font-display uppercase">
                  Locations & Destination
                </h2>
                <p className="text-xs text-[#4D6D47]">Where are you leaving from and where do you want to explore?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Starting Location */}
              <LocationAutocomplete
                id="start-location-input"
                label="Starting Location (Home / Origin)"
                required
                value={startLocation}
                onChange={(val) => {
                  setValidationError(null);
                  setStartLocation(val);
                }}
                onSelectSuggestion={(sug) => {
                  setValidationError(null);
                  setStartLocation(sug.name);
                }}
                onUseCurrentLocation={handleUseCurrentLocation}
                placeholder="e.g. Burlington VT, Boston, Denver..."
                iconType="navigation"
                helperText="Includes round-trip travel"
              />

              {/* Area to Visit */}
              <LocationAutocomplete
                id="destination-area-input"
                label="Area to Visit (Region or City)"
                required
                value={destinationArea}
                onChange={(val) => {
                  setValidationError(null);
                  setDestinationArea(val);
                }}
                onSelectSuggestion={(sug) => {
                  setValidationError(null);
                  setDestinationArea(sug.name);
                }}
                placeholder="e.g. Vermont, Asheville, San Diego..."
                iconType="mapPin"
                helperText="≤ 25 min drive between stops"
              />
            </div>
          </div>

          {/* STEP 2: Preferred Beer Styles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAF4E6]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#162D15] text-[#DDF1D2] flex items-center justify-center font-black text-lg sm:text-xl shadow-md ring-4 ring-[#DDF1D2] shrink-0 font-brand">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#122610] tracking-tight font-display uppercase">
                    Preferred Beer Styles
                  </h2>
                  <p className="text-xs text-[#4D6D47]">Choose the styles you want to taste on the trail</p>
                </div>
              </div>

              {selectedBeerStyles.length > 0 ? (
                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] font-brand tracking-wider">
                  {selectedBeerStyles.length} SELECTED
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF4E6] text-[#4D6D47]">
                  None
                </span>
              )}
            </div>

            {/* Quick Filter Assist Chips */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-[#4D6D47] mr-1 font-brand tracking-wide">SHORTCUTS:</span>
              {[
                { id: 'all', label: 'All Styles' },
                { id: 'hoppy', label: 'Hoppy & IPAs' },
                { id: 'crisp', label: 'Crisp & Lagers' },
                { id: 'dark', label: 'Dark & Stouts' },
                { id: 'sour', label: 'Sours & Gose' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  id={`style-filter-pill-${pill.id}`}
                  onClick={() => selectStylePreset(pill.id)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F2F8F0] hover:bg-[#DDF1D2] hover:text-[#122B0F] text-[#162D15] transition-colors cursor-pointer min-h-[32px] border border-[#C6E2BD]"
                >
                  {pill.label}
                </button>
              ))}
              {selectedBeerStyles.length > 0 && (
                <button
                  type="button"
                  id="style-filter-clear"
                  onClick={() => selectStylePreset('clear')}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Chips Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {BEER_STYLE_OPTIONS.map((style) => {
                const isSelected = selectedBeerStyles.includes(style.id);
                return (
                  <button
                    key={style.id}
                    id={`beer-style-option-${style.id}`}
                    type="button"
                    onClick={() => toggleBeerStyle(style.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[68px] ${
                      isSelected
                        ? 'bg-[#EAF4E6] text-[#122610] border-[#58A72F] shadow-xs ring-2 ring-[#58A72F]/30'
                        : 'bg-[#FAFDF9] hover:bg-[#F2F8F0] text-[#122610] border-[#C6E2BD]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`font-extrabold text-xs sm:text-sm font-display tracking-tight ${isSelected ? 'text-[#122610]' : 'text-[#122610]'}`}>
                        {style.id}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'bg-[#58A72F] text-white scale-100' : 'bg-[#DDF1D2] text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                    <span className={`text-[11px] leading-tight line-clamp-1 ${isSelected ? 'text-[#58A72F] font-bold' : 'text-[#4D6D47]'}`}>
                      {style.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Total Length of the Trip */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAF4E6]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#162D15] text-[#DDF1D2] flex items-center justify-center font-black text-lg sm:text-xl shadow-md ring-4 ring-[#DDF1D2] shrink-0 font-brand">
                  3
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#122610] tracking-tight font-display uppercase">
                    Trip Duration
                  </h2>
                  <p className="text-xs text-[#4D6D47]">Choose the length of your beer road trip</p>
                </div>
              </div>

              {tripLength ? (
                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#58A72F] text-white font-brand tracking-wider">
                  SELECTED
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF4E6] text-[#4D6D47]">
                  Select One
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'few_hours', label: 'Few Hours', desc: 'Half-day tasting crawl' },
                { id: '1_day', label: '1 Day', desc: 'Full-day tour (≤ 3 stops)' },
                { id: '2_days', label: '2 Days', desc: 'Overnight adventure' },
                { id: 'weekend', label: 'Weekend', desc: 'Multi-day craft getaway' },
              ].map((dur) => {
                const isSelected = tripLength === dur.id;
                return (
                  <button
                    key={dur.id}
                    id={`trip-duration-${dur.id}`}
                    type="button"
                    onClick={() => {
                      setValidationError(null);
                      setTripLength(dur.id as TripDuration);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[76px] ${
                      isSelected
                        ? 'bg-[#58A72F] text-white border-[#58A72F] shadow-sm ring-2 ring-[#7DD748]/50'
                        : 'bg-[#FAFDF9] hover:bg-[#F2F8F0] text-[#122610] border-[#C6E2BD]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs sm:text-sm font-display tracking-tight">{dur.label}</span>
                      <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-[#DDF1D2]' : 'text-[#6D9364]'}`} />
                    </div>
                    <span className={`text-[10px] leading-tight block ${isSelected ? 'text-[#DDF1D2] font-semibold' : 'text-[#4D6D47]'}`}>
                      {dur.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Conditional Overnight Stay (Only if 2 Days or Weekend) */}
          {isMultiDay && (
            <div className="space-y-4 bg-[#F2F8F0] p-4 sm:p-5 rounded-3xl border border-[#C6E2BD] animate-in fade-in duration-200">
              <div className="flex items-center gap-3.5 pb-3 border-b border-[#C6E2BD]">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#162D15] text-[#DDF1D2] flex items-center justify-center font-black text-lg sm:text-xl shadow-md ring-4 ring-[#DDF1D2] shrink-0 font-brand">
                  4
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#122610] tracking-tight font-display uppercase">
                    Overnight Stay Options
                  </h2>
                  <p className="text-xs text-[#4D6D47]">
                    For {tripLength === '2_days' ? '2-day routes (1 overnight stay)' : '3-day weekend routes (2 overnight stays)'}, we locate stays within 30 min of the last brewery each day.
                  </p>
                </div>
              </div>

              {/* Desire Stay Toggle */}
              <div>
                <label className="block text-xs font-bold text-[#122610] mb-2 font-brand tracking-wide">
                  INCLUDE AN OVERNIGHT STAY IN THE ITINERARY? <span className="text-[#58A72F]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id="desire-stay-yes-btn"
                    onClick={() => {
                      setValidationError(null);
                      setDesireStay(true);
                    }}
                    className={`p-3 rounded-2xl border font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] font-brand tracking-wider ${
                      desireStay === true
                        ? 'bg-[#58A72F] text-white border-[#58A72F] shadow-xs'
                        : 'bg-white hover:bg-[#EAF4E6] text-[#122610] border-[#C6E2BD]'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${desireStay === true ? 'text-white' : 'text-[#6D9364]'}`} />
                    <span>YES, INCLUDE STAY</span>
                  </button>

                  <button
                    type="button"
                    id="desire-stay-no-btn"
                    onClick={() => {
                      setValidationError(null);
                      setDesireStay(false);
                    }}
                    className={`p-3 rounded-2xl border font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] font-brand tracking-wider ${
                      desireStay === false
                        ? 'bg-[#162D15] text-white border-[#162D15] shadow-xs'
                        : 'bg-white hover:bg-[#EAF4E6] text-[#122610] border-[#C6E2BD]'
                    }`}
                  >
                    <XCircle className={`w-4 h-4 ${desireStay === false ? 'text-[#DDF1D2]' : 'text-[#6D9364]'}`} />
                    <span>NO, BREWERIES ONLY</span>
                  </button>
                </div>
              </div>

              {/* If YES: Show Lodging Type & Price Range */}
              {desireStay === true && (
                <div className="space-y-4 pt-3 border-t border-[#C6E2BD] animate-in fade-in duration-150">
                  {/* Lodging Type */}
                  <div>
                    <label className="block text-xs font-bold text-[#122610] mb-2 font-brand tracking-wide">
                      LODGING TYPE (HOTEL OR AIRBNB) <span className="text-[#58A72F]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'hotel', label: 'Hotel', icon: Building, desc: 'Boutique or chain hotels & suites' },
                        { id: 'airbnb', label: 'Airbnb', icon: Home, desc: 'Private loft, apartment, or cottage' },
                      ].map((stay) => {
                        const isSelected = stayType === stay.id;
                        const Icon = stay.icon;
                        return (
                          <button
                            key={stay.id}
                            id={`stay-type-${stay.id}-btn`}
                            type="button"
                            onClick={() => {
                              setValidationError(null);
                              setStayType(stay.id as StayType);
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[68px] ${
                              isSelected
                                ? 'bg-[#EAF4E6] text-[#122610] border-[#58A72F] shadow-xs ring-2 ring-[#58A72F]/30'
                                : 'bg-white hover:bg-[#FAFDF9] text-[#122610] border-[#C6E2BD]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-extrabold text-xs sm:text-sm font-display">{stay.label}</span>
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#58A72F]' : 'text-[#6D9364]'}`} />
                            </div>
                            <span className={`text-[10px] leading-tight block ${isSelected ? 'text-[#58A72F] font-bold' : 'text-[#4D6D47]'}`}>
                              {stay.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-xs font-bold text-[#122610] mb-2 font-brand tracking-wide">
                      PRICE RANGE PER NIGHT <span className="text-[#58A72F]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        {
                          id: 'under_100',
                          label: '< $100 / night',
                          badge: 'Budget / Value',
                          desc: 'Modest inns & simple rooms',
                        },
                        {
                          id: '100_to_200',
                          label: '$100 – $200 / night',
                          badge: 'Moderate',
                          desc: 'Boutique hotels & lofts',
                        },
                        {
                          id: 'over_200',
                          label: '$200+ / night',
                          badge: 'Premium',
                          desc: 'Luxury suites & upscale lodges',
                        },
                      ].map((price) => {
                        const isSelected = priceRange === price.id;
                        return (
                          <button
                            key={price.id}
                            id={`price-range-${price.id}-btn`}
                            type="button"
                            onClick={() => {
                              setValidationError(null);
                              setPriceRange(price.id as PriceRange);
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[68px] ${
                              isSelected
                                ? 'bg-[#58A72F] text-white border-[#58A72F] shadow-xs'
                                : 'bg-white hover:bg-[#FAFDF9] text-[#122610] border-[#C6E2BD]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`font-black text-[10px] uppercase tracking-wider font-brand ${isSelected ? 'text-[#DDF1D2]' : 'text-[#58A72F]'}`}>
                                {price.badge}
                              </span>
                              <DollarSign className={`w-3.5 h-3.5 ${isSelected ? 'text-[#DDF1D2]' : 'text-[#6D9364]'}`} />
                            </div>
                            <div className="font-extrabold text-xs sm:text-sm mb-0.5 font-display">
                              {price.label}
                            </div>
                            <span className={`text-[10px] leading-tight block ${isSelected ? 'text-[#DDF1D2] font-semibold' : 'text-[#4D6D47]'}`}>
                              {price.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Form Submission Footer */}
        <div className="p-4 sm:p-6 bg-[#F2F8F0] border-t border-[#C6E2BD] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#3B5734]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#58A72F] inline-block shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold">Max 3 breweries/day • Spaced ≤ 25 min • Certified ratings</span>
          </div>

          <button
            type="submit"
            id="generate-route-submit-btn"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#58A72F] hover:bg-[#68BF38] active:bg-[#489224] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] font-brand tracking-wider border border-[#7CD749]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>CRAFTING YOUR ROUTE...</span>
              </>
            ) : (
              <>
                <HopIcon className="w-4 h-4 text-white" filled />
                <span>GENERATE BEERHOP ITINERARY</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

