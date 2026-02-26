export function formatRegistrarEntryStatus(status: string): string {
  if (status === 'submitted') return 'Submitted';
  if (status === 'materialized') return 'Materialized';
  return status;
}

export function getRegistrarInviteLinks(params: {
  origin?: string;
  mobileAppUrl?: string;
  webAppUrl?: string;
} = {}): { mobileAppUrl: string; webAppUrl: string } {
  const safeOrigin = params.origin?.trim().replace(/\/$/, '') || 'https://uprise.app';
  const mobileAppUrl = params.mobileAppUrl?.trim() || 'https://uprise.app/mobile';
  const webAppUrl = params.webAppUrl?.trim() || `${safeOrigin}/registrar`;

  return {
    mobileAppUrl,
    webAppUrl,
  };
}

export function getRegistrarSyncEligibleCount(params: {
  existingUserCount?: number;
  claimedCount?: number;
}): number {
  return (params.existingUserCount ?? 0) + (params.claimedCount ?? 0);
}

export interface RegistrarPlotSummaryEntry {
  status: string;
  pendingInviteCount?: number;
  queuedInviteCount?: number;
  sentInviteCount?: number;
  failedInviteCount?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface RegistrarPlotSummary {
  totalEntries: number;
  submittedCount: number;
  materializedCount: number;
  pendingInviteCount: number;
  queuedInviteCount: number;
  sentInviteCount: number;
  failedInviteCount: number;
  latestStatus: string | null;
}

export function getRegistrarPlotSummary(entries: RegistrarPlotSummaryEntry[]): RegistrarPlotSummary {
  const summary: RegistrarPlotSummary = {
    totalEntries: entries.length,
    submittedCount: 0,
    materializedCount: 0,
    pendingInviteCount: 0,
    queuedInviteCount: 0,
    sentInviteCount: 0,
    failedInviteCount: 0,
    latestStatus: null,
  };

  let latestTimestamp = 0;

  for (const entry of entries) {
    if (entry.status === 'submitted') summary.submittedCount += 1;
    if (entry.status === 'materialized') summary.materializedCount += 1;

    summary.pendingInviteCount += entry.pendingInviteCount ?? 0;
    summary.queuedInviteCount += entry.queuedInviteCount ?? 0;
    summary.sentInviteCount += entry.sentInviteCount ?? 0;
    summary.failedInviteCount += entry.failedInviteCount ?? 0;

    const nextTimestamp = Date.parse(entry.updatedAt ?? entry.createdAt ?? '');
    if (Number.isNaN(nextTimestamp)) continue;
    if (nextTimestamp < latestTimestamp) continue;

    latestTimestamp = nextTimestamp;
    summary.latestStatus = entry.status;
  }

  return summary;
}
