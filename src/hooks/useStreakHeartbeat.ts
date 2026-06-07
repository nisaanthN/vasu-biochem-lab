"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "./useHydratedStore";

export function useStreakHeartbeat() {
  const hydrated = useHydrated();
  const heartbeat = useProgressStore((s) => s.heartbeat);
  useEffect(() => {
    if (!hydrated) return;
    heartbeat();
  }, [hydrated, heartbeat]);
}
