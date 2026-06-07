"use client";

import { Trophy, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/stores/progressStore";
import { getLevelInfo } from "@/lib/gamification/levels";
import { useHydrated } from "@/hooks/useHydratedStore";

export function XPBar() {
  const hydrated = useHydrated();
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streakDays);
  const info = getLevelInfo(xp);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Level {info.level}</p>
            </div>
            <p className="mt-1 text-2xl font-bold">{info.title}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-3xl font-bold">{hydrated ? xp.toLocaleString() : "—"}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>{info.xpIntoLevel} XP this level</span>
            <span>{info.xpForLevel} XP to next</span>
          </div>
          <Progress value={info.progressFraction * 100} className="h-2" />
        </div>
        {hydrated && streak > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3 py-1 text-xs">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-semibold">{streak}-day streak</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
