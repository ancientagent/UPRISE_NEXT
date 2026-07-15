import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReleaseDeckMeasurementService } from '../src/release-deck/release-deck-measurement.service';

const CITY_COMMUNITY = {
  id: 'community-austin-punk',
  name: 'Austin Punk',
  city: 'Austin',
  state: 'Texas',
  musicCommunity: 'Punk',
  tier: 'city',
  isActive: true,
};

/**
 * Prisma mock exposing every mutating method we must prove is never called,
 * plus the models the measurement service must never read.
 */
function createPrismaMock() {
  return {
    community: {
      findUnique: jest.fn().mockResolvedValue(CITY_COMMUNITY),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    track: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    artistBand: {
      findMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    rotationEntry: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    registrarEntry: { findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    fairPlayConfig: { findUnique: jest.fn(), findFirst: jest.fn() },
    sectTag: { findMany: jest.fn(), findFirst: jest.fn(), upsert: jest.fn() },
    userTag: { findMany: jest.fn(), findFirst: jest.fn(), upsert: jest.fn() },
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
  };
}

let trackSeq = 0;

function track(overrides: Partial<Record<string, any>> = {}) {
  trackSeq += 1;
  return {
    id: `track-${trackSeq}`,
    title: `Track ${trackSeq}`,
    duration: 300,
    status: 'ready',
    communityId: CITY_COMMUNITY.id,
    artistBandId: 'source-a',
    createdAt: new Date(2026, 0, trackSeq),
    artistBand: { id: 'source-a', name: 'Source A', homeSceneId: CITY_COMMUNITY.id },
    ...overrides,
  };
}

function sourced(sourceId: string, sourceName: string, overrides: Partial<Record<string, any>> = {}) {
  return track({
    artistBandId: sourceId,
    artistBand: { id: sourceId, name: sourceName, homeSceneId: CITY_COMMUNITY.id },
    ...overrides,
  });
}

/** Collects every jest.fn on the prisma mock whose name implies a write. */
function mutatingCalls(prisma: any): string[] {
  const writeMethods = ['create', 'update', 'updateMany', 'upsert', 'delete', '$executeRaw', '$transaction'];
  const called: string[] = [];
  for (const [modelName, model] of Object.entries(prisma)) {
    if (typeof model === 'function') {
      if (writeMethods.includes(modelName) && (model as jest.Mock).mock.calls.length > 0) called.push(modelName);
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

describe('ReleaseDeckMeasurementService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: ReleaseDeckMeasurementService;

  beforeEach(() => {
    jest.clearAllMocks();
    trackSeq = 0;
    prisma = createPrismaMock();
    prisma.community.findUnique.mockResolvedValue(CITY_COMMUNITY);
    prisma.track.findMany.mockResolvedValue([]);
    service = new ReleaseDeckMeasurementService(prisma as any);
  });

  it('aggregates ready source-owned tracks across every source deck in the Uprise', async () => {
    prisma.track.findMany.mockResolvedValue([
      sourced('source-a', 'Source A', { duration: 300 }),
      sourced('source-a', 'Source A', { duration: 240 }),
      sourced('source-b', 'Source B', { duration: 360 }),
    ]);

    const result = await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(result.success).toBe(true);
    expect(result.data.community).toMatchObject({
      id: CITY_COMMUNITY.id,
      city: 'Austin',
      state: 'Texas',
      musicCommunity: 'Punk',
      tier: 'city',
    });
    expect(result.data.totals).toMatchObject({
      rawPlayableSeconds: 900,
      cappedPlayableSeconds: 900,
      cappedPlayableMinutes: 15,
      distinctSourceCount: 2,
      includedTrackCount: 3,
      excludedTrackCount: 0,
    });
    expect(result.data.sources).toEqual([
      expect.objectContaining({
        sourceId: 'source-a',
        sourceName: 'Source A',
        rawPlayableSeconds: 540,
        cappedPlayableSeconds: 540,
        remainingCapacitySeconds: 360,
        includedTrackCount: 2,
        atSourceCap: false,
      }),
      expect.objectContaining({
        sourceId: 'source-b',
        cappedPlayableSeconds: 360,
        remainingCapacitySeconds: 540,
        includedTrackCount: 1,
      }),
    ]);
    expect(result.data.excludedTracks).toEqual([]);
  });

  it('exposes the locked thresholds without reading deprecated FairPlayConfig band fields', async () => {
    const result = await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(result.data.thresholds).toEqual({
      requiredPlayableSeconds: 2700,
      requiredPlayableMinutes: 45,
      requiredDistinctSources: 5,
      maxPlayableSecondsPerSource: 900,
      maxPlayableMinutesPerSource: 15,
      maxTrackSeconds: 360,
      maxTrackMinutes: 6,
    });
    expect(prisma.fairPlayConfig.findUnique).not.toHaveBeenCalled();
    expect(prisma.fairPlayConfig.findFirst).not.toHaveBeenCalled();
  });

  it('excludes each ineligible track with a deterministic reason', async () => {
    prisma.track.findMany.mockResolvedValue([
      // eligible control
      sourced('source-a', 'Source A', { duration: 120 }),
      // no managed source
      track({ id: 'no-source', artistBandId: null, artistBand: null }),
      // source deck track never attached to a community
      sourced('source-b', 'Source B', { id: 'unattached', communityId: null }),
      // attached to a different Uprise
      sourced('source-b', 'Source B', { id: 'wrong-community', communityId: 'community-dallas-punk' }),
      // source has no resolved Home Scene
      track({
        id: 'no-home-scene',
        artistBandId: 'source-c',
        artistBand: { id: 'source-c', name: 'Source C', homeSceneId: null },
      }),
      // source operates out of a different Home Scene
      track({
        id: 'home-scene-mismatch',
        artistBandId: 'source-d',
        artistBand: { id: 'source-d', name: 'Source D', homeSceneId: 'community-houston-punk' },
      }),
      // not approved/playable
      sourced('source-e', 'Source E', { id: 'processing', status: 'processing' }),
      sourced('source-e', 'Source E', { id: 'failed', status: 'failed' }),
      // over the 6-minute song cap
      sourced('source-f', 'Source F', { id: 'overlength', duration: 361 }),
      // corrupt duration must not poison the totals
      sourced('source-g', 'Source G', { id: 'bad-duration', duration: 0 }),
    ]);

    const result = await service.measureCommunityDeck(CITY_COMMUNITY.id);

    const reasonByTrack = Object.fromEntries(
      result.data.excludedTracks.map((entry) => [entry.trackId, entry.reason])
    );
    expect(reasonByTrack).toEqual({
      'no-source': 'MISSING_SOURCE_OWNERSHIP',
      unattached: 'TRACK_NOT_ATTACHED_TO_COMMUNITY',
      'wrong-community': 'WRONG_COMMUNITY',
      'no-home-scene': 'MISSING_SOURCE_HOME_SCENE',
      'home-scene-mismatch': 'SOURCE_HOME_SCENE_MISMATCH',
      processing: 'NOT_READY',
      failed: 'NOT_READY',
      overlength: 'OVER_MAX_TRACK_SECONDS',
      'bad-duration': 'INVALID_DURATION',
    });

    // Only the eligible control track counts.
    expect(result.data.totals).toMatchObject({
      rawPlayableSeconds: 120,
      cappedPlayableSeconds: 120,
      distinctSourceCount: 1,
      includedTrackCount: 1,
    });
    expect(result.data.includedTracks).toEqual([
      expect.objectContaining({ sourceId: 'source-a', durationSeconds: 120 }),
    ]);
  });

  it('reports one reason per track using fixed precedence when several problems apply', async () => {
    prisma.track.findMany.mockResolvedValue([
      // unowned AND wrong community AND not ready AND overlength
      track({
        id: 'multi',
        artistBandId: null,
        artistBand: null,
        communityId: 'community-dallas-punk',
        status: 'processing',
        duration: 999,
      }),
    ]);

    const result = await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(result.data.excludedTracks).toEqual([
      expect.objectContaining({ trackId: 'multi', reason: 'MISSING_SOURCE_OWNERSHIP' }),
    ]);
  });

  it('caps each source at 900 seconds and excludes the overflow tracks', async () => {
    prisma.track.findMany.mockResolvedValue([
      sourced('source-a', 'Source A', { id: 'a1', duration: 360 }),
      sourced('source-a', 'Source A', { id: 'a2', duration: 360 }),
      // does not fit: 720 + 360 > 900
      sourced('source-a', 'Source A', { id: 'a3', duration: 360 }),
      // still fits the 180s remainder, so first-fit admits it
      sourced('source-a', 'Source A', { id: 'a4', duration: 180 }),
    ]);

    const result = await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(result.data.sources[0]).toMatchObject({
      sourceId: 'source-a',
      rawPlayableSeconds: 1260,
      cappedPlayableSeconds: 900,
      remainingCapacitySeconds: 0,
      includedTrackCount: 3,
      atSourceCap: true,
    });
    expect(result.data.totals.cappedPlayableSeconds).toBe(900);
    expect(result.data.excludedTracks).toEqual([
      expect.objectContaining({ trackId: 'a3', reason: 'SOURCE_CAP_EXCEEDED' }),
    ]);
    expect(result.data.includedTracks.map((entry) => entry.trackId)).toEqual(['a1', 'a2', 'a4']);
  });

  it('never lets one source push the Uprise past its own 900 second contribution', async () => {
    // A single source with 45 minutes of music must not satisfy the 45-minute
    // Uprise threshold on its own.
    prisma.track.findMany.mockResolvedValue(
      Array.from({ length: 9 }, (_, index) =>
        sourced('source-a', 'Source A', { id: `a${index}`, duration: 300 })
      )
    );

    const result = await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(result.data.totals.rawPlayableSeconds).toBe(2700);
    expect(result.data.totals.cappedPlayableSeconds).toBe(900);
    expect(result.data.readiness).toMatchObject({
      ready: false,
      meetsPlayableThreshold: false,
      meetsDistinctSourceThreshold: false,
      remainingPlayableSeconds: 1800,
      remainingDistinctSources: 4,
    });
  });

  it('reports readiness once 45 capped minutes come from 5 distinct sources', async () => {
    const tracks = ['a', 'b', 'c', 'd', 'e'].flatMap((letter) => [
      sourced(`source-${letter}`, `Source ${letter.toUpperCase()}`, { id: `${letter}1`, duration: 300 }),
      sourced(`source-${letter}`, `Source ${letter.toUpperCase()}`, { id: `${letter}2`, duration: 240 }),
    ]);
    prisma.track.findMany.mockResolvedValue(tracks);

    const result = await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(result.data.totals).toMatchObject({
      cappedPlayableSeconds: 2700,
      cappedPlayableMinutes: 45,
      distinctSourceCount: 5,
    });
    expect(result.data.readiness).toEqual({
      ready: true,
      meetsPlayableThreshold: true,
      meetsDistinctSourceThreshold: true,
      remainingPlayableSeconds: 0,
      remainingPlayableMinutes: 0,
      remainingDistinctSources: 0,
    });
  });

  it('counts only sources that contribute an included track toward distinct source count', async () => {
    prisma.track.findMany.mockResolvedValue([
      sourced('source-a', 'Source A', { duration: 300 }),
      // Source B is in the Uprise but every track is ineligible.
      sourced('source-b', 'Source B', { id: 'b1', status: 'processing' }),
      sourced('source-b', 'Source B', { id: 'b2', duration: 400 }),
    ]);

    const result = await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(result.data.totals.distinctSourceCount).toBe(1);
    expect(result.data.sources.map((source) => source.sourceId)).toEqual(['source-a']);
  });

  it('widens the candidate query beyond the community so in-Uprise source drift is visible', async () => {
    await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(prisma.track.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [{ communityId: CITY_COMMUNITY.id }, { artistBand: { homeSceneId: CITY_COMMUNITY.id } }],
        },
      })
    );
  });

  it('does not infer Sect membership from passive tag structures', async () => {
    prisma.track.findMany.mockResolvedValue([sourced('source-a', 'Source A', { duration: 300 })]);

    const result = await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(prisma.sectTag.findMany).not.toHaveBeenCalled();
    expect(prisma.sectTag.findFirst).not.toHaveBeenCalled();
    expect(prisma.userTag.findMany).not.toHaveBeenCalled();
    expect(prisma.userTag.findFirst).not.toHaveBeenCalled();
    // Slice 1 has no Registrar-held Artist/Band Sect membership input, so it
    // reports only the complete community deck and no Sect-filtered totals.
    expect(result.data).not.toHaveProperty('sect');
    expect(result.data.totals).not.toHaveProperty('sectMemberPlayableSeconds');
  });

  it('performs no writes and creates no rotation entries or schedules', async () => {
    prisma.track.findMany.mockResolvedValue([
      sourced('source-a', 'Source A', { duration: 300 }),
      sourced('source-b', 'Source B', { id: 'overflow', duration: 400 }),
    ]);

    await service.measureCommunityDeck(CITY_COMMUNITY.id);

    expect(mutatingCalls(prisma)).toEqual([]);
    expect(prisma.rotationEntry.create).not.toHaveBeenCalled();
    expect(prisma.track.update).not.toHaveBeenCalled();
    expect(prisma.community.update).not.toHaveBeenCalled();
    expect(prisma.artistBand.update).not.toHaveBeenCalled();
    expect(prisma.registrarEntry.create).not.toHaveBeenCalled();
  });

  it('rejects a blank communityId', async () => {
    await expect(service.measureCommunityDeck('   ')).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.community.findUnique).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when the community does not exist', async () => {
    prisma.community.findUnique.mockResolvedValue(null);

    await expect(service.measureCommunityDeck('missing')).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.track.findMany).not.toHaveBeenCalled();
  });

  it('rejects non-city-tier communities because only city-tier Uprises own a deck', async () => {
    prisma.community.findUnique.mockResolvedValue({ ...CITY_COMMUNITY, id: 'state-scene', tier: 'state' });

    await expect(service.measureCommunityDeck('state-scene')).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.track.findMany).not.toHaveBeenCalled();
  });
});
