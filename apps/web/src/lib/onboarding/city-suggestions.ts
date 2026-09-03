import { normalizeUsStateName } from '@/data/us-states';

export interface CitySuggestion {
  description: string;
  placeId: string;
}

export interface SelectedCitySuggestion {
  city: string;
  state: string;
}

/**
 * The Places endpoint keeps its established description/placeId response
 * shape. A selected US description is normalized into the separate manual
 * city/state fields before the Home Scene is persisted.
 */
export function parseSelectedCitySuggestion(
  description: string
): SelectedCitySuggestion | null {
  const parts = description
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 3 || parts.at(-1)?.toLowerCase() !== 'usa') {
    return null;
  }

  const state = normalizeUsStateName(parts.at(-2));
  const city = parts.slice(0, -2).join(', ');
  return city && state ? { city, state } : null;
}

export function buildCityAutocompletePath(input: string, state: string): string {
  const params = new URLSearchParams({ input, country: 'us' });
  if (state.trim()) params.set('state', state.trim());
  return `/places/cities?${params.toString()}`;
}
