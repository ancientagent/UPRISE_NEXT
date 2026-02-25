import { BadRequestException } from '@nestjs/common';
import { CommunitiesController } from '../src/communities/communities.controller';

describe('CommunitiesController - Active Scene Endpoints', () => {
  let controller: CommunitiesController;

  const communitiesServiceMock = {
    resolveActiveSceneId: jest.fn(),
    getFeed: jest.fn(),
    getStatistics: jest.fn(),
    getEvents: jest.fn(),
    getPromotions: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CommunitiesController(communitiesServiceMock as any);
  });

  it('delegates active feed read through resolved active scene id', async () => {
    communitiesServiceMock.resolveActiveSceneId.mockResolvedValue('scene-1');
    communitiesServiceMock.getFeed.mockResolvedValue({
      items: [{ id: 'feed-1' }],
      limit: 25,
      nextCursor: null,
    });

    const response = await controller.getActiveFeed(
      { user: { userId: 'user-1' } } as any,
      { limit: '25' },
    );

    expect(communitiesServiceMock.resolveActiveSceneId).toHaveBeenCalledWith('user-1');
    expect(communitiesServiceMock.getFeed).toHaveBeenCalledWith(
      'scene-1',
      expect.objectContaining({ limit: 25 }),
    );
    expect(response).toEqual({
      success: true,
      data: [{ id: 'feed-1' }],
      meta: {
        sceneId: 'scene-1',
        limit: 25,
        nextCursor: null,
      },
    });
  });

  it('delegates active statistics read through resolved active scene id', async () => {
    communitiesServiceMock.resolveActiveSceneId.mockResolvedValue('scene-2');
    communitiesServiceMock.getStatistics.mockResolvedValue({
      community: { id: 'scene-2' },
      tierScope: 'city',
    });

    const response = await controller.getActiveStatistics(
      { user: { userId: 'user-2' } } as any,
      { tier: 'state' },
    );

    expect(communitiesServiceMock.resolveActiveSceneId).toHaveBeenCalledWith('user-2');
    expect(communitiesServiceMock.getStatistics).toHaveBeenCalledWith(
      'scene-2',
      expect.objectContaining({ tier: 'state' }),
    );
    expect(response).toEqual({
      success: true,
      data: {
        community: { id: 'scene-2' },
        tierScope: 'city',
      },
      meta: { sceneId: 'scene-2' },
    });
  });

  it('delegates active events read through resolved active scene id', async () => {
    communitiesServiceMock.resolveActiveSceneId.mockResolvedValue('scene-3');
    communitiesServiceMock.getEvents.mockResolvedValue({
      items: [{ id: 'event-1' }],
      limit: 10,
      includePast: true,
    });

    const response = await controller.getActiveEvents(
      { user: { userId: 'user-3' } } as any,
      { limit: '10', includePast: 'true' },
    );

    expect(communitiesServiceMock.resolveActiveSceneId).toHaveBeenCalledWith('user-3');
    expect(communitiesServiceMock.getEvents).toHaveBeenCalledWith(
      'scene-3',
      expect.objectContaining({ limit: 10, includePast: true }),
    );
    expect(response).toEqual({
      success: true,
      data: [{ id: 'event-1' }],
      meta: {
        sceneId: 'scene-3',
        limit: 10,
        includePast: true,
      },
    });
  });

  it('parses includePast=false as false for active events query', async () => {
    communitiesServiceMock.resolveActiveSceneId.mockResolvedValue('scene-3b');
    communitiesServiceMock.getEvents.mockResolvedValue({
      items: [],
      limit: 15,
      includePast: false,
    });

    const response = await controller.getActiveEvents(
      { user: { userId: 'user-3b' } } as any,
      { limit: '15', includePast: 'false' },
    );

    expect(communitiesServiceMock.getEvents).toHaveBeenCalledWith(
      'scene-3b',
      expect.objectContaining({ limit: 15, includePast: false }),
    );
    expect(response.meta).toEqual({
      sceneId: 'scene-3b',
      limit: 15,
      includePast: false,
    });
  });

  it('delegates active promotions read through resolved active scene id', async () => {
    communitiesServiceMock.resolveActiveSceneId.mockResolvedValue('scene-4');
    communitiesServiceMock.getPromotions.mockResolvedValue({
      items: [{ id: 'promo-1' }],
      limit: 12,
    });

    const response = await controller.getActivePromotions(
      { user: { userId: 'user-4' } } as any,
      { limit: '12' },
    );

    expect(communitiesServiceMock.resolveActiveSceneId).toHaveBeenCalledWith('user-4');
    expect(communitiesServiceMock.getPromotions).toHaveBeenCalledWith(
      'scene-4',
      expect.objectContaining({ limit: 12 }),
    );
    expect(response).toEqual({
      success: true,
      data: [{ id: 'promo-1' }],
      meta: {
        sceneId: 'scene-4',
        limit: 12,
      },
    });
  });

  it('returns bad request for invalid active feed query', async () => {
    await expect(
      controller.getActiveFeed({ user: { userId: 'user-5' } } as any, { limit: '0' }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(communitiesServiceMock.resolveActiveSceneId).not.toHaveBeenCalled();
    expect(communitiesServiceMock.getFeed).not.toHaveBeenCalled();
  });

  it('returns bad request for invalid includePast query', async () => {
    await expect(
      controller.getActiveEvents(
        { user: { userId: 'user-6' } } as any,
        { limit: '20', includePast: 'not-boolean' },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(communitiesServiceMock.resolveActiveSceneId).not.toHaveBeenCalled();
    expect(communitiesServiceMock.getEvents).not.toHaveBeenCalled();
  });

  it('parses includePast=false as false for direct scene events query', async () => {
    communitiesServiceMock.getEvents.mockResolvedValue({
      items: [{ id: 'event-direct-1' }],
      limit: 20,
      includePast: false,
    });

    const response = await controller.getEvents('scene-direct-1', {
      limit: '20',
      includePast: 'false',
    });

    expect(communitiesServiceMock.getEvents).toHaveBeenCalledWith(
      'scene-direct-1',
      expect.objectContaining({ limit: 20, includePast: false }),
    );
    expect(response.meta).toEqual({
      limit: 20,
      includePast: false,
    });
  });

  it('returns bad request for invalid includePast in direct scene events query', async () => {
    await expect(
      controller.getEvents('scene-direct-2', {
        limit: '20',
        includePast: 'not-boolean',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(communitiesServiceMock.getEvents).not.toHaveBeenCalled();
  });
});
