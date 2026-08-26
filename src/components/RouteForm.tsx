import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Beer,
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
import { RouteParameters, TripDuration, StayType, PriceRange } from '../types';
import { BEER_STYLE_OPTIONS, POPULAR_DESTINATIONS } from '../data/curatedRoutes';
import { LocationAutocomplete } from './LocationAutocomplete';
import { LocationSuggestion } from '../data/locationSuggestions';

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

  return (
    <div className="w-full max-w-3xl mx-auto py-5 sm:py-8 px-4 sm:px-6 space-y-5 pb-28 md:pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold tracking-wide shadow-xs">
          <Beer className="w-4 h-4 text-amber-600" />
          <span>Microbrewery Trail Planner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Plan Your Microbrewery Route
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Craft multi-stop tasting tours with verified ratings, drive times under 25 mins, and round-trip Google Maps routes.
        </p>
      </div>

      {/* Popular Region Assist Chips (1-Tap Fill) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Popular Regions (1-Tap Fill)</span>
          </div>
          {(startLocation || destinationArea || selectedBeerStyles.length > 0 || tripLength) && (
            <button
              type="button"
              id="reset-form-fields-btn"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {POPULAR_DESTINATIONS.slice(0, 3).map((dest, idx) => (
            <button
              key={dest.name}
              type="button"
              id={`preset-quick-fill-btn-${idx}`}
              onClick={() => {
                setValidationError(null);
                setStartLocation(dest.startLoc);
                setDestinationArea(dest.name);
              }}
              className="text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 active:bg-amber-100 border border-slate-200 hover:border-amber-400 transition-all text-xs cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                {dest.name.split('(')[0]}
              </div>
              <p className="text-slate-500 text-[10px] truncate mt-0.5">{dest.highlight}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Material 3 Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-7 space-y-7">
          
          {/* STEP 1: Starting Location & Area to Visit */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md ring-4 ring-amber-100 shrink-0">
                1
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Locations & Destination
                </h2>
                <p className="text-xs text-slate-500">Where are you leaving from and where do you want to explore?</p>
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

          {/* STEP 2: Preferred Beer Styles (Material 3 Filter Chips) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md ring-4 ring-amber-100 shrink-0">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Preferred Beer Styles
                  </h2>
                  <p className="text-xs text-slate-500">Choose the styles you want to taste on the trail</p>
                </div>
              </div>

              {selectedBeerStyles.length > 0 ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {selectedBeerStyles.length} Selected
                </span>
              ) : (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                  None
                </span>
              )}
            </div>

            {/* Quick Filter Assist Chips */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-slate-500 mr-1">Shortcuts:</span>
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
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 transition-colors cursor-pointer min-h-[32px]"
                >
                  {pill.label}
                </button>
              ))}
              {selectedBeerStyles.length > 0 && (
                <button
                  type="button"
                  id="style-filter-clear"
                  onClick={() => selectStylePreset('clear')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
                        ? 'bg-amber-50 text-amber-950 border-amber-500 shadow-xs ring-1 ring-amber-500/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`font-bold text-xs ${isSelected ? 'text-amber-950' : 'text-slate-900'}`}>
                        {style.id}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'bg-amber-600 text-white scale-100' : 'bg-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                    <span className={`text-[11px] leading-tight line-clamp-1 ${isSelected ? 'text-amber-800 font-medium' : 'text-slate-500'}`}>
                      {style.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Total Length of the Trip (Material Segmented Cards) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md ring-4 ring-amber-100 shrink-0">
                  3
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Trip Duration
                  </h2>
                  <p className="text-xs text-slate-500">Choose the length of your beer road trip</p>
                </div>
              </div>

              {tripLength ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-600 text-white">
                  Selected
                </span>
              ) : (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
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
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-500/30'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm">{dur.label}</span>
                      <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-[10px] leading-tight block ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                      {dur.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Conditional Overnight Stay (Only if 2 Days or Weekend) */}
          {isMultiDay && (
            <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 animate-in fade-in duration-200">
              <div className="flex items-center gap-3.5 pb-3 border-b border-slate-200">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md ring-4 ring-amber-100 shrink-0">
                  4
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Overnight Stay Options
                  </h2>
                  <p className="text-xs text-slate-500">
                    For {tripLength === '2_days' ? '2-day' : 'weekend'} routes, we locate stays within 30 min of the last brewery.
                  </p>
                </div>
              </div>

              {/* Desire Stay Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  Include an overnight stay in the itinerary? <span className="text-amber-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id="desire-stay-yes-btn"
                    onClick={() => {
                      setValidationError(null);
                      setDesireStay(true);
                    }}
                    className={`p-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] ${
                      desireStay === true
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${desireStay === true ? 'text-amber-200' : 'text-slate-400'}`} />
                    <span>YES, Include Stay</span>
                  </button>

                  <button
                    type="button"
                    id="desire-stay-no-btn"
                    onClick={() => {
                      setValidationError(null);
                      setDesireStay(false);
                    }}
                    className={`p-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] ${
                      desireStay === false
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    <XCircle className={`w-4 h-4 ${desireStay === false ? 'text-amber-200' : 'text-slate-400'}`} />
                    <span>NO, Breweries Only</span>
                  </button>
                </div>
              </div>

              {/* If YES: Show Lodging Type & Price Range */}
              {desireStay === true && (
                <div className="space-y-4 pt-3 border-t border-slate-200 animate-in fade-in duration-150">
                  {/* Lodging Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-2">
                      Lodging Type (Hotel or Airbnb) <span className="text-amber-600">*</span>
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
                                ? 'bg-amber-50 text-amber-950 border-amber-500 shadow-xs ring-1 ring-amber-500/20'
                                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs sm:text-sm">{stay.label}</span>
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                            </div>
                            <span className={`text-[10px] leading-tight block ${isSelected ? 'text-amber-800' : 'text-slate-500'}`}>
                              {stay.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-2">
                      Price Range Per Night <span className="text-amber-600">*</span>
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
                                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`font-bold text-[10px] uppercase tracking-wider ${isSelected ? 'text-amber-100' : 'text-amber-600'}`}>
                                {price.badge}
                              </span>
                              <DollarSign className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-slate-400'}`} />
                            </div>
                            <div className="font-bold text-xs sm:text-sm mb-0.5">
                              {price.label}
                            </div>
                            <span className={`text-[10px] leading-tight block ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
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
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span className="text-[11px] sm:text-xs">Max 3 breweries/day • Spaced ≤ 25 min • Certified ratings</span>
          </div>

          <button
            type="submit"
            id="generate-route-submit-btn"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Crafting Your Route...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Generate BeerHop Itinerary</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
