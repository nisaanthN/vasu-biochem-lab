"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { showXPToast } from "@/components/gamification/XPToast";

interface Props {
  slug: string;
  title: string;
  objective: string;
  unitTitle: string;
  unitId: string;
  estimatedMinutes: number;
  xp: number;
  children: ReactNode;
  observationsTitle?: string;
  observations?: ReactNode;
}

export function ExperimentShell({
  slug,
  title,
  objective,
  unitTitle,
  unitId,
  estimatedMinutes,
  xp,
  children,
  observationsTitle = "Observations",
  observations,
}: Props) {
  const hydrated = useHydrated();
  const recordAttempt = useProgressStore((s) => s.recordExperimentAttempt);
  const recordCompletion = useProgressStore((s) => s.recordExperimentCompletion);
  const completed = useProgressStore((s) => Boolean(s.experiments[slug]?.completedAt));

  useEffect(() => {
    if (!hydrated) return;
    recordAttempt(slug);
  }, [hydrated, slug, recordAttempt]);

  const markComplete = () => {
    if (completed) return;
    recordCompletion(slug);
    showXPToast(xp, "Experiment completed");
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/experiments"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All experiments
      </Link>
      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-md uppercase">
            {unitId.replace("-", " ")}
          </Badge>
          <span className="text-xs text-muted-foreground">{unitTitle}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{objective}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> ~{estimatedMinutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> +{xp} XP on completion
          </span>
        </div>
      </header>

      <div className="mt-6">{children}</div>

      <section className="mt-6 rounded-lg border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold">{observationsTitle}</h2>
          <Button size="sm" onClick={markComplete} disabled={completed}>
            {completed ? "Completed" : "Mark experiment complete"}
          </Button>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">{observations}</div>
      </section>
    </div>
  );
}
