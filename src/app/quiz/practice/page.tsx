import { QuizRunner } from "@/components/quiz/QuizRunner";
import { loadAllMCQs } from "@/lib/content/loadMCQs";
import type { UnitId } from "@/types/content";

export const metadata = { title: "Practice quiz" };

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ unit?: string }> }) {
  const sp = await searchParams;
  const all = await loadAllMCQs();
  const unit = sp.unit as UnitId | undefined;
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Practice mode</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {unit ? `Practice — ${unit.replace("-", " ").toUpperCase()}` : "Practice — all units"}
        </h1>
      </div>
      <QuizRunner pool={all} mode="practice" unitFilter={unit} />
    </div>
  );
}
