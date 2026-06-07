import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Target, Clock, Sparkles, GraduationCap } from "lucide-react";
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
    <article className="container mx-auto max-w-3xl px-4 py-10 sm:py-12">
      <div className="mb-6">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All notes
        </Link>
      </div>
      <header className="mb-10">
        <Badge variant="secondary" className="mb-4 rounded-md uppercase tracking-wider">
          {unit.replace("-", " ")} · {unitMeta.title}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight leading-tight sm:text-5xl">{note.frontmatter.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{note.frontmatter.blurb}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> ~{note.frontmatter.estimatedMinutes} min read
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> +{note.frontmatter.xp} XP on completion
          </span>
        </div>
        <div className="mt-6 rounded-xl border-2 bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <Target className="h-4 w-4" /> Learning objectives
          </div>
          <ul className="mt-3 space-y-2 text-[15px]">
            {note.frontmatter.learningObjectives.map((lo, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                <span>{lo}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="prose-tuned">
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

      <footer className="mt-12 rounded-xl border-2 bg-card p-6">
        <p className="text-base font-semibold">What next?</p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Test what you just read with the{" "}
          <Link className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary" href={`/quiz/adaptive?unit=${unit}`}>
            adaptive quiz <GraduationCap className="-mt-0.5 inline-block h-4 w-4" />
          </Link>{" "}
          for {unitMeta.title}, or browse the full{" "}
          <Link className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary" href="/notes">
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
