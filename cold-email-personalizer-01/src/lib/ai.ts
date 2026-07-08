import { defaultSettings } from "./defaults";
import { buildColdEmailPrompt, buildReplyPrompt } from "./prompts";
import { compactText, truncateWords } from "./utils";
import type { EmailDraft, GenerationInput, Settings } from "./types";

interface OpenRouterMessage {
  role: "system" | "user";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

function parseDraft(content: string, maxBodyWords: number): EmailDraft {
  const jsonBlock = content.match(/\{[\s\S]*\}/);
  if (!jsonBlock) {
    throw new Error("The provider response did not contain valid JSON.");
  }

  const parsed = JSON.parse(jsonBlock[0]) as Partial<EmailDraft>;

  return {
    subject: compactText(parsed.subject || "Quick idea"),
    body: truncateWords(compactText(parsed.body || ""), maxBodyWords),
    followUp: compactText(parsed.followUp || ""),
    rationale: Array.isArray(parsed.rationale)
      ? parsed.rationale.map((item) => compactText(String(item))).filter(Boolean)
      : ["Personalization rationale was not provided by the model."]
  };
}

export async function generateDraft(
  input: GenerationInput,
  settings: Settings = defaultSettings
): Promise<EmailDraft> {
  const { provider, maxBodyWords } = settings;

  if (!provider.apiKey.trim()) {
    throw new Error("Add your API key in settings before generating drafts.");
  }

  const prompt =
    input.mode === "cold_email"
      ? buildColdEmailPrompt(input, maxBodyWords)
      : buildReplyPrompt(input, maxBodyWords);

  const messages: OpenRouterMessage[] = [
    {
      role: "system",
      content:
        "You write credible sales emails. Return only JSON and never wrap it in markdown fences."
    },
    {
      role: "user",
      content: prompt
    }
  ];

  const response = await fetch(provider.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
      "HTTP-Referer": "https://cold-email-personalizer.extension.local",
      "X-Title": "Cold Email Personalizer"
    },
    body: JSON.stringify({
      model: provider.model,
      messages,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Generation failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as OpenRouterResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("The provider returned an empty response.");
  }

  return parseDraft(content, maxBodyWords);
}
