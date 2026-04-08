import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DiscoveryController } from '../src/communities/discovery.controller';
import { CommunitiesService } from '../src/communities/communities.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../src/auth/guards/optional-jwt-auth.guard';

class MockJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = { userId: 'user-1' };
    return true;
  }
}

class MockOptionalJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = request.headers?.authorization ? { userId: 'user-1' } : null;
    return true;
  }
}

describe('DiscoveryController', () => {
  let app: INestApplication;

  const communitiesServiceMock = {
    discoverScenes: jest.fn(),
    searchCommunityDiscover: jest.fn(),
    getCommunityDiscoverHighlights: jest.fn(),
    tuneScene: jest.fn(),
    getDiscoveryContext: jest.fn(),
    setHomeScene: jest.fn(),
    saveDiscoverUprise: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [DiscoveryController],
      providers: [
        {
          provide: CommunitiesService,
          useValue: communitiesServiceMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtGuard)
      .overrideGuard(OptionalJwtAuthGuard)
      .useClass(MockOptionalJwtGuard)
      .compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();
    await (app.getHttpAdapter().getInstance() as any).ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('delegates GET /discover/scenes and returns deterministic scene list response', async () => {
    communitiesServiceMock.discoverScenes.mockResolvedValue({
      tier: 'city',
      musicCommunity: 'Punk',
      filters: { state: 'TX', city: 'Austin' },
      items: [
        {
          entryType: 'city_scene',
          sceneId: 'scene-1',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'Punk',
          memberCount: 120,
          isActive: true,
          isHomeScene: true,
        },
      ],
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/discover/scenes?tier=city&musicCommunity=Punk&state=TX&city=Austin&limit=20',
      headers: {
        authorization: 'Bearer test-token',
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload).toEqual({
      success: true,
      data: expect.any(Array),
      meta: {
        tier: 'city',
        musicCommunity: 'Punk',
        filters: { state: 'TX', city: 'Austin' },
        count: 1,
      },
    });
    expect(communitiesServiceMock.discoverScenes).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        tier: 'city',
        musicCommunity: 'Punk',
        state: 'TX',
        city: 'Austin',
        limit: 20,
      }),
    );
  });

  it('returns 400 on invalid discover scenes query (missing musicCommunity)', async () => {
    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/discover/scenes?tier=city',
      headers: {
        authorization: 'Bearer test-token',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(communitiesServiceMock.discoverScenes).not.toHaveBeenCalled();
  });

  it('allows anonymous GET /discover/scenes and delegates with null user id', async () => {
    communitiesServiceMock.discoverScenes.mockResolvedValue({
      tier: 'city',
      musicCommunity: 'Punk',
      filters: { state: 'TX', city: 'Austin' },
      items: [],
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/discover/scenes?tier=city&musicCommunity=Punk&state=TX&city=Austin',
    });

    expect(response.statusCode).toBe(200);
    expect(communitiesServiceMock.discoverScenes).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        tier: 'city',
        musicCommunity: 'Punk',
        state: 'TX',
        city: 'Austin',
      }),
    );
  });

  it('delegates GET /discover/communities/:sceneId/search and returns local artist/song results', async () => {
    communitiesServiceMock.searchCommunityDiscover.mockResolvedValue({
      community: {
        id: 'scene-1',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
      query: 'signal',
      artists: [],
      songs: [],
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/discover/communities/scene-1/search?query=signal&limit=5&tier=state',
      headers: {
        authorization: 'Bearer test-token',
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.community.id).toBe('scene-1');
    expect(communitiesServiceMock.searchCommunityDiscover).toHaveBeenCalledWith(
      'user-1',
      'scene-1',
      {
        query: 'signal',
        limit: 5,
        tier: 'state',
      },
    );
  });

  it('allows anonymous GET /discover/communities/:sceneId/search and delegates with null user id', async () => {
    communitiesServiceMock.searchCommunityDiscover.mockResolvedValue({
      community: {
        id: 'scene-1',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
      query: 'signal',
      artists: [],
      songs: [],
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/discover/communities/scene-1/search?query=signal&limit=5&tier=city',
    });

    expect(response.statusCode).toBe(200);
    expect(communitiesServiceMock.searchCommunityDiscover).toHaveBeenCalledWith(
      null,
      'scene-1',
      {
        query: 'signal',
        limit: 5,
        tier: 'city',
      },
    );
  });

  it('returns 400 on invalid community discover search query', async () => {
    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/discover/communities/scene-1/search',
      headers: {
        authorization: 'Bearer test-token',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(communitiesServiceMock.searchCommunityDiscover).not.toHaveBeenCalled();
  });

  it('delegates GET /discover/communities/:sceneId/highlights and returns carousel data', async () => {
    communitiesServiceMock.getCommunityDiscoverHighlights.mockResolvedValue({
      community: {
        id: 'scene-1',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
      popularSingles: {
        mostAdded: [],
        supportedNow: [],
        recentRises: [],
      },
      recommendations: [],
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/discover/communities/scene-1/highlights?limit=6&tier=national',
      headers: {
        authorization: 'Bearer test-token',
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.community.id).toBe('scene-1');
    expect(communitiesServiceMock.getCommunityDiscoverHighlights).toHaveBeenCalledWith(
      'user-1',
      'scene-1',
      {
        limit: 6,
        tier: 'national',
      },
    );
  });

  it('allows anonymous GET /discover/communities/:sceneId/highlights and delegates with null user id', async () => {
    communitiesServiceMock.getCommunityDiscoverHighlights.mockResolvedValue({
      community: {
        id: 'scene-1',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
      popularSingles: {
        mostAdded: [],
        supportedNow: [],
        recentRises: [],
      },
      recommendations: [],
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/discover/communities/scene-1/highlights?limit=6&tier=city',
    });

    expect(response.statusCode).toBe(200);
    expect(communitiesServiceMock.getCommunityDiscoverHighlights).toHaveBeenCalledWith(
      null,
      'scene-1',
      {
        limit: 6,
        tier: 'city',
      },
    );
  });

  it('delegates GET /discover/context and returns persisted context response', async () => {
    communitiesServiceMock.getDiscoveryContext.mockResolvedValue({
      tunedSceneId: 'scene-2',
      tunedScene: {
        id: 'scene-2',
        name: 'Dallas Punk',
        city: 'Dallas',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
      homeSceneId: 'scene-1',
      isVisitor: true,
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/discover/context',
      headers: {
        authorization: 'Bearer test-token',
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.tunedSceneId).toBe('scene-2');
    expect(communitiesServiceMock.getDiscoveryContext).toHaveBeenCalledWith('user-1');
  });

  it('delegates POST /discover/tune for explicit scene tune action', async () => {
    communitiesServiceMock.tuneScene.mockResolvedValue({
      tunedSceneId: 'scene-2',
      tunedScene: {
        id: 'scene-2',
        name: 'Dallas Punk',
        city: 'Dallas',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
      homeSceneId: 'scene-1',
      isVisitor: true,
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'POST',
      url: '/discover/tune',
      headers: {
        authorization: 'Bearer test-token',
      },
      payload: { sceneId: 'scene-2' },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.tunedSceneId).toBe('scene-2');
    expect(communitiesServiceMock.tuneScene).toHaveBeenCalledWith('user-1', {
      sceneId: 'scene-2',
    });
  });

  it('returns 400 on invalid tune request body', async () => {
    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'POST',
      url: '/discover/tune',
      headers: {
        authorization: 'Bearer test-token',
      },
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(communitiesServiceMock.tuneScene).not.toHaveBeenCalled();
  });

  it('delegates POST /discover/set-home-scene and returns transition result', async () => {
    communitiesServiceMock.setHomeScene.mockResolvedValue({
      previousHomeSceneId: 'scene-1',
      homeSceneId: 'scene-2',
      tunedSceneId: 'scene-2',
      tunedScene: {
        id: 'scene-2',
        name: 'Dallas Punk',
        city: 'Dallas',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
      isVisitor: false,
      homeScene: {
        id: 'scene-2',
        name: 'Dallas Punk',
        city: 'Dallas',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
      changed: true,
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'POST',
      url: '/discover/set-home-scene',
      headers: {
        authorization: 'Bearer test-token',
      },
      payload: { sceneId: 'scene-2' },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.homeSceneId).toBe('scene-2');
    expect(communitiesServiceMock.setHomeScene).toHaveBeenCalledWith('user-1', {
      sceneId: 'scene-2',
    });
  });

  it('returns 400 on invalid set-home-scene request body', async () => {
    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'POST',
      url: '/discover/set-home-scene',
      headers: {
        authorization: 'Bearer test-token',
      },
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(communitiesServiceMock.setHomeScene).not.toHaveBeenCalled();
  });

  it('delegates POST /discover/save-uprise and returns saved-uprise metadata', async () => {
    communitiesServiceMock.saveDiscoverUprise.mockResolvedValue({
      scene: {
        id: 'scene-2',
        name: 'Dallas Punk',
        city: 'Dallas',
        state: 'TX',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
      signalId: 'signal-1',
      collectionId: 'collection-1',
      collectionItemId: 'item-1',
      actionId: 'action-1',
      shelf: 'uprises',
    });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'POST',
      url: '/discover/save-uprise',
      headers: {
        authorization: 'Bearer test-token',
      },
      payload: { sceneId: 'scene-2' },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.shelf).toBe('uprises');
    expect(communitiesServiceMock.saveDiscoverUprise).toHaveBeenCalledWith('user-1', {
      sceneId: 'scene-2',
    });
  });
});
