"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChatMessage } from "@/types/tutor";
import { namespacedKey } from "@/lib/storage/localStore";

interface TutorState {
  messages: ChatMessage[];
}
interface TutorActions {
  append: (msg: ChatMessage) => void;
  clear: () => void;
}

export const useTutorStore = create<TutorState & TutorActions>()(
  persist(
    (set) => ({
      messages: [],
      append: (msg) => set((s) => ({ messages: [...s.messages, msg].slice(-50) })),
      clear: () => set({ messages: [] }),
    }),
    {
      name: namespacedKey("tutor"),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
