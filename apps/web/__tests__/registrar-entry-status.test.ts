import {
  formatRegistrarEntryStatus,
  getRegistrarInviteLinks,
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
});
