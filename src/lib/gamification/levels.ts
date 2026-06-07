import type { LevelInfo } from "@/types/gamification";

const LEVEL_CAP = 20;

const TITLES: { from: number; to: number; title: string }[] = [
  { from: 1, to: 3, title: "Apprentice" },
  { from: 4, to: 7, title: "Lab Technician" },
  { from: 8, to: 12, title: "Biochem Adept" },
  { from: 13, to: 17, title: "Senior Researcher" },
  { from: 18, to: 20, title: "Principal Scientist" },
];

export function xpRequiredForLevel(n: number): number {
  if (n <= 1) return 0;
  return Math.floor(100 * Math.pow(n - 1, 1.5));
}

export function xpToReachLevel(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += xpRequiredForLevel(i);
  return sum;
}

export function levelFromXP(xp: number): number {
  let level = 1;
  let cumulative = 0;
  while (level < LEVEL_CAP) {
    const next = xpRequiredForLevel(level + 1);
    if (cumulative + next > xp) break;
    cumulative += next;
    level++;
  }
  return level;
}

export function titleForLevel(level: number): string {
  return TITLES.find((t) => level >= t.from && level <= t.to)?.title ?? "Apprentice";
}

export function getLevelInfo(xp: number): LevelInfo {
  const level = levelFromXP(xp);
  const xpStart = xpToReachLevel(level);
  const nextLevelXp = xpRequiredForLevel(level + 1);
  const xpEnd = xpStart + nextLevelXp;
  const xpIntoLevel = xp - xpStart;
  const progressFraction = level >= LEVEL_CAP ? 1 : xpIntoLevel / nextLevelXp;
  return {
    level,
    title: titleForLevel(level),
    xpStart,
    xpEnd,
    xpIntoLevel,
    xpForLevel: nextLevelXp,
    progressFraction,
  };
}
