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
  const quiz = useQuizStore();
  const recordMcqAttempt = useProgressStore((s) => s.recordMcqAttempt);
  const recordPerfectQuiz = useProgressStore((s) => s.recordPerfectQuiz);
  const progressState = useProgressStore;
  const [picked, setPicked] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<"guessed" | "knew" | null>(null);
  const [perfectAwarded, setPerfectAwarded] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (quiz.questions.length === 0 && !quiz.finished) {
      const state = progressState.getState();
      const selected = selectMCQs(pool, state, { count: QUIZ_LENGTH, unitFilter, mode });
      if (selected.length > 0) quiz.start(mode, selected);
    }
  }, [hydrated, pool, mode, unitFilter, quiz, progressState]);

  if (!hydrated) return <Skeleton />;
  if (pool.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">No questions available yet for this filter.</p>
        <p className="mt-2">The MCQ bank is being expanded. Try a different unit, or open a note instead.</p>
        <Button asChild variant="outline" className="mt-3" size="sm"><Link href="/notes">Browse notes</Link></Button>
      </div>
    );
  }
  if (quiz.questions.length === 0) {
    return <Skeleton />;
  }

  if (quiz.finished) {
    const accuracy = quiz.answers.filter((a) => a.correct).length;
    const total = quiz.questions.length;
    const perfect = accuracy === total && total >= QUIZ_LENGTH;
    if (perfect && !perfectAwarded) {
      recordPerfectQuiz();
      showXPToast(100, "Perfect quiz!");
      setPerfectAwarded(true);
    }
    return <ResultSummary score={accuracy} total={total} answers={quiz.answers} questions={quiz.questions} onReset={() => { quiz.reset(); setPicked(null); setConfidence(null); setPerfectAwarded(false); }} />;
  }

  const q = quiz.questions[quiz.currentIndex];
  const answered = picked !== null;

  const submit = () => {
    if (picked === null) return;
    const elapsed = Date.now() - quiz.questionStartedAt;
    quiz.answer(picked, confidence ?? undefined);
    recordMcqAttempt({
      questionId: q.id,
      tagId: getTagId(q.unitId, q.subTopicId),
      correct: picked === q.correctIndex,
      mode,
      elapsedMs: elapsed,
      confidence: confidence ?? undefined,
    });
  };

  const nextQ = () => {
    quiz.next();
    setPicked(null);
    setConfidence(null);
  };

  const correct = answered && picked === q.correctIndex;
  const topic = getTopic(q.unitId, q.subTopicId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {quiz.currentIndex + 1} of {quiz.questions.length}</span>
        <span>{mode === "adaptive" ? "Adaptive (weak-area targeted)" : "Practice"}</span>
      </div>
      <Progress value={((quiz.currentIndex) / quiz.questions.length) * 100} className="h-1" />
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-md uppercase">{q.unitId.replace("-", " ")}</Badge>
            <Badge variant="outline" className="rounded-md">{q.difficulty}</Badge>
            <Badge variant="outline" className="rounded-md">{q.bloom}</Badge>
          </div>
          <CardTitle className="mt-3 text-lg">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            {q.options.map((opt, i) => {
              const isPicked = picked === i;
              const isAnsweredCorrect = answered && i === q.correctIndex;
              const isAnsweredWrong = answered && isPicked && !correct;
              return (
                <Button
                  key={i}
                  variant={
                    isAnsweredCorrect ? "default" :
                    isAnsweredWrong ? "destructive" :
                    isPicked ? "secondary" :
                    "outline"
                  }
                  className={cn("justify-start whitespace-normal py-3 text-left", answered && !isPicked && !isAnsweredCorrect && "opacity-60")}
                  onClick={() => !answered && setPicked(i)}
                  disabled={answered}
                >
                  <span className="mr-2 font-semibold">{String.fromCharCode(65 + i)}.</span>
                  <span className="flex-1">{opt}</span>
                  {isAnsweredCorrect && <Check className="ml-2 h-4 w-4" />}
                  {isAnsweredWrong && <X className="ml-2 h-4 w-4" />}
                </Button>
              );
            })}
          </div>
          {!answered && picked !== null && (
            <div className="mt-3 rounded-md border bg-card p-3">
              <p className="text-xs font-medium">How confident are you?</p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant={confidence === "knew" ? "default" : "outline"}
                  onClick={() => setConfidence("knew")}
                >
                  I knew it
                </Button>
                <Button
                  size="sm"
                  variant={confidence === "guessed" ? "default" : "outline"}
                  onClick={() => setConfidence("guessed")}
                >
                  I guessed
                </Button>
                <span className="text-xs text-muted-foreground self-center">(optional — improves SM-2 scheduling)</span>
              </div>
            </div>
          )}
          {answered && (
            <div className={cn("mt-3 rounded-md border p-4", correct ? "border-emerald-500/40 bg-emerald-500/5" : "border-rose-500/40 bg-rose-500/5")}>
              <p className="text-sm font-semibold">{correct ? "Correct" : `Not quite — correct answer: ${String.fromCharCode(65 + q.correctIndex)}`}</p>
              <p className="mt-1 text-sm text-muted-foreground">{q.explanation}</p>
              {topic && (
                <p className="mt-2 text-xs">
                  <Link href={`/notes/${q.unitId}/${q.subTopicId}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                    <BookOpen className="h-3 w-3" /> Read the note: {topic.title}
                  </Link>
                </p>
              )}
            </div>
          )}
          <div className="flex justify-end pt-2">
            {!answered ? (
              <Button onClick={submit} disabled={picked === null}>Submit</Button>
            ) : (
              <Button onClick={nextQ}>{quiz.currentIndex + 1 === quiz.questions.length ? "See results" : "Next"} <ArrowRight className="ml-1 h-4 w-4" /></Button>
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
          {[0,1,2,3].map(i => <div key={i} className="h-11 w-full animate-pulse rounded bg-muted" />)}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultSummary({
  score,
  total,
  answers,
  questions,
  onReset,
}: {
  score: number;
  total: number;
  answers: { questionId: string; correct: boolean; selectedIndex: number | null; elapsedMs: number }[];
  questions: MCQ[];
  onReset: () => void;
}) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Quiz complete</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <p className="text-5xl font-bold">{pct}%</p>
            <p className="text-sm text-muted-foreground">{score} of {total} correct</p>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {pct === 100 && "Perfect score — Sharpshooter badge if this was a fresh 10-question run."}
            {pct >= 80 && pct < 100 && "Strong run. The questions you missed are now scheduled for spaced review."}
            {pct >= 50 && pct < 80 && "Solid base. Open the dashboard to see which topic to revisit."}
            {pct < 50 && "Worth re-reading the relevant notes. The adaptive engine will keep showing these until they stick."}
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={onReset}><RotateCcw className="mr-1 h-4 w-4" /> Try another set</Button>
            <Button asChild variant="outline"><Link href="/dashboard">View dashboard</Link></Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Review</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {questions.map((q, i) => {
              const a = answers[i];
              const wasCorrect = a?.correct;
              return (
                <li key={q.id} className="flex items-start gap-3 rounded-md border p-3 text-sm">
                  {wasCorrect ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />}
                  <div className="flex-1">
                    <p className="font-medium">{q.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {wasCorrect ? "Correct answer: " : "Correct: "}{String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                    </p>
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
