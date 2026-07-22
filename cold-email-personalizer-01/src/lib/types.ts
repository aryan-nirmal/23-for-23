export type Tone = "formal" | "casual" | "startup-friendly";

export type ActivePageKind = "linkedin" | "gmail" | "unsupported";

export interface ProspectSnapshot {
  sourceUrl: string;
  fullName: string;
  headline: string;
  company: string;
  about: string;
  experienceHighlights: string[];
  certifications?: string[];
  education?: string[];
  skills?: string[];
  projects?: string[];
  rawBodyText?: string;
  userEdits?: Partial<ProspectSnapshot>;
}

export interface ThreadContext {
  threadUrl: string;
  participants: string[];
  latestMessage: string;
  quotedContext: string;
  replyGoal: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  followUp?: string;
  rationale: string[];
}

export interface GenerationInput {
  mode: "cold_email" | "gmail_reply";
  prospectSnapshot?: ProspectSnapshot;
  threadContext?: ThreadContext;
  pitch: string;
  cta?: string;
  tone: Tone;
}

export interface SavedPitch {
  id: string;
  name: string;
  pitch: string;
  targetPersona: string;
  cta: string;
  createdAt: string;
}

export interface ProspectHistoryItem {
  id: string;
  sourceUrl: string;
  snapshot: ProspectSnapshot;
  lastPitch: string;
  lastDraft: EmailDraft;
  createdAt: string;
}

export interface GmailDraftHistoryItem {
  id: string;
  threadUrl: string;
  context: ThreadContext;
  draft: EmailDraft;
  createdAt: string;
}

export interface ProviderSettings {
  providerName: string;
  endpoint: string;
  apiKey: string;
  model: string;
}

export interface Settings {
  provider: ProviderSettings;
  defaultTone: Tone;
  defaultCta: string;
  maxBodyWords: number;
}

export interface StorageShape {
  settings: Settings;
  savedPitches: SavedPitch[];
  prospectHistory: ProspectHistoryItem[];
  gmailDraftHistory: GmailDraftHistoryItem[];
}

export interface LinkedInExtractResponse {
  ok: boolean;
  snapshot?: ProspectSnapshot;
  reason?: string;
}

export interface GmailExtractResponse {
  ok: boolean;
  context?: ThreadContext;
  reason?: string;
}

export interface InsertDraftRequest {
  subject: string;
  body: string;
}

export interface InsertDraftResponse {
  ok: boolean;
  reason?: string;
}

export interface ActiveContext {
  page: ActivePageKind;
  url: string;
  title: string;
}
