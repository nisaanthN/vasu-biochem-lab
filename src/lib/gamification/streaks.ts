export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

export function nextStreak(prevLast: string, prevStreak: number, today = todayISO()): {
  streak: number;
  isNewDay: boolean;
  newPersonalBest: boolean;
} {
  if (!prevLast) {
    return { streak: 1, isNewDay: true, newPersonalBest: true };
  }
  const diff = daysBetween(prevLast, today);
  if (diff === 0) return { streak: prevStreak, isNewDay: false, newPersonalBest: false };
  if (diff === 1) return { streak: prevStreak + 1, isNewDay: true, newPersonalBest: prevStreak + 1 > prevStreak };
  return { streak: 1, isNewDay: true, newPersonalBest: false };
}
