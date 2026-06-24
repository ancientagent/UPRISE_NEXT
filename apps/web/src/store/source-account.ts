import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SourceAccountState {
  activeSourceId: string | null;
  activeSourceUserId: string | null;
  setActiveSourceId: (sourceId: string | null, userId: string | null) => void;
  clearActiveSourceId: () => void;
}

export const useSourceAccountStore = create<SourceAccountState>()(
  persist(
    (set) => ({
      activeSourceId: null,
      activeSourceUserId: null,
      setActiveSourceId: (sourceId, userId) => set({ activeSourceId: sourceId, activeSourceUserId: userId }),
      clearActiveSourceId: () => set({ activeSourceId: null, activeSourceUserId: null }),
    }),
    {
      name: 'source-account-storage',
    },
  ),
);
