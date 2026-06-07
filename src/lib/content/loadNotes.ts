import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { NoteFrontmatter } from "@/types/content";

const NOTES_DIR = path.join(process.cwd(), "src", "content", "notes");

export interface NoteFile {
  unit: string;
  topicId: string;
  filename: string;
  frontmatter: NoteFrontmatter;
  body: string;
}

export async function listNoteFiles(): Promise<NoteFile[]> {
  const units = await fs.readdir(NOTES_DIR);
  const out: NoteFile[] = [];
  for (const unit of units) {
    const dir = path.join(NOTES_DIR, unit);
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) continue;
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      const full = path.join(dir, file);
      const raw = await fs.readFile(full, "utf8");
      const parsed = matter(raw);
      const fm = parsed.data as NoteFrontmatter;
      out.push({
        unit,
        topicId: fm.topicId,
        filename: file,
        frontmatter: fm,
        body: parsed.content,
      });
    }
  }
  return out;
}

export async function getNoteByTopic(unitId: string, topicId: string): Promise<NoteFile | null> {
  const all = await listNoteFiles();
  return all.find((n) => n.frontmatter.unit === unitId && n.frontmatter.topicId === topicId) ?? null;
}
