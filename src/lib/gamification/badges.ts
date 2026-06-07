import type { Badge } from "@/types/gamification";
import type { ProgressState } from "@/types/progress";

export const BADGES: Badge[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Welcome aboard! Open BioPharm Lab for the first time.",
    icon: "sparkles",
    criteria: () => true,
  },
  {
    id: "note-worm",
    name: "Note Worm",
    description: "Read 5 different topics.",
    icon: "book-open",
    criteria: (s) => Object.keys(s.notes).length >= 5,
  },
  {
    id: "bibliophile",
    name: "Bibliophile",
    description: "Read every note in the v1 library.",
    icon: "library",
    criteria: (s) => Object.keys(s.notes).length >= 10,
  },
  {
    id: "quiz-initiate",
    name: "Quiz Initiate",
    description: "Complete your first 10-question quiz.",
    icon: "clipboard-list",
    criteria: (s) => s.totalMcqAttempted >= 10,
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    description: "Score 100% on any quiz of 10 or more questions.",
    icon: "target",
    criteria: (s) => Boolean((s as ProgressState & { perfectQuizRecorded?: boolean }).perfectQuizRecorded),
  },
  {
    id: "iron-streak",
    name: "Iron Streak",
    description: "Log in for 7 consecutive days.",
    icon: "flame",
    criteria: (s) => s.streakDays >= 7,
  },
  {
    id: "diamond-streak",
    name: "Diamond Streak",
    description: "Log in for 30 consecutive days.",
    icon: "gem",
    criteria: (s) => s.streakDays >= 30,
  },
  {
    id: "lab-rookie",
    name: "Lab Rookie",
    description: "Complete your first virtual experiment.",
    icon: "beaker",
    criteria: (s) =>
      Object.values(s.experiments).some((e) => Boolean(e.completedAt)),
  },
  {
    id: "master-experimenter",
    name: "Master Experimenter",
    description: "Complete all 5 virtual experiments.",
    icon: "flask-conical",
    criteria: (s) =>
      Object.values(s.experiments).filter((e) => Boolean(e.completedAt))
        .length >= 5,
  },
  {
    id: "enzyme-whisperer",
    name: "Enzyme Whisperer",
    description: "Hit 90%+ accuracy on Unit III (Enzymes) with 15+ attempts.",
    icon: "atom",
    unitId: "unit-3",
    criteria: (s) =>
      hasUnitMastery(s, "unit-3", 15, 0.9),
  },
  {
    id: "pathway-pro",
    name: "Pathway Pro",
    description: "Hit 90%+ accuracy on Unit V (Metabolism) with 15+ attempts.",
    icon: "git-branch",
    unitId: "unit-5",
    criteria: (s) =>
      hasUnitMastery(s, "unit-5", 15, 0.9),
  },
  {
    id: "curious-mind",
    name: "Curious Mind",
    description: "Ask the tutor 25 questions.",
    icon: "message-circle-question",
    criteria: (s) => s.tutorQuestionsAsked >= 25,
  },
  {
    id: "comeback-kid",
    name: "Comeback Kid",
    description: "Improve a weak area from below 50% to above 75%.",
    icon: "trending-up",
    hidden: true,
    criteria: (s) =>
      Boolean((s as ProgressState & { comebackRecorded?: boolean }).comebackRecorded),
  },
  {
    id: "polyglot",
    name: "Polyglot",
    description: "Answer at least one MCQ correctly in every unit.",
    icon: "languages",
    criteria: (s) => {
      const units = new Set<string>();
      for (const tag of Object.keys(s.tagStats)) {
        const t = s.tagStats[tag];
        if (t && t.correct >= 1) units.add(tag.split(".")[0]);
      }
      return units.size >= 5;
    },
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Answer 100 MCQs correctly across all sessions.",
    icon: "shield",
    criteria: (s) => s.totalMcqCorrect >= 100,
  },
];

function hasUnitMastery(
  s: ProgressState,
  unitId: string,
  minAttempts: number,
  minAccuracy: number,
) {
  let attempts = 0;
  let correct = 0;
  for (const [tagId, stat] of Object.entries(s.tagStats)) {
    if (!tagId.startsWith(unitId + ".")) continue;
    attempts += stat.attempts;
    correct += stat.correct;
  }
  if (attempts < minAttempts) return false;
  return correct / attempts >= minAccuracy;
}

export function evaluateBadges(s: ProgressState): string[] {
  return BADGES.filter((b) => b.criteria(s)).map((b) => b.id);
}

export function findBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
