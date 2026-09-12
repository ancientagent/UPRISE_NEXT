import {
  buildCityAutocompletePath,
  parseSelectedCitySuggestion,
} from '../src/lib/onboarding/city-suggestions';

describe('onboarding city suggestions', () => {
  it('passes the typed state filter through the existing Places client path', () => {
    expect(buildCityAutocompletePath('Austin', 'TX')).toBe(
      '/places/cities?input=Austin&country=us&state=TX'
    );
  });

  it('normalizes a selected place description into the separate manual City and State fields', () => {
    expect(parseSelectedCitySuggestion('Austin, TX, USA')).toEqual({
      city: 'Austin',
      state: 'Texas',
    });
    expect(parseSelectedCitySuggestion('Austin, Texas, USA')).toEqual({
      city: 'Austin',
      state: 'Texas',
    });
  });

  it('does not treat a non-US or malformed provider description as a manual location selection', () => {
    expect(parseSelectedCitySuggestion('Austin, Texas')).toBeNull();
    expect(parseSelectedCitySuggestion('Austin, Texas, Canada')).toBeNull();
  });
});
