// High-resolution, curated craft brewery and taproom photography
// Using royalty-free Unsplash craft brewery images with high reliability and visual variety

export interface BreweryImageMeta {
  url: string;
  caption: string;
  tag: string;
}

export const CRAFT_BREWERY_PHOTOS: BreweryImageMeta[] = [
  {
    url: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Modern craft taproom and beer flight tasting room',
    tag: 'Taproom & Flights',
  },
  {
    url: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Polished stainless & copper brewing fermenters and kettles',
    tag: 'Brewhouse',
  },
  {
    url: 'https://images.unsplash.com/photo-1538488881523-294932c7c88b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Outdoor sunlit craft brewery patio and community beer garden',
    tag: 'Beer Garden',
  },
  {
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fresh hazy IPA draft pour straight from the brite tank',
    tag: 'Fresh Draft',
  },
  {
    url: 'https://images.unsplash.com/photo-1608278049615-188c03c51121?auto=format&fit=crop&w=1200&q=80',
    caption: 'Oak barrel aging room for wild sours and imperial stouts',
    tag: 'Barrel Room',
  },
  {
    url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=1200&q=80',
    caption: 'Artisan craft beer flight paired with gastropub bites',
    tag: 'Flight & Pairings',
  },
  {
    url: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=1200&q=80',
    caption: 'Bustling industrial brewhouse taproom with live energy',
    tag: 'Industrial Taproom',
  },
  {
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Rustic mountain brewery bierhall with wooden long tables',
    tag: 'Alpine Bierhall',
  },
  {
    url: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=1200&q=80',
    caption: 'Freshly harvested whole cone hops and craft brewer art',
    tag: 'Hop Sanctuary',
  },
  {
    url: 'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cozy fireplace lounge & dark ale cellar tasting area',
    tag: 'Cellar Lounge',
  },
];

// Specific renowned brewery custom photo matching
export const RENOWNED_BREWERY_PHOTOS: Record<string, BreweryImageMeta> = {
  'alchemist': {
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Alchemist Visitor Center & Hazy IPA Tasting Lawn',
    tag: 'Hazy IPA Mecca',
  },
  'vontrapp': {
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    caption: 'von Trapp Bavarian Bierhall nestled in the Green Mountains',
    tag: 'Austrian Bierhall',
  },
  'idletyme': {
    url: 'https://images.unsplash.com/photo-1538488881523-294932c7c88b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Idletyme garden patio & historic roadside brewing tavern',
    tag: 'Brew Tavern & Garden',
  },
  'prohibition': {
    url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=1200&q=80',
    caption: 'Prohibition Pig Brewery & Smoked BBQ Brewhouse',
    tag: 'Brewpub & Smokehouse',
  },
  'freakfolk': {
    url: 'https://images.unsplash.com/photo-1608278049615-188c03c51121?auto=format&fit=crop&w=1200&q=80',
    caption: 'Freak Folk Bier mixed-culture barrel fermentation cellar',
    tag: 'Wild & Barrel Cellar',
  },
  'lawsons': {
    url: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=1200&q=80',
    caption: "Lawson's Finest timber-framed taproom & sunny beer park",
    tag: 'Timber Bierhall',
  },
};

/**
 * Returns a high-res photo for any brewery stop based on its name, atmosphere, or index
 */
export function getBreweryPhoto(name: string, index: number = 0, atmosphere: string = ''): BreweryImageMeta {
  const lowerName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const [key, meta] of Object.entries(RENOWNED_BREWERY_PHOTOS)) {
    if (lowerName.includes(key)) {
      return meta;
    }
  }

  const lowerAtmo = (atmosphere || '').toLowerCase();
  if (lowerAtmo.includes('patio') || lowerAtmo.includes('garden') || lowerAtmo.includes('outdoor')) {
    return CRAFT_BREWERY_PHOTOS[2];
  }
  if (lowerAtmo.includes('barrel') || lowerAtmo.includes('sour') || lowerAtmo.includes('cellar')) {
    return CRAFT_BREWERY_PHOTOS[4];
  }
  if (lowerAtmo.includes('bierhall') || lowerAtmo.includes('hall') || lowerAtmo.includes('rustic')) {
    return CRAFT_BREWERY_PHOTOS[7];
  }
  if (lowerAtmo.includes('industrial') || lowerAtmo.includes('modern') || lowerAtmo.includes('tank')) {
    return CRAFT_BREWERY_PHOTOS[1];
  }

  // Consistent deterministic photo from array
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i) * 7) % CRAFT_BREWERY_PHOTOS.length;
  }
  const photoIndex = (hash + index) % CRAFT_BREWERY_PHOTOS.length;
  return CRAFT_BREWERY_PHOTOS[photoIndex];
}
