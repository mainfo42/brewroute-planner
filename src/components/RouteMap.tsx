import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BrewTravelRoute, BreweryStop, StayRecommendation } from '../types';

interface RouteMapProps {
  route: BrewTravelRoute;
  selectedDay?: number | 'all';
  onSelectBrewery?: (brewery: BreweryStop) => void;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  route,
  selectedDay = 'all',
  onSelectBrewery,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([40.0, -75.0], 10);

      // Clean OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers, polyline and bounds whenever route or selectedDay changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const daysToRender = selectedDay === 'all'
      ? route.days
      : route.days.filter((d) => d.dayNumber === selectedDay);

    const latLngs: L.LatLngExpression[] = [];
    const dayColors = ['#855300', '#006494', '#2E6B12', '#6750A4'];

    // Identify first brewery and last stop for departure / return home lines
    const firstBrewery = route.days[0]?.breweries[0];
    const lastDay = route.days[route.days.length - 1];
    const lastBrewery = lastDay?.breweries[lastDay?.breweries.length - 1];
    const lastStop = lastDay?.stay || lastBrewery;

    // Determine Start / Return Home Location Coordinates
    let startPoint: [number, number] | null = null;
    if (route.startLocationCoord?.lat && route.startLocationCoord?.lng) {
      startPoint = [route.startLocationCoord.lat, route.startLocationCoord.lng];
    } else if (firstBrewery) {
      // Derive a realistic point based on first brewery
      const fLat = firstBrewery.lat || 44.46;
      const fLng = firstBrewery.lng || -72.7;
      startPoint = [fLat + 0.08, fLng - 0.12];
    }

    if (startPoint) {
      latLngs.push(startPoint);

      // Start & Return Home Marker (Material 3 Style)
      const homeIcon = L.divIcon({
        className: 'custom-home-pin',
        html: `
          <div style="
            background: #1F1B16;
            color: #FFDDB6;
            width: 36px;
            height: 36px;
            border-radius: 12px;
            border: 2.5px solid #2E6B12;
            box-shadow: 0 4px 12px rgba(0,0,0,0.22);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            cursor: pointer;
          ">
            🏠
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const homeMarker = L.marker(startPoint, { icon: homeIcon }).addTo(markersLayer);
      const departureMin = route.departureTransit?.driveTimeMin || 35;
      const returnHomeMin = route.returnHomeTransit?.driveTimeMin || 40;

      const homePopup = `
        <div style="padding: 14px; max-width: 250px; font-family: Roboto, 'Plus Jakarta Sans', sans-serif;">
          <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #2E6B12; letter-spacing: 0.5px;">
            Starting Point & Return Home
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #1F1B16; margin-top: 2px;">
            ${route.parameters.startLocation}
          </div>
          <div style="margin-top: 6px; font-size: 11px; color: #706456; line-height: 1.4;">
            <div>🚗 <strong>Departure to Stop 1:</strong> ~${departureMin} mins</div>
            <div>🏡 <strong>Return Home Drive:</strong> ~${returnHomeMin} mins</div>
          </div>
          <div style="margin-top: 10px;">
            <a href="https://maps.google.com/?q=${encodeURIComponent(route.parameters.startLocation)}" target="_blank" rel="noreferrer" style="display:inline-block;background:#855300;color:white;text-decoration:none;font-size:11px;font-weight:700;padding:6px 12px;border-radius:9999px;">
              View on Maps ↗
            </a>
          </div>
        </div>
      `;
      homeMarker.bindPopup(homePopup);
    }

    // Render Brewery Markers and Inter-Day connections
    daysToRender.forEach((day, dayIdx) => {
      const color = dayColors[(day.dayNumber - 1) % dayColors.length];
      const dayPoints: [number, number][] = [];

      day.breweries.forEach((brewery, bIdx) => {
        const lat = brewery.lat || (44.46 + dayIdx * 0.05 + bIdx * 0.01);
        const lng = brewery.lng || (-72.7 + dayIdx * 0.05 + bIdx * 0.01);
        const point: [number, number] = [lat, lng];
        dayPoints.push(point);
        latLngs.push(point);

        // Custom Material beer marker
        const customIcon = L.divIcon({
          className: 'custom-beer-pin',
          html: `
            <div style="
              background: ${color};
              color: white;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              border: 2.5px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.22);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 11px;
              cursor: pointer;
            ">
              <span>D${day.dayNumber}-${bIdx + 1}</span>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker(point, { icon: customIcon }).addTo(markersLayer);

        const ratingSummary = `
          <div style="display:flex;gap:6px;margin:6px 0;font-size:11px;font-weight:600;">
            <span style="background:#FFDDB6;color:#2A1700;padding:2px 8px;border-radius:9999px;">Untappd ${brewery.ratings.untappd.score.toFixed(2)} ★</span>
            <span style="background:#EEE9E0;color:#1F1B16;padding:2px 8px;border-radius:9999px;">Google ${brewery.ratings.google.score.toFixed(1)} ★</span>
          </div>
        `;

        const popupContent = `
          <div style="padding: 14px; max-width: 250px; font-family: Roboto, 'Plus Jakarta Sans', sans-serif;">
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: ${color}; letter-spacing: 0.5px;">
              Day ${day.dayNumber} • Stop ${bIdx + 1}
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #1F1B16; margin-top: 2px;">
              ${brewery.name}
            </div>
            <div style="font-size: 11px; color: #706456; margin-top: 2px;">
              ${brewery.address}
            </div>
            ${ratingSummary}
            <div style="font-size: 11px; color: #504539; margin-top: 4px; border-top: 1px solid #F4EEE5; padding-top: 6px;">
              <strong>Renowned:</strong> ${brewery.beerHighlights[0]?.name || 'Craft Beers'}
            </div>
            <div style="margin-top: 10px;">
              <a href="https://maps.google.com/?q=${encodeURIComponent(brewery.name + ' ' + brewery.address)}" target="_blank" rel="noreferrer" style="display:inline-block;background:#855300;color:white;text-decoration:none;font-size:11px;font-weight:700;padding:6px 12px;border-radius:9999px;">
                Open Directions ↗
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectBrewery) onSelectBrewery(brewery);
        });
      });

      // Draw polyline connecting day's breweries
      if (dayPoints.length > 1) {
        L.polyline(dayPoints, {
          color,
          weight: 4,
          opacity: 0.85,
          dashArray: '6, 8',
        }).addTo(markersLayer);
      }

      // Add Stay Marker if present
      if (day.stay) {
        const stayLat = day.stay.lat || (dayPoints[dayPoints.length - 1])[0] + 0.01;
        const stayLng = day.stay.lng || (dayPoints[dayPoints.length - 1])[1] + 0.01;
        const stayPoint: [number, number] = [stayLat, stayLng];
        latLngs.push(stayPoint);

        const stayIcon = L.divIcon({
          className: 'custom-stay-pin',
          html: `
            <div style="
              background: #1F1B16;
              color: #FFDDB6;
              width: 34px;
              height: 34px;
              border-radius: 10px;
              border: 2px solid #855300;
              box-shadow: 0 4px 10px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 14px;
            ">
              🛏️
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const stayMarker = L.marker(stayPoint, { icon: stayIcon }).addTo(markersLayer);

        const stayPopup = `
          <div style="padding: 14px; max-width: 250px; font-family: Roboto, 'Plus Jakarta Sans', sans-serif;">
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #855300;">
              Night ${day.dayNumber} Stay
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #1F1B16; margin-top: 2px;">
              ${day.stay.name}
            </div>
            <div style="font-size: 11px; font-weight: 600; color: #2E6B12; margin: 4px 0;">
              ${day.stay.estimatedPricePerNight} (${day.stay.type.toUpperCase()})
            </div>
            <div style="font-size: 10px; color: #706456;">
              ⏱️ ${day.stay.driveTimeFromLastBreweryMin} min from final brewery
            </div>
          </div>
        `;
        stayMarker.bindPopup(stayPopup);

        // Connect last brewery to stay
        if (dayPoints.length > 0) {
          L.polyline([dayPoints[dayPoints.length - 1], stayPoint], {
            color: '#855300',
            weight: 3,
            opacity: 0.7,
            dashArray: '4, 6',
          }).addTo(markersLayer);
        }
      }
    });

    // Draw Departure Leg (Start Location -> Day 1 Stop 1)
    if (startPoint && firstBrewery) {
      const firstPoint: [number, number] = [firstBrewery.lat || 44.46, firstBrewery.lng || -72.7];
      L.polyline([startPoint, firstPoint], {
        color: '#006494', // Blue departure line
        weight: 3.5,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(markersLayer);
    }

    // Draw Return Home Leg (Final Stop -> Start Location)
    if (startPoint && lastStop) {
      const lastPoint: [number, number] = [
        (lastStop as any).lat || 44.46, 
        (lastStop as any).lng || -72.7
      ];
      L.polyline([lastPoint, startPoint], {
        color: '#2E6B12', // Green return line
        weight: 3.5,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(markersLayer);
    }

    // Fit map bounds
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
    }

    // Force tile redraw after container resize
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [route, selectedDay]);

  return (
    <div className="w-full h-full min-h-[380px] rounded-3xl overflow-hidden border border-[#E6E0D6] relative z-0 shadow-2xs">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
      
      {/* Map Legend Overlay (Material 3 Tonal Card) */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#FAF8F5]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xs border border-[#E6E0D6] text-xs font-semibold text-[#1F1B16] space-y-1.5 max-w-[240px]">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-md bg-[#1F1B16] border border-[#2E6B12] flex items-center justify-center text-[10px]">🏠</span>
          <span className="truncate">Start & Return Home</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#855300] inline-block" />
          <span>Breweries (≤20 min)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-[#1F1B16] border border-[#855300] inline-flex items-center justify-center text-[8px]">🛏️</span>
          <span>Stay (≤30 min)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#706456] pt-0.5 border-t border-[#E6E0D6]">
          <span className="inline-block w-4 h-0.5 border-t-2 border-dashed border-[#006494]" />
          <span>Departure</span>
          <span className="inline-block w-4 h-0.5 border-t-2 border-dashed border-[#2E6B12] ml-1" />
          <span>Return Home</span>
        </div>
      </div>
    </div>
  );
};
