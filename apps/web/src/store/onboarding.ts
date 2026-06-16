import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GpsStatus = 'unknown' | 'granted' | 'denied';
export type PersistedPlayerTier = 'city' | 'state';

export interface HomeSceneSelection {
  city: string;
  state: string;
  musicCommunity: string;
  tasteTag?: string;
}

export interface PioneerFollowUp {
  homeScene: HomeSceneSelection;
}

export interface TunedSceneContext {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
  tier: string;
  isActive: boolean;
}

interface OnboardingState {
  homeScene: HomeSceneSelection | null;
  pioneerFollowUp: PioneerFollowUp | null;
  tunedSceneId: string | null;
  tunedScene: TunedSceneContext | null;
  isVisitor: boolean | null;
  playerTier: PersistedPlayerTier | null;
  gpsStatus: GpsStatus;
  gpsCoords?: { latitude: number; longitude: number };
  votingEligible: boolean;
  gpsReason: string | null;
  setHomeScene: (homeScene: HomeSceneSelection) => void;
  setPioneerFollowUp: (followUp: PioneerFollowUp | null) => void;
  setTunedSceneId: (sceneId: string | null) => void;
  setPlayerTier: (tier: PersistedPlayerTier | null) => void;
  setDiscoveryContext: (
    payload: { tunedSceneId: string | null; tunedScene: TunedSceneContext | null; isVisitor: boolean | null }
  ) => void;
  setGpsStatus: (status: GpsStatus, coords?: { latitude: number; longitude: number }) => void;
  setVotingEligibility: (eligible: boolean, reason?: string | null) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      homeScene: null,
      pioneerFollowUp: null,
      tunedSceneId: null,
      tunedScene: null,
      isVisitor: null,
      playerTier: null,
      gpsStatus: 'unknown',
      gpsCoords: undefined,
      votingEligible: false,
      gpsReason: null,
      setHomeScene: (homeScene) => set({ homeScene, pioneerFollowUp: null }),
      setPioneerFollowUp: (pioneerFollowUp) => set({ pioneerFollowUp }),
      setTunedSceneId: (tunedSceneId) => set({ tunedSceneId }),
      setPlayerTier: (playerTier) => set({ playerTier }),
      setDiscoveryContext: (payload) =>
        set({
          tunedSceneId: payload.tunedSceneId,
          tunedScene: payload.tunedScene,
          isVisitor: payload.isVisitor,
        }),
      setGpsStatus: (status, coords) => set({ gpsStatus: status, gpsCoords: coords }),
      setVotingEligibility: (eligible, reason = null) => set({ votingEligible: eligible, gpsReason: reason }),
      reset: () =>
        set({
          homeScene: null,
          pioneerFollowUp: null,
          tunedSceneId: null,
          tunedScene: null,
          isVisitor: null,
          playerTier: null,
          gpsStatus: 'unknown',
          gpsCoords: undefined,
          votingEligible: false,
          gpsReason: null,
        }),
    }),
    { name: 'onboarding-storage' }
  )
);
