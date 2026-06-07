"use client";

import { XPBar } from "@/components/dashboard/XPBar";
import { BadgeGrid } from "@/components/dashboard/BadgeGrid";
import { WeakAreaChart } from "@/components/dashboard/WeakAreaChart";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { AchievementsTimeline } from "@/components/dashboard/AchievementsTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";

export default function DashboardPage() {
  const hydrated = useHydrated();
  const totalNotes = useProgressStore((s) => Object.keys(s.notes).length);
  const totalExperiments = useProgressStore((s) => Object.values(s.experiments).filter((e) => e.completedAt).length);
  const totalMcq = useProgressStore((s) => s.totalMcqAttempted);
  const accuracy = useProgressStore((s) => (s.totalMcqAttempted === 0 ? 0 : Math.round((s.totalMcqCorrect / s.totalMcqAttempted) * 100)));

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Your progress</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Everything you do across the platform — reading notes, running experiments, answering quizzes, asking the tutor — flows here. Your AI study plan refreshes each visit.
        </p>
      </div>

      <div className="grid gap-4">
        <XPBar />
        <div className="grid gap-4 lg:grid-cols-4">
          <StatCard label="Notes read" value={hydrated ? totalNotes : "—"} hint="out of 10 in v1" />
          <StatCard label="Experiments done" value={hydrated ? totalExperiments : "—"} hint="out of 5" />
          <StatCard label="MCQs attempted" value={hydrated ? totalMcq : "—"} hint="across all sessions" />
          <StatCard label="Overall accuracy" value={hydrated ? `${accuracy}%` : "—"} hint="MCQ correctness" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <RecommendationCard />
          <WeakAreaChart />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <BadgeGrid />
          <AchievementsTimeline />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-normal text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
