# Standard Geo/Genre Parameters

- city: string (e.g., Austin)
- state: string (full name or code; normalized server-side)
- genre: string (slug or display; maps to genre_id)
- lat: number (WGS84 latitude)
- lng: number (WGS84 longitude)
- radius: number (miles)
- community_key: string (normalized `city-state-genre`, lowercase, dash-separated)

Notes
- Provide either `community_key` OR (`city`,`state`,`genre`) OR (`lat`,`lng`,`radius`).
- Responses echo `community_key` and effective filters.

Examples
- Discovery by community key:
  curl "http://localhost:3000/api/discovery?community_key=austin-texas-hip-hop"

- Discovery by city/state/genre:
  curl "http://localhost:3000/api/discovery?city=Austin&state=Texas&genre=Hip%20Hop"

- Discovery by lat/lng radius:
  curl "http://localhost:3000/api/discovery?lat=30.2672&lng=-97.7431&radius=25&genre=Hip%20Hop"

- Radio queue by community:
  curl "http://localhost:3000/api/radio?community_key=austin-texas-hip-hop"
