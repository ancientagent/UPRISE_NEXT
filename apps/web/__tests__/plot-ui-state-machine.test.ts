import {
  canTransitionPanelState,
  isProfileExpanded,
  isRadiyoMode,
  togglePanelExpanded,
  transitionPanelState,
} from '../src/lib/plot-ui-state-machine';

describe('plot UI state machine', () => {
  it('allows collapse/peek/expand transitions including direct collapsed->expanded', () => {
    expect(canTransitionPanelState('collapsed', 'peek')).toBe(true);
    expect(canTransitionPanelState('peek', 'expanded')).toBe(true);
    expect(canTransitionPanelState('expanded', 'collapsed')).toBe(true);
    expect(canTransitionPanelState('collapsed', 'expanded')).toBe(true);
  });

  it('returns same target via transition helper when transition is valid', () => {
    expect(transitionPanelState('collapsed', 'expanded')).toBe('expanded');
    expect(transitionPanelState('expanded', 'peek')).toBe('peek');
    expect(transitionPanelState('peek', 'collapsed')).toBe('collapsed');
  });

  it('toggles expanded state for accessibility fallback path', () => {
    expect(togglePanelExpanded('collapsed')).toBe('expanded');
    expect(togglePanelExpanded('expanded')).toBe('collapsed');
    expect(togglePanelExpanded('peek')).toBe('expanded');
  });

  it('reports expanded and radiyo mode helpers correctly', () => {
    expect(isProfileExpanded('expanded')).toBe(true);
    expect(isProfileExpanded('collapsed')).toBe(false);

    expect(isRadiyoMode('radiyo')).toBe(true);
    expect(isRadiyoMode('collection')).toBe(false);
  });
});
