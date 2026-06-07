import type { ProgressState } from "./progress";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  hidden?: boolean;
  unitId?: string;
  criteria: (s: ProgressState) => boolean;
}

export interface LevelInfo {
  level: number;
  title: string;
  xpStart: number;
  xpEnd: number;
  xpIntoLevel: number;
  xpForLevel: number;
  progressFraction: number;
}

export type XPEventType =
  | "note_read"
  | "checkpoint_correct"
  | "mcq_practice_correct"
  | "mcq_adaptive_correct"
  | "experiment_first"
  | "experiment_completed"
  | "daily_login"
  | "streak_bonus"
  | "perfect_quiz"
  | "tutor_question";

export interface XPEvent {
  type: XPEventType;
  amount: number;
  label: string;
}
