"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Trophy, BookOpen, FlaskConical, Flame, Star } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";

const ICONS: Record<string, typeof Award> = {
  award: Award,
  trophy: Trophy,
  "book-open": BookOpen,
  "flask-conical": FlaskConical,
  flame: Flame,
  star: Star,
};

export function AchievementsTimeline() {
  const hydrated = useHydrated();
  const events = useProgressStore((s) => s.achievements);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Hall of Achievements</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-72 px-4 pb-4">
          {hydrated && events.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">
              Your milestone timeline appears here as you read notes, run experiments, ace quizzes, and unlock badges.
            </p>
          )}
          <ul className="space-y-2 pt-2">
            {events.map((e) => {
              const Icon = ICONS[e.icon ?? "star"] ?? Star;
              return (
                <li key={e.id} className="flex items-start gap-3 rounded-md border bg-card/40 px-3 py-2 text-sm">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="font-medium">{e.label}</p>
                    {e.detail && <p className="text-xs text-muted-foreground">{e.detail}</p>}
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(e.at).toLocaleString()}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
