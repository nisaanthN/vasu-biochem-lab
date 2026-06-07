import type { Unit } from "@/types/content";

export const SYLLABUS: Unit[] = [
  {
    id: "unit-1",
    title: "Biomolecules — Carbohydrates & Lipids",
    subtitle: "Classification, properties, and biological roles",
    syllabusHours: 10,
    description:
      "Foundational organic chemistry of two of the four major biomolecules. Covers classification trees, structural representations, and the functional consequences of each class.",
    topics: [
      {
        id: "carbohydrate-classification",
        title: "Carbohydrate classification and structure",
        blurb:
          "Mono-, di-, oligo-, and polysaccharides. Fischer vs. Haworth projections. Reducing and non-reducing sugars.",
        estimatedMinutes: 12,
        prerequisites: [],
        learningObjectives: [
          "Classify any given carbohydrate by chain length and functional group",
          "Distinguish reducing from non-reducing sugars",
          "Convert between Fischer and Haworth projections for hexoses",
        ],
      },
      {
        id: "lipid-classification",
        title: "Lipid classification and properties",
        blurb:
          "Simple, compound, and derived lipids. Fatty acid nomenclature, saponification number, iodine number.",
        estimatedMinutes: 14,
        prerequisites: [],
        learningObjectives: [
          "Identify simple vs compound vs derived lipids",
          "Compute iodine and saponification numbers given inputs",
          "Explain why phospholipids form bilayers",
        ],
      },
    ],
  },
  {
    id: "unit-2",
    title: "Proteins & Amino Acids",
    subtitle: "Structure hierarchy and physicochemical properties",
    syllabusHours: 8,
    description:
      "Amino acid chemistry through to quaternary protein structure. Emphasis on properties testable in qualitative analysis and on the structural drivers of biological function.",
    topics: [
      {
        id: "amino-acid-classification",
        title: "Amino acid classification",
        blurb:
          "Essential vs non-essential, polar/nonpolar, acidic/basic. Zwitterions, pI, and titration behavior.",
        estimatedMinutes: 12,
        prerequisites: [],
        learningObjectives: [
          "Categorize the 20 standard amino acids by side-chain class",
          "Predict net charge at any pH given pKa values",
          "Identify the isoelectric point from a titration curve",
        ],
      },
      {
        id: "protein-structure",
        title: "Protein structure: 1° through 4°",
        blurb:
          "Primary, secondary (α-helix, β-sheet), tertiary, and quaternary structure. Forces stabilizing each level.",
        estimatedMinutes: 14,
        prerequisites: ["amino-acid-classification"],
        learningObjectives: [
          "Distinguish the four levels of protein structure",
          "Identify which bonds/interactions stabilize each level",
          "Predict the effect of denaturing conditions on each level",
        ],
      },
    ],
  },
  {
    id: "unit-3",
    title: "Enzymes",
    subtitle: "Classification, kinetics, inhibition, and regulation",
    syllabusHours: 10,
    description:
      "The most heavily tested unit. Covers IUBMB nomenclature, Michaelis–Menten formalism, the three classical inhibition modes, and allosteric regulation.",
    topics: [
      {
        id: "enzyme-classification",
        title: "Enzyme classification (IUBMB)",
        blurb:
          "Six classes: oxidoreductases, transferases, hydrolases, lyases, isomerases, ligases. Examples and EC numbering.",
        estimatedMinutes: 10,
        prerequisites: [],
        learningObjectives: [
          "Assign any enzyme to one of the six IUBMB classes",
          "Recognize EC numbers and decode the first digit",
          "Match common pharmacy-relevant enzymes to their class",
        ],
      },
      {
        id: "michaelis-menten",
        title: "Michaelis–Menten kinetics & inhibition",
        blurb:
          "Vmax, Km, the rectangular hyperbola, Lineweaver–Burk linearization. Competitive, non-competitive, uncompetitive inhibition.",
        estimatedMinutes: 18,
        prerequisites: ["enzyme-classification"],
        learningObjectives: [
          "Interpret v vs [S] and 1/v vs 1/[S] plots quantitatively",
          "Distinguish the three inhibition modes from their kinetic signatures",
          "Calculate apparent Km and Vmax given inhibitor data",
        ],
      },
    ],
  },
  {
    id: "unit-4",
    title: "Nucleic Acids & Bioenergetics",
    subtitle: "Information storage and energy currency",
    syllabusHours: 9,
    description:
      "DNA/RNA structure and the central dogma, paired with the thermodynamics of metabolism — high-energy phosphates, the ETC, and oxidative phosphorylation.",
    topics: [
      {
        id: "dna-rna-structure",
        title: "DNA and RNA structure",
        blurb:
          "Watson–Crick base pairing, antiparallel strands, mRNA/tRNA/rRNA. The central dogma in outline.",
        estimatedMinutes: 14,
        prerequisites: [],
        learningObjectives: [
          "Draw a Watson–Crick base pair with correct hydrogen bonds",
          "Distinguish the three classes of RNA by function",
          "Trace a gene from DNA template to polypeptide",
        ],
      },
      {
        id: "etc-oxphos",
        title: "Electron transport chain & oxidative phosphorylation",
        blurb:
          "Complexes I–IV, ubiquinone, cytochrome c, ATP synthase, chemiosmotic theory. P/O ratios for NADH and FADH₂.",
        estimatedMinutes: 16,
        prerequisites: [],
        learningObjectives: [
          "Order the ETC complexes and their substrates/products",
          "Explain Mitchell's chemiosmotic hypothesis",
          "Calculate ATP yield given NADH/FADH₂ inputs",
        ],
      },
    ],
  },
  {
    id: "unit-5",
    title: "Metabolism & Metabolic Disorders",
    subtitle: "Glycolysis, TCA, β-oxidation, urea cycle",
    syllabusHours: 8,
    description:
      "The major catabolic and anabolic pathways with the clinical disorders associated with each. Pharmacy-relevant correlations: diabetes, PKU, gout, fatty liver.",
    topics: [
      {
        id: "glycolysis",
        title: "Glycolysis",
        blurb:
          "The 10 steps from glucose to pyruvate. Regulatory enzymes (HK, PFK-1, PK), net ATP yield, and clinical context.",
        estimatedMinutes: 18,
        prerequisites: [],
        learningObjectives: [
          "Recall the 10 enzymes of glycolysis in order",
          "Identify the three irreversible regulatory steps",
          "Compute net ATP yield and balance for the pathway",
        ],
      },
      {
        id: "tca-cycle",
        title: "TCA cycle & metabolic disorders",
        blurb:
          "Krebs cycle: 8 steps, energy yield, regulation. Common pharmacy-relevant disorders: diabetes mellitus, PKU, gout.",
        estimatedMinutes: 16,
        prerequisites: ["glycolysis"],
        learningObjectives: [
          "Order the 8 enzymes of the TCA cycle",
          "Compute total ATP yield per acetyl-CoA entering the cycle",
          "Link three classical metabolic disorders to their biochemical defect",
        ],
      },
    ],
  },
];

export const ALL_UNITS = SYLLABUS;

export function getUnit(unitId: string): Unit | undefined {
  return SYLLABUS.find((u) => u.id === unitId);
}

export function getTopic(unitId: string, topicId: string) {
  const u = getUnit(unitId);
  return u?.topics.find((t) => t.id === topicId);
}

export function getAllTopics() {
  return SYLLABUS.flatMap((u) => u.topics.map((t) => ({ unit: u, topic: t })));
}

export function getTagId(unitId: string, topicId: string) {
  return `${unitId}.${topicId}`;
}

export function parseTagId(tag: string): { unitId: string; topicId: string } | null {
  const [unitId, topicId] = tag.split(".");
  if (!unitId || !topicId) return null;
  return { unitId, topicId };
}
