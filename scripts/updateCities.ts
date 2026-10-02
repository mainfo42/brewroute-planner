import fs from 'fs';
import { ALL_MAJOR_CITIES, CityDataRecord } from '../src/data/worldCitiesData';

console.log(`Original cities count: ${ALL_MAJOR_CITIES.length}`);

// NYC wider metropolitan area boroughs, neighborhoods, and suburbs to exclude as individual cities
const NYC_METRO_EXCLUSIONS = new Set([
  'brooklyn', 'queens', 'manhattan', 'the bronx', 'staten island', 'upper west side',
  'jamaica', 'yonkers', 'east flatbush', 'east new york', 'washington heights', 'astoria',
  'borough park', 'sunset park', 'sheepshead bay', 'harlem', 'east harlem', 'elmhurst',
  'bushwick', 'gravesend', 'corona', 'richmond hill', 'fordham', 'flatbush', 'chinatown',
  'canarsie', 'new rochelle', 'south ozone park', 'kings bridge', 'brownsville', 'ridgewood',
  'mount vernon', 'forest hills', 'jackson heights', 'bayside', 'parkchester', 'park slope',
  'flatlands', 'east village', 'financial district', 'brentwood', 'bensonhurst', 'coney island',
  'white plains', 'morningside heights', 'hempstead', 'cypress hills', 'ozone park',
  'briarwood', 'wakefield', 'queens village', 'levittown', 'mott haven', 'irondequoit',
  'greenburgh', 'clay', 'amherst', 'cheektowaga', 'west albany'
]);

// Montreal borough entries to exclude
const QC_BOROUGH_EXCLUSIONS = new Set([
  'rosemont–la petite-patrie', 'villeray–saint-michel–parc-extension',
  'mercier–hochelaga-maisonneuve', 'ahuntsic-cartierville', 'le vieux-longueuil',
  'saint-louis-de-terrebonne', 'rivière-des-prairies–pointe-aux-trembles',
  'sainte-foy', 'la cité-limoilou', 'le plateau-mont-royal', 'ville-marie',
  'saint-laurent', 'chomedey', 'la haute-saint-charles', 'montréal-nord',
  'le sud-ouest', 'charlesbourg', 'saint-hubert', 'beauport', 'saint-léonard',
  'les rivières', 'pierrefonds-roxboro', 'verdun', 'chicoutimi',
  'notre-dame-de-grâce', 'hull', 'pierrefonds', 'aylmer', 'saint-michel',
  'jonquière'
]);

const filteredCities: CityDataRecord[] = [];

for (const c of ALL_MAJOR_CITIES) {
  const nameLower = (c.cityName || '').toLowerCase().trim();
  const sp = (c.stateOrProvince || '').toLowerCase().trim();
  const code = (c.code || '').toUpperCase().trim();

  // If in NY and in NYC metro exclusions, skip
  if ((sp === 'new york' || code === 'NY') && NYC_METRO_EXCLUSIONS.has(nameLower)) {
    continue;
  }
  // If in QC and in borough exclusions, skip
  if ((sp === 'quebec' || code === 'QC') && QC_BOROUGH_EXCLUSIONS.has(nameLower)) {
    continue;
  }

  filteredCities.push(c);
}

console.log(`After exclusions: ${filteredCities.length}`);

const existingKeys = new Set<string>();
for (const c of filteredCities) {
  const sp = c.stateOrProvince || '';
  const city = (c.cityName || '').toLowerCase();
  existingKeys.add(`${city}|${sp.toLowerCase()}`);
}

function addCity(c: CityDataRecord) {
  const key = `${c.cityName.toLowerCase()}|${c.stateOrProvince.toLowerCase()}`;
  if (!existingKeys.has(key)) {
    filteredCities.push(c);
    existingKeys.add(key);
  }
}

// 1. VERMONT (all cities/towns > 15,000 + craft hubs)
const VT_CITIES: CityDataRecord[] = [
  {
    name: "Burlington, VT, USA",
    cityName: "Burlington",
    asciiname: "Burlington",
    subtext: "Vermont, USA • Pop. 44,743 • Lake Champlain Craft Capital",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 44743,
    lat: 44.4759,
    lng: -73.2121,
    altNames: ["Burlington VT", "Burlington, Vermont"],
    craftBeerHubRank: "Top Craft State Capital"
  },
  {
    name: "South Burlington, VT, USA",
    cityName: "South Burlington",
    asciiname: "South Burlington",
    subtext: "Vermont, USA • Pop. 20,292",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 20292,
    lat: 44.4670,
    lng: -73.1709,
    altNames: ["South Burlington VT"],
    craftBeerHubRank: "Greater Burlington Metro"
  },
  {
    name: "Rutland, VT, USA",
    cityName: "Rutland",
    asciiname: "Rutland",
    subtext: "Vermont, USA • Pop. 15,807",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 15807,
    lat: 43.6106,
    lng: -72.9726,
    altNames: ["Rutland VT"],
    craftBeerHubRank: "Green Mountains Hub"
  },
  {
    name: "Essex, VT, USA",
    cityName: "Essex",
    asciiname: "Essex",
    subtext: "Vermont, USA • Pop. 22,094",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 22094,
    lat: 44.5256,
    lng: -73.1118,
    altNames: ["Essex Junction", "Essex VT"],
    craftBeerHubRank: "Chittenden County"
  },
  {
    name: "Colchester, VT, USA",
    cityName: "Colchester",
    asciiname: "Colchester",
    subtext: "Vermont, USA • Pop. 17,524",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 17524,
    lat: 44.5439,
    lng: -73.1485,
    altNames: ["Colchester VT"],
    craftBeerHubRank: "Lake Champlain Metro"
  },
  {
    name: "Bennington, VT, USA",
    cityName: "Bennington",
    asciiname: "Bennington",
    subtext: "Vermont, USA • Pop. 15,333",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 15333,
    lat: 42.8781,
    lng: -73.1968,
    altNames: ["Bennington VT"],
    craftBeerHubRank: "Southern Vermont Hub"
  },
  {
    name: "Stowe, VT, USA",
    cityName: "Stowe",
    asciiname: "Stowe",
    subtext: "Vermont, USA • The Alchemist (Heady Topper) • Route 100",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 5223,
    lat: 44.4654,
    lng: -72.6874,
    altNames: ["Stowe VT", "Stowe & Waterbury"],
    craftBeerHubRank: "IPA Heartland"
  },
  {
    name: "Waterbury, VT, USA",
    cityName: "Waterbury",
    asciiname: "Waterbury",
    subtext: "Vermont, USA • Prohibition Pig, Craft Crossroads",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 5331,
    lat: 44.3378,
    lng: -72.7562,
    altNames: ["Waterbury VT"],
    craftBeerHubRank: "Craft Beer Crossroads"
  },
  {
    name: "Greensboro, VT, USA",
    cityName: "Greensboro",
    asciiname: "Greensboro",
    subtext: "Vermont, USA • Hill Farmstead Brewery (World's Best Brewery)",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 811,
    lat: 44.5767,
    lng: -72.2965,
    altNames: ["Greensboro VT", "Northeast Kingdom"],
    craftBeerHubRank: "Saison & Farmhouse Mecca"
  },
  {
    name: "Waitsfield, VT, USA",
    cityName: "Waitsfield",
    asciiname: "Waitsfield",
    subtext: "Vermont, USA • Lawson's Finest Liquids (Sip of Sunshine)",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 1844,
    lat: 44.1895,
    lng: -72.8248,
    altNames: ["Waitsfield VT", "Mad River Valley"],
    craftBeerHubRank: "Mad River Valley Hub"
  },
  {
    name: "Brattleboro, VT, USA",
    cityName: "Brattleboro",
    asciiname: "Brattleboro",
    subtext: "Vermont, USA • Pop. 12,184 • Hermit Thrush Brewery",
    type: "city",
    stateOrProvince: "Vermont",
    code: "VT",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 12184,
    lat: 42.8509,
    lng: -72.5579,
    altNames: ["Brattleboro VT"],
    craftBeerHubRank: "Southern VT Sours"
  }
];

for (const c of VT_CITIES) addCity(c);

// 2. QUEBEC (all cities > 15,000)
const QC_CITIES: CityDataRecord[] = [
  { name: "Montreal, QC, Canada", cityName: "Montreal", asciiname: "Montreal", subtext: "Quebec, Canada • Pop. 1,762,949 • World Craft Capital", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 1762949, lat: 45.5017, lng: -73.5673, altNames: ["Montréal", "Montreal QC"], craftBeerHubRank: "World Craft Capital" },
  { name: "Quebec City, QC, Canada", cityName: "Quebec City", asciiname: "Quebec City", subtext: "Quebec, Canada • Pop. 531,902 • Historic Craft Hub", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 531902, lat: 46.8139, lng: -71.2080, altNames: ["Québec", "Quebec QC", "Ville de Québec"], craftBeerHubRank: "Historic Craft Hub" },
  { name: "Laval, QC, Canada", cityName: "Laval", asciiname: "Laval", subtext: "Quebec, Canada • Pop. 438,366", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 438366, lat: 45.5699, lng: -73.6920, altNames: ["Laval QC"], craftBeerHubRank: "Greater Montreal Area" },
  { name: "Gatineau, QC, Canada", cityName: "Gatineau", asciiname: "Gatineau", subtext: "Quebec, Canada • Pop. 300,045 • National Capital Craft", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 300045, lat: 45.4765, lng: -75.7013, altNames: ["Gatineau QC", "Hull"], craftBeerHubRank: "Outaouais Craft Region" },
  { name: "Longueuil, QC, Canada", cityName: "Longueuil", asciiname: "Longueuil", subtext: "Quebec, Canada • Pop. 229,330", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 229330, lat: 45.5312, lng: -73.5181, altNames: ["Longueuil QC", "South Shore"], craftBeerHubRank: "Monteregie Craft Hub" },
  { name: "Sherbrooke, QC, Canada", cityName: "Sherbrooke", asciiname: "Sherbrooke", subtext: "Quebec, Canada • Pop. 172,950 • Eastern Townships Hub", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 172950, lat: 45.4042, lng: -71.8929, altNames: ["Sherbrooke QC"], craftBeerHubRank: "Eastern Townships Craft Hub" },
  { name: "Saguenay, QC, Canada", cityName: "Saguenay", asciiname: "Saguenay", subtext: "Quebec, Canada • Pop. 148,886 • Fjord Craft Scene", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 148886, lat: 48.4289, lng: -71.0664, altNames: ["Saguenay QC", "Chicoutimi", "Jonquiere"], craftBeerHubRank: "Fjord & Saguenay Craft" },
  { name: "Levis, QC, Canada", cityName: "Levis", asciiname: "Levis", subtext: "Quebec, Canada • Pop. 143,414", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 143414, lat: 46.8033, lng: -71.1779, altNames: ["Lévis", "Levis QC"], craftBeerHubRank: "Chaudiere-Appalaches" },
  { name: "Trois-Rivieres, QC, Canada", cityName: "Trois-Rivieres", asciiname: "Trois-Rivieres", subtext: "Quebec, Canada • Pop. 144,472 • Mauricie Riverfront Hub", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 144472, lat: 46.3432, lng: -72.5432, altNames: ["Trois-Rivières", "Trois-Rivieres QC"], craftBeerHubRank: "Mauricie Craft Trail" },
  { name: "Terrebonne, QC, Canada", cityName: "Terrebonne", asciiname: "Terrebonne", subtext: "Quebec, Canada • Pop. 111,575", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 111575, lat: 45.7001, lng: -73.6325, altNames: ["Terrebonne QC"], craftBeerHubRank: "Lanaudiere Craft Corridor" },
  { name: "Saint-Jean-sur-Richelieu, QC, Canada", cityName: "Saint-Jean-sur-Richelieu", asciiname: "Saint-Jean-sur-Richelieu", subtext: "Quebec, Canada • Pop. 95,114 • Lagabiere & Riverfront", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 95114, lat: 45.3057, lng: -73.2533, altNames: ["Saint-Jean", "St-Jean-sur-Richelieu"], craftBeerHubRank: "Richelieu Valley Craft" },
  { name: "Brossard, QC, Canada", cityName: "Brossard", asciiname: "Brossard", subtext: "Quebec, Canada • Pop. 85,721", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 85721, lat: 45.4593, lng: -73.4736, altNames: ["Brossard QC"], craftBeerHubRank: "Monteregie Metro" },
  { name: "Repentigny, QC, Canada", cityName: "Repentigny", asciiname: "Repentigny", subtext: "Quebec, Canada • Pop. 84,285", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 84285, lat: 45.7334, lng: -73.4492, altNames: ["Repentigny QC"], craftBeerHubRank: "Lanaudiere Metro" },
  { name: "Drummondville, QC, Canada", cityName: "Drummondville", asciiname: "Drummondville", subtext: "Quebec, Canada • Pop. 75,423", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 75423, lat: 45.8834, lng: -72.4825, altNames: ["Drummondville QC"], craftBeerHubRank: "Centre-du-Quebec Craft" },
  { name: "Saint-Jerome, QC, Canada", cityName: "Saint-Jerome", asciiname: "Saint-Jerome", subtext: "Quebec, Canada • Pop. 74,346 • Gateway to Laurentians", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 74346, lat: 45.7794, lng: -74.0028, altNames: ["Saint-Jérôme", "St-Jerome QC"], craftBeerHubRank: "Laurentians Craft Gateway" },
  { name: "Granby, QC, Canada", cityName: "Granby", asciiname: "Granby", subtext: "Quebec, Canada • Pop. 66,222", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 66222, lat: 45.4001, lng: -72.7329, altNames: ["Granby QC"], craftBeerHubRank: "Haute-Yamaska Craft" },
  { name: "Blainville, QC, Canada", cityName: "Blainville", asciiname: "Blainville", subtext: "Quebec, Canada • Pop. 56,863", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 56863, lat: 45.6668, lng: -73.8825, altNames: ["Blainville QC"], craftBeerHubRank: "North Shore Metro" },
  { name: "Saint-Hyacinthe, QC, Canada", cityName: "Saint-Hyacinthe", asciiname: "Saint-Hyacinthe", subtext: "Quebec, Canada • Pop. 55,648 • Le Bilboquet & Agrifood", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 55648, lat: 45.6309, lng: -72.9571, altNames: ["St-Hyacinthe QC"], craftBeerHubRank: "Agri-Craft Capital" },
  { name: "Shawinigan, QC, Canada", cityName: "Shawinigan", asciiname: "Shawinigan", subtext: "Quebec, Canada • Pop. 49,349 • Le Trou du Diable Birthplace", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 49349, lat: 46.5668, lng: -72.7492, altNames: ["Shawinigan QC"], craftBeerHubRank: "Birthplace of Trou du Diable" },
  { name: "Dollard-des-Ormeaux, QC, Canada", cityName: "Dollard-des-Ormeaux", asciiname: "Dollard-des-Ormeaux", subtext: "Quebec, Canada • Pop. 49,637", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 49637, lat: 45.4834, lng: -73.8158, altNames: ["DDO"], craftBeerHubRank: "West Island Metro" },
  { name: "Rimouski, QC, Canada", cityName: "Rimouski", asciiname: "Rimouski", subtext: "Quebec, Canada • Pop. 48,664 • Bas-Saint-Laurent Coastal Hub", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 48664, lat: 48.4488, lng: -68.5240, altNames: ["Rimouski QC"], craftBeerHubRank: "Bas-Saint-Laurent Craft" },
  { name: "Chateauguay, QC, Canada", cityName: "Chateauguay", asciiname: "Chateauguay", subtext: "Quebec, Canada • Pop. 47,906", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 47906, lat: 45.3592, lng: -73.7488, altNames: ["Châteauguay QC"], craftBeerHubRank: "Roussillon Craft" },
  { name: "Victoriaville, QC, Canada", cityName: "Victoriaville", asciiname: "Victoriaville", subtext: "Quebec, Canada • Pop. 46,130", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 46130, lat: 46.0501, lng: -71.9658, altNames: ["Victoriaville QC"], craftBeerHubRank: "Bois-Francs Craft Hub" },
  { name: "Saint-Eustache, QC, Canada", cityName: "Saint-Eustache", asciiname: "Saint-Eustache", subtext: "Quebec, Canada • Pop. 44,154", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 44154, lat: 45.5668, lng: -73.9158, altNames: ["St-Eustache QC"], craftBeerHubRank: "Deux-Montagnes Craft" },
  { name: "Mascouche, QC, Canada", cityName: "Mascouche", asciiname: "Mascouche", subtext: "Quebec, Canada • Pop. 42,298", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 42298, lat: 45.7499, lng: -73.6001, altNames: ["Mascouche QC"], craftBeerHubRank: "Moulins Craft" },
  { name: "Mirabel, QC, Canada", cityName: "Mirabel", asciiname: "Mirabel", subtext: "Quebec, Canada • Pop. 41,957", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 41957, lat: 45.6501, lng: -74.0825, altNames: ["Mirabel QC"], craftBeerHubRank: "Laurentians Plains" },
  { name: "Rouyn-Noranda, QC, Canada", cityName: "Rouyn-Noranda", asciiname: "Rouyn-Noranda", subtext: "Quebec, Canada • Pop. 41,012 • Abitibi Craft Pioneer", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 41012, lat: 48.2432, lng: -79.0253, altNames: ["Rouyn-Noranda QC"], craftBeerHubRank: "Abitibi-Temiscamingue Hub" },
  { name: "Boucherville, QC, Canada", cityName: "Boucherville", asciiname: "Boucherville", subtext: "Quebec, Canada • Pop. 40,753", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 40753, lat: 45.5979, lng: -73.4549, altNames: ["Boucherville QC"], craftBeerHubRank: "South Shore Craft" },
  { name: "Salaberry-de-Valleyfield, QC, Canada", cityName: "Salaberry-de-Valleyfield", asciiname: "Salaberry-de-Valleyfield", subtext: "Quebec, Canada • Pop. 40,047", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 40047, lat: 45.2501, lng: -74.1325, altNames: ["Valleyfield", "Salaberry QC"], craftBeerHubRank: "Haut-Saint-Laurent Craft" },
  { name: "Vaudreuil-Dorion, QC, Canada", cityName: "Vaudreuil-Dorion", asciiname: "Vaudreuil-Dorion", subtext: "Quebec, Canada • Pop. 38,117", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 38117, lat: 45.4001, lng: -74.0325, altNames: ["Vaudreuil QC"], craftBeerHubRank: "Vaudreuil-Soulanges Hub" },
  { name: "Sorel-Tracy, QC, Canada", "cityName": "Sorel-Tracy", "asciiname": "Sorel-Tracy", subtext: "Quebec, Canada • Pop. 34,755", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 34755, lat: 46.0333, lng: -73.1167, altNames: ["Sorel QC"], craftBeerHubRank: "Richelieu Confluence" },
  { name: "Saint-Georges, QC, Canada", cityName: "Saint-Georges", asciiname: "Saint-Georges", subtext: "Quebec, Canada • Pop. 32,513 • Beauce Craft Hub", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 32513, lat: 46.1168, lng: -70.6658, altNames: ["Saint-Georges-de-Beauce"], craftBeerHubRank: "Beauce Craft Capital" },
  { name: "Val-d'Or, QC, Canada", cityName: "Val-d'Or", asciiname: "Val-d'Or", subtext: "Quebec, Canada • Pop. 32,491 • Northern Gold Trail", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 32491, lat: 48.1001, lng: -77.7825, altNames: ["Val d'Or QC"], craftBeerHubRank: "Northern Gold Trail" },
  { name: "Alma, QC, Canada", cityName: "Alma", asciiname: "Alma", subtext: "Quebec, Canada • Pop. 30,904 • Lac Saint-Jean Craft Trail", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 30904, lat: 48.5501, lng: -71.6492, altNames: ["Alma QC", "Riverbend"], craftBeerHubRank: "Lac-Saint-Jean Trail" },
  { name: "Sainte-Julie, QC, Canada", cityName: "Sainte-Julie", asciiname: "Sainte-Julie", subtext: "Quebec, Canada • Pop. 30,104", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 30104, lat: 45.5833, lng: -73.3333, altNames: ["Ste-Julie QC"], craftBeerHubRank: "Monteregie East" },
  { name: "Chambly, QC, Canada", cityName: "Chambly", asciiname: "Chambly", subtext: "Quebec, Canada • Pop. 29,120 • Historic Fort & Canal Brewing", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 29120, lat: 45.4494, lng: -73.2878, altNames: ["Chambly QC"], craftBeerHubRank: "Canal & Fort Brewing" },
  { name: "Magog, QC, Canada", cityName: "Magog", asciiname: "Magog", subtext: "Quebec, Canada • Pop. 26,669 • Lake Memphremagog Craft Scene", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 26669, lat: 45.2668, lng: -72.1492, altNames: ["Magog QC"], craftBeerHubRank: "Memphremagog Craft Scene" },
  { name: "Saint-Bruno-de-Montarville, QC, Canada", cityName: "Saint-Bruno-de-Montarville", asciiname: "Saint-Bruno-de-Montarville", subtext: "Quebec, Canada • Pop. 26,107", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 26107, lat: 45.5342, lng: -73.3444, altNames: ["Saint-Bruno QC"], craftBeerHubRank: "Mont-Saint-Bruno Craft" },
  { name: "Thetford Mines, QC, Canada", cityName: "Thetford Mines", asciiname: "Thetford Mines", subtext: "Quebec, Canada • Pop. 25,403", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 25403, lat: 46.0834, lng: -71.3158, altNames: ["Thetford Mines QC"], craftBeerHubRank: "Appalaches Craft" },
  { name: "Sept-Iles, QC, Canada", cityName: "Sept-Iles", asciiname: "Sept-Iles", subtext: "Quebec, Canada • Pop. 25,400 • Cote-Nord Craft", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 25400, lat: 50.2001, lng: -66.3825, altNames: ["Sept-Îles QC"], craftBeerHubRank: "Cote-Nord Craft Pioneer" },
  { name: "Joliette, QC, Canada", cityName: "Joliette", asciiname: "Joliette", subtext: "Quebec, Canada • Pop. 20,484 • Lanaudiere Cultural Craft", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 20484, lat: 46.0168, lng: -73.4325, altNames: ["Joliette QC"], craftBeerHubRank: "Lanaudiere Heartland" },
  { name: "Riviere-du-Loup, QC, Canada", cityName: "Riviere-du-Loup", asciiname: "Riviere-du-Loup", subtext: "Quebec, Canada • Pop. 20,118 • St. Lawrence River Craft", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 20118, lat: 47.8334, lng: -69.5325, altNames: ["Rivière-du-Loup QC"], craftBeerHubRank: "St. Lawrence River Route" },
  { name: "Baie-Comeau, QC, Canada", cityName: "Baie-Comeau", asciiname: "Baie-Comeau", subtext: "Quebec, Canada • Pop. 21,536 • Manicouagan Coastal Craft", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 21536, lat: 49.2168, lng: -68.1492, altNames: ["Baie-Comeau QC"], craftBeerHubRank: "Manicouagan Craft" },
  { name: "Gaspe, QC, Canada", cityName: "Gaspe", asciiname: "Gaspe", subtext: "Quebec, Canada • Pop. 15,163 • Gaspesie Peninsula Coastal Trail", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 15163, lat: 48.8334, lng: -64.4825, altNames: ["Gaspé QC", "Gaspesie"], craftBeerHubRank: "Gaspesie Craft Hub" },
  { name: "Cowansville, QC, Canada", cityName: "Cowansville", asciiname: "Cowansville", subtext: "Quebec, Canada • Pop. 15,052 • Brome-Missisquoi Craft Route", type: "city", stateOrProvince: "Quebec", code: "QC", country: "Canada", countryCode: "CA", countryName: "Canada", population: 15052, lat: 45.2001, lng: -72.7492, altNames: ["Cowansville QC", "Dunham Route"], craftBeerHubRank: "Brome-Missisquoi Craft" }
];

for (const c of QC_CITIES) addCity(c);

// 3. NEW YORK STATE (Cleaned: NYC kept as New York City, NY; all cities > 15,000 outside wider NYC metro included)
const NY_UPSTATE_CITIES: CityDataRecord[] = [
  {
    name: "New York City, NY, USA",
    cityName: "New York City",
    asciiname: "New York City",
    subtext: "New York, USA • Pop. 8,804,190 • Brooklyn & Queens Craft Metropolis",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 8804190,
    lat: 40.7128,
    lng: -74.0060,
    altNames: ["NYC", "New York", "New York, NY", "Brooklyn", "Queens", "Manhattan", "The Bronx", "Staten Island"],
    craftBeerHubRank: "Metro Hop Metropolis"
  },
  {
    name: "Buffalo, NY, USA",
    cityName: "Buffalo",
    asciiname: "Buffalo",
    subtext: "New York, USA • Pop. 258,071 • Big Ditch, Community Beer Works, Resurgence",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 258071,
    lat: 42.8864,
    lng: -78.8784,
    altNames: ["Buffalo NY", "Queen City"],
    craftBeerHubRank: "Western NY Craft Anchor"
  },
  {
    name: "Rochester, NY, USA",
    cityName: "Rochester",
    asciiname: "Rochester",
    subtext: "New York, USA • Pop. 209,802 • Mortalis, Rohrbach, Other Half Finger Lakes",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 209802,
    lat: 43.1566,
    lng: -77.6088,
    altNames: ["Rochester NY"],
    craftBeerHubRank: "Flower City Craft Trail"
  },
  {
    name: "Syracuse, NY, USA",
    cityName: "Syracuse",
    asciiname: "Syracuse",
    subtext: "New York, USA • Pop. 148,620 • Middle Ages, Meier's Creek, Buried Acorn",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 148620,
    lat: 43.0481,
    lng: -76.1474,
    altNames: ["Syracuse NY"],
    craftBeerHubRank: "Central NY Craft Hub"
  },
  {
    name: "Albany, NY, USA",
    cityName: "Albany",
    asciiname: "Albany",
    subtext: "New York, USA • Pop. 99,224 • Fidens Brewing, C.H. Evans",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 99224,
    lat: 42.6526,
    lng: -73.7562,
    altNames: ["Albany NY", "Capital District"],
    craftBeerHubRank: "Capital District Hazy Mecca"
  },
  {
    name: "Schenectady, NY, USA",
    cityName: "Schenectady",
    asciiname: "Schenectady",
    subtext: "New York, USA • Pop. 67,047 • Frog Alley Brewing, Druthers",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 67047,
    lat: 42.8142,
    lng: -73.9396,
    altNames: ["Schenectady NY"],
    craftBeerHubRank: "Mohawk Valley Craft"
  },
  {
    name: "Utica, NY, USA",
    cityName: "Utica",
    asciiname: "Utica",
    subtext: "New York, USA • Pop. 65,283 • Saranac / Matt Brewing Company",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 65283,
    lat: 43.1009,
    lng: -75.2327,
    altNames: ["Utica NY"],
    craftBeerHubRank: "Historic Brewery District"
  },
  {
    name: "Troy, NY, USA",
    cityName: "Troy",
    asciiname: "Troy",
    subtext: "New York, USA • Pop. 51,401 • Rare Form Brewing, Brown's Brewing",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 51401,
    lat: 42.7284,
    lng: -73.6918,
    altNames: ["Troy NY"],
    craftBeerHubRank: "Hudson River Craft"
  },
  {
    name: "Niagara Falls, NY, USA",
    cityName: "Niagara Falls",
    asciiname: "Niagara Falls",
    subtext: "New York, USA • Pop. 48,671",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 48671,
    lat: 43.0962,
    lng: -79.0377,
    altNames: ["Niagara Falls NY"],
    craftBeerHubRank: "Niagara Frontier"
  },
  {
    name: "Binghamton, NY, USA",
    cityName: "Binghamton",
    asciiname: "Binghamton",
    subtext: "New York, USA • Pop. 47,969 • Water Street Brewing, Beer Tree",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 47969,
    lat: 42.0987,
    lng: -75.9180,
    altNames: ["Binghamton NY"],
    craftBeerHubRank: "Southern Tier Craft Hub"
  },
  {
    name: "Ithaca, NY, USA",
    cityName: "Ithaca",
    asciiname: "Ithaca",
    subtext: "New York, USA • Pop. 32,108 • Ithaca Beer Co (Flower Power)",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 32108,
    lat: 42.4440,
    lng: -76.5019,
    altNames: ["Ithaca NY", "Finger Lakes"],
    craftBeerHubRank: "Finger Lakes Craft Hub"
  },
  {
    name: "Poughkeepsie, NY, USA",
    cityName: "Poughkeepsie",
    asciiname: "Poughkeepsie",
    subtext: "New York, USA • Pop. 31,577 • King's Court, Mill House Brewing",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 31577,
    lat: 41.7004,
    lng: -73.9210,
    altNames: ["Poughkeepsie NY"],
    craftBeerHubRank: "Mid-Hudson Craft"
  },
  {
    name: "Middletown, NY, USA",
    cityName: "Middletown",
    asciiname: "Middletown",
    subtext: "New York, USA • Pop. 30,345 • Equilibrium Brewery",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 30345,
    lat: 41.4459,
    lng: -74.4229,
    altNames: ["Middletown NY"],
    craftBeerHubRank: "Equilibrium Hazy Mecca"
  },
  {
    name: "Newburgh, NY, USA",
    cityName: "Newburgh",
    asciiname: "Newburgh",
    subtext: "New York, USA • Pop. 28,856 • Newburgh Brewing Company",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 28856,
    lat: 41.5034,
    lng: -74.0104,
    altNames: ["Newburgh NY"],
    craftBeerHubRank: "Hudson Riverfront Taprooms"
  },
  {
    name: "Saratoga Springs, NY, USA",
    cityName: "Saratoga Springs",
    asciiname: "Saratoga Springs",
    subtext: "New York, USA • Pop. 28,491 • Druthers Brewing, Whitman Brewing",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 28491,
    lat: 43.0831,
    lng: -73.7846,
    altNames: ["Saratoga Springs NY", "Saratoga"],
    craftBeerHubRank: "Spa City Craft Hub"
  },
  {
    name: "Jamestown, NY, USA",
    cityName: "Jamestown",
    asciiname: "Jamestown",
    subtext: "New York, USA • Pop. 28,712 • Southern Tier Brewing region",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 28712,
    lat: 42.0970,
    lng: -79.2353,
    altNames: ["Jamestown NY"],
    craftBeerHubRank: "Chautauqua Craft"
  },
  {
    name: "Auburn, NY, USA",
    cityName: "Auburn",
    asciiname: "Auburn",
    subtext: "New York, USA • Pop. 26,866 • Prison City Brewing (Mass Riot)",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 26866,
    lat: 42.9317,
    lng: -76.5661,
    altNames: ["Auburn NY"],
    craftBeerHubRank: "GABF Gold Hazy Pioneer"
  },
  {
    name: "Elmira, NY, USA",
    cityName: "Elmira",
    asciiname: "Elmira",
    subtext: "New York, USA • Pop. 26,523 • Upstate Brewing",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 26523,
    lat: 42.0898,
    lng: -76.8077,
    altNames: ["Elmira NY"],
    craftBeerHubRank: "Chemung Valley Craft"
  },
  {
    name: "Watertown, NY, USA",
    cityName: "Watertown",
    asciiname: "Watertown",
    subtext: "New York, USA • Pop. 24,685 • Thousand Islands Brewing Corridor",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 24685,
    lat: 43.9748,
    lng: -75.9108,
    altNames: ["Watertown NY"],
    craftBeerHubRank: "North Country Gateway"
  },
  {
    name: "Kingston, NY, USA",
    cityName: "Kingston",
    asciiname: "Kingston",
    subtext: "New York, USA • Pop. 24,069 • Keegan Ales, Kingston Standard",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 24069,
    lat: 41.9270,
    lng: -73.9974,
    altNames: ["Kingston NY"],
    craftBeerHubRank: "Catskills & Hudson Portal"
  },
  {
    name: "Plattsburgh, NY, USA",
    cityName: "Plattsburgh",
    asciiname: "Plattsburgh",
    subtext: "New York, USA • Pop. 19,841 • Valcour Brewing, Oval Craft",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 19841,
    lat: 44.6995,
    lng: -73.4529,
    altNames: ["Plattsburgh NY"],
    craftBeerHubRank: "Lake Champlain West Shore"
  },
  {
    name: "Cortland, NY, USA",
    cityName: "Cortland",
    asciiname: "Cortland",
    subtext: "New York, USA • Pop. 19,204 • Cortland Beer Company",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 19204,
    lat: 42.6012,
    lng: -76.1808,
    altNames: ["Cortland NY"],
    craftBeerHubRank: "Crown City Brewing"
  },
  {
    name: "Amsterdam, NY, USA",
    cityName: "Amsterdam",
    asciiname: "Amsterdam",
    subtext: "New York, USA • Pop. 18,219",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 18219,
    lat: 42.9376,
    lng: -74.1907,
    altNames: ["Amsterdam NY"],
    craftBeerHubRank: "Mohawk Valley"
  },
  {
    name: "Oswego, NY, USA",
    cityName: "Oswego",
    asciiname: "Oswego",
    subtext: "New York, USA • Pop. 16,921",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 16921,
    lat: 43.4553,
    lng: -76.5105,
    altNames: ["Oswego NY"],
    craftBeerHubRank: "Lake Ontario Port"
  },
  {
    name: "Batavia, NY, USA",
    cityName: "Batavia",
    asciiname: "Batavia",
    subtext: "New York, USA • Pop. 15,465 • Eli Fish Brewing",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 15465,
    lat: 42.9981,
    lng: -78.1875,
    altNames: ["Batavia NY"],
    craftBeerHubRank: "Genesee County Craft"
  },
  {
    name: "Glens Falls, NY, USA",
    cityName: "Glens Falls",
    asciiname: "Glens Falls",
    subtext: "New York, USA • Pop. 14,830 • Common Roots, Mean Max",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 14830,
    lat: 43.3095,
    lng: -73.6440,
    altNames: ["Glens Falls NY", "South Glens Falls"],
    craftBeerHubRank: "Adirondack Foothills Craft"
  },
  {
    name: "Oneonta, NY, USA",
    cityName: "Oneonta",
    asciiname: "Oneonta",
    subtext: "New York, USA • Pop. 14,000 • Brewery Ommegang Corridor",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 14000,
    lat: 42.4529,
    lng: -75.0638,
    altNames: ["Oneonta NY", "Cooperstown Corridor"],
    craftBeerHubRank: "Ommegang Belgian Trail"
  },
  {
    name: "Beacon, NY, USA",
    cityName: "Beacon",
    asciiname: "Beacon",
    subtext: "New York, USA • Hudson Valley Brewery • Sours & Hazies",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 14000,
    lat: 41.5048,
    lng: -73.9696,
    altNames: ["Beacon NY", "Hudson Valley Brewery"],
    craftBeerHubRank: "Sour IPA Sanctuary"
  },
  {
    name: "Hudson, NY, USA",
    cityName: "Hudson",
    asciiname: "Hudson",
    subtext: "New York, USA • Suarez Family Brewery • World-Class Lagers",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 6500,
    lat: 42.2529,
    lng: -73.7910,
    altNames: ["Hudson NY", "Suarez Family"],
    craftBeerHubRank: "Artisanal Lager Mecca"
  },
  {
    name: "Lake Placid, NY, USA",
    cityName: "Lake Placid",
    asciiname: "Lake Placid",
    subtext: "New York, USA • Big Slide, Lake Placid Pub & Brewery",
    type: "city",
    stateOrProvince: "New York",
    code: "NY",
    country: "USA",
    countryCode: "US",
    countryName: "United States",
    population: 2521,
    lat: 44.2795,
    lng: -73.9799,
    altNames: ["Lake Placid NY", "Adirondacks"],
    craftBeerHubRank: "Adirondacks Craft Center"
  }
];

for (const c of NY_UPSTATE_CITIES) addCity(c);

console.log(`Final total cities count: ${filteredCities.length}`);

const fileOutput = `// Comprehensive database of every city in North America & Europe with population thresholds
// Sourced from official census & GeoNames data, customized for BrewHop entity grounding.
export interface CityDataRecord {
  name: string;
  cityName: string;
  asciiname: string;
  subtext: string;
  type: 'city';
  stateOrProvince: string;
  code: string;
  country: 'USA' | 'Canada' | 'International';
  countryCode: string;
  countryName: string;
  population: number;
  lat: number;
  lng: number;
  altNames?: string[];
  craftBeerHubRank?: string | null;
}

export const ALL_MAJOR_CITIES: CityDataRecord[] = ${JSON.stringify(filteredCities, null, 2)};
`;

fs.writeFileSync('src/data/worldCitiesData.ts', fileOutput);
console.log('Successfully written src/data/worldCitiesData.ts!');
