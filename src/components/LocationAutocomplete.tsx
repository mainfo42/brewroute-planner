import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, X, Compass, Award, Building2, Map } from 'lucide-react';
import {
  LocationSuggestion,
  getMatchingLocations,
} from '../data/locationSuggestions';

interface LocationAutocompleteProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelectSuggestion?: (suggestion: LocationSuggestion) => void;
  placeholder?: string;
  required?: boolean;
  iconType?: 'navigation' | 'mapPin';
  onUseCurrentLocation?: () => void;
  helperText?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  id,
  label,
  value,
  onChange,
  onSelectSuggestion,
  placeholder = 'Type a city, state, or province (e.g. Vermont, Ontario)...',
  required = false,
  iconType = 'mapPin',
  onUseCurrentLocation,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggestions filtered based on current text input
  const suggestions = getMatchingLocations(value, 8);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (item: LocationSuggestion) => {
    onChange(item.name);
    setIsOpen(false);
    setIsFocused(false);
    setHighlightedIndex(-1);
    if (onSelectSuggestion) {
      onSelectSuggestion(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Outlined Input Box */}
      <div
        className={`relative flex flex-col justify-center px-4 pt-2.5 pb-2 bg-[#FAFDF9] rounded-2xl border transition-all ${
          isFocused
            ? 'border-[#58A72F] bg-white ring-2 ring-[#58A72F]/20 shadow-xs'
            : 'border-[#C6E2BD] hover:border-[#8BE052]'
        }`}
      >
        {/* Floating / Stacked Label */}
        <div className="flex items-center justify-between text-[11px] font-bold text-[#3B5734]">
          <label htmlFor={id} className="cursor-text flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-[#58A72F] font-bold">*</span>}
          </label>
          {helperText && (
            <span className="text-[10px] text-[#6D9364] font-normal hidden sm:inline">
              {helperText}
            </span>
          )}
        </div>

        {/* Input & Control Row */}
        <div className="flex items-center gap-2 mt-0.5">
          {/* Leading Icon */}
          <div className="text-[#58A72F] shrink-0">
            {iconType === 'navigation' ? (
              <Navigation className="w-4 h-4" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </div>

          <input
            ref={inputRef}
            id={id}
            type="text"
            required={required}
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsOpen(true);
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-[#122610] placeholder:text-[#A2D093] focus:ring-0 focus:outline-hidden min-h-[28px]"
          />

          {/* Trailing Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {value && (
              <button
                type="button"
                id={`${id}-clear-btn`}
                onClick={() => {
                  onChange('');
                  setIsOpen(true);
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-full text-[#6D9364] hover:text-[#122610] hover:bg-[#EAF4E6] transition-colors cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {onUseCurrentLocation && (
              <button
                type="button"
                id={`${id}-locate-me-btn`}
                onClick={onUseCurrentLocation}
                className="px-2.5 py-1 flex items-center gap-1 rounded-full text-[11px] font-black bg-[#DDF1D2] hover:bg-[#C8E7B8] active:bg-[#B2D8A6] text-[#122B0F] border border-[#B2D8A6] transition-colors cursor-pointer shrink-0 shadow-2xs font-brand tracking-wider"
                title="Use current GPS location"
              >
                <Navigation className="w-3 h-3 text-[#58A72F]" />
                <span>GPS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auto-suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          id={`${id}-suggestions-dropdown`}
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-[#C6E2BD] shadow-xl z-50 overflow-hidden divide-y divide-[#EAF4E6] animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* Header Bar */}
          <div className="px-4 py-2 bg-[#F2F8F0] text-[#3B5734] flex items-center justify-between text-[11px] font-black uppercase font-brand tracking-wide">
            <span className="flex items-center gap-1.5 text-[#58A72F]">
              <Compass className="w-3.5 h-3.5 text-[#58A72F]" />
              <span>Suggested Destinations</span>
            </span>
            <span className="text-[10px] text-[#6D9364]">1-Tap Fill</span>
          </div>

          {/* Suggestion list */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
            {suggestions.map((item, index) => {
              const isHighlighted = highlightedIndex === index;
              const isStateOrProvince = item.type === 'state' || item.type === 'province';

              return (
                <div
                  key={`${item.name}-${index}`}
                  id={`${id}-suggestion-item-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-3.5 py-2.5 rounded-2xl flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                    isHighlighted
                      ? 'bg-[#EAF4E6] text-[#122610]'
                      : 'hover:bg-[#FAFDF9] text-[#122610]'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isStateOrProvince ? (
                        <Map className="w-3.5 h-3.5 text-[#58A72F] shrink-0" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 text-[#6D9364] shrink-0" />
                      )}

                      <span className="font-extrabold text-xs sm:text-sm text-[#122610] font-display">
                        {item.name}
                      </span>

                      {/* Type Badge: State, Province, or City */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 font-brand ${
                          item.type === 'state'
                            ? 'bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6]'
                            : item.type === 'province'
                            ? 'bg-[#C8E7B8] text-[#122B0F] border border-[#A2D093]'
                            : 'bg-[#EAF4E6] text-[#3B5734]'
                        }`}
                      >
                        {item.type === 'state' ? 'US State' : item.type === 'province' ? 'CA Province' : 'City / Area'}
                      </span>

                      {/* Rank / Badge if available */}
                      {item.craftBeerHubRank && (
                        <span className="px-2 py-0.5 rounded-full bg-[#EAF4E6] text-[#58A72F] text-[10px] font-bold border border-[#B2D8A6] shrink-0 flex items-center gap-1">
                          <Award className="w-2.5 h-2.5 text-[#58A72F]" />
                          {item.craftBeerHubRank}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#4D6D47] leading-tight truncate">
                      {item.subtext}
                    </p>
                  </div>

                  <div className="hidden sm:block text-right shrink-0 self-center">
                    <span className="px-2 py-0.5 rounded-full bg-[#EAF4E6] text-[#3B5734] text-[10px] font-bold">
                      {item.country}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
