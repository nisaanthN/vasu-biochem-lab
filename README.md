# BioPharm Lab

> **AI-Based Biochemistry Learning and Virtual Laboratory Platform**
> Developed by **Durga Bhavani**, Assistant Professor
> Shri Vishnu College of Pharmacy (Autonomous), Bhimavaram, Andhra Pradesh

A free, offline-first study companion aligned with the PCI B.Pharm 2nd-semester paper **BP203T — Biochemistry** (45 hours, 4 credits).

**🌐 Live URL:** *Set during Vercel import — recommended `biochem-virtual-lab.vercel.app`*

---

## Quick start

```bash
git clone <this repo>
cd vasu      # local folder name
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For production: `npm run build && npm run start`.

---

## What's inside

| Feature | What it does |
| :--- | :--- |
| **📚 Interactive notes** | 10 MDX-authored topics across all 5 BP203T units with inline checkpoints, mnemonics, clinical correlations, reading-progress tracking |
| **🧪 Virtual experiments** | 6 simulations: Michaelis-Menten kinetics, enzyme inhibition explorer, qualitative carbohydrate tests, DNA transcription/translation, glycolysis walkthrough, and a **full volumetric titration lab** (HCl vs Na₂CO₃) |
| **🎓 AI tutor** | Rule-based chat backed by a 3-layer intent classifier (regex → fuzzy → glossary) over 40 curated Q&A pairs and a 120-term glossary — no LLM, no hallucinations |
| **📊 MCQ generator** | 80 pre-built questions tagged by unit, sub-topic, difficulty, and Bloom's level; practice mode + SM-2 spaced-repetition adaptive mode |
| **🏆 Progress tracking** | LocalStorage-backed dashboard: XP, level, streak, weak-area chart, recommended-next-topic, SM-2 review queue |
| **✨ Gamification** | XP economy, quadratic level curve (20 levels, 5 titles), 15 unlockable badges, personal Hall of Achievements timeline |

---

## Documentation

- [docs/HOW_TO_USE.md](docs/HOW_TO_USE.md) — student-facing user guide
- [docs/TECHNICAL_GUIDE.md](docs/TECHNICAL_GUIDE.md) — concise developer / instructor guide
- [docs/EVALUATION_GUIDE.md](docs/EVALUATION_GUIDE.md) — rubric mapping for the evaluating professor
- [MORNING_HANDOFF.md](MORNING_HANDOFF.md) — original deployment handoff notes

---

## How to evaluate this project (10-minute flow for the professor)

1. **Open the live URL** — no install, no signup, no account required.
2. **Read a note** — try `/notes/unit-3/michaelis-menten` (most detail). Scroll past 80% and observe the progress bar; XP toast appears at completion. Try the inline checkpoint.
3. **Run an experiment** — `/experiments/michaelis-menten`. Drag the Vmax and Km sliders; both plots update live. Click "Mark experiment complete" for +50 XP.
4. **Try the volumetric titration** — `/experiments/volumetric-titration`. A full wet-lab simulation: weigh Na₂CO₃, dissolve, add methyl orange, fill burette, titrate to endpoint, calculate molarity.
5. **Take an adaptive quiz** — `/quiz/adaptive`. Answer 10 MCQs; observe how explanations and "Read the note" links route you back to the relevant note.
6. **Ask the tutor** — `/tutor`. Try "Explain Michaelis-Menten" then follow-up with a vague "what about inhibitors?" — see citation chips link back into the notes.
7. **Open the dashboard** — `/dashboard`. XP, streak, badges, weak-area chart, recommendation should all reflect what you just did.
8. **Methodology page** — `/about`. Explains the SM-2 + intent classifier algorithms, references, and credits.

---

## Syllabus alignment (BP203T)

| Unit | Title | Notes | Experiment(s) | MCQs |
|------|-------|-------|---------------|------|
| I | Biomolecules — Carbohydrates & Lipids | 2 | Qualitative sugar tests | 18 |
| II | Proteins & Amino Acids | 2 | — | 15 |
| III | Enzymes | 2 | MM kinetics, Inhibition explorer, **Volumetric titration** | 20 |
| IV | Nucleic Acids & Bioenergetics | 2 | DNA transcription/translation | 15 |
| V | Metabolism & Disorders | 2 | Glycolysis walkthrough | 12 |
| **Total** | | **10** | **6** | **80** |

---

## AI methodology — honest disclosure

The "AI" in BioPharm Lab is deliberately **not** a large language model. Three deterministic algorithms power the adaptive features:

1. **SM-2 spaced repetition** — the same algorithm Anki uses. Schedules each MCQ for re-review based on response quality (correctness + response time).
2. **EWMA weak-area scoring** — per-topic accuracy with an exponentially weighted moving average; recent performance dominates ancient.
3. **3-layer intent classifier** — regex patterns → Fuse.js fuzzy search → glossary keyword scoring. Confidence-gated fallback prevents hallucinations.

Chosen for an educational tool because: deterministic, 100% accurate on what it knows, no API costs, offline-capable, no privacy concerns, no API keys to leak.

See [docs/TECHNICAL_GUIDE.md](docs/TECHNICAL_GUIDE.md) section 5 for full algorithm details.

---

## Tech stack

- **Next.js 16** (App Router, React Server Components)
- **TypeScript** end-to-end
- **Tailwind CSS v4** + **shadcn/ui** (radix-nova preset)
- **Zustand** + `persist` middleware for LocalStorage-backed state
- **MDX** via `next-mdx-remote/rsc` for note authoring
- **Recharts** for kinetic and accuracy plots
- **Fuse.js** for fuzzy intent matching
- **next-themes** for light/dark mode
- Deployed on **Vercel** (free tier)

No paid services. No backend. No database. No external API calls. Everything runs in the browser.

---

## Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Local development server (hot reload) |
| `npm run build` | Production build (27 prerendered pages) |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript compile check (`tsc --noEmit`) |
| `npm run validate:content` | Content schema sanity (every MCQ has 4 options, valid topic tags) |

---

## References

- **Lehninger Principles of Biochemistry**, Nelson & Cox, 8e (2021)
- **Textbook of Biochemistry for Medical Students**, Vasudevan / Sreekumari / Vaidyanathan, 9e (2019)
- **Biochemistry**, Satyanarayana & Chakrapani, 5e (2017)
- **Stryer Biochemistry**, Berg et al., 9e (2019)
- **PCI Pharmacy Council of India B.Pharm Syllabus** — paper BP203T

---

## Credits

- **Developed by**: Durga Bhavani — Assistant Professor
- **Institution**: Shri Vishnu College of Pharmacy (Autonomous), Bhimavaram, West Godavari, Andhra Pradesh, India
- **Approved by**: PCI, AICTE, NAAC, NBA. Listed in NIRF.
- **License**: Open for educational use. Content authored from listed textbooks under fair-use educational interpretation.

Built to support B.Pharm 2nd-semester Biochemistry (BP203T) teaching and self-study.
