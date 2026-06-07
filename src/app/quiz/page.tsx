import Link from "next/link";
import { GraduationCap, Shuffle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SYLLABUS } from "@/lib/content/syllabus";
import { loadAllMCQs } from "@/lib/content/loadMCQs";

export const metadata = {
  title: "Quiz",
  description: "Practice or adaptive MCQs targeting weak areas with SM-2 spaced repetition.",
};

export default async function QuizIndex() {
  const all = await loadAllMCQs();
  const totalQuestions = all.length;
  const perUnit = SYLLABUS.map((u) => ({
    unit: u,
    count: all.filter((q) => q.unitId === u.id).length,
  }));

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Quiz</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Test what you know</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Two modes. Practice gives you a random 10 from a unit. Adaptive picks questions targeting your weak areas and SM-2 due cards.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="mt-3">Adaptive mode</CardTitle>
            <CardDescription>
              Questions chosen by our spaced-repetition + weak-area engine. This is the recommended daily practice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full"><Link href="/quiz/adaptive"><GraduationCap className="mr-1 h-4 w-4" /> Start adaptive quiz</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Shuffle className="h-5 w-5" />
            </div>
            <CardTitle className="mt-3">Practice mode</CardTitle>
            <CardDescription>
              Random 10 questions from your chosen unit. Good for cramming before a specific exam topic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full"><Link href="/quiz/practice"><Shuffle className="mr-1 h-4 w-4" /> Open practice mode</Link></Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Question bank</h2>
        <p className="text-sm text-muted-foreground">{totalQuestions} questions across {SYLLABUS.length} units.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {perUnit.map(({ unit, count }) => (
            <Link
              key={unit.id}
              href={`/quiz/practice?unit=${unit.id}`}
              className="flex items-center justify-between rounded-md border bg-card px-4 py-3 text-sm transition hover:border-primary/40"
            >
              <div>
                <p className="font-medium">{unit.title}</p>
                <p className="text-xs text-muted-foreground">{unit.subtitle}</p>
              </div>
              <Badge variant="secondary">{count}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
