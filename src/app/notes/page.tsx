import Link from "next/link";
import { BookOpen, Clock, Hash, ArrowRight } from "lucide-react";
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
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:py-12">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Library</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight leading-tight sm:text-5xl">Interactive notes</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Every note targets a specific BP203T sub-topic with learning objectives, key points, mnemonics, and inline checkpoints. Reading a note all the way through earns XP.
        </p>
      </div>

      <div className="space-y-12">
        {SYLLABUS.map((u) => (
          <section key={u.id}>
            <div className="mb-5 flex flex-wrap items-baseline gap-3">
              <Badge variant="secondary" className="rounded-md uppercase tracking-wider">{u.id.replace("-", " ")}</Badge>
              <h2 className="text-2xl font-bold sm:text-3xl">{u.title}</h2>
              <span className="text-base text-muted-foreground">{u.subtitle}</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {u.topics.map((t) => {
                const file = byTopic.get(`${u.id}/${t.id}`);
                const available = Boolean(file);
                return (
                  <Card key={t.id} className={available ? "group border-2 transition hover:border-primary/40 hover:shadow-md" : "border-2 opacity-60"}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg leading-snug">{t.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-2 text-[15px] leading-relaxed">{t.blurb}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" /> {t.estimatedMinutes} min
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Hash className="h-4 w-4" /> {t.learningObjectives.length} objectives
                        </span>
                      </div>
                      {available ? (
                        <Link
                          href={`/notes/${u.id}/${t.id}`}
                          className="mt-4 inline-flex items-center gap-1.5 text-base font-medium text-primary hover:underline"
                        >
                          Read note <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </Link>
                      ) : (
                        <p className="mt-4 text-sm text-muted-foreground">Coming in v2 — content scaffold ready.</p>
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
