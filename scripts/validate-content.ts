import fs from "node:fs/promises";
import path from "node:path";

interface MCQ {
  id: string;
  unitId: string;
  subTopicId: string;
  difficulty: string;
  bloom: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ROOT = path.resolve(process.cwd());
const MCQ_DIR = path.join(ROOT, "src", "content", "mcq");
const NOTES_DIR = path.join(ROOT, "src", "content", "notes");
const SYLLABUS_FILE = path.join(ROOT, "src", "lib", "content", "syllabus.ts");
const TUTOR_QA = path.join(ROOT, "src", "content", "tutor", "qa-pairs.json");

interface QAPair {
  id: string;
  patterns: string[];
  question: string;
  answer: string;
  topicId?: string;
}

async function loadSyllabusTags(): Promise<Set<string>> {
  const src = await fs.readFile(SYLLABUS_FILE, "utf8");
  const topicMatches = [...src.matchAll(/id:\s*"([\w-]+)"/g)].map((m) => m[1]);
  // Filter to topic IDs (anything that isn't a unit ID)
  const set = new Set<string>();
  for (const id of topicMatches) {
    if (id.startsWith("unit-")) continue;
    set.add(id);
  }
  return set;
}

async function validateMCQs(topicIds: Set<string>): Promise<{ ok: boolean; errors: string[]; count: number }> {
  const errors: string[] = [];
  let count = 0;
  const files = await fs.readdir(MCQ_DIR);
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(MCQ_DIR, f), "utf8");
    const data: MCQ[] = JSON.parse(raw);
    for (const q of data) {
      count++;
      if (!q.id) errors.push(`${f}: missing id`);
      if (!q.unitId?.startsWith("unit-")) errors.push(`${q.id}: invalid unitId ${q.unitId}`);
      if (!topicIds.has(q.subTopicId)) errors.push(`${q.id}: unknown subTopicId ${q.subTopicId}`);
      if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${q.id}: must have 4 options`);
      if (q.correctIndex < 0 || q.correctIndex > 3) errors.push(`${q.id}: correctIndex out of range`);
      if (!q.explanation || q.explanation.length < 10) errors.push(`${q.id}: missing/short explanation`);
      if (!q.question || q.question.length < 10) errors.push(`${q.id}: missing/short question`);
    }
  }
  return { ok: errors.length === 0, errors, count };
}

async function validateNotes(topicIds: Set<string>): Promise<{ ok: boolean; errors: string[]; count: number }> {
  const errors: string[] = [];
  let count = 0;
  const units = await fs.readdir(NOTES_DIR);
  for (const u of units) {
    const dir = path.join(NOTES_DIR, u);
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) continue;
    const files = await fs.readdir(dir);
    for (const f of files) {
      if (!f.endsWith(".mdx")) continue;
      count++;
      const content = await fs.readFile(path.join(dir, f), "utf8");
      const fm = content.split("---");
      if (fm.length < 3) errors.push(`${u}/${f}: missing frontmatter`);
      const topicMatch = fm[1]?.match(/topicId:\s*([\w-]+)/);
      if (!topicMatch) errors.push(`${u}/${f}: missing topicId in frontmatter`);
      else if (!topicIds.has(topicMatch[1])) errors.push(`${u}/${f}: unknown topicId ${topicMatch[1]}`);
    }
  }
  return { ok: errors.length === 0, errors, count };
}

async function validateTutor(topicIds: Set<string>): Promise<{ ok: boolean; errors: string[]; count: number }> {
  const errors: string[] = [];
  const raw = await fs.readFile(TUTOR_QA, "utf8");
  const data: QAPair[] = JSON.parse(raw);
  for (const qa of data) {
    if (!qa.id) errors.push(`tutor: missing id`);
    if (!qa.patterns || qa.patterns.length === 0) errors.push(`${qa.id}: missing patterns`);
    if (!qa.answer || qa.answer.length < 20) errors.push(`${qa.id}: short answer`);
    if (qa.topicId && qa.topicId !== "" && !topicIds.has(qa.topicId)) {
      errors.push(`${qa.id}: unknown topicId ${qa.topicId}`);
    }
  }
  return { ok: errors.length === 0, errors, count: data.length };
}

async function main() {
  console.log("Validating content...");
  const topicIds = await loadSyllabusTags();
  console.log(`  Loaded ${topicIds.size} topic IDs from syllabus`);

  const mcq = await validateMCQs(topicIds);
  console.log(`  MCQs: ${mcq.count} checked${mcq.ok ? " ✓" : ""}`);
  if (mcq.errors.length) console.log(mcq.errors.map((e) => `    ✗ ${e}`).join("\n"));

  const notes = await validateNotes(topicIds);
  console.log(`  Notes: ${notes.count} checked${notes.ok ? " ✓" : ""}`);
  if (notes.errors.length) console.log(notes.errors.map((e) => `    ✗ ${e}`).join("\n"));

  const tutor = await validateTutor(topicIds);
  console.log(`  Tutor Q&As: ${tutor.count} checked${tutor.ok ? " ✓" : ""}`);
  if (tutor.errors.length) console.log(tutor.errors.map((e) => `    ✗ ${e}`).join("\n"));

  const total = mcq.errors.length + notes.errors.length + tutor.errors.length;
  if (total > 0) {
    console.log(`\n${total} validation error(s) found.`);
    process.exit(1);
  } else {
    console.log("\nAll content validated ✓");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
