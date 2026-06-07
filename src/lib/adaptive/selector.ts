import type { MCQ } from "@/types/content";
import type { ProgressState } from "@/types/progress";
import { dueCards } from "@/lib/sm2/scheduler";
import { findWeakAreas } from "./weakAreas";
import { getTagId } from "@/lib/content/syllabus";

interface SelectOpts {
  count: number;
  unitFilter?: string;
  mode: "practice" | "adaptive";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selectMCQs(pool: MCQ[], state: ProgressState, opts: SelectOpts): MCQ[] {
  const filtered = opts.unitFilter ? pool.filter((q) => q.unitId === opts.unitFilter) : pool;
  if (opts.mode === "practice") {
    return shuffle(filtered).slice(0, opts.count);
  }

  const due = dueCards(state.srs).map((c) => c.questionId);
  const weak = findWeakAreas(state.tagStats).slice(0, 3).map((w) => w.tagId);
  const weakIds = new Set<string>(
    filtered
      .filter((q) => weak.includes(getTagId(q.unitId, q.subTopicId)))
      .map((q) => q.id),
  );
  const seenIds = new Set(Object.keys(state.srs));

  const dueQs: MCQ[] = filtered.filter((q) => due.includes(q.id));
  const weakQs: MCQ[] = filtered.filter((q) => weakIds.has(q.id) && !due.includes(q.id));
  const unseenQs: MCQ[] = filtered.filter((q) => !seenIds.has(q.id));
  const restQs: MCQ[] = filtered.filter(
    (q) => !due.includes(q.id) && !weakIds.has(q.id) && seenIds.has(q.id),
  );

  const picked: MCQ[] = [];
  const dedupe = new Set<string>();
  const add = (qs: MCQ[]) => {
    for (const q of qs) {
      if (picked.length >= opts.count) return;
      if (dedupe.has(q.id)) continue;
      dedupe.add(q.id);
      picked.push(q);
    }
  };
  add(shuffle(dueQs).slice(0, Math.ceil(opts.count * 0.4)));
  add(shuffle(weakQs).slice(0, Math.ceil(opts.count * 0.4)));
  add(shuffle(unseenQs));
  add(shuffle(restQs));
  return picked.slice(0, opts.count);
}
