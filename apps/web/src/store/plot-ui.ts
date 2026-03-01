import { create } from 'zustand';
import {
  isProfileExpanded,
  togglePanelExpanded,
  transitionPanelState,
  type PlotPanelState,
  type PlotPlayerMode,
  type PlotViewSnapshot,
} from '@/lib/plot-ui-state-machine';

interface PlotUiState {
  panelState: PlotPanelState;
  playerMode: PlotPlayerMode;
  plotSnapshot: PlotViewSnapshot | null;
  setPanelState: (next: PlotPanelState) => void;
  toggleExpanded: () => void;
  setPlayerMode: (mode: PlotPlayerMode) => void;
  switchToCollection: () => void;
  switchToRadiyo: () => void;
  setPlotSnapshot: (snapshot: PlotViewSnapshot) => void;
  clearPlotSnapshot: () => void;
  isExpanded: () => boolean;
  reset: () => void;
}

const initialState = {
  panelState: 'collapsed' as PlotPanelState,
  playerMode: 'radiyo' as PlotPlayerMode,
  plotSnapshot: null as PlotViewSnapshot | null,
};

export const usePlotUiStore = create<PlotUiState>()((set, get) => ({
  ...initialState,
  setPanelState: (next) => {
    const current = get().panelState;
    const panelState = transitionPanelState(current, next);
    set({ panelState });
  },
  toggleExpanded: () => {
    const panelState = togglePanelExpanded(get().panelState);
    set({ panelState });
  },
  setPlayerMode: (playerMode) => set({ playerMode }),
  switchToCollection: () => set({ playerMode: 'collection' }),
  switchToRadiyo: () => set({ playerMode: 'radiyo' }),
  setPlotSnapshot: (plotSnapshot) => set({ plotSnapshot }),
  clearPlotSnapshot: () => set({ plotSnapshot: null }),
  isExpanded: () => isProfileExpanded(get().panelState),
  reset: () => set(initialState),
}));

export type { PlotPanelState, PlotPlayerMode, PlotViewSnapshot };
