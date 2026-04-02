import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/storage-keys';

interface SoundState {
  enabled: boolean;
  volume: number;
  toggleSound: () => void;
  setVolume: (v: number) => void;
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      enabled: true,
      volume: 0.5,
      toggleSound: () => set((s) => ({ enabled: !s.enabled })),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
    }),
    {
      name: STORAGE_KEYS.SOUND,
      partialize: (state) => ({ enabled: state.enabled, volume: state.volume }),
    },
  ),
);
