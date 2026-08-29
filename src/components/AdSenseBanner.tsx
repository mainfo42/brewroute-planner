import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Info } from 'lucide-react';

interface AdSenseBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'horizontal' | 'rectangle';
  responsive?: boolean;
  className?: string;
  label?: string;
  darkMode?: boolean;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Sponsored / Advertisement',
  darkMode = false,
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
      // Check if adsbygoogle is available in window
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

  // If no AdSense client ID configured yet, show a clean, unobtrusive placeholder for preview & layout testing
  if (!clientId) {
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
            <span>AdSense Banner Placement ({format})</span>
          </span>
          <span className="text-[9px] font-normal lowercase opacity-75">
            Configure VITE_ADSENSE_CLIENT_ID to activate
          </span>
        </div>
        <div className="py-3 flex flex-col items-center justify-center gap-1 text-xs">
          <div className={`font-extrabold font-display text-sm ${darkMode ? 'text-white' : 'text-[#122610]'}`}>
            Google AdSense Ready
          </div>
          <p className={`text-[11px] max-w-md ${darkMode ? 'text-[#8EAD84]' : 'text-[#4D6D47]'}`}>
            This responsive ad unit will serve live Google ads once your AdSense publisher ID is configured.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full my-4 overflow-hidden rounded-2xl p-2 text-center no-print ${
        darkMode ? 'bg-[#111111] border border-[#2D2D2D]' : 'bg-white border border-[#C6E2BD]/60'
      } ${className}`}
    >
      <div className={`text-[9px] uppercase font-bold tracking-wider mb-1 ${darkMode ? 'text-[#7DD748]' : 'text-[#6D9364]'}`}>
        {label}
      </div>
      <div ref={adRef} className="flex justify-center items-center min-h-[90px] overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '280px', width: '100%' }}
          data-ad-client={clientId}
          data-ad-slot={effectiveSlotId || undefined}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </aside>
  );
};
