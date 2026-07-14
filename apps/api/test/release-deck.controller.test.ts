import { BadRequestException } from '@nestjs/common';
import { ReleaseDeckController } from '../src/release-deck/release-deck.controller';
import { ReleaseDeckMeasurementQuerySchema } from '../src/release-deck/dto/release-deck-measurement.dto';
import {
  ReleaseDeckScheduleAvailabilityQuerySchema,
  ReleaseDeckScheduleCreateSchema,
} from '../src/release-deck/dto/release-deck-schedule.dto';

describe('ReleaseDeckController', () => {
  it('delegates measurement to the service and passes the response through', async () => {
    const measurement = {
      success: true as const,
      data: { community: { id: 'community-1' }, totals: { cappedPlayableSeconds: 900 } },
    };
    const releaseDeckMeasurementService = {
      measureCommunityDeck: jest.fn().mockResolvedValue(measurement),
    } as any;
    const releaseDeckSchedulingService = {
      getAvailability: jest.fn(),
      scheduleTrack: jest.fn(),
    } as any;

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
    const releaseDeckSchedulingService = {
      getAvailability: jest.fn(),
      scheduleTrack: jest.fn(),
    } as any;

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
    const result = await controller.getScheduleAvailability(query, { user: { userId: 'user-1' } });

    expect(releaseDeckSchedulingService.getAvailability).toHaveBeenCalledWith(query, 'user-1');
    expect(result).toBe(availability);
  });

  it('delegates schedule creation to the scheduling service with the authenticated user', async () => {
    const scheduled = {
      success: true as const,
      data: { id: 'schedule-1', trackId: 'track-1', scheduledFor: new Date('2026-07-08') },
    };
    const releaseDeckMeasurementService = { measureCommunityDeck: jest.fn() } as any;
    const releaseDeckSchedulingService = {
      getAvailability: jest.fn(),
      scheduleTrack: jest.fn().mockResolvedValue(scheduled),
    } as any;
    const controller = new ReleaseDeckController(
      releaseDeckMeasurementService,
      releaseDeckSchedulingService
    );
    const dto = {
      communityId: 'community-1',
      trackId: 'track-1',
      mode: 'chosen' as const,
      requestedDate: '2026-07-08',
    };

    const result = await controller.scheduleTrack(dto, { user: { userId: 'user-1' } });

    expect(releaseDeckSchedulingService.scheduleTrack).toHaveBeenCalledWith('user-1', dto);
    expect(result).toBe(scheduled);
  });

  it('exposes Slice 3 schedule write handler without adding Fair Play ingestion handlers', () => {
    const handlers = Object.getOwnPropertyNames(ReleaseDeckController.prototype).filter(
      (name) => name !== 'constructor'
    );

    expect(handlers).toEqual(['getMeasurement', 'getScheduleAvailability', 'scheduleTrack']);
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

describe('ReleaseDeckScheduleCreateSchema', () => {
  it('requires chosen mode to include a requestedDate', () => {
    expect(
      ReleaseDeckScheduleCreateSchema.safeParse({
        communityId: 'community-1',
        trackId: 'track-1',
        mode: 'chosen',
      }).success
    ).toBe(false);
  });

  it('allows soonest mode without requestedDate and trims IDs', () => {
    const parsed = ReleaseDeckScheduleCreateSchema.parse({
      communityId: ' community-1 ',
      trackId: ' track-1 ',
      mode: 'soonest',
    });

    expect(parsed).toEqual({
      communityId: 'community-1',
      trackId: 'track-1',
      mode: 'soonest',
    });
  });
});
