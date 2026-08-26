import { BrewTravelRoute, RouteParameters, DayItinerary, BreweryStop, StayRecommendation } from '../types';
import { VERIFIED_REAL_REGIONS, RealRegionBreweries, RealBreweryRecord } from '../data/verifiedRealBreweries';
import { enrichAndValidateRoute, validateBreweryStyleMatch, checkBeerMatchesStyle } from './styleMatcher';

export function findMatchingRealRegion(areaQuery: string): RealRegionBreweries | undefined {
  if (!areaQuery) return undefined;
  const q = areaQuery.toLowerCase();
  for (const region of VERIFIED_REAL_REGIONS) {
    if (region.regionKeywords.some(kw => q.includes(kw))) {
      return region;
    }
  }
  return undefined;
}

export function generateClientFallbackRoute(params: RouteParameters): BrewTravelRoute {
  const dayCount = (params.tripLength === 'few_hours' || params.tripLength === '1_day')
    ? 1
    : (params.tripLength === '2_days')
      ? 2
      : 3; // 3 days for weekend trip

  const isMultiDay = dayCount > 1;
  const wantsStay = isMultiDay && params.desireStay !== false && params.stayType && params.stayType !== 'none';

  const area = params.destinationArea || 'Vermont, USA';
  const startLoc = params.startLocation || 'Departure City';
  const styles = params.beerStyles && params.beerStyles.length > 0 ? params.beerStyles : ['NEIPA', 'Lager', 'Stout'];

  // Match real region
  const matchedRegion = findMatchingRealRegion(area) || VERIFIED_REAL_REGIONS[0];

  // Filter out exclusions
  const excludedSet = new Set((params.excludeBreweries || []).map((b) => b.toLowerCase().trim()));
  let candidateBreweries = matchedRegion.breweries.filter((b) => !excludedSet.has(b.name.toLowerCase().trim()));

  if (candidateBreweries.length < 2) {
    candidateBreweries = matchedRegion.breweries;
  }

  // Sort candidate breweries prioritizing matching styles
  if (params.beerStyles && params.beerStyles.length > 0) {
    candidateBreweries = [...candidateBreweries].sort((a, b) => {
      const aMatches = (a.beerHighlights || []).some((bh) =>
        params.beerStyles.some((st) => checkBeerMatchesStyle(bh, st))
      );
      const bMatches = (b.beerHighlights || []).some((bh) =>
        params.beerStyles.some((st) => checkBeerMatchesStyle(bh, st))
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

    // Pick 2-3 real breweries per day from the candidate list (strictly max 3)
    const startIndex = (dayIdx * 3 + regenOffset) % candidateBreweries.length;
    const dayBreweryRecords: RealBreweryRecord[] = [];
    const breweriesPerDay = Math.min(3, Math.max(2, candidateBreweries.length - dayBreweryRecords.length));

    for (let i = 0; i < breweriesPerDay; i++) {
      const bRecord = candidateBreweries[(startIndex + i) % candidateBreweries.length];
      if (!dayBreweryRecords.some((existing) => existing.name === bRecord.name)) {
        dayBreweryRecords.push(bRecord);
      }
    }

    const breweries: BreweryStop[] = dayBreweryRecords.map((bRecord, bIdx) => {
      const compAverage = Number(
        ((bRecord.googleScore + bRecord.untappdScore + bRecord.rateBeerScore + bRecord.tripAdvisorScore) / 4).toFixed(2)
      );
      const driveTime = bIdx === 0 ? 0 : 12 + bIdx * 3;
      const driveDist = bIdx === 0 ? 0 : 4.5 + bIdx * 1.5;

      const stop: BreweryStop = {
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

      const styleCheck = validateBreweryStyleMatch(stop, params.beerStyles || []);
      stop.hasPreferredStyle = styleCheck.hasPreferredStyle;
      stop.matchedStyles = styleCheck.matchedStyles;
      stop.styleNotice = styleCheck.styleNotice;

      return stop;
    });

    // Stay recommendation only between active tour days (never on final day, never for 1-day trip)
    let stay: StayRecommendation | undefined = undefined;
    if (wantsStay && !isLastDay && dayCount > 1) {
      const stayList = params.stayType === 'airbnb' ? matchedRegion.airbnbs : matchedRegion.hotels;
      const matchedStayRecord = (stayList && stayList.find((s) => s.priceCategory === params.priceRange)) || (stayList && stayList[0]);

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
          driveTimeFromLastBreweryMin: 14,
          driveTimeToNextBreweryMin: 16,
          description: matchedStayRecord.description,
          amenities: matchedStayRecord.amenities,
          bookingSearchUrl: matchedStayRecord.bookingSearchUrl,
        };
      }
    }

    const dayStops: string[] = [];
    if (isFirstDay && startLoc) dayStops.push(startLoc);
    breweries.forEach((b) => dayStops.push(`${b.name}, ${b.address}`));
    if (stay) dayStops.push(`${stay.name}, ${stay.address}`);
    if (isLastDay && startLoc) dayStops.push(startLoc);

    const origin = encodeURIComponent(dayStops[0] || area);
    const destination = encodeURIComponent(dayStops[dayStops.length - 1] || area);
    const waypoints = dayStops.slice(1, -1).map((s) => encodeURIComponent(s)).join('|');
    const dayMapUrl =
      dayStops.length >= 2
        ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(area)}`;

    const interBreweryDriveMin = breweries.slice(1).reduce((s, b) => s + b.driveTimeFromPrevMin, 0);
    const interBreweryDist = breweries.slice(1).reduce((s, b) => s + b.driveDistanceFromPrevMiles, 0);

    const dayDriveTimeMin =
      (isFirstDay ? departureDriveTimeMin : 0) +
      interBreweryDriveMin +
      (stay ? 14 : 0) +
      (isLastDay ? returnHomeDriveTimeMin : 0);
    const dayDriveDist =
      (isFirstDay ? departureDistanceMiles : 0) +
      interBreweryDist +
      (stay ? 6.0 : 0) +
      (isLastDay ? returnHomeDistanceMiles : 0);

    return {
      dayNumber: dayNum,
      dayTitle: `Day ${dayNum}: ${matchedRegion.stateOrProvince} Craft Odyssey`,
      theme: `Signature ${styles.slice(0, 2).join(' & ')} Circuit`,
      recommendedStartTime: '11:45 AM',
      totalDriveTimeMin: dayDriveTimeMin,
      totalDriveDistanceMiles: parseFloat(dayDriveDist.toFixed(1)),
      daySummary: `A curated tasting route visiting ${breweries.map((b) => b.name).join(', ')}.`,
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

  days[0].departureTransit = departureTransit;
  days[days.length - 1].returnHomeTransit = returnHomeTransit;

  const allTripWaypoints: string[] = [];
  days.forEach((d) => {
    d.breweries.forEach((b) => {
      allTripWaypoints.push(`${b.name}, ${b.address}`);
    });
    if (d.stay) {
      allTripWaypoints.push(`${d.stay.name}, ${d.stay.address}`);
    }
  });

  const totalBreweriesCount = days.reduce((acc, d) => acc + d.breweries.length, 0);

  const fullMultiStopUrl =
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startLoc)}&destination=${encodeURIComponent(startLoc)}&waypoints=${allTripWaypoints.map((w) => encodeURIComponent(w)).join('|')}&travelmode=driving`;

  const rawRoute: BrewTravelRoute = {
    id: `route-${Date.now()}`,
    title: `${matchedRegion.stateOrProvince} Microbrewery Tour (${dayCount} Day${dayCount > 1 ? 's' : ''})`,
    region: matchedRegion.stateOrProvince,
    summary: `A high-acclaim ${dayCount}-day itinerary exploring ${totalBreweriesCount} top microbreweries in ${matchedRegion.stateOrProvince}.`,
    totalBreweries: totalBreweriesCount,
    totalTravelTimeMin: days.reduce((acc, d) => acc + d.totalDriveTimeMin, 0),
    totalDistanceMiles: parseFloat(days.reduce((acc, d) => acc + d.totalDriveDistanceMiles, 0).toFixed(1)),
    beerStyleMatchNotes: `Curated circuit aligned with your preferred styles (${styles.join(', ')}) across top-rated local microbreweries.`,
    departureTransit,
    returnHomeTransit,
    days,
    googleMapsMultiStopUrl: fullMultiStopUrl,
    responsibleTastingTips: [
      'Appoint a designated sober driver or arrange local rideshare / shuttle between stops.',
      'Order 4-ounce tasting flights rather than full pints to sample responsibly.',
      'Drink one full glass of water for every craft beer taster.',
      'Enjoy artisan food pairings and take generous breaks between visits.',
    ],
    parameters: params,
    createdAt: new Date().toISOString(),
  };

  return enrichAndValidateRoute(rawRoute, params.beerStyles || []);
}
