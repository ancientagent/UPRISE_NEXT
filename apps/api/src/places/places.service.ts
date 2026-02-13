import { Injectable } from '@nestjs/common';

interface PlaceSuggestion {
  description: string;
  placeId: string;
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
}
