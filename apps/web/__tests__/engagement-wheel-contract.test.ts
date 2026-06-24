import {
  getEngagementWheelActions,
  RADIYO_WHEEL_ACTIONS,
  SPACE_WHEEL_ACTIONS,
} from '../src/components/plot/engagement-wheel';

describe('RADIYO vs SPACE engagement wheel contract', () => {
  it('keeps Play It Loud and Upvote on RADIYO and excludes Blast', () => {
    const labels = RADIYO_WHEEL_ACTIONS.map((action) => action.label);

    expect(labels).toEqual(['Report', 'Skip', 'Play It Loud', 'Collect', 'Upvote']);
    expect(labels).toContain('Play It Loud');
    expect(labels).toContain('Upvote');
    expect(labels).not.toContain('Blast');
    expect(labels).not.toContain('Recommend');
  });

  it('keeps Blast in SPACE with personal-player positions and excludes Upvote', () => {
    const labels = SPACE_WHEEL_ACTIONS.map((action) => action.label);

    expect(labels).toEqual(['Back', 'Pause', 'Blast', 'Recommend', 'Next']);
    expect(SPACE_WHEEL_ACTIONS).toEqual([
      { label: 'Back', position: '9:00' },
      { label: 'Pause', position: '10:00' },
      { label: 'Blast', position: '12:00' },
      { label: 'Recommend', position: '1:00' },
      { label: 'Next', position: '3:00' },
    ]);
    expect(labels).toContain('Blast');
    expect(labels).not.toContain('Play It Loud');
    expect(labels).not.toContain('Upvote');
  });

  it('routes wheel actions strictly by current player mode', () => {
    expect(getEngagementWheelActions('RADIYO')).toBe(RADIYO_WHEEL_ACTIONS);
    expect(getEngagementWheelActions('SPACE')).toBe(SPACE_WHEEL_ACTIONS);
  });
});
