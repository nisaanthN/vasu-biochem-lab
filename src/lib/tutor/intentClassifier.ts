import Fuse from "fuse.js";
import type { QAPair, GlossaryTerm, ClassificationResult } from "@/types/tutor";

const FUSE_THRESHOLD = 0.42;

interface FuseRow {
  qaId: string;
  pattern: string;
  question: string;
}

let fuseInstance: Fuse<FuseRow> | null = null;
let qaPairsCache: QAPair[] = [];
let glossaryCache: GlossaryTerm[] = [];

export function buildClassifier(qa: QAPair[], glossary: GlossaryTerm[]) {
  qaPairsCache = qa;
  glossaryCache = glossary;
  const rows: FuseRow[] = [];
  for (const pair of qa) {
    for (const pat of pair.patterns) {
      rows.push({ qaId: pair.id, pattern: pat, question: pair.question });
    }
    rows.push({ qaId: pair.id, pattern: pair.question, question: pair.question });
  }
  fuseInstance = new Fuse(rows, {
    keys: ["pattern", "question"],
    threshold: FUSE_THRESHOLD,
    includeScore: true,
    ignoreLocation: true,
  });
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim();
}

export function classify(text: string): ClassificationResult {
  const normalized = normalize(text);

  // Layer 1 — exact pattern matching (high confidence)
  for (const pair of qaPairsCache) {
    for (const pat of pair.patterns) {
      const p = normalize(pat);
      if (normalized === p || normalized.includes(p) || p.includes(normalized)) {
        return { layer: 1, confidence: 0.95, qaId: pair.id };
      }
    }
  }

  // Layer 2 — fuzzy match (medium confidence)
  if (fuseInstance) {
    const results = fuseInstance.search(normalized);
    if (results.length > 0 && (results[0].score ?? 1) < FUSE_THRESHOLD) {
      const top = results[0];
      const confidence = 1 - (top.score ?? 0.5);
      return { layer: 2, confidence, qaId: top.item.qaId };
    }
  }

  // Layer 3 — glossary keyword scoring (low confidence)
  const tokens = new Set(normalized.split(" ").filter((t) => t.length > 2));
  const matched: { term: GlossaryTerm; score: number }[] = [];
  for (const g of glossaryCache) {
    const candidates = [g.term, ...(g.aliases ?? [])].map(normalize);
    let score = 0;
    let matchedAliases: string[] = [];
    for (const c of candidates) {
      if (!c) continue;
      if (normalized.includes(c)) {
        score += 1;
        matchedAliases.push(c);
        continue;
      }
      const cTokens = c.split(" ").filter((t) => t.length > 2);
      const overlap = cTokens.filter((t) => tokens.has(t)).length;
      if (overlap > 0) {
        score += overlap / Math.max(cTokens.length, 1);
        matchedAliases.push(c);
      }
    }
    if (score > 0) matched.push({ term: g, score });
  }
  matched.sort((a, b) => b.score - a.score);

  if (matched.length > 0) {
    return {
      layer: 3,
      confidence: Math.min(0.65, matched[0].score / 2),
      matchedTerms: matched.slice(0, 3).map((m) => m.term.term),
      suggestedTopics: matched.slice(0, 3).map((m) => ({
        topicId: m.term.topicId ?? "",
        label: m.term.shortDef,
      })),
    };
  }

  return { layer: 0, confidence: 0 };
}

export function getQA(id: string): QAPair | undefined {
  return qaPairsCache.find((q) => q.id === id);
}

export function getGlossary(): GlossaryTerm[] {
  return glossaryCache;
}
