import { BadRequestException } from '@nestjs/common';
import { ReleaseDeckController } from '../src/release-deck/release-deck.controller';
import { ReleaseDeckMeasurementQuerySchema } from '../src/release-deck/dto/release-deck-measurement.dto';
import { ReleaseDeckScheduleAvailabilityQuerySchema } from '../src/release-deck/dto/release-deck-schedule.dto';

describe('ReleaseDeckController', () => {
  it('delegates measurement to the service and passes the response through', async () => {
    const measurement = {
      success: true as const,
      data: { community: { id: 'community-1' }, totals: { cappedPlayableSeconds: 900 } },
    };
    const releaseDeckMeasurementService = {
      measureCommunityDeck: jest.fn().mockResolvedValue(measurement),
    } as any;
    const releaseDeckSchedulingService = { getAvailability: jest.fn() } as any;

    const controller = new ReleaseDeckController(
      releaseDeckMeasurementService,
      releaseDeckSchedulingService
    );
    const result = await controller.getMeasurement({ communityId: 'community-1' });

    expect(releaseDeckMeasurementService.measureCommunityDeck).toHaveBeenCalledWith('community-1');
    expect(result).toBe(measurement);
  });

  it('propagates service errors instead of swallowing them', async () => {
    const releaseDeckMeasurementService = {
      measureCommunityDeck: jest.fn().mockRejectedValue(new BadRequestException('nope')),
    } as any;
    const releaseDeckSchedulingService = { getAvailability: jest.fn() } as any;

    const controller = new ReleaseDeckController(
      releaseDeckMeasurementService,
      releaseDeckSchedulingService
    );

    await expect(controller.getMeasurement({ communityId: 'state-scene' })).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('delegates schedule availability to the scheduling service and passes the response through', async () => {
    const availability = {
      success: true as const,
      data: { soonestValidDate: '2026-07-08', alternatives: ['2026-07-08'] },
    };
    const releaseDeckMeasurementService = { measureCommunityDeck: jest.fn() } as any;
    const releaseDeckSchedulingService = {
      getAvailability: jest.fn().mockResolvedValue(availability),
    } as any;

    const controller = new ReleaseDeckController(
      releaseDeckMeasurementService,
      releaseDeckSchedulingService
    );
    const query = {
      communityId: 'community-1',
      trackId: 'track-1',
      from: '2026-07-08',
      days: 30,
    };
    const result = await controller.getScheduleAvailability(query);

    expect(releaseDeckSchedulingService.getAvailability).toHaveBeenCalledWith(query);
    expect(result).toBe(availability);
  });

  it('exposes only read handlers on the Slice 2 controller', () => {
    const handlers = Object.getOwnPropertyNames(ReleaseDeckController.prototype).filter(
      (name) => name !== 'constructor'
    );

    expect(handlers).toEqual(['getMeasurement', 'getScheduleAvailability']);
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

describe('ReleaseDeckScheduleAvailabilityQuerySchema', () => {
  it('requires communityId, trackId, and a valid from date', () => {
    expect(ReleaseDeckScheduleAvailabilityQuerySchema.safeParse({}).success).toBe(false);
    expect(
      ReleaseDeckScheduleAvailabilityQuerySchema.safeParse({
        communityId: 'community-1',
        trackId: '',
        from: '2026-07-08',
      }).success
    ).toBe(false);
    expect(
      ReleaseDeckScheduleAvailabilityQuerySchema.safeParse({
        communityId: 'community-1',
        trackId: 'track-1',
        from: 'not-a-date',
      }).success
    ).toBe(false);
  });

  it('trims IDs and defaults days to 30', () => {
    const parsed = ReleaseDeckScheduleAvailabilityQuerySchema.parse({
      communityId: ' community-1 ',
      trackId: ' track-1 ',
      from: '2026-07-08',
    });

    expect(parsed).toEqual({
      communityId: 'community-1',
      trackId: 'track-1',
      from: '2026-07-08',
      days: 30,
    });
  });

  it('caps explicit lookahead to the Slice 2 policy maximum', () => {
    expect(
      ReleaseDeckScheduleAvailabilityQuerySchema.safeParse({
        communityId: 'community-1',
        trackId: 'track-1',
        from: '2026-07-08',
        days: 31,
      }).success
    ).toBe(false);
  });
});
