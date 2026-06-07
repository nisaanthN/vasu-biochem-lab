import type { XPEvent, XPEventType } from "@/types/gamification";

const TUTOR_DAILY_CAP = 20;

export const XP_RULES: Record<XPEventType, number> = {
  note_read: 20,
  checkpoint_correct: 5,
  mcq_practice_correct: 10,
  mcq_adaptive_correct: 15,
  experiment_first: 30,
  experiment_completed: 50,
  daily_login: 10,
  streak_bonus: 5,
  perfect_quiz: 100,
  tutor_question: 2,
};

const XP_LABELS: Record<XPEventType, string> = {
  note_read: "Read a note",
  checkpoint_correct: "Checkpoint solved",
  mcq_practice_correct: "Practice MCQ correct",
  mcq_adaptive_correct: "Weak-area MCQ correct",
  experiment_first: "Experiment first attempt",
  experiment_completed: "Experiment completed",
  daily_login: "Daily login",
  streak_bonus: "Streak bonus",
  perfect_quiz: "Perfect quiz!",
  tutor_question: "Asked the tutor",
};

export function makeXPEvent(type: XPEventType, multiplier = 1): XPEvent {
  return {
    type,
    amount: XP_RULES[type] * multiplier,
    label: XP_LABELS[type],
  };
}

export function streakBonusXP(streakDays: number): number {
  return XP_RULES.streak_bonus * Math.min(Math.max(streakDays, 0), 10);
}

export function isTutorXPCapped(asksToday: number): boolean {
  return asksToday >= TUTOR_DAILY_CAP;
}
