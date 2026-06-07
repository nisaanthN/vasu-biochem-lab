"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { recommendNextTopic } from "@/lib/adaptive/recommender";
import { dueCards } from "@/lib/sm2/scheduler";

export function RecommendationCard() {
  const hydrated = useHydrated();
  const state = useProgressStore();
  if (!hydrated) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Your AI study plan</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Loading...</p></CardContent>
      </Card>
    );
  }
  const rec = recommendNextTopic(state);
  const due = dueCards(state.srs, 5);

  return (
    <Card className="border-primary/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Your AI study plan for today
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rec && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Recommended topic</p>
            <p className="mt-1 font-semibold">{rec.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{rec.blurb}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {rec.reasons.map((r, i) => (
                <Badge key={i} variant="secondary" className="rounded-md text-xs">{r}</Badge>
              ))}
            </div>
            <Button asChild className="mt-3" size="sm">
              <Link href={`/notes/${rec.unitId}/${rec.topicId}`}>
                Open note <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Today&apos;s review queue</p>
          {due.length === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">
              No SRS cards due yet — answer some MCQs to start building your review schedule.
            </p>
          ) : (
            <p className="mt-1 text-sm">
              <strong>{due.length}</strong> card{due.length === 1 ? "" : "s"} due for review.
              <Button asChild variant="link" className="ml-1 h-auto p-0 text-primary">
                <Link href="/quiz/adaptive">Run adaptive quiz</Link>
              </Button>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
