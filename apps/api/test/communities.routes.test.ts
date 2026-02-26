import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { CommunitiesController } from '../src/communities/communities.controller';
import { CommunitiesService } from '../src/communities/communities.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

describe('Communities Route Resolution', () => {
  let app: INestApplication;

  const communitiesServiceMock = {
    findMany: jest.fn(),
    resolveHomeCommunity: jest.fn(),
    resolveActiveSceneId: jest.fn(),
    getFeed: jest.fn(),
    getStatistics: jest.fn(),
    getSceneMap: jest.fn(),
    getEvents: jest.fn(),
    getPromotions: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findNearby: jest.fn(),
    verifyLocation: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CommunitiesController],
      providers: [
        {
          provide: CommunitiesService,
          useValue: communitiesServiceMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();
    await (app.getHttpAdapter().getInstance() as any).ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('routes GET /communities/nearby to findNearby handler (not :id handler)', async () => {
    communitiesServiceMock.findNearby.mockResolvedValue([
      {
        id: 'community-1',
        name: 'Nearby Community',
        slug: 'nearby-community',
        description: 'Near route resolution test',
        coverImage: null,
        avatar: null,
        isPrivate: false,
        memberCount: 5,
        distance: 1234,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/communities/nearby?lat=37.7749&lng=-122.4194&radius=5000&limit=20',
      headers: {
        authorization: 'Bearer test-token',
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.success).toBe(true);
    expect(Array.isArray(payload.data)).toBe(true);
    expect(communitiesServiceMock.findNearby).toHaveBeenCalledTimes(1);
    expect(communitiesServiceMock.findById).not.toHaveBeenCalled();
  });
});
