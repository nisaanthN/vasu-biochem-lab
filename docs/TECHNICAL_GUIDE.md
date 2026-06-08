# BioPharm Lab — Technical Guide

> A concise technical overview of how the platform is designed, built, and deployed.
> Audience: instructors evaluating the project, developers maintaining or extending it.

---

## 1. Project at a glance

| Attribute | Value |
| :--- | :--- |
| **Project** | BioPharm Lab — AI Biochemistry Learning & Virtual Laboratory |
| **Developer** | Durga Bhavani (Assistant Professor) |
| **Institution** | Shri Vishnu College of Pharmacy (Autonomous), Bhimavaram |
| **Syllabus** | PCI B.Pharm Paper BP203T — Biochemistry (2nd semester, 4 credits) |
| **Hosting** | Vercel (free tier) |
| **Architecture** | Client-only static Next.js app, no backend, no database |
| **Persistence** | Browser LocalStorage (Zustand persist middleware) |
| **Repository** | Public GitHub |

---

## 2. Tech stack

A minimal, modern stack chosen for stability, zero ops cost, and good developer experience.

| Layer | Choice | Why |
| :--- | :--- | :--- |
| Framework | **Next.js 16** (App Router, React Server Components) | Industry-standard React framework, free Vercel deploy, file-system routing |
| Language | **TypeScript** end-to-end | Static type safety across UI, state, content schemas |
| Styling | **Tailwind CSS v4** + **shadcn/ui** (radix-nova preset) | Utility-first CSS, accessible component primitives |
| State | **Zustand** + `persist` middleware | Tiny (1 KB) atomic store; LocalStorage backing for free |
| Content (notes) | **MDX** via `next-mdx-remote/rsc` | Rich markdown with embedded React components |
| Content (MCQ + tutor) | **JSON** files | Easy to author and validate; no DB required |
| Charts | **Recharts** | React-friendly, declarative, decent defaults |
| Fuzzy search | **Fuse.js** | 6 KB; powers the tutor's intent classifier |
| Animation | **Framer Motion** (light usage) | Toast micro-animations |
| Theme | **next-themes** | Light/dark/system mode |
| Icons | **lucide-react** | Consistent line-icon set |

**No external LLM API.** All "AI" features are algorithmic (see section 5).

---

## 3. Project structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout, theme, navbar, footer
│   ├── page.tsx                  # Landing page
│   ├── notes/[unit]/[topic]/     # Dynamic MDX-rendered note pages
│   ├── experiments/[slug]/       # Experiment dispatcher
│   ├── quiz/{practice,adaptive}/ # Quiz modes
│   ├── tutor/                    # AI tutor chat
│   ├── dashboard/                # Progress dashboard
│   └── about/                    # Credits and methodology
├── components/
│   ├── ui/                       # shadcn primitives (Button, Card, etc.)
│   ├── layout/                   # Navbar, Footer, ThemeToggle
│   ├── notes/                    # MDXComponents, ReadingTracker, InlineCheckpoint
│   ├── experiments/              # 6 simulations + ExperimentShell wrapper
│   ├── quiz/                     # QuizRunner (state machine + result summary)
│   ├── tutor/                    # ChatWindow with rule-based responder
│   ├── dashboard/                # XPBar, BadgeGrid, WeakAreaChart, etc.
│   └── gamification/             # XP toast, badge icons
├── content/
│   ├── notes/unit-{1..5}/        # 10 MDX files
│   ├── mcq/unit-{1..5}.json      # 80 MCQs
│   └── tutor/{intents,qa-pairs,glossary}.json
├── lib/
│   ├── sm2/                      # Spaced repetition algorithm + scheduler
│   ├── adaptive/                 # Weak-area detection + recommender + question selector
│   ├── gamification/             # XP rules, levels, badges, streaks
│   ├── tutor/                    # Intent classifier + responder
│   └── content/                  # Syllabus taxonomy + content loaders
├── stores/                       # Zustand stores (progress, quiz, tutor, settings)
├── hooks/                        # useHydrated, useStreakHeartbeat, useBadgeWatcher
└── types/                        # Shared TypeScript types
```

**~6,000 lines of TypeScript + ~3,500 lines of MDX/JSON content.**

---

## 4. Routing model

Next.js App Router with three patterns:

| Pattern | Used for | Render strategy |
| :--- | :--- | :--- |
| Static (○) | `/`, `/notes`, `/experiments`, `/quiz`, `/tutor`, `/dashboard`, `/about` | Prerendered at build time |
| Static with params (●) | `/notes/[unit]/[topic]`, `/experiments/[slug]` | Prerendered at build time via `generateStaticParams` |
| Server-rendered (ƒ) | `/quiz/adaptive`, `/quiz/practice` | Rendered on demand (small dynamic data deps) |

All 27 pages prerender at build time; cold-start is essentially instant.

---

## 5. The "AI" algorithms

Three deterministic algorithms power the platform's adaptive features. No external API calls.

### 5.1 SM-2 Spaced Repetition

Per-card flashcard state stored in `progressStore.srs[questionId]`:

```
SRSCard = {
  repetitions, easeFactor, interval, nextReviewDate, lastQuality
}
```

After each MCQ response, quality `q ∈ {0..5}` is computed from correctness + response time:

```
if (!correct) q = elapsedMs > 20000 ? 0 : 1
else if (elapsedMs > 20000) q = 3
else if (elapsedMs > 8000)  q = 4
else                        q = 5
```

The card's interval and ease factor update:

```
if (q < 3) { repetitions = 0; interval = 1 }
else {
  if (rep == 0) interval = 1
  else if (rep == 1) interval = 6
  else interval = round(prev_interval * EF)
  rep++
}
EF = max(1.3, EF + (0.1 - (5-q) * (0.08 + (5-q)*0.02)))
nextReviewDate = today + interval days
```

This is the algorithm Anki uses. Implementation: `src/lib/sm2/sm2.ts`.

### 5.2 EWMA Weak-Area Detection

Per-topic accuracy tracked with an exponentially weighted moving average (α = 0.3):

```
TagStat = { tagId, attempts, correct, ewmaAccuracy, lastSeen }
new_ewma = α * sample + (1 - α) * previous_ewma
```

Weak areas are topics with `ewmaAccuracy < 0.6` and at least 3 attempts. Recent performance dominates over ancient — students can recover from a bad start. Implementation: `src/lib/adaptive/weakAreas.ts`.

### 5.3 Next-best-topic recommender

Each topic scored with a weighted sum:

```
score(topic) =
    0.40 * weakness            (1 - ewmaAccuracy)
  + 0.20 * recencyDecay         (1 - days since last seen / 14)
  + 0.20 * prereqReadiness     (1 if prereqs met else 0.4)
  + 0.10 * syllabusOrder        (gentle nudge to PCI order)
  + 0.10 * noveltyBoost         (unseen topics get a small boost)
```

The top-scoring topic is shown on the dashboard as "Recommended next". Implementation: `src/lib/adaptive/recommender.ts`.

### 5.4 Rule-based tutor (3-layer intent classifier)

```
user message
  → normalize (lowercase, strip punctuation)
  → Layer 1: regex pattern match     [high confidence]
  → Layer 2: Fuse.js fuzzy over qa-pairs[].patterns  [threshold 0.42]
  → Layer 3: glossary keyword scoring [low confidence]
  → if any layer ≥ threshold: render canned answer + cite source note
  → else fallback: extract recognized biochem terms, offer 3 related topics
```

Backed by 40 curated Q&A pairs and 120 glossary terms (~4 KB JSON). Implementation: `src/lib/tutor/intentClassifier.ts` + `src/lib/tutor/responder.ts`.

---

## 6. State management

### Single source of truth: Zustand stores

Four stores, namespaced in LocalStorage as `biopharm-lab:<slice>`:

| Store | Role | Persisted? |
| :--- | :--- | :--- |
| `progressStore` | XP, level, streak, notes read, experiments done, SRS state, badges, achievements | ✅ |
| `quizStore` | Current quiz session (questions, current index, answers) | ❌ (session-scoped) |
| `tutorStore` | Chat message history | ✅ (last 50) |
| `settingsStore` | Theme preference, sound, welcome flag | ✅ |

### Hydration safety

LocalStorage isn't available during SSR. We use a `useHydrated()` hook to gate render of any client-only data — preventing the React hydration mismatch warning.

### Schema versioning

`progressStore` has a `schemaVersion: number` field. If the schema ever needs to change, a migration function in `src/lib/storage/migrations.ts` handles forward upgrades.

---

## 7. Content authoring

### Notes (MDX)

Notes live in `src/content/notes/unit-X/topic-id.mdx`. Frontmatter:

```yaml
---
unit: unit-3
topicId: michaelis-menten
title: Michaelis–Menten kinetics & inhibition
blurb: One-line summary
estimatedMinutes: 18
xp: 25
learningObjectives:
  - Outcome 1
  - Outcome 2
references:
  - Lehninger, 8e, Ch. 6
---
```

Body is markdown plus custom React components:
- `<Callout variant="info|success|warning|danger" title="...">`
- `<KeyPoint>`
- `<Mnemonic phrase="...">`
- `<InlineCheckpoint question="..." options={[...]} explanation="..." />`

### MCQ bank (JSON)

`src/content/mcq/unit-X.json` arrays of:

```json
{
  "id": "u3-q01",
  "unitId": "unit-3",
  "subTopicId": "michaelis-menten",
  "difficulty": "easy|medium|hard",
  "bloom": "recall|apply|analyze",
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0,
  "explanation": "...",
  "references": ["optional"]
}
```

### Tutor knowledge base

- `qa-pairs.json` — 40 entries with `patterns[]`, `answer`, `citationTopicIds[]`, `followUps[]`
- `glossary.json` — 120 entries with `term`, `aliases[]`, `shortDef`
- `intents.json` — 8 high-level intents

Adding new content requires zero code changes. A validation script (`scripts/validate-content.ts`) ensures every MCQ has 4 options, valid `correctIndex`, and a non-empty explanation, and that every tag references a known topic in the syllabus taxonomy.

---

## 8. Gamification

| Mechanic | Implementation |
| :--- | :--- |
| **XP** | Earned per note read, MCQ correct, experiment completed, daily login, streak bonus. Rules in `src/lib/gamification/xp.ts`. |
| **Levels** | Quadratic curve `xpRequiredForLevel(n) = floor(100 * n^1.5)`. 20 levels cap. 5 title bands. |
| **Badges** | 15 unique unlock criteria. Evaluated as pure functions over `ProgressState`. Some hidden until unlocked. |
| **Streaks** | Daily login counted by date (YYYY-MM-DD). +5 XP × min(streakDays, 10) bonus on each new day. |
| **Achievements** | Timestamped event log persisted in `progressStore.achievements`. Shown on dashboard. |

Badge re-evaluation runs on every XP gain via a Zustand subscription in `useBadgeWatcher`.

---

## 9. Deployment

### Local development

```bash
git clone <repo>
cd <repo>
npm install
npm run dev          # http://localhost:3000
```

### Production build

```bash
npm run build        # static build, 27 pages prerendered
npm run start        # serves the build locally
```

### Verification scripts

```bash
npm run typecheck         # tsc --noEmit
npm run lint              # eslint
npm run validate:content  # content schema sanity
```

### Vercel deployment

1. Push to GitHub `main` branch.
2. Visit `https://vercel.com/new` and import the repository.
3. Vercel auto-detects Next.js — no configuration needed.
4. The project name becomes the subdomain (e.g., `biochem-virtual-lab.vercel.app`).
5. **Auto-deploy** on every push to `main`. Preview deployments on PRs.

No environment variables needed. No backend. No database. No paid services.

---

## 10. Performance & accessibility

- **Bundle size**: ~280 KB JavaScript gzipped on initial route; ~50–100 KB extra per dynamic chunk.
- **Lighthouse**: Performance >85, Accessibility >90, Best Practices >90 on a typical run.
- **Server-rendered HTML**: every page is meaningful even with JavaScript disabled (notes render their content fully).
- **Keyboard navigation**: all interactive controls are reachable via Tab. Quiz options are real `<button>` elements with disabled states.
- **Reduced motion**: respected via `prefers-reduced-motion` media query (sonner toast respects it).
- **Dark mode**: full theme support via `next-themes`, including persistent preference.

---

## 11. Security & privacy

- **No server-side data**. Nothing leaves the user's browser.
- **No third-party tracking**. No Google Analytics, no Vercel Analytics, no Sentry.
- **No external API calls** except Vercel's CDN for static assets.
- **No cookies** (LocalStorage only).
- **Open source** under the project repository.

---

## 12. Limitations and future work

### Known limitations (v1)

- Content is limited to v1 scope: 10 notes, 80 MCQs, 40 tutor Q&A pairs (architecture supports unlimited expansion).
- Mobile UX is acceptable but tablet+ is the primary target — slider controls in experiments are cramped on small phones.
- No cross-device sync (LocalStorage only).
- The MDX rendering uses a defensive `<InlineCheckpoint>` fallback for ~2 notes where unicode chars in JSX props don't parse cleanly. The notes still work fully; only the inline mini-quiz at the bottom of those two is suppressed.

### v2 ideas

- Add Supabase or Firebase for optional cloud sync (with anonymous IDs).
- Expand content: more notes, more MCQs, more experiments (Lineweaver-Burk inhibition with substrate inhibition, Bradford assay, paper chromatography).
- PWA / installable app for offline-first deeper experience.
- Teacher dashboard view (for batch progress analytics).
- Integration with Indian Pharmacopoeia for drug-specific MCQ tags.

---

## 13. Quick reference for maintainers

### Add a new note
1. Create `src/content/notes/unit-X/new-topic.mdx` with frontmatter.
2. Add the topic to `SYLLABUS` in `src/lib/content/syllabus.ts` (if it's a new sub-topic).
3. `npm run validate:content` to confirm tags resolve.
4. Build and push.

### Add new MCQs
1. Edit `src/content/mcq/unit-X.json`.
2. Each entry needs `id`, `unitId`, `subTopicId`, `question`, `options[4]`, `correctIndex`, `explanation`.
3. `npm run validate:content` to confirm.
4. Build and push.

### Add a new experiment
1. Add an entry to `EXPERIMENTS` in `src/lib/content/experiments.ts`.
2. Create the simulation component in `src/components/experiments/YourSim.tsx`.
3. Add a case to the dispatcher in `src/app/experiments/[slug]/page.tsx`.
4. Build and push.

### Add tutor Q&A
1. Edit `src/content/tutor/qa-pairs.json`.
2. Each entry needs `id`, `patterns[]`, `question`, `answer`, optional `citationTopicIds[]`.
3. `npm run validate:content` to confirm.
4. Build and push.

---

*Developed by Durga Bhavani · Shri Vishnu College of Pharmacy (Autonomous), Bhimavaram, Andhra Pradesh, India.*
