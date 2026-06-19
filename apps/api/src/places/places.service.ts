import { Injectable } from '@nestjs/common';

export interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export interface ReverseGeocodeResult {
  city: string | null;
  state: string | null;
  postalCode: string | null;
  formattedAddress: string | null;
}

export interface CityGeocodeResult {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

const FAKE_LOCATION_PROVIDER = 'fake';

const FAKE_STATE_ALIASES: Record<string, string> = {
  ca: 'california',
  california: 'california',
  tx: 'texas',
  texas: 'texas',
};

const FAKE_CITY_FIXTURES = [
  {
    city: 'Austin',
    state: 'Texas',
    postalCode: '78701',
    latitude: 30.2672,
    longitude: -97.7431,
    aliases: ['austin', 'aus'],
  },
  {
    city: 'El Paso',
    state: 'Texas',
    postalCode: '79901',
    latitude: 31.7619,
    longitude: -106.485,
    aliases: ['el paso', 'elp'],
  },
  {
    city: 'Houston',
    state: 'Texas',
    postalCode: '77002',
    latitude: 29.7604,
    longitude: -95.3698,
    aliases: ['houston', 'hou'],
  },
  {
    city: 'Dallas',
    state: 'Texas',
    postalCode: '75201',
    latitude: 32.7767,
    longitude: -96.797,
    aliases: ['dallas', 'dal'],
  },
  {
    city: 'Los Angeles',
    state: 'California',
    postalCode: '90012',
    latitude: 34.0522,
    longitude: -118.2437,
    aliases: ['los angeles', 'la'],
  },
  {
    city: 'San Francisco',
    state: 'California',
    postalCode: '94102',
    latitude: 37.7749,
    longitude: -122.4194,
    aliases: ['san francisco', 'sf'],
  },
  {
    city: 'San Diego',
    state: 'California',
    postalCode: '92101',
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

function normalizeFakeState(value: string): string {
  const normalized = value.trim().toLowerCase();
  return FAKE_STATE_ALIASES[normalized] ?? normalized;
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
  async geocodeCity(
    city: string,
    state: string,
    country = 'US',
  ): Promise<CityGeocodeResult | null> {
    const normalizedCity = city.trim().toLowerCase();
    const normalizedState = normalizeFakeState(state);
    if (!normalizedCity || !normalizedState || country.toUpperCase() !== 'US') {
      return null;
    }

    if (isFakeLocationProvider()) {
      const fixture = FAKE_CITY_FIXTURES.find(
        (candidate) =>
          candidate.city.toLowerCase() === normalizedCity &&
          normalizeFakeState(candidate.state) === normalizedState,
      );

      if (!fixture) return null;

      return {
        city: fixture.city,
        state: fixture.state,
        latitude: fixture.latitude,
        longitude: fixture.longitude,
        formattedAddress: `${fixture.city}, ${fixture.state}, USA`,
      };
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) return null;

    const params = new URLSearchParams({
      address: `${city.trim()}, ${state.trim()}`,
      components: `country:${country.toUpperCase()}`,
      key: apiKey,
    });

    const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== 'OK' || !Array.isArray(data.results) || data.results.length === 0) {
      return null;
    }

    const best = data.results[0];
    const location = best.geometry?.location;
    if (typeof location?.lat !== 'number' || typeof location?.lng !== 'number') {
      return null;
    }

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
      city: cityComponent?.long_name ?? city.trim(),
      state: stateComponent?.long_name ?? state.trim(),
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress:
        typeof best.formatted_address === 'string'
          ? best.formatted_address
          : `${city.trim()}, ${state.trim()}, ${country.toUpperCase()}`,
    };
  }

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
        return { city: null, state: null, postalCode: null, formattedAddress: null };
      }

      const nearest = FAKE_CITY_FIXTURES.map((fixture) => ({
        fixture,
        distance: haversineMeters(latitude, longitude, fixture.latitude, fixture.longitude),
      })).sort((a, b) => a.distance - b.distance)[0];

      if (!nearest || nearest.distance > 75000 || country.toUpperCase() !== 'US') {
        return { city: null, state: null, postalCode: null, formattedAddress: null };
      }

      return {
        city: nearest.fixture.city,
        state: nearest.fixture.state,
        postalCode: nearest.fixture.postalCode,
        formattedAddress: `${nearest.fixture.city}, ${nearest.fixture.state}, USA`,
      };
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return { city: null, state: null, postalCode: null, formattedAddress: null };
    }

    const params = new URLSearchParams({
      latlng: `${latitude},${longitude}`,
      key: apiKey,
    });

    const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      return { city: null, state: null, postalCode: null, formattedAddress: null };
    }

    const data = await response.json();
    if (data.status !== 'OK' || !Array.isArray(data.results) || data.results.length === 0) {
      return { city: null, state: null, postalCode: null, formattedAddress: null };
    }

    const isInCountry = (result: any) =>
      Array.isArray(result.address_components) &&
      result.address_components.some(
        (component: any) =>
          Array.isArray(component.types) &&
          component.types.includes('country') &&
          component.short_name?.toUpperCase() === country.toUpperCase(),
      );
    const inCountry = data.results.find(isInCountry);
    const citySource =
      data.results.find(
        (result: any) =>
          isInCountry(result) &&
          Array.isArray(result.address_components) &&
          result.address_components.some(
            (component: any) =>
              Array.isArray(component.types) &&
              (component.types.includes('locality') || component.types.includes('postal_town')),
          ) &&
          result.address_components.some(
            (component: any) =>
              Array.isArray(component.types) &&
              component.types.includes('administrative_area_level_1'),
          ),
      ) ??
      inCountry ??
      data.results[0];
    const postalSource =
      data.results.find(
        (result: any) =>
          isInCountry(result) &&
          Array.isArray(result.address_components) &&
          result.address_components.some(
            (component: any) =>
              Array.isArray(component.types) && component.types.includes('postal_code'),
          ),
      ) ?? citySource;
    const best = citySource;
    const components = Array.isArray(best.address_components) ? best.address_components : [];
    const postalComponents = Array.isArray(postalSource.address_components)
      ? postalSource.address_components
      : [];

    const cityComponent = components.find(
      (component: any) =>
        Array.isArray(component.types) &&
        (component.types.includes('locality') || component.types.includes('postal_town')),
    );
    const stateComponent = components.find(
      (component: any) =>
        Array.isArray(component.types) && component.types.includes('administrative_area_level_1'),
    );
    const postalComponent = postalComponents.find(
      (component: any) =>
        Array.isArray(component.types) && component.types.includes('postal_code'),
    );

    return {
      city: cityComponent?.long_name ?? null,
      state: stateComponent?.short_name ?? null,
      postalCode: postalComponent?.long_name ?? null,
      formattedAddress: typeof best.formatted_address === 'string' ? best.formatted_address : null,
    };
  }
}
