"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useProgressStore } from "@/stores/progressStore";
import { findBadge } from "@/lib/gamification/badges";
import { useHydrated } from "./useHydratedStore";

export function useBadgeWatcher() {
  const hydrated = useHydrated();
  const badges = useProgressStore((s) => s.badges);
  const level = useProgressStore((s) => s.level);
  const prevBadgeIdsRef = useRef<Set<string> | null>(null);
  const prevLevelRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const ids = new Set(Object.keys(badges));
    if (prevBadgeIdsRef.current === null) {
      prevBadgeIdsRef.current = ids;
      return;
    }
    const newly = [...ids].filter((id) => !prevBadgeIdsRef.current!.has(id));
    for (const id of newly) {
      const b = findBadge(id);
      if (!b || b.hidden === false) {
        // visible badge
      }
      toast.success(`Badge unlocked: ${b?.name ?? id}`, {
        description: b?.description,
        duration: 5000,
      });
    }
    prevBadgeIdsRef.current = ids;
  }, [badges, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (prevLevelRef.current === null) {
      prevLevelRef.current = level;
      return;
    }
    if (level > prevLevelRef.current) {
      toast(`Level up — now level ${level}!`, {
        description: "Keep going. Your AI study plan refreshes daily.",
        duration: 5000,
      });
    }
    prevLevelRef.current = level;
  }, [level, hydrated]);
}
