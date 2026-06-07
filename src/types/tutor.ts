export type IntentKind =
  | "definition"
  | "comparison"
  | "list_steps"
  | "explain"
  | "give_example"
  | "clinical_correlation"
  | "calculation_help"
  | "out_of_scope"
  | "greeting"
  | "thanks";

export interface QAPair {
  id: string;
  intent: IntentKind;
  patterns: string[];
  question: string;
  answer: string;
  unitId?: string;
  topicId?: string;
  citationTopicIds?: string[];
  followUps?: string[];
}

export interface GlossaryTerm {
  term: string;
  aliases: string[];
  shortDef: string;
  unitId?: string;
  topicId?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "tutor";
  text: string;
  citations?: { label: string; href: string }[];
  quickReplies?: string[];
  matchConfidence?: number;
  matchedQAId?: string;
  at: string;
}

export interface ClassificationResult {
  layer: 1 | 2 | 3 | 0;
  confidence: number;
  qaId?: string;
  matchedTerms?: string[];
  suggestedTopics?: { topicId: string; label: string }[];
}
