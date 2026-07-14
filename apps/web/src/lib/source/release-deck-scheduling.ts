import { api } from '@/lib/api';

export const releaseDeckScheduleLookaheadDays = 30;

export type ReleaseDeckScheduleMode = 'soonest' | 'chosen';

export type ReleaseDeckScheduleDiagnostic = {
  date: string;
  valid: boolean;
  reasons: Array<'DATE_DAILY_CAPACITY_FULL' | 'PROTECTED_WINDOW_CAPACITY_FULL'>;
};

export type ReleaseDeckScheduleAvailabilityData = {
  community: {
    id: string;
    name: string;
    city: string;
    state: string;
    musicCommunity: string;
    tier: string;
    isActive: boolean;
  };
  track: {
    id: string;
    title: string;
    sourceId: string;
    sourceName: string | null;
    playableSeconds: number;
  };
  from: string;
  days: number;
  soonestValidDate: string;
  alternatives: string[];
  diagnostics: ReleaseDeckScheduleDiagnostic[];
};

export type ExistingReleaseDeckSchedule = {
  id: string;
  status: string;
  scheduledFor: string;
  assignmentMode: ReleaseDeckScheduleMode;
  requestedFor: string | null;
};

export type ReleaseDeckScheduleAvailabilityError = {
  code: string;
  message: string;
  trackId?: string;
  reason?: string;
  requestedDate?: string;
  soonestValidDate?: string | null;
  alternatives?: string[];
  diagnostics?: ReleaseDeckScheduleDiagnostic[];
  schedule?: ExistingReleaseDeckSchedule;
};

export type ReleaseDeckScheduleAvailabilityResponse =
  | { success: true; data: ReleaseDeckScheduleAvailabilityData }
  | { success: false; error: ReleaseDeckScheduleAvailabilityError };

export type ReleaseDeckScheduleRecord = {
  id: string;
  trackId: string;
  communityId: string;
  artistBandId: string;
  scheduledFor: string;
  assignmentMode: ReleaseDeckScheduleMode;
  requestedFor: string | null;
  status: string;
  createdById: string;
};

export function toUtcDateOnly(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export async function getReleaseDeckScheduleAvailability(
  input: { communityId: string; trackId: string; from?: string; days?: number },
  token: string,
): Promise<ReleaseDeckScheduleAvailabilityResponse> {
  const query = new URLSearchParams({
    communityId: input.communityId,
    trackId: input.trackId,
    from: input.from ?? toUtcDateOnly(),
    days: String(input.days ?? releaseDeckScheduleLookaheadDays),
  });
  const response = await api.get<ReleaseDeckScheduleAvailabilityData>(
    `/release-deck/schedule/availability?${query.toString()}`,
    { token },
  );

  return response as ReleaseDeckScheduleAvailabilityResponse;
}

export async function createReleaseDeckSchedule(
  input: {
    communityId: string;
    trackId: string;
    mode: ReleaseDeckScheduleMode;
    requestedDate?: string;
  },
  token: string,
): Promise<ReleaseDeckScheduleRecord> {
  const response = await api.post<ReleaseDeckScheduleRecord>('/release-deck/schedule', input, { token });
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Release Deck schedule response was empty.');
  }
  return response.data;
}
