import { OnboardingService } from '../src/onboarding/onboarding.service';

function createPrismaMock() {
  const tx = {
    user: {
      update: jest.fn(),
    },
    communityMember: {
      create: jest.fn(),
    },
    community: {
      update: jest.fn(),
    },
    userMusicCommunityPreference: {
      updateMany: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const prisma = {
    community: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    communityMember: {
      create: jest.fn(),
    },
    sectTag: {
      upsert: jest.fn(),
    },
    userTag: {
      upsert: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $transaction: jest.fn(async (callback: any) => callback(tx)),
    __tx: tx,
  };

  return prisma;
}

describe('OnboardingService home-scene resolution', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses an exact active city-tier scene as the Home Scene and voting anchor', async () => {
    const prisma = createPrismaMock();
    const service = new OnboardingService(prisma as any);
    const exactScene = {
      id: 'scene-austin-punk',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'Texas',
      musicCommunity: 'Punk',
      isActive: true,
    };

    prisma.community.findFirst.mockResolvedValue(exactScene);
    prisma.__tx.user.update.mockResolvedValue({
      id: 'user-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      homeSceneTag: null,
      tunedSceneId: 'scene-austin-punk',
      gpsVerified: true,
    });

    const result = await service.setHomeScene('user-1', {
      city: ' Austin ',
      state: ' Texas ',
      musicCommunity: ' Punk ',
    });

    expect(prisma.community.create).not.toHaveBeenCalled();
    expect(prisma.community.findMany).not.toHaveBeenCalled();
    expect(prisma.__tx.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          homeSceneCity: 'Austin',
          homeSceneState: 'Texas',
          homeSceneCommunity: 'Punk',
          homeSceneId: 'scene-austin-punk',
          tunedSceneId: 'scene-austin-punk',
        }),
      })
    );
    expect(prisma.__tx.communityMember.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', communityId: 'scene-austin-punk', role: 'member' },
    });
    expect(result).toMatchObject({
      sceneId: 'scene-austin-punk',
      resolvedCitySceneId: 'scene-austin-punk',
      resolvedCitySceneLabel: 'Austin, Texas • Punk',
      pioneerHomeScene: null,
      votingEligible: true,
      pioneer: false,
    });
  });

  it('normalizes state abbreviations before exact scene lookup and persistence', async () => {
    const prisma = createPrismaMock();
    const service = new OnboardingService(prisma as any);
    const exactScene = {
      id: 'scene-austin-punk',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'Texas',
      musicCommunity: 'Punk',
      isActive: true,
    };

    prisma.community.findFirst.mockResolvedValue(exactScene);
    prisma.__tx.user.update.mockResolvedValue({
      id: 'user-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      homeSceneTag: null,
      tunedSceneId: 'scene-austin-punk',
      gpsVerified: false,
    });

    const result = await service.setHomeScene('user-1', {
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
    });

    expect(prisma.community.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { city: 'Austin', state: 'Texas', musicCommunity: 'Punk', tier: 'city' },
      })
    );
    expect(prisma.__tx.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          homeSceneState: 'Texas',
        }),
      })
    );
    expect(result).toMatchObject({
      pioneer: false,
      resolvedCitySceneLabel: 'Austin, Texas • Punk',
      pioneerHomeScene: null,
    });
  });

  it('writes the selected music community as the default preference during Home Scene onboarding', async () => {
    const prisma = createPrismaMock();
    const service = new OnboardingService(prisma as any);
    const exactScene = {
      id: 'scene-austin-punk',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'Texas',
      musicCommunity: 'Punk',
      isActive: true,
    };
    prisma.community.findFirst.mockResolvedValue(exactScene);
    prisma.__tx.user.update.mockResolvedValue({
      id: 'user-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      homeSceneTag: null,
      tunedSceneId: exactScene.id,
      gpsVerified: false,
    });
    prisma.__tx.communityMember.create.mockResolvedValue({ id: 'member-1' });
    prisma.__tx.community.update.mockResolvedValue({ id: exactScene.id });

    await service.setHomeScene('user-1', {
      city: 'Austin',
      state: 'Texas',
      musicCommunity: 'Punk',
    });

    expect(prisma.__tx.userMusicCommunityPreference.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', isDefault: true },
      data: { isDefault: false },
    });
    expect(prisma.__tx.userMusicCommunityPreference.upsert).toHaveBeenCalledWith({
      where: { userId_musicCommunity: { userId: 'user-1', musicCommunity: 'Punk' } },
      update: { isDefault: true },
      create: { userId: 'user-1', musicCommunity: 'Punk', isDefault: true },
    });
  });

  it('routes an inactive exact tuple to the first active same-state scene while preserving pioneer intent', async () => {
    const prisma = createPrismaMock();
    const service = new OnboardingService(prisma as any);

    prisma.community.findFirst.mockResolvedValue({
      id: 'scene-houston-punk-inactive',
      name: 'Houston Punk',
      city: 'Houston',
      state: 'Texas',
      musicCommunity: 'Punk',
      isActive: false,
    });
    prisma.community.findMany.mockResolvedValueOnce([
      {
        id: 'scene-austin-punk',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'Texas',
        musicCommunity: 'Punk',
        isActive: true,
        memberCount: 25,
      },
    ]);
    prisma.__tx.user.update.mockResolvedValue({
      id: 'user-1',
      homeSceneCity: 'Houston',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      homeSceneTag: null,
      tunedSceneId: 'scene-austin-punk',
      gpsVerified: false,
    });

    const result = await service.setHomeScene('user-1', {
      city: 'Houston',
      state: 'Texas',
      musicCommunity: 'Punk',
    });

    expect(prisma.community.create).not.toHaveBeenCalled();
    expect(prisma.community.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tier: 'city', musicCommunity: 'Punk', state: 'Texas', isActive: true },
      })
    );
    expect(prisma.__tx.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          homeSceneCity: 'Houston',
          homeSceneState: 'Texas',
          homeSceneCommunity: 'Punk',
          tunedSceneId: 'scene-austin-punk',
        }),
      })
    );
    expect(prisma.__tx.communityMember.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', communityId: 'scene-austin-punk', role: 'member' },
    });
    expect(result).toMatchObject({
      sceneId: 'scene-austin-punk',
      resolvedCitySceneId: 'scene-austin-punk',
      resolvedCitySceneLabel: 'Austin, Texas • Punk',
      pioneerHomeScene: { city: 'Houston', state: 'Texas', musicCommunity: 'Punk' },
      pioneer: true,
      votingEligible: false,
    });
  });

  it('routes a missing tuple to the first active community scene without creating a Community', async () => {
    const prisma = createPrismaMock();
    const service = new OnboardingService(prisma as any);

    prisma.community.findFirst.mockResolvedValue(null);
    prisma.community.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        id: 'scene-los-angeles-punk',
        name: 'Los Angeles Punk',
        city: 'Los Angeles',
        state: 'California',
        musicCommunity: 'Punk',
        isActive: true,
        memberCount: 40,
      },
    ]);
    prisma.__tx.user.update.mockResolvedValue({
      id: 'user-1',
      homeSceneCity: 'El Paso',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      homeSceneTag: null,
      tunedSceneId: 'scene-los-angeles-punk',
      gpsVerified: false,
    });

    const result = await service.setHomeScene('user-1', {
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
    });

    expect(prisma.community.create).not.toHaveBeenCalled();
    expect(prisma.community.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { tier: 'city', musicCommunity: 'Punk', isActive: true },
      })
    );
    expect(prisma.__tx.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          homeSceneCity: 'El Paso',
          homeSceneState: 'Texas',
          homeSceneCommunity: 'Punk',
          tunedSceneId: 'scene-los-angeles-punk',
        }),
      })
    );
    expect(prisma.__tx.communityMember.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', communityId: 'scene-los-angeles-punk', role: 'member' },
    });
    expect(result).toMatchObject({
      sceneId: 'scene-los-angeles-punk',
      resolvedCitySceneId: 'scene-los-angeles-punk',
      resolvedCitySceneLabel: 'Los Angeles, California • Punk',
      pioneerHomeScene: { city: 'El Paso', state: 'Texas', musicCommunity: 'Punk' },
      pioneer: true,
    });
  });

  it('routes a missing tuple to the nearest active city scene by distance, not member count', async () => {
    const prisma = createPrismaMock();
    const places = {
      geocodeCity: jest.fn().mockResolvedValue({
        city: 'El Paso',
        state: 'Texas',
        latitude: 31.7619,
        longitude: -106.485,
        formattedAddress: 'El Paso, Texas, USA',
      }),
    };
    const service = new OnboardingService(prisma as any, places as any);

    prisma.community.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'scene-austin-punk',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'Texas',
        musicCommunity: 'Punk',
        isActive: true,
        memberCount: 1,
      });
    prisma.community.findMany.mockResolvedValueOnce([
      {
        id: 'scene-houston-punk',
        name: 'Houston Punk',
        city: 'Houston',
        state: 'Texas',
        musicCommunity: 'Punk',
        isActive: true,
        memberCount: 90,
      },
    ]);
    prisma.$queryRaw.mockResolvedValueOnce([{ id: 'scene-austin-punk', distance: 849000 }]);
    prisma.__tx.user.update.mockResolvedValue({
      id: 'user-1',
      homeSceneCity: 'El Paso',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      homeSceneTag: null,
      tunedSceneId: 'scene-austin-punk',
      gpsVerified: false,
    });

    const result = await service.setHomeScene('user-1', {
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
    });

    expect(places.geocodeCity).toHaveBeenCalledWith('El Paso', 'Texas');
    const distanceSql = prisma.$queryRaw.mock.calls[0][0].join('');
    expect(distanceSql.indexOf('ST_Distance')).toBeLessThan(distanceSql.indexOf('"memberCount"'));
    // Distance ranking still beats the member-count tiebreaker inside the eligible set,
    // even though Houston carries far more members than Austin.
    expect(prisma.community.findFirst).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { id: 'scene-austin-punk', tier: 'city', musicCommunity: 'Punk', isActive: true },
      })
    );
    expect(prisma.__tx.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          homeSceneCity: 'El Paso',
          homeSceneState: 'Texas',
          homeSceneCommunity: 'Punk',
          tunedSceneId: 'scene-austin-punk',
        }),
      })
    );
    expect(result).toMatchObject({
      sceneId: 'scene-austin-punk',
      resolvedCitySceneLabel: 'Austin, Texas • Punk',
      pioneerHomeScene: { city: 'El Paso', state: 'Texas', musicCommunity: 'Punk' },
      pioneer: true,
    });
  });

  it('restricts proxy ranking to same-state candidates so a nearer cross-state scene cannot win', async () => {
    // El Paso, Texas is ~1011km from San Diego, California but ~1086km from Houston, Texas.
    // Distance alone would pick the cross-state scene; the same-state proxy must win.
    const prisma = createPrismaMock();
    const places = {
      geocodeCity: jest.fn().mockResolvedValue({
        city: 'El Paso',
        state: 'Texas',
        latitude: 31.7619,
        longitude: -106.485,
        formattedAddress: 'El Paso, Texas, USA',
      }),
    };
    const service = new OnboardingService(prisma as any, places as any);

    prisma.community.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 'scene-houston-punk',
      name: 'Houston Punk',
      city: 'Houston',
      state: 'Texas',
      musicCommunity: 'Punk',
      isActive: true,
    });
    prisma.community.findMany.mockResolvedValueOnce([
      {
        id: 'scene-houston-punk',
        name: 'Houston Punk',
        city: 'Houston',
        state: 'Texas',
        musicCommunity: 'Punk',
        isActive: true,
        memberCount: 12,
      },
    ]);
    prisma.$queryRaw.mockResolvedValueOnce([{ id: 'scene-houston-punk', distance: 1086000 }]);
    prisma.__tx.user.update.mockResolvedValue({
      id: 'user-1',
      homeSceneCity: 'El Paso',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      homeSceneTag: null,
      tunedSceneId: 'scene-houston-punk',
      gpsVerified: false,
    });

    const result = await service.setHomeScene('user-1', {
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
    });

    // Same-state eligibility must be established before the geospatial query runs,
    // not applied afterwards as a distance tiebreaker.
    const sameStateCallOrder = prisma.community.findMany.mock.invocationCallOrder[0];
    const distanceCallOrder = prisma.$queryRaw.mock.invocationCallOrder[0];
    expect(sameStateCallOrder).toBeLessThan(distanceCallOrder);
    expect(prisma.community.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { tier: 'city', musicCommunity: 'Punk', state: 'Texas', isActive: true },
      })
    );

    const [sqlParts, ...boundValues] = prisma.$queryRaw.mock.calls[0];
    const distanceSql = sqlParts.join('');
    expect(distanceSql).toContain('lower(state) = lower(');
    expect(distanceSql).not.toContain('CASE WHEN');
    expect(boundValues).toContain(true); // sameStateOnly gate is on
    expect(boundValues).toContain('Texas');

    expect(prisma.community.create).not.toHaveBeenCalled();
    expect(prisma.__tx.communityMember.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', communityId: 'scene-houston-punk', role: 'member' },
    });
    expect(result).toMatchObject({
      sceneId: 'scene-houston-punk',
      resolvedCitySceneLabel: 'Houston, Texas • Punk',
      pioneerHomeScene: { city: 'El Paso', state: 'Texas', musicCommunity: 'Punk' },
      pioneer: true,
    });
  });

  it('allows a cross-state proxy only when no same-state active scene exists', async () => {
    const prisma = createPrismaMock();
    const places = {
      geocodeCity: jest.fn().mockResolvedValue({
        city: 'Tulsa',
        state: 'Oklahoma',
        latitude: 36.154,
        longitude: -95.9928,
        formattedAddress: 'Tulsa, Oklahoma, USA',
      }),
    };
    const service = new OnboardingService(prisma as any, places as any);

    prisma.community.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 'scene-dallas-punk',
      name: 'Dallas Punk',
      city: 'Dallas',
      state: 'Texas',
      musicCommunity: 'Punk',
      isActive: true,
    });
    prisma.community.findMany.mockResolvedValueOnce([]);
    prisma.$queryRaw.mockResolvedValueOnce([{ id: 'scene-dallas-punk', distance: 405000 }]);
    prisma.__tx.user.update.mockResolvedValue({
      id: 'user-1',
      homeSceneCity: 'Tulsa',
      homeSceneState: 'Oklahoma',
      homeSceneCommunity: 'Punk',
      homeSceneTag: null,
      tunedSceneId: 'scene-dallas-punk',
      gpsVerified: false,
    });

    const result = await service.setHomeScene('user-1', {
      city: 'Tulsa',
      state: 'Oklahoma',
      musicCommunity: 'Punk',
    });

    const [, ...boundValues] = prisma.$queryRaw.mock.calls[0];
    expect(boundValues).toContain(false); // sameStateOnly gate is off, cross-state eligible

    expect(prisma.community.create).not.toHaveBeenCalled();
    expect(prisma.__tx.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          homeSceneCity: 'Tulsa',
          homeSceneState: 'Oklahoma',
          tunedSceneId: 'scene-dallas-punk',
        }),
      })
    );
    expect(result).toMatchObject({
      sceneId: 'scene-dallas-punk',
      resolvedCitySceneLabel: 'Dallas, Texas • Punk',
      pioneer: true,
    });
  });

  it('verifies GPS against an exact active Home Scene geofence', async () => {
    const prisma = createPrismaMock();
    const places = { reverseGeocode: jest.fn() };
    const service = new OnboardingService(prisma as any, places as any);

    prisma.user.findUnique.mockResolvedValue({
      homeSceneCity: 'Austin',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      tunedSceneId: 'scene-austin-punk',
    });
    prisma.community.findFirst.mockResolvedValue({
      id: 'scene-austin-punk',
      radius: 50000,
      isActive: true,
    });
    prisma.$queryRaw
      .mockResolvedValueOnce([{ has_geofence: true }])
      .mockResolvedValueOnce([{ within: true, distance: 1200 }]);
    prisma.user.update.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      latitude: 30.2672,
      longitude: -97.7431,
    });

    const result = await service.verifyGps('user-1', {
      latitude: 30.2672,
      longitude: -97.7431,
    });

    expect(places.reverseGeocode).not.toHaveBeenCalled();
    expect(prisma.community.findUnique).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      gpsVerified: true,
      votingEligible: true,
      votingSceneId: 'scene-austin-punk',
      distance: 1200,
      reason: null,
    });
  });

  it('stores GPS coordinates but keeps voting disabled before Home Scene selection exists', async () => {
    const prisma = createPrismaMock();
    const places = { reverseGeocode: jest.fn() };
    const service = new OnboardingService(prisma as any, places as any);

    prisma.user.findUnique.mockResolvedValue({
      homeSceneCity: null,
      homeSceneState: null,
      homeSceneCommunity: null,
      tunedSceneId: null,
    });
    prisma.user.update.mockResolvedValue({
      id: 'user-1',
      gpsVerified: false,
      latitude: 30.2672,
      longitude: -97.7431,
    });

    const result = await service.verifyGps('user-1', {
      latitude: 30.2672,
      longitude: -97.7431,
    });

    expect(places.reverseGeocode).not.toHaveBeenCalled();
    expect(prisma.community.findFirst).not.toHaveBeenCalled();
    expect(prisma.community.findUnique).not.toHaveBeenCalled();
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        gpsVerified: false,
        latitude: 30.2672,
        longitude: -97.7431,
      },
      select: { id: true, gpsVerified: true, latitude: true, longitude: true },
    });
    expect(result).toMatchObject({
      gpsVerified: false,
      votingEligible: false,
      reason: 'NO_HOME_SCENE',
    });
  });

  it('verifies GPS against submitted city/state while voting at fallback when Home Scene is unavailable', async () => {
    const prisma = createPrismaMock();
    const places = {
      reverseGeocode: jest.fn().mockResolvedValue({
        city: 'El Paso',
        state: 'TX',
        formattedAddress: 'El Paso, TX, USA',
      }),
    };
    const service = new OnboardingService(prisma as any, places as any);

    prisma.user.findUnique.mockResolvedValue({
      homeSceneCity: 'El Paso',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      tunedSceneId: 'scene-austin-punk',
    });
    prisma.community.findFirst.mockResolvedValue(null);
    prisma.community.findUnique.mockResolvedValue({ id: 'scene-austin-punk', radius: 50000 });
    prisma.user.update.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      latitude: 31.7619,
      longitude: -106.485,
    });

    const result = await service.verifyGps('user-1', {
      latitude: 31.7619,
      longitude: -106.485,
    });

    expect(places.reverseGeocode).toHaveBeenCalledWith(31.7619, -106.485);
    expect(prisma.community.findUnique).toHaveBeenCalledWith({
      where: { id: 'scene-austin-punk' },
      select: { id: true, radius: true },
    });
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      gpsVerified: true,
      votingEligible: true,
      votingSceneId: 'scene-austin-punk',
      distance: null,
      reason: null,
    });
  });

  it('rejects GPS for unavailable Home Scene when submitted city/state does not match reverse geocode', async () => {
    const prisma = createPrismaMock();
    const places = {
      reverseGeocode: jest.fn().mockResolvedValue({
        city: 'Austin',
        state: 'TX',
        formattedAddress: 'Austin, TX, USA',
      }),
    };
    const service = new OnboardingService(prisma as any, places as any);

    prisma.user.findUnique.mockResolvedValue({
      homeSceneCity: 'El Paso',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      tunedSceneId: 'scene-austin-punk',
    });
    prisma.community.findFirst.mockResolvedValue(null);
    prisma.community.findUnique.mockResolvedValue({ id: 'scene-austin-punk', radius: 50000 });
    prisma.user.update.mockResolvedValue({
      id: 'user-1',
      gpsVerified: false,
      latitude: 30.2672,
      longitude: -97.7431,
    });

    const result = await service.verifyGps('user-1', {
      latitude: 30.2672,
      longitude: -97.7431,
    });

    expect(prisma.$queryRaw).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      gpsVerified: false,
      votingEligible: false,
      votingSceneId: 'scene-austin-punk',
      distance: null,
      reason: 'SUBMITTED_LOCATION_MISMATCH',
    });
  });

  it('fails closed when submitted-location reverse geocoding is unavailable', async () => {
    const prisma = createPrismaMock();
    const places = {
      reverseGeocode: jest.fn().mockRejectedValue(new Error('geocoder unavailable')),
    };
    const service = new OnboardingService(prisma as any, places as any);

    prisma.user.findUnique.mockResolvedValue({
      homeSceneCity: 'El Paso',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      tunedSceneId: 'scene-austin-punk',
    });
    prisma.community.findFirst.mockResolvedValue(null);
    prisma.community.findUnique.mockResolvedValue({ id: 'scene-austin-punk', radius: 50000 });
    prisma.user.update.mockResolvedValue({
      id: 'user-1',
      gpsVerified: false,
      latitude: 31.7619,
      longitude: -106.485,
    });

    const result = await service.verifyGps('user-1', {
      latitude: 31.7619,
      longitude: -106.485,
    });

    expect(result).toMatchObject({
      gpsVerified: false,
      votingEligible: false,
      votingSceneId: 'scene-austin-punk',
      distance: null,
      reason: 'SUBMITTED_LOCATION_NOT_VERIFIED',
    });
  });
});
