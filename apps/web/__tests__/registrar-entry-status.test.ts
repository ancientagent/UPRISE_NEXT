import {
  formatRegistrarEntryStatus,
  getRegistrarInviteLinks,
  getRegistrarPlotSummary,
  getRegistrarSyncEligibleCount,
} from '../src/lib/registrar/entryStatus';

describe('registrar entry helpers', () => {
  it('formats registrar statuses', () => {
    expect(formatRegistrarEntryStatus('submitted')).toBe('Submitted');
    expect(formatRegistrarEntryStatus('materialized')).toBe('Materialized');
    expect(formatRegistrarEntryStatus('queued')).toBe('queued');
  });

  it('builds default invite links from origin', () => {
    expect(getRegistrarInviteLinks({ origin: 'https://app.uprise.local/' })).toEqual({
      mobileAppUrl: 'https://uprise.app/mobile',
      webAppUrl: 'https://app.uprise.local/registrar',
    });
  });

  it('uses explicit invite links when provided', () => {
    expect(
      getRegistrarInviteLinks({
        origin: 'https://app.uprise.local',
        mobileAppUrl: 'https://m.example/app',
        webAppUrl: 'https://web.example/band',
      }),
    ).toEqual({
      mobileAppUrl: 'https://m.example/app',
      webAppUrl: 'https://web.example/band',
    });
  });

  it('computes sync-eligible member count from existing + claimed', () => {
    expect(getRegistrarSyncEligibleCount({ existingUserCount: 2, claimedCount: 1 })).toBe(3);
    expect(getRegistrarSyncEligibleCount({ existingUserCount: 0, claimedCount: 0 })).toBe(0);
    expect(getRegistrarSyncEligibleCount({})).toBe(0);
  });

  it('summarizes registrar entries for plot status panel', () => {
    const summary = getRegistrarPlotSummary([
      {
        status: 'submitted',
        pendingInviteCount: 2,
        queuedInviteCount: 1,
        sentInviteCount: 0,
        failedInviteCount: 0,
        updatedAt: '2026-02-25T10:00:00.000Z',
      },
      {
        status: 'materialized',
        pendingInviteCount: 0,
        queuedInviteCount: 0,
        sentInviteCount: 1,
        failedInviteCount: 1,
        updatedAt: '2026-02-25T11:00:00.000Z',
      },
    ]);

    expect(summary).toEqual({
      totalEntries: 2,
      submittedCount: 1,
      materializedCount: 1,
      pendingInviteCount: 2,
      queuedInviteCount: 1,
      sentInviteCount: 1,
      failedInviteCount: 1,
      latestStatus: 'materialized',
    });
  });

  it('handles empty registrar summary input', () => {
    expect(getRegistrarPlotSummary([])).toEqual({
      totalEntries: 0,
      submittedCount: 0,
      materializedCount: 0,
      pendingInviteCount: 0,
      queuedInviteCount: 0,
      sentInviteCount: 0,
      failedInviteCount: 0,
      latestStatus: null,
    });
  });
});
