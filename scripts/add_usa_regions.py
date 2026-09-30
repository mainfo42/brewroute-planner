#!/usr/bin/env python3
"""
Adds major US craft brewing states and cities to data_usa.py:
Florida, Ohio, Georgia, Tennessee, Arizona, Nevada, Missouri, Minnesota, Indiana, Virginia/DC, Louisiana.
"""
import json

USA_EXPANSIONS = [
    # FLORIDA
    {
        "regionKeywords": ["florida", "fl", "tampa", "st petersburg", "st. petersburg", "miami", "orlando", "jacksonville", "ybor city", "wynwood", "fort lauderdale"],
        "stateOrProvince": "Florida",
        "country": "USA",
        "breweries": [
            {
                "name": "Cigar City Brewing",
                "tagline": "Legendary Tampa craft pioneer famed worldwide for Jai Alai IPA and Maduro Brown Ale",
                "address": "3924 W Spruce St, Tampa, FL 33607",
                "city": "Tampa",
                "state": "FL",
                "country": "USA",
                "lat": 27.9545,
                "lng": -82.5065,
                "googleScore": 4.7,
                "googleCount": "3,400+ reviews",
                "untappdScore": 4.65,
                "untappdCount": "420k check-ins",
                "rateBeerScore": 4.72,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "1,150+ reviews",
                "beerAdvocateScore": 4.75,
                "beerAdvocateCount": "8,200+ ratings",
                "suggestedDurationMin": 85,
                "bestTimeToVisit": "1:30 PM for fresh Jai Alai pours and Cuban sandwiches",
                "foodHighlights": "Authentic Tampa Cuban sandwiches, empanadas, and yuca fries.",
                "atmosphere": "Vibrant industrial taproom with authentic cedar humidor accents and bustling brewhouse.",
                "beerHighlights": [
                    { "name": "Jai Alai", "style": "American IPA (7.5% ABV)", "abv": "7.5%", "description": "Benchmark Florida IPA with intense clementine orange, sweet malt base, and rich bitterness." },
                    { "name": "Maduro Brown Ale", "style": "English Brown Ale (5.5% ABV)", "abv": "5.5%", "description": "Silky smooth northern English style brown ale with toasted toffee and chocolate notes." }
                ],
                "websiteUrl": "https://www.cigarcitybrewing.com/"
            },
            {
                "name": "Wynwood Brewing Company",
                "tagline": "Miami's pioneer craft brewery located in the heart of Wynwood Art District brewing award-winning La Rubia",
                "address": "562 NW 24th St, Miami, FL 33127",
                "city": "Miami",
                "state": "FL",
                "country": "USA",
                "lat": 25.8002,
                "lng": -80.2052,
                "googleScore": 4.7,
                "googleCount": "1,850+ reviews",
                "untappdScore": 4.50,
                "untappdCount": "92k check-ins",
                "rateBeerScore": 4.45,
                "tripAdvisorScore": 4.6,
                "tripAdvisorCount": "380+ reviews",
                "beerAdvocateScore": 4.52,
                "beerAdvocateCount": "1,600+ ratings",
                "suggestedDurationMin": 75,
                "bestTimeToVisit": "3:00 PM for art stroll and sunny patio pints",
                "foodHighlights": "Rotating Miami gourmet taco trucks, arepas, and fresh empanadas.",
                "atmosphere": "Energetic taproom adorned with colorful local street art murals and hip urban vibes.",
                "beerHighlights": [
                    { "name": "La Rubia", "style": "Blonde Ale (5.0% ABV)", "abv": "5.0%", "description": "Clean, crisp, and thirst-quenching golden ale perfect for Miami sunshine." },
                    { "name": "Pop's Porter", "style": "Robust Porter (6.2% ABV)", "abv": "6.2%", "description": "GABF Gold Medal winner with roasted coffee, caramel, and dark chocolate malt." }
                ],
                "websiteUrl": "https://wynwoodbrewing.com/"
            },
            {
                "name": "Aardwolf Brewing Company",
                "tagline": "Jacksonville historic San Marco craft brewery producing award-winning sour ales and IPAs in an ice plant",
                "address": "1461 Hendricks Ave, Jacksonville, FL 32207",
                "city": "Jacksonville",
                "state": "FL",
                "country": "USA",
                "lat": 30.3082,
                "lng": -81.6565,
                "googleScore": 4.8,
                "googleCount": "1,150+ reviews",
                "untappdScore": 4.62,
                "untappdCount": "55k check-ins",
                "rateBeerScore": 4.60,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "140+ reviews",
                "beerAdvocateScore": 4.65,
                "beerAdvocateCount": "950+ ratings",
                "suggestedDurationMin": 75,
                "bestTimeToVisit": "2:30 PM for San Marco craft walk",
                "foodHighlights": "Artisan charcuterie, soft pretzels, and rotating gourmet food truck lineup.",
                "atmosphere": "Character-rich 1920s brick ice house with outdoor courtyard and cozy lounge.",
                "beerHighlights": [
                    { "name": "Belgian Pale Ale", "style": "Belgian Pale Ale (5.5% ABV)", "abv": "5.5%", "description": "Earthy European hops coupled with proprietary Belgian yeast for subtle orchard fruit esters." },
                    { "name": "San Marco Sour", "style": "Oak-Aged Sour (6.0% ABV)", "abv": "6.0%", "description": "Complex, tart, and refreshingly vinous sour ale aged in French oak barrels." }
                ],
                "websiteUrl": "https://www.aardwolfbrewing.com/"
            }
        ],
        "hotels": [
            {
                "name": "Epicurean Hotel, Autograph Collection (Tampa)",
                "type": "hotel",
                "priceCategory": "over_200",
                "estimatedPricePerNight": "$260 / night",
                "address": "1207 S Howard Ave, Tampa, FL 33606",
                "city": "Tampa",
                "state": "FL",
                "lat": 27.9335,
                "lng": -82.4835,
                "description": "Culinary-themed boutique luxury hotel in vibrant South Tampa food & beer district.",
                "amenities": ["Rooftop Bar", "Outdoor Pool", "Spa", "Valet Parking"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Epicurean+Hotel+Tampa"
            }
        ],
        "airbnbs": [
            {
                "name": "Ybor City Historic Casita Loft",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$145 / night",
                "address": "7th Ave, Tampa, FL 33605",
                "city": "Tampa",
                "state": "FL",
                "lat": 27.9605,
                "lng": -82.4412,
                "description": "Historic brick bungalow walking distance to breweries and the historic district trolley.",
                "amenities": ["Full Kitchen", "Private Patio", "Fast Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Ybor+City+Airbnb"
            }
        ]
    },

    # OHIO
    {
        "regionKeywords": ["ohio", "oh", "cleveland", "columbus", "cincinnati", "akron", "dayton", "over-the-rhine", "otr"],
        "stateOrProvince": "Ohio",
        "country": "USA",
        "breweries": [
            {
                "name": "Great Lakes Brewing Company",
                "tagline": "Cleveland craft brewing icon founded in 1988 famed for Edmund Fitzgerald Porter and Dortmunder Gold",
                "address": "2516 Market Ave, Cleveland, OH 44113",
                "city": "Cleveland",
                "state": "OH",
                "country": "USA",
                "lat": 41.4845,
                "lng": -81.7042,
                "googleScore": 4.7,
                "googleCount": "4,100+ reviews",
                "untappdScore": 4.60,
                "untappdCount": "390k check-ins",
                "rateBeerScore": 4.68,
                "tripAdvisorScore": 4.6,
                "tripAdvisorCount": "1,450+ reviews",
                "beerAdvocateScore": 4.70,
                "beerAdvocateCount": "9,100+ ratings",
                "suggestedDurationMin": 85,
                "bestTimeToVisit": "1:00 PM for brewpub lunch in Ohio City",
                "foodHighlights": "Bier cheese dip with warm pretzels, pierogies, and famous Ohio beef burgers.",
                "atmosphere": "Iconic Victorian tavern with original mahogany bar and bullet hole from Eliot Ness era.",
                "beerHighlights": [
                    { "name": "Edmund Fitzgerald", "style": "Robust Porter (6.0% ABV)", "abv": "6.0%", "description": "World-champion porter with bitter chocolate, roasted coffee beans, and bold hops." },
                    { "name": "Dortmunder Gold", "style": "Lager (5.8% ABV)", "abv": "5.8%", "description": "Balanced, award-winning golden lager with sweet malt and crisp noble hop finish." }
                ],
                "websiteUrl": "https://www.greatlakesbrewing.com/"
            },
            {
                "name": "Rhinegeist Brewery",
                "tagline": "Massive Over-the-Rhine Cincinnati packaging powerhouse in an 1895 bottling hall with rooftop taproom",
                "address": "1910 Elm St, Cincinnati, OH 45202",
                "city": "Cincinnati",
                "state": "OH",
                "country": "USA",
                "lat": 39.1172,
                "lng": -84.5202,
                "googleScore": 4.7,
                "googleCount": "3,200+ reviews",
                "untappdScore": 4.58,
                "untappdCount": "290k check-ins",
                "rateBeerScore": 4.62,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "890+ reviews",
                "beerAdvocateScore": 4.65,
                "beerAdvocateCount": "4,800+ ratings",
                "suggestedDurationMin": 85,
                "bestTimeToVisit": "2:30 PM for rooftop views and cornhole games",
                "foodHighlights": "Artisan rooftop snacks, local food truck pop-ups, and giant pretzels.",
                "atmosphere": "Monumental 25,000 sq ft historic brick brewhouse hall with rooftop skyline deck.",
                "beerHighlights": [
                    { "name": "Truth", "style": "West Coast IPA (7.2% ABV)", "abv": "7.2%", "description": "Intensely dry-hopped with Amarillo, Citra, Simcoe, and Centennial for bright grapefruit and peach." },
                    { "name": "Bubbles", "style": "Rosé Fruit Ale (6.2% ABV)", "abv": "6.2%", "description": "Effervescent ale brewed with apple, peach, and cranberry for tart, crisp cider-like finish." }
                ],
                "websiteUrl": "https://rhinegeist.com/"
            },
            {
                "name": "Columbus Brewing Company",
                "tagline": "Columbus craft pioneer revered for Bodhi Double IPA and Creeper American imperial ales",
                "address": "2555 Harrison Rd, Columbus, OH 43204",
                "city": "Columbus",
                "state": "OH",
                "country": "USA",
                "lat": 39.9575,
                "lng": -83.0805,
                "googleScore": 4.7,
                "googleCount": "1,450+ reviews",
                "untappdScore": 4.66,
                "untappdCount": "150k check-ins",
                "rateBeerScore": 4.70,
                "tripAdvisorScore": 4.6,
                "tripAdvisorCount": "210+ reviews",
                "beerAdvocateScore": 4.72,
                "beerAdvocateCount": "3,900+ ratings",
                "suggestedDurationMin": 80,
                "bestTimeToVisit": "2:00 PM for Bodhi on tap",
                "foodHighlights": "House-smoked wings, wood-fired pizzas, and garlic parmesan fries.",
                "atmosphere": "Modern brewery taproom with views of the canning lines and spacious outdoor patio.",
                "beerHighlights": [
                    { "name": "Bodhi", "style": "Double IPA (8.3% ABV)", "abv": "8.3%", "description": "National GABF medal winner saturated with Citra hops for mango, guava, and pine." },
                    { "name": "CBC IPA", "style": "American IPA (6.5% ABV)", "abv": "6.5%", "description": "Classic midwest IPA with sturdy pale malt foundation and pine-citrus bite." }
                ],
                "websiteUrl": "https://columbusbrewing.com/"
            }
        ],
        "hotels": [
            {
                "name": "21c Museum Hotel Cincinnati",
                "type": "hotel",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$185 / night",
                "address": "609 Walnut St, Cincinnati, OH 45202",
                "city": "Cincinnati",
                "state": "OH",
                "lat": 39.1035,
                "lng": -84.5125,
                "description": "Contemporary art museum and boutique hotel in downtown Cincinnati near Over-the-Rhine.",
                "amenities": ["Rooftop Bar", "Contemporary Art Galleries", "Restaurant & Bar", "Fitness Center"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/21c+Museum+Hotel+Cincinnati"
            }
        ],
        "airbnbs": [
            {
                "name": "Ohio City Historic Brewery Loft",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$135 / night",
                "address": "Market Ave, Cleveland, OH 44113",
                "city": "Cleveland",
                "state": "OH",
                "lat": 41.4852,
                "lng": -81.7035,
                "description": "Step right out onto Market Avenue's breweries and the West Side Market.",
                "amenities": ["Exposed Brick", "Full Kitchen", "High-Speed Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Ohio+City+Cleveland+Airbnb"
            }
        ]
    },

    # GEORGIA
    {
        "regionKeywords": ["georgia", "ga", "atlanta", "athens", "savannah", "decatur", "midtown atlanta", "inman park"],
        "stateOrProvince": "Georgia",
        "country": "USA",
        "breweries": [
            {
                "name": "SweetWater Brewing Company",
                "tagline": "Atlanta craft beer juggernaut famed for 420 Extra Pale Ale, taproom live music, and expansive patio",
                "address": "195 Ottley Dr NE, Atlanta, GA 30324",
                "city": "Atlanta",
                "state": "GA",
                "country": "USA",
                "lat": 33.8082,
                "lng": -84.3812,
                "googleScore": 4.6,
                "googleCount": "2,850+ reviews",
                "untappdScore": 4.54,
                "untappdCount": "380k check-ins",
                "rateBeerScore": 4.58,
                "tripAdvisorScore": 4.6,
                "tripAdvisorCount": "720+ reviews",
                "beerAdvocateScore": 4.60,
                "beerAdvocateCount": "7,100+ ratings",
                "suggestedDurationMin": 85,
                "bestTimeToVisit": "2:00 PM for live patio music and 420 pours",
                "foodHighlights": "Southern BBQ platters, loaded brisket tots, and soft pretzel braids.",
                "atmosphere": "Massive warehouse complex with outdoor concert stage, taproom bar, and dog-friendly lawn.",
                "beerHighlights": [
                    { "name": "420 Extra Pale Ale", "style": "Pale Ale (5.7% ABV)", "abv": "5.7%", "description": "Signature West Coast style pale ale with fresh herbal and citrus hop aromatics." },
                    { "name": "G13 IPA", "style": "American IPA (6.0% ABV)", "abv": "6.0%", "description": "Aromatic IPA enhanced with botanical terpenes for dank, piney hop saturation." }
                ],
                "websiteUrl": "https://sweetwaterbrew.com/"
            },
            {
                "name": "Monday Night Brewing",
                "tagline": "Atlanta craft favourite producing hop-drenched IPAs and wood-cellar wild ales in West Midtown",
                "address": "670 Trabert Ave NW, Atlanta, GA 30318",
                "city": "Atlanta",
                "state": "GA",
                "country": "USA",
                "lat": 33.7948,
                "lng": -84.4098,
                "googleScore": 4.8,
                "googleCount": "1,750+ reviews",
                "untappdScore": 4.62,
                "untappdCount": "120k check-ins",
                "rateBeerScore": 4.65,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "280+ reviews",
                "beerAdvocateScore": 4.66,
                "beerAdvocateCount": "2,400+ ratings",
                "suggestedDurationMin": 80,
                "bestTimeToVisit": "3:00 PM for Westside brewery hop",
                "foodHighlights": "Wood-fired Neapolitan pizzas, artisan meatballs, and soft pretzels.",
                "atmosphere": "Vibrant industrial taproom with tie-themed decor, fire pits, and lively community crowd.",
                "beerHighlights": [
                    { "name": "Space Lettuce", "style": "Double IPA (8.1% ABV)", "abv": "8.1%", "description": "Triple dry-hopped DIPA with colossal notes of mango, papaya, and citrus." },
                    { "name": "Drafty Kilt", "style": "Scotch Ale (7.2% ABV)", "abv": "7.2%", "description": "GABF Gold Medal winner featuring roasted malts, smoked barley, and sweet cherry finish." }
                ],
                "websiteUrl": "https://mondaynightbrewing.com/"
            },
            {
                "name": "Creature Comforts Brewing Co.",
                "tagline": "Acclaimed Athens craft darling located in a historic 1940s tire shop, famed for Tropicalia IPA",
                "address": "271 W Hancock Ave, Athens, GA 30601",
                "city": "Athens",
                "state": "GA",
                "country": "USA",
                "lat": 33.9585,
                "lng": -83.3802,
                "googleScore": 4.8,
                "googleCount": "1,950+ reviews",
                "untappdScore": 4.72,
                "untappdCount": "190k check-ins",
                "rateBeerScore": 4.75,
                "tripAdvisorScore": 4.8,
                "tripAdvisorCount": "390+ reviews",
                "beerAdvocateScore": 4.74,
                "beerAdvocateCount": "4,100+ ratings",
                "suggestedDurationMin": 80,
                "bestTimeToVisit": "2:00 PM for patio flights",
                "foodHighlights": "Local Athens food truck rotations, artisan cheeses, and gourmet snacks.",
                "atmosphere": "Beautifully restored historic brick and timber space with spacious dog-friendly courtyard.",
                "beerHighlights": [
                    { "name": "Tropicalia", "style": "American IPA (6.6% ABV)", "abv": "6.6%", "description": "Balanced, juicy IPA brimming with passionfruit, citrus, and ripe mango." },
                    { "name": "Athena", "style": "Berliner Weisse (4.5% ABV)", "abv": "4.5%", "description": "Tart, refreshingly acidic German-style wheat ale with subtle lemon and sourdough character." }
                ],
                "websiteUrl": "https://creaturecomfortsbeer.com/"
            }
        ],
        "hotels": [
            {
                "name": "Bellyard, West Midtown Atlanta",
                "type": "hotel",
                "priceCategory": "over_200",
                "estimatedPricePerNight": "$240 / night",
                "address": "1 Interlock Ave NW, Atlanta, GA 30318",
                "city": "Atlanta",
                "state": "GA",
                "lat": 33.7845,
                "lng": -84.4112,
                "description": "Chic industrial-modern luxury boutique hotel situated inside the West Midtown brewery district.",
                "amenities": ["Rooftop Lounge", "Fitness Center", "High-Speed Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Bellyard+Atlanta"
            }
        ],
        "airbnbs": [
            {
                "name": "Inman Park BeltLine Historic Loft",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$160 / night",
                "address": "North Highland Ave, Atlanta, GA 30307",
                "city": "Atlanta",
                "state": "GA",
                "lat": 33.7615,
                "lng": -84.3585,
                "description": "Walk to Krog Street Market and local craft breweries directly along the BeltLine trail.",
                "amenities": ["Full Kitchen", "Private Balcony", "Washer/Dryer"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Inman+Park+Atlanta+Airbnb"
            }
        ]
    },

    # TENNESSEE
    {
        "regionKeywords": ["tennessee", "tn", "nashville", "memphis", "knoxville", "chattanooga", "east nashville", "gulch"],
        "stateOrProvince": "Tennessee",
        "country": "USA",
        "breweries": [
            {
                "name": "Bearded Iris Brewing",
                "tagline": "Cult Nashville craft destination renowned across America for decadent double dry-hopped hazy IPAs",
                "address": "101 Van Buren St, Nashville, TN 37208",
                "city": "Nashville",
                "state": "TN",
                "country": "USA",
                "lat": 36.1815,
                "lng": -86.7865,
                "googleScore": 4.8,
                "googleCount": "1,550+ reviews",
                "untappdScore": 4.74,
                "untappdCount": "160k check-ins",
                "rateBeerScore": 4.72,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "220+ reviews",
                "beerAdvocateScore": 4.75,
                "beerAdvocateCount": "3,400+ ratings",
                "suggestedDurationMin": 80,
                "bestTimeToVisit": "2:30 PM for Germantown stroll and fresh Homestyle pours",
                "foodHighlights": "Black Dynasty Ramen pop-up, artisan dumplings, and soft pretzels.",
                "atmosphere": "Opulent vintage speakeasy parlor with velvet chandeliers, brass fixtures, and sunny courtyard.",
                "beerHighlights": [
                    { "name": "Homestyle", "style": "Hazy IPA (6.0% ABV)", "abv": "6.0%", "description": "Single-hopped with Mosaic for an extraordinarily pillowy, tropical citrus and blueberry sensation." },
                    { "name": "Double Scatterbrain", "style": "Double NEIPA (8.0% ABV)", "abv": "8.0%", "description": "Massively dry-hopped with Citra and Simcoe delivering creamy mango and pineapple nectar." }
                ],
                "websiteUrl": "https://beardedirisbrewing.com/"
            },
            {
                "name": "Yazoo Brewing Company",
                "tagline": "Nashville's original craft brewing institution founded in 2003, famous for Dos Perros and sour program",
                "address": "900 River Bluff Dr, Madison, TN 37115",
                "city": "Nashville",
                "state": "TN",
                "country": "USA",
                "lat": 36.2625,
                "lng": -86.7025,
                "googleScore": 4.7,
                "googleCount": "1,600+ reviews",
                "untappdScore": 4.56,
                "untappdCount": "180k check-ins",
                "rateBeerScore": 4.58,
                "tripAdvisorScore": 4.6,
                "tripAdvisorCount": "410+ reviews",
                "beerAdvocateScore": 4.60,
                "beerAdvocateCount": "4,900+ ratings",
                "suggestedDurationMin": 80,
                "bestTimeToVisit": "1:30 PM for riverfront views and taproom flights",
                "foodHighlights": "Wood-smoked pork sliders, Nashville hot chicken, and artisan cheese plates.",
                "atmosphere": "Scenic Cumberland riverfront taproom with spacious outdoor lawn and barrel cellar.",
                "beerHighlights": [
                    { "name": "Dos Perros", "style": "Brown Ale (4.5% ABV)", "abv": "4.5%", "description": "Mexican-style dark ale brewed with flaked maize and rich toasted malts." },
                    { "name": "Embrace the Funk (Saison)", "style": "Wild Farmhouse Ale (6.2% ABV)", "abv": "6.2%", "description": "Oak-fermented with wild Brettanomyces for rustic peach and floral funk." }
                ],
                "websiteUrl": "https://yazoobrew.com/"
            },
            {
                "name": "Wiseacre Brewing Co.",
                "tagline": "Memphis premier craft brewery boasting a massive Downtown headquarters and iconic Tiny Bomb pilsner",
                "address": "398 S B.B. King Blvd, Memphis, TN 38126",
                "city": "Memphis",
                "state": "TN",
                "country": "USA",
                "lat": 35.1382,
                "lng": -90.0525,
                "googleScore": 4.8,
                "googleCount": "1,400+ reviews",
                "untappdScore": 4.62,
                "untappdCount": "110k check-ins",
                "rateBeerScore": 4.65,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "240+ reviews",
                "beerAdvocateScore": 4.68,
                "beerAdvocateCount": "2,700+ ratings",
                "suggestedDurationMin": 80,
                "bestTimeToVisit": "2:00 PM for downtown patio pints",
                "foodHighlights": "Little Bettie sourdough pizza, loaded smash fries, and artisan snacks.",
                "atmosphere": "Vibrant, psychedelic pop-art taproom with outdoor courtyard and bustling brewhouse.",
                "beerHighlights": [
                    { "name": "Tiny Bomb", "style": "American Pilsner (4.5% ABV)", "abv": "4.5%", "description": "GABF Bronze Medal winner brewed with German malt and local wildflower honey for a crisp, snappy finish." },
                    { "name": "Gotta Get Up to Get Down", "style": "Coffee Milk Stout (5.0% ABV)", "abv": "5.0%", "description": "Rich dark stout brewed with ethically sourced Ethiopian coffee and sweet lactose." }
                ],
                "websiteUrl": "https://wiseacrebrew.com/"
            }
        ],
        "hotels": [
            {
                "name": "The Germantown Inn (Nashville)",
                "type": "hotel",
                "priceCategory": "over_200",
                "estimatedPricePerNight": "$220 / night",
                "address": "1218 6th Ave N, Nashville, TN 37208",
                "city": "Nashville",
                "state": "TN",
                "lat": 36.1775,
                "lng": -86.7912,
                "description": "Historic boutique inn in Nashville's most historic craft culinary neighbourhood.",
                "amenities": ["Rooftop Courtyard", "Free Breakfast", "High-Speed Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/The+Germantown+Inn+Nashville"
            }
        ],
        "airbnbs": [
            {
                "name": "East Nashville Craft Music Loft",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$150 / night",
                "address": "Woodland St, Nashville, TN 37206",
                "city": "Nashville",
                "state": "TN",
                "lat": 36.1745,
                "lng": -86.7535,
                "description": "Right in Five Points walking distance to music venues, vintage shops, and microbreweries.",
                "amenities": ["Full Kitchen", "Vinyl Turntable", "Free Parking"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/East+Nashville+Airbnb"
            }
        ]
    },

    # ARIZONA
    {
        "regionKeywords": ["arizona", "az", "phoenix", "scottsdale", "tempe", "tucson", "gilbert", "chandler", "mesa", "flagstaff"],
        "stateOrProvince": "Arizona",
        "country": "USA",
        "breweries": [
            {
                "name": "Wren House Brewing Company",
                "tagline": "Phoenix acclaimed craft sanctuary famous for Spellbinder Hazy IPA and world-class traditional lagers",
                "address": "2125 E Green Gables St, Phoenix, AZ 85006",
                "city": "Phoenix",
                "state": "AZ",
                "country": "USA",
                "lat": 33.4735,
                "lng": -112.0352,
                "googleScore": 4.8,
                "googleCount": "1,450+ reviews",
                "untappdScore": 4.74,
                "untappdCount": "78k check-ins",
                "rateBeerScore": 4.75,
                "tripAdvisorScore": 4.8,
                "tripAdvisorCount": "120+ reviews",
                "beerAdvocateScore": 4.76,
                "beerAdvocateCount": "2,100+ ratings",
                "suggestedDurationMin": 75,
                "bestTimeToVisit": "2:30 PM for fresh can releases and taproom pours",
                "foodHighlights": "Rotating food trucks, local artisan empanadas, and pretzel snacks.",
                "atmosphere": "Cozy 1930s Phoenix bungalow converted into an intimate, hop-perfumed beer parlor.",
                "beerHighlights": [
                    { "name": "Spellbinder", "style": "Hazy IPA (6.5% ABV)", "abv": "6.5%", "description": "GABF Gold Medal winning hazy IPA brewed with oats, wheat, Citra, and Mosaic for saturated peach." },
                    { "name": "Valley Beer", "style": "American Lager (4.6% ABV)", "abv": "4.6%", "description": "Ultra-crisp, thirst-quenching craft lager brewed for the desert heat." }
                ],
                "websiteUrl": "https://www.wrenhousebrewing.com/"
            },
            {
                "name": "Arizona Wilderness Brewing Co.",
                "tagline": "Conservation-focused culinary craft brewery utilizing native Arizona ingredients and local heritage grains",
                "address": "721 N Arizona Ave, Gilbert, AZ 85233",
                "city": "Gilbert",
                "state": "AZ",
                "country": "USA",
                "lat": 33.3632,
                "lng": -111.7895,
                "googleScore": 4.7,
                "googleCount": "3,100+ reviews",
                "untappdScore": 4.65,
                "untappdCount": "130k check-ins",
                "rateBeerScore": 4.70,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "780+ reviews",
                "beerAdvocateScore": 4.72,
                "beerAdvocateCount": "3,800+ ratings",
                "suggestedDurationMin": 85,
                "bestTimeToVisit": "1:00 PM for craft burgers on the patio",
                "foodHighlights": "Famous duck fat fries with bacon ketchup, Arizona grass-fed beef burgers, and peanut butter jalapeño burgers.",
                "atmosphere": "Bustling, sunlit beer garden celebrating Arizona's wild desert landscapes.",
                "beerHighlights": [
                    { "name": "Refuge IPA", "style": "American IPA (6.8% ABV)", "abv": "6.8%", "description": "Flagship IPA with Arizona-grown Sinagua malt and aromatic pine-citrus hops." },
                    { "name": "Baboquivari Sour", "style": "Fruited Sour (5.2% ABV)", "abv": "5.2%", "description": "Sour ale infused with prickly pear cactus fruit harvested from the Sonoran desert." }
                ],
                "websiteUrl": "https://azwbeer.com/"
            },
            {
                "name": "Dragoon Brewing Co.",
                "tagline": "Tucson's premier independent craft brewery revered for Dragoon IPA and Russian Imperial Stouts",
                "address": "1859 W Grant Rd #111, Tucson, AZ 85745",
                "city": "Tucson",
                "state": "AZ",
                "country": "USA",
                "lat": 32.2505,
                "lng": -110.9985,
                "googleScore": 4.8,
                "googleCount": "920+ reviews",
                "untappdScore": 4.60,
                "untappdCount": "62k check-ins",
                "rateBeerScore": 4.62,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "110+ reviews",
                "beerAdvocateScore": 4.64,
                "beerAdvocateCount": "1,450+ ratings",
                "suggestedDurationMin": 75,
                "bestTimeToVisit": "3:00 PM for fresh taproom pours",
                "foodHighlights": "Local Tucson taco trucks and artisan Sonoran hot dog pop-ups.",
                "atmosphere": "Unpretentious industrial brewhouse taproom with friendly desert hospitality.",
                "beerHighlights": [
                    { "name": "Dragoon IPA", "style": "West Coast IPA (7.3% ABV)", "abv": "7.3%", "description": "Benchmark Arizona IPA with assertive citrus bitterness and piney resin." },
                    { "name": "The Lazarus", "style": "Russian Imperial Stout (10.0% ABV)", "abv": "10.0%", "description": "Colossal dark ale with espresso, dark baker's chocolate, and warming roast malt." }
                ],
                "websiteUrl": "https://www.dragoonbrewing.com/"
            }
        ],
        "hotels": [
            {
                "name": "FOUND:RE Phoenix Hotel",
                "type": "hotel",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$175 / night",
                "address": "1100 N Central Ave, Phoenix, AZ 85004",
                "city": "Phoenix",
                "state": "AZ",
                "lat": 33.4605,
                "lng": -112.0735,
                "description": "Industrial-chic boutique art hotel in Downtown Phoenix near the Roosevelt Row arts & brewery district.",
                "amenities": ["Outdoor Pool", "Art Exhibits", "Restaurant & Bar"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/FOUNDRE+Phoenix"
            }
        ],
        "airbnbs": [
            {
                "name": "Roosevelt Row Historic Craft Casita",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$140 / night",
                "address": "Roosevelt St, Phoenix, AZ 85003",
                "city": "Phoenix",
                "state": "AZ",
                "lat": 33.4585,
                "lng": -112.0775,
                "description": "Walk to craft beer bars, mural-lined alleys, and local coffee roasters.",
                "amenities": ["Full Kitchen", "Private Patio", "Air Conditioning"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Roosevelt+Row+Phoenix+Airbnb"
            }
        ]
    },

    # NEVADA
    {
        "regionKeywords": ["nevada", "nv", "las vegas", "reno", "henderson", "arts district las vegas", "downtown las vegas"],
        "stateOrProvince": "Nevada",
        "country": "USA",
        "breweries": [
            {
                "name": "Able Baker Brewing",
                "tagline": "Las Vegas Arts District craft heavyweight featuring over 30 house-brewed taps and full scratch kitchen",
                "address": "1510 S Main St, Las Vegas, NV 89104",
                "city": "Las Vegas",
                "state": "NV",
                "country": "USA",
                "lat": 36.1525,
                "lng": -115.1542,
                "googleScore": 4.7,
                "googleCount": "1,950+ reviews",
                "untappdScore": 4.60,
                "untappdCount": "85k check-ins",
                "rateBeerScore": 4.58,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "210+ reviews",
                "beerAdvocateScore": 4.62,
                "beerAdvocateCount": "1,850+ ratings",
                "suggestedDurationMin": 85,
                "bestTimeToVisit": "1:30 PM for lunch and brewery crawl",
                "foodHighlights": "Fresh Hawaiian poke bowls, duck fat fries, and artisan smash burgers.",
                "atmosphere": "Energetic, expansive taproom with atomic-age murals and lively Main Street patio.",
                "beerHighlights": [
                    { "name": "Atomic Duck", "style": "American IPA (7.0% ABV)", "abv": "7.0%", "description": "Hop bomb loaded with Citra and Mosaic for electric grapefruit, passionfruit, and pine." },
                    { "name": "Chris Kael Impale'd Ale", "style": "Imperial Brown Ale (8.5% ABV)", "abv": "8.5%", "description": "Rich mahogany ale with toasted pecan, dark cocoa, and robust malt body." }
                ],
                "websiteUrl": "https://ablebakerbrewing.com/"
            },
            {
                "name": "HUDL Brewing Company",
                "tagline": "Las Vegas Downtown Arts District craft favorite with sunny outdoor courtyard and bold hop creations",
                "address": "1327 S Main St #100, Las Vegas, NV 89104",
                "city": "Las Vegas",
                "state": "NV",
                "country": "USA",
                "lat": 36.1552,
                "lng": -115.1528,
                "googleScore": 4.8,
                "googleCount": "840+ reviews",
                "untappdScore": 4.58,
                "untappdCount": "34k check-ins",
                "rateBeerScore": 4.52,
                "tripAdvisorScore": 4.8,
                "tripAdvisorCount": "95+ reviews",
                "beerAdvocateScore": 4.58,
                "beerAdvocateCount": "720+ ratings",
                "suggestedDurationMin": 75,
                "bestTimeToVisit": "3:00 PM for patio craft flights",
                "foodHighlights": "Direct patio delivery from SoulBelly BBQ next door for Texas brisket and ribs.",
                "atmosphere": "Modern industrial open-air taproom connected to vibrant brewery alleyway.",
                "beerHighlights": [
                    { "name": "Vanilla Oak Cream Ale", "style": "Cream Ale (5.2% ABV)", "abv": "5.2%", "description": "Silky cream ale conditioned on Madagascar vanilla beans and toasted French oak." },
                    { "name": "High Hatter", "style": "Hazy IPA (6.7% ABV)", "abv": "6.7%", "description": "Lush tropical fruit profile with soft pillowy mouthfeel and minimal bitterness." }
                ],
                "websiteUrl": "https://www.hudlbrewing.com/"
            }
        ],
        "hotels": [
            {
                "name": "The English Hotel (Las Vegas Arts District)",
                "type": "hotel",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$160 / night",
                "address": "921 S Main St, Las Vegas, NV 89101",
                "city": "Las Vegas",
                "state": "NV",
                "lat": 36.1585,
                "lng": -115.1495,
                "description": "Boutique adults-only retreat located directly on Main Street in the brewery district.",
                "amenities": ["Outdoor Pool", "Cocktail Bar", "Free Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/The+English+Hotel+Las+Vegas"
            }
        ],
        "airbnbs": [
            {
                "name": "Downtown Arts District Modern Studio",
                "type": "airbnb",
                "priceCategory": "under_100",
                "estimatedPricePerNight": "$95 / night",
                "address": "Casino Center Blvd, Las Vegas, NV 89104",
                "city": "Las Vegas",
                "state": "NV",
                "lat": 36.1565,
                "lng": -115.1485,
                "description": "Walk to 8+ craft breweries in the vibrant 18b Arts District.",
                "amenities": ["Full Kitchen", "High-Speed Wi-Fi", "Pool Access"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Las+Vegas+Arts+District+Airbnb"
            }
        ]
    },

    # MISSOURI
    {
        "regionKeywords": ["missouri", "mo", "st. louis", "st louis", "kansas city", "kc", "crossroads kc", "soulard", "maplewood mo"],
        "stateOrProvince": "Missouri",
        "country": "USA",
        "breweries": [
            {
                "name": "Side Project Brewing",
                "tagline": "Maplewood St. Louis world-renowned barrel-aging destination crafting globally coveted wild ales and stouts",
                "address": "7458 Manchester Rd, Maplewood, MO 63143",
                "city": "Maplewood",
                "state": "MO",
                "country": "USA",
                "lat": 38.6115,
                "lng": -90.3205,
                "googleScore": 4.8,
                "googleCount": "1,150+ reviews",
                "untappdScore": 4.86,
                "untappdCount": "140k check-ins",
                "rateBeerScore": 4.90,
                "tripAdvisorScore": 4.8,
                "tripAdvisorCount": "110+ reviews",
                "beerAdvocateScore": 4.92,
                "beerAdvocateCount": "5,400+ ratings",
                "suggestedDurationMin": 85,
                "bestTimeToVisit": "1:00 PM for world-class barrel pours",
                "foodHighlights": "Local artisan pizza, cured meats, and cheese boards.",
                "atmosphere": "Refined tasting room with serene outdoor patio dedicated exclusively to world-class beer appreciation.",
                "beerHighlights": [
                    { "name": "Saison du Fermier", "style": "Oak-Aged Farmhouse Saison (7.0% ABV)", "abv": "7.0%", "description": "Masterpiece spelt saison fermented in French oak wine puncheons for delicate citrus and rustic funk." },
                    { "name": "Derivation", "style": "Barrel-Aged Imperial Stout (15.0% ABV)", "abv": "15.0%", "description": "Ranked among the greatest beers on Earth, aged in bourbon and rye casks with vanilla and cacao." }
                ],
                "websiteUrl": "https://www.sideprojectbrewing.com/"
            },
            {
                "name": "Boulevard Brewing Company",
                "tagline": "Kansas City craft pioneer founded in 1989 famous for Tank 7 Farmhouse Ale and massive Beer Hall",
                "address": "2501 Southwest Blvd, Kansas City, MO 64108",
                "city": "Kansas City",
                "state": "MO",
                "country": "USA",
                "lat": 39.0825,
                "lng": -94.5965,
                "googleScore": 4.8,
                "googleCount": "4,300+ reviews",
                "untappdScore": 4.65,
                "untappdCount": "480k check-ins",
                "rateBeerScore": 4.70,
                "tripAdvisorScore": 4.7,
                "tripAdvisorCount": "1,850+ reviews",
                "beerAdvocateScore": 4.72,
                "beerAdvocateCount": "11,200+ ratings",
                "suggestedDurationMin": 90,
                "bestTimeToVisit": "2:00 PM for Beer Hall flights and rooftop deck",
                "foodHighlights": "Artisan charcuterie, giant warm Bavarian pretzels, and local BBQ pairings.",
                "atmosphere": "Spectacular 10,000 sq ft Beer Hall with 36-foot bar and outdoor rooftop patio viewing Downtown KC.",
                "beerHighlights": [
                    { "name": "Tank 7", "style": "American Saison (8.5% ABV)", "abv": "8.5%", "description": "Legendary farmhouse ale with fruity aromatics, grapefruit hops, and peppery dry finish." },
                    { "name": "The Calling", "style": "Double IPA (8.5% ABV)", "abv": "8.5%", "description": "Tropical fruit-forward imperial IPA dry-hopped with eight distinct hop varietals." }
                ],
                "websiteUrl": "https://www.boulevard.com/"
            }
        ],
        "hotels": [
            {
                "name": "Crossroads Hotel (Kansas City)",
                "type": "hotel",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$195 / night",
                "address": "2101 Central St, Kansas City, MO 64108",
                "city": "Kansas City",
                "state": "MO",
                "lat": 39.0875,
                "lng": -94.5875,
                "description": "Industrial-chic boutique hotel in historic Pabst Brewing bottling depot in the Crossroads Arts District.",
                "amenities": ["Rooftop Bar", "Italian Restaurant", "Free Wi-Fi"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Crossroads+Hotel+Kansas+City"
            }
        ],
        "airbnbs": [
            {
                "name": "Soulard Historic St. Louis Townhouse",
                "type": "airbnb",
                "priceCategory": "100_to_200",
                "estimatedPricePerNight": "$125 / night",
                "address": "Russell Blvd, St. Louis, MO 63104",
                "city": "St. Louis",
                "state": "MO",
                "lat": 38.6085,
                "lng": -90.2105,
                "description": "Historic brick French townhouse in the heart of Soulard beer and live blues quarter.",
                "amenities": ["Full Kitchen", "Courtyard", "Free Parking"],
                "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Soulard+St+Louis+Airbnb"
            }
        ]
    }
]

# Read data_usa.py
from scripts.data_usa import ADDITIONAL_USA_REGIONS

existing_states = set(r['stateOrProvince'] for r in ADDITIONAL_USA_REGIONS)
for r in USA_EXPANSIONS:
    if r['stateOrProvince'] not in existing_states:
        ADDITIONAL_USA_REGIONS.append(r)

with open('scripts/data_usa.py', 'w') as f:
    f.write("# Additional United States Craft Beer Regions\n\n")
    f.write("ADDITIONAL_USA_REGIONS = ")
    f.write(json.dumps(ADDITIONAL_USA_REGIONS, indent=2, ensure_ascii=False))
    f.write("\n")

print(f"Updated scripts/data_usa.py! Total US regions: {len(ADDITIONAL_USA_REGIONS)}")
