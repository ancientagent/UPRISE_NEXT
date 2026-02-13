import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GpsStatus = 'unknown' | 'granted' | 'denied';

export interface HomeSceneSelection {
  city: string;
  state: string;
  musicCommunity: string;
  tasteTag?: string;
}

interface OnboardingState {
  homeScene: HomeSceneSelection | null;
  gpsStatus: GpsStatus;
  gpsCoords?: { latitude: number; longitude: number };
  setHomeScene: (homeScene: HomeSceneSelection) => void;
  setGpsStatus: (status: GpsStatus, coords?: { latitude: number; longitude: number }) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      homeScene: null,
      gpsStatus: 'unknown',
      gpsCoords: undefined,
      setHomeScene: (homeScene) => set({ homeScene }),
      setGpsStatus: (status, coords) => set({ gpsStatus: status, gpsCoords: coords }),
      reset: () => set({ homeScene: null, gpsStatus: 'unknown', gpsCoords: undefined }),
    }),
    { name: 'onboarding-storage' }
  )
);
