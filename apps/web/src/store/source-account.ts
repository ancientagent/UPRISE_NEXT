import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SourceAccountState {
  activeSourceId: string | null;
  setActiveSourceId: (sourceId: string | null) => void;
  clearActiveSourceId: () => void;
}

export const useSourceAccountStore = create<SourceAccountState>()(
  persist(
    (set) => ({
      activeSourceId: null,
      setActiveSourceId: (sourceId) => set({ activeSourceId: sourceId }),
      clearActiveSourceId: () => set({ activeSourceId: null }),
    }),
    {
      name: 'source-account-storage',
    },
  ),
);
