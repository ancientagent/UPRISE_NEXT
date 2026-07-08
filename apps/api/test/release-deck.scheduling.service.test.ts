import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReleaseDeckSchedulingService } from '../src/release-deck/release-deck-scheduling.service';

const CITY_COMMUNITY = {
  id: 'community-austin-punk',
  name: 'Austin Punk',
  city: 'Austin',
  state: 'Texas',
  musicCommunity: 'Punk',
  tier: 'city',
  isActive: true,
};

const REQUESTED_FROM = '2026-07-08';
const TRACK = {
  id: 'track-candidate',
  title: 'Candidate Single',
  duration: 300,
  status: 'ready',
  communityId: CITY_COMMUNITY.id,
  artistBandId: 'source-a',
  fileUrl: 'https://cdn.example.test/candidate.mp3',
  artistBand: {
    id: 'source-a',
    name: 'Source A',
    homeSceneId: CITY_COMMUNITY.id,
  },
};

function createPrismaMock() {
  return {
    community: {
      findUnique: jest.fn().mockResolvedValue(CITY_COMMUNITY),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    track: {
      findUnique: jest.fn().mockResolvedValue(TRACK),
      findMany: jest
        .fn()
        .mockResolvedValue([{ id: TRACK.id, duration: TRACK.duration, status: 'ready' }]),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    releaseDeckSchedule: {
      findFirst: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation(({ data }) =>
        Promise.resolve({
          id: 'schedule-created',
          trackId: data.trackId,
          communityId: data.communityId,
          artistBandId: data.artistBandId,
          scheduledFor: data.scheduledFor,
          assignmentMode: data.assignmentMode,
          requestedFor: data.requestedFor,
          status: data.status,
          capacitySnapshot: data.capacitySnapshot,
          createdById: data.createdById,
        })
      ),
      update: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    rotationEntry: {
      findFirst: jest.fn().mockResolvedValue(null),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    artistBand: {
      update: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
    },
    registrarEntry: { create: jest.fn(), update: jest.fn() },
    fairPlayConfig: { findUnique: jest.fn(), findFirst: jest.fn() },
    sectTag: { findMany: jest.fn(), findFirst: jest.fn(), upsert: jest.fn() },
    userTag: { findMany: jest.fn(), findFirst: jest.fn(), upsert: jest.fn() },
    $transaction: jest.fn(),
    $executeRaw: jest.fn(),
  };
}

function scheduled(
  id: string,
  scheduledFor: string,
  duration: number,
  overrides: Partial<Record<string, unknown>> = {}
) {
  return {
    id,
    trackId: `${id}-track`,
    communityId: CITY_COMMUNITY.id,
    artistBandId: `${id}-source`,
    scheduledFor: new Date(`${scheduledFor}T00:00:00.000Z`),
    status: 'scheduled',
    track: { id: `${id}-track`, duration },
    ...overrides,
  };
}

function mutatingCalls(prisma: any): string[] {
  const writeMethods = [
    'create',
    'update',
    'updateMany',
    'upsert',
    'delete',
    '$executeRaw',
    '$transaction',
  ];
  const called: string[] = [];
  for (const [modelName, model] of Object.entries(prisma)) {
    if (typeof model === 'function') {
      if (writeMethods.includes(modelName) && (model as jest.Mock).mock.calls.length > 0)
        called.push(modelName);
      continue;
    }
    for (const [methodName, method] of Object.entries(model as Record<string, unknown>)) {
      if (writeMethods.includes(methodName) && (method as jest.Mock).mock.calls.length > 0) {
        called.push(`${modelName}.${methodName}`);
      }
    }
  }
  return called;
}

describe('ReleaseDeckSchedulingService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: ReleaseDeckSchedulingService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = createPrismaMock();
    service = new ReleaseDeckSchedulingService(prisma as any);
  });

  function mockOperatorTrack(overrides: Partial<Record<string, any>> = {}) {
    prisma.track.findUnique.mockResolvedValueOnce({
      id: TRACK.id,
      artistBandId: 'source-a',
      communityId: CITY_COMMUNITY.id,
      artistBand: {
        id: 'source-a',
        homeSceneId: CITY_COMMUNITY.id,
        createdById: 'user-1',
        members: [],
      },
      ...overrides,
    });
    prisma.track.findUnique.mockResolvedValueOnce(TRACK);
  }

  it('returns soonest availability and proves capacity uses playable seconds, not raw song count', async () => {
    prisma.releaseDeckSchedule.findMany.mockResolvedValue([
      scheduled('short-1', REQUESTED_FROM, 60),
      scheduled('short-2', REQUESTED_FROM, 60),
      scheduled('short-3', REQUESTED_FROM, 60),
      scheduled('short-4', REQUESTED_FROM, 60),
    ]);

    const result = await service.getAvailability({
      communityId: CITY_COMMUNITY.id,
      trackId: TRACK.id,
      from: REQUESTED_FROM,
      days: 3,
    });

    expect(result.success).toBe(true);
    expect(result.data.soonestValidDate).toBe('2026-07-08');
    expect(result.data.alternatives).toEqual(['2026-07-08', '2026-07-09', '2026-07-10']);
    expect(result.data.capacityInputs).toMatchObject({
      trackPlayableSeconds: 300,
      dailyIntakePlayableSeconds: 900,
      protectedPoolPlayableSeconds: 2700,
      newReleaseWindowDays: 10,
      lookaheadDays: 3,
    });
    expect(result.data.diagnostics[0]).toMatchObject({
      date: '2026-07-08',
      valid: true,
      reasons: [],
      dailyScheduledPlayableSeconds: 240,
      dailyRequestedPlayableSeconds: 540,
    });
  });

  it('fails closed for an over-capacity requested date while returning the next valid alternative', async () => {
    prisma.releaseDeckSchedule.findMany.mockResolvedValue([
      scheduled('full-1', REQUESTED_FROM, 360),
      scheduled('full-2', REQUESTED_FROM, 360),
    ]);

    const result = await service.getAvailability({
      communityId: CITY_COMMUNITY.id,
      trackId: TRACK.id,
      from: REQUESTED_FROM,
      days: 2,
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchObject({
      code: 'DATE_CAPACITY_FULL',
      requestedDate: '2026-07-08',
      soonestValidDate: '2026-07-09',
      alternatives: ['2026-07-09'],
      capacityInputs: {
        trackPlayableSeconds: 300,
        dailyIntakePlayableSeconds: 900,
        protectedPoolPlayableSeconds: 2700,
        newReleaseWindowDays: 10,
      },
    });
    expect(result.error.diagnostics).toEqual([
      expect.objectContaining({
        date: '2026-07-08',
        valid: false,
        reasons: ['DATE_DAILY_CAPACITY_FULL'],
        dailyScheduledPlayableSeconds: 720,
        dailyRequestedPlayableSeconds: 1020,
      }),
      expect.objectContaining({
        date: '2026-07-09',
        valid: true,
        reasons: [],
      }),
    ]);
  });

  it('fails closed when the protected 10-day New Releases window has no valid date in lookahead', async () => {
    prisma.releaseDeckSchedule.findMany.mockResolvedValue([
      scheduled('protected-1', '2026-07-01', 360),
      scheduled('protected-2', '2026-07-02', 360),
      scheduled('protected-3', '2026-07-03', 360),
      scheduled('protected-4', '2026-07-04', 360),
      scheduled('protected-5', '2026-07-05', 360),
      scheduled('protected-6', '2026-07-06', 360),
      scheduled('protected-7', '2026-07-07', 360),
    ]);

    const result = await service.getAvailability({
      communityId: CITY_COMMUNITY.id,
      trackId: TRACK.id,
      from: REQUESTED_FROM,
      days: 2,
    });

    expect(result).toMatchObject({
      success: false,
      error: {
        code: 'NO_VALID_DATE_IN_LOOKAHEAD',
        soonestValidDate: null,
        alternatives: [],
      },
    });
    expect(result.error.diagnostics).toEqual([
      expect.objectContaining({
        date: '2026-07-08',
        valid: false,
        reasons: ['PROTECTED_WINDOW_CAPACITY_FULL'],
        protectedWindowRequestedPlayableSeconds: 2820,
      }),
      expect.objectContaining({
        date: '2026-07-09',
        valid: false,
        reasons: ['PROTECTED_WINDOW_CAPACITY_FULL'],
      }),
    ]);
  });

  it('reports an already scheduled track before scanning capacity', async () => {
    prisma.releaseDeckSchedule.findFirst.mockResolvedValue({
      id: 'schedule-existing',
      status: 'scheduled',
      scheduledFor: new Date('2026-07-09T00:00:00.000Z'),
    });

    const result = await service.getAvailability({
      communityId: CITY_COMMUNITY.id,
      trackId: TRACK.id,
      from: REQUESTED_FROM,
      days: 3,
    });

    expect(result).toEqual({
      success: false,
      error: {
        code: 'ALREADY_SCHEDULED_OR_ACTIVE',
        message: 'Track is already scheduled or active in RADIYO',
        trackId: TRACK.id,
        diagnostics: [],
        capacityInputs: null,
      },
    });
    expect(prisma.releaseDeckSchedule.findMany).not.toHaveBeenCalled();
  });

  it('rejects ineligible tracks before capacity scanning', async () => {
    prisma.track.findUnique.mockResolvedValue({
      ...TRACK,
      id: 'wrong-community-track',
      communityId: 'community-dallas-punk',
    });

    const result = await service.getAvailability({
      communityId: CITY_COMMUNITY.id,
      trackId: 'wrong-community-track',
      from: REQUESTED_FROM,
      days: 3,
    });

    expect(result).toEqual({
      success: false,
      error: {
        code: 'TRACK_NOT_ELIGIBLE',
        reason: 'WRONG_COMMUNITY',
        message: 'Track is not eligible for Release Deck scheduling',
        trackId: 'wrong-community-track',
        diagnostics: [],
        capacityInputs: null,
      },
    });
    expect(prisma.releaseDeckSchedule.findMany).not.toHaveBeenCalled();
  });

  it('requires an explicit hosted http(s) playable URL before capacity scanning', async () => {
    prisma.track.findUnique.mockResolvedValueOnce({
      ...TRACK,
      id: 'missing-url-track',
      fileUrl: '',
    });

    const missingUrl = await service.getAvailability({
      communityId: CITY_COMMUNITY.id,
      trackId: 'missing-url-track',
      from: REQUESTED_FROM,
      days: 3,
    });

    expect(missingUrl).toEqual({
      success: false,
      error: {
        code: 'TRACK_NOT_ELIGIBLE',
        reason: 'MISSING_PLAYABLE_URL',
        message: 'Track is not eligible for Release Deck scheduling',
        trackId: 'missing-url-track',
        diagnostics: [],
        capacityInputs: null,
      },
    });

    prisma.track.findUnique.mockResolvedValueOnce({
      ...TRACK,
      id: 'invalid-url-track',
      fileUrl: 'ftp://cdn.example.test/candidate.mp3',
    });

    const invalidUrl = await service.getAvailability({
      communityId: CITY_COMMUNITY.id,
      trackId: 'invalid-url-track',
      from: REQUESTED_FROM,
      days: 3,
    });

    expect(invalidUrl).toEqual({
      success: false,
      error: {
        code: 'TRACK_NOT_ELIGIBLE',
        reason: 'INVALID_PLAYABLE_URL',
        message: 'Track is not eligible for Release Deck scheduling',
        trackId: 'invalid-url-track',
        diagnostics: [],
        capacityInputs: null,
      },
    });
    expect(prisma.releaseDeckSchedule.findMany).not.toHaveBeenCalled();
  });

  it('checks active source slot and duration caps before returning date availability', async () => {
    prisma.track.findMany.mockResolvedValue([
      { id: 'slot-1', duration: 300, status: 'ready' },
      { id: 'slot-2', duration: 300, status: 'ready' },
      { id: 'slot-3', duration: 300, status: 'ready' },
      { id: 'slot-4', duration: 60, status: 'ready' },
    ]);

    const result = await service.getAvailability({
      communityId: CITY_COMMUNITY.id,
      trackId: TRACK.id,
      from: REQUESTED_FROM,
      days: 3,
    });

    expect(result).toMatchObject({
      success: false,
      error: {
        code: 'SOURCE_SLOT_CAP_REACHED',
        reason: 'SOURCE_SLOT_CAP_REACHED',
      },
    });
    expect(prisma.releaseDeckSchedule.findMany).not.toHaveBeenCalled();
  });

  it('performs no writes and never creates Fair Play rotation entries or source mutations', async () => {
    prisma.releaseDeckSchedule.findMany.mockResolvedValue([
      scheduled('short-1', REQUESTED_FROM, 120),
    ]);

    await service.getAvailability({
      communityId: CITY_COMMUNITY.id,
      trackId: TRACK.id,
      from: REQUESTED_FROM,
      days: 2,
    });

    expect(mutatingCalls(prisma)).toEqual([]);
    expect(prisma.rotationEntry.create).not.toHaveBeenCalled();
    expect(prisma.rotationEntry.update).not.toHaveBeenCalled();
    expect(prisma.track.update).not.toHaveBeenCalled();
    expect(prisma.community.update).not.toHaveBeenCalled();
    expect(prisma.artistBand.update).not.toHaveBeenCalled();
    expect(prisma.fairPlayConfig.findUnique).not.toHaveBeenCalled();
    expect(prisma.fairPlayConfig.findFirst).not.toHaveBeenCalled();
  });

  it('rejects blank IDs, missing tracks, and non-city communities', async () => {
    await expect(
      service.getAvailability({
        communityId: ' ',
        trackId: TRACK.id,
        from: REQUESTED_FROM,
        days: 3,
      })
    ).rejects.toBeInstanceOf(BadRequestException);

    prisma.track.findUnique.mockResolvedValueOnce(null);
    await expect(
      service.getAvailability({
        communityId: CITY_COMMUNITY.id,
        trackId: 'missing',
        from: REQUESTED_FROM,
        days: 3,
      })
    ).rejects.toBeInstanceOf(NotFoundException);

    prisma.community.findUnique.mockResolvedValueOnce({
      ...CITY_COMMUNITY,
      id: 'state-scene',
      tier: 'state',
    });
    await expect(
      service.getAvailability({
        communityId: 'state-scene',
        trackId: TRACK.id,
        from: REQUESTED_FROM,
        days: 3,
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a chosen schedule only when the requested date is valid', async () => {
    mockOperatorTrack();

    const result = await service.scheduleTrack('user-1', {
      communityId: CITY_COMMUNITY.id,
      trackId: TRACK.id,
      mode: 'chosen',
      requestedDate: REQUESTED_FROM,
    });

    expect(result.success).toBe(true);
    expect(prisma.releaseDeckSchedule.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          trackId: TRACK.id,
          communityId: CITY_COMMUNITY.id,
          artistBandId: 'source-a',
          scheduledFor: new Date(`${REQUESTED_FROM}T00:00:00.000Z`),
          requestedFor: new Date(`${REQUESTED_FROM}T00:00:00.000Z`),
          assignmentMode: 'chosen',
          status: 'scheduled',
          createdById: 'user-1',
        }),
      })
    );
    expect(prisma.rotationEntry.create).not.toHaveBeenCalled();
    expect(prisma.rotationEntry.update).not.toHaveBeenCalled();
  });

  it('does not create a chosen schedule when the requested date is over capacity', async () => {
    mockOperatorTrack();
    prisma.releaseDeckSchedule.findMany.mockResolvedValue([
      scheduled('full-1', REQUESTED_FROM, 360),
      scheduled('full-2', REQUESTED_FROM, 360),
    ]);

    const result = await service.scheduleTrack('user-1', {
      communityId: CITY_COMMUNITY.id,
      trackId: TRACK.id,
      mode: 'chosen',
      requestedDate: REQUESTED_FROM,
    });

    expect(result).toMatchObject({
      success: false,
      error: {
        code: 'DATE_CAPACITY_FULL',
        requestedDate: REQUESTED_FROM,
        soonestValidDate: '2026-07-09',
        alternatives: expect.arrayContaining(['2026-07-09']),
      },
    });
    expect(prisma.releaseDeckSchedule.create).not.toHaveBeenCalled();
  });

  it('creates a soonest schedule on the earliest available alternative', async () => {
    jest.useFakeTimers().setSystemTime(new Date(`${REQUESTED_FROM}T12:00:00.000Z`));
    mockOperatorTrack();
    prisma.releaseDeckSchedule.findMany.mockResolvedValue([
      scheduled('full-1', REQUESTED_FROM, 360),
      scheduled('full-2', REQUESTED_FROM, 360),
    ]);

    const result = await service.scheduleTrack('user-1', {
      communityId: CITY_COMMUNITY.id,
      trackId: TRACK.id,
      mode: 'soonest',
    });

    expect(result.success).toBe(true);
    expect(prisma.releaseDeckSchedule.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          scheduledFor: new Date('2026-07-09T00:00:00.000Z'),
          requestedFor: null,
          assignmentMode: 'soonest',
        }),
      })
    );
    jest.useRealTimers();
  });

  it('requires the current user to manage the source before creating a schedule', async () => {
    mockOperatorTrack({
      artistBand: {
        id: 'source-a',
        homeSceneId: CITY_COMMUNITY.id,
        createdById: 'user-2',
        members: [],
      },
    });

    await expect(
      service.scheduleTrack('user-1', {
        communityId: CITY_COMMUNITY.id,
        trackId: TRACK.id,
        mode: 'chosen',
        requestedDate: REQUESTED_FROM,
      })
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.releaseDeckSchedule.create).not.toHaveBeenCalled();
    expect(prisma.releaseDeckSchedule.findMany).not.toHaveBeenCalled();
  });
});
