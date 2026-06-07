import fs from "node:fs/promises";
import path from "node:path";
import type { MCQ, UnitId } from "@/types/content";

const MCQ_DIR = path.join(process.cwd(), "src", "content", "mcq");
const UNITS: UnitId[] = ["unit-1", "unit-2", "unit-3", "unit-4", "unit-5"];

let cache: MCQ[] | null = null;

export async function loadAllMCQs(): Promise<MCQ[]> {
  if (cache) return cache;
  const all: MCQ[] = [];
  for (const u of UNITS) {
    const fp = path.join(MCQ_DIR, `${u}.json`);
    try {
      const raw = await fs.readFile(fp, "utf8");
      const arr = JSON.parse(raw) as MCQ[];
      all.push(...arr);
    } catch {
      // unit not yet authored — skip silently
    }
  }
  cache = all;
  return all;
}

export async function loadMCQsByUnit(unitId: UnitId): Promise<MCQ[]> {
  const all = await loadAllMCQs();
  return all.filter((q) => q.unitId === unitId);
}
