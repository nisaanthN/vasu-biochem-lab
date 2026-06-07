"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { namespacedKey } from "@/lib/storage/localStore";

interface SettingsState {
  reducedMotion: boolean;
  soundEnabled: boolean;
  hasSeenWelcome: boolean;
}

interface SettingsActions {
  setReducedMotion: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  markWelcomeSeen: () => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      reducedMotion: false,
      soundEnabled: false,
      hasSeenWelcome: false,
      setReducedMotion: (v) => set({ reducedMotion: v }),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      markWelcomeSeen: () => set({ hasSeenWelcome: true }),
    }),
    {
      name: namespacedKey("settings"),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
