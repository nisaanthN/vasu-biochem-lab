# Evaluation Guide — for the assistant professor

This document is a one-stop guide for assessing BioPharm Lab against the typical rubric for an AI-Based Educational Platform project.

---

## At a glance

- **Live URL**: https://biochem-lab.vercel.app
- **Time to evaluate**: 10–15 minutes for a full walk-through
- **No installation, no signup, no account**: open the URL and start clicking
- **Works offline after first load**

---

## Rubric mapping

### 1. Interactive notes
- **Location**: `/notes` (index) → click any topic
- **What to check**:
  - MDX-rendered notes with structured headings
  - Inline checkpoints (mini-MCQs) embedded in the text
  - Mnemonics and clinical correlation callouts
  - Reading-progress tracking badge at bottom of screen
  - Reading completion awards XP and updates dashboard
- **Sample topics to try**: `/notes/unit-3/michaelis-menten` (most detail), `/notes/unit-1/carbohydrate-classification`

### 2. Virtual experiments
- **Location**: `/experiments` → 5 simulations available
- **What to check**:
  - Sliders / inputs that produce live chart updates
  - Auto-generated observations panel that reflects current state
  - Mark-as-complete button that awards XP
  - At least one experiment per major topic (carbohydrates, enzymes, DNA, metabolism)
- **Sample**: `/experiments/michaelis-menten` — slide Vmax and Km, watch both v-vs-S and Lineweaver-Burk plots update simultaneously. Then `/experiments/enzyme-inhibition` to see how each inhibition mode shifts the LB plot.

### 3. AI tutor
- **Location**: `/tutor`
- **What to check**:
  - Free-form chat interface
  - Suggested-prompt chips for quick start
  - Quick-reply chips after each response
  - Citations linking back to relevant notes
  - Graceful fallback for out-of-scope questions (try "what's the weather like?")
  - Methodology disclosure (no LLM hallucination risk)
- **Try**: "Explain Michaelis-Menten" → follow up with "What about inhibitors?" → ask something unrelated like "Tell me about Newton's laws"

### 4. MCQ generator
- **Location**: `/quiz` (mode selection) → `/quiz/adaptive` or `/quiz/practice`
- **What to check**:
  - 80 questions distributed across all 5 BP203T units
  - Two modes (adaptive uses SM-2 + weak-area targeting)
  - Each question has 4 options + explanation
  - Confidence button ("I knew it" / "I guessed") feeds SM-2 quality signal
  - Wrong answers route the user back to the relevant note
- **Try**: Take an adaptive quiz of 10 questions; observe how the dashboard's weak-area chart populates

### 5. Progress tracking
- **Location**: `/dashboard`
- **What to check**:
  - XP, level, title, streak
  - Stat cards (notes read, experiments done, MCQ attempted, accuracy)
  - Weak-area chart (per-unit accuracy)
  - AI-generated study recommendation
  - Badge grid (15 badges, locked/unlocked)
  - Achievement timeline (chronological milestone log)
- **Try**: Refresh the page after taking actions — the dashboard updates immediately (LocalStorage)

### 6. Gamification
- **Location**: Embedded throughout; aggregated on `/dashboard`
- **What to check**:
  - XP awarded for notes, experiments, MCQs, and tutor questions
  - 20 levels with 5 titles (Apprentice → Principal Scientist)
  - 15 badges with diverse unlock criteria (some hidden)
  - Streak counter increments daily
  - Toast notifications for XP gains and badge unlocks

---

## Suggested 10-minute evaluation flow

1. **0:00–0:30** — Open the URL. Note welcome toast and dark/light mode toggle.
2. **0:30–2:30** — Open `/notes/unit-3/michaelis-menten`. Scroll to ~80%, dwell briefly. Note: progress badge appears at the bottom; reading XP toast fires. Try the inline checkpoint.
3. **2:30–4:30** — Open `/experiments/michaelis-menten`. Move both sliders. Observe live Recharts update. Click "Mark experiment complete" — note XP toast.
4. **4:30–7:30** — Open `/quiz/adaptive`. Answer 10 MCQs (use confidence buttons). Observe explanations and "Read note" links.
5. **7:30–8:30** — Open `/tutor`. Try "Explain Michaelis-Menten" + a follow-up. Then try a deliberately off-syllabus question to see the fallback.
6. **8:30–9:30** — Open `/dashboard`. Observe: XP gained, level/title, badge unlocks, weak-area chart populated, study recommendation refreshed.
7. **9:30–10:00** — Open `/about`. Skim methodology and references.

---

## What makes this project credit-worthy

- **End-to-end engineering** — frontend, state management, content authoring, deployment, all on the public web.
- **Curriculum alignment** — every piece of content tagged to a specific BP203T unit and sub-topic.
- **Methodological honesty** — explicit disclosure of how the "AI" works (SM-2, EWMA, intent classifier) rather than vague claims of "AI-powered". The professor can fully audit the algorithms.
- **Accessibility** — works on any modern browser, no account, no install, no internet after first load.
- **Pedagogically sound** — spaced repetition is the gold standard for retention; weak-area targeting reflects formative assessment principles.
- **Extensible** — adding more content requires only adding MDX/JSON files; no engine changes.
- **Honest about limitations** — no claim of LLM-level conversational ability; the tutor's scope is clearly disclosed.

---

## Limitations and v2 roadmap

For full transparency to the reviewing professor:

- **v1 content is 10 notes / 80 MCQs / 40 tutor Q&As**, not the full library each module could support. The architecture allows seamless expansion.
- **No cross-device sync** (LocalStorage only). A v2 could add Supabase or Firebase auth for cloud sync.
- **Mobile UX** is functional but tablet+ preferred — slider-heavy experiments are cramped on phones.
- **No leaderboard or social features** by deliberate choice — LocalStorage rankings would be trivially spoofable.
- **No PWA / installable app** in v1 — could be added for offline-first deeper experience.

---

## Contact

Questions about implementation, methodology, or content sources? The README has the full reference list. Source code is open via the project's GitHub repository (linked from `/about`).
