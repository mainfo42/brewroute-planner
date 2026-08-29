export type TripDuration = '1_day' | '2_days' | 'weekend';

export type StayType = 'none' | 'hotel' | 'airbnb';

export type PriceRange = 'under_100' | '100_to_200' | 'over_200';

export type ColorThemeVariant = 'hop_amber' | 'roasted_copper' | 'hazy_citrus' | 'bourbon_oak';

export interface RouteParameters {
  startLocation: string;
  destinationArea: string;
  beerStyles: string[];
  tripLength: TripDuration;
  desireStay?: boolean;
  stayType?: StayType;
  priceRange?: PriceRange;
  excludeBreweries?: string[];
  regenerationCount?: number;
  startLocationCoord?: { lat: number; lng: number };
}

export interface ReviewRatings {
  google: { score: number; count?: string };
  untappd: { score: number; count?: string };
  rateBeer: { score: number; count?: string };
  tripAdvisor: { score: number; count?: string };
  compositeAverage?: number; // Mathematical average across the 4 platforms
}

export interface BeerHighlight {
  name: string;
  style: string;
  abv?: string;
  description: string;
}

export interface BreweryStop {
  id: string;
  name: string;
  tagline?: string;
  address: string;
  city: string;
  state?: string;
  lat: number;
  lng: number;
  driveTimeFromPrevMin: number; // Max 25 min rule between breweries
  driveDistanceFromPrevMiles: number;
  ratings: ReviewRatings;
  beerHighlights: BeerHighlight[];
  hasPreferredStyle?: boolean; // Validates if brewery features at least one selected style
  styleNotice?: string; // Message if no preferred style was found for this brewery
  matchedStyles?: string[]; // Styles that matched the user's preferences
  foodHighlights: string;
  atmosphere: string;
  suggestedDurationMin: number;
  bestTimeToVisit: string;
  websiteUrl?: string;
  untappdUrl?: string;
  rateBeerUrl?: string;
  taplistUrl?: string;
  styleVerificationSources?: {
    websiteVerified?: boolean;
    untappdVerified?: boolean;
    rateBeerVerified?: boolean;
    details?: string;
  };
  googleMapsUrl?: string;
  imageUrl?: string;
  photoCaption?: string;
  visited?: boolean;
  userNotes?: string;
  userRating?: number;
}

export interface StayRecommendation {
  id: string;
  name: string;
  type: 'hotel' | 'airbnb';
  priceCategory: PriceRange;
  estimatedPricePerNight: string;
  address: string;
  lat: number;
  lng: number;
  driveTimeFromLastBreweryMin: number; // Max 30 min rule
  driveTimeToNextBreweryMin: number; // Max 30 min rule
  description: string;
  amenities: string[];
  bookingSearchUrl?: string;
}

export interface TransitLeg {
  fromName: string;
  toName: string;
  driveTimeMin: number;
  distanceMiles: number;
  directionsUrl?: string;
  notes?: string;
}

export interface DayItinerary {
  dayNumber: number;
  dayTitle: string;
  theme: string;
  breweries: BreweryStop[]; // Maximum 3 per day
  stay?: StayRecommendation;
  departureTransit?: TransitLeg; // On Day 1: transit from start location to first brewery
  returnHomeTransit?: TransitLeg; // On final Day: transit from last spot back to start location
  googleMapsDayUrl?: string;
  totalDriveTimeMin: number; // Includes start location departure and return home drive
  totalDriveDistanceMiles: number;
  recommendedStartTime: string;
  daySummary: string;
}

export interface BrewTravelRoute {
  id: string;
  title: string;
  region: string;
  summary: string;
  parameters: RouteParameters;
  days: DayItinerary[];
  departureTransit?: TransitLeg; // Starting location -> 1st brewery
  returnHomeTransit?: TransitLeg; // Last visited spot -> Return Home (start location)
  startLocationCoord?: { lat: number; lng: number };
  totalBreweries: number;
  totalTravelTimeMin: number; // Fully includes starting drive, inter-brewery drives, and return home drive
  totalDistanceMiles: number; // Fully includes start leg and return home leg
  beerStyleMatchNotes: string;
  responsibleTastingTips: string[];
  googleMapsMultiStopUrl: string; // Round trip: startLocation -> all stops -> startLocation (Return Home)
  hasRouteWarning?: boolean;
  routeWarningMessage?: string;
  needsPreferenceModification?: boolean;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
}

export interface SavedItinerary {
  id: string;
  userId: string;
  route: BrewTravelRoute;
  savedAt: string;
  notes?: string;
}
