import type { SRSCard } from "@/types/progress";
import { todayISO } from "@/lib/gamification/streaks";

export function isDue(card: SRSCard, today = todayISO()): boolean {
  return card.nextReviewDate <= today;
}

export function dueCards(srs: Record<string, SRSCard>, limit?: number): SRSCard[] {
  const today = todayISO();
  const due = Object.values(srs).filter((c) => isDue(c, today));
  due.sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  return typeof limit === "number" ? due.slice(0, limit) : due;
}

export function upcomingCards(srs: Record<string, SRSCard>, days = 7): SRSCard[] {
  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + days);
  const endISO = end.toISOString().slice(0, 10);
  return Object.values(srs).filter((c) => c.nextReviewDate <= endISO);
}
