export type PlotPanelState = 'collapsed' | 'peek' | 'expanded';
export type PlotPlayerMode = 'radiyo' | 'collection';
export type PlotTierScope = 'city' | 'state' | 'national';

export interface PlotViewSnapshot {
  activeTab: string;
  selectedTier: PlotTierScope;
  selectedCommunityId: string | null;
}

const ALLOWED_TRANSITIONS: Record<PlotPanelState, PlotPanelState[]> = {
  collapsed: ['peek', 'expanded'],
  peek: ['collapsed', 'expanded'],
  expanded: ['peek', 'collapsed'],
};

export function canTransitionPanelState(from: PlotPanelState, to: PlotPanelState): boolean {
  if (from === to) {
    return true;
  }
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function transitionPanelState(from: PlotPanelState, to: PlotPanelState): PlotPanelState {
  if (!canTransitionPanelState(from, to)) {
    throw new Error(`Invalid panel transition: ${from} -> ${to}`);
  }
  return to;
}

export function togglePanelExpanded(state: PlotPanelState): PlotPanelState {
  return state === 'expanded' ? 'collapsed' : 'expanded';
}

export function isProfileExpanded(state: PlotPanelState): boolean {
  return state === 'expanded';
}

export function isRadiyoMode(mode: PlotPlayerMode): boolean {
  return mode === 'radiyo';
}
