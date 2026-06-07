import { QuizRunner } from "@/components/quiz/QuizRunner";
import { loadAllMCQs } from "@/lib/content/loadMCQs";
import type { UnitId } from "@/types/content";

export const metadata = { title: "Adaptive quiz" };

export default async function AdaptivePage({ searchParams }: { searchParams: Promise<{ unit?: string }> }) {
  const sp = await searchParams;
  const all = await loadAllMCQs();
  const unit = sp.unit as UnitId | undefined;
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Adaptive mode · SM-2 + weak-area targeting</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Your AI-chosen quiz
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The questions below are picked from your due review queue and the topics where your accuracy is weakest. Fresh topics fill in any remaining slots.
        </p>
      </div>
      <QuizRunner pool={all} mode="adaptive" unitFilter={unit} />
    </div>
  );
}
