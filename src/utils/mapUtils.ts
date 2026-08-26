import { BrewTravelRoute, DayItinerary } from '../types';

/**
 * Builds a Google Maps Directions URL with all stops in order:
 * Start Location -> Day 1 Stops -> Day 1 Stay -> Day 2 Stops -> etc.
 */
export function generateFullRouteGoogleMapsUrl(
  startLocation: string,
  days: DayItinerary[]
): string {
  const allPoints: string[] = [];

  if (startLocation && startLocation.trim()) {
    allPoints.push(startLocation.trim());
  }

  days.forEach((day) => {
    day.breweries.forEach((brewery) => {
      const loc = brewery.address
        ? `${brewery.name}, ${brewery.address}`
        : `${brewery.name}, ${brewery.city}`;
      allPoints.push(loc);
    });

    if (day.stay) {
      const stayLoc = day.stay.address
        ? `${day.stay.name}, ${day.stay.address}`
        : day.stay.name;
      allPoints.push(stayLoc);
    }
  });

  if (allPoints.length === 0) return '';
  if (allPoints.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(allPoints[0])}`;
  }

  const origin = encodeURIComponent(allPoints[0]);
  const destination = encodeURIComponent(allPoints[allPoints.length - 1]);
  
  if (allPoints.length === 2) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  }

  const waypoints = allPoints
    .slice(1, -1)
    .map((pt) => encodeURIComponent(pt))
    .join('|');

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
}

/**
 * Builds a single day's Google Maps Directions URL with all of that day's stops in order.
 */
export function generateDayGoogleMapsUrl(
  day: DayItinerary,
  originLocation?: string
): string {
  const points: string[] = [];

  if (originLocation && originLocation.trim()) {
    points.push(originLocation.trim());
  }

  day.breweries.forEach((brewery) => {
    const loc = brewery.address
      ? `${brewery.name}, ${brewery.address}`
      : `${brewery.name}, ${brewery.city}`;
    points.push(loc);
  });

  if (day.stay) {
    const stayLoc = day.stay.address
      ? `${day.stay.name}, ${day.stay.address}`
      : day.stay.name;
    points.push(stayLoc);
  }

  if (points.length === 0) return '';
  if (points.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(points[0])}`;
  }

  const origin = encodeURIComponent(points[0]);
  const destination = encodeURIComponent(points[points.length - 1]);

  if (points.length === 2) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  }

  const waypoints = points
    .slice(1, -1)
    .map((pt) => encodeURIComponent(pt))
    .join('|');

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
}
