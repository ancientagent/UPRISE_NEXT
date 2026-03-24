import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RegistrarService } from '../src/registrar/registrar.service';

describe('RegistrarService', () => {
  const mockPrisma = {
    community: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    registrarEntry: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    registrarArtistMember: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    registrarInviteDelivery: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    registrarCode: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    userCapabilityGrant: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    capabilityGrantAuditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    artistBand: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    artistBandMember: {
      create: jest.fn(),
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let service: RegistrarService;

  const validDto = {
    sceneId: '11111111-1111-1111-1111-111111111111',
    name: 'Static Signal',
    slug: 'static-signal',
    entityType: 'band' as const,
    members: [
      {
        name: 'Alex Volt',
        email: 'alex@example.com',
        city: 'Austin',
        instrument: 'Guitar',
      },
      {
        name: 'Sam Pulse',
        email: 'sam@example.com',
        city: 'Austin',
        instrument: 'Drums',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (callback: (tx: typeof mockPrisma) => unknown) =>
      callback(mockPrisma as any),
    );
    mockPrisma.registrarCode.findFirst.mockResolvedValue(null);
    mockPrisma.registrarCode.findMany.mockResolvedValue([]);
    mockPrisma.userCapabilityGrant.findMany.mockResolvedValue([]);
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue(null);
    mockPrisma.userCapabilityGrant.upsert.mockResolvedValue({
      id: 'grant-default',
      capability: 'promoter_capability',
      status: 'active',
      grantedAt: new Date('2026-02-24T10:25:00.000Z'),
      sourceRegistrarEntryId: 'reg-promoter-approved-1',
      sourceRegistrarCodeId: 'rcode-default',
    });
    mockPrisma.userCapabilityGrant.update.mockImplementation(async ({ where, data }: any) => ({
      id: where.id,
      userId: 'u-1',
      capability: 'promoter_capability',
      status: data.status,
      revokedAt: data.revokedAt,
      sourceRegistrarEntryId: 'reg-promoter-approved-1',
      sourceRegistrarCodeId: 'rcode-default',
    }));
    mockPrisma.capabilityGrantAuditLog.findMany.mockResolvedValue([]);
    service = new RegistrarService(mockPrisma as any);
  });

  it('submits promoter registration for Home Scene with named production identity', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });
    mockPrisma.registrarEntry.create.mockResolvedValue({
      id: 'reg-promoter-1',
      type: 'promoter_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { productionName: 'Southside Signal Co.' },
      createdAt: new Date('2026-02-21T16:00:00.000Z'),
    });

    const result = await service.submitPromoterRegistration('u-1', {
      sceneId: 'scene-1',
      productionName: 'Southside Signal Co.',
    });

    expect(mockPrisma.registrarEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'promoter_registration',
          status: 'submitted',
          sceneId: 'scene-1',
          createdById: 'u-1',
          payload: { productionName: 'Southside Signal Co.' },
        }),
      }),
    );
    expect(result.type).toBe('promoter_registration');
  });

  it('rejects promoter registration when requester is outside Home Scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-2',
      city: 'Dallas',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitPromoterRegistration('u-1', {
        sceneId: 'scene-2',
        productionName: 'Southside Signal Co.',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects promoter registration when scene is missing', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitPromoterRegistration('u-1', {
        sceneId: 'missing-scene',
        productionName: 'Southside Signal Co.',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects promoter registration when requester user is missing', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.submitPromoterRegistration('u-missing', {
        sceneId: 'scene-1',
        productionName: 'Southside Signal Co.',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects promoter registration for non city-tier scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-state',
      city: null,
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'state',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitPromoterRegistration('u-1', {
        sceneId: 'scene-state',
        productionName: 'Southside Signal Co.',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects promoter registration when requester has no established Home Scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: null,
      homeSceneState: null,
      homeSceneCommunity: null,
    });

    await expect(
      service.submitPromoterRegistration('u-1', {
        sceneId: 'scene-1',
        productionName: 'Southside Signal Co.',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('submits project registration for Home Scene signal activation flow', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });
    mockPrisma.registrarEntry.create.mockResolvedValue({
      id: 'reg-project-1',
      type: 'project_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { projectName: 'All-Ages Venue Buildout' },
      createdAt: new Date('2026-02-24T21:30:00.000Z'),
    });

    const result = await service.submitProjectRegistration('u-1', {
      sceneId: 'scene-1',
      projectName: 'All-Ages Venue Buildout',
    });

    expect(mockPrisma.registrarEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'project_registration',
          status: 'submitted',
          sceneId: 'scene-1',
          createdById: 'u-1',
          payload: { projectName: 'All-Ages Venue Buildout' },
        }),
      }),
    );
    expect(result.type).toBe('project_registration');
  });

  it('rejects project registration when requester is outside Home Scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-2',
      city: 'Dallas',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitProjectRegistration('u-1', {
        sceneId: 'scene-2',
        projectName: 'All-Ages Venue Buildout',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects project registration when scene is missing', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitProjectRegistration('u-1', {
        sceneId: 'missing-scene',
        projectName: 'All-Ages Venue Buildout',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects project registration when requester user is missing', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.submitProjectRegistration('u-missing', {
        sceneId: 'scene-1',
        projectName: 'All-Ages Venue Buildout',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects project registration for non city-tier scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-state',
      city: null,
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'state',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitProjectRegistration('u-1', {
        sceneId: 'scene-state',
        projectName: 'All-Ages Venue Buildout',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects project registration when requester has no established Home Scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: null,
      homeSceneState: null,
      homeSceneCommunity: null,
    });

    await expect(
      service.submitProjectRegistration('u-1', {
        sceneId: 'scene-1',
        projectName: 'All-Ages Venue Buildout',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('submits sect-motion registration for Home Scene civic filing flow', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });
    mockPrisma.registrarEntry.create.mockResolvedValue({
      id: 'reg-sect-motion-1',
      type: 'sect_motion',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: {},
      createdAt: new Date('2026-02-25T00:10:00.000Z'),
    });

    const result = await service.submitSectMotionRegistration('u-1', {
      sceneId: 'scene-1',
    });

    expect(mockPrisma.registrarEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'sect_motion',
          status: 'submitted',
          sceneId: 'scene-1',
          createdById: 'u-1',
          payload: {},
        }),
      }),
    );
    expect(result.type).toBe('sect_motion');
  });

  it('rejects sect-motion registration when requester is outside Home Scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-2',
      city: 'Dallas',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitSectMotionRegistration('u-1', {
        sceneId: 'scene-2',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects sect-motion registration when scene is missing', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitSectMotionRegistration('u-1', {
        sceneId: 'missing-scene',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects sect-motion registration when requester user is missing', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.submitSectMotionRegistration('u-missing', {
        sceneId: 'scene-1',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects sect-motion registration for non city-tier scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-state',
      city: null,
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'state',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitSectMotionRegistration('u-1', {
        sceneId: 'scene-state',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects sect-motion registration when requester has no established Home Scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: null,
      homeSceneState: null,
      homeSceneCommunity: null,
    });

    await expect(
      service.submitSectMotionRegistration('u-1', {
        sceneId: 'scene-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('lists submitter-owned promoter registrations with scene context', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-promoter-2',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: 'Southside Signal Co.' },
        createdAt: new Date('2026-02-21T18:00:00.000Z'),
        updatedAt: new Date('2026-02-21T18:05:00.000Z'),
        scene: {
          id: 'scene-1',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
          tier: 'city',
        },
      },
    ]);

    const result = await service.listPromoterRegistrations('u-1');

    expect(mockPrisma.registrarEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          createdById: 'u-1',
          type: 'promoter_registration',
        }),
      }),
    );
    expect(result.total).toBe(1);
    expect(result.countsByStatus).toEqual({ submitted: 1 });
    expect(result.entries[0]).toEqual(
      expect.objectContaining({
        id: 'reg-promoter-2',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: 'Southside Signal Co.' },
      }),
    );
  });

  it('includes promoter capability transition summary in promoter list reads', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-promoter-2',
        type: 'promoter_registration',
        status: 'approved',
        sceneId: 'scene-1',
        payload: { productionName: 'Southside Signal Co.' },
        createdAt: new Date('2026-02-21T18:00:00.000Z'),
        updatedAt: new Date('2026-02-21T18:05:00.000Z'),
        scene: null,
      },
    ]);
    mockPrisma.registrarCode.findMany.mockResolvedValue([
      {
        registrarEntryId: 'reg-promoter-2',
        status: 'issued',
        createdAt: new Date('2026-02-24T10:00:00.000Z'),
        redeemedAt: null,
      },
      {
        registrarEntryId: 'reg-promoter-2',
        status: 'redeemed',
        createdAt: new Date('2026-02-24T11:00:00.000Z'),
        redeemedAt: new Date('2026-02-24T12:00:00.000Z'),
      },
    ]);
    mockPrisma.userCapabilityGrant.findMany.mockResolvedValue([
      {
        sourceRegistrarEntryId: 'reg-promoter-2',
        grantedAt: new Date('2026-02-24T12:00:00.000Z'),
      },
    ]);

    const result = await service.listPromoterRegistrations('u-1');

    expect(result.entries[0].promoterCapability).toEqual({
      codeIssuedCount: 2,
      latestCodeStatus: 'redeemed',
      latestCodeIssuedAt: new Date('2026-02-24T11:00:00.000Z'),
      latestCodeRedeemedAt: new Date('2026-02-24T12:00:00.000Z'),
      granted: true,
      grantedAt: new Date('2026-02-24T12:00:00.000Z'),
    });
  });

  it('returns empty list when submitter has no promoter registrations', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([]);

    const result = await service.listPromoterRegistrations('u-1');

    expect(result).toEqual({
      total: 0,
      countsByStatus: {},
      entries: [],
    });
    expect(mockPrisma.registrarCode.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.userCapabilityGrant.findMany).not.toHaveBeenCalled();
  });

  it('aggregates promoter list counts across mixed statuses', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-promoter-10',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: 'Southside Signal Co.' },
        createdAt: new Date('2026-02-21T18:00:00.000Z'),
        updatedAt: new Date('2026-02-21T18:05:00.000Z'),
        scene: null,
      },
      {
        id: 'reg-promoter-11',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: 'Riverlight Events' },
        createdAt: new Date('2026-02-21T18:06:00.000Z'),
        updatedAt: new Date('2026-02-21T18:10:00.000Z'),
        scene: null,
      },
      {
        id: 'reg-promoter-12',
        type: 'promoter_registration',
        status: 'approved',
        sceneId: 'scene-1',
        payload: { productionName: 'Afterhours Assembly' },
        createdAt: new Date('2026-02-21T18:11:00.000Z'),
        updatedAt: new Date('2026-02-21T18:20:00.000Z'),
        scene: null,
      },
    ]);

    const result = await service.listPromoterRegistrations('u-1');

    expect(result.total).toBe(3);
    expect(result.countsByStatus).toEqual({
      submitted: 2,
      approved: 1,
    });
  });

  it('preserves reverse-chronological ordering from promoter list reads', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-promoter-new',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: 'Newest' },
        createdAt: new Date('2026-02-21T19:00:00.000Z'),
        updatedAt: new Date('2026-02-21T19:00:00.000Z'),
        scene: null,
      },
      {
        id: 'reg-promoter-old',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: 'Oldest' },
        createdAt: new Date('2026-02-21T18:00:00.000Z'),
        updatedAt: new Date('2026-02-21T18:00:00.000Z'),
        scene: null,
      },
    ]);

    const result = await service.listPromoterRegistrations('u-1');

    expect(result.entries.map((entry: any) => entry.id)).toEqual(['reg-promoter-new', 'reg-promoter-old']);
    expect(mockPrisma.registrarEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
      }),
    );
  });

  it('normalizes missing promoter payload field to null in list reads', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-promoter-13',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: {},
        createdAt: new Date('2026-02-21T18:21:00.000Z'),
        updatedAt: new Date('2026-02-21T18:22:00.000Z'),
        scene: null,
      },
    ]);

    const result = await service.listPromoterRegistrations('u-1');

    expect(result.entries[0].payload).toEqual({
      productionName: null,
    });
  });

  it('trims promoter payload productionName in list reads', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-promoter-14',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: '  Southside Signal Co.  ' },
        createdAt: new Date('2026-02-21T18:23:00.000Z'),
        updatedAt: new Date('2026-02-21T18:24:00.000Z'),
        scene: null,
      },
    ]);

    const result = await service.listPromoterRegistrations('u-1');

    expect(result.entries[0].payload).toEqual({
      productionName: 'Southside Signal Co.',
    });
  });

  it('normalizes whitespace-only productionName to null in list reads', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-promoter-15',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: '    ' },
        createdAt: new Date('2026-02-21T18:25:00.000Z'),
        updatedAt: new Date('2026-02-21T18:26:00.000Z'),
        scene: null,
      },
    ]);

    const result = await service.listPromoterRegistrations('u-1');

    expect(result.entries[0].payload).toEqual({
      productionName: null,
    });
  });

  it('reads submitter-owned promoter registration detail', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-3',
      type: 'promoter_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { productionName: 'Southside Signal Co.' },
      createdAt: new Date('2026-02-21T19:00:00.000Z'),
      updatedAt: new Date('2026-02-21T19:05:00.000Z'),
      scene: {
        id: 'scene-1',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'punk',
        tier: 'city',
      },
    });

    const result = await service.getPromoterRegistration('u-1', 'reg-promoter-3');

    expect(mockPrisma.registrarEntry.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'reg-promoter-3' },
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'reg-promoter-3',
        type: 'promoter_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { productionName: 'Southside Signal Co.' },
        scene: expect.objectContaining({
          id: 'scene-1',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
          tier: 'city',
        }),
      }),
    );
  });

  it('includes promoter capability transition summary in promoter detail reads', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-3',
      type: 'promoter_registration',
      status: 'approved',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { productionName: 'Southside Signal Co.' },
      createdAt: new Date('2026-02-21T19:00:00.000Z'),
      updatedAt: new Date('2026-02-21T19:05:00.000Z'),
      scene: null,
    });
    mockPrisma.registrarCode.findMany.mockResolvedValue([
      {
        status: 'issued',
        createdAt: new Date('2026-02-24T11:00:00.000Z'),
        redeemedAt: null,
      },
    ]);
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({
      grantedAt: new Date('2026-02-24T12:00:00.000Z'),
    });

    const result = await service.getPromoterRegistration('u-1', 'reg-promoter-3');

    expect(result.promoterCapability).toEqual({
      codeIssuedCount: 1,
      latestCodeStatus: 'issued',
      latestCodeIssuedAt: new Date('2026-02-24T11:00:00.000Z'),
      latestCodeRedeemedAt: null,
      granted: true,
      grantedAt: new Date('2026-02-24T12:00:00.000Z'),
    });
  });

  it('trims promoter payload productionName in detail reads', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-5',
      type: 'promoter_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { productionName: '  Riverlight Events  ' },
      createdAt: new Date('2026-02-21T19:10:00.000Z'),
      updatedAt: new Date('2026-02-21T19:11:00.000Z'),
      scene: null,
    });

    const result = await service.getPromoterRegistration('u-1', 'reg-promoter-5');

    expect(result.payload).toEqual({
      productionName: 'Riverlight Events',
    });
  });

  it('normalizes whitespace-only productionName to null in detail reads', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-6',
      type: 'promoter_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { productionName: '   ' },
      createdAt: new Date('2026-02-21T19:12:00.000Z'),
      updatedAt: new Date('2026-02-21T19:13:00.000Z'),
      scene: null,
    });

    const result = await service.getPromoterRegistration('u-1', 'reg-promoter-6');

    expect(result.payload).toEqual({
      productionName: null,
    });
  });

  it('rejects promoter detail read for non-submitting user', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-4',
      type: 'promoter_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-9',
      payload: { productionName: 'Southside Signal Co.' },
      scene: null,
    });

    await expect(service.getPromoterRegistration('u-1', 'reg-promoter-4')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('rejects promoter detail read for non-promoter registrar entry type', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-artist-1',
      type: 'artist_band_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { name: 'Static Signal' },
      scene: null,
    });

    await expect(service.getPromoterRegistration('u-1', 'reg-artist-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('throws when promoter detail entry does not exist', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(service.getPromoterRegistration('u-1', 'missing-promoter-entry')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('lists promoter capability audit events for submitter-owned registration', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-3',
      type: 'promoter_registration',
      createdById: 'u-1',
    });
    mockPrisma.capabilityGrantAuditLog.findMany.mockResolvedValue([
      {
        id: 'audit-2',
        action: 'capability_granted',
        actorType: 'system',
        targetUserId: 'u-1',
        actorUserId: null,
        registrarCodeId: 'rcode-1',
        metadata: { grantStatus: 'active' },
        createdAt: new Date('2026-02-24T12:00:00.000Z'),
      },
      {
        id: 'audit-1',
        action: 'code_redeemed',
        actorType: 'user',
        targetUserId: 'u-1',
        actorUserId: 'u-1',
        registrarCodeId: 'rcode-1',
        metadata: null,
        createdAt: new Date('2026-02-24T11:59:00.000Z'),
      },
    ]);

    const result = await service.listPromoterCapabilityAudit('u-1', 'reg-promoter-3');

    expect(result).toEqual({
      registrarEntryId: 'reg-promoter-3',
      total: 2,
      events: expect.any(Array),
    });
    expect(mockPrisma.capabilityGrantAuditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          registrarEntryId: 'reg-promoter-3',
          capability: 'promoter_capability',
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  });

  it('rejects promoter capability audit read for non-submitting user', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-3',
      type: 'promoter_registration',
      createdById: 'u-9',
    });

    await expect(service.listPromoterCapabilityAudit('u-1', 'reg-promoter-3')).rejects.toThrow(
      ForbiddenException,
    );
    expect(mockPrisma.capabilityGrantAuditLog.findMany).not.toHaveBeenCalled();
  });

  it('lists submitter-owned project registrations with scene context', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-project-1',
        type: 'project_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { projectName: 'All-Ages Venue Buildout' },
        createdAt: new Date('2026-02-25T02:00:00.000Z'),
        updatedAt: new Date('2026-02-25T02:10:00.000Z'),
        scene: {
          id: 'scene-1',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
          tier: 'city',
        },
      },
    ]);

    const result = await service.listProjectRegistrations('u-1');

    expect(mockPrisma.registrarEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          createdById: 'u-1',
          type: 'project_registration',
        }),
      }),
    );
    expect(result.total).toBe(1);
    expect(result.countsByStatus).toEqual({ submitted: 1 });
    expect(result.entries[0]).toEqual(
      expect.objectContaining({
        id: 'reg-project-1',
        type: 'project_registration',
        status: 'submitted',
        payload: { projectName: 'All-Ages Venue Buildout' },
      }),
    );
  });

  it('normalizes blank projectName to null in project list reads', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-project-2',
        type: 'project_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: { projectName: '   ' },
        createdAt: new Date('2026-02-25T02:20:00.000Z'),
        updatedAt: new Date('2026-02-25T02:30:00.000Z'),
        scene: null,
      },
    ]);

    const result = await service.listProjectRegistrations('u-1');
    expect(result.entries[0].payload).toEqual({ projectName: null });
  });

  it('normalizes malformed project payload to null projectName in project list reads', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-project-2b',
        type: 'project_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: 'malformed-payload',
        createdAt: new Date('2026-02-25T02:22:00.000Z'),
        updatedAt: new Date('2026-02-25T02:23:00.000Z'),
        scene: null,
      },
    ]);

    const result = await service.listProjectRegistrations('u-1');
    expect(result.entries[0].payload).toEqual({ projectName: null });
  });

  it('reads submitter-owned project registration detail', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-project-3',
      type: 'project_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { projectName: '  All-Ages Venue Buildout  ' },
      createdAt: new Date('2026-02-25T02:40:00.000Z'),
      updatedAt: new Date('2026-02-25T02:41:00.000Z'),
      scene: null,
    });

    const result = await service.getProjectRegistration('u-1', 'reg-project-3');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'reg-project-3',
        type: 'project_registration',
        payload: { projectName: 'All-Ages Venue Buildout' },
      }),
    );
  });

  it('normalizes malformed project payload to null projectName in project detail reads', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-project-3b',
      type: 'project_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: ['malformed-payload'],
      createdAt: new Date('2026-02-25T02:42:00.000Z'),
      updatedAt: new Date('2026-02-25T02:43:00.000Z'),
      scene: null,
    });

    const result = await service.getProjectRegistration('u-1', 'reg-project-3b');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'reg-project-3b',
        type: 'project_registration',
        payload: { projectName: null },
      }),
    );
  });

  it('rejects project detail read for non-submitting user', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-project-4',
      type: 'project_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-9',
      payload: { projectName: 'All-Ages Venue Buildout' },
      scene: null,
    });

    await expect(service.getProjectRegistration('u-1', 'reg-project-4')).rejects.toThrow(ForbiddenException);
  });

  it('rejects project detail read for non-project registrar entry type', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-99',
      type: 'promoter_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { productionName: 'Southside Signal Co.' },
      scene: null,
    });

    await expect(service.getProjectRegistration('u-1', 'reg-promoter-99')).rejects.toThrow(ForbiddenException);
  });

  it('throws when project detail entry does not exist', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(service.getProjectRegistration('u-1', 'missing-project-entry')).rejects.toThrow(NotFoundException);
  });

  it('lists submitter-owned sect motions with scene context', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-sect-1',
        type: 'sect_motion',
        status: 'submitted',
        sceneId: 'scene-1',
        payload: {},
        createdAt: new Date('2026-02-25T03:00:00.000Z'),
        updatedAt: new Date('2026-02-25T03:01:00.000Z'),
        scene: {
          id: 'scene-1',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
          tier: 'city',
        },
      },
    ]);

    const result = await service.listSectMotionRegistrations('u-1');

    expect(mockPrisma.registrarEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          createdById: 'u-1',
          type: 'sect_motion',
        }),
      }),
    );
    expect(result.total).toBe(1);
    expect(result.countsByStatus).toEqual({ submitted: 1 });
    expect(result.entries[0]).toEqual(
      expect.objectContaining({
        id: 'reg-sect-1',
        type: 'sect_motion',
        status: 'submitted',
        payload: {},
      }),
    );
  });

  it('reads submitter-owned sect motion detail', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-sect-2',
      type: 'sect_motion',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: null,
      createdAt: new Date('2026-02-25T03:10:00.000Z'),
      updatedAt: new Date('2026-02-25T03:11:00.000Z'),
      scene: null,
    });

    const result = await service.getSectMotionRegistration('u-1', 'reg-sect-2');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'reg-sect-2',
        type: 'sect_motion',
        payload: {},
      }),
    );
  });

  it('rejects sect-motion detail read for non-submitting user', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-sect-3',
      type: 'sect_motion',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-9',
      payload: {},
      scene: null,
    });

    await expect(service.getSectMotionRegistration('u-1', 'reg-sect-3')).rejects.toThrow(ForbiddenException);
  });

  it('rejects sect-motion detail read for non-sect-motion registrar entry type', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-project-9',
      type: 'project_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { projectName: 'All-Ages Venue Buildout' },
      scene: null,
    });

    await expect(service.getSectMotionRegistration('u-1', 'reg-project-9')).rejects.toThrow(ForbiddenException);
  });

  it('throws when sect-motion detail entry does not exist', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(service.getSectMotionRegistration('u-1', 'missing-sect-entry')).rejects.toThrow(NotFoundException);
  });

  it('issues registrar code for approved promoter registration with system issuer', async () => {
    const expiresAt = new Date('2026-03-10T00:00:00.000Z');
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-approved-1',
      type: 'promoter_registration',
      status: 'approved',
      createdById: 'u-1',
    });
    mockPrisma.registrarCode.create.mockImplementation(async ({ data }: any) => ({
      id: 'rcode-1',
      registrarEntryId: data.registrarEntryId,
      capability: data.capability,
      issuerType: data.issuerType,
      status: data.status,
      expiresAt: data.expiresAt,
      createdAt: new Date('2026-02-24T10:20:00.000Z'),
    }));

    const result = await service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-approved-1', {
      issuer: 'system',
      expiresAt,
    });

    expect(mockPrisma.registrarCode.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          registrarEntryId: 'reg-promoter-approved-1',
          capability: 'promoter_capability',
          issuerType: 'system',
          status: 'issued',
          expiresAt,
          codeHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        }),
      }),
    );
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          capability: 'promoter_capability',
          action: 'code_issued',
          actorType: 'system',
          actorUserId: null,
          registrarEntryId: 'reg-promoter-approved-1',
          metadata: expect.objectContaining({
            transitionFromStatus: null,
            transitionToStatus: null,
            issuerType: 'system',
            sourceRegistrarEntryId: 'reg-promoter-approved-1',
            sourceRegistrarCodeId: 'rcode-1',
          }),
        }),
      }),
    );
    expect(result.registrarEntryId).toBe('reg-promoter-approved-1');
    expect(result.capability).toBe('promoter_capability');
    expect(result.issuerType).toBe('system');
    expect(result.status).toBe('issued');
    expect(result.code).toMatch(/^PRC-[A-F0-9]{32}$/);
  });

  it('issues promoter capability code through system-only seam for approved promoter entry', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-approved-system-seam',
      type: 'promoter_registration',
      status: 'approved',
      createdById: 'u-seam',
    });
    mockPrisma.registrarCode.create.mockImplementation(async ({ data }: any) => ({
      id: 'rcode-system-seam-1',
      registrarEntryId: data.registrarEntryId,
      capability: data.capability,
      issuerType: data.issuerType,
      status: data.status,
      expiresAt: data.expiresAt,
      createdAt: new Date('2026-02-27T21:50:00.000Z'),
    }));

    const result = await service.issueSystemPromoterCapabilityCodeForApprovedEntry(
      'reg-promoter-approved-system-seam',
      {
        expiresAt: null,
      },
    );

    expect(mockPrisma.registrarCode.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          registrarEntryId: 'reg-promoter-approved-system-seam',
          issuerType: 'system',
          capability: 'promoter_capability',
          status: 'issued',
        }),
      }),
    );
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'code_issued',
          actorType: 'system',
          actorUserId: null,
          metadata: expect.objectContaining({
            transitionFromStatus: null,
            transitionToStatus: null,
            issuerType: 'system',
            sourceRegistrarEntryId: 'reg-promoter-approved-system-seam',
            sourceRegistrarCodeId: 'rcode-system-seam-1',
          }),
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        registrarEntryId: 'reg-promoter-approved-system-seam',
        issuerType: 'system',
        capability: 'promoter_capability',
        status: 'issued',
        code: expect.stringMatching(/^PRC-[A-F0-9]{32}$/),
      }),
    );
  });

  it('rejects system-only issuance seam when registrar entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(
      service.issueSystemPromoterCapabilityCodeForApprovedEntry('missing-system-seam-entry'),
    ).rejects.toThrow(NotFoundException);

    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects system-only issuance seam for non-promoter registrar entry types', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-system-seam-project-1',
      type: 'project_registration',
      status: 'approved',
      createdById: 'u-1',
    });

    await expect(
      service.issueSystemPromoterCapabilityCodeForApprovedEntry('reg-system-seam-project-1'),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects system-only issuance seam when promoter entry is not approved', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-system-seam-promoter-submitted-1',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-1',
    });

    await expect(
      service.issueSystemPromoterCapabilityCodeForApprovedEntry('reg-system-seam-promoter-submitted-1'),
    ).rejects.toThrow(ForbiddenException);
    await expect(
      service.issueSystemPromoterCapabilityCodeForApprovedEntry('reg-system-seam-promoter-submitted-1'),
    ).rejects.toThrow('Registrar code issuance requires registrar entry status approved');

    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('emits deterministic audit ordering for approve-then-issue lifecycle helper', async () => {
    mockPrisma.registrarEntry.findUnique
      .mockResolvedValueOnce({
        id: 'reg-promoter-lifecycle-order-1',
        type: 'promoter_registration',
        status: 'submitted',
      })
      .mockResolvedValueOnce({
        id: 'reg-promoter-lifecycle-order-1',
        type: 'promoter_registration',
        status: 'approved',
        createdById: 'u-1',
      });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-lifecycle-order-1',
      type: 'promoter_registration',
      status: 'approved',
      updatedAt: new Date('2026-02-27T23:40:00.000Z'),
    });
    mockPrisma.registrarCode.create.mockImplementation(async ({ data }: any) => ({
      id: 'rcode-lifecycle-order-1',
      registrarEntryId: data.registrarEntryId,
      capability: data.capability,
      issuerType: data.issuerType,
      status: data.status,
      expiresAt: data.expiresAt,
      createdAt: new Date('2026-02-27T23:40:02.000Z'),
    }));

    const result = await service.approvePromoterEntryAndIssueCapabilityCode('reg-promoter-lifecycle-order-1', {
      reason: 'Verified promoter identity',
      expiresAt: null,
      actorType: 'system',
    });

    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'registration_approved',
          registrarEntryId: 'reg-promoter-lifecycle-order-1',
        }),
      }),
    );
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'code_issued',
          actorType: 'system',
          actorUserId: null,
          targetUserId: 'u-1',
          registrarEntryId: 'reg-promoter-lifecycle-order-1',
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        registrarEntryId: 'reg-promoter-lifecycle-order-1',
        status: 'issued',
        capability: 'promoter_capability',
      }),
    );
  });

  it('emits consistent system actor metadata on both approve and reject audit events', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-audit-consistency',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-audit-consistency',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-submitted-audit-consistency',
      type: 'promoter_registration',
      status: 'approved',
      updatedAt: new Date('2026-02-28T02:50:00.000Z'),
    });

    await service.applyPromoterApprovalTransition('reg-promoter-submitted-audit-consistency', 'approved');
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'registration_approved',
          actorType: 'system',
          actorUserId: null,
          targetUserId: 'u-audit-consistency',
        }),
      }),
    );

    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-audit-consistency-2',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-audit-consistency-2',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-submitted-audit-consistency-2',
      type: 'promoter_registration',
      status: 'rejected',
      updatedAt: new Date('2026-02-28T02:50:30.000Z'),
    });

    await service.applyPromoterApprovalTransition('reg-promoter-submitted-audit-consistency-2', 'rejected');
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'registration_rejected',
          actorType: 'system',
          actorUserId: null,
          targetUserId: 'u-audit-consistency-2',
        }),
      }),
    );
  });

  it('emits lifecycle decision audit metadata with null issuance-linkage fields for approve and reject actions', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-audit-metadata-parity-a',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-audit-parity-a',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-submitted-audit-metadata-parity-a',
      type: 'promoter_registration',
      status: 'approved',
      updatedAt: new Date('2026-02-28T05:38:00.000Z'),
    });

    await service.applyPromoterApprovalTransition('reg-promoter-submitted-audit-metadata-parity-a', 'approved');
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'registration_approved',
          metadata: expect.objectContaining({
            transitionFromStatus: 'submitted',
            transitionToStatus: 'approved',
            decisionReason: null,
            issuerType: null,
            sourceRegistrarEntryId: null,
            sourceRegistrarCodeId: null,
          }),
        }),
      }),
    );

    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-audit-metadata-parity-b',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-audit-parity-b',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-submitted-audit-metadata-parity-b',
      type: 'promoter_registration',
      status: 'rejected',
      updatedAt: new Date('2026-02-28T05:38:10.000Z'),
    });

    await service.applyPromoterApprovalTransition('reg-promoter-submitted-audit-metadata-parity-b', 'rejected');
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'registration_rejected',
          metadata: expect.objectContaining({
            transitionFromStatus: 'submitted',
            transitionToStatus: 'rejected',
            decisionReason: null,
            issuerType: null,
            sourceRegistrarEntryId: null,
            sourceRegistrarCodeId: null,
          }),
        }),
      }),
    );
  });

  it('rejects approve-then-issue lifecycle helper when actor context is not system', async () => {
    await expect(
      service.approvePromoterEntryAndIssueCapabilityCode('reg-promoter-lifecycle-actor-guard', {
        actorType: 'manual' as any,
      }),
    ).rejects.toThrow(ForbiddenException);
    await expect(
      service.approvePromoterEntryAndIssueCapabilityCode('reg-promoter-lifecycle-actor-guard', {
        actorType: 'manual' as any,
      }),
    ).rejects.toThrow('Registrar admin transitions are restricted to trusted system paths');

    expect(mockPrisma.registrarEntry.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects approve-then-issue lifecycle helper when decision entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValueOnce(null);

    const pending = service.approvePromoterEntryAndIssueCapabilityCode('missing-lifecycle-entry', {
      actorType: 'system',
    });
    await expect(pending).rejects.toThrow(NotFoundException);
    await expect(pending).rejects.toThrow('Registrar entry not found');

    expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects approve-then-issue lifecycle helper when decision entry type is non-promoter', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValueOnce({
      id: 'reg-project-lifecycle-non-promoter',
      type: 'project_registration',
      status: 'submitted',
      createdById: 'u-1',
    });

    const pending = service.approvePromoterEntryAndIssueCapabilityCode('reg-project-lifecycle-non-promoter', {
      actorType: 'system',
    });
    await expect(pending).rejects.toThrow(ForbiddenException);
    await expect(pending).rejects.toThrow('Promoter approval transitions currently support promoter registrations only');

    expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects approve-then-issue lifecycle helper when issuance-phase entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique
      .mockResolvedValueOnce({
        id: 'reg-promoter-lifecycle-issuance-missing',
        type: 'promoter_registration',
        status: 'submitted',
        createdById: 'u-1',
      })
      .mockResolvedValueOnce(null);
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-lifecycle-issuance-missing',
      type: 'promoter_registration',
      status: 'approved',
      updatedAt: new Date('2026-02-28T02:35:00.000Z'),
    });

    await expect(
      service.approvePromoterEntryAndIssueCapabilityCode('reg-promoter-lifecycle-issuance-missing', {
        actorType: 'system',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects approve-then-issue lifecycle helper when issuance phase sees invalid approved-state precondition', async () => {
    mockPrisma.registrarEntry.findUnique
      .mockResolvedValueOnce({
        id: 'reg-promoter-lifecycle-invalid-state',
        type: 'promoter_registration',
        status: 'submitted',
      })
      .mockResolvedValueOnce({
        id: 'reg-promoter-lifecycle-invalid-state',
        type: 'promoter_registration',
        status: 'rejected',
        createdById: 'u-1',
      });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-lifecycle-invalid-state',
      type: 'promoter_registration',
      status: 'approved',
      updatedAt: new Date('2026-02-27T23:44:00.000Z'),
    });

    await expect(
      service.approvePromoterEntryAndIssueCapabilityCode('reg-promoter-lifecycle-invalid-state', {
        actorType: 'system',
      }),
    ).rejects.toThrow(ForbiddenException);
    await expect(
      service.approvePromoterEntryAndIssueCapabilityCode('reg-promoter-lifecycle-invalid-state', {
        actorType: 'system',
      }),
    ).rejects.toThrow('Registrar code issuance requires registrar entry status approved');

    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('applies promoter approval transition from submitted to approved', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-1',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-1',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-submitted-1',
      type: 'promoter_registration',
      status: 'approved',
      updatedAt: new Date('2026-02-27T21:45:00.000Z'),
    });

    const result = await service.applyPromoterApprovalTransition('reg-promoter-submitted-1', 'approved');

    expect(mockPrisma.registrarEntry.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'reg-promoter-submitted-1' },
        data: { status: 'approved' },
      }),
    );
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          capability: 'promoter_capability',
          action: 'registration_approved',
          actorType: 'system',
          actorUserId: null,
          targetUserId: 'u-1',
          registrarEntryId: 'reg-promoter-submitted-1',
          metadata: {
            transitionFromStatus: 'submitted',
            transitionToStatus: 'approved',
            decisionReason: null,
            issuerType: null,
            sourceRegistrarEntryId: null,
            sourceRegistrarCodeId: null,
          },
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'reg-promoter-submitted-1',
        type: 'promoter_registration',
        status: 'approved',
      }),
    );
  });

  it('applies promoter approval transition from submitted to rejected', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-2',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-2',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-submitted-2',
      type: 'promoter_registration',
      status: 'rejected',
      updatedAt: new Date('2026-02-27T21:46:00.000Z'),
    });

    const result = await service.applyPromoterApprovalTransition('reg-promoter-submitted-2', 'rejected', {
      reason: '  Incomplete promoter verification evidence  ',
    });

    expect(mockPrisma.registrarEntry.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'reg-promoter-submitted-2' },
        data: { status: 'rejected' },
      }),
    );
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'registration_rejected',
          actorType: 'system',
          actorUserId: null,
          targetUserId: 'u-2',
          registrarEntryId: 'reg-promoter-submitted-2',
          metadata: {
            transitionFromStatus: 'submitted',
            transitionToStatus: 'rejected',
            decisionReason: 'Incomplete promoter verification evidence',
            issuerType: null,
            sourceRegistrarEntryId: null,
            sourceRegistrarCodeId: null,
          },
        }),
      }),
    );
    expect(result.status).toBe('rejected');
  });

  it('rejects promoter approval transition when registrar entry is not submitted', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-approved-guard',
      type: 'promoter_registration',
      status: 'approved',
    });

    await expect(
      service.applyPromoterApprovalTransition('reg-promoter-approved-guard', 'rejected'),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
    expect(mockPrisma.capabilityGrantAuditLog.create).not.toHaveBeenCalled();
  });

  it('rejects promoter approval transition when actor context is not system', async () => {
    await expect(
      service.applyPromoterApprovalTransition('reg-promoter-submitted-actor-guard', 'approved', {
        actorType: 'manual' as any,
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrisma.registrarEntry.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
  });

  it.each(['approved', 'rejected', 'materialized'] as const)(
    'rejects promoter approval transition matrix from %s to approved',
    async (fromStatus) => {
      mockPrisma.registrarEntry.findUnique.mockResolvedValue({
        id: `reg-promoter-${fromStatus}-guard`,
        type: 'promoter_registration',
        status: fromStatus,
      });

      if (fromStatus === 'approved') {
        await expect(
          service.applyPromoterApprovalTransition(`reg-promoter-${fromStatus}-guard`, 'approved'),
        ).rejects.toThrow(ConflictException);
      } else {
        await expect(
          service.applyPromoterApprovalTransition(`reg-promoter-${fromStatus}-guard`, 'approved'),
        ).rejects.toThrow(ForbiddenException);
      }

      expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
      expect(mockPrisma.capabilityGrantAuditLog.create).not.toHaveBeenCalled();
    },
  );

  it('rejects promoter approval transition when registrar entry has unknown lifecycle status', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-unknown-status',
      type: 'promoter_registration',
      status: 'queued_review',
      createdById: 'u-unknown',
    });

    await expect(
      service.applyPromoterApprovalTransition('reg-promoter-unknown-status', 'approved'),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
    expect(mockPrisma.capabilityGrantAuditLog.create).not.toHaveBeenCalled();
  });

  it('returns deterministic invalid-transition message for unknown lifecycle status edge', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-unknown-status-deterministic',
      type: 'promoter_registration',
      status: 'queued_review',
      createdById: 'u-unknown',
    });

    await expect(
      service.applyPromoterApprovalTransition('reg-promoter-unknown-status-deterministic', 'approved'),
    ).rejects.toThrow('Registrar admin decision transition is not allowed for current status');
  });

  it('rejects promoter approval transition from submitted to unsupported target status literal', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-invalid-target',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-invalid-target',
    });

    await expect(
      service.applyPromoterApprovalTransition(
        'reg-promoter-submitted-invalid-target',
        'materialized' as unknown as 'approved',
      ),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
  });

  it('returns deterministic submitted-only guard message for unsupported submitted target edge', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-invalid-target-message',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-invalid-target-message',
    });

    await expect(
      service.applyPromoterApprovalTransition(
        'reg-promoter-submitted-invalid-target-message',
        'materialized' as unknown as 'approved',
      ),
    ).rejects.toThrow('Promoter approval transitions require registrar entry status submitted');
  });

  it.each(['approved', 'rejected', 'materialized'] as const)(
    'rejects promoter approval transition matrix from %s to rejected',
    async (fromStatus) => {
      mockPrisma.registrarEntry.findUnique.mockResolvedValue({
        id: `reg-promoter-${fromStatus}-to-rejected-guard`,
        type: 'promoter_registration',
        status: fromStatus,
      });

      if (fromStatus === 'rejected') {
        await expect(
          service.applyPromoterApprovalTransition(`reg-promoter-${fromStatus}-to-rejected-guard`, 'rejected'),
        ).rejects.toThrow(ConflictException);
      } else {
        await expect(
          service.applyPromoterApprovalTransition(`reg-promoter-${fromStatus}-to-rejected-guard`, 'rejected'),
        ).rejects.toThrow(ForbiddenException);
      }

      expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
      expect(mockPrisma.capabilityGrantAuditLog.create).not.toHaveBeenCalled();
    },
  );

  it('normalizes approval/rejection reason payload to bounded stable metadata shape', async () => {
    const longReason = ` ${'x'.repeat(320)} `;
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-reason-bound',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-reason',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-submitted-reason-bound',
      type: 'promoter_registration',
      status: 'rejected',
      updatedAt: new Date('2026-02-27T23:39:00.000Z'),
    });

    await service.applyPromoterApprovalTransition('reg-promoter-submitted-reason-bound', 'rejected', {
      reason: longReason,
    });

    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadata: expect.objectContaining({
            decisionReason: 'x'.repeat(280),
          }),
        }),
      }),
    );
  });

  it.each([
    { label: 'empty string', reason: '', expected: null },
    { label: 'whitespace-only string', reason: '   ', expected: null },
    { label: 'tab/newline-only string', reason: '\n\t  \n', expected: null },
    { label: 'undefined reason', reason: undefined, expected: null },
    { label: 'null reason', reason: null, expected: null },
    { label: 'non-string reason', reason: 123 as any, expected: null },
    { label: 'trimmed reason', reason: '  docs complete  ', expected: 'docs complete' },
    { label: 'trimmed multiline reason', reason: ' \n  queued evidence complete \t ', expected: 'queued evidence complete' },
    { label: 'trimmed numeric-string reason', reason: '  0  ', expected: '0' },
    { label: 'internal whitespace preserved', reason: '  docs   complete  ', expected: 'docs   complete' },
  ])('normalizes decision reason edge case: $label', async ({ reason, expected }) => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-edge-reason',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-edge',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-submitted-edge-reason',
      type: 'promoter_registration',
      status: 'approved',
      updatedAt: new Date('2026-02-28T02:31:00.000Z'),
    });

    await service.applyPromoterApprovalTransition('reg-promoter-submitted-edge-reason', 'approved', {
      reason: reason as any,
    });

    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadata: expect.objectContaining({
            decisionReason: expected,
          }),
        }),
      }),
    );
  });

  it('preserves decision reason at exact max length without truncation', async () => {
    const exactReason = 'a'.repeat(280);
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-exact-max-reason',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-exact-max',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-exact-max-reason',
      type: 'promoter_registration',
      status: 'approved',
      updatedAt: new Date('2026-02-28T02:48:00.000Z'),
    });

    await service.applyPromoterApprovalTransition('reg-promoter-exact-max-reason', 'approved', {
      reason: exactReason,
    });

    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadata: expect.objectContaining({
            decisionReason: exactReason,
          }),
        }),
      }),
    );
  });

  it('truncates decision reason at max length plus one boundary', async () => {
    const overBoundaryReason = 'b'.repeat(281);
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-over-max-reason',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-over-max',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-over-max-reason',
      type: 'promoter_registration',
      status: 'rejected',
      updatedAt: new Date('2026-02-28T02:49:00.000Z'),
    });

    await service.applyPromoterApprovalTransition('reg-promoter-over-max-reason', 'rejected', {
      reason: overBoundaryReason,
    });

    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadata: expect.objectContaining({
            decisionReason: 'b'.repeat(280),
          }),
        }),
      }),
    );
  });

  it('trims before truncating when decision reason exceeds max length with outer whitespace', async () => {
    const trimmedCore = 'c'.repeat(281);
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-over-max-trimmed-boundary',
      type: 'promoter_registration',
      status: 'submitted',
      createdById: 'u-over-max-trimmed',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-promoter-over-max-trimmed-boundary',
      type: 'promoter_registration',
      status: 'approved',
      updatedAt: new Date('2026-02-28T05:14:00.000Z'),
    });

    await service.applyPromoterApprovalTransition('reg-promoter-over-max-trimmed-boundary', 'approved', {
      reason: `   ${trimmedCore}   `,
    });

    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadata: expect.objectContaining({
            decisionReason: 'c'.repeat(280),
          }),
        }),
      }),
    );
  });

  it('rejects promoter approval transition for non-promoter registrar entry types', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-project-transition-1',
      type: 'project_registration',
      status: 'submitted',
    });

    await expect(service.applyPromoterApprovalTransition('reg-project-transition-1', 'approved')).rejects.toThrow(
      ForbiddenException,
    );
    await expect(service.applyPromoterApprovalTransition('reg-project-transition-1', 'approved')).rejects.toThrow(
      'Promoter approval transitions currently support promoter registrations only',
    );

    expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
  });

  it('rejects promoter approval transition when registrar entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(service.applyPromoterApprovalTransition('missing-promoter-entry', 'approved')).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.applyPromoterApprovalTransition('missing-promoter-entry', 'approved')).rejects.toThrow(
      'Registrar entry not found',
    );

    expect(mockPrisma.registrarEntry.update).not.toHaveBeenCalled();
  });

  it('revokes active promoter capability grant with append-only audit log emission', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-approved-revoke-1',
      type: 'promoter_registration',
      status: 'approved',
    });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({
      id: 'grant-promoter-active-1',
      userId: 'u-1',
      capability: 'promoter_capability',
      status: 'active',
      sourceRegistrarEntryId: 'reg-promoter-approved-revoke-1',
      sourceRegistrarCodeId: 'rcode-redeem-1',
    });
    mockPrisma.userCapabilityGrant.update.mockResolvedValue({
      id: 'grant-promoter-active-1',
      userId: 'u-1',
      capability: 'promoter_capability',
      status: 'revoked',
      revokedAt: new Date('2026-02-27T21:55:00.000Z'),
      sourceRegistrarEntryId: 'reg-promoter-approved-revoke-1',
      sourceRegistrarCodeId: 'rcode-redeem-1',
    });

    const result = await service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-1');

    expect(mockPrisma.userCapabilityGrant.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'u-1',
          capability: 'promoter_capability',
        }),
      }),
    );
    expect(mockPrisma.userCapabilityGrant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'grant-promoter-active-1' },
        data: expect.objectContaining({
          status: 'revoked',
          revokedAt: expect.any(Date),
        }),
      }),
    );
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          capability: 'promoter_capability',
          action: 'capability_revoked',
          actorType: 'system',
          actorUserId: null,
          targetUserId: 'u-1',
          registrarEntryId: 'reg-promoter-approved-revoke-1',
          metadata: {
            transitionFromStatus: 'active',
            transitionToStatus: 'revoked',
            decisionReason: null,
            issuerType: null,
            sourceRegistrarEntryId: 'reg-promoter-approved-revoke-1',
            sourceRegistrarCodeId: 'rcode-redeem-1',
          },
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'grant-promoter-active-1',
        status: 'revoked',
      }),
    );
  });

  it('revokes active promoter capability grant when registrar entry status is rejected', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-rejected-revoke-1',
      type: 'promoter_registration',
      status: 'rejected',
    });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({
      id: 'grant-promoter-active-rejected-1',
      userId: 'u-1',
      capability: 'promoter_capability',
      status: 'active',
      sourceRegistrarEntryId: 'reg-promoter-rejected-revoke-1',
      sourceRegistrarCodeId: 'rcode-redeem-2',
    });
    mockPrisma.userCapabilityGrant.update.mockResolvedValue({
      id: 'grant-promoter-active-rejected-1',
      userId: 'u-1',
      capability: 'promoter_capability',
      status: 'revoked',
      revokedAt: new Date('2026-02-27T22:00:00.000Z'),
      sourceRegistrarEntryId: 'reg-promoter-rejected-revoke-1',
      sourceRegistrarCodeId: 'rcode-redeem-2',
    });

    const result = await service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-rejected-revoke-1');

    expect(mockPrisma.userCapabilityGrant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'grant-promoter-active-rejected-1' },
      }),
    );
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          capability: 'promoter_capability',
          action: 'capability_revoked',
          actorType: 'system',
          actorUserId: null,
          targetUserId: 'u-1',
          registrarEntryId: 'reg-promoter-rejected-revoke-1',
          metadata: {
            transitionFromStatus: 'active',
            transitionToStatus: 'revoked',
            decisionReason: null,
            issuerType: null,
            sourceRegistrarEntryId: 'reg-promoter-rejected-revoke-1',
            sourceRegistrarCodeId: 'rcode-redeem-2',
          },
        }),
      }),
    );
    expect(result.status).toBe('revoked');
  });

  it('rejects promoter capability revocation for non-promoter registrar entry types', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-project-revoke-1',
      type: 'project_registration',
      status: 'approved',
    });

    await expect(service.revokePromoterCapabilityGrantForUser('u-1', 'reg-project-revoke-1')).rejects.toThrow(
      ForbiddenException,
    );

    expect(mockPrisma.userCapabilityGrant.findFirst).not.toHaveBeenCalled();
    expect(mockPrisma.userCapabilityGrant.update).not.toHaveBeenCalled();
  });

  it('rejects promoter capability revocation when no active grant exists', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-approved-revoke-missing',
      type: 'promoter_registration',
      status: 'approved',
    });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue(null);

    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-missing'),
    ).rejects.toThrow(NotFoundException);
    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-missing'),
    ).rejects.toThrow('Active promoter capability grant not found');

    expect(mockPrisma.userCapabilityGrant.update).not.toHaveBeenCalled();
  });

  it('rejects promoter capability revocation when grant state is non-active', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-approved-revoke-inactive',
      type: 'promoter_registration',
      status: 'approved',
    });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({
      id: 'grant-promoter-inactive',
      userId: 'u-1',
      capability: 'promoter_capability',
      status: 'revoked',
      revokedAt: new Date('2026-02-28T02:33:00.000Z'),
      sourceRegistrarEntryId: 'reg-promoter-approved-revoke-inactive',
      sourceRegistrarCodeId: 'rcode-redeem-inactive',
    });

    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-inactive'),
    ).rejects.toThrow(ConflictException);
    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-inactive'),
    ).rejects.toThrow('Promoter capability grant is not in an active revocable state');

    expect(mockPrisma.userCapabilityGrant.update).not.toHaveBeenCalled();
    expect(mockPrisma.capabilityGrantAuditLog.create).not.toHaveBeenCalled();
  });

  it('rejects promoter capability revocation when grant has revokedAt timestamp', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-approved-revoke-stale',
      type: 'promoter_registration',
      status: 'approved',
    });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({
      id: 'grant-promoter-stale',
      userId: 'u-1',
      capability: 'promoter_capability',
      status: 'active',
      revokedAt: new Date('2026-02-28T02:34:00.000Z'),
      sourceRegistrarEntryId: 'reg-promoter-approved-revoke-stale',
      sourceRegistrarCodeId: 'rcode-redeem-stale',
    });

    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-stale'),
    ).rejects.toThrow(ConflictException);
    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-stale'),
    ).rejects.toThrow('Promoter capability grant is not in an active revocable state');

    expect(mockPrisma.userCapabilityGrant.update).not.toHaveBeenCalled();
  });

  it('rejects promoter capability revocation when active grant-link entry differs from target entry', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-approved-revoke-target',
      type: 'promoter_registration',
      status: 'approved',
    });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({
      id: 'grant-promoter-active-mismatch',
      userId: 'u-1',
      capability: 'promoter_capability',
      status: 'active',
      sourceRegistrarEntryId: 'reg-promoter-approved-revoke-other',
      sourceRegistrarCodeId: 'rcode-redeem-other',
    });

    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-target'),
    ).rejects.toThrow(ConflictException);
    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-target'),
    ).rejects.toThrow('Active promoter capability grant linkage does not match target registrar entry');

    expect(mockPrisma.userCapabilityGrant.update).not.toHaveBeenCalled();
    expect(mockPrisma.capabilityGrantAuditLog.create).not.toHaveBeenCalled();
  });

  it('rejects promoter capability revocation when active grant has null source entry linkage', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-approved-revoke-null-link',
      type: 'promoter_registration',
      status: 'approved',
    });
    mockPrisma.userCapabilityGrant.findFirst.mockResolvedValue({
      id: 'grant-promoter-null-link',
      userId: 'u-1',
      capability: 'promoter_capability',
      status: 'active',
      revokedAt: null,
      sourceRegistrarEntryId: null,
      sourceRegistrarCodeId: null,
    });

    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-null-link'),
    ).rejects.toThrow(ConflictException);
    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-null-link'),
    ).rejects.toThrow('Active promoter capability grant linkage does not match target registrar entry');

    expect(mockPrisma.userCapabilityGrant.update).not.toHaveBeenCalled();
    expect(mockPrisma.capabilityGrantAuditLog.create).not.toHaveBeenCalled();
  });

  it('rejects promoter capability revocation when actor context is not system', async () => {
    await expect(
      service.revokePromoterCapabilityGrantForUser('u-1', 'reg-promoter-approved-revoke-actor-guard', {
        actorType: 'manual' as any,
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrisma.registrarEntry.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.userCapabilityGrant.findFirst).not.toHaveBeenCalled();
    expect(mockPrisma.userCapabilityGrant.update).not.toHaveBeenCalled();
  });

  it('rejects promoter capability revocation when registrar entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(service.revokePromoterCapabilityGrantForUser('u-1', 'missing-revoke-entry')).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.revokePromoterCapabilityGrantForUser('u-1', 'missing-revoke-entry')).rejects.toThrow(
      'Registrar entry not found',
    );

    expect(mockPrisma.userCapabilityGrant.findFirst).not.toHaveBeenCalled();
    expect(mockPrisma.userCapabilityGrant.update).not.toHaveBeenCalled();
  });

  it('rejects registrar code issuance when issuer is not system', async () => {
    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-approved-1', {
        issuer: 'manual' as any,
      }),
    ).rejects.toThrow(ForbiddenException);
    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-approved-1', {
        issuer: 'manual' as any,
      }),
    ).rejects.toThrow('Registrar code issuance is restricted to trusted system registrar paths');

    expect(mockPrisma.registrarEntry.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects registrar code issuance when registrar entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(service.issueRegistrarCodeForApprovedPromoterEntry('missing-entry')).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.issueRegistrarCodeForApprovedPromoterEntry('missing-entry')).rejects.toThrow(
      'Registrar entry not found',
    );

    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects registrar code issuance for non-promoter registrar entry types', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-artist-issuer-1',
      type: 'artist_band_registration',
      status: 'approved',
    });

    await expect(service.issueRegistrarCodeForApprovedPromoterEntry('reg-artist-issuer-1')).rejects.toThrow(
      ForbiddenException,
    );
    await expect(service.issueRegistrarCodeForApprovedPromoterEntry('reg-artist-issuer-1')).rejects.toThrow(
      'Registrar code issuance currently supports promoter registrations only',
    );

    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects registrar code issuance when promoter registrar entry is not approved', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-submitted-1',
      type: 'promoter_registration',
      status: 'submitted',
    });

    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-submitted-1'),
    ).rejects.toThrow(ForbiddenException);
    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-submitted-1'),
    ).rejects.toThrow('Registrar code issuance requires registrar entry status approved');

    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects registrar code issuance replay when an active issued code already exists', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-active-code-1',
      type: 'promoter_registration',
      status: 'approved',
      createdById: 'u-1',
    });
    mockPrisma.registrarCode.findFirst.mockResolvedValue({
      id: 'rcode-active-existing-1',
    });

    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-active-code-1', {
        issuer: 'system',
      }),
    ).rejects.toThrow(ConflictException);

    expect(mockPrisma.registrarCode.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          registrarEntryId: 'reg-promoter-active-code-1',
          capability: 'promoter_capability',
          status: 'issued',
          redeemedAt: null,
        }),
      }),
    );
    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('returns deterministic replay-block message when an active issued code already exists', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-active-code-message-1',
      type: 'promoter_registration',
      status: 'approved',
      createdById: 'u-1',
    });
    mockPrisma.registrarCode.findFirst.mockResolvedValue({
      id: 'rcode-active-existing-message-1',
    });

    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-active-code-message-1', {
        issuer: 'system',
      }),
    ).rejects.toThrow('Registrar entry already has an active capability code; replay issuance is blocked');
  });

  it('rejects registrar code issuance when duplicate active code appears during transactional race window', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-race-window-1',
      type: 'promoter_registration',
      status: 'approved',
      createdById: 'u-1',
    });
    mockPrisma.registrarCode.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'rcode-race-window-existing-1' });

    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-race-window-1', {
        issuer: 'system',
      }),
    ).rejects.toThrow(ConflictException);

    expect(mockPrisma.registrarCode.findFirst).toHaveBeenCalledTimes(2);
    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('returns deterministic replay-block message for transactional race-window duplicate detection', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-race-window-message-1',
      type: 'promoter_registration',
      status: 'approved',
      createdById: 'u-1',
    });
    mockPrisma.registrarCode.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'rcode-race-window-existing-message-1' });

    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-race-window-message-1', {
        issuer: 'system',
      }),
    ).rejects.toThrow('Registrar entry already has an active capability code; replay issuance is blocked');
  });

  it('retries registrar code issuance on transient codeHash uniqueness conflict and succeeds', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-retry-unique-1',
      type: 'promoter_registration',
      status: 'approved',
      createdById: 'u-1',
    });
    const uniqueErr: any = new Error('unique conflict');
    uniqueErr.code = 'P2002';
    uniqueErr.meta = { target: ['codeHash'] };

    mockPrisma.registrarCode.findFirst.mockResolvedValue(null);
    mockPrisma.registrarCode.create
      .mockRejectedValueOnce(uniqueErr)
      .mockResolvedValueOnce({
        id: 'rcode-retry-unique-1',
        registrarEntryId: 'reg-promoter-retry-unique-1',
        capability: 'promoter_capability',
        issuerType: 'system',
        status: 'issued',
        expiresAt: null,
        createdAt: new Date('2026-02-28T02:47:00.000Z'),
      });

    const result = await service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-retry-unique-1', {
      issuer: 'system',
    });

    expect(mockPrisma.registrarCode.create).toHaveBeenCalledTimes(2);
    expect(result).toEqual(
      expect.objectContaining({
        id: 'rcode-retry-unique-1',
        status: 'issued',
      }),
    );
  });

  it('fails registrar code issuance after exhausting uniqueness retry attempts', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-retry-unique-fail',
      type: 'promoter_registration',
      status: 'approved',
      createdById: 'u-1',
    });
    const uniqueErr: any = new Error('unique conflict');
    uniqueErr.code = 'P2002';
    uniqueErr.meta = { target: ['codeHash'] };

    mockPrisma.registrarCode.findFirst.mockResolvedValue(null);
    mockPrisma.registrarCode.create.mockRejectedValue(uniqueErr);

    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-retry-unique-fail', {
        issuer: 'system',
      }),
    ).rejects.toBe(uniqueErr);

    expect(mockPrisma.registrarCode.create).toHaveBeenCalledTimes(3);
  });

  it('verifies a redeemable registrar code for approved promoter entry', async () => {
    const futureExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    mockPrisma.registrarCode.findUnique.mockResolvedValue({
      id: 'rcode-verify-1',
      registrarEntryId: 'reg-promoter-approved-1',
      capability: 'promoter_capability',
      issuerType: 'system',
      status: 'issued',
      expiresAt: futureExpiresAt,
      redeemedAt: null,
      createdAt: new Date('2026-02-24T10:20:00.000Z'),
      registrarEntry: {
        id: 'reg-promoter-approved-1',
        type: 'promoter_registration',
        status: 'approved',
      },
    });

    const result = await service.verifyRegistrarCode('PRC-VALID-CODE');

    expect(mockPrisma.registrarCode.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          codeHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        },
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'rcode-verify-1',
        registrarEntryId: 'reg-promoter-approved-1',
        capability: 'promoter_capability',
        issuerType: 'system',
        status: 'issued',
        expiresAt: futureExpiresAt,
        createdAt: new Date('2026-02-24T10:20:00.000Z'),
        redeemable: true,
      }),
    );
    expect(result).not.toHaveProperty('redeemedAt');
  });

  it('rejects registrar code verification when code does not exist', async () => {
    mockPrisma.registrarCode.findUnique.mockResolvedValue(null);

    await expect(service.verifyRegistrarCode('PRC-NOT-FOUND')).rejects.toThrow(NotFoundException);
  });

  it('rejects registrar code verification when code is no longer redeemable', async () => {
    mockPrisma.registrarCode.findUnique.mockResolvedValue({
      id: 'rcode-verify-2',
      registrarEntryId: 'reg-promoter-approved-1',
      capability: 'promoter_capability',
      issuerType: 'system',
      status: 'redeemed',
      expiresAt: null,
      redeemedAt: new Date('2026-02-24T12:00:00.000Z'),
      createdAt: new Date('2026-02-24T10:20:00.000Z'),
      registrarEntry: {
        id: 'reg-promoter-approved-1',
        type: 'promoter_registration',
        status: 'approved',
      },
    });

    await expect(service.verifyRegistrarCode('PRC-REDEEMED')).rejects.toThrow(ForbiddenException);
  });

  it('redeems registrar code for authenticated user', async () => {
    mockPrisma.registrarCode.findUnique.mockResolvedValue({
      id: 'rcode-redeem-1',
      registrarEntryId: 'reg-promoter-approved-1',
      capability: 'promoter_capability',
      issuerType: 'system',
      status: 'issued',
      expiresAt: null,
      redeemedAt: null,
      createdAt: new Date('2026-02-24T10:20:00.000Z'),
      registrarEntry: {
        id: 'reg-promoter-approved-1',
        type: 'promoter_registration',
        status: 'approved',
      },
    });
    mockPrisma.registrarCode.update.mockImplementation(async ({ data }: any) => ({
      id: 'rcode-redeem-1',
      registrarEntryId: 'reg-promoter-approved-1',
      capability: 'promoter_capability',
      issuerType: 'system',
      status: data.status,
      expiresAt: null,
      redeemedAt: data.redeemedAt,
      createdAt: new Date('2026-02-24T10:20:00.000Z'),
    }));

    const result = await service.redeemRegistrarCodeForUser('u-1', 'PRC-VALID-CODE');

    expect(mockPrisma.registrarCode.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'rcode-redeem-1' },
        data: expect.objectContaining({
          status: 'redeemed',
          redeemedAt: expect.any(Date),
        }),
      }),
    );
    expect(mockPrisma.userCapabilityGrant.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_capability: {
            userId: 'u-1',
            capability: 'promoter_capability',
          },
        },
        create: expect.objectContaining({
          userId: 'u-1',
          capability: 'promoter_capability',
          sourceRegistrarEntryId: 'reg-promoter-approved-1',
          sourceRegistrarCodeId: 'rcode-redeem-1',
        }),
      }),
    );
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenCalledTimes(2);
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'code_redeemed',
          actorType: 'user',
          targetUserId: 'u-1',
          actorUserId: 'u-1',
        }),
      }),
    );
    expect(mockPrisma.capabilityGrantAuditLog.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'capability_granted',
          actorType: 'system',
          targetUserId: 'u-1',
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'rcode-redeem-1',
        registrarEntryId: 'reg-promoter-approved-1',
        capability: 'promoter_capability',
        issuerType: 'system',
        status: 'redeemed',
        redeemedAt: expect.any(Date),
        redeemedByUserId: 'u-1',
        capabilityGrant: expect.objectContaining({
          capability: 'promoter_capability',
          status: 'active',
        }),
      }),
    );
  });

  it('rejects registrar code redemption when code was already redeemed', async () => {
    mockPrisma.registrarCode.findUnique.mockResolvedValue({
      id: 'rcode-redeem-2',
      registrarEntryId: 'reg-promoter-approved-1',
      capability: 'promoter_capability',
      issuerType: 'system',
      status: 'redeemed',
      expiresAt: null,
      redeemedAt: new Date('2026-02-24T12:00:00.000Z'),
      createdAt: new Date('2026-02-24T10:20:00.000Z'),
      registrarEntry: {
        id: 'reg-promoter-approved-1',
        type: 'promoter_registration',
        status: 'approved',
      },
    });

    await expect(service.redeemRegistrarCodeForUser('u-1', 'PRC-REDEEMED')).rejects.toThrow(ConflictException);
    expect(mockPrisma.registrarCode.update).not.toHaveBeenCalled();
  });

  it('rejects registrar code redemption when code is expired', async () => {
    mockPrisma.registrarCode.findUnique.mockResolvedValue({
      id: 'rcode-redeem-3',
      registrarEntryId: 'reg-promoter-approved-1',
      capability: 'promoter_capability',
      issuerType: 'system',
      status: 'issued',
      expiresAt: new Date('2026-01-01T00:00:00.000Z'),
      redeemedAt: null,
      createdAt: new Date('2025-12-20T00:00:00.000Z'),
      registrarEntry: {
        id: 'reg-promoter-approved-1',
        type: 'promoter_registration',
        status: 'approved',
      },
    });

    await expect(service.redeemRegistrarCodeForUser('u-1', 'PRC-EXPIRED')).rejects.toThrow(ForbiddenException);
    expect(mockPrisma.registrarCode.update).not.toHaveBeenCalled();
  });

  it('throws when target scene does not exist', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      gpsVerified: true,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(service.submitArtistBandRegistration('u-1', validDto)).rejects.toThrow(NotFoundException);
  });

  it('requires gps-verified home-scene account', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      gpsVerified: false,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(service.submitArtistBandRegistration('u-1', validDto)).rejects.toThrow(ForbiddenException);
  });

  it('enforces city-tier Home Scene registrar boundary', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: null,
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'state',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      gpsVerified: true,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(service.submitArtistBandRegistration('u-1', validDto)).rejects.toThrow(ForbiddenException);
  });

  it('rejects submissions outside user Home Scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-2',
      city: 'Dallas',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      gpsVerified: true,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(service.submitArtistBandRegistration('u-1', validDto)).rejects.toThrow(ForbiddenException);
  });

  it('creates submitted registrar entry and member invite records', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'punk',
      tier: 'city',
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      gpsVerified: true,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });
    mockPrisma.registrarEntry.create.mockResolvedValue({
      id: 'reg-1',
      type: 'artist_band_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
      createdAt: new Date('2026-02-20T14:10:00.000Z'),
    });
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'u-2', email: 'alex@example.com' }]);
    mockPrisma.registrarArtistMember.createMany.mockResolvedValue({ count: 2 });

    const result = await service.submitArtistBandRegistration('u-1', validDto);

    expect(mockPrisma.registrarEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'artist_band_registration',
          status: 'submitted',
          sceneId: 'scene-1',
          createdById: 'u-1',
        }),
      }),
    );
    expect(mockPrisma.registrarArtistMember.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ email: 'alex@example.com', inviteStatus: 'existing_user' }),
          expect.objectContaining({ email: 'sam@example.com', inviteStatus: 'pending_email' }),
        ]),
      }),
    );
    expect(result.id).toBe('reg-1');
    expect(result.memberCount).toBe(2);
    expect(result.existingMemberCount).toBe(1);
    expect(result.pendingInviteCount).toBe(1);
  });

  it('materializes submitted entry into ArtistBand + owner membership', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-2',
      type: 'artist_band_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      artistBandId: null,
      payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
    });
    mockPrisma.artistBand.create.mockResolvedValue({
      id: 'ab-1',
      name: 'Static Signal',
      slug: 'static-signal',
      entityType: 'band',
      homeSceneId: 'scene-1',
      createdById: 'u-1',
      registrarEntryRef: 'reg-2',
      createdAt: new Date('2026-02-20T17:10:00.000Z'),
    });
    mockPrisma.artistBandMember.create.mockResolvedValue({
      id: 'abm-1',
      artistBandId: 'ab-1',
      userId: 'u-1',
      role: 'owner',
    });
    mockPrisma.registrarEntry.update.mockResolvedValue({
      id: 'reg-2',
      status: 'materialized',
      artistBandId: 'ab-1',
    });

    const result = await service.materializeArtistBandRegistration('u-1', 'reg-2');

    expect(result.materialized).toBe(true);
    expect(result.artistBand.id).toBe('ab-1');
    expect(mockPrisma.artistBandMember.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          artistBandId: 'ab-1',
          userId: 'u-1',
          role: 'owner',
        }),
      }),
    );
    expect(mockPrisma.registrarEntry.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'reg-2' },
        data: expect.objectContaining({
          status: 'materialized',
          artistBandId: 'ab-1',
        }),
      }),
    );
  });

  it('materialize is idempotent when artistBand already linked', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-3',
      type: 'artist_band_registration',
      status: 'materialized',
      sceneId: 'scene-1',
      createdById: 'u-1',
      artistBandId: 'ab-1',
      payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
    });
    mockPrisma.artistBand.findUnique.mockResolvedValue({
      id: 'ab-1',
      name: 'Static Signal',
      slug: 'static-signal',
      entityType: 'band',
      homeSceneId: 'scene-1',
      createdById: 'u-1',
      registrarEntryRef: 'reg-3',
      createdAt: new Date('2026-02-20T17:10:00.000Z'),
    });

    const result = await service.materializeArtistBandRegistration('u-1', 'reg-3');

    expect(result.materialized).toBe(false);
    expect(result.artistBand.id).toBe('ab-1');
    expect(mockPrisma.artistBand.create).not.toHaveBeenCalled();
  });

  it('rejects materialize from non-submitting user', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-4',
      type: 'artist_band_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-2',
      artistBandId: null,
      payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
    });

    await expect(service.materializeArtistBandRegistration('u-1', 'reg-4')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('queues invite deliveries for pending members', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-5',
      type: 'artist_band_registration',
      createdById: 'u-1',
      scene: {
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'punk',
      },
    });
    mockPrisma.registrarArtistMember.findMany.mockResolvedValue([
      { id: 'ram-1', email: 'sam@example.com', name: 'Sam Pulse', city: 'Austin' },
    ]);
    mockPrisma.registrarArtistMember.update.mockResolvedValue({
      id: 'ram-1',
      inviteStatus: 'queued',
    });
    mockPrisma.registrarInviteDelivery.upsert.mockResolvedValue({
      id: 'rid-1',
      status: 'queued',
    });

    const result = await service.dispatchArtistBandInvites('u-1', 'reg-5', {
      mobileAppUrl: 'https://m.uprise.example/download',
      webAppUrl: 'https://uprise.example/band',
    });

    expect(result.queuedCount).toBe(1);
    expect(mockPrisma.registrarArtistMember.update).toHaveBeenCalled();
    expect(mockPrisma.registrarInviteDelivery.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          registrarArtistMemberId: 'ram-1',
          email: 'sam@example.com',
          status: 'queued',
        }),
      }),
    );
  });

  it('returns zero when no pending members exist', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-6',
      type: 'artist_band_registration',
      createdById: 'u-1',
      scene: {
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'punk',
      },
    });
    mockPrisma.registrarArtistMember.findMany.mockResolvedValue([]);

    const result = await service.dispatchArtistBandInvites('u-1', 'reg-6', {
      mobileAppUrl: 'https://m.uprise.example/download',
      webAppUrl: 'https://uprise.example/band',
    });

    expect(result.queuedCount).toBe(0);
    expect(mockPrisma.registrarArtistMember.update).not.toHaveBeenCalled();
    expect(mockPrisma.registrarInviteDelivery.upsert).not.toHaveBeenCalled();
  });

  it('rejects invite dispatch when registrar entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(
      service.dispatchArtistBandInvites('u-1', 'missing-entry', {
        mobileAppUrl: 'https://m.uprise.example/download',
        webAppUrl: 'https://uprise.example/band',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects invite dispatch for non artist/band registrar entry types', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-1',
      type: 'promoter_registration',
      createdById: 'u-1',
      scene: {
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'punk',
      },
    });

    await expect(
      service.dispatchArtistBandInvites('u-1', 'reg-promoter-1', {
        mobileAppUrl: 'https://m.uprise.example/download',
        webAppUrl: 'https://uprise.example/band',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects invite dispatch from non-submitting user', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-6b',
      type: 'artist_band_registration',
      createdById: 'u-9',
      scene: {
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'punk',
      },
    });

    await expect(
      service.dispatchArtistBandInvites('u-1', 'reg-6b', {
        mobileAppUrl: 'https://m.uprise.example/download',
        webAppUrl: 'https://uprise.example/band',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('finalizes queued invite delivery as sent', async () => {
    mockPrisma.registrarInviteDelivery.findUnique.mockResolvedValue({
      id: 'rid-2',
      registrarArtistMemberId: 'ram-2',
      status: 'queued',
      dispatchedAt: null,
    });
    mockPrisma.registrarInviteDelivery.updateMany.mockResolvedValue({
      count: 1,
    });
    mockPrisma.registrarArtistMember.update.mockResolvedValue({
      id: 'ram-2',
      inviteStatus: 'sent',
    });

    const result = await service.finalizeQueuedInviteDelivery('ram-2', 'sent');

    expect(mockPrisma.registrarInviteDelivery.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          registrarArtistMemberId: 'ram-2',
          status: 'queued',
        },
        data: expect.objectContaining({ status: 'sent' }),
      }),
    );
    expect(mockPrisma.registrarArtistMember.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ram-2' },
        data: { inviteStatus: 'sent' },
      }),
    );
    expect(result.registrarArtistMemberId).toBe('ram-2');
    expect(result.deliveryStatus).toBe('sent');
    expect(result.alreadyFinalized).toBe(false);
  });

  it('rejects invite delivery finalization when delivery row is missing', async () => {
    mockPrisma.registrarInviteDelivery.findUnique.mockResolvedValue(null);

    await expect(service.finalizeQueuedInviteDelivery('ram-missing', 'sent')).rejects.toThrow(NotFoundException);
  });

  it('returns already-finalized response when delivery is no longer queued', async () => {
    const dispatchedAt = new Date('2026-02-23T18:22:00.000Z');
    mockPrisma.registrarInviteDelivery.findUnique.mockResolvedValue({
      id: 'rid-2',
      registrarArtistMemberId: 'ram-2',
      status: 'sent',
      dispatchedAt,
    });

    const result = await service.finalizeQueuedInviteDelivery('ram-2', 'sent');

    expect(mockPrisma.registrarInviteDelivery.updateMany).not.toHaveBeenCalled();
    expect(mockPrisma.registrarArtistMember.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      registrarArtistMemberId: 'ram-2',
      deliveryStatus: 'sent',
      dispatchedAt,
      alreadyFinalized: true,
    });
  });

  it('returns already-finalized response when queued update loses race', async () => {
    mockPrisma.registrarInviteDelivery.findUnique
      .mockResolvedValueOnce({
        id: 'rid-2',
        registrarArtistMemberId: 'ram-2',
        status: 'queued',
        dispatchedAt: null,
      })
      .mockResolvedValueOnce({
        status: 'failed',
        dispatchedAt: new Date('2026-02-23T18:33:00.000Z'),
      });

    mockPrisma.registrarInviteDelivery.updateMany.mockResolvedValue({
      count: 0,
    });

    const result = await service.finalizeQueuedInviteDelivery('ram-2', 'sent');

    expect(mockPrisma.registrarArtistMember.update).not.toHaveBeenCalled();
    expect(result.registrarArtistMemberId).toBe('ram-2');
    expect(result.deliveryStatus).toBe('failed');
    expect(result.alreadyFinalized).toBe(true);
  });

  it('returns invite status summary for submitter-owned entry', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-7',
      type: 'artist_band_registration',
      createdById: 'u-1',
    });
    mockPrisma.registrarArtistMember.findMany.mockResolvedValue([
      {
        id: 'ram-1',
        name: 'Sam Pulse',
        email: 'sam@example.com',
        city: 'Austin',
        instrument: 'Drums',
        inviteStatus: 'queued',
        existingUserId: null,
        claimedUserId: null,
        inviteTokenExpiresAt: new Date('2026-03-06T00:00:00.000Z'),
        deliveries: [],
      },
      {
        id: 'ram-2',
        name: 'Alex Volt',
        email: 'alex@example.com',
        city: 'Austin',
        instrument: 'Guitar',
        inviteStatus: 'claimed',
        existingUserId: null,
        claimedUserId: 'u-2',
        inviteTokenExpiresAt: new Date('2026-03-06T00:00:00.000Z'),
        deliveries: [],
      },
    ]);

    const result = await service.getArtistBandInviteStatus('u-1', 'reg-7');

    expect(result.totalMembers).toBe(2);
    expect(result.countsByStatus.queued).toBe(1);
    expect(result.countsByStatus.claimed).toBe(1);
  });

  it('includes delivery outcome fields per member when delivery row exists', async () => {
    const sentAt = new Date('2026-02-23T10:00:00.000Z');
    const failedAt = new Date('2026-02-23T11:00:00.000Z');
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-7c',
      type: 'artist_band_registration',
      createdById: 'u-1',
    });
    mockPrisma.registrarArtistMember.findMany.mockResolvedValue([
      {
        id: 'ram-3',
        name: 'Sam Pulse',
        email: 'sam@example.com',
        city: 'Austin',
        instrument: 'Drums',
        inviteStatus: 'sent',
        existingUserId: null,
        claimedUserId: null,
        inviteTokenExpiresAt: new Date('2026-03-06T00:00:00.000Z'),
        deliveries: [{ status: 'sent', dispatchedAt: sentAt }],
      },
      {
        id: 'ram-4',
        name: 'Alex Volt',
        email: 'alex@example.com',
        city: 'Austin',
        instrument: 'Guitar',
        inviteStatus: 'failed',
        existingUserId: null,
        claimedUserId: null,
        inviteTokenExpiresAt: new Date('2026-03-06T00:00:00.000Z'),
        deliveries: [{ status: 'failed', dispatchedAt: failedAt }],
      },
      {
        id: 'ram-5',
        name: 'Jordan Key',
        email: 'jordan@example.com',
        city: 'Austin',
        instrument: 'Bass',
        inviteStatus: 'queued',
        existingUserId: null,
        claimedUserId: null,
        inviteTokenExpiresAt: new Date('2026-03-06T00:00:00.000Z'),
        deliveries: [],
      },
    ]);

    const result = await service.getArtistBandInviteStatus('u-1', 'reg-7c');

    expect(result.totalMembers).toBe(3);

    const sam = result.members.find((m: any) => m.id === 'ram-3');
    expect(sam.deliveryStatus).toBe('sent');
    expect(sam.sentAt).toEqual(sentAt);
    expect(sam.failedAt).toBeNull();

    const alex = result.members.find((m: any) => m.id === 'ram-4');
    expect(alex.deliveryStatus).toBe('failed');
    expect(alex.sentAt).toBeNull();
    expect(alex.failedAt).toEqual(failedAt);

    const jordan = result.members.find((m: any) => m.id === 'ram-5');
    expect(jordan.deliveryStatus).toBeNull();
    expect(jordan.sentAt).toBeNull();
    expect(jordan.failedAt).toBeNull();
  });

  it('maps queued delivery rows to queued deliveryStatus without sent/failed timestamps', async () => {
    const queuedAt = new Date('2026-02-23T09:00:00.000Z');
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-7q',
      type: 'artist_band_registration',
      createdById: 'u-1',
    });
    mockPrisma.registrarArtistMember.findMany.mockResolvedValue([
      {
        id: 'ram-q1',
        name: 'Kai North',
        email: 'kai@example.com',
        city: 'Austin',
        instrument: 'Keys',
        inviteStatus: 'queued',
        existingUserId: null,
        claimedUserId: null,
        inviteTokenExpiresAt: new Date('2026-03-06T00:00:00.000Z'),
        deliveries: [{ status: 'queued', dispatchedAt: queuedAt }],
      },
    ]);

    const result = await service.getArtistBandInviteStatus('u-1', 'reg-7q');
    const kai = result.members[0];

    expect(kai.deliveryStatus).toBe('queued');
    expect(kai.sentAt).toBeNull();
    expect(kai.failedAt).toBeNull();
  });

  it('omits raw deliveries array from member response shape', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-7d',
      type: 'artist_band_registration',
      createdById: 'u-1',
    });
    mockPrisma.registrarArtistMember.findMany.mockResolvedValue([
      {
        id: 'ram-6',
        name: 'Sam Pulse',
        email: 'sam@example.com',
        city: 'Austin',
        instrument: 'Drums',
        inviteStatus: 'queued',
        existingUserId: null,
        claimedUserId: null,
        inviteTokenExpiresAt: null,
        deliveries: [{ status: 'queued', dispatchedAt: null }],
      },
    ]);

    const result = await service.getArtistBandInviteStatus('u-1', 'reg-7d');

    expect(result.members[0]).not.toHaveProperty('deliveries');
    expect(result.members[0]).toHaveProperty('deliveryStatus');
    expect(result.members[0]).toHaveProperty('sentAt');
    expect(result.members[0]).toHaveProperty('failedAt');
  });

  it('rejects invite status read when registrar entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(service.getArtistBandInviteStatus('u-1', 'missing-entry')).rejects.toThrow(NotFoundException);
  });

  it('rejects invite status read for non artist/band registrar entry types', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-2',
      type: 'promoter_registration',
      createdById: 'u-1',
    });

    await expect(service.getArtistBandInviteStatus('u-1', 'reg-promoter-2')).rejects.toThrow(ForbiddenException);
  });

  it('rejects invite status read from non-submitting user', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-7b',
      type: 'artist_band_registration',
      createdById: 'u-9',
    });

    await expect(service.getArtistBandInviteStatus('u-1', 'reg-7b')).rejects.toThrow(ForbiddenException);
  });

  it('lists submitter-owned artist/band registrar entries with member invite counts', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'reg-8',
        type: 'artist_band_registration',
        status: 'submitted',
        sceneId: 'scene-1',
        artistBandId: null,
        payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
        createdAt: new Date('2026-02-21T10:00:00.000Z'),
        updatedAt: new Date('2026-02-21T10:05:00.000Z'),
        scene: {
          id: 'scene-1',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
          tier: 'city',
        },
        artistBand: {
          id: 'ab-8',
          name: 'Static Signal',
          slug: 'static-signal',
          entityType: 'band',
        },
        _count: {
          artistMembers: 3,
        },
      },
    ]);
    mockPrisma.registrarArtistMember.findMany.mockResolvedValue([
      { registrarEntryId: 'reg-8', inviteStatus: 'existing_user' },
      { registrarEntryId: 'reg-8', inviteStatus: 'pending_email' },
      { registrarEntryId: 'reg-8', inviteStatus: 'queued' },
      { registrarEntryId: 'reg-8', inviteStatus: 'sent' },
      { registrarEntryId: 'reg-8', inviteStatus: 'failed' },
    ]);
    mockPrisma.registrarInviteDelivery.findMany.mockResolvedValue([
      {
        dispatchedAt: new Date('2026-02-23T10:30:00.000Z'),
        registrarArtistMember: { registrarEntryId: 'reg-8' },
      },
      {
        dispatchedAt: new Date('2026-02-23T12:45:00.000Z'),
        registrarArtistMember: { registrarEntryId: 'reg-8' },
      },
      {
        dispatchedAt: null,
        registrarArtistMember: { registrarEntryId: 'reg-8' },
      },
    ]);

    const result = await service.listArtistBandRegistrations('u-1');

    expect(mockPrisma.registrarEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          createdById: 'u-1',
          type: 'artist_band_registration',
        }),
      }),
    );
    expect(result.total).toBe(1);
    expect(result.inviteCountsByStatus).toEqual({
      existing_user: 1,
      pending_email: 1,
      queued: 1,
      sent: 1,
      failed: 1,
    });
    expect(result.entries[0].memberCount).toBe(3);
    expect(result.entries[0].existingUserCount).toBe(1);
    expect(result.entries[0].pendingInviteCount).toBe(1);
    expect(result.entries[0].queuedInviteCount).toBe(1);
    expect(result.entries[0].sentInviteCount).toBe(1);
    expect(result.entries[0].failedInviteCount).toBe(1);
    expect(result.entries[0].claimedCount).toBe(0);
    expect(result.entries[0].lastInviteDispatchAt).toEqual(new Date('2026-02-23T12:45:00.000Z'));
    expect(result.entries[0].artistBand).toEqual({
      id: 'ab-8',
      name: 'Static Signal',
      slug: 'static-signal',
      entityType: 'band',
    });
  });

  it('returns empty list when submitter has no artist/band registrar entries', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([]);

    const result = await service.listArtistBandRegistrations('u-1');

    expect(result).toEqual({
      total: 0,
      inviteCountsByStatus: {},
      entries: [],
    });
    expect(mockPrisma.registrarArtistMember.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.registrarInviteDelivery.findMany).not.toHaveBeenCalled();
  });

  it('syncs claimed/existing registrar members into canonical artist-band memberships', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-9',
      type: 'artist_band_registration',
      createdById: 'u-1',
      artistBandId: 'ab-9',
    });
    mockPrisma.registrarArtistMember.findMany.mockResolvedValue([
      { existingUserId: 'u-2', claimedUserId: null, inviteStatus: 'existing_user' },
      { existingUserId: null, claimedUserId: 'u-3', inviteStatus: 'claimed' },
      { existingUserId: 'u-2', claimedUserId: null, inviteStatus: 'existing_user' },
      { existingUserId: null, claimedUserId: null, inviteStatus: 'pending_email' },
    ]);
    mockPrisma.artistBandMember.createMany.mockResolvedValue({ count: 2 });

    const result = await service.syncArtistBandMembers('u-1', 'reg-9');

    expect(mockPrisma.artistBandMember.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ artistBandId: 'ab-9', userId: 'u-2', role: 'member' }),
          expect.objectContaining({ artistBandId: 'ab-9', userId: 'u-3', role: 'member' }),
        ]),
        skipDuplicates: true,
      }),
    );
    expect(result.eligibleMemberCount).toBe(2);
    expect(result.createdMemberCount).toBe(2);
    expect(result.skippedMemberCount).toBe(0);
  });

  it('rejects member sync before materialization', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-10',
      type: 'artist_band_registration',
      createdById: 'u-1',
      artistBandId: null,
    });

    await expect(service.syncArtistBandMembers('u-1', 'reg-10')).rejects.toThrow(ForbiddenException);
  });

  it('rejects member sync when registrar entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(service.syncArtistBandMembers('u-1', 'missing-entry')).rejects.toThrow(NotFoundException);
  });

  it('rejects member sync for non artist/band registrar entry types', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-promoter-3',
      type: 'promoter_registration',
      createdById: 'u-1',
      artistBandId: null,
    });

    await expect(service.syncArtistBandMembers('u-1', 'reg-promoter-3')).rejects.toThrow(ForbiddenException);
  });

  it('rejects member sync from non-submitting user', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'reg-11',
      type: 'artist_band_registration',
      createdById: 'u-9',
      artistBandId: 'ab-11',
    });

    await expect(service.syncArtistBandMembers('u-1', 'reg-11')).rejects.toThrow(ForbiddenException);
  });
});
