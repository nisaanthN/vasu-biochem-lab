import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Beaker,
  GraduationCap,
  MessageSquareText,
  LayoutDashboard,
  Trophy,
  Sparkles,
  ShieldCheck,
  Wifi,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SYLLABUS } from "@/lib/content/syllabus";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Interactive notes",
    description:
      "MDX-powered topics with inline checkpoints, glossary tooltips, and reading-progress tracking.",
    href: "/notes",
  },
  {
    icon: Beaker,
    title: "Virtual experiments",
    description:
      "Hands-on simulations of Michaelis-Menten kinetics, enzyme inhibition, qualitative sugar tests, transcription/translation, and glycolysis.",
    href: "/experiments",
  },
  {
    icon: GraduationCap,
    title: "Adaptive MCQ bank",
    description:
      "80+ pharmacy-relevant questions. SM-2 spaced repetition + weak-area targeting pick what you need next.",
    href: "/quiz",
  },
  {
    icon: MessageSquareText,
    title: "Biochem AI Tutor",
    description:
      "A curated knowledge graph of 40+ topics and 120 terms. No third-party AI calls — your data stays on your device.",
    href: "/tutor",
  },
  {
    icon: LayoutDashboard,
    title: "Progress dashboard",
    description:
      "XP, streaks, weak-area heatmaps, and an AI-generated study plan refreshed every visit.",
    href: "/dashboard",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description:
      "Earn XP, level up titles from Apprentice to Principal Scientist, and unlock 15 badges.",
    href: "/dashboard",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-8 rounded-2xl border-2 bg-card p-5">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Shri Vishnu College of Pharmacy</p>
            <p className="mt-1 text-sm text-muted-foreground">(Autonomous) · Bhimavaram, Andhra Pradesh, India</p>
            <p className="text-xs text-muted-foreground">Approved by PCI, AICTE, NAAC, NBA</p>
          </div>
          <div className="rounded-lg border bg-muted/40 px-4 py-2 text-xs">
            <p className="text-muted-foreground">Developed by</p>
            <p className="font-semibold text-foreground">Durga Bhavani</p>
            <p className="text-muted-foreground">Assistant Professor</p>
          </div>
        </div>
      </div>
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10">
        <div className="grid gap-6 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-3">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Aligned with PCI B.Pharm BP203T
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              The biochemistry study companion that learns alongside you.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Interactive notes, virtual lab experiments, a curated AI tutor, and an adaptive
              quiz engine — all in one place, all in your browser, no signup needed.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild size="lg">
                <Link href="/notes">
                  Start learning <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/experiments">Open the virtual lab</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/dashboard">View dashboard</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-2.5 py-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Offline-first
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-2.5 py-1">
                <Wifi className="h-3.5 w-3.5" /> No server, no signup
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/60 px-2.5 py-1">
                <Zap className="h-3.5 w-3.5" /> SM-2 adaptive review
              </span>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Syllabus coverage</p>
              <ul className="mt-3 space-y-2 text-sm">
                {SYLLABUS.map((u) => (
                  <li key={u.id} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                      {u.id.split("-")[1]}
                    </span>
                    <div>
                      <p className="font-medium">{u.title}</p>
                      <p className="text-xs text-muted-foreground">{u.subtitle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Six features, one workflow</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Each feature feeds the next: reading a note tags topics for review, the quiz routes
              weak areas back to notes, and the tutor cites both.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="transition hover:border-primary/40">
                <CardHeader>
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3">{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" size="sm" className="px-0 text-primary">
                    <Link href={f.href}>
                      Open <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border bg-card p-6 sm:p-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">No external AI, deliberately.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The &quot;AI&quot; in BioPharm Lab is a curated knowledge graph, an SM-2 spaced
              repetition scheduler, and a three-layer intent classifier. Deterministic, free,
              offline, and immune to hallucination on factual content.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Built for the BP203T syllabus.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Every note, MCQ, and experiment maps to a specific unit and sub-topic in PCI&apos;s
              4-credit Biochemistry paper. Topics are tagged so weak-area detection works at the
              right granularity.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Privacy by default.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Progress, XP, badges, and SRS state live in your browser&apos;s LocalStorage. No
              account, no analytics, no third-party data flow. Clear it anytime from your
              browser&apos;s site settings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
