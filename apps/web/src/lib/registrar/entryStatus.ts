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
