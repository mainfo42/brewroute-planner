/**
 * Server-side Geocoding & Distance Matrix Engine for BeerHop
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface TransitEstimate {
  distanceKm: number;
  distanceMiles: number;
  driveTimeMin: number;
  formattedTime: string;
}

// Built-in coordinate dictionary for North American & Global craft beer hubs and cities
const CITY_COORDINATES: Record<string, LatLng> = {
  // Quebec & Canada
  'quebec': { lat: 46.8139, lng: -71.2080 },
  'quebec city': { lat: 46.8139, lng: -71.2080 },
  'quebec, canada': { lat: 46.8139, lng: -71.2080 },
  'quebec, qc': { lat: 46.8139, lng: -71.2080 },
  'quebec, qc, canada': { lat: 46.8139, lng: -71.2080 },
  'ville de quebec': { lat: 46.8139, lng: -71.2080 },
  'levis': { lat: 46.8033, lng: -71.1779 },
  'montreal': { lat: 45.5017, lng: -73.5673 },
  'montreal, qc': { lat: 45.5017, lng: -73.5673 },
  'montreal, canada': { lat: 45.5017, lng: -73.5673 },
  'laval': { lat: 45.6066, lng: -73.7124 },
  'sherbrooke': { lat: 45.4042, lng: -71.8929 },
  'sherbrooke, qc': { lat: 45.4042, lng: -71.8929 },
  'trois-rivieres': { lat: 46.3432, lng: -72.5477 },
  'trois-rivieres, qc': { lat: 46.3432, lng: -72.5477 },
  'gatineau': { lat: 45.4765, lng: -75.7013 },
  'ottawa': { lat: 45.4215, lng: -75.6972 },
  'ottawa, on': { lat: 45.4215, lng: -75.6972 },
  'ottawa, canada': { lat: 45.4215, lng: -75.6972 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'toronto, on': { lat: 43.6532, lng: -79.3832 },
  'mississauga': { lat: 43.5890, lng: -79.6441 },
  'hamilton': { lat: 43.2557, lng: -79.8711 },
  'london, on': { lat: 42.9849, lng: -81.2453 },
  'kingston': { lat: 44.2312, lng: -76.4860 },
  'kingston, on': { lat: 44.2312, lng: -76.4860 },
  'halifax': { lat: 44.6488, lng: -63.5752 },
  'vancouver': { lat: 49.2827, lng: -123.1207 },
  'calgary': { lat: 51.0447, lng: -114.0719 },
  'edmonton': { lat: 53.5461, lng: -113.4938 },
  'winnipeg': { lat: 49.8951, lng: -97.1384 },
  'victoria': { lat: 48.4284, lng: -123.3656 },

  // New England & Northeast US
  'burlington': { lat: 44.4759, lng: -73.2121 },
  'burlington, vt': { lat: 44.4759, lng: -73.2121 },
  'stowe': { lat: 44.4654, lng: -72.6874 },
  'stowe, vt': { lat: 44.4654, lng: -72.6874 },
  'waterbury': { lat: 44.3378, lng: -72.7562 },
  'waterbury, vt': { lat: 44.3378, lng: -72.7562 },
  'montpelier': { lat: 44.2601, lng: -72.5754 },
  'montpelier, vt': { lat: 44.2601, lng: -72.5754 },
  'greensboro': { lat: 44.5778, lng: -72.2968 },
  'greensboro, vt': { lat: 44.5778, lng: -72.2968 },
  'waitsfield': { lat: 44.1895, lng: -72.8243 },
  'waitsfield, vt': { lat: 44.1895, lng: -72.8243 },
  'middlebury, vt': { lat: 44.0153, lng: -73.1673 },
  'rutland, vt': { lat: 43.6106, lng: -72.9726 },
  'brattleboro, vt': { lat: 42.8509, lng: -72.5579 },
  'manchester, vt': { lat: 43.1637, lng: -73.0723 },
  'portland, me': { lat: 43.6591, lng: -70.2568 },
  'portland, maine': { lat: 43.6591, lng: -70.2568 },
  'bangor, me': { lat: 44.8016, lng: -68.7712 },
  'portsmouth, nh': { lat: 43.0718, lng: -70.7626 },
  'manchester, nh': { lat: 42.9956, lng: -71.4548 },
  'concord, nh': { lat: 43.2081, lng: -71.5376 },
  'boston': { lat: 42.3601, lng: -71.0589 },
  'boston, ma': { lat: 42.3601, lng: -71.0589 },
  'cambridge, ma': { lat: 42.3736, lng: -71.1097 },
  'somerville, ma': { lat: 42.3876, lng: -71.0995 },
  'worcester, ma': { lat: 42.2626, lng: -71.8023 },
  'salem, ma': { lat: 42.5195, lng: -70.8967 },
  'providence': { lat: 41.8240, lng: -71.4128 },
  'providence, ri': { lat: 41.8240, lng: -71.4128 },
  'newport, ri': { lat: 41.4901, lng: -71.3128 },
  'hartford': { lat: 41.7658, lng: -72.6734 },
  'hartford, ct': { lat: 41.7658, lng: -72.6734 },
  'new haven': { lat: 41.3083, lng: -72.9279 },
  'new haven, ct': { lat: 41.3083, lng: -72.9279 },
  'stamford, ct': { lat: 41.0534, lng: -73.5387 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'new york city': { lat: 40.7128, lng: -74.0060 },
  'new york, ny': { lat: 40.7128, lng: -74.0060 },
  'nyc': { lat: 40.7128, lng: -74.0060 },
  'brooklyn, ny': { lat: 40.6782, lng: -73.9442 },
  'queens, ny': { lat: 40.7282, lng: -73.7949 },
  'albany': { lat: 42.6526, lng: -73.7562 },
  'albany, ny': { lat: 42.6526, lng: -73.7562 },
  'saratoga springs, ny': { lat: 43.0831, lng: -73.7846 },
  'lake placid, ny': { lat: 44.2795, lng: -73.9799 },
  'plattsburgh, ny': { lat: 44.6995, lng: -73.4529 },
  'syracuse, ny': { lat: 43.0481, lng: -76.1474 },
  'rochester, ny': { lat: 43.1566, lng: -77.6088 },
  'buffalo, ny': { lat: 42.8864, lng: -78.8784 },
  'ithaca, ny': { lat: 42.4440, lng: -76.5019 },

  // Mid-Atlantic & South US
  'philadelphia': { lat: 39.9526, lng: -75.1652 },
  'philadelphia, pa': { lat: 39.9526, lng: -75.1652 },
  'pittsburgh': { lat: 40.4406, lng: -79.9959 },
  'pittsburgh, pa': { lat: 40.4406, lng: -79.9959 },
  'baltimore': { lat: 39.2904, lng: -76.6122 },
  'baltimore, md': { lat: 39.2904, lng: -76.6122 },
  'washington': { lat: 38.9072, lng: -77.0369 },
  'washington, dc': { lat: 38.9072, lng: -77.0369 },
  'richmond': { lat: 37.5407, lng: -77.4360 },
  'richmond, va': { lat: 37.5407, lng: -77.4360 },
  'charlottesville, va': { lat: 38.0293, lng: -78.4767 },
  'virginia beach, va': { lat: 36.8529, lng: -75.9780 },
  'asheville': { lat: 35.5951, lng: -82.5515 },
  'asheville, nc': { lat: 35.5951, lng: -82.5515 },
  'charlotte': { lat: 35.2271, lng: -80.8431 },
  'charlotte, nc': { lat: 35.2271, lng: -80.8431 },
  'raleigh, nc': { lat: 35.7796, lng: -78.6382 },
  'durham, nc': { lat: 35.9940, lng: -78.8986 },
  'charleston, sc': { lat: 32.7765, lng: -79.9311 },
  'atlanta': { lat: 33.7490, lng: -84.3880 },
  'atlanta, ga': { lat: 33.7490, lng: -84.3880 },
  'savannah, ga': { lat: 32.0809, lng: -81.0912 },
  'tampa, fl': { lat: 27.9506, lng: -82.4572 },
  'st. petersburg, fl': { lat: 27.7676, lng: -82.6403 },
  'miami, fl': { lat: 25.7617, lng: -80.1918 },
  'orlando, fl': { lat: 28.5383, lng: -81.3792 },
  'nashville': { lat: 36.1627, lng: -86.7816 },
  'nashville, tn': { lat: 36.1627, lng: -86.7816 },
  'memphis, tn': { lat: 35.1495, lng: -90.0490 },
  'knoxville, tn': { lat: 35.9606, lng: -83.9207 },
  'chattanooga, tn': { lat: 35.0456, lng: -85.3097 },
  'louisville, ky': { lat: 38.2527, lng: -85.7585 },
  'lexington, ky': { lat: 38.0406, lng: -84.5037 },
  'new orleans, la': { lat: 29.9511, lng: -90.0715 },

  // Midwest US
  'columbus, oh': { lat: 39.9612, lng: -82.9988 },
  'cleveland, oh': { lat: 41.4993, lng: -81.6944 },
  'cincinnati, oh': { lat: 39.1031, lng: -84.5120 },
  'indianapolis, in': { lat: 39.7684, lng: -86.1581 },
  'detroit, mi': { lat: 42.3314, lng: -83.0458 },
  'grand rapids, mi': { lat: 42.9634, lng: -85.6681 },
  'kalamazoo, mi': { lat: 42.2917, lng: -85.5872 },
  'traverse city, mi': { lat: 44.7631, lng: -85.6206 },
  'ann arbor, mi': { lat: 42.2808, lng: -83.7430 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'chicago, il': { lat: 41.8781, lng: -87.6298 },
  'milwaukee': { lat: 43.0389, lng: -87.9065 },
  'milwaukee, wi': { lat: 43.0389, lng: -87.9065 },
  'madison, wi': { lat: 43.0731, lng: -89.4012 },
  'minneapolis': { lat: 44.9778, lng: -93.2650 },
  'minneapolis, mn': { lat: 44.9778, lng: -93.2650 },
  'st. paul, mn': { lat: 44.9537, lng: -93.0900 },
  'st. louis, mo': { lat: 38.6270, lng: -90.1994 },
  'kansas city, mo': { lat: 39.0997, lng: -94.5786 },

  // Mountain & West Coast US
  'denver': { lat: 39.7392, lng: -104.9903 },
  'denver, co': { lat: 39.7392, lng: -104.9903 },
  'boulder, co': { lat: 40.0150, lng: -105.2705 },
  'fort collins, co': { lat: 40.5853, lng: -105.0844 },
  'salt lake city, ut': { lat: 40.7608, lng: -111.8910 },
  'phoenix, az': { lat: 33.4484, lng: -112.0740 },
  'scottsdale, az': { lat: 33.4942, lng: -111.9261 },
  'tucson, az': { lat: 32.2226, lng: -110.9747 },
  'albuquerque, nm': { lat: 35.0844, lng: -106.6504 },
  'las vegas, nv': { lat: 36.1699, lng: -115.1398 },
  'boise, id': { lat: 43.6150, lng: -116.2023 },
  'seattle': { lat: 47.6062, lng: -122.3321 },
  'seattle, wa': { lat: 47.6062, lng: -122.3321 },
  'spokane, wa': { lat: 47.6588, lng: -117.4260 },
  'portland, or': { lat: 45.5152, lng: -122.6784 },
  'portland, oregon': { lat: 45.5152, lng: -122.6784 },
  'bend, or': { lat: 44.0582, lng: -121.3153 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'san francisco, ca': { lat: 37.7749, lng: -122.4194 },
  'oakland, ca': { lat: 37.8044, lng: -122.2712 },
  'san jose, ca': { lat: 37.3382, lng: -121.8863 },
  'santa rosa, ca': { lat: 38.4404, lng: -122.7141 },
  'sacramento, ca': { lat: 38.5816, lng: -121.4944 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'los angeles, ca': { lat: 34.0522, lng: -118.2437 },
  'san diego': { lat: 32.7157, lng: -117.1611 },
  'san diego, ca': { lat: 32.7157, lng: -117.1611 },
  'austin, tx': { lat: 30.2672, lng: -97.7431 },
  'dallas, tx': { lat: 32.7767, lng: -96.7970 },
  'houston, tx': { lat: 29.7604, lng: -95.3698 },
};

export function resolveCoordinates(locationStr: string, fallbackCoord?: LatLng): LatLng {
  if (!locationStr || !locationStr.trim()) {
    return fallbackCoord || { lat: 44.4759, lng: -73.2121 };
  }

  const trimmed = locationStr.trim();

  // 1. Direct Regex
  const latLngMatch = trimmed.match(/(-?\d+\.\d+)[,\s]+(?:lng:?\s*)?(-?\d+\.\d+)/i);
  if (latLngMatch) {
    const lat = parseFloat(latLngMatch[1]);
    const lng = parseFloat(latLngMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  // 2. Normalized Dictionary Search
  const normalized = trimmed.toLowerCase()
    .replace(/[^\w\s,.-]/g, '')
    .replace(/\s+/g, ' ');

  if (CITY_COORDINATES[normalized]) {
    return CITY_COORDINATES[normalized];
  }

  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized === key || normalized.startsWith(key + ',') || normalized.includes(key)) {
      return coords;
    }
  }

  const firstPart = normalized.split(',')[0].trim();
  if (CITY_COORDINATES[firstPart]) {
    return CITY_COORDINATES[firstPart];
  }

  return fallbackCoord || { lat: 44.4759, lng: -73.2121 };
}

export function calculateHaversineKm(from: LatLng, to: LatLng): number {
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateDrivingTransit(from: LatLng, to: LatLng): TransitEstimate {
  const straightLineKm = calculateHaversineKm(from, to);

  let roadWindingFactor = 1.26;
  let avgSpeedKmh = 90;

  if (straightLineKm < 10) {
    roadWindingFactor = 1.35;
    avgSpeedKmh = 42;
  } else if (straightLineKm < 40) {
    roadWindingFactor = 1.30;
    avgSpeedKmh = 65;
  } else if (straightLineKm < 150) {
    roadWindingFactor = 1.25;
    avgSpeedKmh = 88;
  } else {
    roadWindingFactor = 1.24;
    avgSpeedKmh = 96;
  }

  const distanceKm = straightLineKm * roadWindingFactor;
  const distanceMiles = distanceKm / 1.60934;

  let driveTimeMin = Math.round((distanceKm / avgSpeedKmh) * 60);

  const isCrossBorder = (from.lat > 45.01 && to.lat < 45.0) || (from.lat < 45.0 && to.lat > 45.01);
  if (isCrossBorder && straightLineKm > 60) {
    driveTimeMin += 15;
  }

  if (straightLineKm > 0.5 && driveTimeMin < 5) {
    driveTimeMin = 5;
  }

  const hours = Math.floor(driveTimeMin / 60);
  const mins = driveTimeMin % 60;
  const formattedTime = hours > 0
    ? (mins > 0 ? `~${hours} hr ${mins} min` : `~${hours} hr`)
    : `~${driveTimeMin} min`;

  return {
    distanceKm: parseFloat(distanceKm.toFixed(1)),
    distanceMiles: parseFloat(distanceMiles.toFixed(1)),
    driveTimeMin,
    formattedTime,
  };
}
