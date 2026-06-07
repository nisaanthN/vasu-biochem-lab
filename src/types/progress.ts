export interface SRSCard {
  questionId: string;
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReviewDate: string;
  lastQuality: 0 | 1 | 2 | 3 | 4 | 5;
  lastReviewedAt: string;
}

export interface TagStat {
  tagId: string;
  attempts: number;
  correct: number;
  ewmaAccuracy: number;
  lastSeen: string;
}

export interface NoteCompletion {
  topicId: string;
  unitId: string;
  completedAt: string;
  dwellSeconds: number;
  scrolledPastBottom: boolean;
}

export interface ExperimentCompletion {
  slug: string;
  firstAttemptAt: string;
  completedAt?: string;
  attempts: number;
}

export interface QuizSession {
  id: string;
  mode: "practice" | "adaptive";
  startedAt: string;
  finishedAt?: string;
  questionsAttempted: string[];
  correct: number;
  total: number;
  unitFilter?: string;
}

export interface BadgeUnlock {
  badgeId: string;
  unlockedAt: string;
}

export interface AchievementEvent {
  id: string;
  type: "note-read" | "quiz-perfect" | "experiment-completed" | "badge-unlocked" | "level-up" | "streak" | "milestone";
  label: string;
  detail?: string;
  at: string;
  icon?: string;
}

export interface ProgressState {
  schemaVersion: number;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  notes: Record<string, NoteCompletion>;
  experiments: Record<string, ExperimentCompletion>;
  srs: Record<string, SRSCard>;
  tagStats: Record<string, TagStat>;
  badges: Record<string, BadgeUnlock>;
  achievements: AchievementEvent[];
  totalMcqAttempted: number;
  totalMcqCorrect: number;
  tutorQuestionsAsked: number;
  tutorQuestionsToday: number;
  lastTutorDate: string;
}
