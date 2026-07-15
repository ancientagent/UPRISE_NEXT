import {
  ArtistBandRegistrationSchema,
  PromoterRegistrationSchema,
  ProjectRegistrationSchema,
  RegistrarCodeRedeemSchema,
  RegistrarCodeVerifySchema,
  SectMotionRegistrationSchema,
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

  it('rejects whitespace-only project registration projectName', () => {
    const parsed = ProjectRegistrationSchema.safeParse({
      sceneId: '11111111-1111-1111-1111-111111111111',
      projectName: '   ',
    });

    expect(parsed.success).toBe(false);
  });

  it('trims project registration projectName before persistence handoff', () => {
    const parsed = ProjectRegistrationSchema.parse({
      sceneId: '11111111-1111-1111-1111-111111111111',
      projectName: '  All-Ages Venue Buildout  ',
    });

    expect(parsed.projectName).toBe('All-Ages Venue Buildout');
  });

  it('accepts and trims a named listener Sect request', () => {
    const parsed = SectMotionRegistrationSchema.parse({
      sceneId: '11111111-1111-1111-1111-111111111111',
      sectName: '  Noise Art  ',
    });

    expect(parsed).toEqual({
      sceneId: '11111111-1111-1111-1111-111111111111',
      sectName: 'Noise Art',
    });
  });

  it('rejects invalid sect motion sceneId payload', () => {
    const parsed = SectMotionRegistrationSchema.safeParse({
      sceneId: 'not-a-uuid',
      sectName: 'Noise Art',
    });

    expect(parsed.success).toBe(false);
  });

  it('rejects a missing or blank Sect request name', () => {
    expect(
      SectMotionRegistrationSchema.safeParse({
        sceneId: '11111111-1111-1111-1111-111111111111',
      }).success,
    ).toBe(false);
    expect(
      SectMotionRegistrationSchema.safeParse({
        sceneId: '11111111-1111-1111-1111-111111111111',
        sectName: '   ',
      }).success,
    ).toBe(false);
  });

  it('rejects Sect request names longer than 140 characters', () => {
    const parsed = SectMotionRegistrationSchema.safeParse({
      sceneId: '11111111-1111-1111-1111-111111111111',
      sectName: 'a'.repeat(141),
    });

    expect(parsed.success).toBe(false);
  });

  it('does not pass unknown Sect request fields to persistence', () => {
    const parsed = SectMotionRegistrationSchema.parse({
      sceneId: '11111111-1111-1111-1111-111111111111',
      sectName: 'Noise Art',
      status: 'active',
      sourceIds: ['artist-1'],
    });

    expect(parsed).toEqual({
      sceneId: '11111111-1111-1111-1111-111111111111',
      sectName: 'Noise Art',
    });
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

  it('trims registrar code verify payload', () => {
    const parsed = RegistrarCodeVerifySchema.parse({
      code: '  PRC-ABCDEF1234  ',
    });

    expect(parsed.code).toBe('PRC-ABCDEF1234');
  });

  it('rejects empty registrar code redeem payload', () => {
    const parsed = RegistrarCodeRedeemSchema.safeParse({
      code: '    ',
    });

    expect(parsed.success).toBe(false);
  });
});
