import { AdminAnalyticsController } from '../src/admin-analytics/admin-analytics.controller';

describe('AdminAnalyticsController', () => {
  it('delegates activation readiness diagnostics to admin analytics service', async () => {
    const service = {
      queryAnalytics: jest.fn(),
      getActivationReadinessDiagnostics: jest.fn().mockResolvedValue({
        success: true,
        data: {
          thresholds: {
            requiredPlayableSeconds: 2700,
            requiredPlayableMinutes: 45,
            requiredDistinctSources: 5,
            maxPlayableSecondsPerSource: 1200,
            maxPlayableMinutesPerSource: 20,
          },
          candidates: [],
        },
      }),
    };
    const controller = new AdminAnalyticsController(service as any);

    const result = await controller.getActivationReadinessDiagnostics();

    expect(service.getActivationReadinessDiagnostics).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.data.candidates).toEqual([]);
  });

  it('delegates manual activation trigger requests to admin analytics service', async () => {
    const service = {
      queryAnalytics: jest.fn(),
      getActivationReadinessDiagnostics: jest.fn(),
      activateReadyCommunity: jest.fn().mockResolvedValue({
        success: true,
        data: {
          sceneId: 'scene-el-paso-punk',
          city: 'El Paso',
          state: 'Texas',
          musicCommunity: 'Punk',
          created: true,
          activated: true,
          reanchoredSourceCount: 5,
        },
      }),
    };
    const controller = new AdminAnalyticsController(service as any);

    const result = await controller.activateReadyCommunity({
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
    });

    expect(service.activateReadyCommunity).toHaveBeenCalledWith({
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
    });
    expect(result.data.sceneId).toBe('scene-el-paso-punk');
    expect(result.data.activated).toBe(true);
  });
});
