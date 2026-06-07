import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Target, Clock, BookOpen } from "lucide-react";
import { getNoteByTopic, listNoteFiles } from "@/lib/content/loadNotes";
import { getTopic, getUnit } from "@/lib/content/syllabus";
import { mdxComponents } from "@/components/notes/MDXComponents";
import { InlineCheckpoint } from "@/components/notes/InlineCheckpoint";
import { ReadingTracker } from "@/components/notes/ReadingTracker";
import { Badge } from "@/components/ui/badge";

interface Params {
  unit: string;
  topic: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const all = await listNoteFiles();
  return all.map((n) => ({ unit: n.frontmatter.unit, topic: n.frontmatter.topicId }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { unit, topic } = await params;
  const note = await getNoteByTopic(unit, topic);
  if (!note) return { title: "Not found" };
  return {
    title: note.frontmatter.title,
    description: note.frontmatter.blurb,
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { unit, topic } = await params;
  const note = await getNoteByTopic(unit, topic);
  const unitMeta = getUnit(unit);
  const topicMeta = getTopic(unit, topic);
  if (!note || !unitMeta || !topicMeta) notFound();

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all notes
        </Link>
      </div>
      <header className="mb-8">
        <Badge variant="secondary" className="mb-3 rounded-md">
          {unit.replace("-", " ").toUpperCase()} · {unitMeta.title}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{note.frontmatter.title}</h1>
        <p className="mt-2 text-muted-foreground">{note.frontmatter.blurb}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> ~{note.frontmatter.estimatedMinutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> +{note.frontmatter.xp} XP on completion
          </span>
        </div>
        <div className="mt-6 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Target className="h-3.5 w-3.5" /> Learning objectives
          </div>
          <ul className="mt-2 space-y-1.5 text-sm">
            {note.frontmatter.learningObjectives.map((lo, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">{i + 1}.</span>
                <span>{lo}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="text-[15px] leading-relaxed">
        <MDXRemote
          source={note.body}
          components={{ ...mdxComponents, InlineCheckpoint }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [],
            },
          }}
        />
      </div>

      <footer className="mt-12 rounded-lg border bg-card p-4 text-sm">
        <p className="font-medium">Next up</p>
        <p className="mt-1 text-muted-foreground">
          Test what you just read in the{" "}
          <Link className="text-primary hover:underline" href={`/quiz/adaptive?unit=${unit}`}>
            adaptive quiz for {unitMeta.title}
          </Link>
          , or browse the full{" "}
          <Link className="text-primary hover:underline" href="/notes">
            note library
          </Link>
          .
        </p>
      </footer>

      <ReadingTracker
        unitId={unit}
        topicId={topic}
        estimatedMinutes={note.frontmatter.estimatedMinutes}
      />
    </article>
  );
}
