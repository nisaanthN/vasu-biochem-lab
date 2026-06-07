"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ProgressState,
  NoteCompletion,
  ExperimentCompletion,
  SRSCard,
  TagStat,
  AchievementEvent,
} from "@/types/progress";
import type { XPEvent } from "@/types/gamification";
import { namespacedKey, SCHEMA_VERSION } from "@/lib/storage/localStore";
import { levelFromXP } from "@/lib/gamification/levels";
import { streakBonusXP, makeXPEvent, isTutorXPCapped } from "@/lib/gamification/xp";
import { evaluateBadges } from "@/lib/gamification/badges";
import { nextStreak, todayISO } from "@/lib/gamification/streaks";

interface ProgressActions {
  addXP: (event: XPEvent) => { newlyUnlocked: string[]; leveledUp: boolean; newLevel: number; gainedXp: number };
  recordNoteRead: (topicId: string, unitId: string, dwellSeconds: number) => void;
  recordExperimentAttempt: (slug: string) => void;
  recordExperimentCompletion: (slug: string) => void;
  recordMcqAttempt: (params: {
    questionId: string;
    tagId: string;
    correct: boolean;
    mode: "practice" | "adaptive";
    elapsedMs: number;
    confidence?: "guessed" | "knew";
  }) => void;
  recordPerfectQuiz: () => void;
  recordTutorQuestion: () => boolean;
  heartbeat: () => { isNewDay: boolean; streak: number };
  reset: () => void;
}

const initialState: ProgressState = {
  schemaVersion: SCHEMA_VERSION,
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: "",
  notes: {},
  experiments: {},
  srs: {},
  tagStats: {},
  badges: {},
  achievements: [],
  totalMcqAttempted: 0,
  totalMcqCorrect: 0,
  tutorQuestionsAsked: 0,
  tutorQuestionsToday: 0,
  lastTutorDate: "",
};

const EWMA_ALPHA = 0.3;

function applyEWMA(prev: number, sample: number, alpha = EWMA_ALPHA): number {
  return alpha * sample + (1 - alpha) * prev;
}

function quality(correct: boolean, elapsedMs: number, confidence?: "guessed" | "knew"): 0 | 1 | 2 | 3 | 4 | 5 {
  if (!correct) {
    return elapsedMs > 20000 ? 0 : 1;
  }
  if (confidence === "guessed") return 2;
  if (elapsedMs > 20000) return 3;
  if (elapsedMs > 8000) return 4;
  return 5;
}

function nextSrs(card: SRSCard | undefined, q: 0 | 1 | 2 | 3 | 4 | 5, questionId: string): SRSCard {
  const today = todayISO();
  let repetitions = card?.repetitions ?? 0;
  let ef = card?.easeFactor ?? 2.5;
  let interval = card?.interval ?? 0;
  if (q < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round((card?.interval ?? 1) * ef);
    repetitions += 1;
  }
  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const next = new Date();
  next.setDate(next.getDate() + interval);
  return {
    questionId,
    repetitions,
    easeFactor: ef,
    interval,
    nextReviewDate: next.toISOString().slice(0, 10),
    lastQuality: q,
    lastReviewedAt: today,
  };
}

function pushAchievement(achievements: AchievementEvent[], ev: AchievementEvent): AchievementEvent[] {
  const next = [ev, ...achievements].slice(0, 200);
  return next;
}

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      addXP: (event) => {
        const before = get();
        const beforeLevel = levelFromXP(before.xp);
        const nextXp = before.xp + event.amount;
        const afterLevel = levelFromXP(nextXp);
        const beforeBadges = new Set(Object.keys(before.badges));
        const tempState: ProgressState = { ...before, xp: nextXp, level: afterLevel };
        const earned = evaluateBadges(tempState);
        const newlyUnlocked: string[] = [];
        const updatedBadges = { ...before.badges };
        for (const id of earned) {
          if (!beforeBadges.has(id)) {
            updatedBadges[id] = { badgeId: id, unlockedAt: new Date().toISOString() };
            newlyUnlocked.push(id);
          }
        }
        let achievements = before.achievements;
        if (afterLevel > beforeLevel) {
          achievements = pushAchievement(achievements, {
            id: `lvl-${Date.now()}`,
            type: "level-up",
            label: `Reached level ${afterLevel}`,
            at: new Date().toISOString(),
            icon: "trophy",
          });
        }
        for (const id of newlyUnlocked) {
          achievements = pushAchievement(achievements, {
            id: `badge-${id}-${Date.now()}`,
            type: "badge-unlocked",
            label: `Unlocked badge: ${id}`,
            at: new Date().toISOString(),
            icon: "award",
          });
        }
        set({
          xp: nextXp,
          level: afterLevel,
          badges: updatedBadges,
          achievements,
        });
        return {
          newlyUnlocked,
          leveledUp: afterLevel > beforeLevel,
          newLevel: afterLevel,
          gainedXp: event.amount,
        };
      },
      recordNoteRead: (topicId, unitId, dwellSeconds) => {
        const before = get();
        const existing = before.notes[topicId];
        const completion: NoteCompletion = {
          topicId,
          unitId,
          completedAt: existing?.completedAt ?? new Date().toISOString(),
          dwellSeconds: Math.max(existing?.dwellSeconds ?? 0, dwellSeconds),
          scrolledPastBottom: true,
        };
        set({
          notes: { ...before.notes, [topicId]: completion },
          achievements: existing
            ? before.achievements
            : pushAchievement(before.achievements, {
                id: `note-${topicId}-${Date.now()}`,
                type: "note-read",
                label: `Read: ${topicId}`,
                at: new Date().toISOString(),
                icon: "book-open",
              }),
        });
        if (!existing) {
          get().addXP(makeXPEvent("note_read"));
        }
      },
      recordExperimentAttempt: (slug) => {
        const before = get();
        const existing = before.experiments[slug];
        const completion: ExperimentCompletion = existing
          ? { ...existing, attempts: existing.attempts + 1 }
          : { slug, firstAttemptAt: new Date().toISOString(), attempts: 1 };
        set({ experiments: { ...before.experiments, [slug]: completion } });
        if (!existing) {
          get().addXP(makeXPEvent("experiment_first"));
        }
      },
      recordExperimentCompletion: (slug) => {
        const before = get();
        const existing = before.experiments[slug] ?? {
          slug,
          firstAttemptAt: new Date().toISOString(),
          attempts: 1,
        };
        if (existing.completedAt) return;
        const completion: ExperimentCompletion = { ...existing, completedAt: new Date().toISOString() };
        set({
          experiments: { ...before.experiments, [slug]: completion },
          achievements: pushAchievement(before.achievements, {
            id: `exp-${slug}-${Date.now()}`,
            type: "experiment-completed",
            label: `Completed experiment: ${slug}`,
            at: new Date().toISOString(),
            icon: "flask-conical",
          }),
        });
        get().addXP(makeXPEvent("experiment_completed"));
      },
      recordMcqAttempt: ({ questionId, tagId, correct, mode, elapsedMs, confidence }) => {
        const before = get();
        const q = quality(correct, elapsedMs, confidence);
        const updatedSrs = nextSrs(before.srs[questionId], q, questionId);
        const prevStat: TagStat = before.tagStats[tagId] ?? {
          tagId,
          attempts: 0,
          correct: 0,
          ewmaAccuracy: 1,
          lastSeen: new Date().toISOString(),
        };
        const sample = correct ? 1 : 0;
        const updatedStat: TagStat = {
          tagId,
          attempts: prevStat.attempts + 1,
          correct: prevStat.correct + (correct ? 1 : 0),
          ewmaAccuracy: prevStat.attempts === 0 ? sample : applyEWMA(prevStat.ewmaAccuracy, sample),
          lastSeen: new Date().toISOString(),
        };
        let comebackRecorded = (before as ProgressState & { comebackRecorded?: boolean }).comebackRecorded ?? false;
        if (!comebackRecorded && prevStat.ewmaAccuracy < 0.5 && updatedStat.ewmaAccuracy > 0.75 && updatedStat.attempts >= 5) {
          comebackRecorded = true;
        }
        set({
          srs: { ...before.srs, [questionId]: updatedSrs },
          tagStats: { ...before.tagStats, [tagId]: updatedStat },
          totalMcqAttempted: before.totalMcqAttempted + 1,
          totalMcqCorrect: before.totalMcqCorrect + (correct ? 1 : 0),
          ...(comebackRecorded ? { comebackRecorded: true } : {}),
        } as Partial<ProgressState>);
        if (correct) {
          get().addXP(makeXPEvent(mode === "adaptive" ? "mcq_adaptive_correct" : "mcq_practice_correct"));
        }
      },
      recordPerfectQuiz: () => {
        const before = get();
        if ((before as ProgressState & { perfectQuizRecorded?: boolean }).perfectQuizRecorded) {
          get().addXP(makeXPEvent("perfect_quiz", 0.5));
          return;
        }
        set({
          ...(before as ProgressState),
          achievements: pushAchievement(before.achievements, {
            id: `perfect-${Date.now()}`,
            type: "quiz-perfect",
            label: "Perfect quiz — 100%!",
            at: new Date().toISOString(),
            icon: "trophy",
          }),
        });
        set({ perfectQuizRecorded: true } as Partial<ProgressState>);
        get().addXP(makeXPEvent("perfect_quiz"));
      },
      recordTutorQuestion: () => {
        const before = get();
        const today = todayISO();
        const isNewDay = before.lastTutorDate !== today;
        const asksToday = isNewDay ? 0 : before.tutorQuestionsToday;
        const capped = isTutorXPCapped(asksToday);
        set({
          tutorQuestionsAsked: before.tutorQuestionsAsked + 1,
          tutorQuestionsToday: asksToday + 1,
          lastTutorDate: today,
        });
        if (!capped) {
          get().addXP(makeXPEvent("tutor_question"));
        }
        return !capped;
      },
      heartbeat: () => {
        const before = get();
        const result = nextStreak(before.lastActiveDate, before.streakDays);
        if (result.isNewDay) {
          set({ streakDays: result.streak, lastActiveDate: todayISO() });
          get().addXP(makeXPEvent("daily_login"));
          const bonus = streakBonusXP(result.streak);
          if (bonus > 0) {
            get().addXP({ type: "streak_bonus", amount: bonus, label: `Streak +${bonus}` });
          }
          if (result.streak === 7 || result.streak === 30) {
            const after = get();
            set({
              achievements: pushAchievement(after.achievements, {
                id: `streak-${result.streak}-${Date.now()}`,
                type: "streak",
                label: `${result.streak}-day streak!`,
                at: new Date().toISOString(),
                icon: "flame",
              }),
            });
          }
        }
        return { isNewDay: result.isNewDay, streak: get().streakDays };
      },
      reset: () => set(initialState),
    }),
    {
      name: namespacedKey("progress"),
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { addXP, recordNoteRead, recordExperimentAttempt, recordExperimentCompletion, recordMcqAttempt, recordPerfectQuiz, recordTutorQuestion, heartbeat, reset, ...rest } = state;
        void addXP;
        void recordNoteRead;
        void recordExperimentAttempt;
        void recordExperimentCompletion;
        void recordMcqAttempt;
        void recordPerfectQuiz;
        void recordTutorQuestion;
        void heartbeat;
        void reset;
        return rest;
      },
    },
  ),
);
