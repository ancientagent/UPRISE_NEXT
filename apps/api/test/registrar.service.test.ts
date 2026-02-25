import { ForbiddenException, NotFoundException } from '@nestjs/common';
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
      update: jest.fn(),
    },
    registrarCode: {
      create: jest.fn(),
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

  it('returns empty list when submitter has no promoter registrations', async () => {
    mockPrisma.registrarEntry.findMany.mockResolvedValue([]);

    const result = await service.listPromoterRegistrations('u-1');

    expect(result).toEqual({
      total: 0,
      countsByStatus: {},
      entries: [],
    });
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
    expect(result.registrarEntryId).toBe('reg-promoter-approved-1');
    expect(result.capability).toBe('promoter_capability');
    expect(result.issuerType).toBe('system');
    expect(result.status).toBe('issued');
    expect(result.code).toMatch(/^PRC-[A-F0-9]{32}$/);
  });

  it('rejects registrar code issuance when issuer is not system', async () => {
    await expect(
      service.issueRegistrarCodeForApprovedPromoterEntry('reg-promoter-approved-1', {
        issuer: 'manual' as any,
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrisma.registrarEntry.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
  });

  it('rejects registrar code issuance when registrar entry is missing', async () => {
    mockPrisma.registrarEntry.findUnique.mockResolvedValue(null);

    await expect(service.issueRegistrarCodeForApprovedPromoterEntry('missing-entry')).rejects.toThrow(
      NotFoundException,
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

    expect(mockPrisma.registrarCode.create).not.toHaveBeenCalled();
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
    });
    mockPrisma.registrarInviteDelivery.update.mockResolvedValue({
      id: 'rid-2',
      status: 'sent',
    });
    mockPrisma.registrarArtistMember.update.mockResolvedValue({
      id: 'ram-2',
      inviteStatus: 'sent',
    });

    const result = await service.finalizeQueuedInviteDelivery('ram-2', 'sent');

    expect(mockPrisma.registrarInviteDelivery.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { registrarArtistMemberId: 'ram-2' },
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
  });

  it('rejects invite delivery finalization when delivery row is missing', async () => {
    mockPrisma.registrarInviteDelivery.findUnique.mockResolvedValue(null);

    await expect(service.finalizeQueuedInviteDelivery('ram-missing', 'sent')).rejects.toThrow(NotFoundException);
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
    expect(result.entries[0].memberCount).toBe(3);
    expect(result.entries[0].existingUserCount).toBe(1);
    expect(result.entries[0].pendingInviteCount).toBe(1);
    expect(result.entries[0].queuedInviteCount).toBe(1);
    expect(result.entries[0].sentInviteCount).toBe(1);
    expect(result.entries[0].failedInviteCount).toBe(1);
    expect(result.entries[0].claimedCount).toBe(0);
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
      entries: [],
    });
    expect(mockPrisma.registrarArtistMember.findMany).not.toHaveBeenCalled();
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
