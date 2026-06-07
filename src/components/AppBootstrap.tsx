"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useStreakHeartbeat } from "@/hooks/useStreakHeartbeat";
import { useBadgeWatcher } from "@/hooks/useBadgeWatcher";
import { useSettingsStore } from "@/stores/settingsStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { useProgressStore } from "@/stores/progressStore";
import { makeXPEvent } from "@/lib/gamification/xp";

export function AppBootstrap() {
  useStreakHeartbeat();
  useBadgeWatcher();
  const hydrated = useHydrated();
  const hasSeenWelcome = useSettingsStore((s) => s.hasSeenWelcome);
  const markWelcomeSeen = useSettingsStore((s) => s.markWelcomeSeen);
  const addXP = useProgressStore((s) => s.addXP);

  useEffect(() => {
    if (!hydrated) return;
    if (!hasSeenWelcome) {
      addXP(makeXPEvent("note_read", 0));
      toast("Welcome to BioPharm Lab", {
        description: "Your AI study plan, virtual lab, and quiz coach — all offline-first.",
        duration: 4500,
      });
      markWelcomeSeen();
    }
  }, [hydrated, hasSeenWelcome, addXP, markWelcomeSeen]);

  return null;
}
