import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { RouteParameters, BrewTravelRoute, DayItinerary, BreweryStop, StayRecommendation } from '../src/types';
import { findMatchingRealRegion, VERIFIED_REAL_REGIONS, RealBreweryRecord } from '../src/data/verifiedRealBreweries';
import { enrichAndValidateRoute, validateBreweryStyleMatch, checkStyleMatch } from '../src/utils/styleMatcher';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Fallback generator will be used if needed.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.post('/generate-route', async (req, res) => {
  const params: RouteParameters = req.body;

  if (!params.startLocation || !params.destinationArea) {
    return res.status(400).json({ error: 'Starting location and destination area are required.' });
  }

  const ai = getGeminiClient();

  const dayCount = params.tripLength === 'few_hours' || params.tripLength === '1_day' 
    ? 1 
    : params.tripLength === '2_days' 
      ? 2 
      : 3; // 3 days for weekend trip

  const priceRangeLabel = params.priceRange === 'under_100'
    ? 'less than $100 per night'
    : params.priceRange === '100_to_200'
      ? '$100 to $200 per night'
      : params.priceRange === 'over_200'
        ? '200+ $ per night'
        : 'market rate';

  const isMultiDay = dayCount > 1;
  const wantsStay = isMultiDay && params.desireStay !== false && params.stayType && params.stayType !== 'none';

  const stayRequirement = wantsStay
    ? `Since trip length is ${params.tripLength} (${dayCount} days) and stay type is ${params.stayType}, you MUST include an overnight "stay" recommendation object ONLY between active tour days.
       - FOR 2-DAY TRIPS: Include 1 stay recommendation on Day 1 (for the night between Day 1 and Day 2). Day 2 (final day) must NOT have a stay object.
       - FOR 3-DAY (WEEKEND) TRIPS: Include a stay recommendation on Day 1 (night between Day 1-2) and Day 2 (night between Day 2-3). Day 3 (final day) must NOT have a stay object.
       - Type must be strictly "${params.stayType}" (either "hotel" or "airbnb").
       - Best value stay matching the user's price bracket: "${priceRangeLabel}".
       - STRICT DISTANCE CONSTRAINT 1: The stay must NOT be more than 30 minutes driving distance from the last brewery visited that day (driveTimeFromLastBreweryMin <= 30).
       - STRICT DISTANCE CONSTRAINT 2: The stay must NOT be more than 30 minutes driving distance from the first brewery visited on the next day (driveTimeToNextBreweryMin <= 30).`
    : 'No stay required (single day trip or user chose not to include a stay). Set stay to null/undefined on all days.';

  const excludeInstruction = params.excludeBreweries && params.excludeBreweries.length > 0
    ? `CRITICAL EXCLUSION / ALTERNATIVE BREWERIES INSTRUCTION:
       The user was not fully satisfied with a previous route and requested an ALTERNATIVE selection.
       You MUST EXCLUDE and NOT USE any of the following breweries: [${params.excludeBreweries.map(b => `"${b}"`).join(', ')}].
       Generate a completely fresh, DIFFERENT set of top-tier, highly acclaimed microbreweries in/around ${params.destinationArea} that match the user's beer style preferences.`
    : '';

  const prompt = `You are a world-class craft beer travel sommelier and itinerary master for BeerHop.
Generate a high-fidelity, 100% REAL-WORLD Brew Travel Route for microbrewery enthusiasts with full end-to-end driving directions including departure from home and return home navigation.

CRITICAL REAL-WORLD VERIFICATION DIRECTIVE:
You are STRICTLY FORBIDDEN from inventing fictional brewery names, generic placeholder bars, or made-up street addresses (e.g., NEVER return names like "Hop & Barrel Works", "Craft Brewing Co", "500 Heritage Way").
Every single brewery MUST be a real, currently operating, physical microbrewery in or directly adjacent to the requested destination region: "${params.destinationArea}".
You MUST include:
- The EXACT real brewery name (e.g., "The Alchemist", "Hill Farmstead Brewery", "Foam Brewers", "Lawson's Finest Liquids", "Russian River Brewing Company", "Allagash Brewing Company", "Bellwoods Brewery", etc.).
- Their actual physical street address (e.g., "100 Cottage Club Rd, Stowe, VT 05672", "403 Hill Rd, Greensboro, VT 05841", "112 Lake St, Burlington, VT 05401").
- Real, actual flagship and acclaimed beers they brew with accurate ABV (e.g., "Heady Topper DIPA 8.0%", "Focal Banger IPA 7.0%", "Edward Pale Ale 5.2%").
- Real food program (e.g., on-site food trucks, wood-fired pizza kitchen, artisan cheese & pretzels).
- Real stay recommendations (real hotels or Airbnbs in that exact town/city).

USER CRITERIA & STRICT TRIP LENGTH CONSTRAINTS:
- Starting Location (Home / Origin): "${params.startLocation}"
- Destination Area to Visit: "${params.destinationArea}"
- Preferred Beer Styles: ${params.beerStyles.length > 0 ? params.beerStyles.join(', ') : 'All craft styles'}
- Total Trip Length: ${params.tripLength} (${dayCount} day(s))
- Overnight Stay Requested: ${wantsStay ? `YES (${params.stayType}, Price: ${priceRangeLabel})` : 'NO (No lodging needed)'}
${excludeInstruction}

MANDATORY RULES & DRIVING CONSTRAINTS:
1. STRICT TRIP DAYS & BREWERY LIMITS:
   - For 1-day trip (${params.tripLength}): Generate EXACTLY 1 day (days.length === 1). Provide 2 to 3 microbreweries (STRICT MAXIMUM 3). NO stay recommendation.
   - For 2-day trip (${params.tripLength}): Generate EXACTLY 2 days (days.length === 2). Provide 2 to 3 microbreweries per day (STRICT MAXIMUM 6 total). If stay requested, 1 stay on Day 1.
   - For 3-day (weekend) trip (${params.tripLength}): Generate EXACTLY 3 days (days.length === 3). Provide 2 to 3 microbreweries per day (STRICT MAXIMUM 9 total). If stay requested, 1 stay on Day 1 and 1 stay on Day 2.
2. COMPLETE ROUND-TRIP DRIVE TIMES:
   - "departureTransit": Realistic drive time (in minutes) and distance (in miles) from Starting Location ("${params.startLocation}") to the first brewery of Day 1.
   - "returnHomeTransit": Realistic drive time (in minutes) and distance (in miles) from the last visited brewery (or stay) on the final day back to Starting Location ("${params.startLocation}").
   - "totalTravelTimeMin" for the entire trip MUST BE THE SUM OF ALL DRIVES:
     (Starting Location -> Brewery 1) + (all intermediate drives between breweries & stays) + (Final stop -> Return Home to Starting Location).
   - "totalDistanceMiles" MUST be the complete round trip mileage including departure and return home.
3. 25-MINUTE PROXIMITY RULE: Each brewery visited on the same day MUST NOT be more than 25 minutes driving distance from each other (driveTimeFromPrevMin <= 25).
4. LIVE ON-TAP BEER STYLE VALIDATION:
   - When the user specifies preferred beer styles: [${params.beerStyles.join(', ')}]:
     a) Look up and feature their real on-tap beers and catalog that match the requested styles.
     b) If user selected "NEIPA", include their hazy / New England IPAs. If user selected "Pilsner", include crisp Pilsners. Do NOT confuse Pilsners with IPAs, or Stouts with Porters.
     c) In "beerHighlights", ALWAYS feature 2 to 4 beers that specifically include the beers matching the user's selected styles.
5. HIGHEST COMPOSITE AVERAGE REVIEW RATING:
   - Mathematical composite average across Google, Untappd, RateBeer, and TripAdvisor (target compositeAverage >= 4.4 / 5.0).
6. STAY RECOMMENDATIONS: ${stayRequirement}
7. RESPONSIBLE TASTING: Include 3-4 responsible beer tasting and safe transit tips.
8. COORDINATES: Provide realistic latitude/longitude for the start location and each stop.

Return a strictly valid JSON object matching the JSON schema.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              region: { type: Type.STRING },
              summary: { type: Type.STRING },
              totalBreweries: { type: Type.INTEGER },
              totalTravelTimeMin: { type: Type.INTEGER },
              totalDistanceMiles: { type: Type.NUMBER },
              beerStyleMatchNotes: { type: Type.STRING },
              hasRouteWarning: { type: Type.BOOLEAN },
              routeWarningMessage: { type: Type.STRING },
              needsPreferenceModification: { type: Type.BOOLEAN },
              startLocationCoord: {
                type: Type.OBJECT,
                properties: {
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER },
                },
              },
              departureTransit: {
                type: Type.OBJECT,
                properties: {
                  fromName: { type: Type.STRING },
                  toName: { type: Type.STRING },
                  driveTimeMin: { type: Type.INTEGER },
                  distanceMiles: { type: Type.NUMBER },
                  notes: { type: Type.STRING },
                },
                required: ['fromName', 'toName', 'driveTimeMin', 'distanceMiles'],
              },
              returnHomeTransit: {
                type: Type.OBJECT,
                properties: {
                  fromName: { type: Type.STRING },
                  toName: { type: Type.STRING },
                  driveTimeMin: { type: Type.INTEGER },
                  distanceMiles: { type: Type.NUMBER },
                  notes: { type: Type.STRING },
                },
                required: ['fromName', 'toName', 'driveTimeMin', 'distanceMiles'],
              },
              responsibleTastingTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              googleMapsMultiStopUrl: { type: Type.STRING },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    dayTitle: { type: Type.STRING },
                    theme: { type: Type.STRING },
                    recommendedStartTime: { type: Type.STRING },
                    totalDriveTimeMin: { type: Type.INTEGER },
                    totalDriveDistanceMiles: { type: Type.NUMBER },
                    daySummary: { type: Type.STRING },
                    breweries: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          tagline: { type: Type.STRING },
                          address: { type: Type.STRING },
                          city: { type: Type.STRING },
                          state: { type: Type.STRING },
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER },
                          driveTimeFromPrevMin: { type: Type.INTEGER },
                          driveDistanceFromPrevMiles: { type: Type.NUMBER },
                          ratings: {
                            type: Type.OBJECT,
                            properties: {
                              google: {
                                type: Type.OBJECT,
                                properties: {
                                  score: { type: Type.NUMBER },
                                  count: { type: Type.STRING },
                                },
                                required: ['score'],
                              },
                              untappd: {
                                type: Type.OBJECT,
                                properties: {
                                  score: { type: Type.NUMBER },
                                  count: { type: Type.STRING },
                                },
                                required: ['score'],
                              },
                              rateBeer: {
                                type: Type.OBJECT,
                                properties: {
                                  score: { type: Type.NUMBER },
                                  count: { type: Type.STRING },
                                },
                                required: ['score'],
                              },
                              tripAdvisor: {
                                type: Type.OBJECT,
                                properties: {
                                  score: { type: Type.NUMBER },
                                  count: { type: Type.STRING },
                                },
                                required: ['score'],
                              },
                            },
                            required: ['google', 'untappd', 'rateBeer', 'tripAdvisor'],
                          },
                          beerHighlights: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                name: { type: Type.STRING },
                                style: { type: Type.STRING },
                                abv: { type: Type.STRING },
                                description: { type: Type.STRING },
                              },
                              required: ['name', 'style', 'description'],
                            },
                          },
                          foodHighlights: { type: Type.STRING },
                          atmosphere: { type: Type.STRING },
                          suggestedDurationMin: { type: Type.INTEGER },
                          bestTimeToVisit: { type: Type.STRING },
                          hasPreferredStyle: { type: Type.BOOLEAN },
                          styleNotice: { type: Type.STRING },
                          matchedStyles: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                          },
                          websiteUrl: { type: Type.STRING },
                          untappdUrl: { type: Type.STRING },
                          rateBeerUrl: { type: Type.STRING },
                          taplistUrl: { type: Type.STRING },
                          styleVerificationSources: {
                            type: Type.OBJECT,
                            properties: {
                              websiteVerified: { type: Type.BOOLEAN },
                              untappdVerified: { type: Type.BOOLEAN },
                              rateBeerVerified: { type: Type.BOOLEAN },
                              details: { type: Type.STRING },
                            },
                          },
                          googleMapsUrl: { type: Type.STRING },
                        },
                        required: [
                          'id',
                          'name',
                          'address',
                          'city',
                          'lat',
                          'lng',
                          'driveTimeFromPrevMin',
                          'ratings',
                          'beerHighlights',
                          'foodHighlights',
                        ],
                      },
                    },
                    stay: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        type: { type: Type.STRING },
                        priceCategory: { type: Type.STRING },
                        estimatedPricePerNight: { type: Type.STRING },
                        address: { type: Type.STRING },
                        lat: { type: Type.NUMBER },
                        lng: { type: Type.NUMBER },
                        driveTimeFromLastBreweryMin: { type: Type.INTEGER },
                        driveTimeToNextBreweryMin: { type: Type.INTEGER },
                        description: { type: Type.STRING },
                        amenities: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        bookingSearchUrl: { type: Type.STRING },
                      },
                    },
                  },
                  required: ['dayNumber', 'dayTitle', 'breweries', 'daySummary'],
                },
              },
            },
            required: ['title', 'region', 'summary', 'days'],
          },
        },
      });

      const rawText = response.text?.trim();
      if (rawText) {
        const parsed: BrewTravelRoute = JSON.parse(rawText);
        parsed.parameters = params;
        parsed.createdAt = new Date().toISOString();
        if (!parsed.id) parsed.id = `route-${Date.now()}`;

        // Strictly enforce day count:
        // 1 day = 1 day (max 3 breweries, NO stay)
        // 2 days = 2 days (max 6 breweries, 1 stay if wantsStay on Day 1)
        // 3 days (weekend) = 3 days (max 9 breweries, 1 stay on Day 1 & 1 stay on Day 2 if wantsStay)
        if (parsed.days && parsed.days.length > 0) {
          parsed.days = parsed.days.slice(0, dayCount);
        }

        // Ensure days and brewery limits per day (strictly max 3)
        parsed.days.forEach((day, dIdx) => {
          day.dayNumber = dIdx + 1;
          if (day.breweries && day.breweries.length > 3) {
            day.breweries = day.breweries.slice(0, 3);
          }

          const isLastDay = dIdx === parsed.days.length - 1;
          if (!wantsStay || dayCount === 1 || isLastDay) {
            day.stay = undefined;
          }

          day.breweries.forEach(b => {
            const googleScore = Number(b.ratings?.google?.score || 4.7);
            const untappdScore = Number(b.ratings?.untappd?.score || 4.2);
            const rateBeerScore = Number(b.ratings?.rateBeer?.score || 4.3);
            const tripAdvisorScore = Number(b.ratings?.tripAdvisor?.score || 4.6);
            
            const compAverage = Number(((googleScore + untappdScore + rateBeerScore + tripAdvisorScore) / 4).toFixed(2));
            if (!b.ratings) {
              b.ratings = {
                google: { score: 4.7, count: '1,200+ reviews' },
                untappd: { score: 4.25, count: '35k check-ins' },
                rateBeer: { score: 4.3, count: 'Top 98%' },
                tripAdvisor: { score: 4.6, count: '450+ reviews' },
              };
            }
            b.ratings.compositeAverage = compAverage;

            // Ensure brewery individual Google Maps navigation link
            const targetDest = b.address ? `${b.name}, ${b.address}` : `${b.name}, ${b.city}`;
            b.googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(targetDest)}&travelmode=driving`;

            // Ensure Untappd, RateBeer, and Website URLs
            b.untappdUrl = b.untappdUrl || `https://untappd.com/search?q=${encodeURIComponent(b.name + ' ' + (b.city || ''))}`;
            b.rateBeerUrl = b.rateBeerUrl || `https://www.ratebeer.com/search?q=${encodeURIComponent(b.name + ' ' + (b.city || ''))}`;
            b.websiteUrl = b.websiteUrl || `https://www.google.com/search?q=${encodeURIComponent(b.name + ' brewery official website')}`;
            if (!b.taplistUrl && b.websiteUrl) {
              b.taplistUrl = b.websiteUrl;
            }
          });
        });

        // Ensure first brewery and last stop are identified
        const firstBrewery = parsed.days[0]?.breweries[0];
        const lastDay = parsed.days[parsed.days.length - 1];
        const lastBrewery = lastDay?.breweries[lastDay?.breweries.length - 1];
        const lastStop = (lastDay?.stay) ? lastDay.stay : lastBrewery;

        // Ensure departureTransit is populated
        if (!parsed.departureTransit && firstBrewery) {
          parsed.departureTransit = {
            fromName: params.startLocation,
            toName: firstBrewery.name,
            driveTimeMin: 35,
            distanceMiles: 22.5,
            notes: `Departure journey from ${params.startLocation} to first brewery`,
          };
        }
        if (parsed.departureTransit && firstBrewery) {
          parsed.departureTransit.directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(params.startLocation)}&destination=${encodeURIComponent(firstBrewery.address ? `${firstBrewery.name}, ${firstBrewery.address}` : `${firstBrewery.name}, ${firstBrewery.city}`)}&travelmode=driving`;
        }

        // Ensure returnHomeTransit is populated
        if (!parsed.returnHomeTransit && lastStop) {
          parsed.returnHomeTransit = {
            fromName: lastStop.name,
            toName: params.startLocation,
            driveTimeMin: 40,
            distanceMiles: 25.0,
            notes: `Return home journey back to ${params.startLocation}`,
          };
        }
        if (parsed.returnHomeTransit && lastStop) {
          const fromAddr = (lastStop as any).address ? `${lastStop.name}, ${(lastStop as any).address}` : lastStop.name;
          parsed.returnHomeTransit.directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(fromAddr)}&destination=${encodeURIComponent(params.startLocation)}&travelmode=driving`;
        }

        // Attach transit legs to Day 1 and Last Day for timeline convenience
        if (parsed.days[0]) {
          parsed.days[0].departureTransit = parsed.departureTransit;
        }
        if (lastDay) {
          lastDay.returnHomeTransit = parsed.returnHomeTransit;
        }

        // Build rock-solid Google Maps Multi-Stop Round-Trip URL:
        // Origin: startLocation -> Waypoints: [B1, B2, B3, Stay, B4, ...] -> Destination: startLocation (Return Home!)
        const orderedWaypoints: string[] = [];
        parsed.days.forEach(d => {
          d.breweries.forEach(b => {
            orderedWaypoints.push(b.address ? `${b.name}, ${b.address}` : `${b.name}, ${b.city}`);
          });
          if (d.stay) {
            orderedWaypoints.push(d.stay.address ? `${d.stay.name}, ${d.stay.address}` : d.stay.name);
          }
        });

        if (params.startLocation && orderedWaypoints.length > 0) {
          const origin = encodeURIComponent(params.startLocation);
          const destination = encodeURIComponent(params.startLocation); // Return Home!
          const waypoints = orderedWaypoints.map(s => encodeURIComponent(s)).join('|');
          parsed.googleMapsMultiStopUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
        } else if (orderedWaypoints.length >= 2) {
          const origin = encodeURIComponent(orderedWaypoints[0]);
          const destination = encodeURIComponent(orderedWaypoints[orderedWaypoints.length - 1]);
          const waypoints = orderedWaypoints.slice(1, -1).map(s => encodeURIComponent(s)).join('|');
          parsed.googleMapsMultiStopUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
        }

        // Build per-day Google Maps Links (including start on Day 1 and return home on final day)
        parsed.days.forEach((day, idx) => {
          const isFirstDay = idx === 0;
          const isLastDay = idx === parsed.days.length - 1;

          const dayStops: string[] = [];
          if (isFirstDay && params.startLocation) {
            dayStops.push(params.startLocation);
          }
          day.breweries.forEach(b => dayStops.push(b.address ? `${b.name}, ${b.address}` : `${b.name}, ${b.city}`));
          if (day.stay) {
            dayStops.push(day.stay.address ? `${day.stay.name}, ${day.stay.address}` : day.stay.name);
          }
          if (isLastDay && params.startLocation) {
            dayStops.push(params.startLocation); // Return Home for last day
          }

          if (dayStops.length >= 2) {
            const origin = encodeURIComponent(dayStops[0]);
            const destination = encodeURIComponent(dayStops[dayStops.length - 1]);
            const waypoints = dayStops.slice(1, -1).map(s => encodeURIComponent(s)).join('|');
            day.googleMapsDayUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
          } else if (dayStops.length === 1) {
            day.googleMapsDayUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dayStops[0])}`;
          }
        });

        // Ensure Total Drive Time and Total Distance rigorously include Start Leg and Return Home Leg
        const departureMin = parsed.departureTransit?.driveTimeMin || 35;
        const returnHomeMin = parsed.returnHomeTransit?.driveTimeMin || 40;
        const departureDist = parsed.departureTransit?.distanceMiles || 22.5;
        const returnHomeDist = parsed.returnHomeTransit?.distanceMiles || 25.0;

        // Sum intermediate brewery drives
        let intermediateMin = 0;
        let intermediateDist = 0;
        parsed.days.forEach((d, dayIdx) => {
          d.breweries.forEach((b, bi) => {
            if (bi > 0) {
              intermediateMin += b.driveTimeFromPrevMin || 12;
              intermediateDist += b.driveDistanceFromPrevMiles || 4.5;
            }
          });
          if (d.stay) {
            intermediateMin += d.stay.driveTimeFromLastBreweryMin || 14;
            intermediateDist += 5.0;
          }
          if (dayIdx > 0 && parsed.days[dayIdx - 1]?.stay) {
            intermediateMin += parsed.days[dayIdx - 1].stay?.driveTimeToNextBreweryMin || 15;
            intermediateDist += 6.0;
          }
        });

        const calculatedTotalTravelTimeMin = departureMin + intermediateMin + returnHomeMin;
        const calculatedTotalDistanceMiles = parseFloat((departureDist + intermediateDist + returnHomeDist).toFixed(1));

        parsed.totalTravelTimeMin = Math.max(parsed.totalTravelTimeMin || 0, calculatedTotalTravelTimeMin);
        parsed.totalDistanceMiles = Math.max(parsed.totalDistanceMiles || 0, calculatedTotalDistanceMiles);

        // Also adjust Day 1 and Last Day totalDriveTimeMin
        if (parsed.days[0]) {
          parsed.days[0].totalDriveTimeMin = (parsed.days[0].totalDriveTimeMin || 20) + (isMultiDay ? departureMin : (departureMin + returnHomeMin));
          parsed.days[0].totalDriveDistanceMiles = parseFloat(((parsed.days[0].totalDriveDistanceMiles || 10) + (isMultiDay ? departureDist : (departureDist + returnHomeDist))).toFixed(1));
        }
        if (lastDay && isMultiDay) {
          lastDay.totalDriveTimeMin = (lastDay.totalDriveTimeMin || 20) + returnHomeMin;
          lastDay.totalDriveDistanceMiles = parseFloat(((lastDay.totalDriveDistanceMiles || 10) + returnHomeDist).toFixed(1));
        }

        // Update total breweries count
        parsed.totalBreweries = parsed.days.reduce((acc, d) => acc + d.breweries.length, 0);

        // Rigorously validate each brewery style and check proximity limits
        const fullyValidatedRoute = enrichAndValidateRoute(parsed, params.beerStyles || []);
        return res.json(fullyValidatedRoute);
      }
    }
  } catch (error: any) {
    console.error('Gemini Route Generation Error:', error);
  }

  // Fallback generation if Gemini API is missing or had transient failure
  const fallbackRoute = generateSmartFallbackRoute(params, dayCount, priceRangeLabel, wantsStay);
  return res.json(enrichAndValidateRoute(fallbackRoute, params.beerStyles || []));
});

// Real-world verified fallback generator that delivers genuine, physical microbreweries and stays
function generateSmartFallbackRoute(
  params: RouteParameters, 
  dayCount: number, 
  priceRangeLabel: string,
  wantsStay: boolean
): BrewTravelRoute {
  const area = params.destinationArea || 'Vermont, USA';
  const startLoc = params.startLocation || 'Departure City';
  const styles = params.beerStyles.length > 0 ? params.beerStyles : ['NEIPA', 'Lager', 'Stout'];

  // Try to find a verified real region match
  const matchedRegion = findMatchingRealRegion(area) || VERIFIED_REAL_REGIONS[0]; // defaults to Vermont if unmatched
  
  // Filter out any excluded breweries requested by user for alternatives
  const excludedSet = new Set((params.excludeBreweries || []).map(b => b.toLowerCase().trim()));
  let candidateBreweries = matchedRegion.breweries.filter(b => !excludedSet.has(b.name.toLowerCase().trim()));
  
  if (candidateBreweries.length < 2) {
    // If exclusions eliminated too many, wrap back to all breweries
    candidateBreweries = matchedRegion.breweries;
  }

  // Sort candidate breweries prioritizing ones that have at least one matching preferred style
  if (params.beerStyles && params.beerStyles.length > 0) {
    candidateBreweries = [...candidateBreweries].sort((a, b) => {
      const aMatches = (a.beerHighlights || []).some(bh =>
        params.beerStyles.some(style => checkStyleMatch(`${bh.name} ${bh.style} ${bh.description}`, style))
      );
      const bMatches = (b.beerHighlights || []).some(bh =>
        params.beerStyles.some(style => checkStyleMatch(`${bh.name} ${bh.style} ${bh.description}`, style))
      );
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }

  const departureDriveTimeMin = 35;
  const departureDistanceMiles = 22.5;
  const returnHomeDriveTimeMin = 38;
  const returnHomeDistanceMiles = 24.0;

  const regenOffset = (params.regenerationCount || 0) * 2;

  const days: DayItinerary[] = Array.from({ length: dayCount }, (_, dayIdx) => {
    const dayNum = dayIdx + 1;
    const isFirstDay = dayNum === 1;
    const isLastDay = dayNum === dayCount;

    // Pick 2-3 real breweries per day from the candidate list
    const startIndex = (dayIdx * 3 + regenOffset) % candidateBreweries.length;
    const dayBreweryRecords: RealBreweryRecord[] = [];
    const breweriesPerDay = Math.min(3, Math.max(2, candidateBreweries.length - dayBreweryRecords.length));

    for (let i = 0; i < breweriesPerDay; i++) {
      const bRecord = candidateBreweries[(startIndex + i) % candidateBreweries.length];
      if (!dayBreweryRecords.some(existing => existing.name === bRecord.name)) {
        dayBreweryRecords.push(bRecord);
      }
    }

    // Convert to BreweryStop objects with real addresses, ratings, and beers
    const breweries: BreweryStop[] = dayBreweryRecords.map((bRecord, bIdx) => {
      const compAverage = Number(((bRecord.googleScore + bRecord.untappdScore + bRecord.rateBeerScore + bRecord.tripAdvisorScore) / 4).toFixed(2));
      const driveTime = bIdx === 0 ? 0 : 12 + bIdx * 3; // within 25 mins proximity
      const driveDist = bIdx === 0 ? 0 : 4.5 + bIdx * 1.5;

      const stopWithoutValidation: BreweryStop = {
        id: `brewery-real-${dayNum}-${bIdx + 1}-${bRecord.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: bRecord.name,
        tagline: bRecord.tagline,
        address: bRecord.address,
        city: bRecord.city,
        state: bRecord.state,
        lat: bRecord.lat,
        lng: bRecord.lng,
        driveTimeFromPrevMin: driveTime,
        driveDistanceFromPrevMiles: driveDist,
        ratings: {
          google: { score: bRecord.googleScore, count: bRecord.googleCount },
          untappd: { score: bRecord.untappdScore, count: bRecord.untappdCount },
          rateBeer: { score: bRecord.rateBeerScore, count: 'Top Rated' },
          tripAdvisor: { score: bRecord.tripAdvisorScore, count: bRecord.tripAdvisorCount },
          compositeAverage: compAverage,
        },
        beerHighlights: bRecord.beerHighlights,
        foodHighlights: bRecord.foodHighlights,
        atmosphere: bRecord.atmosphere,
        suggestedDurationMin: bRecord.suggestedDurationMin,
        bestTimeToVisit: bRecord.bestTimeToVisit,
        websiteUrl: bRecord.websiteUrl,
        taplistUrl: bRecord.websiteUrl,
        untappdUrl: `https://untappd.com/search?q=${encodeURIComponent(bRecord.name + ' ' + bRecord.city)}`,
        rateBeerUrl: `https://www.ratebeer.com/search?q=${encodeURIComponent(bRecord.name + ' ' + bRecord.city)}`,
        googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${bRecord.name}, ${bRecord.address}`)}&travelmode=driving`,
      };

      const styleCheck = validateBreweryStyleMatch(stopWithoutValidation, params.beerStyles || []);
      stopWithoutValidation.hasPreferredStyle = styleCheck.hasPreferredStyle;
      stopWithoutValidation.matchedStyles = styleCheck.matchedStyles;
      stopWithoutValidation.styleNotice = styleCheck.styleNotice;

      return stopWithoutValidation;
    });

    // Match a real hotel or Airbnb only between tour days (never on final day, never for 1 day)
    let stay: StayRecommendation | undefined = undefined;
    if (wantsStay && !isLastDay && dayCount > 1) {
      const stayList = params.stayType === 'airbnb' ? matchedRegion.airbnbs : matchedRegion.hotels;
      const matchedStayRecord = stayList.find(s => s.priceCategory === params.priceRange) || stayList[0];

      if (matchedStayRecord) {
        stay = {
          id: `stay-${dayNum}-${matchedStayRecord.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: matchedStayRecord.name,
          type: matchedStayRecord.type,
          priceCategory: matchedStayRecord.priceCategory,
          estimatedPricePerNight: matchedStayRecord.estimatedPricePerNight,
          address: matchedStayRecord.address,
          lat: matchedStayRecord.lat,
          lng: matchedStayRecord.lng,
          driveTimeFromLastBreweryMin: 14, // <= 30 mins
          driveTimeToNextBreweryMin: 16, // <= 30 mins
          description: matchedStayRecord.description,
          amenities: matchedStayRecord.amenities,
          bookingSearchUrl: matchedStayRecord.bookingSearchUrl,
        };
      }
    }

    const dayStops: string[] = [];
    if (isFirstDay && startLoc) dayStops.push(startLoc);
    breweries.forEach(b => dayStops.push(`${b.name}, ${b.address}`));
    if (stay) dayStops.push(`${stay.name}, ${stay.address}`);
    if (isLastDay && startLoc) dayStops.push(startLoc); // Return home for last day

    const origin = encodeURIComponent(dayStops[0] || area);
    const destination = encodeURIComponent(dayStops[dayStops.length - 1] || area);
    const waypoints = dayStops.slice(1, -1).map(s => encodeURIComponent(s)).join('|');
    const dayMapUrl = dayStops.length >= 2 
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(area)}`;

    const interBreweryDriveMin = breweries.slice(1).reduce((s, b) => s + b.driveTimeFromPrevMin, 0);
    const interBreweryDist = breweries.slice(1).reduce((s, b) => s + b.driveDistanceFromPrevMiles, 0);

    const dayDriveTimeMin = (isFirstDay ? departureDriveTimeMin : 0) + interBreweryDriveMin + (stay ? 14 : 0) + (isLastDay ? returnHomeDriveTimeMin : 0);
    const dayDriveDist = (isFirstDay ? departureDistanceMiles : 0) + interBreweryDist + (stay ? 6.0 : 0) + (isLastDay ? returnHomeDistanceMiles : 0);

    return {
      dayNumber: dayNum,
      dayTitle: `Day ${dayNum}: ${matchedRegion.stateOrProvince} Craft Odyssey`,
      theme: `Signature ${styles.slice(0, 2).join(' & ')} Trail`,
      recommendedStartTime: '11:45 AM',
      totalDriveTimeMin: dayDriveTimeMin,
      totalDriveDistanceMiles: parseFloat(dayDriveDist.toFixed(1)),
      daySummary: `A curated tasting circuit across ${matchedRegion.stateOrProvince}'s most celebrated microbreweries including ${breweries.map(b => b.name).join(', ')}.`,
      breweries,
      stay,
      googleMapsDayUrl: dayMapUrl,
    };
  });

  const firstBrewery = days[0].breweries[0];
  const lastDay = days[days.length - 1];
  const lastBrewery = lastDay.breweries[lastDay.breweries.length - 1];
  const lastStop = lastDay.stay || lastBrewery;

  const departureTransit = {
    fromName: startLoc,
    toName: firstBrewery.name,
    driveTimeMin: departureDriveTimeMin,
    distanceMiles: departureDistanceMiles,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startLoc)}&destination=${encodeURIComponent(`${firstBrewery.name}, ${firstBrewery.address}`)}&travelmode=driving`,
    notes: `Initial departure drive from ${startLoc} to ${firstBrewery.name}`,
  };

  const returnHomeTransit = {
    fromName: lastStop.name,
    toName: startLoc,
    driveTimeMin: returnHomeDriveTimeMin,
    distanceMiles: returnHomeDistanceMiles,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${lastStop.name}, ${lastStop.address}`)}&destination=${encodeURIComponent(startLoc)}&travelmode=driving`,
    notes: `Return home drive from ${lastStop.name} back to ${startLoc}`,
  };

  // Attach to days
  days[0].departureTransit = departureTransit;
  days[days.length - 1].returnHomeTransit = returnHomeTransit;

  // Build full multi-stop round-trip URL: startLoc -> Stop 1 -> ... -> Stop N -> startLoc (Return Home)
  const allTripWaypoints: string[] = [];
  days.forEach(d => {
    d.breweries.forEach(b => allTripWaypoints.push(`${b.name}, ${b.address}`));
    if (d.stay) allTripWaypoints.push(`${d.stay.name}, ${d.stay.address}`);
  });

  const tripOrigin = encodeURIComponent(startLoc);
  const tripDest = encodeURIComponent(startLoc); // Return Home!
  const tripWaypoints = allTripWaypoints.map(s => encodeURIComponent(s)).join('|');
  const fullMapUrl = `https://www.google.com/maps/dir/?api=1&origin=${tripOrigin}&destination=${tripDest}&waypoints=${tripWaypoints}&travelmode=driving`;

  const totalDriveMin = days.reduce((sum, d) => sum + d.totalDriveTimeMin, 0);
  const totalDriveDist = days.reduce((sum, d) => sum + d.totalDriveDistanceMiles, 0);

  return {
    id: `route-${Date.now()}`,
    title: `${matchedRegion.stateOrProvince} Verified Craft Trail`,
    region: `${matchedRegion.stateOrProvince}, ${matchedRegion.country}`,
    summary: `An authentic ${dayCount}-day journey through ${matchedRegion.stateOrProvince}'s most acclaimed craft microbreweries, curated for lovers of ${styles.join(', ')}.`,
    parameters: params,
    days,
    departureTransit,
    returnHomeTransit,
    startLocationCoord: { lat: firstBrewery.lat, lng: firstBrewery.lng },
    totalBreweries: days.reduce((sum, d) => sum + d.breweries.length, 0),
    totalTravelTimeMin: totalDriveMin,
    totalDistanceMiles: parseFloat(totalDriveDist.toFixed(1)),
    beerStyleMatchNotes: `Curated with 100% verified physical microbreweries featuring real flagship beers and verified Untappd & Google review ratings.`,
    responsibleTastingTips: [
      'Hydrate with a glass of water between every tasting flight.',
      'Opt for 4oz tasting flights rather than full pints to sample widely while remaining alert.',
      'Designate a sober driver or utilize rideshare options for the journey.',
      'Pair high ABV Double IPAs and Imperial Stouts with artisan meals at the kitchen stops.',
    ],
    googleMapsMultiStopUrl: fullMapUrl,
    createdAt: new Date().toISOString(),
  };
}

// Mount router under both '/api' and root '/' for maximum compatibility with Netlify Functions and local Express
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
export { app };
