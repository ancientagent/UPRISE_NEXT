import {
  ArtistBandRegistrationSchema,
  PromoterRegistrationSchema,
} from '../src/registrar/dto/registrar.dto';

describe('Registrar DTO schemas', () => {
  it('rejects whitespace-only promoter productionName', () => {
    const parsed = PromoterRegistrationSchema.safeParse({
      sceneId: '11111111-1111-1111-1111-111111111111',
      productionName: '   ',
    });

    expect(parsed.success).toBe(false);
  });

  it('trims promoter productionName before persistence handoff', () => {
    const parsed = PromoterRegistrationSchema.parse({
      sceneId: '11111111-1111-1111-1111-111111111111',
      productionName: '  Southside Signal Co.  ',
    });

    expect(parsed.productionName).toBe('Southside Signal Co.');
  });

  it('rejects whitespace-only artist/band member identity fields', () => {
    const parsed = ArtistBandRegistrationSchema.safeParse({
      sceneId: '11111111-1111-1111-1111-111111111111',
      name: 'Static Signal',
      slug: 'static-signal',
      entityType: 'band',
      members: [
        {
          name: '   ',
          email: 'member@example.com',
          city: 'Austin',
          instrument: 'Drums',
        },
      ],
    });

    expect(parsed.success).toBe(false);
  });

  it('trims artist/band registration payload identity fields', () => {
    const parsed = ArtistBandRegistrationSchema.parse({
      sceneId: '11111111-1111-1111-1111-111111111111',
      name: '  Static Signal  ',
      slug: ' static-signal ',
      entityType: 'band',
      members: [
        {
          name: '  Alex Volt  ',
          email: ' alex@example.com ',
          city: ' Austin ',
          instrument: ' Guitar ',
        },
      ],
    });

    expect(parsed.name).toBe('Static Signal');
    expect(parsed.slug).toBe('static-signal');
    expect(parsed.members[0]).toEqual({
      name: 'Alex Volt',
      email: 'alex@example.com',
      city: 'Austin',
      instrument: 'Guitar',
    });
  });
});
