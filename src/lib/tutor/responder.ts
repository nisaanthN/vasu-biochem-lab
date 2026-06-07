import type { ChatMessage, QAPair, ClassificationResult } from "@/types/tutor";
import { getQA, getGlossary } from "./intentClassifier";
import { getTopic, getUnit, SYLLABUS } from "@/lib/content/syllabus";

function buildCitations(qa: QAPair) {
  if (!qa.citationTopicIds || qa.citationTopicIds.length === 0) return [];
  const topics = qa.citationTopicIds
    .map((id) => {
      const unit = SYLLABUS.find((u) => u.topics.some((t) => t.id === id));
      const topic = unit?.topics.find((t) => t.id === id);
      if (!unit || !topic) return null;
      return { label: topic.title, href: `/notes/${unit.id}/${topic.id}` };
    })
    .filter((x): x is { label: string; href: string } => Boolean(x));
  return topics;
}

function makeId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const HEDGE_OPENERS = [
  "I'm not sure I have a direct answer to that — ",
  "I don't have a curated answer for that one, but ",
  "That's a bit outside my BP203T knowledge graph, but ",
];

export function respondToClassification(
  userText: string,
  result: ClassificationResult,
): ChatMessage {
  const at = new Date().toISOString();

  if (result.layer === 1 || result.layer === 2) {
    const qa = result.qaId ? getQA(result.qaId) : undefined;
    if (qa) {
      return {
        id: makeId(),
        role: "tutor",
        text: qa.answer,
        citations: buildCitations(qa),
        quickReplies: qa.followUps,
        matchConfidence: result.confidence,
        matchedQAId: qa.id,
        at,
      };
    }
  }

  if (result.layer === 3 && result.suggestedTopics && result.suggestedTopics.length > 0) {
    const opener = HEDGE_OPENERS[0];
    const citations = result.suggestedTopics
      .filter((s) => s.topicId)
      .map((s) => {
        const unit = SYLLABUS.find((u) => u.topics.some((t) => t.id === s.topicId));
        if (!unit) return null;
        const topic = getTopic(unit.id, s.topicId);
        if (!topic) return null;
        return { label: topic.title, href: `/notes/${unit.id}/${topic.id}` };
      })
      .filter((x): x is { label: string; href: string } => Boolean(x));

    const matched = result.matchedTerms?.join(", ") ?? "the topic you mentioned";
    return {
      id: makeId(),
      role: "tutor",
      text: `${opener}I spotted **${matched}** in your message. Here are the most relevant topics from the curriculum — clicking them opens the notes:`,
      citations,
      quickReplies: ["Explain Michaelis-Menten", "What is glycolysis?", "Walk me through the central dogma"],
      matchConfidence: result.confidence,
      at,
    };
  }

  // No match at all
  const glossary = getGlossary();
  const sample = glossary.slice(0, 5).map((g) => g.term).join(", ");
  void userText;
  return {
    id: makeId(),
    role: "tutor",
    text: `I couldn't find a direct match for that. I'm trained on the PCI BP203T Biochemistry syllabus — biomolecules, proteins, enzymes, nucleic acids, bioenergetics, and metabolism. Try terms like **${sample}**, or pick one of the suggested prompts below.`,
    quickReplies: [
      "Explain Michaelis-Menten",
      "What is glycolysis?",
      "Difference between competitive and non-competitive inhibition",
      "What is denaturation?",
      "How much ATP from one glucose?",
    ],
    matchConfidence: 0,
    at,
  };
}

export function welcomeMessage(): ChatMessage {
  return {
    id: makeId(),
    role: "tutor",
    text: "Hi — I'm your BioPharm Lab tutor. I'm a rule-based knowledge graph for the PCI BP203T syllabus (not a large language model), so I'm 100% accurate on what I know but limited to curriculum topics. Try one of the prompts below, or ask in your own words.",
    quickReplies: [
      "Explain Michaelis-Menten",
      "What is glycolysis?",
      "Difference between competitive and non-competitive inhibition",
      "Walk me through the central dogma",
      "How much ATP from one glucose?",
    ],
    at: new Date().toISOString(),
  };
}
