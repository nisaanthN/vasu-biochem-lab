import { ChatWindow } from "@/components/tutor/ChatWindow";

export const metadata = {
  title: "AI Tutor",
  description: "Rule-based biochem tutor for the BP203T syllabus. Offline, deterministic, and no hallucination.",
};

export default function TutorPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">AI Tutor</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Biochem AI Tutor</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          A curated knowledge graph of 40+ Q&A topics and 120 glossary terms — no third-party AI calls. Ask about biomolecules, enzymes, nucleic acids, bioenergetics, or metabolism.
        </p>
      </div>
      <ChatWindow />
    </div>
  );
}
