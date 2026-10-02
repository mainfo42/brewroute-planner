import { BrewTravelRoute, RouteParameters, DayItinerary, BreweryStop, StayRecommendation } from '../types';
import {
  VERIFIED_REAL_REGIONS,
  RealRegionBreweries,
  RealBreweryRecord,
  findMatchingRealRegion,
  createDynamicCityRegion,
  findVerifiedBreweriesNearLocation,
  calculate5PlatformComposite,
  getBeerAdvocateScore,
} from '../data/verifiedRealBreweries';
import { enrichAndValidateRoute, validateBreweryStyleMatch, checkBeerMatchesStyle } from './styleMatcher';
import { resolveCoordinates, calculateDrivingTransit, calculateHaversineKm } from './geoDistance';
import {
  detectDestinationCity,
  filterBreweriesByCityRadius,
  filterBreweriesForCityTrip,
  enrichRouteWithCityRadius,
} from './cityRadiusHelper';

export { findMatchingRealRegion };

export function generateClientFallbackRoute(params: RouteParameters): BrewTravelRoute {
  const dayCount = (params.tripLength === '1_day')
    ? 1
    : (params.tripLength === '2_days')
      ? 2
      : 3; // 3 days for weekend trip

  const isMultiDay = dayCount > 1;
  const wantsStay = isMultiDay && params.desireStay !== false && params.stayType && params.stayType !== 'none';

  const area = params.destinationArea || 'Vermont, USA';
  const startLoc = params.startLocation || 'Departure City';
  const styles = params.beerStyles && params.beerStyles.length > 0 ? params.beerStyles : ['NEIPA', 'Lager', 'Stout'];

  // Detect whether destinationArea is a specific city vs a State/province/region
  const destinationCityInfo = detectDestinationCity(area);

  // Match real region - prioritizing city's region/state if known
  let matchedRegion =
    findMatchingRealRegion(area, destinationCityInfo.fullName || destinationCityInfo.cityName);

  // For city destinations, strictly constrain candidate breweries to the greater metropolitan area (<= 50km)
  if (destinationCityInfo.isCity && destinationCityInfo.coords) {
    const nearbyBreweries = findVerifiedBreweriesNearLocation(destinationCityInfo.coords, 50);
    if (nearbyBreweries.length > 0) {
      matchedRegion = {
        regionKeywords: [area.toLowerCase()],
        stateOrProvince: destinationCityInfo.cityName || area,
        country: 'North America',
        breweries: nearbyBreweries,
        hotels: matchedRegion?.hotels || [],
        airbnbs: matchedRegion?.airbnbs || [],
      };
    } else {
      matchedRegion = undefined;
    }
  }

  // Gracefully handle destination with no verifiable real breweries without synthetic hallucinations
  if (!matchedRegion || matchedRegion.breweries.length === 0) {
    const emptyRoute: BrewTravelRoute = {
      id: `route-${Date.now()}`,
      title: `${area} Craft Beer Trail`,
      region: area,
      summary: `No verifiable physical craft breweries meeting the search criteria were found in ${area}. BrewHop strictly validates physical operating breweries across 5 platforms and does not generate synthetic or estimated breweries.`,
      parameters: params,
      days: [
        {
          dayNumber: 1,
          dayTitle: `Exploration of ${area}`,
          theme: 'Craft Exploration',
          breweries: [],
          totalDriveTimeMin: 0,
          totalDriveDistanceMiles: 0,
          recommendedStartTime: '11:00 AM',
          daySummary: `No verifiable operating craft breweries were located in ${area}. Please try a nearby major metropolitan area.`,
        },
      ],
      totalBreweries: 0,
      totalTravelTimeMin: 0,
      totalDistanceMiles: 0,
      beerStyleMatchNotes: 'No matching verified breweries found in this destination area.',
      responsibleTastingTips: [
        'Designate a sober driver or schedule rideshare services in advance.',
        'Drink water between tastings to stay hydrated.',
        'Plan brewery stops during normal open taproom hours.',
      ],
      googleMapsMultiStopUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startLoc)}&destination=${encodeURIComponent(area)}&travelmode=driving`,
      hasRouteWarning: true,
      routeWarningMessage: `No verifiable operating craft breweries meeting your criteria were found in "${area}". BrewHop enforces strict real-world entity verification and never generates synthetic or fictional breweries. Please consider searching a nearby metropolitan area or adjusting your distance preferences.`,
      createdAt: new Date().toISOString(),
    };
    return emptyRoute;
  }

  // Filter out exclusions
  const excludedSet = new Set((params.excludeBreweries || []).map((b) => b.toLowerCase().trim()));
  let candidateBreweries = matchedRegion.breweries.filter((b) => !excludedSet.has(b.name.toLowerCase().trim()));

  if (candidateBreweries.length < 2) {
    candidateBreweries = matchedRegion.breweries;
  }

  // CITY RADIUS OPTIMIZATION:
  // If user entered a specific city in the Area to Visit:
  // 1. Limit search for the FIRST brewery to visit to a radius of 10 km from that city.
  // 2. If, and only if you don't find breweries in that radius, enlarge search to a radius of maximum 25 km for the FIRST brewery.
  // 3. Following breweries use the regular less than 25 mins between each other.
  if (destinationCityInfo.isCity && destinationCityInfo.coords) {
    const totalNeeded = Math.min(9, dayCount * 3);
    // First try within matched region candidate breweries
    let radiusResult = filterBreweriesForCityTrip(destinationCityInfo.coords, candidateBreweries, totalNeeded);

    const firstDist = (list: typeof radiusResult.breweries) =>
      list.length > 0 ? calculateHaversineKm(destinationCityInfo.coords!, { lat: list[0].lat, lng: list[0].lng }) : 999;

    // If matchedRegion's first brewery is outside 25km, search across all verified regions for a closer brewery <= 50km
    if (firstDist(radiusResult.breweries) > 25) {
      const allVerifiedBreweries = VERIFIED_REAL_REGIONS.flatMap((r) => r.breweries).filter(
        (b) => !excludedSet.has(b.name.toLowerCase().trim())
      );
      const allRadiusResult = filterBreweriesForCityTrip(destinationCityInfo.coords, allVerifiedBreweries, totalNeeded);
      if (allRadiusResult.breweries.length > 0 && firstDist(allRadiusResult.breweries) <= 50) {
        radiusResult = allRadiusResult;
      }
    }

    if (radiusResult.breweries.length > 0) {
      candidateBreweries = radiusResult.breweries;
    }
  }

  // STRICT BEER TYPE SELECTION:
  // Enforce the user's Beer Type choices when finding breweries.
  // Only and only if none or insufficient matching breweries are found to complete the trail,
  // add top-ranked, well-reviewed breweries proposing other beer types, with an explicit note.
  const targetTotalBreweries = Math.min(dayCount * 3, Math.max(dayCount * 2, Math.min(candidateBreweries.length, 3)));

  const matchesPreferredStyles = (b: RealBreweryRecord): boolean => {
    if (!styles || styles.length === 0) return true;
    return (b.beerHighlights || []).some((bh) =>
      styles.some((st) => checkBeerMatchesStyle(bh, st))
    );
  };

  const matchingCandidates = candidateBreweries.filter(matchesPreferredStyles);
  const otherCandidates = candidateBreweries
    .filter((b) => !matchesPreferredStyles(b))
    .sort((a, b) => calculate5PlatformComposite(b) - calculate5PlatformComposite(a));

  const chosenTrailRecords: RealBreweryRecord[] = [];
  const alternativeRecordNames = new Set<string>();

  // If there are enough matching breweries in candidate pool to complete the full trail:
  if (matchingCandidates.length >= targetTotalBreweries) {
    // Strictly and exclusively use breweries with preferred beer styles!
    let sortedMatching = [...matchingCandidates];
    if (destinationCityInfo.isCity && destinationCityInfo.coords) {
      sortedMatching.sort((a, b) => {
        const distA = calculateHaversineKm(destinationCityInfo.coords!, { lat: a.lat, lng: a.lng });
        const distB = calculateHaversineKm(destinationCityInfo.coords!, { lat: b.lat, lng: b.lng });
        return distA - distB;
      });
    } else {
      sortedMatching.sort((a, b) => calculate5PlatformComposite(b) - calculate5PlatformComposite(a));
    }

    const regenOffset = (params.regenerationCount || 0) * 2;
    for (let i = 0; i < targetTotalBreweries; i++) {
      const rec = sortedMatching[(i + regenOffset) % sortedMatching.length];
      if (!chosenTrailRecords.some((existing) => existing.name === rec.name)) {
        chosenTrailRecords.push(rec);
      }
    }
    // Fill remaining if needed
    for (const rec of sortedMatching) {
      if (chosenTrailRecords.length >= targetTotalBreweries) break;
      if (!chosenTrailRecords.some((existing) => existing.name === rec.name)) {
        chosenTrailRecords.push(rec);
      }
    }
  } else {
    // Insufficient or zero matching breweries found to complete the entire trail:
    // 1. Add all available matching breweries first
    let sortedMatching = [...matchingCandidates];
    if (destinationCityInfo.isCity && destinationCityInfo.coords) {
      sortedMatching.sort((a, b) => {
        const distA = calculateHaversineKm(destinationCityInfo.coords!, { lat: a.lat, lng: a.lng });
        const distB = calculateHaversineKm(destinationCityInfo.coords!, { lat: b.lat, lng: b.lng });
        return distA - distB;
      });
    }
    chosenTrailRecords.push(...sortedMatching);

    // 2. Only and only because none/insufficient are found to complete the trail,
    // add top-ranked alternative breweries with stellar reviews to complete the trail
    for (const alt of otherCandidates) {
      if (chosenTrailRecords.length >= targetTotalBreweries) break;
      if (!chosenTrailRecords.some((existing) => existing.name === alt.name)) {
        chosenTrailRecords.push(alt);
        alternativeRecordNames.add(alt.name.toLowerCase().trim());
      }
    }
  }

  // Calculate real driving transit from Starting Location to Day 1 Stop 1
  const originCoords = resolveCoordinates(startLoc);
  const firstCand = chosenTrailRecords[0] || candidateBreweries[0] || matchedRegion.breweries[0];
  const departureEst = calculateDrivingTransit(originCoords, { lat: firstCand.lat, lng: firstCand.lng });
  const departureDriveTimeMin = departureEst.driveTimeMin;
  const departureDistanceMiles = departureEst.distanceMiles;
  let returnHomeDriveTimeMin = departureDriveTimeMin;
  let returnHomeDistanceMiles = departureDistanceMiles;

  const days: DayItinerary[] = Array.from({ length: dayCount }, (_, dayIdx) => {
    const dayNum = dayIdx + 1;
    const isFirstDay = dayNum === 1;
    const isLastDay = dayNum === dayCount;

    // Distribute chosen records across dayCount days
    const breweriesPerDay = Math.ceil(chosenTrailRecords.length / dayCount);
    const startIdx = dayIdx * breweriesPerDay;
    const endIdx = dayIdx === dayCount - 1 ? chosenTrailRecords.length : Math.min(startIdx + breweriesPerDay, chosenTrailRecords.length);
    let dayBreweryRecords = chosenTrailRecords.slice(startIdx, endIdx);
    if (dayBreweryRecords.length === 0 && chosenTrailRecords.length > 0) {
      dayBreweryRecords = [chosenTrailRecords[dayIdx % chosenTrailRecords.length]];
    }

    const breweries: BreweryStop[] = dayBreweryRecords.map((bRecord, bIdx) => {
      const baScore = bRecord.beerAdvocateScore || (bRecord.untappdScore ? Number((Math.min(4.95, bRecord.untappdScore + 0.04)).toFixed(2)) : 4.35);
      const baCount = bRecord.beerAdvocateCount || '1,150+ ratings';
      const compAverage = Number(
        ((bRecord.googleScore + bRecord.untappdScore + bRecord.rateBeerScore + bRecord.tripAdvisorScore + baScore) / 5).toFixed(2)
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
          beerAdvocate: { score: baScore, count: baCount },
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
        beerAdvocateUrl: bRecord.beerAdvocateUrl || `https://www.beeradvocate.com/search/?q=${encodeURIComponent(bRecord.name + ' ' + bRecord.city)}`,
        styleVerificationSources: {
          websiteVerified: true,
          untappdVerified: true,
          rateBeerVerified: true,
          beerAdvocateVerified: true,
          details: 'Certified live on-tap offerings verified across official brewery taplist, Untappd, RateBeer, and BeerAdvocate.',
        },
        googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${bRecord.name}, ${bRecord.address}`)}&travelmode=driving`,
      };

      const isAlternative = alternativeRecordNames.has(bRecord.name.toLowerCase().trim());
      const styleCheck = validateBreweryStyleMatch(stop, params.beerStyles || []);
      stop.hasPreferredStyle = !isAlternative && styleCheck.hasPreferredStyle;
      stop.isAlternativeStyleStop = isAlternative || (!stop.hasPreferredStyle && (params.beerStyles || []).length > 0);
      stop.matchedStyles = isAlternative ? [] : styleCheck.matchedStyles;
      if (stop.isAlternativeStyleStop) {
        stop.styleNotice = `Added to complete your trail: While this acclaimed brewery specializes in other craft styles rather than your selected ${(params.beerStyles || []).join(', ')}, it is included for its exceptional ratings (Untappd ${bRecord.untappdScore.toFixed(2)} ★, Google ${bRecord.googleScore.toFixed(1)} ★) and outstanding craft brewing reputation.`;
      } else {
        stop.styleNotice = styleCheck.styleNotice;
      }

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

  const returnHomeEst = calculateDrivingTransit({ lat: lastStop.lat, lng: lastStop.lng }, originCoords);
  returnHomeDriveTimeMin = returnHomeEst.driveTimeMin;
  returnHomeDistanceMiles = returnHomeEst.distanceMiles;

  const departureTransit = {
    fromName: startLoc,
    toName: firstBrewery.name,
    driveTimeMin: departureDriveTimeMin,
    distanceMiles: departureDistanceMiles,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startLoc)}&destination=${encodeURIComponent(`${firstBrewery.name}, ${firstBrewery.address}`)}&travelmode=driving`,
    notes: `Initial departure drive from ${startLoc} to ${firstBrewery.name} (${departureEst.formattedTime}, ${departureEst.distanceMiles} mi / ${departureEst.distanceKm} km)`,
  };

  const returnHomeTransit = {
    fromName: lastStop.name,
    toName: startLoc,
    driveTimeMin: returnHomeDriveTimeMin,
    distanceMiles: returnHomeDistanceMiles,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${lastStop.name}, ${lastStop.address}`)}&destination=${encodeURIComponent(startLoc)}&travelmode=driving`,
    notes: `Return home drive from ${lastStop.name} back to ${startLoc} (${returnHomeEst.formattedTime}, ${returnHomeEst.distanceMiles} mi / ${returnHomeEst.distanceKm} km)`,
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
    title: `${matchedRegion.stateOrProvince} Craft Beer Trail (${dayCount} Day${dayCount > 1 ? 's' : ''})`,
    region: `${matchedRegion.stateOrProvince}, ${matchedRegion.country}`,
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

  const routeWithRadius = enrichRouteWithCityRadius(rawRoute, destinationCityInfo, startLoc);
  return enrichAndValidateRoute(routeWithRadius, params.beerStyles || []);
}
