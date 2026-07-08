import { BadRequestException } from '@nestjs/common';
import { ReleaseDeckController } from '../src/release-deck/release-deck.controller';
import { ReleaseDeckMeasurementQuerySchema } from '../src/release-deck/dto/release-deck-measurement.dto';

describe('ReleaseDeckController', () => {
  it('delegates measurement to the service and passes the response through', async () => {
    const measurement = {
      success: true as const,
      data: { community: { id: 'community-1' }, totals: { cappedPlayableSeconds: 900 } },
    };
    const releaseDeckMeasurementService = {
      measureCommunityDeck: jest.fn().mockResolvedValue(measurement),
    } as any;

    const controller = new ReleaseDeckController(releaseDeckMeasurementService);
    const result = await controller.getMeasurement({ communityId: 'community-1' });

    expect(releaseDeckMeasurementService.measureCommunityDeck).toHaveBeenCalledWith('community-1');
    expect(result).toBe(measurement);
  });

  it('propagates service errors instead of swallowing them', async () => {
    const releaseDeckMeasurementService = {
      measureCommunityDeck: jest.fn().mockRejectedValue(new BadRequestException('nope')),
    } as any;

    const controller = new ReleaseDeckController(releaseDeckMeasurementService);

    await expect(controller.getMeasurement({ communityId: 'state-scene' })).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('exposes no mutating handlers on the Slice 1 controller', () => {
    const handlers = Object.getOwnPropertyNames(ReleaseDeckController.prototype).filter(
      (name) => name !== 'constructor'
    );

    expect(handlers).toEqual(['getMeasurement']);
  });
});

describe('ReleaseDeckMeasurementQuerySchema', () => {
  it('requires a non-empty communityId', () => {
    expect(ReleaseDeckMeasurementQuerySchema.safeParse({}).success).toBe(false);
    expect(ReleaseDeckMeasurementQuerySchema.safeParse({ communityId: '' }).success).toBe(false);
    expect(ReleaseDeckMeasurementQuerySchema.safeParse({ communityId: '   ' }).success).toBe(false);
  });

  it('trims a valid communityId', () => {
    const parsed = ReleaseDeckMeasurementQuerySchema.parse({ communityId: '  community-1  ' });
    expect(parsed).toEqual({ communityId: 'community-1' });
  });
});
