/**
 * Comprehensive Geocoding, Distance Matrix & Routing Engine for BeerHop
 * Accurately calculates real-world geodesic and road-driving distances and drive times.
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

// Built-in high-accuracy coordinate dictionary for North American & Global craft beer hubs and cities
const CITY_COORDINATES: Record<string, LatLng> = {
  // Greater Montreal & South Shore / Montérégie / Eastern Townships
  'longueuil': { lat: 45.5312, lng: -73.5181 },
  'longueuil, qc': { lat: 45.5312, lng: -73.5181 },
  'longueuil, quebec': { lat: 45.5312, lng: -73.5181 },
  'longueuil, canada': { lat: 45.5312, lng: -73.5181 },
  'longueuil, qc, canada': { lat: 45.5312, lng: -73.5181 },
  'saint-hubert': { lat: 45.4947, lng: -73.4241 },
  'saint-hubert, qc': { lat: 45.4947, lng: -73.4241 },
  'brossard': { lat: 45.4593, lng: -73.4736 },
  'brossard, qc': { lat: 45.4593, lng: -73.4736 },
  'saint-lambert': { lat: 45.4988, lng: -73.5042 },
  'saint-lambert, qc': { lat: 45.4988, lng: -73.5042 },
  'boucherville': { lat: 45.5979, lng: -73.4549 },
  'boucherville, qc': { lat: 45.5979, lng: -73.4549 },
  'saint-bruno': { lat: 45.5342, lng: -73.3444 },
  'saint-bruno, qc': { lat: 45.5342, lng: -73.3444 },
  'saint-bruno-de-montarville': { lat: 45.5342, lng: -73.3444 },
  'chambly': { lat: 45.4494, lng: -73.2878 },
  'chambly, qc': { lat: 45.4494, lng: -73.2878 },
  'saint-jean-sur-richelieu': { lat: 45.3057, lng: -73.2533 },
  'saint-jean-sur-richelieu, qc': { lat: 45.3057, lng: -73.2533 },
  'st-jean-sur-richelieu': { lat: 45.3057, lng: -73.2533 },
  'saint-jean': { lat: 45.3057, lng: -73.2533 },
  'la prairie': { lat: 45.4192, lng: -73.4967 },
  'la prairie, qc': { lat: 45.4192, lng: -73.4967 },
  'candiac': { lat: 45.3833, lng: -73.5167 },
  'candiac, qc': { lat: 45.3833, lng: -73.5167 },
  'saint-constant': { lat: 45.3667, lng: -73.5667 },
  'chateauguay': { lat: 45.3592, lng: -73.7488 },
  'chateauguay, qc': { lat: 45.3592, lng: -73.7488 },
  'beloeil': { lat: 45.5708, lng: -73.2045 },
  'beloeil, qc': { lat: 45.5708, lng: -73.2045 },
  'mont-saint-hilaire': { lat: 45.5628, lng: -73.1906 },
  'sainte-julie': { lat: 45.5833, lng: -73.3333 },
  'varennes': { lat: 45.6833, lng: -73.4333 },
  'sorel-tracy': { lat: 46.0333, lng: -73.1167 },
  'saint-hyacinthe': { lat: 45.6309, lng: -72.9571 },
  'saint-hyacinthe, qc': { lat: 45.6309, lng: -72.9571 },
  'granby': { lat: 45.4001, lng: -72.7329 },
  'granby, qc': { lat: 45.4001, lng: -72.7329 },
  'cowansville': { lat: 45.2017, lng: -72.7486 },
  'cowansville, qc': { lat: 45.2017, lng: -72.7486 },
  'farnham': { lat: 45.2833, lng: -72.9833 },
  'bromont': { lat: 45.3167, lng: -72.6500 },
  'bromont, qc': { lat: 45.3167, lng: -72.6500 },
  'sutton': { lat: 45.1090, lng: -72.6105 },
  'sutton, qc': { lat: 45.1090, lng: -72.6105 },
  'knowlton': { lat: 45.2217, lng: -72.5134 },
  'lac-brome': { lat: 45.2217, lng: -72.5134 },
  'magog': { lat: 45.2673, lng: -72.1524 },
  'magog, qc': { lat: 45.2673, lng: -72.1524 },
  'sherbrooke': { lat: 45.4042, lng: -71.8929 },
  'sherbrooke, qc': { lat: 45.4042, lng: -71.8929 },
  'coaticook': { lat: 45.1325, lng: -71.8042 },
  'coaticook, qc': { lat: 45.1325, lng: -71.8042 },
  'north hatley': { lat: 45.2717, lng: -71.9744 },
  'drummondville': { lat: 45.8837, lng: -72.4842 },
  'drummondville, qc': { lat: 45.8837, lng: -72.4842 },
  'victoriaville': { lat: 46.0594, lng: -71.9567 },
  'victoriaville, qc': { lat: 46.0594, lng: -71.9567 },

  // Montreal & North Shore / Laurentides / Lanaudière
  'montreal': { lat: 45.5017, lng: -73.5673 },
  'montreal, qc': { lat: 45.5017, lng: -73.5673 },
  'montreal, canada': { lat: 45.5017, lng: -73.5673 },
  'laval': { lat: 45.6066, lng: -73.7124 },
  'laval, qc': { lat: 45.6066, lng: -73.7124 },
  'westmount': { lat: 45.4853, lng: -73.5964 },
  'outremont': { lat: 45.5186, lng: -73.6064 },
  'pointe-claire': { lat: 45.4487, lng: -73.8167 },
  'dorval': { lat: 45.4497, lng: -73.7431 },
  'kirkland': { lat: 45.4528, lng: -73.8647 },
  'dollard-des-ormeaux': { lat: 45.4833, lng: -73.8167 },
  'terrebonne': { lat: 45.6934, lng: -73.6335 },
  'terrebonne, qc': { lat: 45.6934, lng: -73.6335 },
  'mascouche': { lat: 45.7483, lng: -73.6000 },
  'repentigny': { lat: 45.7423, lng: -73.4496 },
  'repentigny, qc': { lat: 45.7423, lng: -73.4496 },
  'blainville': { lat: 45.6705, lng: -73.8741 },
  'blainville, qc': { lat: 45.6705, lng: -73.8741 },
  'rosemere': { lat: 45.6378, lng: -73.7997 },
  'sainte-therese': { lat: 45.6386, lng: -73.8436 },
  'boisbriand': { lat: 45.6167, lng: -73.8333 },
  'saint-eustache': { lat: 45.5700, lng: -73.8967 },
  'mirabel': { lat: 45.6500, lng: -74.0833 },
  'saint-jerome': { lat: 45.7788, lng: -74.0028 },
  'saint-jerome, qc': { lat: 45.7788, lng: -74.0028 },
  'saint-sauveur': { lat: 45.8942, lng: -74.1611 },
  'sainte-adele': { lat: 45.9500, lng: -74.1333 },
  'val-david': { lat: 46.0333, lng: -74.2000 },
  'sainte-agathe-des-monts': { lat: 46.0500, lng: -74.2833 },
  'mont-tremblant': { lat: 46.1185, lng: -74.5962 },
  'mont-tremblant, qc': { lat: 46.1185, lng: -74.5962 },
  'joliette': { lat: 46.0167, lng: -73.4500 },
  'joliette, qc': { lat: 46.0167, lng: -73.4500 },
  'vaudreuil-dorion': { lat: 45.3986, lng: -74.0267 },
  'vaudreuil': { lat: 45.3986, lng: -74.0267 },
  'hudson': { lat: 45.4500, lng: -74.1500 },
  'salaberry-de-valleyfield': { lat: 45.2536, lng: -74.1311 },
  'valleyfield': { lat: 45.2536, lng: -74.1311 },

  // Quebec City, Chaudière-Appalaches, Mauricie & Eastern QC
  'quebec': { lat: 46.8139, lng: -71.2080 },
  'quebec city': { lat: 46.8139, lng: -71.2080 },
  'quebec, canada': { lat: 46.8139, lng: -71.2080 },
  'quebec, qc': { lat: 46.8139, lng: -71.2080 },
  'quebec, qc, canada': { lat: 46.8139, lng: -71.2080 },
  'ville de quebec': { lat: 46.8139, lng: -71.2080 },
  'levis': { lat: 46.8033, lng: -71.1779 },
  'levis, qc': { lat: 46.8033, lng: -71.1779 },
  'saint-georges': { lat: 46.1167, lng: -70.6667 },
  'thetford mines': { lat: 46.0967, lng: -71.3000 },
  'trois-rivieres': { lat: 46.3432, lng: -72.5477 },
  'trois-rivieres, qc': { lat: 46.3432, lng: -72.5477 },
  'shawinigan': { lat: 46.5667, lng: -72.7500 },
  'saguenay': { lat: 48.4167, lng: -71.0667 },
  'chicoutimi': { lat: 48.4278, lng: -71.0603 },
  'jonquiere': { lat: 48.4167, lng: -71.2500 },
  'alma': { lat: 48.5500, lng: -71.6500 },
  'baie-saint-paul': { lat: 47.4439, lng: -70.5056 },
  'la malbaie': { lat: 47.6500, lng: -70.1500 },
  'tadoussac': { lat: 48.1500, lng: -69.7167 },
  'riviere-du-loup': { lat: 47.8358, lng: -69.5372 },
  'rimouski': { lat: 48.4488, lng: -68.5240 },
  'matane': { lat: 48.8500, lng: -67.5333 },
  'gaspe': { lat: 48.8333, lng: -64.4833 },
  'perce': { lat: 48.5300, lng: -64.2139 },
  'gatineau': { lat: 45.4765, lng: -75.7013 },
  'gatineau, qc': { lat: 45.4765, lng: -75.7013 },
  'hull': { lat: 45.4294, lng: -75.7197 },
  'rouyn-noranda': { lat: 48.2333, lng: -79.0167 },
  'val-d\'or': { lat: 48.1000, lng: -77.7833 },

  // Ontario & Canada
  'ottawa': { lat: 45.4215, lng: -75.6972 },
  'ottawa, on': { lat: 45.4215, lng: -75.6972 },
  'ottawa, canada': { lat: 45.4215, lng: -75.6972 },
  'kingston': { lat: 44.2312, lng: -76.4860 },
  'kingston, on': { lat: 44.2312, lng: -76.4860 },
  'prince edward county': { lat: 43.9931, lng: -77.2344 },
  'picton, on': { lat: 44.0083, lng: -77.1394 },
  'belleville, on': { lat: 44.1628, lng: -77.3832 },
  'peterborough, on': { lat: 44.3091, lng: -78.3197 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'toronto, on': { lat: 43.6532, lng: -79.3832 },
  'mississauga': { lat: 43.5890, lng: -79.6441 },
  'oakville, on': { lat: 43.4675, lng: -79.6877 },
  'burlington, on': { lat: 43.3255, lng: -79.7990 },
  'hamilton': { lat: 43.2557, lng: -79.8711 },
  'niagara falls, on': { lat: 43.0896, lng: -79.0849 },
  'st. catharines, on': { lat: 43.1594, lng: -79.2469 },
  'kitchener, on': { lat: 43.4516, lng: -80.4925 },
  'waterloo, on': { lat: 43.4643, lng: -80.5204 },
  'guelph, on': { lat: 43.5448, lng: -80.2482 },
  'london, on': { lat: 42.9849, lng: -81.2453 },
  'windsor, on': { lat: 42.3149, lng: -83.0364 },
  'barrie, on': { lat: 44.3894, lng: -79.6903 },
  'sudbury, on': { lat: 46.4917, lng: -80.9930 },
  'thunder bay, on': { lat: 48.3809, lng: -89.2477 },
  'halifax': { lat: 44.6488, lng: -63.5752 },
  'fredericton': { lat: 45.9636, lng: -66.6431 },
  'moncton': { lat: 46.0878, lng: -64.7782 },
  'saint john, nb': { lat: 45.2733, lng: -66.0633 },
  'charlottetown': { lat: 46.2382, lng: -63.1311 },
  'st. john\'s, nl': { lat: 47.5615, lng: -52.7126 },
  'vancouver': { lat: 49.2827, lng: -123.1207 },
  'victoria': { lat: 48.4284, lng: -123.3656 },
  'kelowna': { lat: 49.8880, lng: -119.4960 },
  'calgary': { lat: 51.0447, lng: -114.0719 },
  'edmonton': { lat: 53.5461, lng: -113.4938 },
  'banff': { lat: 51.1784, lng: -115.5708 },
  'canmore': { lat: 51.0890, lng: -115.3590 },
  'winnipeg': { lat: 49.8951, lng: -97.1384 },
  'saskatoon': { lat: 52.1332, lng: -106.6700 },
  'regina': { lat: 50.4452, lng: -104.6189 },

  // Vermont & New England
  'burlington': { lat: 44.4759, lng: -73.2121 },
  'burlington, vt': { lat: 44.4759, lng: -73.2121 },
  'south burlington, vt': { lat: 44.4669, lng: -73.1710 },
  'winooski, vt': { lat: 44.4914, lng: -73.1868 },
  'stowe': { lat: 44.4654, lng: -72.6874 },
  'stowe, vt': { lat: 44.4654, lng: -72.6874 },
  'waterbury': { lat: 44.3378, lng: -72.7562 },
  'waterbury, vt': { lat: 44.3378, lng: -72.7562 },
  'montpelier': { lat: 44.2601, lng: -72.5754 },
  'montpelier, vt': { lat: 44.2601, lng: -72.5754 },
  'barre, vt': { lat: 44.1970, lng: -72.5020 },
  'greensboro': { lat: 44.5778, lng: -72.2968 },
  'greensboro, vt': { lat: 44.5778, lng: -72.2968 },
  'waitsfield': { lat: 44.1895, lng: -72.8243 },
  'waitsfield, vt': { lat: 44.1895, lng: -72.8243 },
  'warren, vt': { lat: 44.1167, lng: -72.8567 },
  'middlebury, vt': { lat: 44.0153, lng: -73.1673 },
  'rutland, vt': { lat: 43.6106, lng: -72.9726 },
  'killington, vt': { lat: 43.6642, lng: -72.7933 },
  'woodstock, vt': { lat: 43.6242, lng: -72.5186 },
  'white river junction, vt': { lat: 43.6492, lng: -72.3183 },
  'brattleboro, vt': { lat: 42.8509, lng: -72.5579 },
  'manchester, vt': { lat: 43.1637, lng: -73.0723 },
  'bennington, vt': { lat: 42.8781, lng: -73.1968 },
  'st. albans, vt': { lat: 44.8109, lng: -73.0833 },
  'newport, vt': { lat: 44.9364, lng: -72.2051 },

  // Maine & New Hampshire
  'portland, me': { lat: 43.6591, lng: -70.2568 },
  'portland, maine': { lat: 43.6591, lng: -70.2568 },
  'freeport, me': { lat: 43.8570, lng: -70.1031 },
  'brunswick, me': { lat: 43.9140, lng: -69.9670 },
  'bangor, me': { lat: 44.8016, lng: -68.7712 },
  'bar harbor, me': { lat: 44.3876, lng: -68.2039 },
  'kennebunkport, me': { lat: 43.3615, lng: -70.4764 },
  'ogunquit, me': { lat: 43.2487, lng: -70.5975 },
  'portsmouth, nh': { lat: 43.0718, lng: -70.7626 },
  'manchester, nh': { lat: 42.9956, lng: -71.4548 },
  'concord, nh': { lat: 43.2081, lng: -71.5376 },
  'north conway, nh': { lat: 44.0537, lng: -71.1284 },
  'hanover, nh': { lat: 43.7022, lng: -72.2896 },
  'keene, nh': { lat: 42.9337, lng: -72.2781 },

  // Massachusetts & Rhode Island & Connecticut
  'boston': { lat: 42.3601, lng: -71.0589 },
  'boston, ma': { lat: 42.3601, lng: -71.0589 },
  'cambridge, ma': { lat: 42.3736, lng: -71.1097 },
  'somerville, ma': { lat: 42.3876, lng: -71.0995 },
  'worcester, ma': { lat: 42.2626, lng: -71.8023 },
  'framingham, ma': { lat: 42.2793, lng: -71.4162 },
  'canton, ma': { lat: 42.1584, lng: -71.1448 },
  'everett, ma': { lat: 42.4084, lng: -71.0537 },
  'salem, ma': { lat: 42.5195, lng: -70.8967 },
  'plymouth, ma': { lat: 41.9584, lng: -70.6673 },
  'northampton, ma': { lat: 42.3251, lng: -72.6412 },
  'providence': { lat: 41.8240, lng: -71.4128 },
  'providence, ri': { lat: 41.8240, lng: -71.4128 },
  'newport, ri': { lat: 41.4901, lng: -71.3128 },
  'pawtucket, ri': { lat: 41.8787, lng: -71.3826 },
  'hartford': { lat: 41.7658, lng: -72.6734 },
  'hartford, ct': { lat: 41.7658, lng: -72.6734 },
  'new haven': { lat: 41.3083, lng: -72.9279 },
  'new haven, ct': { lat: 41.3083, lng: -72.9279 },
  'stamford, ct': { lat: 41.0534, lng: -73.5387 },
  'norwalk, ct': { lat: 41.1177, lng: -73.4079 },
  'mystic, ct': { lat: 41.3543, lng: -71.9665 },

  // New York
  'new york': { lat: 40.7128, lng: -74.0060 },
  'new york city': { lat: 40.7128, lng: -74.0060 },
  'new york, ny': { lat: 40.7128, lng: -74.0060 },
  'nyc': { lat: 40.7128, lng: -74.0060 },
  'brooklyn, ny': { lat: 40.6782, lng: -73.9442 },
  'queens, ny': { lat: 40.7282, lng: -73.7949 },
  'manhattan, ny': { lat: 40.7831, lng: -73.9712 },
  'albany': { lat: 42.6526, lng: -73.7562 },
  'albany, ny': { lat: 42.6526, lng: -73.7562 },
  'troy, ny': { lat: 42.7284, lng: -73.6918 },
  'saratoga springs, ny': { lat: 43.0831, lng: -73.7846 },
  'lake placid, ny': { lat: 44.2795, lng: -73.9799 },
  'plattsburgh, ny': { lat: 44.6995, lng: -73.4529 },
  'glens falls, ny': { lat: 43.3095, lng: -73.6440 },
  'syracuse, ny': { lat: 43.0481, lng: -76.1474 },
  'rochester, ny': { lat: 43.1566, lng: -77.6088 },
  'buffalo, ny': { lat: 42.8864, lng: -78.8784 },
  'ithaca, ny': { lat: 42.4440, lng: -76.5019 },
  'cooperstown, ny': { lat: 42.7006, lng: -74.9243 },
  'hudson, ny': { lat: 42.2529, lng: -73.7910 },
  'kingston, ny': { lat: 41.9270, lng: -73.9974 },
  'beacon, ny': { lat: 41.5048, lng: -73.9696 },

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
  'asheville': { lat: 35.5951, lng: -82.5515 },
  'asheville, nc': { lat: 35.5951, lng: -82.5515 },
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
  'new orleans, la': { lat: 29.9511, lng: -90.0715 },

  // Midwest US
  'columbus, oh': { lat: 39.9612, lng: -82.9988 },
  'cleveland, oh': { lat: 41.4993, lng: -81.6944 },
  'cincinnati, oh': { lat: 39.1031, lng: -84.5120 },
  'indianapolis, in': { lat: 39.7684, lng: -86.1581 },
  'detroit, mi': { lat: 42.3314, lng: -83.0458 },
  'grand rapids, mi': { lat: 42.9634, lng: -85.6681 },
  'kalamazoo, mi': { lat: 42.2917, lng: -85.5872 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'chicago, il': { lat: 41.8781, lng: -87.6298 },
  'milwaukee': { lat: 43.0389, lng: -87.9065 },
  'milwaukee, wi': { lat: 43.0389, lng: -87.9065 },
  'madison, wi': { lat: 43.0731, lng: -89.4012 },
  'minneapolis': { lat: 44.9778, lng: -93.2650 },
  'minneapolis, mn': { lat: 44.9778, lng: -93.2650 },
  'st. louis, mo': { lat: 38.6270, lng: -90.1994 },

  // Mountain & West Coast US
  'denver': { lat: 39.7392, lng: -104.9903 },
  'denver, co': { lat: 39.7392, lng: -104.9903 },
  'boulder, co': { lat: 40.0150, lng: -105.2705 },
  'fort collins, co': { lat: 40.5853, lng: -105.0844 },
  'salt lake city, ut': { lat: 40.7608, lng: -111.8910 },
  'phoenix, az': { lat: 33.4484, lng: -112.0740 },
  'las vegas, nv': { lat: 36.1699, lng: -115.1398 },
  'boise, id': { lat: 43.6150, lng: -116.2023 },
  'seattle': { lat: 47.6062, lng: -122.3321 },
  'seattle, wa': { lat: 47.6062, lng: -122.3321 },
  'portland, or': { lat: 45.5152, lng: -122.6784 },
  'portland, oregon': { lat: 45.5152, lng: -122.6784 },
  'bend, or': { lat: 44.0582, lng: -121.3153 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'san francisco, ca': { lat: 37.7749, lng: -122.4194 },
  'san diego': { lat: 32.7157, lng: -117.1611 },
  'san diego, ca': { lat: 32.7157, lng: -117.1611 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'los angeles, ca': { lat: 34.0522, lng: -118.2437 },
  'austin, tx': { lat: 30.2672, lng: -97.7431 },
  'dallas, tx': { lat: 32.7767, lng: -96.7970 },
};

// Regional centroids for resilient state/province level resolution
const REGION_CENTROIDS: Record<string, LatLng> = {
  'qc': { lat: 45.5017, lng: -73.5673 }, // Montreal / South Shore region
  'quebec': { lat: 46.8139, lng: -71.2080 },
  'on': { lat: 43.6532, lng: -79.3832 }, // Toronto region
  'ontario': { lat: 43.6532, lng: -79.3832 },
  'vt': { lat: 44.4759, lng: -73.2121 }, // Vermont / Burlington
  'vermont': { lat: 44.4759, lng: -73.2121 },
  'nh': { lat: 43.0718, lng: -70.7626 },
  'new hampshire': { lat: 43.0718, lng: -70.7626 },
  'me': { lat: 43.6591, lng: -70.2568 },
  'maine': { lat: 43.6591, lng: -70.2568 },
  'ma': { lat: 42.3601, lng: -71.0589 },
  'massachusetts': { lat: 42.3601, lng: -71.0589 },
  'ny': { lat: 42.6526, lng: -73.7562 }, // Albany / Upstate NY
  'new york': { lat: 40.7128, lng: -74.0060 },
  'ct': { lat: 41.7658, lng: -72.6734 },
  'connecticut': { lat: 41.7658, lng: -72.6734 },
  'ri': { lat: 41.8240, lng: -71.4128 },
  'rhode island': { lat: 41.8240, lng: -71.4128 },
  'pa': { lat: 39.9526, lng: -75.1652 },
  'ca': { lat: 37.7749, lng: -122.4194 },
  'california': { lat: 37.7749, lng: -122.4194 },
  'or': { lat: 45.5152, lng: -122.6784 },
  'oregon': { lat: 45.5152, lng: -122.6784 },
  'wa': { lat: 47.6062, lng: -122.3321 },
  'washington': { lat: 47.6062, lng: -122.3321 },
  'co': { lat: 39.7392, lng: -104.9903 },
  'colorado': { lat: 39.7392, lng: -104.9903 },
  'tx': { lat: 30.2672, lng: -97.7431 },
  'texas': { lat: 30.2672, lng: -97.7431 },
  'nc': { lat: 35.5951, lng: -82.5515 },
  'il': { lat: 41.8781, lng: -87.6298 },
  'wi': { lat: 43.0389, lng: -87.9065 },
  'mi': { lat: 42.9634, lng: -85.6681 },
};

/**
 * Parses user input string to find latitude and longitude coordinates.
 * Supports:
 * - Direct coordinate string: "Lat: 46.81, Lng: -71.21" or "46.8139, -71.2080"
 * - Exact city dictionary match
 * - Normalized partial lookup (e.g. "Longueuil, Qc" -> "longueuil")
 * - Regional state/province centroid lookup
 */
export function resolveCoordinates(locationStr: string, fallbackCoord?: LatLng): LatLng {
  if (!locationStr || !locationStr.trim()) {
    return fallbackCoord || { lat: 44.4759, lng: -73.2121 };
  }

  const trimmed = locationStr.trim();

  // 1. Direct Regex for "Lat: 46.81, Lng: -71.21" or "46.8139, -71.208"
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

  // Try matching stripped non-letter version (e.g. "longueuil qc" -> "longueuil")
  const stripped = normalized.replace(/[,.-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (CITY_COORDINATES[stripped]) {
    return CITY_COORDINATES[stripped];
  }

  // Check if city name is in first part of comma: "Longueuil, Qc" -> "longueuil"
  const firstPart = normalized.split(',')[0].trim();
  if (CITY_COORDINATES[firstPart]) {
    return CITY_COORDINATES[firstPart];
  }

  // Try substring matching for known cities in dictionary
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized === key || normalized.startsWith(key + ' ') || normalized.includes(key)) {
      return coords;
    }
  }

  // Check state or province code in parts
  const parts = normalized.split(/[,\s]+/).map(p => p.trim());
  for (const part of parts) {
    if (REGION_CENTROIDS[part]) {
      return REGION_CENTROIDS[part];
    }
  }

  return fallbackCoord || { lat: 45.5017, lng: -73.5673 };
}

/**
 * Calculates Great-Circle distance using Haversine formula (in kilometers)
 */
export function calculateHaversineKm(from: LatLng, to: LatLng): number {
  const R = 6371; // Earth's mean radius in km
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

/**
 * Calculates realistic road driving distance and drive time between two coordinates.
 * Applies highway routing factors, speed limits, and border/traffic models.
 */
export function calculateDrivingTransit(from: LatLng, to: LatLng): TransitEstimate {
  let straightLineKm = calculateHaversineKm(from, to);

  // If two locations have essentially identical coordinates (< 0.1 km) but are distinct stops, provide minimum baseline
  if (straightLineKm < 0.1) {
    straightLineKm = 0.1;
  }

  // Road curvature and highway routing coefficient:
  let roadWindingFactor = 1.26;
  let avgSpeedKmh = 90; // Standard highway speed ~56 mph

  if (straightLineKm < 10) {
    roadWindingFactor = 1.35;
    avgSpeedKmh = 42; // Local streets ~26 mph
  } else if (straightLineKm < 40) {
    roadWindingFactor = 1.30;
    avgSpeedKmh = 65; // Mixed secondary roads ~40 mph
  } else if (straightLineKm < 150) {
    roadWindingFactor = 1.25;
    avgSpeedKmh = 88; // State routes / highways ~55 mph
  } else {
    roadWindingFactor = 1.24;
    avgSpeedKmh = 96; // Interstate highway travel ~60 mph
  }

  const distanceKm = straightLineKm * roadWindingFactor;
  const distanceMiles = distanceKm / 1.60934;

  // Calculate base drive time in minutes
  let driveTimeMin = Math.round((distanceKm / avgSpeedKmh) * 60);

  // If cross-border trip (e.g. Canada lat > 45.004 with US destination lat < 45.0, or vice-versa),
  // add realistic border crossing buffer ~15-20 min
  const isCrossBorder = (from.lat > 45.01 && to.lat < 45.0) || (from.lat < 45.0 && to.lat > 45.01);
  if (isCrossBorder && straightLineKm > 40) {
    driveTimeMin += 18;
  }

  // Minimum sensible drive time for non-identical points
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
