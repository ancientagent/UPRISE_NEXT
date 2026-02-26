import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DiscoveryController } from '../src/communities/discovery.controller';
import { CommunitiesService } from '../src/communities/communities.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

class MockJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = { userId: 'user-1' };
    return true;
  }
}

describe('DiscoveryController', () => {
  let app: INestApplication;

  const communitiesServiceMock = {
    discoverScenes: jest.fn(),
    tuneScene: jest.fn(),
    getDiscoveryContext: jest.fn(),
    setHomeScene: jest.fn(),
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
});
