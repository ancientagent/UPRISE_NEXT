import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SectRegistrarService, slugifySectName } from '../src/registrar/sect-registrar.service';

describe('SectRegistrarService', () => {
  const scene = {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Austin Punk',
    city: 'Austin',
    state: 'TX',
    musicCommunity: 'punk',
    tier: 'city',
  };
  const user = {
    id: 'listener-1',
    homeSceneCity: 'Austin',
    homeSceneState: 'TX',
    homeSceneCommunity: 'punk',
  };
  const createdAt = new Date('2026-07-15T03:00:00.000Z');
  const updatedAt = new Date('2026-07-15T03:00:00.000Z');

  const prisma = {
    community: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
    registrarEntry: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
    sect: { create: jest.fn() },
    $transaction: jest.fn(),
  };
  const resolver = { resolveDefaultMusicCommunity: jest.fn() };
  let service: SectRegistrarService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.community.findUnique.mockResolvedValue(scene);
    prisma.user.findUnique.mockResolvedValue(user);
    resolver.resolveDefaultMusicCommunity.mockResolvedValue('punk');
    prisma.$transaction.mockImplementation(async (callback: (tx: typeof prisma) => unknown) => callback(prisma));
    prisma.registrarEntry.create.mockResolvedValue({
      id: 'request-1',
      type: 'sect_motion',
      status: 'submitted',
      sceneId: scene.id,
      payload: { sectName: 'Noise Art', sectSlug: 'noise-art' },
      createdAt,
      updatedAt,
    });
    prisma.sect.create.mockResolvedValue({
      id: 'sect-1',
      parentCommunityId: scene.id,
      name: 'Noise Art',
      slug: 'noise-art',
    });
    service = new SectRegistrarService(prisma as any, resolver as any);
  });

  it('creates a named listener request and linked Sect identity atomically', async () => {
    const result = await service.submitSectRequest('listener-1', {
      sceneId: scene.id,
      sectName: ' Noise Art ',
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.registrarEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          type: 'sect_motion',
          status: 'submitted',
          sceneId: scene.id,
          createdById: 'listener-1',
          payload: { sectName: 'Noise Art', sectSlug: 'noise-art' },
        },
      }),
    );
    expect(prisma.sect.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          parentCommunityId: scene.id,
          requestRegistrarEntryId: 'request-1',
          name: 'Noise Art',
          slug: 'noise-art',
        },
      }),
    );
    expect(result).toMatchObject({
      payload: { sectName: 'Noise Art', sectSlug: 'noise-art' },
      sect: { id: 'sect-1', parentCommunityId: scene.id, name: 'Noise Art', slug: 'noise-art' },
      scene,
    });
    expect(resolver.resolveDefaultMusicCommunity).toHaveBeenCalledWith('listener-1', 'punk');
  });

  it.each([
    ['Noise / Art', 'noise-art'],
    ['Déjà Vu', 'deja-vu'],
    ['東京', 'sect-130016b2599bf7e5'],
    ['!!!', 'sect-e84c538e7fe25073'],
  ])('builds deterministic slug for %s', (name, expected) => {
    expect(slugifySectName(name)).toBe(expected);
  });

  it('caps long slugs at 120 characters', () => {
    expect(slugifySectName('a'.repeat(140))).toBe('a'.repeat(120));
  });

  it('translates only expected Sect uniqueness conflicts', async () => {
    prisma.$transaction.mockRejectedValue({
      code: 'P2002',
      meta: { target: ['parentCommunityId', 'slug'] },
    });

    await expect(
      service.submitSectRequest('listener-1', { sceneId: scene.id, sectName: 'Noise Art' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('does not hide unrelated database failures', async () => {
    const failure = new Error('database unavailable');
    prisma.$transaction.mockRejectedValue(failure);

    await expect(
      service.submitSectRequest('listener-1', { sceneId: scene.id, sectName: 'Noise Art' }),
    ).rejects.toBe(failure);
  });

  it('rejects requests outside the listener Home Scene without source checks', async () => {
    prisma.community.findUnique.mockResolvedValue({ ...scene, city: 'Dallas' });

    await expect(
      service.submitSectRequest('listener-1', { sceneId: scene.id, sectName: 'Noise Art' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects missing and non-city scenes', async () => {
    prisma.community.findUnique.mockResolvedValueOnce(null);
    await expect(
      service.submitSectRequest('listener-1', { sceneId: scene.id, sectName: 'Noise Art' }),
    ).rejects.toBeInstanceOf(NotFoundException);

    prisma.community.findUnique.mockResolvedValueOnce({ ...scene, tier: 'state' });
    await expect(
      service.submitSectRequest('listener-1', { sceneId: scene.id, sectName: 'Noise Art' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects requests from a missing user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.submitSectRequest('missing-listener', { sceneId: scene.id, sectName: 'Noise Art' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('requires an established Home Scene before accepting a request', async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...user,
      homeSceneCity: null,
      homeSceneState: null,
      homeSceneCommunity: null,
    });
    resolver.resolveDefaultMusicCommunity.mockResolvedValue(null);

    await expect(
      service.submitSectRequest('listener-1', { sceneId: scene.id, sectName: 'Noise Art' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('normalizes legacy empty request rows without inventing identity', async () => {
    prisma.registrarEntry.findMany.mockResolvedValue([
      {
        id: 'legacy-request',
        type: 'sect_motion',
        status: 'submitted',
        sceneId: scene.id,
        payload: {},
        requestedSect: null,
        scene,
        createdAt,
        updatedAt,
      },
    ]);

    const result = await service.listSectRequests('listener-1');

    expect(result).toEqual({
      total: 1,
      countsByStatus: { submitted: 1 },
      entries: [
        expect.objectContaining({
          id: 'legacy-request',
          payload: { sectName: null, sectSlug: null },
          sect: null,
        }),
      ],
    });
  });

  it('keeps detail read submitter-only and type-scoped', async () => {
    prisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'request-1',
      type: 'sect_motion',
      status: 'submitted',
      sceneId: scene.id,
      createdById: 'listener-2',
      payload: {},
      requestedSect: null,
      scene,
      createdAt,
      updatedAt,
    });
    await expect(service.getSectRequest('listener-1', 'request-1')).rejects.toBeInstanceOf(ForbiddenException);

    prisma.registrarEntry.findUnique.mockResolvedValue({
      id: 'request-1',
      type: 'project_registration',
      createdById: 'listener-1',
    });
    await expect(service.getSectRequest('listener-1', 'request-1')).rejects.toBeInstanceOf(ForbiddenException);

    prisma.registrarEntry.findUnique.mockResolvedValue(null);
    await expect(service.getSectRequest('listener-1', 'missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
