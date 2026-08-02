import {
  RADIYO_LIFECYCLE_CLOCK,
  RadiyoLifecyclePreviewCoordinator,
} from '../src/fair-play/radiyo-lifecycle-preview.coordinator';

const AS_OF = new Date('2026-08-02T23:59:59.000Z');

function createCoordinator(overrides: Record<string, any> = {}) {
  const prisma = {
    community: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    ...(overrides.prisma ?? {}),
  };
  const ingestion = {
    ingestDueSchedules: jest.fn().mockResolvedValue({ success: true, data: { dryRun: true } }),
    ...(overrides.ingestion ?? {}),
  };
  const graduation = {
    runGraduation: jest.fn().mockResolvedValue({ success: true, data: { dryRun: true } }),
    ...(overrides.graduation ?? {}),
  };
  const clock = {
    now: jest.fn().mockReturnValue(AS_OF),
    ...(overrides.clock ?? {}),
  };

  return {
    prisma,
    ingestion,
    graduation,
    clock,
    coordinator: new RadiyoLifecyclePreviewCoordinator(
      prisma as any,
      ingestion as any,
      graduation as any,
      clock,
    ),
  };
}

describe('RadiyoLifecyclePreviewCoordinator', () => {
  it('scans only active city-tier communities in deterministic full-tuple order', async () => {
    const { coordinator, prisma, ingestion, graduation, clock } = createCoordinator({
      prisma: {
        community: {
          findMany: jest.fn().mockResolvedValue([
            { id: 'ca-oakland-punk', state: 'CA', city: 'Oakland', musicCommunity: 'Punk' },
            { id: 'tx-austin-punk', state: 'TX', city: 'Austin', musicCommunity: 'Punk' },
          ]),
        },
      },
    });

    const result = await coordinator.runOnce();

    expect(clock.now).toHaveBeenCalledTimes(1);
    expect(prisma.community.findMany).toHaveBeenCalledWith({
      where: { tier: 'city', isActive: true },
      select: { id: true, city: true, state: true, musicCommunity: true },
      orderBy: [{ state: 'asc' }, { city: 'asc' }, { musicCommunity: 'asc' }, { id: 'asc' }],
    });
    expect(result).toMatchObject({
      success: true,
      mode: 'preview',
      asOf: '2026-08-02',
      scannedCommunityCount: 2,
    });
    expect(ingestion.ingestDueSchedules).toHaveBeenNthCalledWith(1, {
      communityId: 'ca-oakland-punk',
      asOf: '2026-08-02',
      dryRun: true,
    });
    expect(ingestion.ingestDueSchedules).toHaveBeenNthCalledWith(2, {
      communityId: 'tx-austin-punk',
      asOf: '2026-08-02',
      dryRun: true,
    });
    expect(graduation.runGraduation).toHaveBeenNthCalledWith(1, {
      communityId: 'ca-oakland-punk',
      asOf: '2026-08-02',
      dryRun: true,
    });
    expect(graduation.runGraduation).toHaveBeenNthCalledWith(2, {
      communityId: 'tx-austin-punk',
      asOf: '2026-08-02',
      dryRun: true,
    });
    expect(result.communities.every((community) => community.recurrence.status === 'deferred_no_preview_api')).toBe(true);
  });

  it('returns an empty preview without delegating when no active city-tier communities exist', async () => {
    const { coordinator, ingestion, graduation } = createCoordinator();

    await expect(coordinator.runOnce()).resolves.toMatchObject({
      success: true,
      mode: 'preview',
      scannedCommunityCount: 0,
      communities: [],
    });
    expect(ingestion.ingestDueSchedules).not.toHaveBeenCalled();
    expect(graduation.runGraduation).not.toHaveBeenCalled();
  });

  it('isolates ingestion and graduation failures by stage and community', async () => {
    const { coordinator, ingestion, graduation } = createCoordinator({
      prisma: {
        community: {
          findMany: jest.fn().mockResolvedValue([
            { id: 'city-a', state: 'CA', city: 'Oakland', musicCommunity: 'Punk' },
            { id: 'city-b', state: 'TX', city: 'Austin', musicCommunity: 'Punk' },
          ]),
        },
      },
    });
    ingestion.ingestDueSchedules.mockRejectedValueOnce(new Error('ingestion failed'));
    graduation.runGraduation.mockRejectedValueOnce(new Error('graduation failed'));

    const result = await coordinator.runOnce();

    expect(result.communities[0]).toMatchObject({
      community: { id: 'city-a' },
      ingestion: { status: 'failed', message: 'ingestion failed' },
      graduation: { status: 'failed', message: 'graduation failed' },
      recurrence: { status: 'deferred_no_preview_api' },
    });
    expect(result.communities[1]).toMatchObject({
      community: { id: 'city-b' },
      ingestion: { status: 'previewed' },
      graduation: { status: 'previewed' },
      recurrence: { status: 'deferred_no_preview_api' },
    });
    expect(ingestion.ingestDueSchedules).toHaveBeenCalledTimes(2);
    expect(graduation.runGraduation).toHaveBeenCalledTimes(2);
  });

  it('exposes an injectable clock token for module-level replacement', () => {
    expect(RADIYO_LIFECYCLE_CLOCK).toBe('RADIYO_LIFECYCLE_CLOCK');
  });
});
