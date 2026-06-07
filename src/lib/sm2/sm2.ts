import type { SRSCard } from "@/types/progress";

export type ResponseQuality = 0 | 1 | 2 | 3 | 4 | 5;

export function computeQuality(
  correct: boolean,
  elapsedMs: number,
  confidence?: "guessed" | "knew",
): ResponseQuality {
  if (!correct) return elapsedMs > 20000 ? 0 : 1;
  if (confidence === "guessed") return 2;
  if (elapsedMs > 20000) return 3;
  if (elapsedMs > 8000) return 4;
  return 5;
}

export function reviewCard(
  card: SRSCard | undefined,
  q: ResponseQuality,
  questionId: string,
  now = new Date(),
): SRSCard {
  let repetitions = card?.repetitions ?? 0;
  let ef = card?.easeFactor ?? 2.5;
  let interval = card?.interval ?? 0;

  if (q < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.max(1, Math.round((card?.interval ?? 1) * ef));
    repetitions += 1;
  }
  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const next = new Date(now);
  next.setDate(next.getDate() + interval);
  return {
    questionId,
    repetitions,
    easeFactor: parseFloat(ef.toFixed(3)),
    interval,
    nextReviewDate: next.toISOString().slice(0, 10),
    lastQuality: q,
    lastReviewedAt: now.toISOString().slice(0, 10),
  };
}
