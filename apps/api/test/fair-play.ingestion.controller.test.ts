import { FairPlayIngestionController } from '../src/fair-play/fair-play-ingestion.controller';
import { FairPlayIngestionRequestSchema } from '../src/fair-play/dto/fair-play-ingestion.dto';

describe('FairPlayIngestionController', () => {
  it('delegates scheduled ingestion requests to the ingestion service', async () => {
    const service = {
      ingestDueSchedules: jest.fn().mockResolvedValue({ success: true, data: { ingestedCount: 1 } }),
    };
    const controller = new FairPlayIngestionController(service as any);

    await expect(
      controller.ingestDueSchedules({ communityId: 'community-1', asOf: '2026-07-08', dryRun: false })
    ).resolves.toEqual({ success: true, data: { ingestedCount: 1 } });

    expect(service.ingestDueSchedules).toHaveBeenCalledWith({
      communityId: 'community-1',
      asOf: '2026-07-08',
      dryRun: false,
    });
  });

  it('validates the ingestion request contract', () => {
    expect(
      FairPlayIngestionRequestSchema.parse({ communityId: 'community-1', asOf: '2026-07-08' })
    ).toEqual({ communityId: 'community-1', asOf: '2026-07-08', dryRun: true });
    expect(() => FairPlayIngestionRequestSchema.parse({ communityId: '', asOf: '07/08/2026' })).toThrow();
  });
});
