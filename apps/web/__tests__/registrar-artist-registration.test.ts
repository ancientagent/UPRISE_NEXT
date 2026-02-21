import {
  buildArtistBandRegistrationPayload,
  createEmptyRegistrarArtistMember,
  normalizeArtistBandSlug,
} from '../src/lib/registrar/artistRegistration';

describe('artistRegistration helpers', () => {
  it('normalizes artist/band slug strings', () => {
    expect(normalizeArtistBandSlug('  My Band_Name!!!  ')).toBe('my-band-name');
  });

  it('creates an empty member draft', () => {
    expect(createEmptyRegistrarArtistMember()).toEqual({
      name: '',
      email: '',
      city: '',
      instrument: '',
    });
  });

  it('builds payload with normalized slug, lowercase email, and trimmed fields', () => {
    const payload = buildArtistBandRegistrationPayload({
      sceneId: ' scene-1 ',
      name: '  The Comets ',
      slugInput: '',
      entityType: 'band',
      members: [
        {
          name: '  Alex ',
          email: 'ALEX@EXAMPLE.COM ',
          city: ' Austin ',
          instrument: ' Guitar ',
        },
      ],
    });

    expect(payload).toEqual({
      sceneId: 'scene-1',
      name: 'The Comets',
      slug: 'the-comets',
      entityType: 'band',
      members: [
        {
          name: 'Alex',
          email: 'alex@example.com',
          city: 'Austin',
          instrument: 'Guitar',
        },
      ],
    });
  });

  it('drops completely blank member rows', () => {
    const payload = buildArtistBandRegistrationPayload({
      sceneId: 'scene-1',
      name: 'Test Artist',
      slugInput: 'test-artist',
      entityType: 'artist',
      members: [
        {
          name: '',
          email: '',
          city: '',
          instrument: '',
        },
        {
          name: 'Sam',
          email: 'sam@example.com',
          city: 'Dallas',
          instrument: 'Drums',
        },
      ],
    });

    expect(payload.members).toHaveLength(1);
    expect(payload.members[0].name).toBe('Sam');
  });
});
