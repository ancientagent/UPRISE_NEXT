import { BadRequestException } from '@nestjs/common';
import { CommunitiesController } from '../src/communities/communities.controller';

describe('CommunitiesController - Metrics and Home Resolution', () => {
  let controller: CommunitiesController;

  const communitiesServiceMock = {
    getStatistics: jest.fn(),
    getSceneMap: jest.fn(),
    resolveHomeCommunity: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CommunitiesController(communitiesServiceMock as any);
  });

  it('delegates statistics read with tier scope', async () => {
    communitiesServiceMock.getStatistics.mockResolvedValue({
      community: { id: 'scene-1' },
      tierScope: 'state',
      rollupUnit: 'city',
    });

    const response = await controller.getStatistics('scene-1', { tier: 'state' });

    expect(communitiesServiceMock.getStatistics).toHaveBeenCalledWith(
      'scene-1',
      expect.objectContaining({ tier: 'state' }),
    );
    expect(response).toEqual({
      success: true,
      data: {
        community: { id: 'scene-1' },
        tierScope: 'state',
        rollupUnit: 'city',
      },
    });
  });

  it('delegates scene-map read with tier scope', async () => {
    communitiesServiceMock.getSceneMap.mockResolvedValue({
      community: { id: 'scene-2' },
      tierScope: 'national',
      rollupUnit: 'state',
      points: [],
    });

    const response = await controller.getSceneMap('scene-2', { tier: 'national' });

    expect(communitiesServiceMock.getSceneMap).toHaveBeenCalledWith(
      'scene-2',
      expect.objectContaining({ tier: 'national' }),
    );
    expect(response).toEqual({
      success: true,
      data: {
        community: { id: 'scene-2' },
        tierScope: 'national',
        rollupUnit: 'state',
        points: [],
      },
    });
  });

  it('returns bad request for invalid tier query in statistics route', async () => {
    await expect(controller.getStatistics('scene-3', { tier: 'planet' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(communitiesServiceMock.getStatistics).not.toHaveBeenCalled();
  });

  it('returns bad request for invalid tier query in scene-map route', async () => {
    await expect(controller.getSceneMap('scene-4', { tier: 'planet' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(communitiesServiceMock.getSceneMap).not.toHaveBeenCalled();
  });

  it('delegates home-scene resolution with required tuple', async () => {
    communitiesServiceMock.resolveHomeCommunity.mockResolvedValue({
      id: 'scene-home-1',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Indie',
    });

    const response = await controller.resolveHome({
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Indie',
    });

    expect(communitiesServiceMock.resolveHomeCommunity).toHaveBeenCalledWith({
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Indie',
    });
    expect(response).toEqual({
      success: true,
      data: {
        id: 'scene-home-1',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Indie',
      },
    });
  });

  it('returns bad request when home-scene tuple is incomplete', async () => {
    await expect(controller.resolveHome({ city: 'Austin', state: '', musicCommunity: 'Indie' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(communitiesServiceMock.resolveHomeCommunity).not.toHaveBeenCalled();
  });
});
