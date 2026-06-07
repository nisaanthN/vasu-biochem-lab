import Link from "next/link";
import { BookOpen, Clock, Hash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SYLLABUS } from "@/lib/content/syllabus";
import { listNoteFiles } from "@/lib/content/loadNotes";

export const metadata = {
  title: "Notes",
  description: "Interactive biochemistry notes aligned with PCI B.Pharm BP203T.",
};

export default async function NotesIndexPage() {
  const all = await listNoteFiles();
  const byTopic = new Map(all.map((n) => [`${n.frontmatter.unit}/${n.frontmatter.topicId}`, n]));

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Library</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Interactive notes</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every note targets a specific BP203T sub-topic with learning objectives, key points, mnemonics, and inline checkpoints. Reading a note all the way through earns XP.
        </p>
      </div>

      <div className="space-y-10">
        {SYLLABUS.map((u) => (
          <section key={u.id}>
            <div className="mb-3 flex items-baseline gap-3">
              <Badge variant="secondary" className="rounded-md">{u.id.replace("-", " ").toUpperCase()}</Badge>
              <h2 className="text-xl font-semibold">{u.title}</h2>
              <span className="text-sm text-muted-foreground">{u.subtitle}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {u.topics.map((t) => {
                const file = byTopic.get(`${u.id}/${t.id}`);
                const available = Boolean(file);
                return (
                  <Card key={t.id} className={available ? "transition hover:border-primary/40" : "opacity-60"}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BookOpen className="h-4 w-4 text-primary" />
                        {t.title}
                      </CardTitle>
                      <CardDescription>{t.blurb}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {t.estimatedMinutes} min
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Hash className="h-3 w-3" /> {t.learningObjectives.length} objectives
                        </span>
                      </div>
                      {available ? (
                        <Link
                          href={`/notes/${u.id}/${t.id}`}
                          className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                        >
                          Read note →
                        </Link>
                      ) : (
                        <p className="mt-3 text-xs text-muted-foreground">Coming in v2 — content scaffold ready.</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
