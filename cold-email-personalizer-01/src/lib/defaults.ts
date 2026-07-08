import type { Settings, StorageShape } from "./types";

export const defaultSettings: Settings = {
  provider: {
    providerName: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: "",
    model: "openai/gpt-4.1-mini"
  },
  defaultTone: "formal",
  defaultCta: "Would you be open to a short call next week?",
  maxBodyWords: 140
};

export const defaultStorage: StorageShape = {
  settings: defaultSettings,
  savedPitches: [],
  prospectHistory: [],
  gmailDraftHistory: []
};
