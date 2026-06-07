"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, RotateCcw, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuizStore } from "@/stores/quizStore";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { selectMCQs } from "@/lib/adaptive/selector";
import { getTagId, getTopic } from "@/lib/content/syllabus";
import type { MCQ, UnitId } from "@/types/content";
import { cn } from "@/lib/utils";
import { showXPToast } from "@/components/gamification/XPToast";

const QUIZ_LENGTH = 10;

interface Props {
  pool: MCQ[];
  mode: "practice" | "adaptive";
  unitFilter?: UnitId;
}

export function QuizRunner({ pool, mode, unitFilter }: Props) {
  const hydrated = useHydrated();
  const quizQuestions = useQuizStore((s) => s.questions);
  const quizCurrentIndex = useQuizStore((s) => s.currentIndex);
  const quizAnswers = useQuizStore((s) => s.answers);
  const quizFinished = useQuizStore((s) => s.finished);
  const quizQuestionStartedAt = useQuizStore((s) => s.questionStartedAt);
  const quizStart = useQuizStore((s) => s.start);
  const quizAnswer = useQuizStore((s) => s.answer);
  const quizNext = useQuizStore((s) => s.next);
  const quizReset = useQuizStore((s) => s.reset);
  const recordMcqAttempt = useProgressStore((s) => s.recordMcqAttempt);
  const recordPerfectQuiz = useProgressStore((s) => s.recordPerfectQuiz);
  const [picked, setPicked] = useState<number | null>(null);
  const [perfectAwarded, setPerfectAwarded] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (quizQuestions.length > 0 || quizFinished) return;
    const state = useProgressStore.getState();
    const selected = selectMCQs(pool, state, { count: QUIZ_LENGTH, unitFilter, mode });
    if (selected.length > 0) quizStart(mode, selected);
  }, [hydrated, pool, mode, unitFilter, quizQuestions.length, quizFinished, quizStart]);

  if (!hydrated) return <Skeleton />;
  if (pool.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-base">
        <p className="font-semibold text-foreground">No questions available yet for this filter.</p>
        <p className="mt-2 text-muted-foreground">The MCQ bank is being expanded. Try a different unit, or open a note instead.</p>
        <Button asChild variant="outline" className="mt-3"><Link href="/notes">Browse notes</Link></Button>
      </div>
    );
  }
  if (quizQuestions.length === 0) {
    return <Skeleton />;
  }

  if (quizFinished) {
    // Recompute correctness at display time from source-of-truth so any stored flag drift is irrelevant.
    const scored = quizAnswers.map((a) => {
      const q = quizQuestions.find((q) => q.id === a.questionId);
      return { answer: a, question: q, correct: q ? a.selectedIndex === q.correctIndex : false };
    });
    const correctCount = scored.filter((s) => s.correct).length;
    const total = quizQuestions.length;
    const perfect = correctCount === total && total >= QUIZ_LENGTH;
    const onAwardPerfect = () => {
      if (perfect && !perfectAwarded) {
        recordPerfectQuiz();
        showXPToast(100, "Perfect quiz!");
        setPerfectAwarded(true);
      }
    };
    return (
      <ResultSummary
        score={correctCount}
        total={total}
        scored={scored}
        onReset={() => {
          quizReset();
          setPicked(null);
          setPerfectAwarded(false);
        }}
        onMount={onAwardPerfect}
      />
    );
  }

  const q = quizQuestions[quizCurrentIndex];
  const answered = picked !== null && quizAnswers.length > quizCurrentIndex;
  const submitted = picked !== null;

  const submit = () => {
    if (picked === null) return;
    if (answered) return; // prevent double submit
    const elapsed = Date.now() - quizQuestionStartedAt;
    const isCorrect = picked === q.correctIndex;
    quizAnswer(picked);
    recordMcqAttempt({
      questionId: q.id,
      tagId: getTagId(q.unitId, q.subTopicId),
      correct: isCorrect,
      mode,
      elapsedMs: elapsed,
    });
  };

  const nextQ = () => {
    quizNext();
    setPicked(null);
  };

  const correct = submitted && picked === q.correctIndex;
  const topic = getTopic(q.unitId, q.subTopicId);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium">Question {quizCurrentIndex + 1} of {quizQuestions.length}</span>
        <span>{mode === "adaptive" ? "Adaptive · weak-area targeted" : "Practice mode"}</span>
      </div>
      <Progress value={((quizCurrentIndex) / quizQuestions.length) * 100} className="h-1.5" />
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-md uppercase tracking-wide">{q.unitId.replace("-", " ")}</Badge>
            <Badge variant="outline" className="rounded-md">{q.difficulty}</Badge>
            <Badge variant="outline" className="rounded-md">{q.bloom}</Badge>
          </div>
          <CardTitle className="mt-4 text-xl leading-snug sm:text-2xl">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2.5">
            {q.options.map((opt, i) => {
              const isPicked = picked === i;
              const isAnsweredCorrect = answered && i === q.correctIndex;
              const isAnsweredWrong = answered && isPicked && !correct;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !answered && setPicked(i)}
                  disabled={answered}
                  className={cn(
                    "group flex w-full items-start gap-3 rounded-lg border-2 px-4 py-3.5 text-left text-base transition",
                    "disabled:cursor-default",
                    !answered && "hover:border-primary/60 hover:bg-primary/5",
                    isPicked && !answered && "border-primary bg-primary/10",
                    isAnsweredCorrect && "border-emerald-500 bg-emerald-500/10",
                    isAnsweredWrong && "border-rose-500 bg-rose-500/10",
                    !isPicked && !isAnsweredCorrect && "border-border bg-card",
                    answered && !isPicked && !isAnsweredCorrect && "opacity-50",
                  )}
                >
                  <span className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-md font-bold",
                    isAnsweredCorrect ? "bg-emerald-500 text-white" :
                    isAnsweredWrong ? "bg-rose-500 text-white" :
                    isPicked ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground",
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isAnsweredCorrect && <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />}
                  {isAnsweredWrong && <X className="mt-1 h-5 w-5 shrink-0 text-rose-500" />}
                </button>
              );
            })}
          </div>
          {answered && (
            <div className={cn(
              "rounded-lg border-2 p-5",
              correct ? "border-emerald-500/60 bg-emerald-500/5" : "border-rose-500/60 bg-rose-500/5",
            )}>
              <p className={cn("text-base font-bold", correct ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400")}>
                {correct ? "✓ Correct" : `Not quite — the correct answer is ${String.fromCharCode(65 + q.correctIndex)}`}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">{q.explanation}</p>
              {topic && (
                <Link
                  href={`/notes/${q.unitId}/${q.subTopicId}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <BookOpen className="h-4 w-4" /> Read the note: {topic.title}
                </Link>
              )}
            </div>
          )}
          <div className="flex justify-end pt-2">
            {!answered ? (
              <Button onClick={submit} disabled={picked === null} size="lg">Submit</Button>
            ) : (
              <Button onClick={nextQ} size="lg">{quizCurrentIndex + 1 === quizQuestions.length ? "See results" : "Next question"} <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-2 w-full animate-pulse rounded bg-muted" />
      <Card>
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-5 w-full animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[0,1,2,3].map(i => <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />)}
        </CardContent>
      </Card>
    </div>
  );
}

interface Scored {
  answer: { questionId: string; correct: boolean; selectedIndex: number | null; elapsedMs: number };
  question: MCQ | undefined;
  correct: boolean;
}

function ResultSummary({
  score,
  total,
  scored,
  onReset,
  onMount,
}: {
  score: number;
  total: number;
  scored: Scored[];
  onReset: () => void;
  onMount?: () => void;
}) {
  // Side-effect for perfect-score award once when this component mounts in finished state.
  useEffect(() => {
    onMount?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  const bandMessage =
    pct === 100 ? "Perfect score — Sharpshooter badge if this was a fresh 10-question run." :
    pct >= 80 ? "Strong run. The questions you missed are scheduled for spaced review." :
    pct >= 50 ? "Solid base. Open the dashboard to see which topic to revisit first." :
    "Worth re-reading the relevant notes. The adaptive engine will keep showing these until they stick.";

  return (
    <div className="space-y-5">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Quiz complete</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <p className={cn(
              "text-6xl font-bold tabular-nums",
              pct >= 80 ? "text-emerald-600 dark:text-emerald-400" :
              pct >= 50 ? "text-amber-600 dark:text-amber-400" :
              "text-rose-600 dark:text-rose-400",
            )}>{pct}%</p>
            <p className="text-lg text-muted-foreground">
              <span className="font-semibold text-foreground">{score}</span> of <span className="font-semibold text-foreground">{total}</span> correct
            </p>
          </div>
          <p className="mt-4 text-base text-foreground/80">{bandMessage}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={onReset} size="lg"><RotateCcw className="mr-1.5 h-4 w-4" /> Try another set</Button>
            <Button asChild variant="outline" size="lg"><Link href="/dashboard">View dashboard</Link></Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-lg">Review</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {scored.map((s, i) => {
              const q = s.question;
              if (!q) return null;
              const userPick = s.answer.selectedIndex;
              return (
                <li key={q.id} className={cn(
                  "flex items-start gap-3 rounded-lg border-2 p-4",
                  s.correct ? "border-emerald-500/40 bg-emerald-500/5" : "border-rose-500/40 bg-rose-500/5",
                )}>
                  <span className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-md text-sm font-bold",
                    s.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white",
                  )}>
                    {s.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium leading-snug">{i + 1}. {q.question}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Correct:</span> {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                    </p>
                    {!s.correct && userPick !== null && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">You picked:</span> {String.fromCharCode(65 + userPick)}. {q.options[userPick]}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
