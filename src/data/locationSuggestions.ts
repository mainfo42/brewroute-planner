export interface LocationSuggestion {
  name: string;
  subtext: string;
  type: 'state' | 'province' | 'city' | 'region';
  stateOrProvince?: string;
  code?: string;
  country: 'USA' | 'Canada' | 'International';
  craftBeerHubRank?: string;
}

export interface RegionData {
  name: string; // e.g. "Vermont", "Ontario"
  code: string; // e.g. "VT", "ON"
  country: 'USA' | 'Canada';
  type: 'state' | 'province';
  description: string;
  cities: {
    name: string;
    subtext: string;
    hubRank?: string;
  }[];
}

export const US_STATES_AND_CITIES: RegionData[] = [
  {
    name: 'Alabama',
    code: 'AL',
    country: 'USA',
    type: 'state',
    description: 'Birmingham craft scene, Gulf Coast taprooms & Huntsville rocket city brews',
    cities: [
      { name: 'Birmingham, AL, USA', subtext: 'Avondale & Downtown • Good People, TrimTab, Avondale Brewing', hubRank: 'Top AL Hub' },
      { name: 'Huntsville, AL, USA', subtext: 'Campus No. 805 • Straight to Ale, Yellowhammer', hubRank: 'Rocket City Craft' },
      { name: 'Mobile, AL, USA', subtext: 'Gulf Coast craft breweries & historic brewpubs' },
    ],
  },
  {
    name: 'Alaska',
    code: 'AK',
    country: 'USA',
    type: 'state',
    description: 'Glacier-fed mountain ales, Midnight Sun & Alaskan wilderness brewing',
    cities: [
      { name: 'Anchorage, AK, USA', subtext: 'Moose’s Tooth, Midnight Sun, 49th State Brewing', hubRank: 'Alaskan Hub' },
      { name: 'Juneau, AK, USA', subtext: 'Alaskan Brewing Company & coastal mountain taprooms' },
      { name: 'Fairbanks, AK, USA', subtext: 'HooDoo Brewing & Silver Gulch' },
    ],
  },
  {
    name: 'Arizona',
    code: 'AZ',
    country: 'USA',
    type: 'state',
    description: 'Desert craft breweries, crisp lagers, citrus IPAs & high-country ales',
    cities: [
      { name: 'Phoenix, AZ, USA', subtext: 'Downtown & Scottsdale • Wren House, Arizona Wilderness', hubRank: 'Valley of the Sun Hub' },
      { name: 'Tucson, AZ, USA', subtext: 'Historic 4th Ave • Borderlands, Pueblo Vida, Dragoon', hubRank: 'Desert Craft' },
      { name: 'Flagstaff, AZ, USA', subtext: 'High-altitude brewing • Mother Road, Dark Sky, Lumberyard', hubRank: 'Mountain Hub' },
    ],
  },
  {
    name: 'Arkansas',
    code: 'AR',
    country: 'USA',
    type: 'state',
    description: 'Ozark Mountain craft trail & Northwest Arkansas brewery corridor',
    cities: [
      { name: 'Bentonville & Fayetteville, AR, USA', subtext: 'Ozark Beer Co, Fossil Cove, Bike Rack Brewing', hubRank: 'Ozark Hub' },
      { name: 'Little Rock, AR, USA', subtext: 'Lost Forty, Flyway Brewing, Diamond Bear' },
    ],
  },
  {
    name: 'California',
    code: 'CA',
    country: 'USA',
    type: 'state',
    description: 'Birthplace of West Coast IPA, Russian River, San Diego & Bay Area craft titans',
    cities: [
      { name: 'San Diego, CA, USA', subtext: 'Hop Highway & North Park • AleSmith, Pure Project, Stone', hubRank: 'Capital of West Coast IPA' },
      { name: 'Santa Rosa & Sonoma, CA, USA', subtext: 'Russian River Valley • Russian River (Pliny the Elder), Bear Republic', hubRank: 'Iconic Craft Trail' },
      { name: 'San Francisco, CA, USA', subtext: 'SoMa & Mission • Cellarmaker, Anchor Heritage, Toronado', hubRank: 'Bay Area Hub' },
      { name: 'Los Angeles, CA, USA', subtext: 'Arts District & Torrance • Monkish, Highland Park, Mumford', hubRank: 'SoCal Craft Hub' },
      { name: 'Sacramento, CA, USA', subtext: 'Farm-to-fork brewing • Track 7, Urban Roots, Bike Dog' },
      { name: 'Paso Robles, CA, USA', subtext: 'Central Coast • Firestone Walker Brewery & Barrelworks', hubRank: 'Barrel-Aged Trail' },
      { name: 'Chico, CA, USA', subtext: 'Sierra Nevada Brewing Co headquarters & taproom' },
    ],
  },
  {
    name: 'Colorado',
    code: 'CO',
    country: 'USA',
    type: 'state',
    description: 'Mile-High craft haven, Great American Beer Festival capital & Rocky Mountain breweries',
    cities: [
      { name: 'Denver, CO, USA', subtext: 'RiNo & LoDo Arts District • Great Divide, Crooked Stave, Ratio', hubRank: 'Mile High Craft Capital' },
      { name: 'Boulder, CO, USA', subtext: 'Pearl Street & Foothills • Avery, Upslope, Mountain Sun', hubRank: 'Rocky Mountain Hub' },
      { name: 'Fort Collins, CO, USA', subtext: 'Poudre River • New Belgium, Odell, Funkwerks', hubRank: 'Craft Pioneer Hub' },
      { name: 'Colorado Springs, CO, USA', subtext: 'Pikes Peak region • Phantom Canyon, Bristol Brewing' },
      { name: 'Breckenridge & Summit County, CO, USA', subtext: 'Alpine breweries • Breckenridge Brewery, Outer Range' },
    ],
  },
  {
    name: 'Connecticut',
    code: 'CT',
    country: 'USA',
    type: 'state',
    description: 'New England hazy IPA trail, shoreline breweries & farmhouse ales',
    cities: [
      { name: 'New Haven, CT, USA', subtext: 'New England Brewing Co, East Rock, Counter Weight', hubRank: 'Shoreline Trail' },
      { name: 'Hartford & Bloomfield, CT, USA', subtext: 'Thomas Hooker, Back East, City Steam' },
      { name: 'Stamford & Norwalk, CT, USA', subtext: 'Half Full, Spacecat, Lock City' },
    ],
  },
  {
    name: 'Delaware',
    code: 'DE',
    country: 'USA',
    type: 'state',
    description: 'Home of Dogfish Head and Coastal craft beer trail',
    cities: [
      { name: 'Milton & Rehoboth Beach, DE, USA', subtext: 'Dogfish Head Craft Brewery & coastal brewpubs', hubRank: 'Off-Centered Capital' },
      { name: 'Wilmington, DE, USA', subtext: 'Iron Hill, Stitch House, Wilmington Brew Works' },
    ],
  },
  {
    name: 'District of Columbia',
    code: 'DC',
    country: 'USA',
    type: 'state',
    description: 'Capital craft breweries, historic brewpubs & urban taprooms',
    cities: [
      { name: 'Washington, DC, USA', subtext: 'Ivy City & Navy Yard • DC Brau, Bluejacket, Right Proper, Other Half DC', hubRank: 'Capital Craft Hub' },
    ],
  },
  {
    name: 'Florida',
    code: 'FL',
    country: 'USA',
    type: 'state',
    description: 'Suncoast craft trail, Tampa Bay stouts & tropical fruit sours',
    cities: [
      { name: 'Tampa & St. Petersburg, FL, USA', subtext: 'Tampa Bay • Cigar City, Green Bench, Cycle Brewing', hubRank: 'Suncoast Craft Trail' },
      { name: 'Miami, FL, USA', subtext: 'Wynwood Arts District • J. Wakefield, Tripping Animals, Veza Sur', hubRank: 'Tropical Craft Hub' },
      { name: 'Orlando, FL, USA', subtext: 'Ivanhoe Village • Redlight Redlight, Crooked Can, Ten10' },
      { name: 'Jacksonville, FL, USA', subtext: 'Jax Ale Trail • Intuition Ale Works, Bold City, Aardwolf' },
    ],
  },
  {
    name: 'Georgia',
    code: 'GA',
    country: 'USA',
    type: 'state',
    description: 'Atlanta craft belt, Savannah historic brewpubs & sweet southern IPAs',
    cities: [
      { name: 'Atlanta, GA, USA', subtext: 'Decatur & West End • SweetWater, Monday Night, Orpheus, Halfway Crooks', hubRank: 'Southeast Craft Hub' },
      { name: 'Savannah, GA, USA', subtext: 'Historic District • Service Brewing, Two Tides, Moon River' },
      { name: 'Athens, GA, USA', subtext: 'Creature Comforts (Tropicália), Terrapin' },
    ],
  },
  {
    name: 'Hawaii',
    code: 'HI',
    country: 'USA',
    type: 'state',
    description: 'Island craft beers brewed with passion fruit, toasted coconut & local hops',
    cities: [
      { name: 'Honolulu, HI, USA', subtext: 'Kakaako Arts District • Maui Brewing, Beer Lab HI, Honolulu Beerworks', hubRank: 'Island Craft Hub' },
      { name: 'Maui, HI, USA', subtext: 'Kihei • Maui Brewing Co headquarters & Kohola' },
      { name: 'Kona, Big Island, HI, USA', subtext: 'Kona Brewing Co & Big Island Brewhaus' },
    ],
  },
  {
    name: 'Idaho',
    code: 'ID',
    country: 'USA',
    type: 'state',
    description: 'Pacific Northwest hop-growing heartland & Treasure Valley craft',
    cities: [
      { name: 'Boise, ID, USA', subtext: 'Treasure Valley • Barbarian Brewing, Payette, Woodland Empire', hubRank: 'Hop Belt Hub' },
      { name: 'Sun Valley & Ketchum, ID, USA', subtext: 'Sun Valley Brewing & Sawtooth' },
      { name: 'Coeur d’Alene, ID, USA', subtext: 'North Idaho craft trail & lakeside taprooms' },
    ],
  },
  {
    name: 'Illinois',
    code: 'IL',
    country: 'USA',
    type: 'state',
    description: 'Chicago barrel-aged stouts, Revolution, Half Acre & Midwest craft giants',
    cities: [
      { name: 'Chicago, IL, USA', subtext: 'Fulton Market & Ravenswood • Revolution, Half Acre, Goose Island, Hop Butcher', hubRank: 'Midwest Craft Powerhouse' },
      { name: 'Evanston, IL, USA', subtext: 'Temperance Beer Co, Sketchbook Brewing' },
      { name: 'Peoria, IL, USA', subtext: 'Bearded Owl, Industry Brewing' },
    ],
  },
  {
    name: 'Indiana',
    code: 'IN',
    country: 'USA',
    type: 'state',
    description: '3 Floyds legendary Dark Lord heritage & Indy craft belt',
    cities: [
      { name: 'Indianapolis, IN, USA', subtext: 'Mass Ave & Broad Ripple • Sun King, Upland, Daredevil', hubRank: 'Hoosier Craft Capital' },
      { name: 'Munster & Northwest Indiana, IN, USA', subtext: '3 Floyds Brewing & Region craft breweries', hubRank: 'Legendary Stout Hub' },
      { name: 'Bloomington, IN, USA', subtext: 'Upland Brewing Co sour wild ale wood shop' },
    ],
  },
  {
    name: 'Iowa',
    code: 'IA',
    country: 'USA',
    type: 'state',
    description: 'Toppling Goliath (Pseudo Sue, King Sue) & Quad Cities craft trail',
    cities: [
      { name: 'Decorah, IA, USA', subtext: 'Toppling Goliath Brewing Co & Pulpit Rock', hubRank: 'Hazy IPA Mecca' },
      { name: 'Des Moines, IA, USA', subtext: 'Confluence Brewing, Exile, Lua Brewing', hubRank: 'Capitol Craft' },
      { name: 'Iowa City, IA, USA', subtext: 'Big Grove Brewery & Backpocket' },
    ],
  },
  {
    name: 'Kansas',
    code: 'KS',
    country: 'USA',
    type: 'state',
    description: 'Sunflower State craft taprooms, wheat ales & Kansas City metro',
    cities: [
      { name: 'Wichita, KS, USA', subtext: 'Central Standard, Hopping Gnome, Wichita Brewing' },
      { name: 'Lawrence, KS, USA', subtext: 'Free State Brewing Co (Kansas pioneer)' },
      { name: 'Overland Park & Olathe, KS, USA', subtext: 'Brew Lab, Limitless Brewing' },
    ],
  },
  {
    name: 'Kentucky',
    code: 'KY',
    country: 'USA',
    type: 'state',
    description: 'World capital of bourbon barrel-aged beers & Louisville craft trail',
    cities: [
      { name: 'Louisville, KY, USA', subtext: 'NuLu & Highlands • Against the Grain, Monnik, Gravely', hubRank: 'Bourbon Barrel Capital' },
      { name: 'Lexington, KY, USA', subtext: 'Brewgrass Trail • West Sixth, Country Boy, Mirror Twin' },
      { name: 'Covington & Newport, KY, USA', subtext: 'Braxton Brewing & Northern KY craft corridor' },
    ],
  },
  {
    name: 'Louisiana',
    code: 'LA',
    country: 'USA',
    type: 'state',
    description: 'Cajun country brewpubs, French Quarter craft & Abita springs',
    cities: [
      { name: 'New Orleans, LA, USA', subtext: 'Bywater & Lower Garden • Urban South, Courtyard, Parleaux, Brieux Carré', hubRank: 'Crescent City Craft' },
      { name: 'Baton Rouge, LA, USA', subtext: 'Tin Roof Brewing, Cypress Coast' },
      { name: 'Abita Springs & Covington, LA, USA', subtext: 'Abita Brewing Company historic home' },
    ],
  },
  {
    name: 'Maine',
    code: 'ME',
    country: 'USA',
    type: 'state',
    description: 'Top breweries per capita, Allagash, Maine Beer Co & Bissell Brothers',
    cities: [
      { name: 'Portland, ME, USA', subtext: 'Industrial Way & Bayside • Allagash, Bissell Brothers, Foundation, Austin Street', hubRank: '#1 Per Capita Hub' },
      { name: 'Freeport, ME, USA', subtext: 'Maine Beer Company (Lunch, Dinner) headquarters', hubRank: 'Iconic NEIPA' },
      { name: 'Bangor & Bar Harbor, ME, USA', subtext: 'Atlantic Brewing & coastal Maine brewpubs' },
    ],
  },
  {
    name: 'Maryland',
    code: 'MD',
    country: 'USA',
    type: 'state',
    description: 'Chesapeake craft beers, Flying Dog & Baltimore harbor brewpubs',
    cities: [
      { name: 'Baltimore, MD, USA', subtext: 'Hampden & Brewer’s Hill • Union Craft, Diamondback, Nepenthe', hubRank: 'Charm City Craft' },
      { name: 'Frederick, MD, USA', subtext: 'Flying Dog, Attaboy, Idiom Brewing' },
      { name: 'Annapolis, MD, USA', subtext: 'Forward Brewing, Annapolis Smokehouse' },
    ],
  },
  {
    name: 'Massachusetts',
    code: 'MA',
    country: 'USA',
    type: 'state',
    description: 'Sanctuary of Tree House, Trillium & New England Hazy IPAs',
    cities: [
      { name: 'Boston, MA, USA', subtext: 'Seaport & Fenway • Trillium Brewing, Sam Adams, Night Shift', hubRank: 'Historic NE Hub' },
      { name: 'Charlton & Monson, MA, USA', subtext: 'Tree House Brewing Company pavilions & orchards', hubRank: 'NEIPA Sanctuary' },
      { name: 'Cambridge & Somerville, MA, USA', subtext: 'Lamplighter, Aeronaut, Cambridge Brewing Co' },
      { name: 'Cape Cod, MA, USA', subtext: 'Tree House Sandwich, Cape Cod Beer, Cisco' },
    ],
  },
  {
    name: 'Michigan',
    code: 'MI',
    country: 'USA',
    type: 'state',
    description: 'Great Lakes craft royalty, Founders, Bell’s & Grand Rapids Beer City',
    cities: [
      { name: 'Grand Rapids, MI, USA', subtext: 'Beer City USA • Founders, Brewery Vivant, City Built, The Mitten', hubRank: 'Beer City USA' },
      { name: 'Kalamazoo, MI, USA', subtext: 'Bell’s Brewery & Eccentric Cafe, One Well', hubRank: 'Heritage Craft Hub' },
      { name: 'Detroit & Ferndale, MI, USA', subtext: 'Atwater, Batch Brewing, Eastern Market Brewing' },
      { name: 'Ann Arbor, MI, USA', subtext: 'Jolly Pumpkin, HOMES Brewery, Wolverine State' },
      { name: 'Traverse City, MI, USA', subtext: 'Right Brain, Short’s Brewing proximity' },
    ],
  },
  {
    name: 'Minnesota',
    code: 'MN',
    country: 'USA',
    type: 'state',
    description: 'Twin Cities brewing corridor, Surly, Fair State & Summit',
    cities: [
      { name: 'Minneapolis, MN, USA', subtext: 'Northeast Arts District • Surly, Dangerous Man, Bauhaus, Indeed', hubRank: 'Twin Cities Hub' },
      { name: 'Saint Paul, MN, USA', subtext: 'Summit Brewing, Bad Weather, Barrel Theory', hubRank: 'Capital City Craft' },
      { name: 'Duluth, MN, USA', subtext: 'North Shore • Bent Paddle, Fitger’s Brewhouse' },
    ],
  },
  {
    name: 'Mississippi',
    code: 'MS',
    country: 'USA',
    type: 'state',
    description: 'Gulf Coast brewpubs & Southern river craft taprooms',
    cities: [
      { name: 'Jackson, MS, USA', subtext: 'Fertile Ground Beer Co, Pig & Pint' },
      { name: 'Ocean Springs & Gulfport, MS, USA', subtext: 'Chandeleur Island Brewing & coastal taprooms' },
      { name: 'Oxford, MS, USA', subtext: 'Yalobusha Brewing & college town brewpubs' },
    ],
  },
  {
    name: 'Missouri',
    code: 'MO',
    country: 'USA',
    type: 'state',
    description: 'St. Louis wild ales (Side Project, Perennial) & Kansas City Crossroads',
    cities: [
      { name: 'St. Louis, MO, USA', subtext: 'Maplewood & Midtown • Side Project, Perennial, Urban Chestnut, 4 Hands', hubRank: 'Barrel-Aged & Wild Ale Capital' },
      { name: 'Kansas City, MO, USA', subtext: 'Crossroads Arts District • Boulevard, Brewery Imperial, Casual Animal', hubRank: 'Crossroads Craft Hub' },
      { name: 'Columbia, MO, USA', subtext: 'Logboat Brewing, Bur Oak Brewing' },
    ],
  },
  {
    name: 'Montana',
    code: 'MT',
    country: 'USA',
    type: 'state',
    description: 'Big Sky mountain breweries & crystal glacier-fed ales',
    cities: [
      { name: 'Bozeman, MT, USA', subtext: 'Bridger Brewing, Bozeman Brewing, Mountains Walking', hubRank: 'Big Sky Craft' },
      { name: 'Missoula, MT, USA', subtext: 'Big Sky Brewing, KettleHouse, Bayern Brewing' },
      { name: 'Whitefish & Kalispell, MT, USA', subtext: 'Glacier gateway • Bonsai Brewing, Great Northern' },
    ],
  },
  {
    name: 'Nebraska',
    code: 'NE',
    country: 'USA',
    type: 'state',
    description: 'Cornhusker craft innovators & Omaha Old Market breweries',
    cities: [
      { name: 'Omaha, NE, USA', subtext: 'Old Market & Benson • Boiler Brewing, Kros Strain, Infusion', hubRank: 'Plains Craft Hub' },
      { name: 'Lincoln, NE, USA', subtext: 'Haymarket • Boiler Brewing, Cosmic Eye, Blue Blood' },
    ],
  },
  {
    name: 'Nevada',
    code: 'NV',
    country: 'USA',
    type: 'state',
    description: 'Las Vegas Arts District craft strip & Reno/Tahoe mountain brewing',
    cities: [
      { name: 'Las Vegas, NV, USA', subtext: 'Arts District Brewery Row • Able Baker, HUDL, Tenaya Creek, Hop Nuts', hubRank: 'Vegas Brewery Row' },
      { name: 'Reno, NV, USA', subtext: 'MidTown & Riverwalk • Revision Brewing, The Depot, Lead Dog' },
      { name: 'Lake Tahoe, NV, USA', subtext: 'Alibi Ale Works & mountain taprooms' },
    ],
  },
  {
    name: 'New Hampshire',
    code: 'NH',
    country: 'USA',
    type: 'state',
    description: 'White Mountains craft route & Portsmouth coastal brew scene',
    cities: [
      { name: 'Portsmouth, NH, USA', subtext: 'Seacoast • Earth Eagle, Liars Bench, Smuttynose proximity', hubRank: 'Seacoast Craft' },
      { name: 'Manchester, NH, USA', subtext: 'To Share Brewing, Backyard Brewery' },
      { name: 'North Conway, NH, USA', subtext: 'Moat Mountain, Tuckerman Brewing' },
    ],
  },
  {
    name: 'New Jersey',
    code: 'NJ',
    country: 'USA',
    type: 'state',
    description: 'Garden State craft revival, Kane, Carton & Jersey Shore craft hubs',
    cities: [
      { name: 'Asbury Park & Jersey Shore, NJ, USA', subtext: 'Kane Brewing, Carton Brewing, Asbury Park Brewery', hubRank: 'Shore Craft Hub' },
      { name: 'Jersey City & Hoboken, NJ, USA', subtext: 'Departed Souls, 902 Brewing' },
      { name: 'Cape May, NJ, USA', subtext: 'Cape May Brewing Co & southern coast taprooms' },
    ],
  },
  {
    name: 'New Mexico',
    code: 'NM',
    country: 'USA',
    type: 'state',
    description: 'High-desert brewing, Santa Fe Brewing & Albuquerque IPA champions',
    cities: [
      { name: 'Albuquerque, NM, USA', subtext: 'Brewery District • La Cumbre (Elevated IPA), Marble, Bow & Arrow', hubRank: 'High-Desert Craft Capital' },
      { name: 'Santa Fe, NM, USA', subtext: 'Santa Fe Brewing Co, Rowley Farmhouse Ales' },
      { name: 'Taos, NM, USA', subtext: 'Taos Mesa Brewing & ski mountain taprooms' },
    ],
  },
  {
    name: 'New York',
    code: 'NY',
    country: 'USA',
    type: 'state',
    description: 'Brooklyn hazy titans (Other Half), Hudson Valley farmhouse & Finger Lakes',
    cities: [
      { name: 'New York City, NY, USA', subtext: 'Brooklyn & Queens • Other Half, Finback, SingleCut, Evil Twin', hubRank: 'Metro Hop Metropolis' },
      { name: 'Hudson Valley, NY, USA', subtext: 'Beacon & Hudson • Suarez Family Brewery, Equilibrium, Plan Bee', hubRank: 'Farmhouse & Hazy Haven' },
      { name: 'Finger Lakes & Ithaca, NY, USA', subtext: 'Ithaca Beer Co, Lucky Hare, Other Half Bloomfield', hubRank: 'Lakeside Trail' },
      { name: 'Buffalo & Rochester, NY, USA', subtext: 'Big Ditch, Mortalis Brewing, Genesee' },
    ],
  },
  {
    name: 'North Carolina',
    code: 'NC',
    country: 'USA',
    type: 'state',
    description: 'Asheville Beer City USA, South Slope & Charlotte craft hub',
    cities: [
      { name: 'Asheville, NC, USA', subtext: 'South Slope Brewing District • Wicked Weed Funkatorium, Burial Beer Co, Green Man', hubRank: 'Beer City USA' },
      { name: 'Charlotte, NC, USA', subtext: 'South End & NoDa • Wooden Robot, Resident Culture, Legion', hubRank: 'Queen City Craft' },
      { name: 'Raleigh & Durham, NC, USA', subtext: 'Triangle • Trophy, Ponysaurus, Fullsteam' },
      { name: 'Wilmington, NC, USA', subtext: 'Coastal craft trail • Wrightsville Beach Brewery, Edward Teach' },
    ],
  },
  {
    name: 'North Dakota',
    code: 'ND',
    country: 'USA',
    type: 'state',
    description: 'Northern plains craft taprooms & Fargo downtown brewing scene',
    cities: [
      { name: 'Fargo, ND, USA', subtext: 'Drekker Brewing Co (Brauhalla), Fargo Brewing', hubRank: 'Plains Sours & IPAs' },
      { name: 'Bismarck, ND, USA', subtext: 'Laughing Sun Brewing, Bismarck Brewing' },
    ],
  },
  {
    name: 'Ohio',
    code: 'OH',
    country: 'USA',
    type: 'state',
    description: 'Rust Belt craft powerhouses, Great Lakes, Fat Head’s & Columbus brew trail',
    cities: [
      { name: 'Cleveland, OH, USA', subtext: 'Ohio City • Great Lakes, Fat Head’s, Masthead, Platform', hubRank: 'Rust Belt Craft Trail' },
      { name: 'Columbus, OH, USA', subtext: 'Short North & Brewery District • Hoppin’ Frog, BrewDog USA, Seventh Son', hubRank: 'Midwest Brew Trail' },
      { name: 'Cincinnati, OH, USA', subtext: 'Over-the-Rhine • Rhinegeist, MadTree, Braxton', hubRank: 'Heritage Lager Hub' },
      { name: 'Dayton, OH, USA', subtext: 'Warped Wing, Toxic Brew Co' },
    ],
  },
  {
    name: 'Oklahoma',
    code: 'OK',
    country: 'USA',
    type: 'state',
    description: 'Prairie Artisan Ales imperial stouts & OKC craft district',
    cities: [
      { name: 'Oklahoma City, OK, USA', subtext: 'Automobile Alley • Prairie Artisan Ales, Stonecloud, Anthem', hubRank: 'Prairie Craft Hub' },
      { name: 'Tulsa, OK, USA', subtext: 'Pearl District • American Solera, Cabin Boys, Marshall' },
    ],
  },
  {
    name: 'Oregon',
    code: 'OR',
    country: 'USA',
    type: 'state',
    description: 'Beervana, Willamette Valley fresh hops, Portland & Bend mountain ales',
    cities: [
      { name: 'Portland, OR, USA', subtext: 'Central Eastside & Pearl • Breakside, Great Notion, Deschutes, Wayfinder', hubRank: 'Beervana Capital' },
      { name: 'Bend, OR, USA', subtext: 'Cascade Range • Crux Fermentation, Deschutes, Sunriver, Boneyard', hubRank: 'Mountain Ale Capital' },
      { name: 'Eugene, OR, USA', subtext: 'Ninkasi, Oakshire, ColdFire' },
      { name: 'Hood River & Columbia Gorge, OR, USA', subtext: 'pFriem Family Brewers, Full Sail, Double Mountain', hubRank: 'Pilsner & Wild Ale Mecca' },
    ],
  },
  {
    name: 'Pennsylvania',
    code: 'PA',
    country: 'USA',
    type: 'state',
    description: 'Historic brewing heritage, Tired Hands, Human Robot & Pittsburgh strip district',
    cities: [
      { name: 'Philadelphia, PA, USA', subtext: 'Fishtown & Center City • Yards, Human Robot, Tired Hands proximity, Love City', hubRank: 'Historic Lager & Ale Hub' },
      { name: 'Pittsburgh, PA, USA', subtext: 'Strip District & Lawrenceville • Dancing Gnome, Brew Gentlemen, Church Brew Works', hubRank: 'Steel City Craft' },
      { name: 'Lancaster & PA Dutch Country, PA, USA', subtext: 'Spring House, Lancaster Brewing' },
    ],
  },
  {
    name: 'Rhode Island',
    code: 'RI',
    country: 'USA',
    type: 'state',
    description: 'Ocean State craft corridor, Narragansett heritage & Providence breweries',
    cities: [
      { name: 'Providence, RI, USA', subtext: 'Long Live Beerworks, Proclamation, Narragansett Brewery', hubRank: 'Ocean State Craft' },
      { name: 'Newport, RI, USA', subtext: 'Newport Craft Brewing & coastal taprooms' },
      { name: 'Pawtucket, RI, USA', subtext: 'The Guild, Foolproof Brewing' },
    ],
  },
  {
    name: 'South Carolina',
    code: 'SC',
    country: 'USA',
    type: 'state',
    description: 'Charleston historic craft quarter & Greenville mountain foothills brewing',
    cities: [
      { name: 'Charleston, SC, USA', subtext: 'Brewery District • Westbrook (Mexican Cake), Revelry, Edmund’s Oast', hubRank: 'Holy City Craft' },
      { name: 'Greenville, SC, USA', subtext: 'Swamp Rabbit Trail • Birds Fly South, Thomas Creek' },
      { name: 'Columbia, SC, USA', subtext: 'River Rat Brewery, Columbia Craft' },
    ],
  },
  {
    name: 'South Dakota',
    code: 'SD',
    country: 'USA',
    type: 'state',
    description: 'Black Hills mountain brewing & Sioux Falls craft taprooms',
    cities: [
      { name: 'Rapid City & Black Hills, SD, USA', subtext: 'Miner Brewing, Hay Camp, Crow Peak' },
      { name: 'Sioux Falls, SD, USA', subtext: 'Fernson Brewing, Severance Brewing, Remedy' },
    ],
  },
  {
    name: 'Tennessee',
    code: 'TN',
    country: 'USA',
    type: 'state',
    description: 'Nashville Music City hops (Bearded Iris), Memphis & Smoky Mountains',
    cities: [
      { name: 'Nashville, TN, USA', subtext: 'Gulch & East Nashville • Bearded Iris, Southern Grist, Yazoo, Jackalope', hubRank: 'Music City Hops' },
      { name: 'Memphis, TN, USA', subtext: 'Wiseacre Brewing, Ghost River, Meddlesome' },
      { name: 'Knoxville & Smoky Mountains, TN, USA', subtext: 'Craft Axe Trail • Yee-Haw, Schulz Bräu, Blackberry Farm' },
    ],
  },
  {
    name: 'Texas',
    code: 'TX',
    country: 'USA',
    type: 'state',
    description: 'Hill Country wild ales (Jester King), Austin craft mecca & Dallas brew belt',
    cities: [
      { name: 'Austin, TX, USA', subtext: 'East Austin & Hill Country • Jester King, Live Oak, Pinthouse (Electric Jellyfish)', hubRank: 'Texas Craft Capital' },
      { name: 'Houston, TX, USA', subtext: 'Saint Arnold, Karbach, Spindletap, Buffalo Bayou', hubRank: 'Space City Craft' },
      { name: 'Dallas-Fort Worth, TX, USA', subtext: 'Deep Ellum, Community Beer, Peticolas, Manhattan Project', hubRank: 'DFW Craft Corridor' },
      { name: 'San Antonio, TX, USA', subtext: 'Freetail, Southerleigh, Alamo Beer' },
    ],
  },
  {
    name: 'Utah',
    code: 'UT',
    country: 'USA',
    type: 'state',
    description: 'Wasatch Mountain craft trail & Salt Lake City innovative craft brewpubs',
    cities: [
      { name: 'Salt Lake City, UT, USA', subtext: 'Epic Brewing, Squatters, Fisher Brewing, TF Brewing', hubRank: 'Wasatch Craft Hub' },
      { name: 'Park City, UT, USA', subtext: 'Wasatch Brewery & high mountain taprooms' },
      { name: 'Moab, UT, USA', subtext: 'Moab Brewery & Red Rock canyon taprooms' },
    ],
  },
  {
    name: 'Vermont',
    code: 'VT',
    country: 'USA',
    type: 'state',
    description: '#1 Craft Beer State, Hill Farmstead, The Alchemist & Lawson’s Finest Liquids',
    cities: [
      { name: 'Burlington, VT, USA', subtext: 'Lake Champlain • Foam Brewers, Zero Gravity, Switchback', hubRank: 'Top Craft State Capital' },
      { name: 'Stowe & Waterbury, VT, USA', subtext: 'Route 100 IPA Corridor • The Alchemist (Heady Topper), Lawson’s, Pro Pig', hubRank: 'IPA Heartland' },
      { name: 'Greensboro & Northeast Kingdom, VT, USA', subtext: 'Hill Farmstead Brewery (World’s Best Brewery)', hubRank: 'Saison & Farmhouse Mecca' },
      { name: 'Warren & Mad River Valley, VT, USA', subtext: 'Lawson’s Finest Liquids & Mad River Glen taprooms' },
    ],
  },
  {
    name: 'Virginia',
    code: 'VA',
    country: 'USA',
    type: 'state',
    description: 'Scott’s Addition brewery Mecca (The Veil, Hardywood) & Blue Ridge trail',
    cities: [
      { name: 'Richmond, VA, USA', subtext: 'Scott’s Addition • The Veil Brewing Co, Hardywood Park, Triple Crossing', hubRank: 'Mid-Atlantic Hotspot' },
      { name: 'Charlottesville & Blue Ridge, VA, USA', subtext: 'Nelson 151 Trail • Starr Hill, Devils Backbone, Blue Mountain' },
      { name: 'Virginia Beach & Norfolk, VA, USA', subtext: 'Smartmouth, Commonwealth Brewing, O’Connor' },
      { name: 'Alexandria & Arlington, VA, USA', subtext: 'Port City Brewing, Aslin Beer Co' },
    ],
  },
  {
    name: 'Washington',
    code: 'WA',
    country: 'USA',
    type: 'state',
    description: 'Yakima Valley hop capital, Ballard Brewery District & Seattle craft kings',
    cities: [
      { name: 'Seattle, WA, USA', subtext: 'Ballard Brewery District • Fremont, Holy Mountain, Cloudburst, Reuben’s', hubRank: 'PNW Hop Metropolis' },
      { name: 'Yakima Valley, WA, USA', subtext: 'Hop Capital of the World • Bale Breaker Brewing Co', hubRank: 'Hop Capital' },
      { name: 'Bellingham, WA, USA', subtext: 'Chuckanut Brewery, Aslan, Wander Brewing' },
      { name: 'Spokane, WA, USA', subtext: 'No-Li Brewhouse, Iron Goat, Perry Street' },
    ],
  },
  {
    name: 'West Virginia',
    code: 'WV',
    country: 'USA',
    type: 'state',
    description: 'Appalachian mountain craft outposts & river valley taprooms',
    cities: [
      { name: 'Morgantown, WV, USA', subtext: 'Chestnut Brew Works, Mountain State Brewing' },
      { name: 'Charleston, WV, USA', subtext: 'Bad Shepherd Beer Co, Fife Street' },
      { name: 'Fayetteville & New River Gorge, WV, USA', subtext: 'Bridge Brew Works & gorge taprooms' },
    ],
  },
  {
    name: 'Wisconsin',
    code: 'WI',
    country: 'USA',
    type: 'state',
    description: 'Historic Brew City Milwaukee, New Glarus (Spotted Cow) & Madison craft belt',
    cities: [
      { name: 'Milwaukee, WI, USA', subtext: 'Historic Brewing District • Lakefront, Eagle Park, Central Waters, Third Space', hubRank: 'Historic Brew City' },
      { name: 'Madison, WI, USA', subtext: 'Capital city • Ale Asylum, Karben4, Great Dane' },
      { name: 'New Glarus & Green County, WI, USA', subtext: 'New Glarus Brewing Co (Spotted Cow) sanctuary', hubRank: 'Spotted Cow Trail' },
      { name: 'Green Bay & Door County, WI, USA', subtext: 'Titletown Brewing, Door County Brewing' },
    ],
  },
  {
    name: 'Wyoming',
    code: 'WY',
    country: 'USA',
    type: 'state',
    description: 'Grand Teton mountain ales & Yellowstone gateway craft taprooms',
    cities: [
      { name: 'Jackson Hole, WY, USA', subtext: 'Snake River Brewing, Roadhouse Brewing Co', hubRank: 'Teton Craft' },
      { name: 'Cheyenne, WY, USA', subtext: 'Black Tooth Brewing, Accomplice Beer Co' },
      { name: 'Laramie, WY, USA', subtext: 'Altitude Chophouse & Brewery, Library Sports Grille' },
    ],
  },
];

export const CANADA_PROVINCES_AND_CITIES: RegionData[] = [
  {
    name: 'Ontario',
    code: 'ON',
    country: 'Canada',
    type: 'province',
    description: 'Toronto craft belt, Niagara farmhouse ales & Ottawa capital taprooms',
    cities: [
      { name: 'Toronto, ON, Canada', subtext: 'West End & Leslieville • Bellwoods, Blood Brothers, Left Field, Halo', hubRank: 'Ontario Craft Capital' },
      { name: 'Ottawa, ON, Canada', subtext: 'ByWard Market & Hintonburg • Dominion City, Beyond the Pale, Tooth and Nail' },
      { name: 'Hamilton, ON, Canada', subtext: 'Collective Arts Brewing, Clifford, Fairweather' },
      { name: 'Niagara-on-the-Lake, ON, Canada', subtext: 'Oast House Brewers, Silversmith, Niagara Ovens' },
    ],
  },
  {
    name: 'Quebec',
    code: 'QC',
    country: 'Canada',
    type: 'province',
    description: 'French-Canadian brewing mastery, wild sours, stouts & Dieu du Ciel!',
    cities: [
      { name: 'Montreal, QC, Canada', subtext: 'Mile End & Plateau • Dieu du Ciel!, Messorem Bracitorium, Pit Caribou, Mellön', hubRank: 'French-Canadian Craft Capital' },
      { name: 'Quebec City, QC, Canada', subtext: 'Saint-Roch • La Barberie, Noctem Artisans, Griendel' },
      { name: 'Eastern Townships, QC, Canada', subtext: 'Brasserie Dunham, Sutton Brouërie' },
    ],
  },
  {
    name: 'British Columbia',
    code: 'BC',
    country: 'Canada',
    type: 'province',
    description: 'Pacific Northwest Canadian brewing, Yeast Van & Vancouver Island craft',
    cities: [
      { name: 'Vancouver, BC, Canada', subtext: 'Yeast Van & Mount Pleasant • Brassneck, Superflux, 33 Acres, Parallel 49', hubRank: 'Pacific Canadian Craft Hub' },
      { name: 'Victoria, BC, Canada', subtext: 'Vancouver Island • Phillips Brewing, Driftwood (Fat Tug IPA), Hoyne' },
      { name: 'Kelowna & Okanagan, BC, Canada', subtext: 'Tree Brewing, BNA Brewing Co, Red Bird' },
      { name: 'Whistler & Squamish, BC, Canada', subtext: 'Coast Mountain Brewing, Whistler Brewing, Howe Sound' },
    ],
  },
  {
    name: 'Alberta',
    code: 'AB',
    country: 'Canada',
    type: 'province',
    description: 'Rocky Mountain gateway, Calgary craft belt & Edmonton microbreweries',
    cities: [
      { name: 'Calgary, AB, Canada', subtext: 'Inglewood & Barley Belt • The Dandy Brewing Co, Cold Garden, Cabin Brewing', hubRank: 'Barley Belt Hub' },
      { name: 'Edmonton, AB, Canada', subtext: 'Old Strathcona • Blindman, Alley Kat, Sea Change' },
      { name: 'Banff & Canmore, AB, Canada', subtext: 'Banff Ave Brewing, Grizzly Paw, Canmore Brewing' },
    ],
  },
  {
    name: 'Nova Scotia',
    code: 'NS',
    country: 'Canada',
    type: 'province',
    description: 'Atlantic maritime brewing, historic brewpubs & coastal craft trails',
    cities: [
      { name: 'Halifax, NS, Canada', subtext: 'North End • 2 Crows, Unfiltered, Propeller, Garrison', hubRank: 'Maritime Craft Hub' },
      { name: 'Dartmouth, NS, Canada', subtext: 'Battery Park, Brightwood Brewery' },
      { name: 'Cape Breton, NS, Canada', subtext: 'Big Spruce Brewing (organic farmhouse ales), Breton Brewing' },
    ],
  },
  {
    name: 'New Brunswick',
    code: 'NB',
    country: 'Canada',
    type: 'province',
    description: 'Bay of Fundy craft route & Atlantic craft taprooms',
    cities: [
      { name: 'Fredericton, NB, Canada', subtext: 'Picaroons, Grimross, Trailway Brewing', hubRank: 'Atlantic Craft Hub' },
      { name: 'Moncton, NB, Canada', subtext: 'Pump House Brewery, Tire Shack' },
      { name: 'Saint John, NB, Canada', subtext: 'Moosehead Heritage, Big Tide Brewing' },
    ],
  },
  {
    name: 'Manitoba',
    code: 'MB',
    country: 'Canada',
    type: 'province',
    description: 'Prairie craft brewing, Winnipeg Exchange District & hearty ales',
    cities: [
      { name: 'Winnipeg, MB, Canada', subtext: 'Exchange District • Nonsuch, Little Brown Jug, Kilter, Trans Canada' },
    ],
  },
  {
    name: 'Saskatchewan',
    code: 'SK',
    country: 'Canada',
    type: 'province',
    description: 'Prairie grain belt craft taprooms & Saskatoon river breweries',
    cities: [
      { name: 'Saskatoon, SK, Canada', subtext: '9 Mile Legacy, Shelter Brewing, Prairie Sun' },
      { name: 'Regina, SK, Canada', subtext: 'Rebellion Brewing, Bushwakker Brewpub' },
    ],
  },
  {
    name: 'Newfoundland and Labrador',
    code: 'NL',
    country: 'Canada',
    type: 'province',
    description: 'Rugged North Atlantic craft outposts & iceberg ales',
    cities: [
      { name: 'St. John’s, NL, Canada', subtext: 'George Street • Quidi Vidi Brewery, Bannerman, Landwash' },
    ],
  },
  {
    name: 'Prince Edward Island',
    code: 'PE',
    country: 'Canada',
    type: 'province',
    description: 'Island craft breweries & red soil shoreline taprooms',
    cities: [
      { name: 'Charlottetown, PE, Canada', subtext: 'Upstreet Craft Brewing, PEI Brewing Co, Gahan House' },
    ],
  },
  {
    name: 'Yukon',
    code: 'YT',
    country: 'Canada',
    type: 'province',
    description: 'Northern frontier ales & Yukon gold craft brewing',
    cities: [
      { name: 'Whitehorse, YT, Canada', subtext: 'Yukon Brewing Co & Winterlong Brewing' },
    ],
  },
  {
    name: 'Northwest Territories',
    code: 'NT',
    country: 'Canada',
    type: 'province',
    description: 'Subarctic craft outposts on Great Slave Lake',
    cities: [
      { name: 'Yellowknife, NT, Canada', subtext: 'NWT Brewing Company (The Woodyard Brewhouse)' },
    ],
  },
  {
    name: 'Nunavut',
    code: 'NU',
    country: 'Canada',
    type: 'province',
    description: 'Arctic craft pioneer brewing',
    cities: [
      { name: 'Iqaluit, NU, Canada', subtext: 'NuBrew (Nunavut Brewing Company)' },
    ],
  },
];

// Combine all regions for fast search
export const ALL_REGIONS: RegionData[] = [
  ...US_STATES_AND_CITIES,
  ...CANADA_PROVINCES_AND_CITIES,
];

/**
 * Build the master suggestions array with states, provinces, and cities
 */
export function buildAllSuggestions(): LocationSuggestion[] {
  const list: LocationSuggestion[] = [];

  ALL_REGIONS.forEach((region) => {
    // 1. Add the State / Province entry
    list.push({
      name: `${region.name}, ${region.country}`,
      subtext: `${region.type === 'state' ? 'State' : 'Province'} in ${region.country} • ${region.description}`,
      type: region.type,
      stateOrProvince: region.name,
      code: region.code,
      country: region.country,
      craftBeerHubRank: `${region.type === 'state' ? 'State' : 'Province'}: ${region.name}`,
    });

    // 2. Add cities under this State / Province
    region.cities.forEach((city) => {
      list.push({
        name: city.name,
        subtext: city.subtext,
        type: 'city',
        stateOrProvince: region.name,
        code: region.code,
        country: region.country,
        craftBeerHubRank: city.hubRank,
      });
    });
  });

  return list;
}

export const ALL_LOCATION_SUGGESTIONS: LocationSuggestion[] = buildAllSuggestions();

/**
 * Filter matching suggestions for user query.
 * If user enters "Vermont" or "ver", it prioritizes "Vermont, USA" and Vermont cities.
 * If user enters "Ontario" or "ont", it prioritizes "Ontario, Canada" and Ontario cities.
 * If user enters "Denver", it finds "Denver, CO, USA".
 */
export function getMatchingLocations(query: string, maxResults: number = 8): LocationSuggestion[] {
  if (!query || query.trim().length === 0) {
    // Default top craft destinations
    const defaults = [
      'Vermont, USA',
      'Burlington, VT, USA',
      'Stowe & Waterbury, VT, USA',
      'Portland, ME, USA',
      'San Diego, CA, USA',
      'Denver, CO, USA',
      'Asheville, NC, USA',
      'Montreal, QC, Canada',
      'Ontario, Canada',
      'Toronto, ON, Canada',
      'Vancouver, BC, Canada',
    ];
    return ALL_LOCATION_SUGGESTIONS.filter((item) => defaults.includes(item.name)).slice(0, maxResults);
  }

  const clean = query.trim().toLowerCase();

  // Find if there is a matching state / province by name, code, or query
  const matchedRegion = ALL_REGIONS.find((r) => {
    const nameLower = r.name.toLowerCase();
    const codeLower = r.code.toLowerCase();
    return (
      nameLower === clean ||
      codeLower === clean ||
      nameLower.startsWith(clean) ||
      clean.includes(nameLower) ||
      (clean.length >= 2 && codeLower === clean)
    );
  });

  const exactStateMatches: LocationSuggestion[] = [];
  const regionalCityMatches: LocationSuggestion[] = [];
  const generalMatches: LocationSuggestion[] = [];

  if (matchedRegion) {
    // 1. Put the state/province itself at the very top! (e.g. "Vermont, USA" or "Ontario, Canada")
    const stateCard: LocationSuggestion = {
      name: `${matchedRegion.name}, ${matchedRegion.country}`,
      subtext: `${matchedRegion.type === 'state' ? 'State' : 'Province'} in ${matchedRegion.country} • ${matchedRegion.description}`,
      type: matchedRegion.type,
      stateOrProvince: matchedRegion.name,
      code: matchedRegion.code,
      country: matchedRegion.country,
      craftBeerHubRank: `${matchedRegion.type === 'state' ? 'State' : 'Province'} to Cover`,
    };
    exactStateMatches.push(stateCard);

    // 2. Put all cities in this state/province next
    matchedRegion.cities.forEach((c) => {
      regionalCityMatches.push({
        name: c.name,
        subtext: c.subtext,
        type: 'city',
        stateOrProvince: matchedRegion.name,
        code: matchedRegion.code,
        country: matchedRegion.country,
        craftBeerHubRank: c.hubRank,
      });
    });
  }

  // 3. Search through all suggestions for general matches
  ALL_LOCATION_SUGGESTIONS.forEach((item) => {
    const nameLower = item.name.toLowerCase();
    const subtextLower = item.subtext.toLowerCase();
    const stateLower = item.stateOrProvince?.toLowerCase() || '';
    const codeLower = item.code?.toLowerCase() || '';

    const isMatch =
      nameLower.includes(clean) ||
      subtextLower.includes(clean) ||
      stateLower.includes(clean) ||
      codeLower === clean;

    const alreadyAdded =
      exactStateMatches.some((e) => e.name === item.name) ||
      regionalCityMatches.some((r) => r.name === item.name);

    if (isMatch && !alreadyAdded) {
      generalMatches.push(item);
    }
  });

  const combined = [
    ...exactStateMatches,
    ...regionalCityMatches,
    ...generalMatches,
  ];

  return combined.slice(0, maxResults);
}
