"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Sparkles, ClipboardList } from "lucide-react";
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
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <Link
        href="/experiments"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All experiments
      </Link>
      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-md uppercase tracking-wider">
            {unitId.replace("-", " ")}
          </Badge>
          <span className="text-sm text-muted-foreground">{unitTitle}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight leading-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-lg leading-relaxed text-muted-foreground">{objective}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> ~{estimatedMinutes} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> +{xp} XP on completion
          </span>
        </div>
      </header>

      <div className="mt-8">{children}</div>

      <section className="mt-8 rounded-xl border-2 bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">{observationsTitle}</h2>
          </div>
          <Button size="lg" onClick={markComplete} disabled={completed}>
            {completed ? "✓ Completed" : "Mark experiment complete"}
          </Button>
        </div>
        <div className="mt-4 text-[15px] leading-relaxed text-foreground/85 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_li]:leading-relaxed">{observations}</div>
      </section>
    </div>
  );
}
