import { engagementToScore, isValidEngagementScore } from '../src/tracks/engagement.utils';

describe('engagementToScore', () => {
  it('returns 3 for full listen', () => {
    expect(engagementToScore('full')).toBe(3);
  });

  it('returns 2 for majority listen (>1/2)', () => {
    expect(engagementToScore('majority')).toBe(2);
  });

  it('returns 1 for partial listen (>=1/3)', () => {
    expect(engagementToScore('partial')).toBe(1);
  });

  it('returns 0 for skip', () => {
    expect(engagementToScore('skip')).toBe(0);
  });
});

describe('isValidEngagementScore', () => {
  it('returns true for non-negative scores (additive model)', () => {
    expect(isValidEngagementScore(0)).toBe(true);
    expect(isValidEngagementScore(1)).toBe(true);
    expect(isValidEngagementScore(3)).toBe(true);
    expect(isValidEngagementScore(100)).toBe(true);
  });

  it('returns false for negative scores', () => {
    expect(isValidEngagementScore(-1)).toBe(false);
    expect(isValidEngagementScore(-100)).toBe(false);
  });
});
