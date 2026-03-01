import { usePlotUiStore } from '../src/store/plot-ui';

describe('plot UI store', () => {
  beforeEach(() => {
    usePlotUiStore.getState().reset();
  });

  it('starts in collapsed radiyo mode', () => {
    const state = usePlotUiStore.getState();
    expect(state.panelState).toBe('collapsed');
    expect(state.playerMode).toBe('radiyo');
    expect(state.plotSnapshot).toBeNull();
  });

  it('supports explicit panel transitions and toggle fallback', () => {
    usePlotUiStore.getState().setPanelState('peek');
    expect(usePlotUiStore.getState().panelState).toBe('peek');

    usePlotUiStore.getState().setPanelState('expanded');
    expect(usePlotUiStore.getState().isExpanded()).toBe(true);

    usePlotUiStore.getState().toggleExpanded();
    expect(usePlotUiStore.getState().panelState).toBe('collapsed');
  });

  it('switches player mode explicitly', () => {
    usePlotUiStore.getState().switchToCollection();
    expect(usePlotUiStore.getState().playerMode).toBe('collection');

    usePlotUiStore.getState().switchToRadiyo();
    expect(usePlotUiStore.getState().playerMode).toBe('radiyo');
  });

  it('stores and clears plot snapshot for restore-on-collapse behavior', () => {
    usePlotUiStore.getState().setPlotSnapshot({
      activeTab: 'Feed',
      selectedTier: 'city',
      selectedCommunityId: 'community-1',
    });

    expect(usePlotUiStore.getState().plotSnapshot).toEqual({
      activeTab: 'Feed',
      selectedTier: 'city',
      selectedCommunityId: 'community-1',
    });

    usePlotUiStore.getState().clearPlotSnapshot();
    expect(usePlotUiStore.getState().plotSnapshot).toBeNull();
  });
});
