import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RegistrarService } from '../src/registrar/registrar.service';

describe('RegistrarService', () => {
  const mockPrisma = {
    community: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    registrarEntry: {
      create: jest.fn(),
    },
  };

  let service: RegistrarService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RegistrarService(mockPrisma as any);
  });

  it('throws when target scene does not exist', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u-1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitArtistBandRegistration('u-1', {
        sceneId: '11111111-1111-1111-1111-111111111111',
        name: 'Static Signal',
        slug: 'static-signal',
        entityType: 'band',
      }),
    ).rejects.toThrow(NotFoundException);
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
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitArtistBandRegistration('u-1', {
        sceneId: '11111111-1111-1111-1111-111111111111',
        name: 'Static Signal',
        slug: 'static-signal',
        entityType: 'band',
      }),
    ).rejects.toThrow(ForbiddenException);
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
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'punk',
    });

    await expect(
      service.submitArtistBandRegistration('u-1', {
        sceneId: '11111111-1111-1111-1111-111111111111',
        name: 'Static Signal',
        slug: 'static-signal',
        entityType: 'band',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('creates submitted registrar entry for valid home-scene request', async () => {
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
      id: 'reg-1',
      type: 'artist_band_registration',
      status: 'submitted',
      sceneId: 'scene-1',
      createdById: 'u-1',
      payload: { name: 'Static Signal', slug: 'static-signal', entityType: 'band' },
      createdAt: new Date('2026-02-20T14:10:00.000Z'),
    });

    const result = await service.submitArtistBandRegistration('u-1', {
      sceneId: '11111111-1111-1111-1111-111111111111',
      name: 'Static Signal',
      slug: 'static-signal',
      entityType: 'band',
    });

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
    expect(result.id).toBe('reg-1');
  });
});
