import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { ArtistBandsController } from '../src/artist-bands/artist-bands.controller';
import { ArtistBandsService } from '../src/artist-bands/artist-bands.service';

class MockJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = { userId: 'user-1' };
    return true;
  }
}

describe('ArtistBandsController', () => {
  let app: INestApplication;

  const artistBandsServiceMock = {
    findProfile: jest.fn(),
    findOne: jest.fn(),
    addArtistBand: jest.fn(),
    supportArtistBand: jest.fn(),
    findByUserId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ArtistBandsController],
      providers: [
        {
          provide: ArtistBandsService,
          useValue: artistBandsServiceMock,
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

  it('delegates GET /artist-bands/:id/profile', async () => {
    artistBandsServiceMock.findProfile.mockResolvedValue({ id: 'artist-1', name: 'Signal Static' });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'GET',
      url: '/artist-bands/artist-1/profile',
      headers: { authorization: 'Bearer test-token' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      success: true,
      data: { id: 'artist-1', name: 'Signal Static' },
    });
    expect(artistBandsServiceMock.findProfile).toHaveBeenCalledWith('artist-1');
  });

  it('delegates POST /artist-bands/:id/support with the signed-in user id', async () => {
    artistBandsServiceMock.supportArtistBand.mockResolvedValue({ signalId: 'signal-1', action: { id: 'support-1' } });

    const response = await (app.getHttpAdapter().getInstance() as any).inject({
      method: 'POST',
      url: '/artist-bands/artist-1/support',
      headers: { authorization: 'Bearer test-token' },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      success: true,
      data: { signalId: 'signal-1', action: { id: 'support-1' } },
    });
    expect(artistBandsServiceMock.supportArtistBand).toHaveBeenCalledWith('user-1', 'artist-1');
  });
});
