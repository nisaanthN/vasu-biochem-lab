# Project Structure

A quick map of what every file and folder in this project does.

> If a file is at the **root**, it has to be there — that's just how Next.js, npm, ESLint, and Git are organised. Source code, content, and documentation are grouped into clear sub-folders.

---

## Top level — required by tooling

| File | Purpose |
| :--- | :--- |
| `package.json` | npm scripts and dependency list. Required at root. |
| `package-lock.json` | Pinned dependency versions for reproducible installs. |
| `tsconfig.json` | TypeScript compiler configuration. Required at root. |
| `next.config.ts` | Next.js framework configuration. Required at root. |
| `eslint.config.mjs` | Code-style and lint rules. Required at root. |
| `postcss.config.mjs` | PostCSS pipeline for Tailwind CSS v4. Required at root. |
| `components.json` | shadcn/ui design-system configuration. Required at root. |
| `.gitignore` | Files Git ignores (node_modules, .next, generated docs, etc.). |
| `AGENTS.md` | Tiny note that tells AI coding agents this is Next.js 16. Safe to ignore. |
| `README.md` | Project landing doc shown on GitHub. |

---

## Source code

```
src/
├── app/                       Routes (every folder is a URL)
│   ├── layout.tsx             Root layout — fonts, theme, navbar, footer wrap every page
│   ├── page.tsx               Landing page (/)
│   ├── notes/                 /notes — interactive note library
│   ├── experiments/           /experiments — virtual labs
│   ├── quiz/                  /quiz — practice + adaptive MCQ modes
│   ├── tutor/                 /tutor — rule-based AI tutor
│   ├── dashboard/             /dashboard — XP, badges, weak-area chart
│   └── about/                 /about — methodology + credits
├── components/
│   ├── ui/                    shadcn primitives (Button, Card, Dialog, etc.)
│   ├── layout/                Navbar, Footer, ThemeToggle
│   ├── notes/                 MDX rendering, InlineCheckpoint, ReadingTracker
│   ├── experiments/           All 6 simulation components + shared ExperimentShell
│   ├── quiz/                  QuizRunner (the quiz state machine)
│   ├── tutor/                 ChatWindow with the rule-based responder
│   ├── dashboard/             XPBar, BadgeGrid, WeakAreaChart, RecommendationCard
│   └── gamification/          Toast helpers + badge icon map
├── content/                   ALL educational content lives here (no DB)
│   ├── notes/unit-{1..5}/     10 MDX-authored biochem notes
│   ├── mcq/unit-{1..5}.json   80 multiple-choice questions
│   └── tutor/                 Q&A pairs (40), glossary (120 terms), intent map
├── lib/                       Pure logic; nothing renders here
│   ├── sm2/                   Spaced repetition algorithm
│   ├── adaptive/              Weak-area detection + topic recommender + MCQ selector
│   ├── gamification/          XP rules, levels, badge unlock criteria, streak math
│   ├── tutor/                 3-layer intent classifier + responder
│   └── content/               Syllabus taxonomy + content loaders
├── stores/                    Zustand state stores (4 — progress, quiz, tutor, settings)
├── hooks/                     React hooks (hydration, streak heartbeat, badge watcher)
└── types/                     Shared TypeScript types
```

---

## Static assets

```
public/
├── favicon.ico               Browser tab icon
├── *.svg                     Logo / illustration assets
```

Anything in `public/` is served as-is at the URL root (e.g., `public/foo.svg` → `https://your-site/foo.svg`).

---

## Documentation

```
docs/
├── HOW_TO_USE.md             Student-facing guide (sources)
├── HOW_TO_USE.pdf            Read-only distribution
├── HOW_TO_USE.docx           Editable version (open in Word / Pages / Google Docs)
├── TECHNICAL_GUIDE.md        Developer / instructor guide (sources)
├── TECHNICAL_GUIDE.pdf       Read-only distribution
├── TECHNICAL_GUIDE.docx      Editable version
├── EVALUATION_GUIDE.md       Rubric mapping for the evaluating professor (sources)
├── EVALUATION_GUIDE.pdf      Read-only distribution
├── EVALUATION_GUIDE.docx     Editable version
├── MORNING_HANDOFF.md        Original deployment hand-off notes (historical)
└── PROJECT_STRUCTURE.md      This file
```

PDFs and DOCX files are generated from the `.md` sources. The PDFs use `docs/print.css` for styling (colored headers, code blocks, links, tables, page numbers). Regenerate them with:

```bash
# Styled PDF (preserves links, colors, code blocks, table styling)
pandoc docs/HOW_TO_USE.md \
  --css=docs/print.css \
  --pdf-engine=weasyprint \
  --highlight-style=tango \
  --standalone \
  -o docs/HOW_TO_USE.pdf

# Editable DOCX (open in Word / Pages / Google Docs)
pandoc docs/HOW_TO_USE.md -o docs/HOW_TO_USE.docx
```

You need `pandoc` (any) and `weasyprint` (for PDF) — install both with `brew install pandoc weasyprint`. To regenerate all three docs at once:

```bash
for d in HOW_TO_USE TECHNICAL_GUIDE EVALUATION_GUIDE; do
  pandoc "docs/$d.md" --css=docs/print.css --pdf-engine=weasyprint \
    --highlight-style=tango --standalone -o "docs/$d.pdf"
  pandoc "docs/$d.md" -o "docs/$d.docx"
done
```

---

## Scripts

```
scripts/
└── validate-content.ts       Sanity-check every MCQ has 4 options + valid topic tags
```

Run with `npm run validate:content`.

---

## What's NOT in the repo

- `node_modules/` — installed by `npm install`; ~300 MB of dependencies
- `.next/` — Next.js build output; regenerated by `npm run build`
- `.git/` — Git history (this *is* a git repo, just hidden from the file listing)
- `docs/*.pdf`, `docs/*.docx` — generated artifacts (not source; regenerated from .md)

---

## Why so many config files at root?

The seven config files at root are **all required there by their respective tools**:

- `package.json` and `package-lock.json` — npm convention
- `tsconfig.json` — TypeScript convention
- `next.config.ts` — Next.js convention
- `eslint.config.mjs` — ESLint convention
- `postcss.config.mjs` — PostCSS convention
- `components.json` — shadcn/ui convention

Moving any of them breaks the build. They look like clutter, but every file is doing a job.

If you ever want a "cleaner" view, hide files starting with `.` in your Finder (`Cmd-Shift-.` toggles hidden files on macOS).
