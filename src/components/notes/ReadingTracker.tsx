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
    <>
      {/* Top thin progress bar — always visible */}
      <div className="fixed left-0 right-0 top-14 z-30 h-1 bg-transparent">
        <div
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `${scrollPct * 100}%` }}
        />
      </div>
      {/* Floating pill with details — appears on tablet+ */}
      <div className="fixed bottom-5 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 rounded-full border-2 bg-background/95 px-4 py-2.5 text-sm shadow-lg backdrop-blur sm:flex">
        <span className="text-muted-foreground">Reading progress</span>
        <Progress value={scrollPct * 100} className="h-2 w-32" />
        <span className="font-semibold tabular-nums">{Math.round(scrollPct * 100)}%</span>
        <span className="text-muted-foreground/60">·</span>
        <span className="text-muted-foreground">~{estimatedMinutes} min</span>
        {completed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            ✓ Complete
          </span>
        )}
      </div>
    </>
  );
}
