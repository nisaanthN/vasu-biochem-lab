export type UnitId = "unit-1" | "unit-2" | "unit-3" | "unit-4" | "unit-5";

export interface SubTopic {
  id: string;
  title: string;
  blurb: string;
  estimatedMinutes: number;
  prerequisites: string[];
  learningObjectives: string[];
}

export interface Unit {
  id: UnitId;
  title: string;
  subtitle: string;
  syllabusHours: number;
  description: string;
  topics: SubTopic[];
}

export interface NoteFrontmatter {
  unit: UnitId;
  topicId: string;
  title: string;
  blurb: string;
  estimatedMinutes: number;
  xp: number;
  learningObjectives: string[];
  references?: string[];
  prerequisites?: string[];
}

export interface MCQ {
  id: string;
  unitId: UnitId;
  subTopicId: string;
  difficulty: "easy" | "medium" | "hard";
  bloom: "recall" | "apply" | "analyze";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  references?: string[];
}

export interface ExperimentMeta {
  slug: string;
  title: string;
  unitId: UnitId;
  subTopicId: string;
  objective: string;
  estimatedMinutes: number;
  xp: number;
  difficulty: "easy" | "medium" | "hard";
}
