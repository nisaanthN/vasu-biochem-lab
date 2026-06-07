import type { TagStat } from "@/types/progress";
import { SYLLABUS, getTagId } from "@/lib/content/syllabus";

export interface WeakArea {
  tagId: string;
  unitId: string;
  topicId: string;
  ewmaAccuracy: number;
  attempts: number;
  label: string;
}

export function findWeakAreas(
  tagStats: Record<string, TagStat>,
  minAttempts = 3,
  threshold = 0.6,
): WeakArea[] {
  const list: WeakArea[] = [];
  for (const stat of Object.values(tagStats)) {
    if (stat.attempts < minAttempts) continue;
    if (stat.ewmaAccuracy >= threshold) continue;
    const [unitId, topicId] = stat.tagId.split(".");
    const unit = SYLLABUS.find((u) => u.id === unitId);
    const topic = unit?.topics.find((t) => t.id === topicId);
    if (!unit || !topic) continue;
    list.push({
      tagId: stat.tagId,
      unitId,
      topicId,
      ewmaAccuracy: stat.ewmaAccuracy,
      attempts: stat.attempts,
      label: topic.title,
    });
  }
  list.sort((a, b) => a.ewmaAccuracy - b.ewmaAccuracy);
  return list;
}

export function unitAccuracyBreakdown(tagStats: Record<string, TagStat>) {
  return SYLLABUS.map((u) => {
    const unitTags = u.topics.map((t) => getTagId(u.id, t.id));
    let attempts = 0;
    let correct = 0;
    for (const tag of unitTags) {
      const s = tagStats[tag];
      if (!s) continue;
      attempts += s.attempts;
      correct += s.correct;
    }
    return {
      unitId: u.id,
      unitTitle: u.title,
      accuracy: attempts === 0 ? null : correct / attempts,
      attempts,
    };
  });
}
