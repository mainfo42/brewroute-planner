import React from 'react';
import { HopIcon } from './HopIcon';

export interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean; // true = white text on dark bg; false = dark text on light bg
  slogan?: string;
  showHopIcon?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Artisanal Craft Brewery Brand Logo
 * Inspired by classic craft brewery sign-painting typography (flowing vintage brush script
 * paired with a bold, tracked industrial sans slogan, anchored with the iconic fresh Hop emblem).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  darkMode = true,
  slogan = 'CRAFT BEER TRAILS',
  showHopIcon = true,
  href,
  onClick,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const containerSizes = isSm
    ? 'gap-2'
    : isLg
    ? 'gap-3.5 sm:gap-4'
    : 'gap-2.5 sm:gap-3';

  const hopSizes = isSm
    ? 'w-7 h-7'
    : isLg
    ? 'w-11 h-11 sm:w-13 sm:h-13'
    : 'w-8 h-8 sm:w-10 sm:h-10';

  const hopIconSizes = isSm
    ? 'w-4 h-4'
    : isLg
    ? 'w-7 h-7 sm:w-8 sm:h-8'
    : 'w-5 h-5 sm:w-6 sm:h-6';

  const titleSizes = isSm
    ? 'text-lg'
    : isLg
    ? 'text-3xl sm:text-4xl'
    : 'text-2xl sm:text-3xl';

  const sloganSizes = isSm
    ? 'text-[8px] tracking-[0.20em]'
    : isLg
    ? 'text-[11px] sm:text-xs tracking-[0.26em]'
    : 'text-[9px] sm:text-[10px] tracking-[0.24em]';

  const titleColor = darkMode
    ? 'text-white group-hover:text-[#66DE37]'
    : 'text-[#122610] group-hover:text-[#58A72F]';

  const sloganColor = darkMode
    ? 'text-[#E5A93C] group-hover:text-[#FBBF24]'
    : 'text-[#92400E] group-hover:text-[#78350F]';

  const content = (
    <div className={`flex items-center ${containerSizes} group select-none ${className}`}>
      {/* The Hop Concept: Fresh Artisanal Hop Icon */}
      {showHopIcon && (
        <div className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
          <div
            className={`${hopSizes} rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
              darkMode
                ? 'bg-gradient-to-br from-[#1E3B18] via-[#162D15] to-[#0D1E0D] border border-[#58A72F]/50 shadow-[0_4px_14px_rgba(88,167,47,0.25)] group-hover:shadow-[0_4px_20px_rgba(102,222,55,0.45)] group-hover:border-[#66DE37]/70'
                : 'bg-gradient-to-br from-[#DDF1D2] to-[#C6E2BD] border border-[#A2D093] shadow-xs'
            }`}
          >
            <HopIcon
              className={`${hopIconSizes} text-[#66DE37] drop-shadow-[0_2px_8px_rgba(102,222,55,0.5)]`}
              filled
              variant="route"
            />
          </div>
        </div>
      )}

      {/* Crafty Site Name & Underneath Slogan */}
      <div className="flex flex-col justify-center">
        {/* Main Brand Wordmark: Vintage Craft Brewery Script */}
        <span
          className={`font-crafty ${titleSizes} ${titleColor} transition-colors duration-200 leading-none drop-shadow-xs tracking-normal`}
          style={{
            fontFamily: "'Pacifico', 'Yellowtail', cursive, sans-serif",
            letterSpacing: '0.01em',
          }}
        >
          BrewHop
        </span>

        {/* Underneath Artisanal Slogan: Bold Craft All-Caps with Wide Tracking */}
        {slogan && (
          <div className="flex items-center gap-1 mt-1 pl-0.5">
            <span
              className={`font-crafty-slogan ${sloganSizes} ${sloganColor} font-black uppercase tracking-[0.24em] transition-colors duration-200 leading-tight`}
              style={{
                fontFamily: "'Barlow Semi Condensed', sans-serif",
              }}
            >
              • {slogan} •
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href || onClick) {
    return (
      <a
        href={href || '/'}
        onClick={onClick}
        id="site-brand-logo-link"
        className="inline-flex items-center cursor-pointer focus:outline-hidden"
      >
        {content}
      </a>
    );
  }

  return content;
};
