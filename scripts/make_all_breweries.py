#!/usr/bin/env python3
import json
import os

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

print("Base setup ready.")
