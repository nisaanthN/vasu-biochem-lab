"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgressStore } from "@/stores/progressStore";
import { makeXPEvent } from "@/lib/gamification/xp";
import { showXPToast } from "@/components/gamification/XPToast";

interface Option {
  text: string;
  correct?: boolean;
}

export function InlineCheckpoint({
  question,
  options,
  explanation,
}: {
  question?: string;
  options?: Option[];
  explanation?: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [awarded, setAwarded] = useState(false);
  const addXP = useProgressStore((s) => s.addXP);
  const opts = options ?? [];

  const choose = (i: number) => {
    setPicked(i);
    if (opts[i]?.correct && !awarded) {
      addXP(makeXPEvent("checkpoint_correct"));
      showXPToast(5, "Checkpoint solved");
      setAwarded(true);
    }
  };

  if (opts.length === 0) return null;

  return (
    <div className="my-6 rounded-lg border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Checkpoint</p>
      <p className="mt-1 font-medium">{question}</p>
      <div className="mt-3 grid gap-2">
        {opts.map((opt, i) => {
          const isPicked = picked === i;
          const showResult = picked !== null;
          const correct = opt.correct;
          return (
            <Button
              key={i}
              variant={isPicked ? (correct ? "default" : "destructive") : "outline"}
              className="justify-start"
              onClick={() => choose(i)}
              disabled={picked !== null && !isPicked}
            >
              {showResult && isPicked && (correct ? <Check className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />)}
              {opt.text}
            </Button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="mt-3 text-sm text-muted-foreground">{explanation}</p>
      )}
    </div>
  );
}
