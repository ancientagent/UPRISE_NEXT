import { Injectable } from '@nestjs/common';

export interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export interface ReverseGeocodeResult {
  city: string | null;
  state: string | null;
  formattedAddress: string | null;
}

const FAKE_LOCATION_PROVIDER = 'fake';

const FAKE_CITY_FIXTURES = [
  {
    city: 'Austin',
    state: 'Texas',
    latitude: 30.2672,
    longitude: -97.7431,
    aliases: ['austin', 'aus'],
  },
  {
    city: 'El Paso',
    state: 'Texas',
    latitude: 31.7619,
    longitude: -106.485,
    aliases: ['el paso', 'elp'],
  },
  {
    city: 'Houston',
    state: 'Texas',
    latitude: 29.7604,
    longitude: -95.3698,
    aliases: ['houston', 'hou'],
  },
  {
    city: 'Dallas',
    state: 'Texas',
    latitude: 32.7767,
    longitude: -96.797,
    aliases: ['dallas', 'dal'],
  },
  {
    city: 'Los Angeles',
    state: 'California',
    latitude: 34.0522,
    longitude: -118.2437,
    aliases: ['los angeles', 'la'],
  },
  {
    city: 'San Francisco',
    state: 'California',
    latitude: 37.7749,
    longitude: -122.4194,
    aliases: ['san francisco', 'sf'],
  },
  {
    city: 'San Diego',
    state: 'California',
    latitude: 32.7157,
    longitude: -117.1611,
    aliases: ['san diego', 'sd'],
  },
] as const;

function isFakeLocationProvider(): boolean {
  return process.env.UPRISE_LOCATION_PROVIDER?.trim().toLowerCase() === FAKE_LOCATION_PROVIDER;
}

function formatFakePlaceId(city: string, state: string): string {
  return `fake-city-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function haversineMeters(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const earthRadiusMeters = 6371000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLatitude = toRadians(latitudeB - latitudeA);
  const deltaLongitude = toRadians(longitudeB - longitudeA);
  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(latitudeA)) *
      Math.cos(toRadians(latitudeB)) *
      Math.sin(deltaLongitude / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMeters * c;
}

@Injectable()
export class PlacesService {
  async autocompleteCities(input: string, country = 'us'): Promise<PlaceSuggestion[]> {
    if (isFakeLocationProvider()) {
      const normalizedInput = input.trim().toLowerCase();
      if (!normalizedInput) return [];

      return FAKE_CITY_FIXTURES.filter((fixture) =>
        fixture.aliases.some((alias) => alias.includes(normalizedInput))
      ).map((fixture) => ({
        description: `${fixture.city}, ${fixture.state}, USA`,
        placeId: formatFakePlaceId(fixture.city, fixture.state),
      }));
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey || !input.trim()) {
      return [];
    }

    const params = new URLSearchParams({
      input,
      types: '(cities)',
      components: `country:${country.toLowerCase()}`,
      key: apiKey,
    });

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (data.status !== 'OK' || !Array.isArray(data.predictions)) {
      return [];
    }

    return data.predictions.map((item: any) => ({
      description: item.description,
      placeId: item.place_id,
    }));
  }

  async reverseGeocode(
    latitude: number,
    longitude: number,
    country = 'US',
  ): Promise<ReverseGeocodeResult> {
    if (isFakeLocationProvider()) {
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return { city: null, state: null, formattedAddress: null };
      }

      const nearest = FAKE_CITY_FIXTURES.map((fixture) => ({
        fixture,
        distance: haversineMeters(latitude, longitude, fixture.latitude, fixture.longitude),
      })).sort((a, b) => a.distance - b.distance)[0];

      if (!nearest || nearest.distance > 75000 || country.toUpperCase() !== 'US') {
        return { city: null, state: null, formattedAddress: null };
      }

      return {
        city: nearest.fixture.city,
        state: nearest.fixture.state,
        formattedAddress: `${nearest.fixture.city}, ${nearest.fixture.state}, USA`,
      };
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return { city: null, state: null, formattedAddress: null };
    }

    const params = new URLSearchParams({
      latlng: `${latitude},${longitude}`,
      result_type: 'locality|administrative_area_level_1',
      key: apiKey,
    });

    const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      return { city: null, state: null, formattedAddress: null };
    }

    const data = await response.json();
    if (data.status !== 'OK' || !Array.isArray(data.results) || data.results.length === 0) {
      return { city: null, state: null, formattedAddress: null };
    }

    const inCountry = data.results.find((result: any) =>
      Array.isArray(result.address_components) &&
      result.address_components.some(
        (component: any) =>
          Array.isArray(component.types) &&
          component.types.includes('country') &&
          component.short_name?.toUpperCase() === country.toUpperCase(),
      ),
    );
    const best = inCountry ?? data.results[0];
    const components = Array.isArray(best.address_components) ? best.address_components : [];

    const cityComponent = components.find(
      (component: any) =>
        Array.isArray(component.types) &&
        (component.types.includes('locality') || component.types.includes('postal_town')),
    );
    const stateComponent = components.find(
      (component: any) =>
        Array.isArray(component.types) && component.types.includes('administrative_area_level_1'),
    );

    return {
      city: cityComponent?.long_name ?? null,
      state: stateComponent?.short_name ?? null,
      formattedAddress: typeof best.formatted_address === 'string' ? best.formatted_address : null,
    };
  }
}
