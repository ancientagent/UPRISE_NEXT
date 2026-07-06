import type { CreateTrackInput } from '@uprise/types';
import type { ManagedSourceAccount } from './types';

type ReleaseDeckFormInput = {
  title: string;
  album: string;
  duration: string;
  fileUrl: string;
  coverArt: string;
};

export const hostedAudioUrlMessage = 'Audio File URL must be an http(s) URL for the current hosted-file MVP.';
export const hostedCoverUrlMessage = 'Cover Art URL must be an http(s) URL for the current hosted-file MVP.';
export const releaseDeckMusicSlotCount = 3;
export const releaseDeckMaxTrackSeconds = 6 * 60;
export const releaseDeckMaxSourceSeconds = 15 * 60;
export const releaseDeckMaxTrackDurationMessage = 'Release Deck tracks cannot exceed 6 minutes.';
export const releaseDeckMusicSlotCapMessage =
  'Release Deck already has 3 active music slots. Choose a different active song combination; this MVP path does not auto-replace tracks or create an extra active music slot.';
export const releaseDeckMaxSourceDurationMessage =
  'Release Deck active source time cannot exceed 15 minutes. Choose a different active song combination; this MVP path does not auto-replace tracks.';
export const releaseDeckMissingHomeSceneMessage =
  'An active source with a resolved Home Scene is required before releasing a single.';

type ReleaseDeckReadinessTrack = {
  artistBandId?: string | null;
  duration: number;
  status?: string | null;
};

type ReleaseDeckReadinessInput = {
  activeSourceId: string;
  communityId: string | null;
  tracks: ReleaseDeckReadinessTrack[];
};

export type ReleaseDeckReadiness = {
  activeDurationSeconds: number;
  capReached: boolean;
  hasSourceOwnedReadyTrack: boolean;
  isAtActiveSourceCap: boolean;
  isAtMusicSlotCap: boolean;
  missingHomeScene: boolean;
  openMusicSlots: number;
  readyForTesting: boolean;
  sourceOwnedReadyTrackCount: number;
};

function normalizeHttpUrl(value: string, errorMessage: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(errorMessage);
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(errorMessage);
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(errorMessage);
  }

  return parsed.toString();
}

function normalizeOptionalHttpUrl(value: string, errorMessage: string) {
  if (!value.trim()) return undefined;
  return normalizeHttpUrl(value, errorMessage);
}

export function buildReleaseDeckTrackPayload(
  form: ReleaseDeckFormInput,
  activeSource: ManagedSourceAccount,
  communityId: string,
): CreateTrackInput {
  const title = form.title.trim();
  if (!title) {
    throw new Error('Title is required before releasing a single.');
  }

  const duration = Number(form.duration.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('Duration must be a positive number of seconds.');
  }
  if (duration > releaseDeckMaxTrackSeconds) {
    throw new Error(releaseDeckMaxTrackDurationMessage);
  }

  return {
    title,
    artist: activeSource.name,
    artistBandId: activeSource.id,
    album: form.album.trim() || undefined,
    duration,
    fileUrl: normalizeHttpUrl(form.fileUrl, hostedAudioUrlMessage),
    coverArt: normalizeOptionalHttpUrl(form.coverArt, hostedCoverUrlMessage),
    communityId,
    status: 'ready',
  };
}

export function getReleaseDeckReadiness({
  activeSourceId,
  communityId,
  tracks,
}: ReleaseDeckReadinessInput): ReleaseDeckReadiness {
  const sourceOwnedReadyTracks = tracks.filter(
    (track) => track.artistBandId === activeSourceId && track.status === 'ready',
  );
  const activeDurationSeconds = sourceOwnedReadyTracks.reduce((total, track) => total + track.duration, 0);
  const sourceOwnedReadyTrackCount = sourceOwnedReadyTracks.length;
  const isAtMusicSlotCap = sourceOwnedReadyTrackCount >= releaseDeckMusicSlotCount;
  const isAtActiveSourceCap = activeDurationSeconds >= releaseDeckMaxSourceSeconds;
  const missingHomeScene = !communityId;

  return {
    activeDurationSeconds,
    capReached: isAtMusicSlotCap || isAtActiveSourceCap,
    hasSourceOwnedReadyTrack: sourceOwnedReadyTrackCount > 0,
    isAtActiveSourceCap,
    isAtMusicSlotCap,
    missingHomeScene,
    openMusicSlots: Math.max(0, releaseDeckMusicSlotCount - sourceOwnedReadyTrackCount),
    readyForTesting: Boolean(communityId && sourceOwnedReadyTrackCount > 0),
    sourceOwnedReadyTrackCount,
  };
}

export function getReleaseDeckSubmitBlockReason(
  readiness: ReleaseDeckReadiness,
  nextTrackDurationSeconds = 0,
): string | null {
  if (readiness.missingHomeScene) {
    return releaseDeckMissingHomeSceneMessage;
  }

  if (readiness.isAtMusicSlotCap) {
    return releaseDeckMusicSlotCapMessage;
  }

  if (readiness.activeDurationSeconds + nextTrackDurationSeconds > releaseDeckMaxSourceSeconds) {
    return releaseDeckMaxSourceDurationMessage;
  }

  return null;
}
