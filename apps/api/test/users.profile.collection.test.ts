import { NotFoundException } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';

describe('UsersService.getProfileWithCollection', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    artistBand: {
      findMany: jest.fn(),
    },
    artistBandMember: {
      count: jest.fn(),
    },
    collection: {
      findMany: jest.fn(),
    },
    userSavedScene: {
      findMany: jest.fn(),
    },
    userActivationNotice: {
      findMany: jest.fn(),
    },
    community: {
      findFirst: jest.fn(),
    },
    userMusicCommunityPreference: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (callback: any) => callback(mockPrisma));
    mockPrisma.artistBand.findMany.mockResolvedValue([]);
    mockPrisma.userSavedScene.findMany.mockResolvedValue([]);
    mockPrisma.userActivationNotice.findMany.mockResolvedValue([]);
    service = new UsersService(mockPrisma as any);
  });

  it('throws NotFoundException when target user does not exist', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.getProfileWithCollection('viewer', 'missing')).rejects.toThrow(NotFoundException);
  });

  it('hides collection shelves for non-owner when display is disabled', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'target',
      username: 'target',
      displayName: 'Target',
      bio: null,
      avatar: null,
      coverImage: null,
      city: 'Austin',
      country: 'US',
      collectionDisplayEnabled: false,
      createdAt: new Date(),
    });
    mockPrisma.artistBandMember.count.mockResolvedValue(0);

    const result = await service.getProfileWithCollection('viewer', 'target');

    expect(result.canViewCollection).toBe(false);
    expect(result.collectionShelves).toEqual([]);
    expect(result.savedAwayScenes).toEqual([]);
    expect(result.activationNotices).toEqual([]);
    expect(result.managedArtistBands).toEqual([]);
    expect(result.user.hasArtistBand).toBe(false);
    expect(mockPrisma.collection.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.userSavedScene.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.userActivationNotice.findMany).not.toHaveBeenCalled();
  });

  it('returns fixed shelves for owner and maps shelf items', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'target',
      username: 'target',
      displayName: 'Target',
      bio: null,
      avatar: null,
      coverImage: null,
      city: 'Austin',
      country: 'US',
      collectionDisplayEnabled: false,
      createdAt: new Date(),
    });
    mockPrisma.artistBandMember.count.mockResolvedValue(1);
    mockPrisma.artistBand.findMany.mockResolvedValue([
      {
        id: 'ab-1',
        name: 'Static Signal',
        slug: 'static-signal',
        entityType: 'band',
        members: [{ role: 'owner' }],
      },
    ]);

    mockPrisma.collection.findMany.mockResolvedValue([
      {
        name: 'singles',
        items: [
          {
            createdAt: new Date('2026-02-19T10:00:00.000Z'),
            signal: {
              id: 'signal-1',
              type: 'single',
              metadata: null,
              createdAt: new Date('2026-02-19T10:00:00.000Z'),
            },
          },
        ],
      },
      {
        name: 'uprises',
        items: [],
      },
    ]);
    mockPrisma.userSavedScene.findMany.mockResolvedValue([
      {
        id: 'saved-away-1',
        reason: 'former_proxy_cutover',
        savedAt: new Date('2026-06-29T12:00:00.000Z'),
        context: { from: 'activation_cutover' },
        community: {
          id: 'scene-austin-punk',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'Texas',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
      },
    ]);
    mockPrisma.userActivationNotice.findMany.mockResolvedValue([
      {
        id: 'notice-1',
        reason: 'natural_home_scene_activated',
        status: 'unread',
        message: 'El Paso, Texas Punk is now active because enough local source music is ready.',
        city: 'El Paso',
        state: 'Texas',
        musicCommunity: 'Punk',
        createdAt: new Date('2026-06-29T12:00:00.000Z'),
        fromScene: {
          id: 'scene-austin-punk',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'Texas',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
        toScene: {
          id: 'scene-el-paso-punk',
          name: 'El Paso Punk',
          city: 'El Paso',
          state: 'Texas',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
      },
    ]);

    const result = await service.getProfileWithCollection('target', 'target');

    expect(result.canViewCollection).toBe(true);
    expect(result.user.hasArtistBand).toBe(true);
    expect(result.managedArtistBands).toEqual([
      {
        id: 'ab-1',
        name: 'Static Signal',
        slug: 'static-signal',
        entityType: 'band',
        membershipRole: 'owner',
      },
    ]);
    expect(result.collectionShelves).toHaveLength(7);
    const singles = result.collectionShelves.find((s) => s.shelf === 'singles');
    expect(singles?.itemCount).toBe(1);
    expect(singles?.items[0].signalId).toBe('signal-1');
    expect(result.savedAwayScenes).toEqual([
      expect.objectContaining({
        id: 'saved-away-1',
        reason: 'former_proxy_cutover',
        savedAt: '2026-06-29T12:00:00.000Z',
        scene: expect.objectContaining({ id: 'scene-austin-punk', name: 'Austin Punk' }),
      }),
    ]);
    expect(result.activationNotices).toEqual([
      expect.objectContaining({
        id: 'notice-1',
        reason: 'natural_home_scene_activated',
        status: 'unread',
        toScene: expect.objectContaining({ id: 'scene-el-paso-punk' }),
      }),
    ]);
  });

  it('findById returns canonical artist-band bridge fields', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'target',
      username: 'target',
      displayName: 'Target',
      bio: null,
      avatar: null,
      coverImage: null,
      city: 'Austin',
      country: 'US',
      collectionDisplayEnabled: true,
      createdAt: new Date(),
    });
    mockPrisma.artistBandMember.count.mockResolvedValue(0);
    mockPrisma.artistBand.findMany.mockResolvedValue([
      {
        id: 'ab-9',
        name: 'Signal Rise',
        slug: 'signal-rise',
        entityType: 'artist',
        members: [{ role: 'owner' }],
      },
    ]);

    const result = await service.findById('target');

    expect(result.hasArtistBand).toBe(false);
    expect(result.managedArtistBands).toEqual([
      {
        id: 'ab-9',
        name: 'Signal Rise',
        slug: 'signal-rise',
        entityType: 'artist',
        membershipRole: 'owner',
      },
    ]);
  });

  it('seeds the current home scene community as the default music-community preference', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'target',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.userMusicCommunityPreference.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        id: 'pref-1',
        userId: 'target',
        musicCommunity: 'Punk',
        isDefault: true,
        createdAt: new Date('2026-06-25T10:00:00.000Z'),
        updatedAt: new Date('2026-06-25T10:00:00.000Z'),
      },
    ]);
    mockPrisma.userMusicCommunityPreference.upsert.mockResolvedValue({
      id: 'pref-1',
      userId: 'target',
      musicCommunity: 'Punk',
      isDefault: true,
      createdAt: new Date('2026-06-25T10:00:00.000Z'),
      updatedAt: new Date('2026-06-25T10:00:00.000Z'),
    });

    const result = await service.listMusicCommunityPreferences('target');

    expect(mockPrisma.userMusicCommunityPreference.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_musicCommunity: { userId: 'target', musicCommunity: 'Punk' } },
        create: expect.objectContaining({ userId: 'target', musicCommunity: 'Punk', isDefault: true }),
      }),
    );
    expect(result).toEqual([
      expect.objectContaining({
        id: 'pref-1',
        musicCommunity: 'Punk',
        isDefault: true,
      }),
    ]);
  });

  it('adds a music-community preference without stealing the default', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'target',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.userMusicCommunityPreference.findMany.mockResolvedValue([
      {
        id: 'pref-punk',
        userId: 'target',
        musicCommunity: 'Punk',
        isDefault: true,
        createdAt: new Date('2026-06-25T10:00:00.000Z'),
        updatedAt: new Date('2026-06-25T10:00:00.000Z'),
      },
      {
        id: 'pref-metal',
        userId: 'target',
        musicCommunity: 'Metal',
        isDefault: false,
        createdAt: new Date('2026-06-25T10:01:00.000Z'),
        updatedAt: new Date('2026-06-25T10:01:00.000Z'),
      },
    ]);
    mockPrisma.userMusicCommunityPreference.upsert.mockResolvedValue({
      id: 'pref-metal',
      userId: 'target',
      musicCommunity: 'Metal',
      isDefault: false,
      createdAt: new Date('2026-06-25T10:01:00.000Z'),
      updatedAt: new Date('2026-06-25T10:01:00.000Z'),
    });

    const result = await service.addMusicCommunityPreference('target', ' Metal ');

    expect(mockPrisma.userMusicCommunityPreference.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_musicCommunity: { userId: 'target', musicCommunity: 'Metal' } },
        create: expect.objectContaining({ userId: 'target', musicCommunity: 'Metal', isDefault: false }),
      }),
    );
    expect(result.map((preference) => preference.musicCommunity)).toEqual(['Punk', 'Metal']);
    expect(result.find((preference) => preference.musicCommunity === 'Punk')?.isDefault).toBe(true);
    expect(result.find((preference) => preference.musicCommunity === 'Metal')?.isDefault).toBe(false);
  });

  it('sets an existing music-community preference as the explicit default', async () => {
    mockPrisma.userMusicCommunityPreference.findUnique.mockResolvedValue({
      id: 'pref-metal',
      userId: 'target',
      musicCommunity: 'Metal',
      isDefault: false,
      createdAt: new Date('2026-06-25T10:01:00.000Z'),
      updatedAt: new Date('2026-06-25T10:01:00.000Z'),
    });
    mockPrisma.userMusicCommunityPreference.findMany.mockResolvedValue([
      {
        id: 'pref-metal',
        userId: 'target',
        musicCommunity: 'Metal',
        isDefault: true,
        createdAt: new Date('2026-06-25T10:01:00.000Z'),
        updatedAt: new Date('2026-06-25T10:02:00.000Z'),
      },
      {
        id: 'pref-punk',
        userId: 'target',
        musicCommunity: 'Punk',
        isDefault: false,
        createdAt: new Date('2026-06-25T10:00:00.000Z'),
        updatedAt: new Date('2026-06-25T10:02:00.000Z'),
      },
    ]);

    const result = await service.setDefaultMusicCommunityPreference('target', 'Metal');

    expect(mockPrisma.userMusicCommunityPreference.updateMany).toHaveBeenCalledWith({
      where: { userId: 'target', isDefault: true },
      data: { isDefault: false },
    });
    expect(mockPrisma.userMusicCommunityPreference.update).toHaveBeenCalledWith({
      where: { id: 'pref-metal' },
      data: { isDefault: true },
    });
    expect(result[0]).toMatchObject({ musicCommunity: 'Metal', isDefault: true });
  });

  it('resolves Home Scene roller items from registered preferences and excludes unresolved preferences', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'target',
      homeSceneCity: 'El Paso',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      tunedSceneId: 'scene-austin-punk',
    });
    mockPrisma.userMusicCommunityPreference.findMany.mockResolvedValue([
      {
        id: 'pref-punk',
        userId: 'target',
        musicCommunity: 'Punk',
        isDefault: true,
        createdAt: new Date('2026-06-25T10:00:00.000Z'),
        updatedAt: new Date('2026-06-25T10:00:00.000Z'),
      },
      {
        id: 'pref-metal',
        userId: 'target',
        musicCommunity: 'Metal',
        isDefault: false,
        createdAt: new Date('2026-06-25T10:01:00.000Z'),
        updatedAt: new Date('2026-06-25T10:01:00.000Z'),
      },
      {
        id: 'pref-jazz',
        userId: 'target',
        musicCommunity: 'Jazz',
        isDefault: false,
        createdAt: new Date('2026-06-25T10:02:00.000Z'),
        updatedAt: new Date('2026-06-25T10:02:00.000Z'),
      },
    ]);
    mockPrisma.community.findFirst.mockImplementation(async ({ where }: any) => {
      if (where.city === 'El Paso' && where.musicCommunity === 'Metal') {
        return {
          id: 'scene-el-paso-metal',
          name: 'El Paso Metal',
          city: 'El Paso',
          state: 'Texas',
          musicCommunity: 'Metal',
          tier: 'city',
          isActive: true,
        };
      }
      if (!where.city && where.state === 'Texas' && where.musicCommunity === 'Punk') {
        return {
          id: 'scene-austin-punk',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'Texas',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        };
      }
      return null;
    });

    const result = await service.getHomeSceneRoller('target');

    expect(result.currentLocation).toEqual({ city: 'El Paso', state: 'Texas' });
    expect(result.items).toEqual([
      expect.objectContaining({
        preferenceId: 'pref-punk',
        musicCommunity: 'Punk',
        sceneId: 'scene-austin-punk',
        isDefault: true,
        isCurrent: true,
        resolution: 'proxy',
      }),
      expect.objectContaining({
        preferenceId: 'pref-metal',
        musicCommunity: 'Metal',
        sceneId: 'scene-el-paso-metal',
        isDefault: false,
        isCurrent: false,
        resolution: 'natural',
      }),
    ]);
    expect(result.items.some((item) => item.musicCommunity === 'Jazz')).toBe(false);
  });
});

describe('UsersController music-community preferences', () => {
  const usersService = {
    findById: jest.fn(),
    listMusicCommunityPreferences: jest.fn(),
    addMusicCommunityPreference: jest.fn(),
    setDefaultMusicCommunityPreference: jest.fn(),
    getHomeSceneRoller: jest.fn(),
  };

  let controller: UsersController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new UsersController(usersService as any);
  });

  it('registers current-user routes before parameterized user routes', () => {
    const source = readFileSync(join(__dirname, '../src/users/users.controller.ts'), 'utf8');
    const currentUserRoute = source.indexOf("@Get('me')");
    const musicPreferencesRoute = source.indexOf("@Get('me/music-community-preferences')");
    const rollerRoute = source.indexOf("@Get('me/home-scene-roller')");
    const parameterizedUserRoute = source.indexOf("@Get(':id')");

    expect(currentUserRoute).toBeGreaterThan(-1);
    expect(currentUserRoute).toBeLessThan(parameterizedUserRoute);
    expect(musicPreferencesRoute).toBeLessThan(parameterizedUserRoute);
    expect(rollerRoute).toBeLessThan(parameterizedUserRoute);
  });

  it('returns the authenticated current user from /users/me', async () => {
    usersService.findById.mockResolvedValue({
      id: 'user-1',
      username: 'verified-listener',
      displayName: 'Verified Listener',
    });

    const response = await controller.findMe({
      user: { userId: 'user-1' },
    });

    expect(usersService.findById).toHaveBeenCalledWith('user-1');
    expect(response).toEqual({
      success: true,
      data: {
        id: 'user-1',
        username: 'verified-listener',
        displayName: 'Verified Listener',
      },
    });
  });

  it('returns the current user music-community preferences', async () => {
    usersService.listMusicCommunityPreferences.mockResolvedValue([
      { id: 'pref-1', musicCommunity: 'Punk', isDefault: true },
    ]);

    const response = await controller.listMyMusicCommunityPreferences({
      user: { userId: 'user-1' },
    });

    expect(usersService.listMusicCommunityPreferences).toHaveBeenCalledWith('user-1');
    expect(response).toEqual({
      success: true,
      data: [{ id: 'pref-1', musicCommunity: 'Punk', isDefault: true }],
    });
  });

  it('adds a music-community preference for the current user', async () => {
    usersService.addMusicCommunityPreference.mockResolvedValue([
      { id: 'pref-1', musicCommunity: 'Punk', isDefault: true },
      { id: 'pref-2', musicCommunity: 'Metal', isDefault: false },
    ]);

    const response = await controller.addMyMusicCommunityPreference(
      { musicCommunity: 'Metal' },
      { user: { userId: 'user-1' } },
    );

    expect(usersService.addMusicCommunityPreference).toHaveBeenCalledWith('user-1', 'Metal');
    expect(response.data).toHaveLength(2);
  });

  it('sets the current user explicit default music-community preference', async () => {
    usersService.setDefaultMusicCommunityPreference.mockResolvedValue([
      { id: 'pref-2', musicCommunity: 'Metal', isDefault: true },
      { id: 'pref-1', musicCommunity: 'Punk', isDefault: false },
    ]);

    const response = await controller.setDefaultMusicCommunityPreference(
      { musicCommunity: 'Metal' },
      { user: { userId: 'user-1' } },
    );

    expect(usersService.setDefaultMusicCommunityPreference).toHaveBeenCalledWith('user-1', 'Metal');
    expect(response.data[0]).toMatchObject({ musicCommunity: 'Metal', isDefault: true });
  });

  it('returns the current user Home Scene roller read model', async () => {
    usersService.getHomeSceneRoller.mockResolvedValue({
      currentLocation: { city: 'El Paso', state: 'Texas' },
      items: [{ musicCommunity: 'Punk', sceneId: 'scene-austin-punk', resolution: 'proxy' }],
    });

    const response = await controller.getMyHomeSceneRoller({
      user: { userId: 'user-1' },
    });

    expect(usersService.getHomeSceneRoller).toHaveBeenCalledWith('user-1');
    expect(response.data.items[0]).toMatchObject({
      musicCommunity: 'Punk',
      sceneId: 'scene-austin-punk',
      resolution: 'proxy',
    });
  });
});
