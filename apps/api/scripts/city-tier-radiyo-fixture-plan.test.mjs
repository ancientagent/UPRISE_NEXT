import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCityTierRadiyoFixturePlan } from './city-tier-radiyo-fixture-plan.mjs';

function track(index, durationSeconds) {
  return {
    fileName: `track-${index}.wav`,
    path: `/fixtures/track-${index}.wav`,
    durationSeconds,
    format: 'wav',
    sha256: `hash-${index}`,
  };
}

test('creates a city-tier, five-source fixture and schedules the fixed ten-day lifecycle without writes', () => {
  const plan = buildCityTierRadiyoFixturePlan({
    city: 'Austin',
    state: 'TX',
    musicCommunity: 'Punk',
    startDate: '2026-08-01',
    tracks: Array.from({ length: 9 }, (_, index) => track(index + 1, 300)),
  });

  assert.equal(plan.readiness.readyForStaging, true);
  assert.equal(plan.readiness.totalPlayableSeconds, 2700);
  assert.equal(plan.readiness.distinctSourceCount, 5);
  assert.equal(plan.sourceMapping.length, 5);
  assert.ok(plan.sourceMapping.every((source) => source.playableSeconds <= 900));
  assert.ok(plan.sourceMapping.every((source) => source.trackCount <= 3));
  assert.equal(plan.lifecycleDryRun.schedules.length, 9);
  assert.ok(plan.lifecycleDryRun.schedules.every((entry) => entry.mainRotationEligibleAt === '2026-08-11' || entry.mainRotationEligibleAt === '2026-08-12' || entry.mainRotationEligibleAt === '2026-08-13'));
  assert.deepEqual(plan.safety, {
    audioCopiedIntoGit: false,
    databaseWrites: false,
    providerUploads: false,
    productionWorkerStarted: false,
    statewideOrNationalAggregation: false,
  });
});

test('rejects tracks over six minutes and reports a city fixture shortfall instead of inventing capacity', () => {
  const plan = buildCityTierRadiyoFixturePlan({
    city: 'Austin',
    state: 'TX',
    musicCommunity: 'Punk',
    startDate: '2026-08-01',
    tracks: [track(1, 361), ...Array.from({ length: 4 }, (_, index) => track(index + 2, 300))],
  });

  assert.equal(plan.readiness.readyForStaging, false);
  assert.equal(plan.readiness.meetsDistinctSourceThreshold, false);
  assert.equal(plan.inventory.excludedTracks[0].reason, 'OVER_MAX_TRACK_SECONDS');
  assert.equal(plan.readiness.remainingPlayableSeconds, 1500);
});
