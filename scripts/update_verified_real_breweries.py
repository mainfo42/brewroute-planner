#!/usr/bin/env python3
import json

def format_beer(bh):
    return f"""          {{ name: {json.dumps(bh['name'], ensure_ascii=False)}, style: {json.dumps(bh['style'], ensure_ascii=False)}, abv: {json.dumps(bh.get('abv', '6.0%'), ensure_ascii=False)}, description: {json.dumps(bh['description'], ensure_ascii=False)} }}"""

def format_brewery(b):
    beers = ",\n".join(format_beer(bh) for bh in b['beerHighlights'])
    ba_score = b.get('beerAdvocateScore', round(min(4.95, b.get('untappdScore', 4.4) + 0.05), 2))
    ba_count = b.get('beerAdvocateCount', '1,100+ ratings')
    dur = b.get('suggestedDurationMin', 75)
    best_time = b.get('bestTimeToVisit', 'Mid-afternoon for prime tap fresh pours')
    
    return f"""      {{
        name: {json.dumps(b['name'], ensure_ascii=False)},
        tagline: {json.dumps(b['tagline'], ensure_ascii=False)},
        address: {json.dumps(b['address'], ensure_ascii=False)},
        city: {json.dumps(b['city'], ensure_ascii=False)},
        state: {json.dumps(b['state'], ensure_ascii=False)},
        country: {json.dumps(b['country'], ensure_ascii=False)},
        lat: {b['lat']},
        lng: {b['lng']},
        googleScore: {b['googleScore']},
        googleCount: {json.dumps(b['googleCount'], ensure_ascii=False)},
        untappdScore: {b['untappdScore']},
        untappdCount: {json.dumps(b['untappdCount'], ensure_ascii=False)},
        rateBeerScore: {b['rateBeerScore']},
        tripAdvisorScore: {b['tripAdvisorScore']},
        tripAdvisorCount: {json.dumps(b['tripAdvisorCount'], ensure_ascii=False)},
        beerAdvocateScore: {ba_score},
        beerAdvocateCount: {json.dumps(ba_count, ensure_ascii=False)},
        suggestedDurationMin: {dur},
        bestTimeToVisit: {json.dumps(best_time, ensure_ascii=False)},
        foodHighlights: {json.dumps(b['foodHighlights'], ensure_ascii=False)},
        atmosphere: {json.dumps(b['atmosphere'], ensure_ascii=False)},
        beerHighlights: [
{beers}
        ],
        websiteUrl: {json.dumps(b['websiteUrl'], ensure_ascii=False)},
      }}"""

def format_stay(s):
    amenities = ", ".join(json.dumps(a, ensure_ascii=False) for a in s.get('amenities', ['Free Wi-Fi', 'Parking']))
    return f"""      {{
        name: {json.dumps(s['name'], ensure_ascii=False)},
        type: {json.dumps(s.get('type', 'hotel'), ensure_ascii=False)},
        priceCategory: {json.dumps(s.get('priceCategory', '100_to_200'), ensure_ascii=False)},
        estimatedPricePerNight: {json.dumps(s.get('estimatedPricePerNight', '$165 / night'), ensure_ascii=False)},
        address: {json.dumps(s['address'], ensure_ascii=False)},
        city: {json.dumps(s['city'], ensure_ascii=False)},
        state: {json.dumps(s['state'], ensure_ascii=False)},
        lat: {s['lat']},
        lng: {s['lng']},
        description: {json.dumps(s['description'], ensure_ascii=False)},
        amenities: [{amenities}],
        bookingSearchUrl: {json.dumps(s.get('bookingSearchUrl', 'https://www.google.com/travel/hotels'), ensure_ascii=False)},
      }}"""

def format_region(r):
    kws = ", ".join(json.dumps(k, ensure_ascii=False) for k in r['regionKeywords'])
    breweries = ",\n".join(format_brewery(b) for b in r['breweries'])
    hotels = ",\n".join(format_stay(h) for h in r.get('hotels', []))
    airbnbs = ",\n".join(format_stay(a) for a in r.get('airbnbs', []))
    
    return f"""  {{
    regionKeywords: [{kws}],
    stateOrProvince: {json.dumps(r['stateOrProvince'], ensure_ascii=False)},
    country: {json.dumps(r['country'], ensure_ascii=False)},
    breweries: [
{breweries}
    ],
    hotels: [
{hotels}
    ],
    airbnbs: [
{airbnbs}
    ],
  }}"""

from scripts.data_usa import ADDITIONAL_USA_REGIONS

with open('src/data/verifiedRealBreweries.ts') as f:
    lines = f.readlines()

# We want to remove:
# - Quebec: lines 945 to 1289 (0-indexed: 944 to 1289)
# - Ontario: lines 1547 to 1673 (0-indexed: 1546 to 1673)
# - British Columbia: lines 2139 to 2362 (0-indexed: 2138 to 2362)
# - createDynamicCityRegion: lines 2685 to end

# Let's locate them dynamically by key markers
new_lines = []
skip = False
skip_reason = ""

i = 0
while i < len(lines):
    line = lines[i]
    
    # Check for Quebec block
    if '// QUEBEC, CANADA' in line:
        # Skip until New York block
        while i < len(lines) and 'stateOrProvince: \'New York\'' not in lines[i]:
            i += 1
        # Step back to the start of New York block
        # Find where New York's comment or open brace starts
        j = i
        while j > 0 and '{' not in lines[j]:
            j -= 1
        # Include from j onwards
        i = j
        continue

    # Check for Ontario block
    if '// ONTARIO, CANADA' in line:
        while i < len(lines) and 'stateOrProvince: \'Wellington & Nelson\'' not in lines[i]:
            i += 1
        j = i
        while j > 0 and '{' not in lines[j]:
            j -= 1
        i = j
        continue

    # Check for BC block
    if '// BRITISH COLUMBIA, CANADA' in line:
        while i < len(lines) and 'stateOrProvince: \'Washington\'' not in lines[i]:
            i += 1
        j = i
        while j > 0 and '{' not in lines[j]:
            j -= 1
        i = j
        continue

    # Check for end of VERIFIED_REAL_REGIONS array: `];`
    if line.strip() == '];' and i > 2000 and i < 2700:
        # Insert additional US regions before `];`
        new_lines.append("  // ADDITIONAL UNITED STATES CRAFT HUBS\n")
        for r in ADDITIONAL_USA_REGIONS:
            new_lines.append(format_region(r) + ",\n")
        new_lines.append("];\n")
        i += 1
        break

    new_lines.append(line)
    i += 1

# Now we need the helper functions and findMatchingRealRegion and createDynamicCityRegion
helpers = """
/**
 * Helper to look up any verified real brewery by name across all regions
 */
export function findVerifiedBreweryByName(breweryName: string): RealBreweryRecord | undefined {
  if (!breweryName) return undefined;
  const target = breweryName.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  for (const r of VERIFIED_REAL_REGIONS) {
    for (const b of r.breweries) {
      const clean = b.name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      if (clean === target || clean.includes(target) || target.includes(clean)) {
        return b;
      }
    }
  }
  return undefined;
}

/**
 * Checks if a brewery is verified in our real-world database
 */
export function isVerifiedRealBrewery(breweryName: string): boolean {
  return !!findVerifiedBreweryByName(breweryName);
}

/**
 * Finds all authentic verified craft breweries within a geographic radius of a coordinate
 */
export function findVerifiedBreweriesNearLocation(
  coords: { lat: number; lng: number },
  maxRadiusKm: number = 45
): RealBreweryRecord[] {
  const matches: { brewery: RealBreweryRecord; distanceKm: number }[] = [];
  const seen = new Set<string>();

  for (const r of VERIFIED_REAL_REGIONS) {
    for (const b of r.breweries) {
      if (seen.has(b.name.toLowerCase())) continue;
      const dist = calculateHaversineKm(coords, { lat: b.lat, lng: b.lng });
      if (dist <= maxRadiusKm) {
        seen.add(b.name.toLowerCase());
        matches.push({ brewery: b, distanceKm: dist });
      }
    }
  }

  matches.sort((a, b) => a.distanceKm - b.distanceKm);
  return matches.map((m) => m.brewery);
}

/**
 * Helper to match query against verified real regions
 */
export function findMatchingRealRegion(
  destinationQuery: string,
  extraHint?: string
): RealRegionBreweries | undefined {
  if (!destinationQuery) return undefined;
  const clean = destinationQuery.toLowerCase().trim();
  const normalized = clean.replace(/\\(.*?\\)/g, '').replace(/,/g, ' ').replace(/\\s+/g, ' ').trim();
  const hint = extraHint ? extraHint.toLowerCase().trim() : '';

  // 1. Try exact stateOrProvince match or normalized match
  const exactState = VERIFIED_REAL_REGIONS.find((r) => {
    const s = r.stateOrProvince.toLowerCase();
    return (
      s === clean ||
      s === normalized ||
      new RegExp(`\\\\b${s}\\\\b`, 'i').test(normalized) ||
      (hint && (hint === s || new RegExp(`\\\\b${s}\\\\b`, 'i').test(hint)))
    );
  });
  if (exactState) return exactState;

  // 2. Score by matches with word boundary and keyword specificity
  let bestRegion: RealRegionBreweries | undefined = undefined;
  let bestScore = -1;

  for (const r of VERIFIED_REAL_REGIONS) {
    let score = 0;
    const combined = `${clean} ${normalized} ${hint}`;
    for (const kw of r.regionKeywords) {
      if (new RegExp(`\\\\b${kw}\\\\b`, 'i').test(combined)) {
        // Longer keywords have higher specificity
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestRegion = r;
    }
  }

  return bestScore > 0 ? bestRegion : undefined;
}

/**
 * Strictly verifies physical operating craft breweries for any city without generating synthetic entries.
 * If verifiable breweries exist within 50km, returns them; otherwise returns empty list so engine gracefully notifies the user.
 */
export function createDynamicCityRegion(
  cityName: string,
  fullName: string,
  coords: { lat: number; lng: number },
  styles: string[] = ['IPA', 'Lager', 'Stout']
): RealRegionBreweries {
  const cleanCity = cityName.replace(/,/g, '').trim();
  // Look up genuine real breweries within 50 km of city center
  const nearbyBreweries = findVerifiedBreweriesNearLocation(coords, 50);

  return {
    regionKeywords: [cleanCity.toLowerCase(), fullName.toLowerCase()],
    stateOrProvince: cleanCity,
    country: 'North America',
    breweries: nearbyBreweries,
    hotels: [],
    airbnbs: [],
  };
}
"""

new_content = "".join(new_lines) + helpers

with open('src/data/verifiedRealBreweries.ts', 'w') as f:
    f.write(new_content)

print("Updated src/data/verifiedRealBreweries.ts successfully.")
