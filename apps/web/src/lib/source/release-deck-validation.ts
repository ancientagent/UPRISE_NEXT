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
export const releaseDeckMaxTrackSeconds = 6 * 60;
export const releaseDeckMaxTrackDurationMessage = 'Release Deck tracks cannot exceed 6 minutes.';

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
