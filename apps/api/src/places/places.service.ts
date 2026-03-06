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

@Injectable()
export class PlacesService {
  async autocompleteCities(input: string, country = 'us'): Promise<PlaceSuggestion[]> {
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
