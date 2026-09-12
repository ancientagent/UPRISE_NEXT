import { PlacesService } from '../src/places/places.service';
import localUsPlaces from '../src/places/data/us-census-2024-places.json';

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
      postalCode: '78701',
      formattedAddress: 'Austin, Texas, USA',
    });
    await expect(service.reverseGeocode(31.7619, -106.485)).resolves.toEqual({
      city: 'El Paso',
      state: 'Texas',
      postalCode: '79901',
      formattedAddress: 'El Paso, Texas, USA',
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('extracts a postal code from Google reverse geocode results when available', async () => {
    process.env.GOOGLE_PLACES_API_KEY = 'test-key';
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'OK',
        results: [
          {
            formatted_address: 'Austin, TX 78704, USA',
            address_components: [
              { long_name: 'Austin', short_name: 'Austin', types: ['locality'] },
              {
                long_name: 'Texas',
                short_name: 'TX',
                types: ['administrative_area_level_1'],
              },
              { long_name: '78704', short_name: '78704', types: ['postal_code'] },
              { long_name: 'United States', short_name: 'US', types: ['country'] },
            ],
          },
        ],
      }),
    } as any);

    const service = new PlacesService();

    await expect(service.reverseGeocode(30.245, -97.75)).resolves.toEqual({
      city: 'Austin',
      state: 'TX',
      postalCode: '78704',
      formattedAddress: 'Austin, TX 78704, USA',
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
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

  it('filters fake city suggestions by either a state name or USPS abbreviation', async () => {
    process.env.UPRISE_LOCATION_PROVIDER = 'fake';
    delete process.env.GOOGLE_PLACES_API_KEY;

    const service = new PlacesService();

    const byName = await service.autocompleteCities('aus', 'us', 'Texas');
    const byAbbreviation = await service.autocompleteCities('aus', 'us', 'TX');

    expect(byName).toEqual([{ description: 'Austin, Texas, USA', placeId: 'fake-city-austin-texas' }]);
    expect(byAbbreviation).toEqual(byName);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uses the local Census place artifact without a Google key, with stable capped ordering', async () => {
    delete process.env.UPRISE_LOCATION_PROVIDER;
    delete process.env.GOOGLE_PLACES_API_KEY;

    const service = new PlacesService();

    const byName = await service.autocompleteCities('Austin', 'us', 'Texas');
    const byAbbreviation = await service.autocompleteCities('Austin', 'us', 'TX');
    const broadFirst = await service.autocompleteCities('a', 'us', 'TX');
    const broadSecond = await service.autocompleteCities('a', 'us', 'TX');

    expect(byName).toEqual(byAbbreviation);
    expect(byName).toContainEqual({
      description: 'Austin, Texas, USA',
      placeId: expect.stringMatching(/^census-gazetteer-2024-place-\d+$/),
    });
    expect(broadFirst).toEqual(broadSecond);
    expect(broadFirst).toHaveLength(8);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('retains Census provenance and a coordinate pair for every local place record', () => {
    expect(localUsPlaces.source).toMatchObject({
      publisher: 'U.S. Census Bureau',
      dataset: '2024 Gazetteer Files - Places (national)',
      sourceUrl:
        'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_place_national.zip',
      archiveSha256: 'cf262fc92b2326f7a8c62a89d156a60eb17d64d6d35f7a62310c43bb08972c06',
    });
    expect(localUsPlaces.places).toHaveLength(32143);
    expect(
      localUsPlaces.places.every(
        (place) =>
          place.length === 4 &&
          typeof place[2] === 'number' &&
          Number.isFinite(place[2]) &&
          typeof place[3] === 'number' &&
          Number.isFinite(place[3]),
      ),
    ).toBe(true);
  });

  it('keeps the configured Google autocomplete provider behavior unchanged', async () => {
    process.env.GOOGLE_PLACES_API_KEY = 'test-key';
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'OK',
        predictions: [{ description: 'Austin, TX, USA', place_id: 'google-austin' }],
      }),
    } as any);

    const service = new PlacesService();

    await expect(service.autocompleteCities('Austin', 'us', 'Texas')).resolves.toEqual([
      { description: 'Austin, TX, USA', placeId: 'google-austin' },
    ]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://maps.googleapis.com/maps/api/place/autocomplete/json?'),
    );
    expect(global.fetch).toHaveBeenCalledWith(expect.not.stringContaining('state=Texas'));
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

  it('geocodes exact local Census city/state input without a Google key', async () => {
    delete process.env.UPRISE_LOCATION_PROVIDER;
    delete process.env.GOOGLE_PLACES_API_KEY;

    const service = new PlacesService();

    await expect(service.geocodeCity('Austin', 'Texas')).resolves.toEqual({
      city: 'Austin',
      state: 'Texas',
      latitude: 30.298622,
      longitude: -97.754134,
      formattedAddress: 'Austin, Texas, USA',
    });
    await expect(service.geocodeCity('  austin  ', 'TX')).resolves.toEqual({
      city: 'Austin',
      state: 'Texas',
      latitude: 30.298622,
      longitude: -97.754134,
      formattedAddress: 'Austin, Texas, USA',
    });
    await expect(service.geocodeCity('Not A Census Place', 'Texas')).resolves.toBeNull();
    await expect(service.geocodeCity('Austin', 'Texas', 'CA')).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
