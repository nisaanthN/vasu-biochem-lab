import { SYLLABUS, getTagId } from "@/lib/content/syllabus";
import type { ProgressState } from "@/types/progress";

export interface Recommendation {
  unitId: string;
  topicId: string;
  title: string;
  blurb: string;
  score: number;
  reasons: string[];
}

function recencyDecay(lastSeenISO: string | undefined): number {
  if (!lastSeenISO) return 1;
  const ms = Date.now() - new Date(lastSeenISO).getTime();
  const days = ms / (1000 * 60 * 60 * 24);
  return Math.min(1, days / 14);
}

function prereqsReady(prereqs: string[], state: ProgressState, unitId: string): number {
  if (prereqs.length === 0) return 1;
  const ready = prereqs.every((p) => Boolean(state.notes[p]) || Boolean(state.tagStats[getTagId(unitId, p)]));
  return ready ? 1 : 0.4;
}

export function recommendNextTopic(state: ProgressState): Recommendation | null {
  const all = SYLLABUS.flatMap((u, ui) =>
    u.topics.map((t, ti) => ({
      unit: u,
      topic: t,
      syllabusOrderScore: 1 - (ui * 2 + ti) / 12,
    })),
  );
  const scored: Recommendation[] = all.map(({ unit, topic, syllabusOrderScore }) => {
    const tagId = getTagId(unit.id, topic.id);
    const stat = state.tagStats[tagId];
    const ewma = stat?.ewmaAccuracy ?? 1;
    const weaknessBoost = 1 - ewma;
    const recency = recencyDecay(stat?.lastSeen);
    const prereq = prereqsReady(topic.prerequisites, state, unit.id);
    const noveltyBoost = state.notes[topic.id] ? 0.2 : 1;

    const score =
      0.4 * weaknessBoost +
      0.2 * recency +
      0.2 * prereq +
      0.1 * syllabusOrderScore +
      0.1 * noveltyBoost;

    const reasons: string[] = [];
    if (weaknessBoost > 0.4) reasons.push("Weak area");
    if (!state.notes[topic.id]) reasons.push("New topic");
    if (recency > 0.7) reasons.push("Due for review");
    if (prereq < 1) reasons.push("Prerequisites incomplete");
    if (reasons.length === 0) reasons.push("Recommended by syllabus order");

    return {
      unitId: unit.id,
      topicId: topic.id,
      title: topic.title,
      blurb: topic.blurb,
      score,
      reasons,
    };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0] ?? null;
}
