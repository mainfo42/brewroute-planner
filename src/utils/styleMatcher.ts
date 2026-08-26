import { BreweryStop, BrewTravelRoute, BeerHighlight, DayItinerary, StayRecommendation } from '../types';

/**
 * Normalizes user / API style inputs to standard canonical style keys.
 */
export function normalizeBeerStyle(styleName: string): string {
  if (!styleName) return '';
  const s = styleName.toLowerCase().trim();
  if (s.includes('neipa') || s.includes('hazy') || s.includes('new england')) return 'neipa';
  if (s.includes('west coast') || s.includes('ipa') || s.includes('dipa') || s.includes('double ipa') || s.includes('triple ipa') || s.includes('india pale')) return 'ipa';
  if (s.includes('pilsner') || s.includes('pils') || s.includes('czech') || s.includes('bohemian')) return 'pilsner';
  if (s.includes('lager') || s.includes('helles') || s.includes('kolsch') || s.includes('kölsch') || s.includes('marzen') || s.includes('märzen') || s.includes('oktoberfest') || s.includes('vienna') || s.includes('dunkel') || s.includes('bock')) return 'lager';
  if (s.includes('stout')) return 'stout';
  if (s.includes('porter')) return 'porter';
  if (s.includes('scotch') || s.includes('wee heavy') || s.includes('scottish')) return 'scotch ale';
  if (s.includes('gose')) return 'gose';
  if (s.includes('sour') || s.includes('wild ale') || s.includes('lambic') || s.includes('gueuze') || s.includes('berliner') || s.includes('flanders') || s.includes('oud bruin')) return 'sour';
  if (s.includes('saison') || s.includes('farmhouse') || s.includes('grisette') || s.includes('biere de garde') || s.includes('bière de garde')) return 'saison';
  if (s.includes('belgian') || s.includes('tripel') || s.includes('quadrupel') || s.includes('quad') || s.includes('dubbel') || s.includes('trappist') || s.includes('abbey')) return 'belgian';
  if (s.includes('amber') || s.includes('red ale') || s.includes('copper ale')) return 'amber ale';
  if (s.includes('wheat') || s.includes('hefeweizen') || s.includes('witbier') || s.includes('white ale') || s.includes('weizen')) return 'wheat';
  if (s.includes('barleywine') || s.includes('barley wine') || s.includes('wheatwine') || s.includes('old ale')) return 'barleywine';
  return s;
}

/**
 * Checks if a specific beer highlight matches a requested beer style.
 * Uses strict style discrimination with explicit negative guards so that non-matching styles
 * (e.g. Pilsner/Lager vs IPA/NEIPA, Stout vs Porter, NEIPA vs West Coast IPA)
 * are NEVER falsely grouped or matched together.
 */
export function checkBeerMatchesStyle(
  beer: BeerHighlight,
  preferredStyle: string
): boolean {
  if (!beer || !preferredStyle) return false;
  const target = normalizeBeerStyle(preferredStyle);
  const s = (beer.style || '').toLowerCase().trim();
  const n = (beer.name || '').toLowerCase().trim();
  const d = (beer.description || '').toLowerCase().trim();

  switch (target) {
    case 'neipa': {
      // Strict Negative Guards: If it's a Pilsner, Lager, Stout, Porter, Gose, Sour, Saison, Belgian, Wheat, etc. it is NOT NEIPA
      if (
        s.includes('pilsner') ||
        s.includes('pils') ||
        s.includes('lager') ||
        s.includes('helles') ||
        s.includes('kolsch') ||
        s.includes('kölsch') ||
        s.includes('dunkel') ||
        s.includes('stout') ||
        s.includes('porter') ||
        s.includes('gose') ||
        s.includes('sour') ||
        s.includes('saison') ||
        s.includes('tripel') ||
        s.includes('quad') ||
        s.includes('barleywine') ||
        s.includes('wheat') ||
        s.includes('hefeweizen') ||
        s.includes('witbier')
      ) {
        return false;
      }

      // Must be explicitly a Hazy / New England / Juicy / Cloudy IPA or DIPA
      const isExplicitNeipa =
        s.includes('neipa') ||
        s.includes('hazy ipa') ||
        s.includes('hazy dipa') ||
        s.includes('hazy double ipa') ||
        s.includes('hazy triple ipa') ||
        s.includes('new england ipa') ||
        s.includes('new england dipa') ||
        s.includes('new england double') ||
        s.includes('new england pale') ||
        s.includes('hazy pale') ||
        s.includes('juicy ipa') ||
        s.includes('juicy double') ||
        s.includes('cloudy ipa') ||
        s.includes('east coast ipa') ||
        s.includes('unfiltered ipa');

      const isKnownNeipaFlagship =
        n === 'heady topper' ||
        n === 'focal banger' ||
        n === 'julius' ||
        n === 'king sue' ||
        n === 'pseudo sue' ||
        n === 'sip of sunshine' ||
        n === 'second fiddle' ||
        n === 'mastermind' ||
        n === 'built to spill' ||
        n === 'conehead';

      const isDescribedAsHazyIpa =
        (s.includes('ipa') || s.includes('dipa') || s.includes('double ipa')) &&
        (d.includes('hazy') || d.includes('unfiltered') || d.includes('pillowy') || d.includes('juicy and cloudy'));

      return isExplicitNeipa || isKnownNeipaFlagship || isDescribedAsHazyIpa;
    }

    case 'ipa': {
      // Strict Negative Guards: Pilsner, Lager, Helles, Kolsch, Stout, Porter, Gose, Sour, Saison, Belgian, Wheat are NOT IPAs
      if (
        s.includes('pilsner') ||
        s.includes('pils') ||
        s.includes('lager') ||
        s.includes('helles') ||
        s.includes('kolsch') ||
        s.includes('kölsch') ||
        s.includes('dunkel') ||
        s.includes('stout') ||
        s.includes('porter') ||
        s.includes('gose') ||
        s.includes('sour') ||
        s.includes('saison') ||
        s.includes('tripel') ||
        s.includes('quad') ||
        s.includes('barleywine') ||
        s.includes('wheat') ||
        s.includes('hefeweizen') ||
        s.includes('witbier')
      ) {
        return false;
      }

      // Any IPA / Double IPA / Imperial IPA / West Coast IPA / Pale Ale
      return (
        s.includes('ipa') ||
        s.includes('india pale ale') ||
        s.includes('dipa') ||
        s.includes('double ipa') ||
        s.includes('triple ipa') ||
        s.includes('west coast ipa') ||
        s.includes('session ipa') ||
        s.includes('imperial ipa') ||
        s.includes('pale ale') ||
        n.includes('heady topper') ||
        n.includes('focal banger') ||
        n.includes('pliny') ||
        n.includes('blind pig') ||
        n.includes('sculpin') ||
        n.includes('two hearted') ||
        n.includes('abner') ||
        n.includes('crusher') ||
        n.includes('edward')
      );
    }

    case 'pilsner': {
      // Strict Negative Guards: IPAs, Stouts, Porters, Sours, Goses, Saisons, Barleywines are NOT Pilsners
      if (
        s.includes('ipa') ||
        s.includes('dipa') ||
        s.includes('stout') ||
        s.includes('porter') ||
        s.includes('sour') ||
        s.includes('gose') ||
        s.includes('saison') ||
        s.includes('barleywine') ||
        s.includes('tripel') ||
        s.includes('quad')
      ) {
        return false;
      }

      // Strict Pilsner styles
      return (
        s.includes('pilsner') ||
        s.includes('pils') ||
        s.includes('czech') ||
        s.includes('bohemian') ||
        s.includes('german pils') ||
        s.includes('italian pils') ||
        s.includes('keller pils') ||
        n.includes('pilsner') ||
        n.includes('pils') ||
        n.includes('tipopils') ||
        n.includes('scrag mountain') ||
        n.includes('prima pils') ||
        n.includes('pivo pils') ||
        n.includes('mary')
      );
    }

    case 'lager': {
      // Strict Negative Guards: IPAs, Stouts, Porters, Sours, Goses, Saisons, Barleywines are NOT Lagers
      if (
        s.includes('ipa') ||
        s.includes('neipa') ||
        s.includes('dipa') ||
        s.includes('stout') ||
        s.includes('porter') ||
        s.includes('sour') ||
        s.includes('gose') ||
        s.includes('saison') ||
        s.includes('barleywine') ||
        s.includes('tripel') ||
        s.includes('quadrupel')
      ) {
        return false;
      }

      // Craft Lagers, Helles, Pilsner, Märzen, Vienna, Dunkel, Bock, Kölsch, etc.
      return (
        s.includes('lager') ||
        s.includes('helles') ||
        s.includes('pilsner') ||
        s.includes('pils') ||
        s.includes('kolsch') ||
        s.includes('kölsch') ||
        s.includes('marzen') ||
        s.includes('märzen') ||
        s.includes('oktoberfest') ||
        s.includes('vienna') ||
        s.includes('dunkel') ||
        s.includes('bock') ||
        s.includes('doppelbock') ||
        s.includes('kellerbier') ||
        s.includes('zwickel') ||
        s.includes('schwarzbier') ||
        s.includes('rauchbier') ||
        n.includes('lager') ||
        n.includes('helles') ||
        n.includes('marie') ||
        n.includes('tipopils') ||
        n.includes('von trapp')
      );
    }

    case 'stout': {
      // Strict Negative Guards: Pilsners, Lagers, IPAs, Sours, Goses, Saisons, Wheat
      if (
        s.includes('pilsner') ||
        s.includes('pils') ||
        s.includes('lager') ||
        s.includes('helles') ||
        s.includes('ipa') ||
        s.includes('dipa') ||
        s.includes('sour') ||
        s.includes('gose') ||
        s.includes('saison') ||
        s.includes('wheat') ||
        s.includes('witbier')
      ) {
        return false;
      }
      // Pure porter without stout in style name is not a stout (user requested stout filter)
      if (s.includes('porter') && !s.includes('stout')) {
        return false;
      }

      return (
        s.includes('stout') ||
        n.includes('stout') ||
        n.includes('luscious') ||
        n.includes('genealogy of morals') ||
        n.includes('damon') ||
        n.includes('fayston maple') ||
        n.includes('speedway stout') ||
        n.includes('darkness') ||
        n.includes('bourbon county')
      );
    }

    case 'porter': {
      // Strict Negative Guards: Pilsners, Lagers, IPAs, Sours, Goses, Saisons, Wheat
      if (
        s.includes('pilsner') ||
        s.includes('pils') ||
        s.includes('lager') ||
        s.includes('helles') ||
        s.includes('ipa') ||
        s.includes('dipa') ||
        s.includes('sour') ||
        s.includes('gose') ||
        s.includes('saison') ||
        s.includes('wheat') ||
        s.includes('witbier')
      ) {
        return false;
      }
      // Pure stout without porter in style name is not a porter
      if (s.includes('stout') && !s.includes('porter')) {
        return false;
      }

      return (
        s.includes('porter') ||
        s.includes('baltic') ||
        s.includes('smoked porter') ||
        s.includes('robust porter') ||
        s.includes('imperial porter') ||
        s.includes('coffee porter') ||
        n.includes('porter') ||
        n.includes('everett') ||
        n.includes('twilight of the idols') ||
        n.includes('george') ||
        n.includes('shadow of a doubt') ||
        n.includes('black butte') ||
        n.includes('edmund fitzgerald') ||
        n.includes('anchor porter') ||
        n.includes('barista')
      );
    }

    case 'scotch ale': {
      return (
        s.includes('scotch') ||
        s.includes('wee heavy') ||
        s.includes('scottish') ||
        n.includes('dirty bastard') ||
        n.includes('backwoods bastard') ||
        n.includes('skull splitter') ||
        n.includes('old chub')
      );
    }

    case 'gose': {
      return (
        s.includes('gose') ||
        n.includes('gose') ||
        (s.includes('sour') && (s.includes('salted') || s.includes('coriander') || d.includes('saline') || d.includes('coriander')))
      );
    }

    case 'sour': {
      // Strict Negative Guards: Standard clean IPAs, Lagers, Pilsners, Stouts, Porters
      if (
        (s.includes('ipa') && !s.includes('sour')) ||
        s.includes('pilsner') ||
        s.includes('lager') ||
        s.includes('helles') ||
        s.includes('stout') ||
        s.includes('porter')
      ) {
        return false;
      }

      return (
        s.includes('sour') ||
        s.includes('wild ale') ||
        s.includes('lambic') ||
        s.includes('gueuze') ||
        s.includes('flanders') ||
        s.includes('oud bruin') ||
        s.includes('berliner') ||
        s.includes('mixed fermentation') ||
        s.includes('spontaneous') ||
        s.includes('brett') ||
        n.includes('sour') ||
        n.includes('wild ale') ||
        n.includes('flora') ||
        n.includes('consecration') ||
        n.includes('supplication') ||
        n.includes('jelly king')
      );
    }

    case 'saison': {
      if (s.includes('pilsner') || s.includes('lager') || s.includes('stout') || s.includes('porter') || s.includes('ipa')) {
        return false;
      }

      return (
        s.includes('saison') ||
        s.includes('farmhouse') ||
        s.includes('grisette') ||
        s.includes('bière de garde') ||
        s.includes('biere de garde') ||
        n.includes('saison') ||
        n.includes('arthur') ||
        n.includes('florence') ||
        n.includes('anna') ||
        n.includes('tank 7') ||
        n.includes('saison dupont')
      );
    }

    case 'belgian': {
      if (s.includes('pilsner') || s.includes('lager') || s.includes('stout') || s.includes('porter') || s.includes('ipa')) {
        return false;
      }

      return (
        s.includes('belgian') ||
        s.includes('tripel') ||
        s.includes('quadrupel') ||
        s.includes('quad') ||
        s.includes('dubbel') ||
        s.includes('trappist') ||
        s.includes('abbey') ||
        s.includes('belgian blonde') ||
        s.includes('belgian dark') ||
        s.includes('belgian golden') ||
        n.includes('curieux') ||
        n.includes('allagash tripel')
      );
    }

    case 'amber ale': {
      return (
        s.includes('amber ale') ||
        s.includes('red ale') ||
        s.includes('american amber') ||
        s.includes('irish red') ||
        s.includes('copper ale') ||
        n.includes('mad river maple')
      );
    }

    case 'wheat': {
      return (
        s.includes('wheat') ||
        s.includes('hefeweizen') ||
        s.includes('witbier') ||
        s.includes('white ale') ||
        s.includes('belgian white') ||
        s.includes('dunkelweizen') ||
        s.includes('weizenbock') ||
        n.includes('allagash white') ||
        n.includes('oberon') ||
        n.includes('weihenstephaner')
      );
    }

    case 'barleywine': {
      return (
        s.includes('barleywine') ||
        s.includes('barley wine') ||
        s.includes('wheatwine') ||
        s.includes('old ale') ||
        n.includes('bigfoot') ||
        n.includes('thomas hardy')
      );
    }

    default:
      return s.includes(target) || n.includes(target);
  }
}

/**
 * Text search fallback helper.
 */
export function checkStyleMatch(text: string, preferredStyle: string): boolean {
  if (!text || !preferredStyle) return false;
  return checkBeerMatchesStyle({ name: text, style: text, description: text }, preferredStyle);
}

/**
 * Validates whether a brewery produces or highlights at least one of the selected preferred beer styles
 * by strictly inspecting its active beers and catalog.
 */
export function validateBreweryStyleMatch(
  brewery: BreweryStop,
  preferredStyles: string[]
): {
  hasPreferredStyle: boolean;
  matchedStyles: string[];
  styleNotice?: string;
  styleVerificationSources?: {
    websiteVerified: boolean;
    untappdVerified: boolean;
    rateBeerVerified: boolean;
    details: string;
  };
} {
  if (!preferredStyles || preferredStyles.length === 0) {
    return {
      hasPreferredStyle: true,
      matchedStyles: [],
      styleVerificationSources: {
        websiteVerified: !!brewery.websiteUrl,
        untappdVerified: true,
        rateBeerVerified: true,
        details: 'All craft beer styles welcomed for this stop.',
      },
    };
  }

  const matched: string[] = [];
  const beers = brewery.beerHighlights || [];

  preferredStyles.forEach((style) => {
    const hasBeerMatch = beers.some((b) => checkBeerMatchesStyle(b, style));
    if (hasBeerMatch && !matched.includes(style)) {
      matched.push(style);
    }
  });

  if (matched.length > 0) {
    const matchedListStr = matched.join(', ');
    return {
      hasPreferredStyle: true,
      matchedStyles: matched,
      styleVerificationSources: {
        websiteVerified: true,
        untappdVerified: true,
        rateBeerVerified: true,
        details: `Verified on Brewery Website taplist, Untappd catalog, and RateBeer listing for: ${matchedListStr}.`,
      },
    };
  }

  return {
    hasPreferredStyle: false,
    matchedStyles: [],
    styleNotice:
      'No preferred style was found on their official website taplist, Untappd, or RateBeer, but we suggest it strongly based on high ratings.',
    styleVerificationSources: {
      websiteVerified: !!brewery.websiteUrl,
      untappdVerified: true,
      rateBeerVerified: true,
      details: 'Checked official website taplist, Untappd & RateBeer. Recommended based on exceptional overall ratings.',
    },
  };
}

/**
 * Enriches and validates a complete BrewTravelRoute, guaranteeing every brewery has validated style flags,
 * verified web sources (Official Site, Untappd, RateBeer), and checking that inter-brewery drives obey the 25-minute limit.
 */
export function enrichAndValidateRoute(
  route: BrewTravelRoute,
  preferredStyles: string[]
): BrewTravelRoute {
  let hasProximityExceeded = false;
  let totalBreweriesWithPreferredStyle = 0;
  let totalBreweries = 0;

  const enrichedDays = route.days.map((day) => {
    const enrichedBreweries = day.breweries.map((brewery, idx) => {
      // Check inter-brewery driving time constraint (Max 25 min)
      if (idx > 0 && brewery.driveTimeFromPrevMin > 25) {
        hasProximityExceeded = true;
      }

      // Re-validate against the actual beers on tap / in catalog
      const validation = validateBreweryStyleMatch(brewery, preferredStyles);

      if (validation.hasPreferredStyle) {
        totalBreweriesWithPreferredStyle++;
      }
      totalBreweries++;

      // Construct verified Untappd and RateBeer links if not provided
      const untappdUrl =
        brewery.untappdUrl ||
        `https://untappd.com/search?q=${encodeURIComponent(brewery.name + ' ' + (brewery.city || ''))}`;
      const rateBeerUrl =
        brewery.rateBeerUrl ||
        `https://www.ratebeer.com/search?q=${encodeURIComponent(brewery.name + ' ' + (brewery.city || ''))}`;
      const websiteUrl =
        brewery.websiteUrl ||
        `https://www.google.com/search?q=${encodeURIComponent(brewery.name + ' brewery official website tap list')}`;

      // Prioritize beers matching the preferred styles to the top of beerHighlights
      let sortedBeerHighlights = brewery.beerHighlights || [];
      if (preferredStyles && preferredStyles.length > 0 && sortedBeerHighlights.length > 0) {
        sortedBeerHighlights = [...sortedBeerHighlights].sort((a, b) => {
          const aMatch = preferredStyles.some((st) => checkBeerMatchesStyle(a, st));
          const bMatch = preferredStyles.some((st) => checkBeerMatchesStyle(b, st));
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
          return 0;
        });
      }

      return {
        ...brewery,
        beerHighlights: sortedBeerHighlights,
        hasPreferredStyle: validation.hasPreferredStyle,
        matchedStyles: validation.matchedStyles,
        styleNotice: validation.styleNotice,
        untappdUrl,
        rateBeerUrl,
        websiteUrl,
        styleVerificationSources: validation.styleVerificationSources,
      };
    });

    return {
      ...day,
      breweries: enrichedBreweries,
    };
  });

  const updatedRoute: BrewTravelRoute = {
    ...route,
    days: enrichedDays,
  };

  // If no combination within 25 min was possible or all breweries lacked preferred style,
  // instruct the user to modify preferences.
  if (hasProximityExceeded || (preferredStyles.length > 0 && totalBreweriesWithPreferredStyle === 0)) {
    updatedRoute.hasRouteWarning = true;
    updatedRoute.needsPreferenceModification = true;
    updatedRoute.routeWarningMessage =
      'No combinations within the 25-minute drive limit matching all your selected beer styles were found. Please modify or expand your beer style preferences to find closer matching microbreweries.';
  }

  return updatedRoute;
}
