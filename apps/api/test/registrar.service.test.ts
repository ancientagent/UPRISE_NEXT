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
      update: jest.fn(),
    },
    registrarArtistMember: {
      createMany: jest.fn(),
    },
    artistBand: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    artistBandMember: {
      create: jest.fn(),
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
});
