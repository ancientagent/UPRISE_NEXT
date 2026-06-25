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
});
