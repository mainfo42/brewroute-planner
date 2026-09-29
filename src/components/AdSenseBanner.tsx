import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { HopIcon } from './HopIcon';

export type AdFormatType = 'auto' | 'fluid' | 'horizontal' | 'rectangle' | 'leaderboard' | 'bigbox';

interface AdSenseBannerProps {
  slotId?: string;
  format?: AdFormatType;
  responsive?: boolean;
  className?: string;
  label?: string;
  darkMode?: boolean;
  /** Set to true to show polished sponsored placement when AdSense client ID is not configured */
  showPlaceholder?: boolean;
  sponsorName?: string;
  sponsorTagline?: string;
  sponsorCta?: string;
  sponsorUrl?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
  label = 'SPONSORED / ADVERTISEMENT',
  darkMode = true,
  showPlaceholder = true,
  sponsorName,
  sponsorTagline,
  sponsorCta = 'EXPLORE PARTNER',
  sponsorUrl = 'https://www.beeradvocate.com/',
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Read AdSense Client ID from environment variable
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';
  const effectiveSlotId = slotId || import.meta.env.VITE_ADSENSE_SLOT_BANNER || '';

  useEffect(() => {
    if (!clientId) return;

    // Dynamically inject the AdSense script if not already present
    const scriptId = 'google-adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    if (!adRef.current) return;

    try {
      const win = window as any;
      if (typeof win !== 'undefined') {
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch (err) {
      console.warn('AdSense slot initialization:', err);
      setAdError(true);
    }
  }, [clientId, effectiveSlotId]);

  // If live AdSense Client ID configured, render Google AdSense tag
  if (clientId) {
    const isLeaderboard = format === 'leaderboard' || format === 'horizontal';
    const isBigbox = format === 'bigbox' || format === 'rectangle';

    return (
      <aside
        aria-label="Advertisement"
        className={`w-full overflow-hidden text-center no-print ${
          darkMode ? 'bg-[#0F180E] border border-[#223920]' : 'bg-white border border-[#C6E2BD]/60'
        } ${isBigbox ? 'rounded-3xl p-4' : 'rounded-2xl p-2.5 my-6'} ${className}`}
      >
        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-white/5 text-[9px] uppercase font-bold tracking-widest text-[#7DD748]">
          <span>{label}</span>
          <span className="text-[8px] opacity-60">Google AdSense</span>
        </div>
        <div
          ref={adRef}
          className={`flex justify-center items-center overflow-hidden ${
            isLeaderboard ? 'min-h-[90px] max-w-[970px] mx-auto' : isBigbox ? 'min-h-[250px] w-full' : 'min-h-[90px]'
          }`}
        >
          <ins
            className="adsbygoogle"
            style={{
              display: 'block',
              minWidth: isBigbox ? '300px' : '280px',
              maxWidth: isLeaderboard ? '970px' : undefined,
              height: isLeaderboard ? '90px' : isBigbox ? '250px' : undefined,
              width: '100%',
            }}
            data-ad-client={clientId}
            data-ad-slot={effectiveSlotId || undefined}
            data-ad-format={isLeaderboard ? 'horizontal' : isBigbox ? 'rectangle' : format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
          />
        </div>
      </aside>
    );
  }

  // Placeholder / Sponsored Showcase mode when no Client ID is provided
  if (!showPlaceholder) {
    return null;
  }

  // 1. LEADERBOARD FORMAT (728x90 / responsive up to 970x90)
  if (format === 'leaderboard' || format === 'horizontal') {
    const brand = sponsorName || 'BeerAdvocate • The Independent Voice of Craft Beer';
    const tagline = sponsorTagline || 'Discover millions of certified ratings, worldwide brewery reviews, and active craft forum discussions.';

    return (
      <aside
        aria-label="Advertisement Leaderboard"
        className={`w-full max-w-5xl mx-auto my-6 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#274623] bg-gradient-to-r from-[#0E1A0D] via-[#162714] to-[#1E190D] shadow-lg no-print ${className}`}
      >
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#213B1F] text-[9px] sm:text-[10px] uppercase font-brand tracking-widest font-bold text-[#8EAD84]">
          <span className="flex items-center gap-1.5 text-[#66DE37]">
            <HopIcon className="w-3.5 h-3.5 text-[#58A72F]" />
            <span>{label} • LEADERBOARD (728x90)</span>
          </span>
          <span className="text-[9px] font-normal text-[#9CB394] opacity-75">
            Ad Partner Showcase
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#1C3319] border border-[#3E6D38] flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white font-display uppercase tracking-tight">
                  {brand}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#D97706]/30 text-[#FBBF24] border border-[#D97706]/50">
                  PARTNER
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#A8C7A0] leading-snug line-clamp-2 max-w-xl">
                {tagline}
              </p>
            </div>
          </div>

          <a
            href={sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#58A72F] hover:bg-[#468625] text-white text-xs font-bold font-brand tracking-wider transition-all shadow-md shrink-0 flex items-center gap-1.5 border border-[#7DD748]/50"
          >
            <span>{sponsorCta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    );
  }

  // 2. BIGBOX FORMAT (300x250 Medium Rectangle - Designed to fit inside the News Card Grid)
  if (format === 'bigbox' || format === 'rectangle') {
    const brand = sponsorName || 'Yakima Chief Hops';
    const tagline = sponsorTagline || '100% grower-owned network delivering premium Pacific Northwest hop varieties (Citra®, Mosaic®, Simcoe®) to master craft brewers.';

    return (
      <aside
        aria-label="Advertisement Bigbox"
        className={`p-5 rounded-3xl bg-gradient-to-b from-[#162714] via-[#121E11] to-[#1C160B] border border-[#2F5229] hover:border-[#F59E0B]/70 transition-all flex flex-col justify-between group shadow-lg no-print min-h-[300px] ${className}`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#213B1F] text-[10px] font-brand uppercase tracking-wider font-bold">
            <span className="flex items-center gap-1 text-[#F59E0B]">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>SPONSORED BIGBOX</span>
            </span>
            <span className="text-[9px] text-[#8EAD84] font-normal">300x250 Ad Unit</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-11 h-11 rounded-2xl bg-[#1C3319] border border-[#3E6D38] flex items-center justify-center shrink-0">
              <HopIcon className="w-6 h-6 text-[#66DE37]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-wider">
                FEATURED CRAFT PARTNER
              </span>
              <h4 className="text-base sm:text-lg font-black text-white font-display leading-tight">
                {brand}
              </h4>
            </div>
          </div>

          <p className="text-xs text-[#A8C7A0] leading-relaxed pt-1">
            {tagline}
          </p>

          <div className="p-3 rounded-2xl bg-[#0E1A0D] border border-[#1E361B] text-[11px] text-[#7DD748] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
            <span className="font-semibold">Official Hop & Brewing Equipment Sponsor</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-[#1C2F1A] flex items-center justify-between text-xs">
          <span className="text-[10px] font-medium text-[#718E6B]">
            Verified Partner Ad
          </span>
          <a
            href={sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs font-brand tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>{sponsorCta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    );
  }

  // 3. AUTO / DEFAULT BANNER
  return (
    <aside
      aria-label="Advertisement Placement"
      className={`w-full my-4 p-4 rounded-2xl border border-dashed text-center no-print ${
        darkMode
          ? 'bg-[#111111] border-[#333333] text-[#A3B899]'
          : 'bg-[#FAFDF9] border-[#C6E2BD] text-[#4D6D47]'
      } ${className}`}
    >
      <div className={`flex items-center justify-between gap-2 pb-1.5 border-b text-[10px] font-brand tracking-wider uppercase font-bold ${
        darkMode ? 'border-[#222222] text-[#7DD748]' : 'border-[#EAF4E6] text-[#6D9364]'
      }`}>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#58A72F]" />
          <span>Ad Placement ({format})</span>
        </span>
        <span className="text-[9px] font-normal lowercase opacity-75">
          AdSense Ready
        </span>
      </div>
      <div className="py-3 flex flex-col items-center justify-center gap-1 text-xs">
        <div className={`font-extrabold font-display text-sm ${darkMode ? 'text-white' : 'text-[#122610]'}`}>
          Craft Travel Sponsored Space
        </div>
        <p className={`text-[11px] max-w-md ${darkMode ? 'text-[#8EAD84]' : 'text-[#4D6D47]'}`}>
          This responsive ad unit serves live Google ads and verified craft partner promotions.
        </p>
      </div>
    </aside>
  );
};
