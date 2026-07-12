export type SleepPattern =
  | "sleep_onset_insomnia"
  | "circadian_misalignment"
  | "anxiety_driven"
  | "poor_hygiene"
  | "needs_clinical_review";

export type QuizAnswer = {
  questionId: string;
  value: string;
};

export type QuizAnswers = Record<string, string>;

export type ClassificationResult = {
  primaryPattern: SleepPattern;
  secondaryPatterns: SleepPattern[];
  redFlags: string[];
  confidence: "high" | "moderate" | "low";
  summary: string;
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  rationale: string;
  evidenceNote: string;
  priority: "primary" | "secondary";
  category: "behavioral" | "environmental" | "supplement" | "lifestyle";
};

export type DiaryEntry = {
  id: string;
  date: string;
  hoursSlept: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes: string;
  createdAt: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  description?: string;
  options: { value: string; label: string; score?: Partial<Record<SleepPattern, number>> }[];
  isRedFlag?: boolean;
};