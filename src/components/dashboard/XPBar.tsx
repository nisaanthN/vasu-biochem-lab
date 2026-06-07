"use client";

import { Trophy, Flame, Sparkles } from "lucide-react";
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
    <Card className="border-2 bg-gradient-to-br from-primary/10 via-card to-card">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Level {info.level}</p>
            </div>
            <p className="mt-1 text-3xl font-bold leading-tight">{info.title}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-5xl font-bold tabular-nums leading-none">{hydrated ? xp.toLocaleString() : "—"}</p>
            <p className="mt-1 text-sm uppercase tracking-wider text-muted-foreground">Total XP</p>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span><span className="font-semibold text-foreground">{info.xpIntoLevel}</span> XP this level</span>
            <span><span className="font-semibold text-foreground">{info.xpForLevel}</span> XP to next</span>
          </div>
          <Progress value={info.progressFraction * 100} className="h-3" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {hydrated && streak > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-semibold">{streak}-day streak</span>
            </div>
          )}
          {hydrated && info.level >= 5 && (
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-primary/10 px-3.5 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">Active learner</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
