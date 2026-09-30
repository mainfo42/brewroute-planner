#!/usr/bin/env python3
import json

MORE_USA = [
    # MINNESOTA
    {
        "regionKeywords": ["minnesota", "mn", "minneapolis", "st. paul", "st paul", "twin cities", "north loop"],
        "stateOrProvince": "Minnesota",
        "country": "USA",
        "breweries": [
            {
                "name": "Surly Brewing Co.",
                "tagline": "Minneapolis colossal destination brewery featuring world-class Furious IPA and destination beer garden",
                "address": "520 Malcolm Ave SE, Minneapolis, MN 55414",
                "city": "Minneapolis",
                "state": "MN",
                "country": "USA",
                "lat": 44.9732,
                "lng": -93.2098,
                "googleScore": 4.7,
                "googleCount": "5,100+ reviews",
                "untappdScore": 4.65,
                "untappdCount": "390k check-ins",
                "rateBeerScore": 4.72,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "1,100+ reviews",
                "beerAdvocateScore": 4.75,
                "beerAdvocateCount": "9,800+ ratings",
                "suggestedDurationMin": 90,
                "bestTimeToVisit": "1:30 PM for Beer Hall dining and outdoor fires",
                "foodHighlights": "House-smoked brisket, spent-grain pizzas, and warm pretzels with beer cheese.",
                "atmosphere": "Monumental two-story destination Beer Hall with sprawling festival lawn and fire pits.",
                "beerHighlights": [
                    { "name": "Furious", "style": "American IPA (6.7% ABV)", "abv": "6.7%", "description": "Aggressively hopped amber IPA with zesty citrus, pine, and rich English malt backbone." },
                    { "name": "Axe Man", "style": "American IPA (7.2% ABV)", "abv": "7.2%", "description": "Double dry-hopped with Citra and Mosaic on golden promise malt for lush tropical mango." }
                ],
                "websiteUrl": "https://surlybrewing.com/"
            },
            {
                "name": "Modist Brewing Co.",
                "tagline": "Innovative North Loop Minneapolis brewery utilizing mash filter technology for custom-grain hazies and lagers",
                "address": "505 N 3rd St, Minneapolis, MN 55401",
                "city": "Minneapolis",
                "state": "MN",
                "country": "USA",
                "lat": 44.9852,
                "lng": -93.2758,
                "googleScore": 4.8,
                "googleCount": "1,600+ reviews",
                "untappdScore": 4.66,
                "untappdCount": "88k check-ins",
                "rateBeerScore": 4.65,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "120+ reviews",
                "beerAdvocateScore": 4.68,
                "beerAdvocateCount": "1,850+ ratings",
                "suggestedDurationMin": 75,
                "bestTimeToVisit": "3:00 PM for North Loop craft stroll",
                "foodHighlights": "Rotating food trucks, local artisan dumplings, and soft baked pretzels.",
                "atmosphere": "Sleek industrial-modern taproom buzzing with downtown energy in the historic warehouse district.",
                "beerHighlights": [
                    { "name": "Dreamyard", "style": "New England IPA (7.1% ABV)", "abv": "7.1%", "description": "Brewed with 100% wheat and oats and Citra/Denali hops for a cloud-like tropical juice explosion." },
                    { "name": "First Call", "style": "Cold Brew Coffee Lager (6.5% ABV)", "abv": "6.5%", "description": "Golden blonde lager infused with light roast cold brew coffee beans and milk sugar." }
                ],
                "websiteUrl": "https://modistbrewing.com/"
            }
        ],
        "hotels": [
            {
                "name": "Hewing Hotel (Minneapolis North Loop)",
                "type": "hotel",
                "priceCategory": "over_200",
                "estimatedPricePerNight": "$235 / night",
                "address": "300 N Washington Ave, Minneapolis, MN 55401",
                "city": "Minneapolis",
                "state": "MN",
                "lat": 44.9845,
                "lng": -93.2725,
                "description": "Boutique timber-and-brick luxury hotel with rooftop pool and Nordic sauna in the brewery quarter.",
                "amenities": ["Rooftop Lounge & Pool", "Nordic Sauna", "Fitness Center"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Hewing+Hotel+Minneapolis"
            }
        ],
        "airbnbs": [
            {
                "name": "North Loop Historic Warehouse Loft",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$145 / night",
                "address": "Washington Ave N, Minneapolis, MN 55401",
                "city": "Minneapolis",
                "state": "MN",
                "lat": 44.9865,
                "lng": -93.2745,
                "description": "Walk to 6+ craft breweries and award-winning dining in the Twin Cities premier arts district.",
                "amenities": ["Full Kitchen", "Exposed Brick", "Fast Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/North+Loop+Minneapolis+Airbnb"
            }
        ]
    },

    # INDIANA
    {
        "regionKeywords": ["indiana", "in", "indianapolis", "indy", "munster", "bloomington", "broad ripple", "fletcher place"],
        "stateOrProvince": "Indiana",
        "country": "USA",
        "breweries": [
            {
                "name": "Sun King Brewery",
                "tagline": "Indianapolis downtown brewing powerhouse famed for Sunlight Cream Ale and Scottish ales",
                "address": "135 N College Ave, Indianapolis, IN 46202",
                "city": "Indianapolis",
                "state": "IN",
                "country": "USA",
                "lat": 39.7692,
                "lng": -86.1458,
                "googleScore": 4.7,
                "googleCount": "2,800+ reviews",
                "untappdScore": 4.54,
                "untappdCount": "290k check-ins",
                "rateBeerScore": 4.58,
                "tripAdvisorScore": 4.6,
                "tripAdvisorCount": "580+ reviews",
                "beerAdvocateScore": 4.60,
                "beerAdvocateCount": "5,200+ ratings",
                "suggestedDurationMin": 80,
                "bestTimeToVisit": "2:00 PM for downtown patio flights",
                "foodHighlights": "Tacos, loaded nachos, and smash burgers from the on-site kitchen.",
                "atmosphere": "Vibrant industrial taproom with games, outdoor patio, and extensive taplist.",
                "beerHighlights": [
                    { "name": "Sunlight Cream Ale", "style": "Cream Ale (5.3% ABV)", "abv": "5.3%", "description": "GABF Gold Medal winner with crisp malt sweetness and smooth clean finish." },
                    { "name": "Wee Mac", "style": "Scottish Ale (6.1% ABV)", "abv": "6.1%", "description": "Rich copper ale boasting toasted toffee, hazelnut, and caramel malt complexity." }
                ],
                "websiteUrl": "https://www.sunkingbrewing.com/"
            },
            {
                "name": "3 Floyds Brewing",
                "tagline": "Munster Indiana legendary heavy-metal craft innovator famous for Zombie Dust Undead Pale Ale and Dark Lord",
                "address": "9750 Indiana Pkwy, Munster, IN 46321",
                "city": "Munster",
                "state": "IN",
                "country": "USA",
                "lat": 41.5358,
                "lng": -87.5165,
                "googleScore": 4.8,
                "googleCount": "3,400+ reviews",
                "untappdScore": 4.75,
                "untappdCount": "410k check-ins",
                "rateBeerScore": 4.82,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "890+ reviews",
                "beerAdvocateScore": 4.85,
                "beerAdvocateCount": "14,500+ ratings",
                "suggestedDurationMin": 85,
                "bestTimeToVisit": "1:00 PM for fresh Zombie Dust cans and draft pours",
                "foodHighlights": "World-class taproom pub fare, gourmet sausages, and Bavarian pretzels.",
                "atmosphere": "Revered craft sanctuary with heavy metal decor, comic murals, and electric energy.",
                "beerHighlights": [
                    { "name": "Zombie Dust", "style": "Undead Pale Ale (6.2% ABV)", "abv": "6.2%", "description": "Single-hopped with 100% Citra hops, recognized as one of the greatest hoppy ales ever created." },
                    { "name": "Gumballhead", "style": "American Wheat Ale (5.6% ABV)", "abv": "5.6%", "description": "Amarillo-hopped refreshing wheat beer with crisp peach, grapefruit, and lemon aromatics." }
                ],
                "websiteUrl": "https://www.3floyds.com/"
            }
        ],
        "hotels": [
            {
                "name": "Bottleworks Hotel (Indianapolis)",
                "type": "hotel",
                "priceCategory": "over_200",
                "estimatedPricePerNight": "$240 / night",
                "address": "850 Massachusetts Ave, Indianapolis, IN 46204",
                "city": "Indianapolis",
                "state": "IN",
                "lat": 39.7785,
                "lng": -86.1435,
                "description": "Luxurious Art Deco boutique hotel in a restored 1930s Coca-Cola bottling plant on Mass Ave.",
                "amenities": ["The Garage Food Hall", "Pinheads Bowling", "Spa", "Free Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Bottleworks+Hotel+Indianapolis"
            }
        ],
        "airbnbs": [
            {
                "name": "Fletcher Place Historic Brick Cottage",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$125 / night",
                "address": "Virginia Ave, Indianapolis, IN 46203",
                "city": "Indianapolis",
                "state": "IN",
                "lat": 39.7585,
                "lng": -86.1445,
                "description": "Walk to Sun King and Mass Ave cultural trail breweries directly from Virginia Avenue.",
                "amenities": ["Full Kitchen", "Private Garden", "Fast Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Fletcher+Place+Indianapolis+Airbnb"
            }
        ]
    },

    # VIRGINIA & WASHINGTON DC
    {
        "regionKeywords": ["virginia", "va", "dc", "washington dc", "richmond", "alexandria", "arlington", "scott's addition", "rva"],
        "stateOrProvince": "Virginia & DC",
        "country": "USA",
        "breweries": [
            {
                "name": "The Veil Brewing Co.",
                "tagline": "Richmond Scott's Addition global craft destination famous for cutting-edge hazies, fruited sours, and lagers",
                "address": "1301 Roseneath Rd, Richmond, VA 23230",
                "city": "Richmond",
                "state": "VA",
                "country": "USA",
                "lat": 37.5678,
                "lng": -77.4762,
                "googleScore": 4.8,
                "googleCount": "1,950+ reviews",
                "untappdScore": 4.78,
                "untappdCount": "220k check-ins",
                "rateBeerScore": 4.80,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "240+ reviews",
                "beerAdvocateScore": 4.80,
                "beerAdvocateCount": "4,100+ ratings",
                "suggestedDurationMin": 80,
                "bestTimeToVisit": "2:00 PM for taproom flights in Scott's Addition",
                "foodHighlights": "Nokoribi Japanese street food and yakitori kitchen on-site.",
                "atmosphere": "Architectural masterpiece taproom with sunny patio and buzzing craft crowd.",
                "beerHighlights": [
                    { "name": "Master Shredder", "style": "American IPA (5.5% ABV)", "abv": "5.5%", "description": "Velvety, wheat-heavy IPA dry-hopped with Citra, Mosaic, and Galaxy hops." },
                    { "name": "Tefnut", "style": "Imperial Fruited Sour (10.0% ABV)", "abv": "10.0%", "description": "Collaboration smoothie sour saturated with hundreds of pounds of blackberry and blueberry." }
                ],
                "websiteUrl": "https://www.theveilbrewing.com/"
            },
            {
                "name": "Port City Brewing Company",
                "tagline": "Alexandria award-winning craft brewery producing benchmark Belgian Wit and Monumental IPA near Washington DC",
                "address": "3950 Wheeler Ave, Alexandria, VA 22304",
                "city": "Alexandria",
                "state": "VA",
                "country": "USA",
                "lat": 38.8085,
                "lng": -77.1012,
                "googleScore": 4.7,
                "googleCount": "1,600+ reviews",
                "untappdScore": 4.58,
                "untappdCount": "140k check-ins",
                "rateBeerScore": 4.60,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "390+ reviews",
                "beerAdvocateScore": 4.62,
                "beerAdvocateCount": "3,400+ ratings",
                "suggestedDurationMin": 80,
                "bestTimeToVisit": "1:30 PM for tasting room tours and pretzel flights",
                "foodHighlights": "Gourmet food trucks, local bakery soft pretzels, and artisan bratwursts.",
                "atmosphere": "Welcoming, spotless production brewery taproom with indoor beer garden seating.",
                "beerHighlights": [
                    { "name": "Optimal Wit", "style": "Belgian-Style White Ale (4.9% ABV)", "abv": "4.9%", "description": "GABF Gold Medal winner brewed with Virginia wheat, Spanish orange peel, and freshly ground coriander." },
                    { "name": "Monumental IPA", "style": "American IPA (6.3% ABV)", "abv": "6.3%", "description": "Rich floral and pine hop character balanced by toasted crystal malts." }
                ],
                "websiteUrl": "https://www.portcitybrewing.com/"
            }
        ],
        "hotels": [
            {
                "name": "Quirk Hotel Richmond",
                "type": "hotel",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$185 / night",
                "address": "201 W Broad St, Richmond, VA 23220",
                "city": "Richmond",
                "state": "VA",
                "lat": 37.5465,
                "lng": -77.4445,
                "description": "Art-centric boutique hotel with acclaimed rooftop bar in downtown Richmond near the brewery bus route.",
                "amenities": ["Rooftop Bar", "Contemporary Art Gallery", "Valet Parking"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Quirk+Hotel+Richmond"
            }
        ],
        "airbnbs": [
            {
                "name": "Scott's Addition Brewery Loft",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$140 / night",
                "address": "Broad St, Richmond, VA 23230",
                "city": "Richmond",
                "state": "VA",
                "lat": 37.5645,
                "lng": -77.4725,
                "description": "Walk to 10+ craft breweries, cideries, and tasting rooms in Scott's Addition.",
                "amenities": ["Full Kitchen", "High Ceilings", "Free Parking"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Scotts+Addition+Richmond+Airbnb"
            }
        ]
    },

    # LOUISIANA
    {
        "regionKeywords": ["louisiana", "la", "new orleans", "nola", "covington", "french quarter", "bywater", "lower garden district"],
        "stateOrProvince": "Louisiana",
        "country": "USA",
        "breweries": [
            {
                "name": "Urban South Brewery",
                "tagline": "New Orleans Tchoupitoulas Street craft institution brewing Paradise Park lager and Holy Roller IPA",
                "address": "1645 Tchoupitoulas St, New Orleans, LA 70130",
                "city": "New Orleans",
                "state": "LA",
                "country": "USA",
                "lat": 29.9325,
                "lng": -90.0682,
                "googleScore": 4.8,
                "googleCount": "1,750+ reviews",
                "untappdScore": 4.62,
                "untappdCount": "140k check-ins",
                "rateBeerScore": 4.60,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "220+ reviews",
                "beerAdvocateScore": 4.62,
                "beerAdvocateCount": "2,400+ ratings",
                "suggestedDurationMin": 85,
                "bestTimeToVisit": "2:00 PM for taproom games and crawfish boils",
                "foodHighlights": "Seasonal crawfish boils, New Orleans hot sausage po'boys, and smash burgers.",
                "atmosphere": "Massive warehouse taproom with arcade games, bounce houses, and family-friendly patio.",
                "beerHighlights": [
                    { "name": "Holy Roller", "style": "Hazy IPA (6.3% ABV)", "abv": "6.3%", "description": "Juicy flagship IPA packed with Citra and Mosaic hops for bright citrus and mango punch." },
                    { "name": "Paradise Park", "style": "American Lager (4.5% ABV)", "abv": "4.5%", "description": "Ultra-crisp pilsner-style lager tailored for warm Louisiana afternoons." }
                ],
                "websiteUrl": "https://urbansouthbrewery.com/"
            },
            {
                "name": "Courtyard Brewery",
                "tagline": "New Orleans Lower Garden District experimental nanobrewery brewing boundary-pushing IPAs and farmhouse ales",
                "address": "1160 Camp St, New Orleans, LA 70130",
                "city": "New Orleans",
                "state": "LA",
                "country": "USA",
                "lat": 29.9412,
                "lng": -90.0735,
                "googleScore": 4.8,
                "googleCount": "890+ reviews",
                "untappdScore": 4.65,
                "untappdCount": "42k check-ins",
                "rateBeerScore": 4.64,
                "tripAdvisorScore": 4.8,
                "tripAdvisorCount": "110+ reviews",
                "beerAdvocateScore": 4.66,
                "beerAdvocateCount": "1,150+ ratings",
                "suggestedDurationMin": 75,
                "bestTimeToVisit": "3:00 PM for shaded courtyard pints",
                "foodHighlights": "Rotating food trucks featuring Cajun boudin, tacos, and artisan barbecue.",
                "atmosphere": "Charming, artistic open-air courtyard garden shaded by tropical foliage.",
                "beerHighlights": [
                    { "name": "Sonic Youthth", "style": "Double IPA (8.0% ABV)", "abv": "8.0%", "description": "Dank, resinous imperial IPA dripping with stonefruit and pine hop character." },
                    { "name": "Preach", "style": "Farmhouse Saison (5.8% ABV)", "abv": "5.8%", "description": "Earthy, rustic saison conditioned with proprietary mixed yeast cultures." }
                ],
                "websiteUrl": "https://courtyardbrewery.com/"
            }
        ],
        "hotels": [
            {
                "name": "The Higgins Hotel New Orleans, Curio Collection",
                "type": "hotel",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$175 / night",
                "address": "1000 Magazine St, New Orleans, LA 70130",
                "city": "New Orleans",
                "state": "LA",
                "lat": 29.9435,
                "lng": -90.0695,
                "description": "Elegant 1940s-themed hotel in the Arts / Warehouse District near Tchoupitoulas breweries.",
                "amenities": ["Rooftop Lounge", "Restaurant", "Fitness Center"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/The+Higgins+Hotel+New+Orleans"
            }
        ],
        "airbnbs": [
            {
                "name": "Lower Garden District Historic Shotgun",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$135 / night",
                "address": "Magazine St, New Orleans, LA 70130",
                "city": "New Orleans",
                "state": "LA",
                "lat": 29.9385,
                "lng": -90.0715,
                "description": "Classic New Orleans high-ceiling shotgun house steps from Magazine Street bars and breweries.",
                "amenities": ["Full Kitchen", "Front Porch", "Fast Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Lower+Garden+District+Airbnb"
            }
        ]
    }
]

from scripts.data_usa import ADDITIONAL_USA_REGIONS
existing_states = set(r['stateOrProvince'] for r in ADDITIONAL_USA_REGIONS)
for r in MORE_USA:
    if r['stateOrProvince'] not in existing_states:
        ADDITIONAL_USA_REGIONS.append(r)

with open('scripts/data_usa.py', 'w') as f:
    f.write("# Additional United States Craft Beer Regions\n\n")
    f.write("ADDITIONAL_USA_REGIONS = ")
    f.write(json.dumps(ADDITIONAL_USA_REGIONS, indent=2, ensure_ascii=False))
    f.write("\n")

print(f"Updated scripts/data_usa.py with MORE_USA! Total US regions: {len(ADDITIONAL_USA_REGIONS)}")
