export const CITY_TIER_RADIYO_FIXTURE_RULES = Object.freeze({
  requiredPlayableSeconds: 45 * 60,
  requiredSourceCount: 5,
  maxSourceSeconds: 15 * 60,
  maxTracksPerSource: 3,
  maxTrackSeconds: 6 * 60,
  maxDailyIntakeSeconds: 15 * 60,
  maxProtectedPoolSeconds: 45 * 60,
  newWindowDays: 10,
  scheduleLookaheadDays: 30,
});

function compareTracks(left, right) {
  return right.durationSeconds - left.durationSeconds
    || left.path.localeCompare(right.path)
    || left.fileName.localeCompare(right.fileName);
}

function addDays(date, days) {
  const result = new Date(`${date}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function dayOffset(startDate, date) {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const current = new Date(`${date}T00:00:00.000Z`);
  return Math.round((current.getTime() - start.getTime()) / 86_400_000);
}

function sumSeconds(items) {
  return items.reduce((total, item) => total + item.durationSeconds, 0);
}

function buildSourceSlots() {
  return Array.from({ length: CITY_TIER_RADIYO_FIXTURE_RULES.requiredSourceCount }, (_, index) => ({
    sourceKey: `fixture-source-${String(index + 1).padStart(2, '0')}`,
    tracks: [],
    playableSeconds: 0,
  }));
}

function buildExplicitSourceSlots(eligibleTracks) {
  const tracksBySource = new Map();
  for (const track of eligibleTracks) {
    const sourceTracks = tracksBySource.get(track.sourceKey) ?? [];
    sourceTracks.push(track);
    tracksBySource.set(track.sourceKey, sourceTracks);
  }

  return [...tracksBySource.entries()]
    .map(([sourceKey, tracks]) => {
      const source = { sourceKey, tracks: [], playableSeconds: 0 };
      for (const track of tracks.sort(compareTracks)) {
        if (source.tracks.length >= CITY_TIER_RADIYO_FIXTURE_RULES.maxTracksPerSource) {
          break;
        }
        if (source.playableSeconds + track.durationSeconds <= CITY_TIER_RADIYO_FIXTURE_RULES.maxSourceSeconds) {
          assignTrack(source, track);
        }
      }
      return source;
    })
    .filter((source) => source.tracks.length > 0)
    .sort((left, right) => right.playableSeconds - left.playableSeconds || left.sourceKey.localeCompare(right.sourceKey))
    .slice(0, CITY_TIER_RADIYO_FIXTURE_RULES.requiredSourceCount);
}

function eligibleSourceSlots(sourceSlots, track) {
  return sourceSlots
    .filter((source) => source.tracks.length < CITY_TIER_RADIYO_FIXTURE_RULES.maxTracksPerSource)
    .filter((source) => source.playableSeconds + track.durationSeconds <= CITY_TIER_RADIYO_FIXTURE_RULES.maxSourceSeconds)
    .sort((left, right) => left.playableSeconds - right.playableSeconds || left.sourceKey.localeCompare(right.sourceKey));
}

function assignTrack(source, track) {
  source.tracks.push(track);
  source.playableSeconds += track.durationSeconds;
}

function selectTracksForSources(eligibleTracks) {
  if (eligibleTracks.length > 0 && eligibleTracks.every((track) => track.sourceKey)) {
    return buildExplicitSourceSlots(eligibleTracks);
  }
  const sourceSlots = buildSourceSlots();
  const remaining = [...eligibleTracks].sort(compareTracks);

  // Seed every required source first. A valid city-tier fixture cannot concentrate
  // all of its playable time into fewer than five registered Artist/Band sources.
  for (const source of sourceSlots) {
    const nextTrack = remaining.shift();
    if (!nextTrack) {
      break;
    }
    assignTrack(source, nextTrack);
  }

  while (sumSeconds(sourceSlots.flatMap((source) => source.tracks)) < CITY_TIER_RADIYO_FIXTURE_RULES.requiredPlayableSeconds) {
    let assigned = false;
    for (let index = 0; index < remaining.length; index += 1) {
      const track = remaining[index];
      const source = eligibleSourceSlots(sourceSlots, track)[0];
      if (!source) {
        continue;
      }
      assignTrack(source, track);
      remaining.splice(index, 1);
      assigned = true;
      break;
    }
    if (!assigned) {
      break;
    }
  }

  return sourceSlots;
}

function scheduleTracks(sourceSlots, startDate) {
  const scheduled = [];
  const selectedTracks = sourceSlots
    .flatMap((source) => source.tracks.map((track) => ({ ...track, sourceKey: source.sourceKey })))
    .sort(compareTracks);

  for (const track of selectedTracks) {
    let scheduledFor = null;
    for (let offset = 0; offset <= CITY_TIER_RADIYO_FIXTURE_RULES.scheduleLookaheadDays; offset += 1) {
      const candidateDate = addDays(startDate, offset);
      const dailySeconds = sumSeconds(scheduled.filter((entry) => entry.scheduledFor === candidateDate));
      const protectedSeconds = sumSeconds(scheduled.filter((entry) => {
        const entryOffset = dayOffset(startDate, entry.scheduledFor);
        return entryOffset >= offset - (CITY_TIER_RADIYO_FIXTURE_RULES.newWindowDays - 1) && entryOffset <= offset;
      }));
      if (
        dailySeconds + track.durationSeconds <= CITY_TIER_RADIYO_FIXTURE_RULES.maxDailyIntakeSeconds
        && protectedSeconds + track.durationSeconds <= CITY_TIER_RADIYO_FIXTURE_RULES.maxProtectedPoolSeconds
      ) {
        scheduledFor = candidateDate;
        break;
      }
    }

    if (!scheduledFor) {
      return { scheduled, unscheduledTrack: track };
    }

    scheduled.push({
      ...track,
      scheduledFor,
      newReleasesStart: scheduledFor,
      mainRotationEligibleAt: addDays(scheduledFor, CITY_TIER_RADIYO_FIXTURE_RULES.newWindowDays),
    });
  }

  return { scheduled, unscheduledTrack: null };
}

function normalizeTrack(track) {
  return {
    fileName: track.fileName,
    path: track.path,
    durationSeconds: Math.round(track.durationSeconds),
    sha256: track.sha256,
    format: track.format,
    sourceKey: typeof track.sourceKey === 'string' && track.sourceKey.trim() ? track.sourceKey.trim() : null,
  };
}

export function buildCityTierRadiyoFixturePlan({ city, state, musicCommunity, startDate, tracks }) {
  const normalizedTracks = tracks.map(normalizeTrack).sort(compareTracks);
  const durationExcludedTracks = normalizedTracks
    .filter((track) => track.durationSeconds <= 0 || track.durationSeconds > CITY_TIER_RADIYO_FIXTURE_RULES.maxTrackSeconds)
    .map((track) => ({
      ...track,
      reason: track.durationSeconds <= 0 ? 'INVALID_DURATION' : 'OVER_MAX_TRACK_SECONDS',
    }));
  const contentHashes = new Map();
  const duplicateExcludedTracks = [];
  const eligibleTracks = [];
  for (const track of normalizedTracks.filter((candidate) => candidate.durationSeconds > 0 && candidate.durationSeconds <= CITY_TIER_RADIYO_FIXTURE_RULES.maxTrackSeconds)) {
    const original = contentHashes.get(track.sha256);
    if (original) {
      duplicateExcludedTracks.push({
        ...track,
        reason: 'DUPLICATE_AUDIO_CONTENT',
        duplicateOf: original.path,
      });
      continue;
    }
    contentHashes.set(track.sha256, track);
    eligibleTracks.push(track);
  }
  const excludedTracks = [...durationExcludedTracks, ...duplicateExcludedTracks].sort(compareTracks);
  const sourceSlots = selectTracksForSources(eligibleTracks);
  const sourceMappingMode = eligibleTracks.length > 0 && eligibleTracks.every((track) => track.sourceKey)
    ? 'provided-source-groups'
    : 'fixture-source-slots';
  const selectedTracks = sourceSlots.flatMap((source) => source.tracks);
  const totalPlayableSeconds = sumSeconds(selectedTracks);
  const nonEmptySources = sourceSlots.filter((source) => source.tracks.length > 0);
  const scheduleResult = scheduleTracks(sourceSlots, startDate);
  const readiness = {
    meetsPlayableThreshold: totalPlayableSeconds >= CITY_TIER_RADIYO_FIXTURE_RULES.requiredPlayableSeconds,
    meetsDistinctSourceThreshold: nonEmptySources.length >= CITY_TIER_RADIYO_FIXTURE_RULES.requiredSourceCount,
    sourceCapsValid: sourceSlots.every((source) => source.playableSeconds <= CITY_TIER_RADIYO_FIXTURE_RULES.maxSourceSeconds),
    sourceSlotCountsValid: sourceSlots.every((source) => source.tracks.length <= CITY_TIER_RADIYO_FIXTURE_RULES.maxTracksPerSource),
    scheduleCapacityValid: !scheduleResult.unscheduledTrack,
  };
  const readyForStaging = Object.values(readiness).every(Boolean);

  return {
    manifestVersion: 1,
    mode: 'read-only-local-preflight',
    community: { city, state, musicCommunity, tier: 'city' },
    contract: CITY_TIER_RADIYO_FIXTURE_RULES,
    inventory: {
      audioFileCount: normalizedTracks.length,
      uniqueAudioFileCount: contentHashes.size,
      eligibleFileCount: eligibleTracks.length,
      excludedTracks,
    },
    sourceMapping: sourceSlots.map((source) => ({
      sourceKey: source.sourceKey,
      requiredStagingMapping: sourceMappingMode === 'provided-source-groups'
        ? 'Map this supplied source group to one distinct registered Artist/Band source in the target city-tier Home Scene before any database write.'
        : 'Map this fixture key to one distinct registered Artist/Band source in the target city-tier Home Scene before any database write.',
      playableSeconds: source.playableSeconds,
      trackCount: source.tracks.length,
      tracks: source.tracks,
    })),
    lifecycleDryRun: {
      scheduleStartDate: startDate,
      schedules: scheduleResult.scheduled,
      unscheduledTrack: scheduleResult.unscheduledTrack,
      contract: 'Each scheduled track enters New Releases on scheduledFor, remains protected for 10 days, and becomes eligible for Main Rotation on mainRotationEligibleAt. This manifest does not call an API or write a database.',
    },
    readiness: {
      ...readiness,
      distinctSourceCount: nonEmptySources.length,
      totalPlayableSeconds,
      totalPlayableMinutes: Number((totalPlayableSeconds / 60).toFixed(2)),
      remainingPlayableSeconds: Math.max(0, CITY_TIER_RADIYO_FIXTURE_RULES.requiredPlayableSeconds - totalPlayableSeconds),
      readyForStaging,
    },
    sourceMappingMode,
    safety: {
      audioCopiedIntoGit: false,
      databaseWrites: false,
      providerUploads: false,
      productionWorkerStarted: false,
      statewideOrNationalAggregation: false,
    },
    nextStep: readyForStaging
      ? 'Request explicit approval before mapping fixture source keys to real sources or writing any staging rows.'
      : 'Hydrate or add more eligible local audio, then rerun this read-only preflight.',
  };
}
