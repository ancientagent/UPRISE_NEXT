import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GpsStatus = 'unknown' | 'granted' | 'denied';

export interface HomeSceneSelection {
  city: string;
  state: string;
  musicCommunity: string;
  tasteTag?: string;
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
  tunedSceneId: string | null;
  tunedScene: TunedSceneContext | null;
  isVisitor: boolean | null;
  gpsStatus: GpsStatus;
  gpsCoords?: { latitude: number; longitude: number };
  votingEligible: boolean;
  gpsReason: string | null;
  setHomeScene: (homeScene: HomeSceneSelection) => void;
  setTunedSceneId: (sceneId: string | null) => void;
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
      tunedSceneId: null,
      tunedScene: null,
      isVisitor: null,
      gpsStatus: 'unknown',
      gpsCoords: undefined,
      votingEligible: false,
      gpsReason: null,
      setHomeScene: (homeScene) => set({ homeScene }),
      setTunedSceneId: (tunedSceneId) => set({ tunedSceneId }),
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
          tunedSceneId: null,
          tunedScene: null,
          isVisitor: null,
          gpsStatus: 'unknown',
          gpsCoords: undefined,
          votingEligible: false,
          gpsReason: null,
        }),
    }),
    { name: 'onboarding-storage' }
  )
);
