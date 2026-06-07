"use client";

import { create } from "zustand";
import type { MCQ } from "@/types/content";

interface QuizSnapshot {
  mode: "practice" | "adaptive";
  questions: MCQ[];
  currentIndex: number;
  answers: { questionId: string; selectedIndex: number | null; correct: boolean; elapsedMs: number; confidence?: "guessed" | "knew" }[];
  startedAt: number;
  questionStartedAt: number;
  finished: boolean;
}

interface QuizActions {
  start: (mode: "practice" | "adaptive", questions: MCQ[]) => void;
  answer: (selectedIndex: number, confidence?: "guessed" | "knew") => void;
  next: () => void;
  reset: () => void;
}

const initial: QuizSnapshot = {
  mode: "practice",
  questions: [],
  currentIndex: 0,
  answers: [],
  startedAt: 0,
  questionStartedAt: 0,
  finished: false,
};

export const useQuizStore = create<QuizSnapshot & QuizActions>((set, get) => ({
  ...initial,
  start: (mode, questions) =>
    set({
      mode,
      questions,
      currentIndex: 0,
      answers: [],
      startedAt: Date.now(),
      questionStartedAt: Date.now(),
      finished: false,
    }),
  answer: (selectedIndex, confidence) => {
    const s = get();
    const q = s.questions[s.currentIndex];
    if (!q) return;
    const elapsedMs = Date.now() - s.questionStartedAt;
    const correct = selectedIndex === q.correctIndex;
    const answers = [
      ...s.answers,
      { questionId: q.id, selectedIndex, correct, elapsedMs, confidence },
    ];
    set({ answers });
  },
  next: () => {
    const s = get();
    const nextIndex = s.currentIndex + 1;
    if (nextIndex >= s.questions.length) {
      set({ finished: true });
    } else {
      set({ currentIndex: nextIndex, questionStartedAt: Date.now() });
    }
  },
  reset: () => set(initial),
}));
