import React, { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { HopIcon } from './HopIcon';
import { RouteParameters, TripDuration, StayType, PriceRange, ColorThemeVariant } from '../types';
import { BEER_STYLE_OPTIONS } from '../data/curatedRoutes';
import { LocationAutocomplete } from './LocationAutocomplete';
import { THEME_VARIANTS, getSavedThemeVariant } from '../utils/themeManager';

interface RouteFormProps {
  onSubmit: (params: RouteParameters) => void;
  isLoading: boolean;
  onSelectCuratedPreset?: (presetIndex: number) => void;
  currentTheme?: ColorThemeVariant;
}

export const RouteForm: React.FC<RouteFormProps> = ({
  onSubmit,
  isLoading,
  currentTheme,
}) => {
  // Active Theme Config
  const activeThemeConfig = (currentTheme && THEME_VARIANTS[currentTheme])
    ? THEME_VARIANTS[currentTheme]
    : THEME_VARIANTS[getSavedThemeVariant()] || THEME_VARIANTS.hop_amber;

  // Track loading elapsed seconds to show friendly message if >= 15 seconds
  const [loadingSeconds, setLoadingSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLoading) {
      setLoadingSeconds(0);
      interval = setInterval(() => {
        setLoadingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);
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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-display">
          Plan Your Microbrewery Route
        </h1>
        <p className="text-[#A3B899] text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-medium">
          Craft multi-stop tasting tours with verified ratings, drive times under 25 mins, and round-trip Google Maps routes.
        </p>

        {/* Reset Action Bar (when inputs are active) */}
        {hasAnyInput && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              id="reset-form-fields-btn"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-[#7DD748] bg-[#162D15] hover:bg-[#1E3B18] border border-[#58A72F]/40 transition-colors cursor-pointer font-brand tracking-wider shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#58A72F]" />
              <span>RESET ALL FIELDS</span>
            </button>
          </div>
        )}
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-950/80 text-rose-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200 border border-rose-800 shadow-md">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Craft Form Container */}
      <form onSubmit={handleSubmit} className="bg-[#111111] rounded-3xl border border-[#262626] shadow-2xl overflow-hidden">
        <div className="p-5 sm:p-7 space-y-8">
          
          {/* STEP 1: Starting Location & Area to Visit */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 sm:gap-4 pb-4 border-b border-[#222222]">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#1E3B18] text-[#DDF1D2] border border-[#58A72F]/60 flex items-center justify-center font-black text-xl sm:text-2xl md:text-3xl shadow-md ring-4 ring-[#58A72F]/20 shrink-0 font-brand">
                1
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-display uppercase leading-tight">
                  Locations & Destination
                </h2>
                <p className="text-xs sm:text-sm text-[#9CB394] font-medium mt-0.5">Where are you leaving from and where do you want to explore?</p>
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
                darkMode={true}
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
                darkMode={true}
              />
            </div>
          </div>

          {/* STEP 2: Preferred Beer Styles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#222222]">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#1E3B18] text-[#DDF1D2] border border-[#58A72F]/60 flex items-center justify-center font-black text-xl sm:text-2xl md:text-3xl shadow-md ring-4 ring-[#58A72F]/20 shrink-0 font-brand">
                  2
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-display uppercase leading-tight">
                    Preferred Beer Styles
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9CB394] font-medium mt-0.5">Choose the styles you want to taste on the trail</p>
                </div>
              </div>

              {selectedBeerStyles.length > 0 ? (
                <span className="text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full bg-[#1E3B18] text-[#DDF1D2] border border-[#58A72F]/50 font-brand tracking-wider shadow-2xs shrink-0">
                  {selectedBeerStyles.length} SELECTED
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1E1E1E] text-[#888888] border border-[#333333] shrink-0">
                  None
                </span>
              )}
            </div>

            {/* Quick Filter Assist Chips */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-[#9CB394] mr-1 font-brand tracking-wide">SHORTCUTS:</span>
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
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1A1A1A] hover:bg-[#262626] hover:text-white text-[#D0D0D0] transition-colors cursor-pointer min-h-[32px] border border-[#333333] hover:border-[#58A72F]"
                >
                  {pill.label}
                </button>
              ))}
              {selectedBeerStyles.length > 0 && (
                <button
                  type="button"
                  id="style-filter-clear"
                  onClick={() => selectStylePreset('clear')}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
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
                        ? 'bg-[#152B12] text-white border-2 border-[#58A72F] shadow-sm ring-2 ring-[#58A72F]/30'
                        : 'bg-[#181818] hover:bg-[#202020] text-white border-[#2E2E2E] hover:border-[#58A72F]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-black text-xs sm:text-sm font-display tracking-tight text-white">
                        {style.id}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'bg-[#58A72F] text-white scale-100' : 'bg-[#2A2A2A] text-transparent border border-[#444444]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                    <span className={`text-[11px] leading-tight line-clamp-1 ${isSelected ? 'text-[#7DD748] font-bold' : 'text-[#8EAD84]'}`}>
                      {style.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Total Length of the Trip */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#222222]">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#1E3B18] text-[#DDF1D2] border border-[#58A72F]/60 flex items-center justify-center font-black text-xl sm:text-2xl md:text-3xl shadow-md ring-4 ring-[#58A72F]/20 shrink-0 font-brand">
                  3
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-display uppercase leading-tight">
                    Trip Duration
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9CB394] font-medium mt-0.5">Choose the length of your beer road trip</p>
                </div>
              </div>

              {tripLength ? (
                <span className="text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full bg-[#58A72F] text-white font-brand tracking-wider shadow-2xs shrink-0">
                  SELECTED
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1E1E1E] text-[#888888] border border-[#333333] shrink-0">
                  Select One
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: '1_day', label: '1 Day', desc: 'Full-day tour (≤ 3 stops)' },
                { id: '2_days', label: '2 Days', desc: 'Overnight adventure' },
                { id: 'weekend', label: 'Weekend', desc: '3-day craft getaway' },
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
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[82px] ${
                      isSelected
                        ? 'bg-[#58A72F] text-white border-2 border-[#7DD748] shadow-md ring-2 ring-[#7DD748]/50'
                        : 'bg-[#181818] hover:bg-[#202020] text-white border-[#2E2E2E] hover:border-[#58A72F]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm sm:text-base font-display tracking-tight text-white">{dur.label}</span>
                      <Calendar className={`w-4 h-4 ${isSelected ? 'text-[#DDF1D2]' : 'text-[#7DD748]'}`} />
                    </div>
                    <span className={`text-[11px] leading-tight block ${isSelected ? 'text-[#E8F8E2] font-semibold' : 'text-[#8EAD84]'}`}>
                      {dur.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Conditional Overnight Stay (Only if 2 Days or Weekend) */}
          {isMultiDay && (
            <div className="space-y-4 bg-[#141F12] p-4 sm:p-5 rounded-3xl border border-[#223820] animate-in fade-in duration-200">
              <div className="flex items-center gap-3.5 sm:gap-4 pb-4 border-b border-[#223820]">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#1E3B18] text-[#DDF1D2] border border-[#58A72F]/60 flex items-center justify-center font-black text-xl sm:text-2xl md:text-3xl shadow-md ring-4 ring-[#58A72F]/20 shrink-0 font-brand">
                  4
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-display uppercase leading-tight">
                    Overnight Stay Options
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9CB394] font-medium mt-0.5">
                    For {tripLength === '2_days' ? '2-day routes (1 overnight stay)' : '3-day weekend routes (2 overnight stays)'}, we locate stays within 30 min of the last brewery each day.
                  </p>
                </div>
              </div>

              {/* Desire Stay Toggle */}
              <div>
                <label className="block text-xs font-bold text-white mb-2 font-brand tracking-wide">
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
                        ? 'bg-[#58A72F] text-white border-[#58A72F] shadow-sm'
                        : 'bg-[#181818] hover:bg-[#222222] text-white border-[#333333]'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${desireStay === true ? 'text-white' : 'text-[#7DD748]'}`} />
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
                        ? 'bg-[#223820] text-white border-[#58A72F] shadow-sm'
                        : 'bg-[#181818] hover:bg-[#222222] text-white border-[#333333]'
                    }`}
                  >
                    <XCircle className={`w-4 h-4 ${desireStay === false ? 'text-[#DDF1D2]' : 'text-[#888888]'}`} />
                    <span>NO, BREWERIES ONLY</span>
                  </button>
                </div>
              </div>

              {/* If YES: Show Lodging Type & Price Range */}
              {desireStay === true && (
                <div className="space-y-4 pt-3 border-t border-[#223820] animate-in fade-in duration-150">
                  {/* Lodging Type */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 font-brand tracking-wide">
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
                                ? 'bg-[#1E3B18] text-white border-2 border-[#58A72F] shadow-sm ring-2 ring-[#58A72F]/30'
                                : 'bg-[#181818] hover:bg-[#202020] text-white border-[#333333]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-black text-xs sm:text-sm font-display text-white">{stay.label}</span>
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#58A72F]' : 'text-[#7DD748]'}`} />
                            </div>
                            <span className={`text-[10px] leading-tight block ${isSelected ? 'text-[#DDF1D2] font-bold' : 'text-[#8EAD84]'}`}>
                              {stay.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 font-brand tracking-wide">
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
                                ? 'bg-[#58A72F] text-white border-2 border-[#7DD748] shadow-sm'
                                : 'bg-[#181818] hover:bg-[#202020] text-white border-[#333333]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`font-black text-[10px] uppercase tracking-wider font-brand ${isSelected ? 'text-[#DDF1D2]' : 'text-[#7DD748]'}`}>
                                {price.badge}
                              </span>
                              <DollarSign className={`w-3.5 h-3.5 ${isSelected ? 'text-[#DDF1D2]' : 'text-[#7DD748]'}`} />
                            </div>
                            <div className="font-black text-xs sm:text-sm mb-0.5 font-display text-white">
                              {price.label}
                            </div>
                            <span className={`text-[10px] leading-tight block ${isSelected ? 'text-[#E8F8E2] font-semibold' : 'text-[#8EAD84]'}`}>
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
        <div className="p-4 sm:p-6 bg-[#0E150C] border-t border-[#223820] space-y-4">
          {/* Extended Loading / Brewing Progress Notification (if >= 15 seconds) */}
          {isLoading && loadingSeconds >= 15 && (
            <div
              id="route-brewing-delayed-notice"
              className="p-4 sm:p-5 rounded-2xl border-2 flex items-center gap-3.5 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-xl"
              style={{
                backgroundColor: '#151D13',
                borderColor: activeThemeConfig.accentColor,
              }}
            >
              {/* Spinning Wheel with Complementary Theme Accent */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 border-3 rounded-full animate-spin"
                  style={{
                    borderColor: `${activeThemeConfig.primaryColor}30`,
                    borderTopColor: activeThemeConfig.accentColor,
                    borderRightColor: activeThemeConfig.primaryColor,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm">
                  🍺
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className="text-sm sm:text-base font-black font-brand uppercase tracking-wider leading-tight"
                    style={{ color: activeThemeConfig.accentColor }}
                  >
                    Route is Brewing....just a moment.
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/90 font-mono font-bold">
                    {loadingSeconds}s elapsed
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#A3B899] mt-0.5 leading-snug font-medium">
                  Untappd scores, verified driving legs (&le; 25 min), and local craft itineraries are being assembled.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#A3B899]">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs"
                style={{ backgroundColor: activeThemeConfig.primaryColor }}
              />
              <span className="text-[11px] sm:text-xs font-semibold">
                Max 3 breweries/day • Spaced ≤ 25 min • Certified ratings
              </span>
            </div>

            <button
              type="submit"
              id="generate-route-submit-btn"
              disabled={isLoading}
              style={{
                background: `linear-gradient(135deg, ${activeThemeConfig.primaryColor} 0%, ${activeThemeConfig.accentColor} 100%)`,
                boxShadow: `0 10px 25px -5px ${activeThemeConfig.primaryColor}55, 0 4px 12px -2px ${activeThemeConfig.accentColor}44`,
                borderColor: `${activeThemeConfig.accentColor}99`,
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-black text-sm shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer hover:brightness-110 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed min-h-[52px] font-brand tracking-wider border-2"
            >
              {isLoading ? (
                <>
                  <div className="relative flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white border-r-white rounded-full animate-spin" />
                  </div>
                  <span>
                    {loadingSeconds >= 15
                      ? 'ROUTE IS BREWING.... JUST A MOMENT'
                      : 'CRAFTING YOUR ROUTE...'}
                  </span>
                </>
              ) : (
                <>
                  <HopIcon className="w-5 h-5 text-white drop-shadow-xs" filled />
                  <span className="drop-shadow-xs">GENERATE BEERHOP ITINERARY</span>
                  <ChevronRight className="w-4 h-4 text-white/90" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

