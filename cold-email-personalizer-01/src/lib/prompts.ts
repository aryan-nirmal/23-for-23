import type { GenerationInput } from "./types";

function toneGuide(tone: GenerationInput["tone"]): string {
  switch (tone) {
    case "casual":
      return "Write in a warm, conversational voice while staying professional.";
    case "startup-friendly":
      return "Write with crisp startup energy, clear value, and low fluff.";
    case "formal":
    default:
      return "Write in a polished, professional, concise voice.";
  }
}

export function buildColdEmailPrompt(input: GenerationInput, maxBodyWords: number): string {
  const prospectContext = input.prospectSnapshot
    ? [
        `Name: ${input.prospectSnapshot.fullName}`,
        `Headline: ${input.prospectSnapshot.headline}`,
        `Company: ${input.prospectSnapshot.company}`,
        `About: ${input.prospectSnapshot.about}`,
        `Experience highlights: ${input.prospectSnapshot.experienceHighlights?.join(" | ") || ""}`
      ].filter(Boolean).join("\n")
    : "";

  return [
    "You are writing a personalized outreach or reply email.",
    toneGuide(input.tone),
    `Keep the main email body under ${maxBodyWords} words.`,
    'Output strict valid JSON with keys: "subject", "body", "followUp", "rationale".',
    'Do not wrap response in markdown blocks.',
    "",
    prospectContext ? `Prospect Context:\n${prospectContext}\n` : "",
    `User Prompt & Context:\n${input.pitch}`,
    "",
    "Requirements:",
    "- Subject line must be short and relevant (under 8 words).",
    "- Body must be direct, human, and clear.",
    "- Return pure JSON object with subject and body keys."
  ].filter(Boolean).join("\n");
}

export function buildReplyPrompt(input: GenerationInput, maxBodyWords: number): string {
  return buildColdEmailPrompt(input, maxBodyWords);
}
