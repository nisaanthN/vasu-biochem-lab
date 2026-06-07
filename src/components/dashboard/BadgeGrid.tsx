"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIcon } from "@/components/gamification/BadgeIcon";
import { BADGES } from "@/lib/gamification/badges";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { cn } from "@/lib/utils";

export function BadgeGrid() {
  const hydrated = useHydrated();
  const badges = useProgressStore((s) => s.badges);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b) => {
            const unlocked = hydrated && Boolean(badges[b.id]);
            const isHiddenLocked = b.hidden && !unlocked;
            return (
              <div
                key={b.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 transition",
                  unlocked ? "border-primary/40 bg-primary/5" : "opacity-60",
                )}
              >
                <div
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
                    unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <BadgeIcon name={b.icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className={cn("text-sm font-semibold", isHiddenLocked && "italic")}>
                    {isHiddenLocked ? "??? Hidden badge" : b.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {isHiddenLocked ? "Unlock by surprising the system." : b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
