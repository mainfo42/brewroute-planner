import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, ChevronDown } from 'lucide-react';
import { ColorThemeVariant } from '../types';
import { THEME_VARIANTS, ThemeConfig } from '../utils/themeManager';

interface ThemeSelectorProps {
  currentTheme: ColorThemeVariant;
  onSelectTheme: (theme: ColorThemeVariant) => void;
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeThemeConfig = THEME_VARIANTS[currentTheme] || THEME_VARIANTS.hop_amber;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        id="theme-palette-switcher-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border shadow-xs select-none ${
          compact
            ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            : 'bg-[#20401E] hover:bg-[#2A5427] text-white border-[#386C35]'
        }`}
        title="Change Color Theme & Accents"
      >
        <div className="flex items-center -space-x-1">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
            style={{ backgroundColor: activeThemeConfig.primaryColor }}
          />
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
            style={{ backgroundColor: activeThemeConfig.accentColor }}
          />
        </div>

        <span className="hidden sm:inline font-brand tracking-wider uppercase text-[11px]">
          {activeThemeConfig.name.split('&')[0].trim()}
        </span>

        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono hidden md:inline">
          {activeThemeConfig.complementaryName}
        </span>

        <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Theme Selection Dropdown Popover */}
      {isOpen && (
        <div
          id="theme-palette-dropdown-menu"
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-3xl border border-[#C6E2BD] shadow-2xl z-50 overflow-hidden divide-y divide-[#EAF4E6] text-[#122610] animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="p-4 bg-[#F2F8F0]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#58A72F] uppercase tracking-wider font-brand flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Color Harmony Variants
              </span>
              <span className="text-[10px] font-bold text-[#4D6D47] bg-white px-2 py-0.5 rounded-full border border-[#C6E2BD]">
                Complementary Accents
              </span>
            </div>
            <h4 className="text-xs font-extrabold text-[#122610] mt-1">
              Select an artisanal craft beer palette:
            </h4>
          </div>

          {/* Theme Option Cards */}
          <div className="p-2 space-y-1.5">
            {Object.values(THEME_VARIANTS).map((theme: ThemeConfig) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  id={`select-theme-${theme.id}`}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#EAF4E6] border-[#58A72F] shadow-xs ring-2 ring-[#58A72F]/30'
                      : 'bg-[#FAFDF9] hover:bg-[#F0F8EC] border-[#E2EFE0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Dual-Color Swatch */}
                    <div className="flex items-center -space-x-2 shrink-0">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-2 ring-black/5"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-[#122610] font-display">
                          {theme.name}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#58A72F] text-white uppercase font-brand">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#4D6D47] leading-tight mt-0.5">
                        {theme.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <Check className="w-4 h-4 text-[#58A72F] shrink-0 stroke-[3]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-[#B2D8A6] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-[#FAFDF9] text-center text-[10px] text-[#4D6D47] font-medium">
            💡 Complementary accents dynamically highlight ratings, acclaimed beers, and travel stats.
          </div>
        </div>
      )}
    </div>
  );
};
