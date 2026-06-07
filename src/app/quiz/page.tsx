import Link from "next/link";
import { GraduationCap, Shuffle, Sparkles, ArrowRight } from "lucide-react";
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
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:py-12">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Quiz</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight leading-tight sm:text-5xl">Test what you know</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Two modes. Practice gives you a random 10 from a unit. Adaptive picks questions targeting your weak areas and SM-2 due cards.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="border-2 transition hover:border-primary/40">
          <CardHeader>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-xl">Adaptive mode</CardTitle>
            <CardDescription className="text-[15px] leading-relaxed">
              Questions chosen by our spaced-repetition + weak-area engine. This is the recommended daily practice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <Link href="/quiz/adaptive">
                <GraduationCap className="mr-1.5 h-5 w-5" /> Start adaptive quiz
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-2 transition hover:border-primary/40">
          <CardHeader>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Shuffle className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-xl">Practice mode</CardTitle>
            <CardDescription className="text-[15px] leading-relaxed">
              Random 10 questions from your chosen unit. Good for cramming before a specific exam topic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/quiz/practice">
                <Shuffle className="mr-1.5 h-5 w-5" /> Open practice mode
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold sm:text-3xl">Question bank by unit</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">
          <span className="font-semibold text-foreground">{totalQuestions}</span> questions across <span className="font-semibold text-foreground">{SYLLABUS.length}</span> units. Click any unit to practice from that bank.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {perUnit.map(({ unit, count }) => (
            <Link
              key={unit.id}
              href={`/quiz/practice?unit=${unit.id}`}
              className="group flex items-center justify-between gap-3 rounded-xl border-2 bg-card px-5 py-4 transition hover:border-primary/40 hover:bg-card/80"
            >
              <div className="min-w-0">
                <p className="text-base font-semibold">{unit.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{unit.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-md text-sm">{count}</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
