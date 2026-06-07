"use client";

import { useEffect, useRef, useState } from "react";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { showXPToast } from "@/components/gamification/XPToast";
import { Progress } from "@/components/ui/progress";

export function ReadingTracker({
  unitId,
  topicId,
  estimatedMinutes,
}: {
  unitId: string;
  topicId: string;
  estimatedMinutes: number;
}) {
  const hydrated = useHydrated();
  const recordNoteRead = useProgressStore((s) => s.recordNoteRead);
  const alreadyRead = useProgressStore((s) => Boolean(s.notes[topicId]));
  const [scrollPct, setScrollPct] = useState(0);
  const [completed, setCompleted] = useState(false);
  const startedAtRef = useRef<number>(Date.now());
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const scrolled = total > 0 ? window.scrollY / total : 1;
      const pct = Math.min(1, Math.max(0, scrolled));
      setScrollPct(pct);
      if (pct >= 0.8 && !triggeredRef.current) {
        const dwell = Math.round((Date.now() - startedAtRef.current) / 1000);
        if (dwell >= 60 || alreadyRead) {
          triggeredRef.current = true;
          const wasNew = !alreadyRead;
          recordNoteRead(topicId, unitId, dwell);
          setCompleted(true);
          if (wasNew) {
            showXPToast(20, "Note read");
          }
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hydrated, alreadyRead, topicId, unitId, recordNoteRead]);

  return (
    <div className="fixed bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 rounded-full border bg-background/90 px-4 py-2 text-xs shadow-lg backdrop-blur sm:flex">
      <span className="text-muted-foreground">Reading progress</span>
      <Progress value={scrollPct * 100} className="h-1.5 w-32" />
      <span className="text-muted-foreground">{Math.round(scrollPct * 100)}%</span>
      <span className="text-muted-foreground/60">·</span>
      <span className="text-muted-foreground">~{estimatedMinutes} min</span>
      {completed && <span className="font-medium text-primary">Complete</span>}
    </div>
  );
}
