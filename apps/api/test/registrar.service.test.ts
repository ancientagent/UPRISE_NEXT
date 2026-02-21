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
      }),
    );
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
      },
    ]);

    const result = await service.getArtistBandInviteStatus('u-1', 'reg-7');

    expect(result.totalMembers).toBe(2);
    expect(result.countsByStatus.queued).toBe(1);
    expect(result.countsByStatus.claimed).toBe(1);
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
