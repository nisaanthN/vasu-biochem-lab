import { notFound } from "next/navigation";
import { EXPERIMENTS, getExperiment } from "@/lib/content/experiments";
import { MichaelisMentenSim } from "@/components/experiments/MichaelisMentenSim";
import { EnzymeInhibitionSim } from "@/components/experiments/EnzymeInhibitionSim";
import { SugarTestSim } from "@/components/experiments/SugarTestSim";
import { TranscriptionSim } from "@/components/experiments/TranscriptionSim";
import { GlycolysisSim } from "@/components/experiments/GlycolysisSim";

export function generateStaticParams() {
  return EXPERIMENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getExperiment(slug);
  if (!e) return { title: "Not found" };
  return { title: e.title, description: e.objective };
}

export default async function ExperimentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getExperiment(slug);
  if (!e) notFound();
  switch (slug) {
    case "michaelis-menten":
      return <MichaelisMentenSim />;
    case "enzyme-inhibition":
      return <EnzymeInhibitionSim />;
    case "qualitative-sugar-tests":
      return <SugarTestSim />;
    case "dna-transcription":
      return <TranscriptionSim />;
    case "glycolysis-walkthrough":
      return <GlycolysisSim />;
    default:
      notFound();
  }
}
