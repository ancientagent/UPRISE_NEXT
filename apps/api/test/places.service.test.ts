import { PlacesService } from '../src/places/places.service';

describe('PlacesService test location provider', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    global.fetch = jest.fn() as any;
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('uses deterministic fake reverse geocoding without calling Google for local GPS smokes', async () => {
    process.env.UPRISE_LOCATION_PROVIDER = 'fake';
    process.env.GOOGLE_PLACES_API_KEY = 'should-not-be-used';

    const service = new PlacesService();

    await expect(service.reverseGeocode(30.2672, -97.7431)).resolves.toEqual({
      city: 'Austin',
      state: 'Texas',
      formattedAddress: 'Austin, Texas, USA',
    });
    await expect(service.reverseGeocode(31.7619, -106.485)).resolves.toEqual({
      city: 'El Paso',
      state: 'Texas',
      formattedAddress: 'El Paso, Texas, USA',
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns launch city suggestions locally in fake mode without calling Google autocomplete', async () => {
    process.env.UPRISE_LOCATION_PROVIDER = 'fake';
    process.env.GOOGLE_PLACES_API_KEY = 'should-not-be-used';

    const service = new PlacesService();

    await expect(service.autocompleteCities('aus')).resolves.toEqual([
      { description: 'Austin, Texas, USA', placeId: 'fake-city-austin-texas' },
    ]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('geocodes supported fake cities without calling Google', async () => {
    process.env.UPRISE_LOCATION_PROVIDER = 'fake';
    process.env.GOOGLE_PLACES_API_KEY = 'should-not-be-used';

    const service = new PlacesService();

    await expect(service.geocodeCity('El Paso', 'Texas')).resolves.toEqual({
      city: 'El Paso',
      state: 'Texas',
      latitude: 31.7619,
      longitude: -106.485,
      formattedAddress: 'El Paso, Texas, USA',
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
