import type { ExperimentMeta } from "@/types/content";

export const EXPERIMENTS: ExperimentMeta[] = [
  {
    slug: "michaelis-menten",
    title: "Michaelis–Menten kinetics simulator",
    unitId: "unit-3",
    subTopicId: "michaelis-menten",
    objective:
      "Visualise how Km and Vmax shape the v vs [S] hyperbola and its Lineweaver–Burk linearisation.",
    estimatedMinutes: 8,
    xp: 50,
    difficulty: "easy",
  },
  {
    slug: "enzyme-inhibition",
    title: "Enzyme inhibition explorer",
    unitId: "unit-3",
    subTopicId: "michaelis-menten",
    objective:
      "Compare competitive, non-competitive, and uncompetitive inhibition by their kinetic signatures.",
    estimatedMinutes: 10,
    xp: 50,
    difficulty: "medium",
  },
  {
    slug: "qualitative-sugar-tests",
    title: "Qualitative carbohydrate tests",
    unitId: "unit-1",
    subTopicId: "carbohydrate-classification",
    objective:
      "Pick a test tube and a reagent — observe the colour change that diagnoses the sugar class.",
    estimatedMinutes: 7,
    xp: 50,
    difficulty: "easy",
  },
  {
    slug: "dna-transcription",
    title: "DNA transcription & translation animator",
    unitId: "unit-4",
    subTopicId: "dna-rna-structure",
    objective:
      "Type a DNA template strand and step through transcription and translation codon by codon.",
    estimatedMinutes: 10,
    xp: 50,
    difficulty: "medium",
  },
  {
    slug: "glycolysis-walkthrough",
    title: "Glycolysis walkthrough",
    unitId: "unit-5",
    subTopicId: "glycolysis",
    objective:
      "Step through the 10 enzymes of glycolysis with a live ATP/NADH ledger and regulatory annotations.",
    estimatedMinutes: 12,
    xp: 50,
    difficulty: "medium",
  },
];

export function getExperiment(slug: string) {
  return EXPERIMENTS.find((e) => e.slug === slug);
}
