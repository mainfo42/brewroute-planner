#!/usr/bin/env python3
import json

def format_beer(bh):
    return f"""          {{ name: {json.dumps(bh['name'])}, style: {json.dumps(bh['style'])}, abv: {json.dumps(bh['abv'])}, description: {json.dumps(bh['description'])} }}"""

def format_brewery(b):
    beers = ",\n".join(format_beer(bh) for bh in b['beerHighlights'])
    ba_score = b.get('beerAdvocateScore', b.get('untappdScore', 4.5))
    ba_count = b.get('beerAdvocateCount', '950+ ratings')
    dur = b.get('suggestedDurationMin', 75)
    best_time = b.get('bestTimeToVisit', 'Mid-afternoon for prime tap fresh pours')
    
    return f"""      {{
        name: {json.dumps(b['name'])},
        tagline: {json.dumps(b['tagline'])},
        address: {json.dumps(b['address'])},
        city: {json.dumps(b['city'])},
        state: {json.dumps(b['state'])},
        country: {json.dumps(b['country'])},
        lat: {b['lat']},
        lng: {b['lng']},
        googleScore: {b['googleScore']},
        googleCount: {json.dumps(b['googleCount'])},
        untappdScore: {b['untappdScore']},
        untappdCount: {json.dumps(b['untappdCount'])},
        rateBeerScore: {b['rateBeerScore']},
        tripAdvisorScore: {b['tripAdvisorScore']},
        tripAdvisorCount: {json.dumps(b['tripAdvisorCount'])},
        beerAdvocateScore: {ba_score},
        beerAdvocateCount: {json.dumps(ba_count)},
        suggestedDurationMin: {dur},
        bestTimeToVisit: {json.dumps(best_time)},
        foodHighlights: {json.dumps(b['foodHighlights'])},
        atmosphere: {json.dumps(b['atmosphere'])},
        beerHighlights: [
{beers}
        ],
        websiteUrl: {json.dumps(b['websiteUrl'])},
      }}"""

def format_stay(s):
    amenities = ", ".join(json.dumps(a) for a in s['amenities'])
    return f"""      {{
        name: {json.dumps(s['name'])},
        type: {json.dumps(s['type'])},
        priceCategory: {json.dumps(s['priceCategory'])},
        estimatedPricePerNight: {json.dumps(s['estimatedPricePerNight'])},
        address: {json.dumps(s['address'])},
        city: {json.dumps(s['city'])},
        state: {json.dumps(s['state'])},
        lat: {s['lat']},
        lng: {s['lng']},
        description: {json.dumps(s['description'])},
        amenities: [{amenities}],
        bookingSearchUrl: {json.dumps(s['bookingSearchUrl'])},
      }}"""

def format_region(r):
    kws = ", ".join(json.dumps(k) for k in r['regionKeywords'])
    breweries = ",\n".join(format_brewery(b) for b in r['breweries'])
    hotels = ",\n".join(format_stay(h) for h in r.get('hotels', []))
    airbnbs = ",\n".join(format_stay(a) for a in r.get('airbnbs', []))
    
    return f"""  {{
    regionKeywords: [{kws}],
    stateOrProvince: {json.dumps(r['stateOrProvince'])},
    country: {json.dumps(r['country'])},
    breweries: [
{breweries}
    ],
    hotels: [
{hotels}
    ],
    airbnbs: [
{airbnbs}
    ],
  }}"""

# All Canadian regions
CANADIAN_REGIONS = [
  # 1. NEW BRUNSWICK (Moncton, Dieppe, Riverview, Saint John, Fredericton)
  {
    "regionKeywords": [
      "new brunswick", "nb", "moncton", "dieppe", "riverview", "greater moncton",
      "saint john", "fredericton", "shediac", "sackville", "rothesay", "quispamsis", "miramichi", "bathurst"
    ],
    "stateOrProvince": "New Brunswick",
    "country": "Canada",
    "breweries": [
      {
        "name": "Tire Shack Brewing Co.",
        "tagline": "Multi-award-winning Moncton craft champion operating inside a repurposed auto garage on John Street",
        "address": "260 John St, Moncton, NB E1C 2J4",
        "city": "Moncton",
        "state": "NB",
        "country": "Canada",
        "lat": 46.0912,
        "lng": -64.7865,
        "googleScore": 4.8,
        "googleCount": "820+ reviews",
        "untappdScore": 4.54,
        "untappdCount": "48k check-ins",
        "rateBeerScore": 4.55,
        "tripAdvisorScore": 4.8,
        "tripAdvisorCount": "190+ reviews",
        "beerAdvocateScore": 4.55,
        "beerAdvocateCount": "950+ ratings",
        "suggestedDurationMin": 75,
        "bestTimeToVisit": "2:30 PM for fresh tap drops and patio seating",
        "foodHighlights": "Rotating gourmet street food pop-ups, wood-fired tacos, artisan soft pretzels, and craft hot dogs.",
        "atmosphere": "Industrial-chic garage taproom with roll-up glass garage doors, lively neighborhood patio, and turntable vinyl.",
        "beerHighlights": [
          { "name": "The Specialist", "style": "Hazy IPA (6.5% ABV)", "abv": "6.5%", "description": "Juicy flagship New England IPA double dry-hopped with Citra and Mosaic for ripe mango and passionfruit punch." },
          { "name": "Krossing Over", "style": "Crisp Kolsch (4.8% ABV)", "abv": "4.8%", "description": "German decoction mashed blonde ale with delicate honey sweetness and snappy Hallertau hop finish." },
          { "name": "Secret Secret", "style": "Double Hazy IPA (8.2% ABV)", "abv": "8.2%", "description": "Velvety imperial IPA bursting with candied citrus, pineapple puree, and pillowy oat softness." },
          { "name": "Campfire Marshmallow Stout", "style": "Pastry Stout (7.5% ABV)", "abv": "7.5%", "description": "Decadent dark ale infused with real toasted marshmallows, graham cracker malts, and Madagascar vanilla." }
        ],
        "websiteUrl": "https://tireshackbrewing.com/"
      },
      {
        "name": "Pump House Brewery & Restaurant",
        "tagline": "Legendary Moncton craft brewing institution founded in 1999 by firefighter Shaun Fraser",
        "address": "131 Mill St, Moncton, NB E1C 4R6",
        "city": "Moncton",
        "state": "NB",
        "country": "Canada",
        "lat": 46.0903,
        "lng": -64.7758,
        "googleScore": 4.6,
        "googleCount": "2,900+ reviews",
        "untappdScore": 4.45,
        "untappdCount": "110k check-ins",
        "rateBeerScore": 4.48,
        "tripAdvisorScore": 4.5,
        "tripAdvisorCount": "1,420+ reviews",
        "beerAdvocateScore": 4.46,
        "beerAdvocateCount": "2,800+ ratings",
        "suggestedDurationMin": 80,
        "bestTimeToVisit": "12:30 PM for lunch pairings",
        "foodHighlights": "Famous wood-fired thin crust brick oven pizzas, house garlic fingers with donair sauce, and firehouse wings.",
        "atmosphere": "Historic red-brick brewpub adorned with vintage firefighting gear, brass fittings, and working copper brew kettles.",
        "beerHighlights": [
          { "name": "Pump House Blueberry Ale", "style": "Fruit Wheat Beer (5.0% ABV)", "abv": "5.0%", "description": "World-famous Atlantic Canadian wheat beer brewed with authentic Maritime wild blueberries." },
          { "name": "Crafty Radler", "style": "Grapefruit & Tangerine Radler (4.7% ABV)", "abv": "4.7%", "description": "Award-winning refreshing blend of craft lager with natural ruby red grapefruit and tangerine juice." },
          { "name": "Fire Chief’s Red Ale", "style": "Irish Red Ale (5.0% ABV)", "abv": "5.0%", "description": "Rich amber ale with toasted caramel malt sweetness and subtle earthy floral hop bitterness." },
          { "name": "Cadian Cream Ale", "style": "Cream Ale (5.0% ABV)", "abv": "5.0%", "description": "Smooth, golden session ale with balanced maize sweetness and crisp, dry finish." }
        ],
        "websiteUrl": "https://pumphousebrewery.ca/"
      },
      {
        "name": "CAVOK Brewing Co.",
        "tagline": "Dieppe craft brewery established by air traffic controllers brewing aviation-inspired modern ales",
        "address": "250 Dieppe Blvd, Dieppe, NB E1A 6P8",
        "city": "Dieppe",
        "state": "NB",
        "country": "Canada",
        "lat": 46.0792,
        "lng": -64.7214,
        "googleScore": 4.7,
        "googleCount": "450+ reviews",
        "untappdScore": 4.48,
        "untappdCount": "28k check-ins",
        "rateBeerScore": 4.46,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "120+ reviews",
        "beerAdvocateScore": 4.48,
        "beerAdvocateCount": "620+ ratings",
        "suggestedDurationMin: 65,
        "bestTimeToVisit": "4:00 PM for flight deck tastings",
        "foodHighlights": "Artisanal charcuterie, local smoked trout dip, warm Bavarian pretzels with stout mustard, and panini.",
        "atmosphere": "Sleek hangar-style microbrewery taproom featuring aircraft instrument panel decor and open views of fermentation tanks.",
        "beerHighlights": [
          { "name": "Leger Corner Kolsch", "style": "Traditional Kolsch (4.8% ABV)", "abv": "4.8%", "description": "Historic tribute to Dieppe’s origins; light-bodied German ale cold-conditioned for supreme clarity." },
          { "name": "Radar IPA", "style": "American IPA (6.0% ABV)", "abv": "6.0%", "description": "West coast leaning IPA packed with Centennial and Simcoe hops for resinous pine and grapefruit zest." },
          { "name": "Fog Hopper", "style": "Hazy NEIPA (6.5% ABV)", "abv": "6.5%", "description": "Double dry-hopped cloudy IPA with aromatic peach, guava, and silky flaked wheat mouthfeel." }
        ],
        "websiteUrl": "https://cavokbrewing.ca/"
      },
      {
        "name": "Flying Boats Brewing",
        "tagline": "Dieppe craft brewery honoring the transatlantic aviation heritage of Atlantic Canada",
        "address": "700 Malenfant Blvd, Dieppe, NB E1A 5V8",
        "city": "Dieppe",
        "state": "NB",
        "country": "Canada",
        "lat": 46.0882,
        "lng": -64.7125,
        "googleScore": 4.6,
        "googleCount": "380+ reviews",
        "untappdScore": 4.46,
        "untappdCount": "22k check-ins",
        "rateBeerScore": 4.44,
        "tripAdvisorScore": 4.5,
        "tripAdvisorCount": "95+ reviews",
        "beerAdvocateScore": 4.44,
        "beerAdvocateCount": "510+ ratings",
        "suggestedDurationMin": 60,
        "bestTimeToVisit": "3:30 PM",
        "foodHighlights": "Bistro snacks, gourmet hot dogs with artisanal toppings, nachos, and local cheese boards.",
        "atmosphere": "Cozy aviation taproom with vintage seaplane photography, flight memorabilia, and welcoming craft community tables.",
        "beerHighlights": [
          { "name": "Dixie Clipper", "style": "American IPA (6.5% ABV)", "abv": "6.5%", "description": "Bold citrus and pine aromatic IPA named after Pan Am’s famed passenger flying boats." },
          { "name": "Empress of Ireland", "style": "Dry Porter (5.5% ABV)", "abv": "5.5%", "description": "Robust roasted porter with dark chocolate and espresso notes balanced by a clean dry finish." }
        ],
        "websiteUrl": "https://flyingboatsbrewing.com/"
      },
      {
        "name": "Holy Whale Beer Hall",
        "tagline": "Riverview taproom overlooking the Petitcodiac River tidal bore, pouring boundary-pushing sours and IPAs",
        "address": "391 Coverdale Rd, Riverview, NB E1B 3J6",
        "city": "Riverview",
        "state": "NB",
        "country": "Canada",
        "lat": 46.0685,
        "lng": -64.7952,
        "googleScore": 4.7,
        "googleCount": "460+ reviews",
        "untappdScore": 4.56,
        "untappdCount": "35k check-ins",
        "rateBeerScore": 4.52,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "110+ reviews",
        "beerAdvocateScore": 4.52,
        "beerAdvocateCount": "780+ ratings",
        "suggestedDurationMin: 70,
        "bestTimeToVisit": "5:00 PM to catch river tidal views",
        "foodHighlights": "House taco bar, loaded nachos, smash burgers, and fresh local oysters on weekends.",
        "atmosphere": "Vibrant riverfront brew hall with expansive wooden deck, community picnic tables, and craft cocktail list.",
        "beerHighlights": [
          { "name": "Ringpopp", "style": "Fruited Sour Ale (4.5% ABV)", "abv": "4.5%", "description": "Kettle-soured ale conditioned on raspberry, blackberry, and lemon zest for tangy candy-tart balance." },
          { "name": "Holy Whale Pale Ale", "style": "American Pale Ale (5.2% ABV)", "abv": "5.2%", "description": "Crisp aromatic session pale ale hopped generously with Amarillo and Cascade." },
          { "name": "Thicc Boi", "style": "Imperial Pastry Stout (9.0% ABV)", "abv": "9.0%", "description": "Full-bodied dark imperial ale with cacao nibs, roasted coffee, and rich caramel malts." }
        ],
        "websiteUrl": "https://holywhale.ca/"
      },
      {
        "name": "Picaroons Roundhouse",
        "tagline": "Fredericton’s premier waterfront craft beer palace and heritage roundhouse on the Saint John River",
        "address": "912 Union St, Fredericton, NB E3A 3P8",
        "city": "Fredericton",
        "state": "NB",
        "country": "Canada",
        "lat": 45.9689,
        "lng": -66.6275,
        "googleScore": 4.7,
        "googleCount": "1,450+ reviews",
        "untappdScore": 4.45,
        "untappdCount": "85k check-ins",
        "rateBeerScore": 4.47,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "520+ reviews",
        "beerAdvocateScore": 4.48,
        "beerAdvocateCount": "1,890+ ratings",
        "suggestedDurationMin": 75,
        "bestTimeToVisit": "1:30 PM",
        "foodHighlights": "Wood-fired sourdough pizza by 540 Kitchen, smoked brisket sandwiches, and poutine.",
        "atmosphere": "Stunning converted 19th-century railway roundhouse with soaring timber ceilings and direct river trail access.",
        "beerHighlights": [
          { "name": "Best Bitter", "style": "English Best Bitter (4.5% ABV)", "abv": "4.5%", "description": "Canada’s benchmark English-style bitter brewed with authentic British Maris Otter malt and Goldings hops." },
          { "name": "Yippee IPA", "style": "American IPA (6.0% ABV)", "abv": "6.0%", "description": "Citrusy, floral IPA with copper color and clean malt profile." },
          { "name": "Irish Red", "style": "Traditional Red Ale (5.0% ABV)", "abv": "5.0%", "description": "Subtle caramel sweetness with dry roasted barley finish." }
        ],
        "websiteUrl": "https://picaroons.ca/"
      },
      {
        "name": "Trailway Brewing Co.",
        "tagline": "Fredericton north side masters of haze, pioneering modern double dry-hopped New England IPAs",
        "address": "280 Main St, Fredericton, NB E3A 1C9",
        "city": "Fredericton",
        "state": "NB",
        "country": "Canada",
        "lat": 45.9721,
        "lng": -66.6432,
        "googleScore": 4.8,
        "googleCount": "620+ reviews",
        "untappdScore": 4.62,
        "untappdCount": "52k check-ins",
        "rateBeerScore": 4.58,
        "tripAdvisorScore": 4.7,
        "tripAdvisorCount": "180+ reviews",
        "beerAdvocateScore": 4.58,
        "beerAdvocateCount": "1,120+ ratings",
        "suggestedDurationMin": 70,
        "bestTimeToVisit": "3:00 PM for tap room exclusives",
        "foodHighlights": "Gourmet street food menu featuring artisanal smash burgers, crispy chicken bao, and parmesan fries.",
        "atmosphere": "Lively, airy modern taproom with pinball machines, visible stainless steel brew system, and sunny beer garden.",
        "beerHighlights": [
          { "name": "Hu Jon Hops", "style": "American IPA (6.6% ABV)", "abv": "6.6%", "description": "The beer that ignited the Maritime hazy revolution; bursting with mango, peach, and citrus aromas." },
          { "name": "Luster", "style": "American Pale Ale (5.2% ABV)", "abv": "5.2%", "description": "Crisp, thirst-quenching pale ale with Galaxy and Citra hops delivering bright tropical flavors." }
        ],
        "websiteUrl": "https://trailwaybrewing.com/"
      },
      {
        "name": "Grimross Brewing Co.",
        "tagline": "Fredericton masters of Belgian-inspired and classic craft ales with live acoustic performances",
        "address": "600 Bishop Dr, Fredericton, NB E3C 2M6",
        "city": "Fredericton",
        "state": "NB",
        "country": "Canada",
        "lat": 45.9372,
        "lng": -66.6695,
        "googleScore": 4.7,
        "googleCount": "580+ reviews",
        "untappdScore": 4.46,
        "untappdCount": "32k check-ins",
        "rateBeerScore": 4.45,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "140+ reviews",
        "beerAdvocateScore": 4.44,
        "beerAdvocateCount": "490+ ratings",
        "suggestedDurationMin": 65,
        "bestTimeToVisit": "4:30 PM",
        "foodHighlights": "Artisan soft pretzels, gourmet charcuterie boards, paninis, and visiting local food trucks.",
        "atmosphere": "Warm wooden taproom with live roots music stage and community gathering atmosphere.",
        "beerHighlights": [
          { "name": "Cheval D’Or", "style": "Belgian Blonde Ale (6.0% ABV)", "abv": "6.0%", "description": "Gold medal winning Belgian ale with spicy yeast esters and subtle honey sweetness." },
          { "name": "Sanctuary DIPA", "style": "Imperial IPA (8.4% ABV)", "abv": "8.4%", "description": "Robust double IPA packed with pine, resin, and ripe citrus fruit." }
        ],
        "websiteUrl": "https://grimross.com/"
      },
      {
        "name": "Big Tide Brewing Company",
        "tagline": "Saint John’s uptown pioneer brewpub pouring traditional English ales and hearty pub plates",
        "address": "47 Princess St, Saint John, NB E2L 1K1",
        "city": "Saint John",
        "state": "NB",
        "country": "Canada",
        "lat": 45.2721,
        "lng": -66.0612,
        "googleScore": 4.5,
        "googleCount": "980+ reviews",
        "untappdScore": 4.42,
        "untappdCount": "34k check-ins",
        "rateBeerScore": 4.4,
        "tripAdvisorScore": 4.4,
        "tripAdvisorCount": "410+ reviews",
        "beerAdvocateScore": 4.42,
        "beerAdvocateCount": "890+ ratings",
        "suggestedDurationMin": 70,
        "bestTimeToVisit": "1:00 PM",
        "foodHighlights": "Atlantic seafood chowder, beer-battered local haddock and chips, and cheddar ale dip.",
        "atmosphere": "Cozy historic brick brewpub located in the historic heart of Uptown Saint John.",
        "beerHighlights": [
          { "name": "Benedict Arnold Amber Ale", "style": "Amber Ale (5.2% ABV)", "abv": "5.2%", "description": "Smooth caramel malt notes with balanced English Fuggles hop bitterness." },
          { "name": "Fogbound Hemp Pale Ale", "style": "Hemp Pale Ale (5.0% ABV)", "abv": "5.0%", "description": "Unique session ale brewed with roasted organic hemp seeds for a subtle nutty character." }
        ],
        "websiteUrl": "https://bigtidebrew.ca/"
      },
      {
        "name": "Moosehead Small Batch Brewery",
        "tagline": "Innovative microbrewery and taproom inside Canada’s oldest independent brewery headquarters",
        "address": "89 Main St W, Saint John, NB E2M 3N2",
        "city": "Saint John",
        "state": "NB",
        "country": "Canada",
        "lat": 45.2635,
        "lng": -66.0821,
        "googleScore": 4.7,
        "googleCount": "850+ reviews",
        "untappdScore": 4.45,
        "untappdCount": "42k check-ins",
        "rateBeerScore": 4.43,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "290+ reviews",
        "beerAdvocateScore": 4.43,
        "beerAdvocateCount": "650+ ratings",
        "suggestedDurationMin": 70,
        "bestTimeToVisit": "3:00 PM",
        "foodHighlights": "Wood-fired gourmet pizzas, soft pretzel bites with beer cheese dip, and local bratwurst.",
        "atmosphere": "Expansive open-concept microbrewery overlooking the historic Bay of Fundy shoreline.",
        "beerHighlights": [
          { "name": "Ten Penny Ale Heritage", "style": "Traditional English Ale (5.2% ABV)", "abv": "5.2%", "description": "Historic small-batch revival of the iconic maritime ale with rich amber malts." },
          { "name": "Fundy Fog NEIPA", "style": "Hazy IPA (6.3% ABV)", "abv": "6.3%", "description": "Citrus, melon, and tropical hop burst with a velvety mouthfeel." }
        ],
        "websiteUrl": "https://moosehead.ca/small-batch-brewery"
      }
    ],
    "hotels": [
      {
        "name": "Hyatt Place Moncton Downtown",
        "type": "hotel",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$165 / night",
        "address": "833 Main St, Moncton, NB E1C 1G1",
        "city": "Moncton",
        "state": "NB",
        "lat": 46.0885,
        "lng": -64.7812,
        "description": "Modern hotel located in downtown Moncton, steps from John Street taprooms and Capitol Theatre.",
        "amenities": ["Free Wi-Fi", "Complimentary Hot Breakfast", "Fitness Center", "On-Site Craft Bar"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Hyatt+Place+Moncton"
      },
      {
        "name": "Crowne Plaza Moncton Downtown",
        "type": "hotel",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$150 / night",
        "address": "1005 Main St, Moncton, NB E1C 1G9",
        "city": "Moncton",
        "state": "NB",
        "lat": 46.0872,
        "lng": -64.7865,
        "description": "Prime downtown Moncton accommodation directly across from the Avenir Centre and minutes to Tire Shack.",
        "amenities": ["Indoor Saltwater Pool", "High-Speed Wi-Fi", "Room Service", "Fitness Center"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Crowne+Plaza+Moncton"
      }
    ],
    "airbnbs": [
      {
        "name": "The John Street Brewery Loft",
        "type": "airbnb",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$130 / night",
        "address": "John St & Highfield, Moncton, NB E1C 2J4",
        "city": "Moncton",
        "state": "NB",
        "lat": 46.0915,
        "lng": -64.7872,
        "description": "Bright modern loft apartment situated one block from Tire Shack Brewing in central Moncton.",
        "amenities": ["Full Kitchen", "Dedicated Workspace", "Keyless Entry", "Free Parking"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Moncton+Downtown+Airbnb"
      }
    ]
  },

  # 2. NOVA SCOTIA (Halifax, Dartmouth, Bedford, Sydney / Cape Breton)
  {
    "regionKeywords": [
      "nova scotia", "ns", "halifax", "dartmouth", "sydney", "cape breton",
      "lower sackville", "bedford", "wolfville", "truro", "antigonish", "yarmouth"
    ],
    "stateOrProvince": "Nova Scotia",
    "country": "Canada",
    "breweries": [
      {
        "name": "2 Crows Brewing Co.",
        "tagline": "Progressive downtown Halifax craft powerhouse famed for wild sours, crisp lagers, and juicy modern IPAs",
        "address": "1934 Brunswick St, Halifax, NS B3J 2G7",
        "city": "Halifax",
        "state": "NS",
        "country": "Canada",
        "lat": 44.6502,
        "lng": -63.5788,
        "googleScore": 4.8,
        "googleCount": "950+ reviews",
        "untappdScore": 4.62,
        "untappdCount": "65k check-ins",
        "rateBeerScore": 4.65,
        "tripAdvisorScore": 4.7,
        "tripAdvisorCount": "210+ reviews",
        "beerAdvocateScore": 4.60,
        "beerAdvocateCount": "1,450+ ratings",
        "suggestedDurationMin": 75,
        "bestTimeToVisit": "2:00 PM for taproom releases",
        "foodHighlights": "Pop-up local dumpling carts, artisan cheese boards, warm pretzels, and visiting food truck kitchen.",
        "atmosphere": "Airy Scandinavian modern brewery taproom with light wood finishings and visible oak foeders.",
        "beerHighlights": [
          { "name": "AC Light Lager", "style": "Craft American Lager (4.0% ABV)", "abv": "4.0%", "description": "Ultra-crisp, refreshing low-ABV lager brewed with Maritime pilsner malt and noble hops." },
          { "name": "Fantastyke", "style": "Foeder-Aged Grisette (4.8% ABV)", "abv": "4.8%", "description": "Oak foeder fermented mixed-culture farmhouse ale with vibrant lemon acidity and rustic grain character." },
          { "name": "Space Cadet", "style": "New England IPA (6.5% ABV)", "abv": "6.5%", "description": "Tropical cloudburst of Citra and Mosaic hops with silky oat and barley body." }
        ],
        "websiteUrl": "https://2crowsbrewing.com/"
      },
      {
        "name": "Propeller Brewing Co.",
        "tagline": "Halifax craft brewing pioneer founded in 1997, celebrated for ESB, Prime Mojo, and retro arcade basement",
        "address": "2015 Gottingen St, Halifax, NS B3K 3B1",
        "city": "Halifax",
        "state": "NS",
        "country": "Canada",
        "lat": 44.6548,
        "lng": -63.5872,
        "googleScore": 4.7,
        "googleCount": "890+ reviews",
        "untappdScore": 4.50,
        "untappdCount": "90k check-ins",
        "rateBeerScore": 4.54,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "280+ reviews",
        "beerAdvocateScore": 4.52,
        "beerAdvocateCount": "2,600+ ratings",
        "suggestedDurationMin": 70,
        "bestTimeToVisit": "4:00 PM to play vintage arcade pinball in the cellar",
        "foodHighlights": "Artisanal meat pies, local smoked sausage snacks, and partnerships with Gottingen street eateries.",
        "atmosphere": "Sprawling North End brewhouse featuring a subterranean vintage pinball and arcade speakeasy.",
        "beerHighlights": [
          { "name": "Propeller Extra Special Bitter (ESB)", "style": "English ESB (5.0% ABV)", "abv": "5.0%", "description": "World Beer Championship Gold Medalist; rich toffee malt complexity balanced by traditional English Goldings hops." },
          { "name": "Galaxy IPA", "style": "Single Hop IPA (6.5% ABV)", "abv": "6.5%", "description": "Intensely aromatic IPA loaded with 100% Australian Galaxy hops for passionfruit and citrus burst." }
        ],
        "websiteUrl": "https://drinkpropeller.ca/"
      },
      {
        "name": "Garrison Brewing Company",
        "tagline": "Historic Halifax Seaport flagship crafting celebrated Irish Red, Ol’ Foghorn, and juicy spruce beers",
        "address": "1149 Marginal Rd, Halifax, NS B3H 4P7",
        "city": "Halifax",
        "state": "NS",
        "country": "Canada",
        "lat": 44.6395,
        "lng": -63.5658,
        "googleScore": 4.7,
        "googleCount": "1,280+ reviews",
        "untappdScore": 4.48,
        "untappdCount": "105k check-ins",
        "rateBeerScore": 4.50,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "490+ reviews",
        "beerAdvocateScore": 4.50,
        "beerAdvocateCount": "3,100+ ratings",
        "suggestedDurationMin": 75,
        "bestTimeToVisit": "1:00 PM after walking the Seaport boardwalk",
        "foodHighlights": "Gourmet panini, maritime lobster rolls during season, seafood pies, and salty soft pretzels.",
        "atmosphere": "Bustling historic Seaport brick brewery with outdoor patio facing cruise ship terminals and Georges Island.",
        "beerHighlights": [
          { "name": "Irish Red Ale", "style": "Irish Red Ale (5.0% ABV)", "abv": "5.0%", "description": "Silky smooth amber ale with caramelized malt sweetness and clean finishing bitterness." },
          { "name": "Tall Ship Ale", "style": "East Coast Ale (4.6% ABV)", "abv": "4.6%", "description": "Crisp, golden flagship ale honoring Halifax’s maritime tall ship sailing traditions." },
          { "name": "Pucker Up!", "style": "Kettle Sour (4.9% ABV)", "abv": "4.9%", "description": "Refreshing tart sour ale loaded with seasonal citrus fruit." }
        ],
        "websiteUrl": "https://garrisonbrewing.com/"
      },
      {
        "name": "Brightwood Brewery",
        "tagline": "Downtown Dartmouth community taproom pouring sunny IPAs and crisp lagers steps from the ferry",
        "address": "35 Portland St, Dartmouth, NS B2Y 1H1",
        "city": "Dartmouth",
        "state": "NS",
        "country": "Canada",
        "lat": 44.6648,
        "lng": -63.5678,
        "googleScore": 4.7,
        "googleCount": "480+ reviews",
        "untappdScore": 4.52,
        "untappdCount": "35k check-ins",
        "rateBeerScore": 4.48,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "120+ reviews",
        "beerAdvocateScore": 4.50,
        "beerAdvocateCount": "620+ ratings",
        "suggestedDurationMin": 65,
        "bestTimeToVisit": "3:00 PM for harbour patio views",
        "foodHighlights": "Tacos, loaded nachos, artisanal pretzels, and local craft cheeses.",
        "atmosphere": "Lively downtown Dartmouth taproom with vibrant street-facing garage windows.",
        "beerHighlights": [
          { "name": "Big Lift", "style": "American Pale Ale (5.2% ABV)", "abv": "5.2%", "description": "Citrus-forward everyday pale ale brewed in honor of the Angus L. Macdonald Bridge." },
          { "name": "Smokey The Beer", "style": "Smoked Porter (5.8% ABV)", "abv": "5.8%", "description": "Rich roasted porter with gentle beechwood smoked malt undertones." }
        ],
        "websiteUrl": "https://brightwoodbrewery.com/"
      },
      {
        "name": "Nine Locks Brewing Co.",
        "tagline": "Dartmouth craft brewing staple located on the historic Shubenacadie Canal water route",
        "address": "219 Waverley Rd, Dartmouth, NS B2X 2C3",
        "city": "Dartmouth",
        "state": "NS",
        "country": "Canada",
        "lat": 44.6952,
        "lng": -63.5512,
        "googleScore": 4.7,
        "googleCount": "1,150+ reviews",
        "untappdScore": 4.50,
        "untappdCount": "80k check-ins",
        "rateBeerScore": 4.47,
        "tripAdvisorScore": 4.5,
        "tripAdvisorCount": "290+ reviews",
        "beerAdvocateScore": 4.48,
        "beerAdvocateCount": "1,200+ ratings",
        "suggestedDurationMin: 70,
        "bestTimeToVisit": "2:00 PM",
        "foodHighlights": "Food truck pairings, stone-baked pizzas, and craft snacks.",
        "atmosphere": "Expansive modern production brewery and tasting room with lakeside patio.",
        "beerHighlights": [
          { "name": "Dirty Blonde", "style": "North American Blonde Ale (5.0% ABV)", "abv": "5.0%", "description": "Nova Scotia's bestselling craft blonde ale, crisp and lightly hopped with German Hallertau." },
          { "name": "Frig Off", "style": "New England Double IPA (8.0% ABV)", "abv": "8.0%", "description": "Heavy tropical stone fruit aromas with thick creamy mouthfeel." }
        ],
        "websiteUrl": "https://ninelocksbrewing.ca/"
      },
      {
        "name": "Breton Brewing Co.",
        "tagline": "Cape Breton’s premier independent craft brewery in Sydney pouring Black Angus IPA and Celtic ales",
        "address": "364 Keltic Dr, Sydney, NS B1R 1V7",
        "city": "Sydney",
        "state": "NS",
        "country": "Canada",
        "lat": 46.1385,
        "lng": -60.2312,
        "googleScore": 4.8,
        "googleCount": "780+ reviews",
        "untappdScore": 4.54,
        "untappdCount": "45k check-ins",
        "rateBeerScore": 4.52,
        "tripAdvisorScore": 4.7,
        "tripAdvisorCount": "160+ reviews",
        "beerAdvocateScore": 4.52,
        "beerAdvocateCount": "720+ ratings",
        "suggestedDurationMin: 75,
        "bestTimeToVisit": "3:30 PM",
        "foodHighlights": "Artisan pizza pop-ups, warm pretzels, and Sydney food truck selections.",
        "atmosphere": "Welcoming Cape Breton community hall taproom with live fiddle sessions and open views of stainless fermenters.",
        "beerHighlights": [
          { "name": "Black Angus IPA", "style": "American IPA (6.2% ABV)", "abv": "6.2%", "description": "Award-winning IPA bursting with citrus zest and assertive pine bitterness." },
          { "name": "Red Coat Irish Red", "style": "Irish Red Ale (5.0% ABV)", "abv": "5.0%", "description": "Malty, smooth traditional red ale with toasted biscuit flavors." }
        ],
        "websiteUrl": "https://bretonbrewing.ca/"
      },
      {
        "name": "Big Spruce Brewing",
        "tagline": "Canada’s certified organic on-farm craft brewery in Cape Breton crafting unfiltered world-class ales",
        "address": "64 Bernard MacNeil Dr, Baddeck, NS B0E 1B0",
        "city": "Cape Breton",
        "state": "NS",
        "country": "Canada",
        "lat": 46.0985,
        "lng": -60.7512,
        "googleScore": 4.9,
        "googleCount": "1,350+ reviews",
        "untappdScore": 4.68,
        "untappdCount": "82k check-ins",
        "rateBeerScore": 4.70,
        "tripAdvisorScore": 4.8,
        "tripAdvisorCount": "420+ reviews",
        "beerAdvocateScore": 4.70,
        "beerAdvocateCount": "1,650+ ratings",
        "suggestedDurationMin: 85,
        "bestTimeToVisit": "1:00 PM for Bras d'Or Lake panoramic views",
        "foodHighlights": "The Spruced Shack farm-to-table food truck, gourmet local tacos, and oysters.",
        "atmosphere": "Breathtaking panoramic farm taproom overlooking Bras d'Or Lake with hop yards and grazing animals.",
        "beerHighlights": [
          { "name": "Cereal Killer Oatmeal Stout", "style": "Oatmeal Stout (5.4% ABV)", "abv": "5.4%", "description": "World Beer Cup Gold Medalist; velvety, roasted chocolate, espresso, and creamy oats." },
          { "name": "Kitchen Party Pale Ale", "style": "American Pale Ale (5.5% ABV)", "abv": "5.5%", "description": "Crisp organic pale ale hopped generously with organic Cascade and Centennial." }
        ],
        "websiteUrl": "https://bigspruce.ca/"
      }
    ],
    "hotels": [
      {
        "name": "The Westin Nova Scotian",
        "type": "hotel",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$180 / night",
        "address": "1181 Hollis St, Halifax, NS B3H 2P6",
        "city": "Halifax",
        "state": "NS",
        "lat": 44.6398,
        "lng": -63.5672,
        "description": "Historic railway hotel located adjacent to Garrison Brewing at the Halifax Seaport.",
        "amenities": ["Indoor Pool", "Fitness Center", "On-Site Restaurant", "Pet Friendly"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Westin+Nova+Scotian"
      },
      {
        "name": "The Simon Hotel Sydney",
        "type": "hotel",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$160 / night",
        "address": "380 Esplanade, Sydney, NS B1P 1B1",
        "city": "Sydney",
        "state": "NS",
        "lat": 46.1412,
        "lng": -60.1985,
        "description": "Waterfront Sydney boutique hotel minutes from Breton Brewing and Cape Breton harbor.",
        "amenities": ["Waterfront Harbor Views", "On-Site Gastropub", "Free Wi-Fi", "Fitness Center"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/The+Simon+Hotel+Sydney"
      }
    ],
    "airbnbs": [
      {
        "name": "North End Halifax Craft Quarter Loft",
        "type": "airbnb",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$145 / night",
        "address": "Gottingen St, Halifax, NS B3K 3B1",
        "city": "Halifax",
        "state": "NS",
        "lat": 44.6542,
        "lng": -63.5865,
        "description": "Modern renovated flat steps from Propeller Brewing, 2 Crows, and Agricola Street dining.",
        "amenities": ["Full Kitchen", "High-Speed Wi-Fi", "Washer/Dryer", "Espresso Maker"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Halifax+North+End+Airbnb"
      }
    ]
  },

  # 3. PRINCE EDWARD ISLAND (Charlottetown, Stratford, Cornwall)
  {
    "regionKeywords": [
      "prince edward island", "pei", "pe", "charlottetown", "stratford", "cornwall", "summerside"
    ],
    "stateOrProvince": "Prince Edward Island",
    "country": "Canada",
    "breweries": [
      {
        "name": "Upstreet Craft Brewing",
        "tagline": "Charlottetown B-Corp certified craft anchor brewing Do Gooder, Commons, and vibrant seasonal hazies",
        "address": "41 Allen St, Charlottetown, PE C1A 2V6",
        "city": "Charlottetown",
        "state": "PE",
        "country": "Canada",
        "lat": 46.2482,
        "lng": -63.1345,
        "googleScore": 4.7,
        "googleCount": "920+ reviews",
        "untappdScore": 4.52,
        "untappdCount": "52k check-ins",
        "rateBeerScore": 4.50,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "210+ reviews",
        "beerAdvocateScore": 4.50,
        "beerAdvocateCount": "890+ ratings",
        "suggestedDurationMin": 75,
        "bestTimeToVisit": "3:00 PM for taproom releases",
        "foodHighlights": "Artisanal smash burgers, spicy chicken sandwiches, local fries with craft beer cheese, and pretzels.",
        "atmosphere": "Energetic, welcoming community hub with board games, retro video games, and sunlit patio.",
        "beerHighlights": [
          { "name": "Do Gooder", "style": "American Pale Ale (5.4% ABV)", "abv": "5.4%", "description": "Citrus-forward sessionable pale ale brewed to support local arts and non-profit initiatives." },
          { "name": "Commons Pilsner", "style": "Czech Pilsner (4.8% ABV)", "abv": "4.8%", "description": "Clean, crisp, traditional Bohemian pilsner lagered cold for maximum snap." },
          { "name": "Rhuby Social", "style": "Strawberry Rhubarb Sour (5.0% ABV)", "abv": "5.0%", "description": "Tart kettle sour infused with real Prince Edward Island strawberries and garden rhubarb." }
        ],
        "websiteUrl": "https://upstreetbrewing.com/"
      },
      {
        "name": "PEI Brewing Company",
        "tagline": "State-of-the-art production craft brewhouse pouring world-renowned Gahan ales and Beach Chair Lager",
        "address": "96 Kensington Rd, Charlottetown, PE C1A 5J5",
        "city": "Charlottetown",
        "state": "PE",
        "country": "Canada",
        "lat": 46.2495,
        "lng": -63.1185,
        "googleScore": 4.7,
        "googleCount": "1,120+ reviews",
        "untappdScore": 4.46,
        "untappdCount": "98k check-ins",
        "rateBeerScore": 4.45,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "380+ reviews",
        "beerAdvocateScore": 4.47,
        "beerAdvocateCount": "1,450+ ratings",
        "suggestedDurationMin: 70,
        "bestTimeToVisit": "1:30 PM",
        "foodHighlights": "Pub classics, PEI mussel bowls, beer-battered fish & chips, and pulled pork sandwiches.",
        "atmosphere": "Expansive timber and brick event space and taproom hosting concerts and craft markets.",
        "beerHighlights": [
          { "name": "Beach Chair Lager", "style": "Golden Craft Lager (4.5% ABV)", "abv": "4.5%", "description": "Canada’s quintessential summer can; crisp, ultra-clean lager brewed with Canadian two-row barley." },
          { "name": "Sir John A's Honey Wheat", "style": "Honey Wheat Ale (4.5% ABV)", "abv": "4.5%", "description": "Smooth golden wheat ale brewed with real clover honey from Island apiaries." },
          { "name": "Sydney Street Stout", "style": "Dry Irish Stout (4.8% ABV)", "abv": "4.8%", "description": "Creamy nitro pour featuring dark cocoa, toasted oats, and roasted barley dry finish." }
        ],
        "websiteUrl": "https://peibrewingcompany.com/"
      },
      {
        "name": "The Gahan House Pub & Brewery",
        "tagline": "Historic 19th-century red-brick brewpub in downtown Charlottetown, birthplace of PEI’s craft brewing movement",
        "address": "126 Sydney St, Charlottetown, PE C1A 1G1",
        "city": "Charlottetown",
        "state": "PE",
        "country": "Canada",
        "lat": 46.2335,
        "lng": -63.1258,
        "googleScore": 4.6,
        "googleCount": "2,450+ reviews",
        "untappdScore": 4.44,
        "untappdCount": "72k check-ins",
        "rateBeerScore": 4.42,
        "tripAdvisorScore": 4.5,
        "tripAdvisorCount": "1,850+ reviews",
        "beerAdvocateScore": 4.45,
        "beerAdvocateCount": "1,980+ ratings",
        "suggestedDurationMin: 75,
        "bestTimeToVisit": "12:00 PM for lunch with fresh oyster pairings",
        "foodHighlights": "World-famous PEI oysters on the half shell, fresh steamed blue mussels, and seafood chowder in a bread bowl.",
        "atmosphere": "Atmospheric Victorian townhouse cellar with dark wood booths, cozy brick fireplaces, and on-site copper brew kettle.",
        "beerHighlights": [
          { "name": "Iron Bridge Brown Ale", "style": "English Brown Ale (5.3% ABV)", "abv": "5.3%", "description": "Caramel and chocolate malts with a rich nutty flavor and soft carbonation." },
          { "name": "Island Red Premium Ale", "style": "Amber Red Ale (5.0% ABV)", "abv": "5.0%", "description": "Toasted malt sweetness with balanced floral hop finish, brewed in tribute to PEI’s red soil." },
          { "name": "Vic Park Pale Ale", "style": "American Pale Ale (4.8% ABV)", "abv": "4.8%", "description": "Bright grapefruit, pine, and floral aromas from Northwest hops." }
        ],
        "websiteUrl": "https://gahan.ca/"
      },
      {
        "name": "Lone Oak Brewing Co.",
        "tagline": "Award-winning Island craft brewery specializing in locally sourced barley, vibrant IPAs, and farmhouse ales",
        "address": "103 North River Rd, Charlottetown, PE C1A 3K6",
        "city": "Charlottetown",
        "state": "PE",
        "country": "Canada",
        "lat": 46.2425,
        "lng": -63.1512,
        "googleScore": 4.8,
        "googleCount": "620+ reviews",
        "untappdScore": 4.56,
        "untappdCount": "38k check-ins",
        "rateBeerScore": 4.52,
        "tripAdvisorScore": 4.7,
        "tripAdvisorCount": "130+ reviews",
        "beerAdvocateScore": 4.54,
        "beerAdvocateCount": "580+ ratings",
        "suggestedDurationMin: 70,
        "bestTimeToVisit": "4:00 PM",
        "foodHighlights": "Farm-fresh gourmet smash burgers, truffle parmesan fries, and local charcuterie.",
        "atmosphere": "Modern coastal taproom with warm cedar finishes and expansive outdoor patio.",
        "beerHighlights": [
          { "name": "Fixed Link", "style": "Czech Pilsner (4.8% ABV)", "abv": "4.8%", "description": "Gold Medal winner at Canadian Brewing Awards; crisp and sparkling with authentic Saaz hops." },
          { "name": "Hollywood", "style": "New England IPA (6.8% ABV)", "abv": "6.8%", "description": "Plush, hazy double dry-hopped IPA brimming with pineapple, mango, and passionfruit." }
        ],
        "websiteUrl": "https://loneoakbrewing.com/"
      }
    ],
    "hotels": [
      {
        "name": "The Great George Hotel",
        "type": "hotel",
        "priceCategory": "over_200",
        "estimatedPricePerNight": "$210 / night",
        "address": "58 Great George St, Charlottetown, PE C1A 4K3",
        "city": "Charlottetown",
        "state": "PE",
        "lat": 46.2332,
        "lng": -63.1252,
        "description": "Award-winning historic boutique hotel in the heart of Charlottetown, 2 blocks from Gahan House.",
        "amenities": ["Complimentary Wine Hour", "Full Hot Breakfast", "Historic Design", "Free High-Speed Wi-Fi"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/The+Great+George+Charlottetown"
      },
      {
        "name": "Rodd Charlottetown",
        "type": "hotel",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$160 / night",
        "address": "75 Kent St, Charlottetown, PE C1A 7K4",
        "city": "Charlottetown",
        "state": "PE",
        "lat": 46.2365,
        "lng": -63.1285,
        "description": "Classic 1930s hotel featuring vaulted ceilings and indoor pool minutes from waterfront taprooms.",
        "amenities": ["Indoor Pool", "Sauna", "On-site Dining", "Fitness Centre"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Rodd+Charlottetown"
      }
    ],
    "airbnbs": [
      {
        "name": "Historic Old Charlottetown Loft",
        "type": "airbnb",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$140 / night",
        "address": "Water St & Queen St, Charlottetown, PE C1A 1A4",
        "city": "Charlottetown",
        "state": "PE",
        "lat": 46.2312,
        "lng": -63.1235,
        "description": "Sunlit loft apartment overlooking the Charlottetown waterfront and marina.",
        "amenities": ["Full Kitchen", "Waterfront Views", "Fast Wi-Fi", "Keyless Entry"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Charlottetown+Waterfront+Airbnb"
      }
    ]
  },

  # 4. NEWFOUNDLAND AND LABRADOR (St. John's, Mount Pearl, Conception Bay South)
  {
    "regionKeywords": [
      "newfoundland", "labrador", "nl", "st. john's", "st johns", "saint johns",
      "mount pearl", "conception bay south", "paradise", "corner brook"
    ],
    "stateOrProvince": "Newfoundland and Labrador",
    "country": "Canada",
    "breweries": [
      {
        "name": "Quidi Vidi Brewing Company",
        "tagline": "Iconic fishing village brewery in St. John's crafting legendary 1800-year-old Iceberg beer",
        "address": "35 Barrows Rd, St. John's, NL A1A 1G8",
        "city": "St. John's",
        "state": "NL",
        "country": "Canada",
        "lat": 47.5815,
        "lng": -52.6785,
        "googleScore": 4.8,
        "googleCount": "2,450+ reviews",
        "untappdScore": 4.54,
        "untappdCount": "95k check-ins",
        "rateBeerScore": 4.56,
        "tripAdvisorScore": 4.7,
        "tripAdvisorCount": "1,120+ reviews",
        "beerAdvocateScore": 4.55,
        "beerAdvocateCount": "2,200+ ratings",
        "suggestedDurationMin: 85,
        "bestTimeToVisit": "2:00 PM for gut-side harbor views",
        "foodHighlights": "Cod au gratin, fresh local fish & chips, cod tongues, and warm dough dough balls.",
        "atmosphere": "Breathtaking cliffside taproom overlooking Quidi Vidi gut with fishermen dories tied below.",
        "beerHighlights": [
          { "name": "Iceberg Beer", "style": "Golden Lager (4.5% ABV)", "abv": "4.5%", "description": "World-famous pristine lager brewed with water harvested from 25,000-year-old Arctic icebergs." },
          { "name": "1892 Traditional Red Ale", "style": "Red Ale (5.0% ABV)", "abv": "5.0%", "description": "Smooth, malty red ale brewed in commemoration of the Great Fire of St. John's." },
          { "name": "Calm Tom", "style": "Double IPA (8.2% ABV)", "abv": "8.2%", "description": "Powerful tropical DIPA packed with Nelson Sauvin and Mosaic hops." }
        ],
        "websiteUrl": "https://quidividibeer.com/"
      },
      {
        "name": "Bannerman Brewing Co.",
        "tagline": "Downtown St. John’s urban brewery and specialty cafe famed for hazy IPAs, stouts, and bao buns",
        "address": "90 Duckworth St, St. John's, NL A1C 1E7",
        "city": "St. John's",
        "state": "NL",
        "country": "Canada",
        "lat": 47.5682,
        "lng": -52.7012,
        "googleScore": 4.8,
        "googleCount": "890+ reviews",
        "untappdScore": 4.62,
        "untappdCount": "48k check-ins",
        "rateBeerScore": 4.58,
        "tripAdvisorScore": 4.7,
        "tripAdvisorCount": "180+ reviews",
        "beerAdvocateScore": 4.58,
        "beerAdvocateCount": "920+ ratings",
        "suggestedDurationMin: 75,
        "bestTimeToVisit": "12:30 PM for lunch bao and fresh pours",
        "foodHighlights": "In-house gourmet bao buns (pork belly, crispy chicken, and tofu), Thai fries, and specialty espresso.",
        "atmosphere": "Chic, light-filled brick building in historic downtown St. John's with bustling community vibe.",
        "beerHighlights": [
          { "name": "Rhode Island Red", "style": "ESB (5.3% ABV)", "abv": "5.3%", "description": "Traditional English extra special bitter with toffee, caramel, and spicy English hops." },
          { "name": "Eclipse", "style": "Hazy IPA (6.6% ABV)", "abv": "6.6%", "description": "Lush tropical fruit, candied peach, and juicy citrus with pillowy mouthfeel." },
          { "name": "Nightfall", "style": "Oatmeal Stout (5.5% ABV)", "abv": "5.5%", "description": "Dark roasted malt, espresso, and creamy oatmeal smoothness." }
        ],
        "websiteUrl": "https://bannermanbrewing.com/"
      },
      {
        "name": "Landwash Brewery",
        "tagline": "Mount Pearl’s beloved modern craft brewery crafting easy-drinking lagers, sours, and hazies",
        "address": "181 Commonwealth Ave, Mount Pearl, NL A1N 2X7",
        "city": "Mount Pearl",
        "state": "NL",
        "country": "Canada",
        "lat": 47.5185,
        "lng": -52.8012,
        "googleScore": 4.8,
        "googleCount": "620+ reviews",
        "untappdScore": 4.55,
        "untappdCount": "38k check-ins",
        "rateBeerScore": 4.50,
        "tripAdvisorScore": 4.6,
        "tripAdvisorCount": "110+ reviews",
        "beerAdvocateScore": 4.52,
        "beerAdvocateCount": "650+ ratings",
        "suggestedDurationMin: 70,
        "bestTimeToVisit": "3:30 PM",
        "foodHighlights": "Resident Saucy Poutines kitchen serving authentic Newfoundland poutine with cheese curds and dressing.",
        "atmosphere": "Airy beer hall with communal picnic tables, visible brew kettles, and board game shelves.",
        "beerHighlights": [
          { "name": "Brackish", "style": "Gose (4.6% ABV)", "abv": "4.6%", "description": "Tart German wheat ale brewed with sea salt from Newfoundland’s Atlantic shoreline and coriander." },
          { "name": "Tide’s Out", "style": "Session IPA (4.5% ABV)", "abv": "4.5%", "description": "Crisp, hoppy, crushable everyday IPA loaded with Citra and Amarillo." }
        ],
        "websiteUrl": "https://landwashbrewery.com/"
      }
    ],
    "hotels": [
      {
        "name": "Alt Hotel St. John's",
        "type": "hotel",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$175 / night",
        "address": "125 Water St, St. John's, NL A1C 5X4",
        "city": "St. John's",
        "state": "NL",
        "lat": 47.5645,
        "lng": -52.7058,
        "description": "Sleek modern harborfront hotel overlooking the Narrows and within walking distance of Bannerman Brewing.",
        "amenities": ["Harbour Views", "Fitness Center", "Pet Friendly", "Fast Wi-Fi"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/Alt+Hotel+St+Johns"
      }
    ],
    "airbnbs": [
      {
        "name": "Jellybean Row Historic Townhouse",
        "type": "airbnb",
        "priceCategory": "100_to_200",
        "estimatedPricePerNight": "$140 / night",
        "address": "Gower St, St. John's, NL A1C 1P3",
        "city": "St. John's",
        "state": "NL",
        "lat": 47.5685,
        "lng": -52.7042,
        "description": "Classic colorful Victorian heritage home on Jellybean Row in downtown St. John's.",
        "amenities": ["Full Kitchen", "Original Wood Fireplace", "Harbor Views", "High-Speed Wi-Fi"],
        "bookingSearchUrl": "https://www.google.com/travel/hotels/s/St+Johns+Jellybean+Row+Airbnb"
      }
    ]
  }
]

print("Script part 1 loaded.")
EOF
node -e 'console.log("Passed part 1");'
