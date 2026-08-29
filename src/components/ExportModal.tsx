import React, { useState } from 'react';
import { X, Copy, Check, Download, Calendar, Share2, MapPin } from 'lucide-react';
import { HopIcon } from './HopIcon';
import { BrewTravelRoute } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: BrewTravelRoute | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, route }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !route) return null;

  const generateTextSummary = () => {
    let summary = `🍻 ${route.title} (${route.region})\n`;
    summary += `Total Breweries: ${route.totalBreweries} | Trip Length: ${route.days.length} Day(s)\n`;
    summary += `Total Drive Time: ~${route.totalTravelTimeMin} mins (Round-Trip) | Distance: ~${(route.totalDistanceMiles * 1.60934).toFixed(1)} km\n\n`;

    if (route.departureTransit) {
      summary += `🚗 DEPARTURE: From ${route.departureTransit.fromName} to ${route.departureTransit.toName} (~${route.departureTransit.driveTimeMin} mins)\n\n`;
    }

    route.days.forEach((day) => {
      summary += `📅 DAY ${day.dayNumber}: ${day.dayTitle}\n`;
      day.breweries.forEach((b, idx) => {
        summary += `  ${idx + 1}. ${b.name} (${b.city}, ${b.state || ''})\n`;
        summary += `     • Untappd: ${b.ratings.untappd.score.toFixed(2)} ★ | Google: ${b.ratings.google.score.toFixed(1)} ★\n`;
        summary += `     • Renowned For: ${b.beerHighlights.map((bh) => bh.name).join(', ')}\n`;
        summary += `     • Food: ${b.foodHighlights}\n`;
      });
      if (day.stay) {
        summary += `  🛏️ Stay: ${day.stay.name} (${day.stay.estimatedPricePerNight}) - ${day.stay.driveTimeFromLastBreweryMin} min from final brewery\n`;
      }
      summary += `\n`;
    });

    if (route.returnHomeTransit) {
      summary += `🏡 RETURN HOME: From ${route.returnHomeTransit.fromName} back to ${route.returnHomeTransit.toName} (~${route.returnHomeTransit.driveTimeMin} mins)\n\n`;
    }

    if (route.googleMapsMultiStopUrl) {
      summary += `🗺️ Google Maps Round-Trip Multi-Stop: ${route.googleMapsMultiStopUrl}\n`;
    }

    return summary;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateTextSummary());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadIcs = () => {
    // Generate iCal ICS calendar file
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//BeerHop//BeerHopPlanner//EN\n";

    const baseDate = new Date();
    baseDate.setHours(11, 30, 0, 0);

    route.days.forEach((day, dayIdx) => {
      day.breweries.forEach((brewery, bIdx) => {
        const start = new Date(baseDate);
        start.setDate(start.getDate() + dayIdx);
        start.setHours(12 + bIdx * 2, 0, 0, 0);

        const end = new Date(start);
        end.setMinutes(end.getMinutes() + brewery.suggestedDurationMin);

        const formatIcsDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:🍻 ${brewery.name} (Stop ${bIdx + 1})\n`;
        icsContent += `DESCRIPTION:Renowned for ${brewery.beerHighlights[0]?.name || 'Craft Beers'}. Food: ${brewery.foodHighlights}\n`;
        icsContent += `LOCATION:${brewery.address}\n`;
        icsContent += `DTSTART:${formatIcsDate(start)}\n`;
        icsContent += `DTEND:${formatIcsDate(end)}\n`;
        icsContent += "END:VEVENT\n";
      });
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${route.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_itinerary.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAFDF9] rounded-t-3xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#C6E2BD] flex flex-col animate-slide-up sm:animate-none">
        
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-[#B2D8A6]/60" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 bg-white flex items-center justify-between border-b border-[#EAF4E6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center font-bold shadow-xs">
              <Share2 className="w-5 h-5 text-[#58A72F]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#122610] tracking-tight font-display">
                Export & Share Brew Route
              </h2>
              <p className="text-xs text-[#4D6D47] font-medium">
                Sync to your calendar or share with friends
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-export-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#4D6D47] hover:text-[#122610] hover:bg-[#EAF4E6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-4 sm:p-6 space-y-3">
          {/* Download Calendar (.ics) */}
          <button
            type="button"
            id="download-ics-calendar-btn"
            onClick={handleDownloadIcs}
            className="w-full p-4 rounded-2xl bg-white hover:bg-[#DDF1D2]/40 border border-[#C6E2BD] hover:border-[#58A72F] text-left transition-colors flex items-center justify-between cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DDF1D2] text-[#122B0F] border border-[#B2D8A6] flex items-center justify-center font-bold shadow-2xs">
                <Calendar className="w-5 h-5 text-[#58A72F]" />
              </div>
              <div>
                <div className="font-extrabold text-xs sm:text-sm text-[#122610] font-display">
                  Export to Calendar (.ics)
                </div>
                <div className="text-[11px] text-[#4D6D47] font-medium">
                  Adds scheduled stops & tasting times to Apple, Google & Outlook
                </div>
              </div>
            </div>
            <Download className="w-5 h-5 text-[#58A72F]" />
          </button>

          {/* Copy Full Text Itinerary */}
          <button
            type="button"
            id="copy-text-itinerary-btn"
            onClick={handleCopySummary}
            className="w-full p-4 rounded-2xl bg-white hover:bg-[#EAF4E6] border border-[#C6E2BD] text-left transition-colors flex items-center justify-between cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF4E6] text-[#122610] flex items-center justify-center font-bold">
                {copiedText ? <Check className="w-5 h-5 text-[#58A72F]" /> : <Copy className="w-5 h-5 text-[#58A72F]" />}
              </div>
              <div>
                <div className="font-extrabold text-xs sm:text-sm text-[#122610] font-display">
                  {copiedText ? 'Copied to Clipboard!' : 'Copy Formatted Text Summary'}
                </div>
                <div className="text-[11px] text-[#4D6D47] font-medium">
                  Formatted for group chats, SMS, Discord, or notes
                </div>
              </div>
            </div>
            {copiedText ? (
              <span className="text-[10px] font-black text-[#122B0F] bg-[#DDF1D2] border border-[#B2D8A6] px-2.5 py-0.5 rounded-full font-brand uppercase">
                COPIED!
              </span>
            ) : (
              <Copy className="w-4 h-4 text-[#6D9364]" />
            )}
          </button>

          {/* Copy Shareable Link */}
          <button
            type="button"
            id="copy-app-link-btn"
            onClick={handleCopyLink}
            className="w-full p-4 rounded-2xl bg-white hover:bg-[#EAF4E6] border border-[#C6E2BD] text-left transition-colors flex items-center justify-between cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF4E6] text-[#122610] flex items-center justify-center font-bold">
                {copiedLink ? <Check className="w-5 h-5 text-[#58A72F]" /> : <Share2 className="w-5 h-5 text-[#58A72F]" />}
              </div>
              <div>
                <div className="font-extrabold text-xs sm:text-sm text-[#122610] font-display">
                  {copiedLink ? 'Link Copied!' : 'Copy Direct App Link'}
                </div>
                <div className="text-[11px] text-[#4D6D47] font-medium">
                  Share this web app with your road trip travel crew
                </div>
              </div>
            </div>
            {copiedLink ? (
              <span className="text-[10px] font-black text-[#122B0F] bg-[#DDF1D2] border border-[#B2D8A6] px-2.5 py-0.5 rounded-full font-brand uppercase">
                COPIED!
              </span>
            ) : (
              <Share2 className="w-4 h-4 text-[#6D9364]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

