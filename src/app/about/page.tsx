import Link from "next/link";
import { BookOpen, Sparkles, ShieldCheck, GitBranch, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SYLLABUS } from "@/lib/content/syllabus";

export const metadata = {
  title: "About",
  description: "Methodology, references, and credits for BioPharm Lab.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">About</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight leading-tight sm:text-5xl">BioPharm Lab</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          An AI-based biochemistry learning and virtual laboratory platform for Indian B.Pharm students. Aligned with the PCI BP203T syllabus and developed as a credit-worthy academic project at Shri Vishnu College of Pharmacy (Autonomous), Bhimavaram.
        </p>
      </div>

      <section className="mb-10 rounded-2xl border bg-card p-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-primary" /> AI methodology
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The &quot;AI&quot; in BioPharm Lab is intentionally <em>not</em> a large language model. We use three deterministic, offline, privacy-preserving algorithms:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-background p-4">
            <h3 className="text-sm font-semibold">SM-2 spaced repetition</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The same algorithm that powers Anki. Tracks how confidently you answer each MCQ; schedules review intervals that grow with mastery and shrink with mistakes.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <h3 className="text-sm font-semibold">EWMA weak-area scoring</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Per-topic accuracy tracked with an exponentially weighted moving average. Recent performance counts more than ancient performance — you can recover from a bad start.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <h3 className="text-sm font-semibold">3-layer intent classifier</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The tutor matches your message in three layers: regex patterns, fuzzy search (Fuse.js), and glossary keyword scoring. Confidence-gated fallback prevents hallucinations.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          We chose this approach because biochemistry curricula are <strong>closed-world</strong> — a fixed syllabus with finite topics. A curated knowledge graph is more accurate, free to run, doesn&apos;t require an internet connection after first load, and never hallucinates incorrect factual content.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <ShieldCheck className="h-5 w-5 text-primary" /> Privacy
        </h2>
        <Card>
          <CardContent className="space-y-2 py-5 text-sm">
            <p>Everything you do on BioPharm Lab is stored <strong>in your browser&apos;s LocalStorage</strong>:</p>
            <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
              <li>No account creation.</li>
              <li>No server-side storage of any kind.</li>
              <li>No tracking or analytics scripts.</li>
              <li>No third-party AI API calls.</li>
            </ul>
            <p className="text-muted-foreground">
              To reset your progress, clear site data in your browser&apos;s settings.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <GraduationCap className="h-5 w-5 text-primary" /> Syllabus alignment
        </h2>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">
              Each note, experiment, MCQ, and tutor topic is tagged to a unit and sub-topic of the PCI B.Pharm 2nd-semester paper <strong>BP203T — Biochemistry</strong> (45 hours, 4 credits).
            </p>
            <div className="mt-4 space-y-3">
              {SYLLABUS.map((u) => (
                <div key={u.id} className="flex items-start gap-3 rounded-md border p-3">
                  <Badge variant="secondary" className="rounded-md uppercase">{u.id}</Badge>
                  <div>
                    <p className="text-sm font-semibold">{u.title}</p>
                    <p className="text-xs text-muted-foreground">{u.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <BookOpen className="h-5 w-5 text-primary" /> References
        </h2>
        <Card>
          <CardContent className="py-5">
            <ul className="space-y-2 text-sm">
              <li><strong>Lehninger Principles of Biochemistry</strong> — Nelson DL, Cox MM. 8e (2021).</li>
              <li><strong>Textbook of Biochemistry for Medical Students</strong> — Vasudevan DM, Sreekumari S, Vaidyanathan K. 9e (2019).</li>
              <li><strong>Biochemistry</strong> — Satyanarayana U, Chakrapani U. 5e (2017).</li>
              <li><strong>Stryer Biochemistry</strong> — Berg JM, Tymoczko JL, Gatto GJ Jr, Stryer L. 9e (2019).</li>
              <li><strong>PCI Pharmacy Council of India B.Pharm Syllabus</strong> — Paper BP203T, second-semester theory, 4 credits, 45 hours.{" "}<a className="text-primary underline" href="https://www.pci.nic.in" target="_blank" rel="noopener noreferrer">pci.nic.in</a></li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <GitBranch className="h-5 w-5 text-primary" /> Technical stack
        </h2>
        <Card>
          <CardContent className="py-5">
            <ul className="space-y-1 text-sm">
              <li>• <strong>Next.js</strong> with the App Router for routing and server components</li>
              <li>• <strong>TypeScript</strong> end-to-end</li>
              <li>• <strong>Tailwind CSS v4</strong> + <strong>shadcn/ui</strong> for design system</li>
              <li>• <strong>Zustand</strong> + persist middleware for state and LocalStorage</li>
              <li>• <strong>MDX</strong> for authoring notes (via <code>next-mdx-remote</code>)</li>
              <li>• <strong>Recharts</strong> for kinetic and accuracy plots</li>
              <li>• <strong>Fuse.js</strong> for fuzzy intent matching in the tutor</li>
              <li>• <strong>next-themes</strong> for light/dark mode</li>
              <li>• Hosted on <strong>Vercel</strong> (free tier)</li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Source code is open. See the GitHub link in the footer of the repository&apos;s README.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">Project Credits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-xl border bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Developed by</p>
              <p className="mt-1 text-xl font-bold text-foreground">Durga Bhavani</p>
              <p className="text-sm text-muted-foreground">Assistant Professor</p>
            </div>
            <div className="rounded-xl border bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Institution</p>
              <p className="mt-1 text-base font-semibold text-foreground">Shri Vishnu College of Pharmacy</p>
              <p className="text-sm text-muted-foreground">(Autonomous)</p>
              <p className="text-sm text-muted-foreground">Green Meadows Campus, Vishnupur, Bhimavaram — 534202</p>
              <p className="text-sm text-muted-foreground">West Godavari, Andhra Pradesh, India</p>
              <p className="mt-2 text-xs text-muted-foreground">Approved by PCI, AICTE, NAAC, NBA. Listed in NIRF rankings.</p>
            </div>
            <div className="text-muted-foreground">
              <p>
                <strong className="text-foreground">Purpose:</strong> teaching and self-study companion for B.Pharm 2nd-semester Biochemistry (BP203T), aligned with the PCI syllabus.
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Built with:</strong> open-source tools listed above. No paid services, no proprietary datasets.
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Content:</strong> biochemistry content authored from the listed textbooks under fair-use educational interpretation. Specific data points (P/O ratios, Km values) are cited inline.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Built for a B.Pharm classroom. Improvements and contributions welcome via the GitHub repo.{" "}
        <Link href="/" className="text-primary hover:underline">Back home →</Link>
      </p>
    </div>
  );
}
